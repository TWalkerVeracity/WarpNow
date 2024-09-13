import { persisted } from 'svelte-persisted-store';

export interface Instance {
	icon: string;
	title: string;
	href: string;
	color: string;
	id: string;
}

export const instanceStore = persisted<Instance[]>('instances', []);

export const addInstance = (instance: Instance) => {
	instanceStore.update((instances) => {
		return [...instances, instance];
	});
};

export const updateInstance = (id: string, updatedInstance: Instance) => {
	instanceStore.update((instances) => {
		return instances.map((instance) => (instance.id === id ? { ...updatedInstance, id } : instance));
	});
};

export const removeInstance = (id: string) => {
	instanceStore.update((instances) => instances.filter((instance) => instance.id !== id));
};
