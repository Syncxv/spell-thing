import fs from 'node:fs/promises';
import { json } from '@sveltejs/kit';
import type { Letter } from '$lib/types.js';
import { size } from '$lib/utils/constants.js';
import { generateGridFromCombo } from '$lib/utils/generateGrid.js';
import { Solver } from '$lib/Solver.js';

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

	const solver = new Solver({ grid, validWordsSet: cachedSet });

	const result: Letter[][][] = [];
	for (let i = 1; i < wordLen + 1; ++i) {
		result.push(solver.getAllCombinationsIterative(i));
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
