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

	console.log(combination, wordLen, grid);

	const result = getAllCombinationsIterative(10, grid);

	console.log(result);

	return json({ hehe: true, result }, { status: 200 });
}

interface State {
	row: number;
	col: number;
	visited: boolean[][];
	combination: Letter[];
}

function getAllCombinationsIterative(desired: number, grid: Letter[][]): Letter[][] {
	const allCombinations: Letter[][] = [];
	const stack: State[] = [];

	for (let row = 0; row < size; row++) {
		for (let col = 0; col < size; col++) {
			const visited: boolean[][] = Array(size)
				.fill(false)
				.map(() => Array(size).fill(false));
			const combination: Letter[] = [grid[row][col]];
			visited[row][col] = true;
			stack.push({ row, col, visited, combination });

			while (stack.length > 0) {
				const currentState = stack.pop()!;
				const { row, col, visited, combination } = currentState;

				if (combination.length === desired) {
					const word = combination
						.map((s) => s.letter)
						.join('')
						.toLowerCase();
					if (cachedSet!.has(word)) {
						allCombinations.push(combination.slice());
					}
				} else {
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
							const newVisited = visited.map((row) => row.slice());
							newVisited[newRow][newCol] = true;
							const newCombination = combination.slice();
							newCombination.push(grid[newRow][newCol]);
							stack.push({
								row: newRow,
								col: newCol,
								visited: newVisited,
								combination: newCombination
							});
						}
					}
				}
			}
		}
	}

	return allCombinations;
}
