import { Cluster } from "./Cluster";
import { Infrastructure } from "./Infrastructure";
import { Configuration } from "./ManagementClusterConfiguration";

export interface ManagementCluster {
	name: string;
	supportedInfrastructures: Infrastructure[];
	clusters: Cluster[];
	configuration: Configuration;
}
