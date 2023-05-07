import { createWriteStream } from "original-fs";
import { https } from "follow-redirects";

/**
 * Downloads `url` and saves it to path in `targetFile`
 * @param url			The url will download.
 * @param targetFile	Path of the file that will be saved.
 */
export async function downloadFile(url: string, savePath: string, maxDownloadRetries: number = 1): Promise<void> {
	let retryCount = 0;
	while (retryCount < maxDownloadRetries) {
		try {
			await new Promise((resolve, reject) => {
				const stream = createWriteStream(savePath);
				const request = https.get(url, (response) => {
					response.pipe(stream);
					request.on("error", (err) => reject(err));
					stream.on("error", (err) => reject(err));
					stream.on("finish", () => {
						stream.close();
						resolve(null);
					});
				});
			});
			return;
		} catch (err) {
			retryCount++;
			if (retryCount == maxDownloadRetries) {
				throw new Error(`Unable to download file: ${url}. Error: ${err}`);
			}
		}
	}
}
