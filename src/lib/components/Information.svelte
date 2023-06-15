<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import Github from './icons/Github.svelte';

	let dialog: HTMLDialogElement;

	function onBackDropClick(event: MouseEvent) {
		var rect = dialog.getBoundingClientRect();
		var isInDialog =
			rect.top <= event.clientY &&
			event.clientY <= rect.top + rect.height &&
			rect.left <= event.clientX &&
			event.clientX <= rect.left + rect.width;
		if (!isInDialog) {
			dialog.close();
		}
	}
	onMount(() => {
		dialog.addEventListener('click', onBackDropClick);
	});

	onDestroy(() => {
		dialog?.removeEventListener('click', onBackDropClick);
	});
</script>

<dialog class="bg-secondary-500 text-slate-200 rounded-lg w-[80vw] h-[80vh]" bind:this={dialog}>
	<div class="wrapey flex flex-col justify-between h-full m-4">
		<div class="content color-white">
			<section class="mb-8">
				<h2 class="text-xl font-bold">What is this?</h2>
				<p>
					This is a spell cast word finder / solver. input the grid and hit new board and it will
					show you all the possible words
				</p>

				<div class="flex gap-2 items-center mt-4">
					<Github />
					<a class="hover:underline" target="_blank" href="https://github.com/Syncxv/spell-thing"
						>source code</a
					>
				</div>
			</section>

			<section>
				<h2 class="text-xl font-bold">Use This Script to copy the grid easily</h2>

				<ol style="padding: revert;margin: revert;" class="list-decimal" type="1">
					<li>Open Discord</li>
					<li>Start Spell cast</li>
					<li>
						Open dev tools (ctrl + shift + i)
						<div class="note text-slate-950 text-sm">
							if this doesnt work go to the browser version of discord and open dev tools there
						</div>
					</li>
					<li>
						Go to to the consle tab and then change context to the spell cast iframe
						<img class="w-[20rem]" src="https://i.imgur.com/0lLVtuZ.png" alt="" />
					</li>
					<li>Then copy the script and paste then hit enter when the game has started</li>
				</ol>

				<button
					class="btn bg-blue-500 hover:bg-blue-900"
					on:click={async () =>
						navigator.clipboard.writeText(
							await (
								await fetch(
									'https://raw.githubusercontent.com/Syncxv/spell-thing/master/test/getLettersScript.js'
								)
							).text()
						)}
				>
					Copy Script
				</button>
			</section>
		</div>
		<form method="dialog">
			<button class="btn bg-secondary-560 hover:bg-secondary-900 mt-12 mb-6">OK</button>
		</form>
	</div>
</dialog>

<button
	on:click={() => {
		dialog.showModal();
	}}
	class="bruh center absolute bottom-7 right-7 w-8 h-8 bg-slate-200 text-slate-900 rounded-full"
>
	?
</button>
