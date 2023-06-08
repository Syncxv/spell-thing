import type { Data, Letter } from '$lib/types';
import { alphabet, size } from './constants';
import { jsonParse } from './jsonParse';
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
				col,
				letterMulti: 0,
				wordMulti: false
			};
		}
	}
	return tempGrid;
};

export const generateGridFromCombo = (combo: string) => {
	let realCombo = combo;
	let data: Data = {};
	const [comboo, dataStr] = combo.split('|');
	if (combo.length != size * size) {
		if (comboo.length !== size * size) throw Error('invalid combo size');
		realCombo = comboo;
		data = jsonParse(dataStr, {});
	}
	const tempGrid: Letter[][] = [];
	for (let row = 0; row < size; row++) {
		tempGrid[row] = [];
		for (let col = 0; col < size; col++) {
			const isLetterMultiRow =
				data.letterMulti && data.letterMulti?.row === row && data.letterMulti.col === col;
			const isWordMulti =
				data.wordMulti != null && data.wordMulti?.row === row && data.wordMulti.col === col;
			tempGrid[row][col] = {
				id: uuidv4(),
				letter: realCombo[row * 5 + col],
				row,
				col,
				letterMulti: isLetterMultiRow && data.letterMulti ? data.letterMulti.multi : 0,
				wordMulti: isWordMulti
			};
		}
	}
	return tempGrid;
};
