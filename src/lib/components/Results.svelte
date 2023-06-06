<script lang="ts">
	import { letterMatrixStore } from '$lib/stores/letter';
	import type { Letter } from '$lib/types';
	import { size } from '$lib/utils/constants';
	import { generateGridFromCombo } from '$lib/utils/generateGrid';

	let results: Letter[][][] = [];
	let hasSumbited = false;

	let combo = $letterMatrixStore
		.flat()
		.map((l) => l.letter)
		.join('');

	async function handleSubmit() {
		if (combo.length != size * size) return console.error('invalid combo');
		$letterMatrixStore = generateGridFromCombo(combo);

		const response = await fetch('/api/words', {
			method: 'POST',
			body: JSON.stringify({
				combination: $letterMatrixStore
					.flat()
					.map((m) => m.letter)
					.join(''),
				wordLen: 5
			})
		});
		const data: { result: { col: number; row: number }[][][] } = await response.json();

		results = data.result.map((m) => m.map((e) => e.map((l) => $letterMatrixStore[l.col][l.row])));
		hasSumbited = true;
	}

	function newBoard() {
		hasSumbited = false;
	}

	$: {
		console.log(results);
	}
</script>

<div class="wrappe h-full w-full">
	{#if hasSumbited}
		<div class="res">
			<h1>results</h1>

			<button type="button" on:click={newBoard}>New Board</button>
		</div>
	{:else}
		<form
			class="flex flex-col justify-between items-start h-full px-8 pt-10"
			on:submit|preventDefault={handleSubmit}
		>
			<div class="content">
				<!-- https://www.material-tailwind.com/docs/html/input -->
				<div class="relative h-10 w-full min-w-[200px]">
					<input
						id="combo"
						class="peer h-full w-full rounded-[7px] border border-blue-gray-200 border-t-transparent bg-transparent px-3 py-2.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-pink-500 focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
						placeholder=" "
						bind:value={combo}
					/>
					<label
						for="combo"
						class="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight text-blue-gray-400 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-pink-500 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:border-pink-500 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:border-pink-500 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500"
					>
						Outlined
					</label>
				</div>
				<!-- <input type="text"  class="text-slate-950" /> -->
			</div>

			<button
				class="bg-purple-500 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-md"
				type="submit">Submit</button
			>
		</form>
	{/if}
</div>
