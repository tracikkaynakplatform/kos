import { platform } from "../../../../main/services/base/Platform";

test(`testing platform singleton/immutable`, () => {
	expect(platform.arch.length > 0).toBeTruthy();
	expect(platform.osFamily.length > 0).toBeTruthy();
	expect(() => {
		platform.arch = "unexpected-value-from-test!";
	}).toThrow();
});
