<script lang="ts">
	import { letterMatrixStore } from '$lib/stores/letter';
	import type { Letter } from '$lib/types';
	import { size } from '$lib/utils/constants';
	import { generateGridFromCombo } from '$lib/utils/generateGrid';
	import Input from './Input.svelte';
	import Carret from './icons/Carret.svelte';

	export let moveFrom: (from: Letter, to: Letter) => void;

	let results: Letter[][][] = [];
	let hasSumbited = false;

	let letterCount = 2;
	let wordLen = 8;

	let combo = $letterMatrixStore
		.flat()
		.map((l) => l.letter)
		.join('');

	async function handleSubmit() {
		$letterMatrixStore = generateGridFromCombo(combo);
		letterMatrixStore.update((n) => n); // This forces the store to update its subscribers

		const response = await fetch('/api/words', {
			method: 'POST',
			body: JSON.stringify({
				combination: $letterMatrixStore
					.flat()
					.map((m) => m.letter)
					.join(''),
				wordLen
			})
		});

		const seenWords = new Set<string>();

		const data: { result: { col: number; row: number; letter: string }[][][] } =
			await response.json();
		results = data.result.map((m) =>
			m
				.map((e) => {
					const res = e.map((l) => $letterMatrixStore[l.row][l.col]);

					const word = res.map((m) => m.letter).join('');
					if (seenWords.has(word)) return;

					seenWords.add(word);

					return res;
				})
				.filter((el): el is Letter[] => Boolean(el))
		);

		console.log(seenWords);

		hasSumbited = true;
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
						on:click={() => (letterCount === 2 ? void 0 : letterCount--)}
						type="button"
						class="btn flex items-center justify-center absolute bg-gray-600 h-full w-[10%] cursor-pointer rounded-tl-[6px]"
					>
						<Carret className="fill-gray-100" />
					</button>
					<input
						type="number"
						min="2"
						max={wordLen}
						bind:value={letterCount}
						class="h-full w-full rounded-[7px] text-gray-950 text-center"
					/>
					<button
						on:click={() => (letterCount === wordLen ? void 0 : letterCount++)}
						type="button"
						class="btn flex items-center justify-center absolute right-0 top-0 bg-gray-600 h-full w-[10%] cursor-pointer rounded-tr-[6px]"
					>
						<Carret className="fill-gray-100 rotate-180" />
					</button>
				</div>

				{#if results[letterCount - 1]}
					<h2>{letterCount} Letter Words</h2>
					<div class="flex flex-wrap gap-3 max-h-[27rem] overflow-y-auto">
						{#each results[letterCount - 1] as word, wordIndex (word
							.map((letter) => letter.letter)
							.join('') + (letterCount - 1) + wordIndex)}
							<button
								type="button"
								style={`${
									results[letterCount - 1][wordIndex].find((m) => m.wordMulti)
										? 'background: red;'
										: ''
								}
									${results[letterCount - 1][wordIndex].find((m) => m.letterMulti > 1) ? 'background: blue;' : ''}
									`}
								class="bg-gray-300 p-3 rounded-md text-black"
								on:click={() => {
									results[letterCount - 1][wordIndex].reduce((prev, curr) => {
										moveFrom(prev, curr);
										return curr;
									});
								}}
							>
								{word.map((letter) => letter.letter).join('')}
							</button>
						{/each}
					</div>

					{#if results[letterCount - 1].length === 0}
						<p>welp no results for {letterCount}</p>
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
