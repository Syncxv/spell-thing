<script lang="ts">
	import type { LinePos } from '$lib/utils/connectLetters';

	export let lineData: LinePos | undefined;
</script>

{#if lineData}
	<div
		style="
    position: absolute;
    width: {lineData.width + 1}px;
    height: 2px;
    transform: rotate({lineData.rotation}rad) translateX({lineData.width / 2}px) translateZ(-10px);
    background: red;
    
"
	/>
{/if}
