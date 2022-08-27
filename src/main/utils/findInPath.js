import { env } from 'process';
import { existsSync } from 'fs';

/**
 * PATH çevre değişkeni içerisinde fileName isimli bir
 * dosya olup olmadığını bulur. Eğer dosya mevcut ise
 * yolu, aksi durumda ise undefined döndürü.
 * 
 * @param {string} fileName Dosya adı.
 * @returns {string} Dosyanın tam yolu.
 */
export default function findInPath(fileName) {
	let path = '';
	let paths = env.PATH?.split(':');
	if (!paths)
		return (undefined);
	for (let p of paths)
	{
		path = `${p}/${fileName}`;
		if (existsSync(path))
			return (path);
	}
	return (undefined);
}