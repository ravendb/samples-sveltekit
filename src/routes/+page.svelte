<script lang="ts">
	import { enhance } from '$app/forms';
	const { data } = $props();
</script>

<main class="beer-order-page">
	<h1 class="title">Beer Order</h1>
	<form method="POST" action="?/addOrder" use:enhance class="add-form">
		<label>
			Type
			<input type="text" name="beerType" required />
		</label>
		<label>
			Liters
			<input type="number" name="liters" required min="1" />
		</label>
		<button class="add-button">Add order</button>
	</form>
	{#await data.beerOrder}
		<p>Loading...</p>
	{:then beerOrder}
		{#each beerOrder as order}
			<div class="order-item">
				<div>
					<form method="POST" use:enhance action="?/toggleOrder&id={order.id}">
						<button>
							<span class={`${order.isDone ? 'line-through' : ''}`}>
								{order.beerType}
							</span>
						</button>
					</form>
					<span class="liters-text">{order.liters} liters</span>
				</div>
				<form method="POST" use:enhance action="?/deleteOrder&id={order.id}">
					<button class="delete-button">Delete order</button>
				</form>
			</div>
		{/each}
	{:catch error}
		<p class="error">{error.message}</p>
	{/await}
</main>

<style>
	.beer-order-page {
		@apply mx-auto mt-8 w-96 rounded-md bg-gray-800 p-4 text-white;

		.title {
			@apply mb-4 text-center text-2xl font-bold;
		}

		.add-form {
			@apply flex flex-col gap-4;

			label {
				@apply flex flex-col;
			}

			input {
				@apply p-1 text-black;
			}

			.add-button {
				@apply w-full rounded-md bg-blue-500 p-2 transition-colors hover:bg-blue-600;
			}
		}

		.order-item {
			@apply mt-4 flex items-center justify-between rounded-md bg-gray-700 p-2 transition-colors hover:bg-gray-600;

			.liters-text {
				@apply text-gray-400;
			}

			.delete-button {
				@apply w-full rounded-md bg-red-500 p-2 transition-colors hover:bg-red-600;
			}
		}

		.error {
			@apply text-red-500;
		}
	}
</style>
