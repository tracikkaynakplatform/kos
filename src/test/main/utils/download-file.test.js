import { downloadFile } from "../../../main/utils/download-file";
import * as fs from "fs";
import * as path from "path";

// Working directory.
const TESTDIR = "./.test_tmp";
const DOWNLOAD_LOCALPATH = path.join(TESTDIR, "bootstrap-components.yaml");
const DOWNLOAD_URL =
	"https://github.com/kubernetes-sigs/cluster-api/releases/download/v1.2.4/bootstrap-components.yaml";

// beforeAll(() => jest.setTimeout(90 * 1000))

test(`creating directory ${TESTDIR} for downloadFile tests`, () => {
	fs.rmdirSync(TESTDIR, { recursive: true, force: true });
	fs.mkdirSync(TESTDIR);
	// fs.existsSync(WD)
	expect(fs.existsSync(TESTDIR)).toBeTruthy();
	const stats = fs.lstatSync(TESTDIR);
	expect(stats.isDirectory()).toBeTruthy();
	expect(fs.readdirSync(TESTDIR).length).toBe(0);
});

test(`downloading a file to ${DOWNLOAD_LOCALPATH} via downloadFile`, async () => {
	expect(fs.existsSync(TESTDIR)).toBeTruthy();
	expect(fs.existsSync(`${DOWNLOAD_LOCALPATH}`)).toBeFalsy();

	const ret = await downloadFile(DOWNLOAD_URL, DOWNLOAD_LOCALPATH);
	expect(fs.existsSync(`${DOWNLOAD_LOCALPATH}`)).toBeTruthy();
});

test(`cleaning directory ${TESTDIR} for downloadFile tests`, () => {
	fs.rmdirSync(TESTDIR, { recursive: true, force: true });
	expect(fs.existsSync(TESTDIR)).toBeFalsy();
});
