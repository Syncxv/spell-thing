import type { Letter } from '$lib/types';
import { generateRandomLetters } from '$lib/utils/generateGrid';
import { writable } from 'svelte/store';

const initialLetterMatrix: Letter[][] = generateRandomLetters();

export const letterMatrixStore = writable(initialLetterMatrix);
