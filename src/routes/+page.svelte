<script lang="ts">
	import Line from '$lib/components/Line.svelte';
	import type { Letter } from '$lib/types';
	import { connectLetters, getConnectionPos } from '$lib/utils/connectLetters';
	import { generateRandomLetters } from '$lib/utils/generateRandomLetters';
	import { isAdjecent } from '$lib/utils/isAdjecent';
	import { isSelected } from '$lib/utils/isSelected';

	const selectedStyle = 'bg-white text-black';

	let letterMatrix = generateRandomLetters();
	let selectedLetters: Letter[] = [];

	let isMouseDown = false;

	function onMouseDown(e: MouseEvent) {
		isMouseDown = true;
		onMouseOver(e);
	}

	function onMouseUp() {
		isMouseDown = false;
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

		console.log(selectionType);
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

		const letter = letterMatrix.flat().find((m) => m.elem === e.target);
		if (!letter) return;

		pushLetter(letter);
	}

	$: {
		console.log(selectedLetters, letterMatrix);
	}
</script>

<div
	on:mousedown={onMouseDown}
	on:mouseup={onMouseUp}
	id={isMouseDown ? 'down' : 'not down'}
	class="hi flex items-center justify-center h-screen"
>
	<div class="flex items-center justify-center gap-4 w-1/2 aspect-square">
		{#each letterMatrix as letters}
			<div class="flex flex-col items-center justify-center gap-4 w-full h-full">
				{#each letters as letter}
					<div
						bind:this={letter.elem}
						on:mouseover={onMouseOver}
						on:focus={() => 'why'}
						id={`${letter.col},${letter.row}`}
						class={`letter relative  bg-primary-500 flex items-center justify-center h-full w-full rounded-md select-none hover:outline-[2px] hover:outline-double hover:outline-slate-300 ${
							isSelected(selectedLetters, letter) ? 'selected' : ''
						}`}
					>
						{letter.letter}
						{#if selectedLetters.length > 0 && isSelected(selectedLetters, letter)}
							<Line
								lineData={getConnectionPos(letter, selectedLetters[selectedLetters.length - 1])}
							/>
						{/if}
					</div>
				{/each}
			</div>
		{/each}
	</div>
</div>
