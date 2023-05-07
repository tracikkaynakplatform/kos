import { Version } from "./Version";

export interface MachineNode {
	name: string;
	count: number;
	instanceType: string;
	version: Version;
}
