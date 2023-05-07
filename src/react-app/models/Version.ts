export interface Version {
	major: number;
	minor: number;
	patch: number;
}

export function versionToString(version: Version) {
	return `v${version.major}.${version.minor}.${version.patch}`;
}
