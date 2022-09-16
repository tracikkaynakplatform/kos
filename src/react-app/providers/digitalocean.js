// TODO: "doctl compute region list" çıktısı buraya aktarılacak
export const regions = [
	{
		name: "New York - Datacenter 1 - NYC1",
		key: "nyc1",
	},
	/* {
		name: 'New York - Datacenter 2 - NYC2', // TODO: sınırlı kullanıcıya hizmet veriyor.
		key: 'nyc2'
	}, */
	{
		name: "New York - Datacenter 3 - NYC3",
		key: "nyc3",
	},
	{
		name: "Frankfurt - Datacenter 1 - FRA1",
		key: "fra1",
	},
	// TODO: kalan bölge seçenekleri de eklenecek.
];

// TODO: "doctl compute size list" çıktısı buraya aktarılacak
export const machineSizes = [
	{
		name: "s-1vcpu-512mb-10gb",
		type: "Basic",
		memory: "512 MB",
		vcpus: "1",
		disk: "10",
		priceMonth: "4.00",
		priceHourly: "0.005950",
	},
	{
		name: "s-1vcpu-1gb",
		type: "Basic",
		memory: "1024 MB",
		vcpus: "1",
		disk: "25",
		priceMonth: "6.00",
		priceHourly: "0.008930",
	},
];

// TODO: "doctl compute image list-user" çıktısı buraya aktarılacak
export const customImages = [
	{
		id: "115270572",
		name: "Cluster API Kubernetes v1.22.9 on Ubuntu 20.04",
		type: "snapshot",
		distribution: "Ubuntu",
	},
];

// TODO: "doctl kubernetes options version" çıktısı buraya aktarılacak
export const kubernetesVersions = [
	"1.23.9-do.0",
	"1.22.12-do.0",
	"1.21.14-do.1",
];

export default {
	regions,
	machineSizes,
	customImages,
	kubernetesVersions,
};
