import type { Letter } from '$lib/types';
import { alphabet } from './constants';
import { uuidv4 } from './uuidv4';

export const generateRandomLetters = (size = 5) => {
	const tempGrid: Letter[][] = [];
	for (let row = 0; row < size; row++) {
		tempGrid[row] = [];
		for (let col = 0; col < size; col++) {
			const randomLetter = alphabet[Math.floor(Math.random() * alphabet.length)];
			tempGrid[row][col] = {
				id: uuidv4(),
				letter: randomLetter,
				row,
				col
			};
		}
	}
	return tempGrid;
};
