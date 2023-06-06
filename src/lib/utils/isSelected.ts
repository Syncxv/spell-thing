import type { Letter } from '$lib/types';

export function isSelected(selectedLetters: Letter[], letter: Letter) {
	return !!selectedLetters.flat().find((m) => m.id === letter.id);
}
