<script lang="ts">
	import { letterMatrixStore } from '$lib/stores/letter';
	import type { Letter } from '$lib/types';
	import { generateGridFromCombo } from '$lib/utils/generateGrid';
	import Input from './Input.svelte';
	import Carret from './icons/Carret.svelte';
	import { Solver } from '$lib/Solver';

	export let moveFrom: (from: Letter, to: Letter) => void;

	interface Result {
		count: number;
		words: Letter[][];
	}

	let validWordsSet: Set<string>;

	let results: Result[] = [];
	let hasSumbited = false;

	let index = 1;
	let wordLen = 8;

	let combo = $letterMatrixStore
		.flat()
		.map((l) => l.letter)
		.join('');

	async function handleSubmit() {
		console.time('hi');
		$letterMatrixStore = generateGridFromCombo(combo);
		letterMatrixStore.update((n) => n); // This forces the store to update its subscribers

		if (!validWordsSet) {
			const words = await (await fetch('/wordlist.txt')).text();
			validWordsSet = new Set(words.split('\n').map((l) => l.replace(/[\r]/g, '').toLowerCase()));
		}

		const solver = new Solver({ grid: $letterMatrixStore, validWordsSet });
		const tempRes: Letter[][][] = [];
		for (let i = 1; i < wordLen + 1; ++i) {
			tempRes.push(solver.getCombinationsRecursive(i));
		}

		results = tempRes
			.map((m, i) => m.length && { count: i + 1, words: m })
			.filter(Boolean) as Result[];

		hasSumbited = true;
		console.timeEnd('hi');
	}

	function newBoard() {
		hasSumbited = false;
	}

	$: {
		console.log(results);
	}
</script>

<div class="results-options h-full w-full">
	{#if hasSumbited}
		<div class="flex flex-col items-start justify-between h-full px-8 pt-10">
			<div class="content w-full">
				<h1>results</h1>

				<div class="idkwhattocallthis relative h-10 w-full">
					<button
						on:click={() => (index === 1 ? void 0 : index--)}
						type="button"
						class="btn flex items-center justify-center absolute bg-gray-600 h-full w-[10%] cursor-pointer rounded-tl-[6px]"
					>
						<Carret className="fill-gray-100" />
					</button>
					<input
						type="number"
						min="2"
						max={wordLen}
						bind:value={results[index].count}
						class="h-full w-full rounded-[7px] text-gray-950 text-center"
					/>
					<button
						on:click={() => (index === wordLen || results.length - 1 === index ? void 0 : index++)}
						type="button"
						class="btn flex items-center justify-center absolute right-0 top-0 bg-gray-600 h-full w-[10%] cursor-pointer rounded-tr-[6px]"
					>
						<Carret className="fill-gray-100 rotate-180" />
					</button>
				</div>

				{#if results[index]}
					<h2>{index} Letter Words</h2>
					<div class="flex flex-wrap gap-3 max-h-[27rem] overflow-y-auto">
						{#each results[index].words as word, wordIndex (word
							.map((letter) => letter.letter)
							.join('') + index + wordIndex)}
							<button
								type="button"
								style={`${
									results[index].words[wordIndex].find((m) => m.wordMulti) ? 'background: red;' : ''
								}
									${results[index].words[wordIndex].find((m) => m.letterMulti > 1) ? 'background: blue;' : ''}
									`}
								class="bg-gray-300 p-3 rounded-md text-black"
								on:click={() => {
									results[index].words[wordIndex].reduce((prev, curr) => {
										moveFrom(prev, curr);
										return curr;
									});
								}}
							>
								{word.map((letter) => letter.letter).join('')}
							</button>
						{/each}
					</div>

					{#if results[index].words.length === 0}
						<p>welp no results for {index}</p>
					{/if}
				{/if}
			</div>

			<button
				type="button"
				class="bg-purple-500 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-md"
				on:click={newBoard}>New Board</button
			>
		</div>
	{:else}
		<form
			class="flex flex-col justify-between items-start h-full px-8 pt-10"
			on:submit|preventDefault={handleSubmit}
		>
			<div class="content w-full">
				<Input type="text" id="combo" label="Combo" bind:value={combo} />
				<Input
					type="number"
					min={1}
					max={15}
					id="wordLen"
					label="Max Word Length"
					wrapperClassName="mt-4"
					bind:value={wordLen}
				/>
			</div>

			<button
				class="bg-purple-500 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-md"
				type="submit">Submit</button
			>
		</form>
	{/if}
</div>
