import { createWriteStream } from 'fs';
import { get as _get } from 'request';

export default async function downloadFile(url, targetFile) {
	return new Promise((resolve, reject) => {
		const stream = createWriteStream(targetFile);
		const request = _get(url);
		
		request.pipe(stream);
		request.on('error', (err) => reject(err));
		stream.on('error', (err) => reject(err));
		stream.on('finish', () => {
			stream.close();
			resolve(true);
		});
	});
}