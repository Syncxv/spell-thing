<script lang="ts">
	import type { LinePos } from '$lib/utils/connectLetters';

	export let lineData: LinePos | undefined;
</script>

{#if lineData}
	<div
		style="width: {lineData.width}px;
    height: 2px;
    transform: rotate({lineData.rotation}rad);
    background: red;
    
"
		class="absolute"
	/>
{/if}
