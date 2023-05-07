import { Version } from "./Version";

export interface MachineNode {
	name: string;
	count: number;
	version: Version;
	instanceType: string;
}
