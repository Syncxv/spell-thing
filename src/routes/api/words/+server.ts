import fs from 'node:fs/promises';
import { json } from '@sveltejs/kit';
import type { Letter } from '$lib/types.js';
import { directions, size } from '$lib/utils/constants.js';
import { generateGridFromCombo } from '$lib/utils/generateGrid.js';

let cachedSet: Set<string> | null = null;

export interface Paylod {
	combination: string;
	wordLen: number;
}
export async function POST({ request }) {
	const { combination, wordLen }: Paylod = await request.json();

	if (!combination || combination.length != size * size || !wordLen)
		return json({ error: 'invalid combo or wordlen' }, { status: 400 });

	if (!cachedSet) {
		console.log('READING FILE');
		const words = await fs.readFile('./wordlist.txt', 'utf8');
		cachedSet = new Set(words.split('\n').map((l) => l.replace(/[\r]/g, '').toLowerCase()));
	}

	const grid = generateGridFromCombo(combination);

	const result: Letter[][][] = [];
	for (let i = 1; i < wordLen + 1; ++i) {
		result.push(getCombo(i, grid, cachedSet));
	}

	return json(
		{
			hehe: true,
			result: result.map((l) =>
				l.map((word) => word.map(({ row, col, letter }) => ({ row, col, letter })))
			),
			bro: undefined
		},
		{ status: 200 }
	);
}

function getCombo(wordLen: number, grid: Letter[][], cachedSet: Set<string>) {
	const allCombinations: Letter[][] = [];

	const visited: boolean[][] = Array(size)
		.fill(false)
		.map(() => Array(size).fill(false));
	for (let row = 0; row < size; row++) {
		for (let col = 0; col < size; col++) {
			for (const combination of combinationsGenerator(
				row,
				col,
				wordLen,
				grid,
				cachedSet,
				visited
			)) {
				allCombinations.push(combination);
			}
		}
	}

	return allCombinations;
}

function* combinationsGenerator(
	row: number,
	col: number,
	desired: number,
	grid: Letter[][],
	validWordsSet: Set<string>,
	visited: boolean[][],
	combination: Letter[] = []
): Generator<Letter[]> {
	if (combination.length === desired) {
		const word = combination
			.map((s) => s.letter)
			.join('')
			.toLowerCase();
		if (validWordsSet.has(word)) {
			yield combination.slice();
		}
	} else {
		visited[row][col] = true;
		combination.push(grid[row][col]);

		for (const [dx, dy] of Object.values(directions)) {
			const newRow = row + dx;
			const newCol = col + dy;

			if (
				newRow >= 0 &&
				newRow < size &&
				newCol >= 0 &&
				newCol < size &&
				!visited[newRow][newCol]
			) {
				yield* combinationsGenerator(
					newRow,
					newCol,
					desired,
					grid,
					validWordsSet,
					visited,
					combination
				);
			}
		}

		visited[row][col] = false;
		combination.pop();
	}
}
