import { createWriteStream } from "fs";
import { get as _get } from "request";

/**
 * Downloads `url` and saves it to path in `targetFile`
 * @param	{String} url		The url will download.
 * @param	{String} targetFile	Path of the file that will be saved.
 * @throws						Throws error if cannot perform a request or unable to write file to disk.
 */
export async function downloadFile(url, targetFile) {
	return new Promise((resolve, reject) => {
		const stream = createWriteStream(targetFile);
		const request = _get(url);

		request.pipe(stream);
		request.on("error", (err) => reject(err));
		stream.on("error", (err) => reject(err));
		stream.on("finish", () => {
			stream.close();
			resolve();
		});
	});
}
