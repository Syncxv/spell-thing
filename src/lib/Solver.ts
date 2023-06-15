import type { Letter } from './types';
import { directions, size } from './utils/constants';
import { Trie } from './utils/Trie';

interface Props {
	grid: Letter[][];
	validWordsSet: Set<string>;
}
export class Solver {
	grid: Letter[][];
	size: number;
	validWordsSet: Set<string>;
	validWordsTrie: Trie<string>;

	constructor({ grid, validWordsSet }: Props) {
		this.grid = grid;
		this.size = size;
		this.validWordsSet = validWordsSet;

		this.validWordsTrie = new Trie<string>();

		for (const word of validWordsSet) {
			this.validWordsTrie.insert(word.toLowerCase(), word);
		}
	}

	getAllCombinations(
		row: number,
		col: number,
		visited: boolean[][],
		combination: Letter[],
		allCombinations: Letter[][],
		desired: number
	) {
		if (row < 0 || row >= this.size || col < 0 || col >= this.size || visited[row][col]) {
			return;
		}

		visited[row][col] = true;

		// add the letter at this cell to the combination
		combination.push(this.grid[row][col]);

		const word = combination
			.map((s) => s.letter ?? s.display)
			.join('')
			.toLowerCase();

		// if the combination is of the desired length, add it to the allCombinations list
		if (combination.length === desired) {
			const results = this.validWordsTrie.search(word);
			if (results[0] === word) {
				allCombinations.push(combination.slice());
			}
		} else {
			if (!this.validWordsTrie.startsWith(word)) {
				combination.pop();
				visited[row][col] = false;
				return;
			}
			for (const [dx, dy] of Object.values(directions)) {
				this.getAllCombinations(row + dx, col + dy, visited, combination, allCombinations, desired);
			}
		}

		combination.pop();
		visited[row][col] = false;
	}

	getCombinationsRecursive(n = 4) {
		const allCombinations: Letter[][] = [];
		const combination: Letter[] = [];
		const visited = Array(this.size)
			.fill(false)
			.map(() => Array<boolean>(this.size).fill(false));

		// start the recursive process from each cell in the grid
		for (let row = 0; row < this.size; row++) {
			for (let col = 0; col < this.size; col++) {
				this.getAllCombinations(row, col, visited, combination, allCombinations, n);
			}
		}

		return allCombinations;
	}
}
