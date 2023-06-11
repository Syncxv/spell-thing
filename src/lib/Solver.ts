import type { Letter } from './types';
import { Trie } from './utils/Trie';
import { directions, size } from './utils/constants';

interface State {
	row: number;
	col: number;
	visited: boolean[][];
	combination: Letter[];
}
interface Props {
	grid: Letter[][];
	validWordsSet: Set<string>;
}
export class Solver {
	grid: Letter[][];
	size: number;
	validWordsSet: Set<string>;
	validWordsTrie: Trie<boolean>;

	constructor({ grid, validWordsSet }: Props) {
		this.grid = grid;
		this.size = size;
		this.validWordsSet = validWordsSet;

		this.validWordsTrie = new Trie<boolean>();

		for (const word of validWordsSet) {
			this.validWordsTrie.insert(word, true);
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
		// if the combination is of the desired length, add it to the allCombinations list
		if (combination.length === desired) {
			const word = combination
				.map((s) => s.letter)
				.join('')
				.toLowerCase();
			if (this.validWordsTrie.contains(word)) {
				allCombinations.push(combination.slice());
			}
		} else {
			for (const [dx, dy] of Object.values(directions)) {
				this.getAllCombinations(row + dx, col + dy, visited, combination, allCombinations, desired);
			}
		}

		combination.pop();
		visited[row][col] = false;
	}

	getAllCombinationsIterative(desired: number): Letter[][] {
		const allCombinations: Letter[][] = [];
		const stack: State[] = [];

		for (let row = 0; row < this.size; row++) {
			for (let col = 0; col < this.size; col++) {
				const visited: boolean[][] = Array(this.size)
					.fill(false)
					.map(() => Array(this.size).fill(false));
				const combination: Letter[] = [this.grid[row][col]];
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
						if (this.validWordsSet.has(word)) {
							allCombinations.push(combination.slice());
						}
					} else {
						for (const [dx, dy] of Object.values(directions)) {
							const newRow = row + dx;
							const newCol = col + dy;

							if (
								newRow >= 0 &&
								newRow < this.size &&
								newCol >= 0 &&
								newCol < this.size &&
								!visited[newRow][newCol]
							) {
								const newVisited = visited.map((row) => row.slice());
								newVisited[newRow][newCol] = true;
								const newCombination = combination.slice();
								newCombination.push(this.grid[newRow][newCol]);
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

	getCombinationsRecursive(n = 4) {
		const allCombinations: Letter[][] = [];
		const combination: Letter[] = [];
		const visited = Array(this.size)
			.fill(false)
			.map(() => Array(this.size).fill(false));

		// start the recursive process from each cell in the grid
		for (let row = 0; row < this.size; row++) {
			for (let col = 0; col < this.size; col++) {
				this.getAllCombinations(row, col, visited, combination, allCombinations, n);
			}
		}

		return allCombinations;
	}

	getCombinationsIterative(n = 4) {
		return this.getAllCombinationsIterative(n);
	}

	getWords(arr: Letter[][]) {
		const result: string[] = [];

		for (let i = 0; i < arr.length; i++) {
			const word = arr[i]
				.map((s) => s.letter)
				.join('')
				.toLowerCase();
			if (this.validWordsTrie.contains(word)) {
				result.push(word);
			}
		}

		return result;
	}
}
