import type { Actions, PageServerLoad  } from './$types';
import { store } from '$lib/store';
import { BeerOrder } from '$lib/models';

export const actions: Actions = {
	addOrder: async ({ request }) => {
		const data = await request.formData();
		const beerType = String(data.get('beerType'));
		const liters = Number(data.get('liters'));

		const session = store.openSession();

		await session.store<BeerOrder>(new BeerOrder(null, beerType, liters));
		await session.saveChanges();
	},
  deleteOrder: async ({ url }) => {
		const id = String(url.searchParams.get('id'));

		const session = store.openSession();

		await session.delete<BeerOrder>(id);
		await session.saveChanges();
	},
	toggleOrder: async ({ url }) => {
		const id = String(url.searchParams.get('id'));

		const session = store.openSession();

		const order = await session.load<BeerOrder>(id);
		if (!order) {
			throw new Error(`Order (${id}) not found`);
		}

		order.isDone = !order.isDone;
		await session.saveChanges();
	}

};

export const load: PageServerLoad = async () => {
	return {
		beerOrder: store
			.openSession()
			.query<BeerOrder>({ collection: 'BeerOrders' })
			.orderBy('createDate')
			.all()
			.then((data) => serializeNonPOJOs(data))
	};
};

function serializeNonPOJOs<T>(value: T): T {
	return JSON.parse(JSON.stringify(value));
}
