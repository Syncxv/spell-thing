import type { Letter } from '$lib/types';
import { alphabet, size } from './constants';
import { uuidv4 } from './uuidv4';

export const generateRandomLetters = () => {
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

export const generateGridFromCombo = (combo: string) => {
	if (combo.length != size * size) throw Error('invalid combo length');
	const tempGrid: Letter[][] = [];
	for (let row = 0; row < size; row++) {
		tempGrid[row] = [];
		for (let col = 0; col < size; col++) {
			tempGrid[row][col] = {
				id: uuidv4(),
				letter: combo[col * 5 + row],
				row,
				col
			};
		}
	}
	return tempGrid;
};

export const generateGridFromComboClient = (combo: string, previousGrid: Letter[][]) => {
	if (combo.length != size * size) throw Error('invalid combo length');
	const tempGrid: Letter[][] = [];
	for (let row = 0; row < size; row++) {
		tempGrid[row] = [];
		for (let col = 0; col < size; col++) {
			const existingLetter = previousGrid[row]?.[col];
			if (existingLetter) {
				existingLetter.letter = combo[col * 5 + row];
				tempGrid[row][col] = existingLetter;
			} else {
				tempGrid[row][col] = {
					id: uuidv4(),
					letter: combo[col * 5 + row],
					row,
					col
				};
			}
		}
	}
	return tempGrid;
};
