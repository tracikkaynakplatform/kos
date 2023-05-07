export class Version {
	public major: number;
	public minor: number;
	public patch: number;

	constructor(major: number, minor: number, patch: number) {
		this.major = major;
		this.minor = minor;
		this.patch = patch;
	}

	static fromString(versionString: string): Version {
		const pieces = versionString.split(".");
		return new Version(+pieces[0].substring(1), +pieces[1], +pieces[2]);
	}

	toString() {
		return `v${this.major}.${this.minor}.${this.patch}`;
	}

	toPlainObject() {
		return {
			major: this.major,
			minor: this.minor,
			patch: this.patch,
		};
	}
}
