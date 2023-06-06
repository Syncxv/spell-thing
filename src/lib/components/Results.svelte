<script lang="ts">
	import { letterMatrixStore } from '$lib/stores/letter';
	import type { Letter } from '$lib/types';
	import { size } from '$lib/utils/constants';
	import { generateGridFromCombo } from '$lib/utils/generateGrid';
	import Input from './Input.svelte';
	import Carret from './icons/Carret.svelte';

	let results: Letter[][][] = [];
	let hasSumbited = false;

	let letterCount = 1;
	let wordLen = 5;

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
				wordLen
			})
		});
		const data: { result: { col: number; row: number }[][][] } = await response.json();
		// Convert each group of words to a string representation to check for uniqueness
		let uniqueResults = new Set<string>();

		data.result.forEach((wordGroup) => {
			// Use JSON.stringify to get a string representation of each word group
			const wordGroupString = JSON.stringify(
				wordGroup.map((word) => word.map((l) => $letterMatrixStore[l.col][l.row]))
			);

			// If this wordGroupString is not already in the Set, add it
			if (!uniqueResults.has(wordGroupString)) {
				uniqueResults.add(wordGroupString);
			}
		});

		// Convert the Set back to a three-dimensional array
		results = Array.from(uniqueResults).map((wordGroupString) => JSON.parse(wordGroupString));

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
						on:click={() => (letterCount === 1 ? void 0 : letterCount--)}
						type="button"
						class="btn flex items-center justify-center absolute bg-gray-600 h-full w-[10%] cursor-pointer rounded-tl-[6px]"
					>
						<Carret className="fill-gray-100" />
					</button>
					<input
						type="number"
						min="1"
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
					<ul class="flex flex-wrap gap-3 max-h-[27rem] overflow-y-auto">
						{#each results[letterCount - 1] as word, wordIndex (word
							.map((letter) => letter.letter)
							.join('') + (letterCount - 1) + wordIndex)}
							<li class="bg-gray-300 p-3 rounded-md text-black">
								{word.map((letter) => letter.letter).join('')}
							</li>
						{/each}
					</ul>

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
