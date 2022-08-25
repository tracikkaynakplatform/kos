import { existsSync, mkdirSync, createWriteStream, chmodSync } from 'fs';
import { env, cwd, platform } from 'process';
import { get as _get } from 'request';
import cp from 'child_process';
import logger from '../logger';

/**
 * Kullanılabilir bir kubectl aracının olup olmadığını döndürür.
 * 
 * @return {boolean}
 */
export function check() {
	return (!!getPath());
}

/**
 * Kullanılabilecek kubectl çalıştırılaiblir dosyasının yolunu
 * döndürür.
 * 
 * @return {string}
 */
export function getPath() {
	// TODO: kubectl konumu yapılandırma olarak saklanacak.
	let path = '';
	let paths = env.PATH?.split(':');
	for (let p of paths)
	{
		path = `${p}/kubectl`;
		if (existsSync(path))
			return (path);
	}
	path = `${cwd()}/bin/kubectl`;
	if (existsSync(path))
		return (path);
	return (undefined);
}

/**
 * kubectl yayınlanmış son sürüm numarasını dönderir.
 * 
 * @return {Promise<string>}
 */
export async function latestVersion() {
	return await new Promise((resolve, reject) => {
		_get('https://dl.k8s.io/release/stable.txt', function (error, response, body) {
			if (!error && response.statusCode == 200)
				resolve(body);
			throw error;
		});
	});
}

/**
 * Son sürüm kubectl'i indirir ve ./bin/kubectl dizinine kayıt eder.
 * İndirme başarılı ise true diğer durumlarda false döndürür.
 * 
 * @return {Promise<boolean>}
 */
export async function download() {
	return await new Promise(async (resolve, reject) => {
		let rootPath = `${cwd()}/bin`;
		let targetFile = `${rootPath}/kubectl`; // TODO: uygulama dizinini bulan bir fonksiyon yazılacak.
		let version = await latestVersion();
		let url;
		
		if (!existsSync(rootPath))
			mkdirSync(rootPath);
		switch (platform) {
			case 'linux':
			case 'darwin':
				url = `https://dl.k8s.io/release/${version}/bin/${platform}/amd64/kubectl`;
				break;
			case 'win32':
				url = `https://dl.k8s.io/release/${version}/bin/windows/amd64/kubectl.exe`;
				break;
		}
		const stream = createWriteStream(targetFile);
		const request = _get(url);

		stream.on('finish', () => {
			chmodSync(targetFile, 0o777);
			resolve(true)
		});
		request.on('error', (err) => { throw err; });
		stream.on('error', (err) => { throw err; });
		request.pipe(stream);
	});
}

export default {
	download,
	check,
	getPath,
	latestVersion
}