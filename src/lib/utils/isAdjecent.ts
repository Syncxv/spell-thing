import type { Letter } from '$lib/types';

export function isAdjecent(a: Letter, b: Letter) {
	return Math.abs(a.col - b.col) <= 1 && Math.abs(a.row - b.row) <= 1;
}
