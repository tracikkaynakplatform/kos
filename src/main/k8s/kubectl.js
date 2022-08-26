import { existsSync, mkdirSync, chmodSync } from 'fs';
import { cwd, platform } from 'process';
import { get as _get } from 'request';
import downloadFile from '../utils/downloadFile';
import findInPath from '../utils/findInPath';

/**
 * Kullanılabilir bir kubectl aracının olup olmadığını döndürür.
 * 
 * @return {boolean}
 */
export function check() {
	return (!!getPath());
}

/**
 * Kullanılabilecek kubectl çalıştırılabilir dosyasının yolunu
 * döndürür.
 * 
 * @return {string}
 */
export function getPath() {
	let path = findInPath('kubectl');
	if (path)
		return (path);
	path = `${cwd()}/bin/kubectl`; // TODO: kubectl konumu yapılandırma olarak saklanacak.
	if (existsSync(path))
		return (path);
	return (undefined);
}

/**
 * kubectl yayınlanmış son sürüm numarasını dönderir.
 * 
 * @return {Promise<string>}
 */
export function latestVersion() {
	return new Promise((resolve, reject) => {
		_get('https://dl.k8s.io/release/stable.txt', function (error, response, body) {
			if (!error && response.statusCode == 200)
				resolve(body);
			reject(error);
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
	if (await downloadFile(url, targetFile))
	{
		chmodSync(targetFile, 0o777);
		// TODO: kubectl dosyasını doğrula
		return (true);
	}
	return (false);
}

export default {
	download,
	check,
	getPath,
	latestVersion
}