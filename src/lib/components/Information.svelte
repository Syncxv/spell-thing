<script lang="ts">
	let open = false;
	let dialog: HTMLDialogElement;
</script>

<dialog class="bg-secondary-500 rounded-lg w-[80vw] h-[80vh]" bind:this={dialog}>
	<div class="wrapey flex flex-col justify-between h-full">
		<div class="content color-white">
			<p>hey</p>
		</div>
		<form method="dialog">
			<button class="btn">OK</button>
		</form>
	</div>
</dialog>

<button
	on:click={() => dialog.showModal()}
	class="bruh center absolute bottom-7 right-7 w-8 h-8 bg-slate-200 text-slate-900 rounded-full"
>
	?
</button>
