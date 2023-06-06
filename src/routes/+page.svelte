<script lang="ts">
	import Line from '$lib/components/Line.svelte';
	import Results from '$lib/components/Results.svelte';
	import { letterMatrixStore } from '$lib/stores/letter';
	import type { Letter } from '$lib/types';
	import { connectLetters, getConnectionPos } from '$lib/utils/connectLetters';
	import { generateGridFromCombo, generateRandomLetters } from '$lib/utils/generateGrid';
	import { isAdjecent } from '$lib/utils/isAdjecent';
	import { isSelected } from '$lib/utils/isSelected';

	let selectedLetters: Letter[] = [];

	let isMouseDown = false;

	function onMouseDown(e: MouseEvent) {
		isMouseDown = true;
		onMouseOver(e);
	}

	function onMouseUp() {
		isMouseDown = false;
		selectedLetters = [];
	}

	function pushLetter(letter: Letter) {
		if (!letter.elem) return;
		if (
			selectedLetters.length > 0 &&
			!isAdjecent(letter, selectedLetters[selectedLetters.length - 1])
		) {
			console.log('is not adjacent so removing all selected layers ong');
			selectedLetters = [];
		}

		for (var selectionType = -1, o = 0; o < selectedLetters.length; o++)
			if (selectedLetters[o].id === letter.id) {
				selectionType = o;
				break;
			}

		// console.log(selectionType);
		// -1 means select letter XD
		if (selectionType === -1) {
			// selectedLetters.length > 0 &&
			// 	connectLetters(selectedLetters[selectedLetters.length - 1], letter, 'red');
			selectedLetters.push(letter);
			selectedLetters = selectedLetters;
		}
		// deselect layer XD
		else if (selectionType === selectedLetters.length - 2) {
			console.log('deselecting letter');
			selectedLetters.pop();
			selectedLetters = selectedLetters;
		}
	}

	function onMouseOver(e: MouseEvent) {
		if (!isMouseDown) return;

		const letter = $letterMatrixStore.flat().find((m) => m.elem === e.target);
		if (!letter) return;

		pushLetter(letter);
	}

	$: {
		if (typeof window != 'undefined') {
			(window as any).$letterMatrixStore = $letterMatrixStore;
		}
		console.log(selectedLetters);
	}
</script>

<div
	on:mousedown={onMouseDown}
	on:mouseup={onMouseUp}
	id={isMouseDown ? 'down' : 'not down'}
	style="grid-template-columns: repeat(auto-fit, minmax(24rem, 1fr));"
	class="hi grid items-center justify-center p-7 h-fit"
>
	<div class="flex flex-col items-center w-full">
		<h1 class="mb-4">{selectedLetters.map((m) => m.letter).join('') || "g'day"}</h1>
		<div
			style="transform-style: preserve-3d;transform: translateZ(10px);"
			class="flex items-center justify-center gap-4 w-full aspect-square"
		>
			{#each $letterMatrixStore as letters}
				<div
					style="transform-style: preserve-3d;transform: translateZ(10px);"
					class="flex flex-col items-center justify-center gap-4 w-full h-full"
				>
					{#each letters as letter}
						<div
							bind:this={letter.elem}
							on:mouseover={onMouseOver}
							on:focus={() => 'why'}
							id={`${letter.col},${letter.row}`}
							style="transform-style: preserve-3d;"
							class={`letter relative z-10 bg-primary-500 flex items-center justify-center h-full w-full rounded-md select-none hover:outline-[2px] hover:outline-double hover:outline-slate-300 ${
								isSelected(selectedLetters, letter) ? 'selected' : ''
							}`}
						>
							{letter.letter}
							{#if selectedLetters.length > 0 && isSelected(selectedLetters, letter) && selectedLetters[selectedLetters.length - 1].id !== letter.id}
								<Line
									lineData={getConnectionPos(
										letter,
										selectedLetters[selectedLetters.map((m) => m.id).indexOf(letter.id) + 1]
									)}
								/>
							{/if}
						</div>
					{/each}
				</div>
			{/each}
		</div>
	</div>

	<Results />
</div>
