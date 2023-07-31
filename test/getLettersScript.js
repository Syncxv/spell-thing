function findInTree(tree, filter, { walkable = null, ignore = [] } = {}) {
	if (!tree || typeof tree !== 'object') {
		return null;
	}

	if (typeof filter === 'string') {
		if (Object.prototype.hasOwnProperty.call(tree, filter)) {
			return tree[filter];
		}

		return;
	} else if (filter(tree)) {
		return tree;
	}

	let returnValue = null;

	if (Array.isArray(tree)) {
		for (const value of tree) {
			returnValue = findInTree(value, filter, {
				walkable,
				ignore
			});

			if (returnValue) {
				return returnValue;
			}
		}
	} else {
		const walkables = !walkable ? Object.keys(tree) : walkable;

		for (const key of walkables) {
			if (!Object.prototype.hasOwnProperty.call(tree, key) || ignore.includes(key)) {
				continue;
			}

			returnValue = findInTree(tree[key], filter, {
				walkable,
				ignore
			});

			if (returnValue) {
				return returnValue;
			}
		}
	}

	return returnValue;
}

const findInPixiJsStage = (tree, filter) =>
	findInTree(tree, filter, {
		walkable: ['children', 'child']
	});

const sortLetters = (a, b) => {
	if (a.row < b.row) {
		return -1;
	} else if (a.row > b.row) {
		return 1;
	} else {
		if (a.collumn < b.collumn) {
			return -1;
		} else if (a.collumn > b.collumn) {
			return 1;
		} else {
			return 0;
		}
	}
};

let board = findInPixiJsStage(stage, (e) => e.board).board;
// findInPixiJsStage(stage, (e) => e.playerState)
let boardData = board.boardData;

const boardLetters = Object.values(boardData.getAllLetters())
	.sort(sortLetters)
	.map((m) => m.display)
	.join('');

let letterMulti = boardData.getAllLettersList().find((m) => m.hasMultiplier());

let wordMulti = boardData.wordMultiplierPosition != null && boardData.wordMultiplierPosition;

let data = {
	letterMulti: {
		...(letterMulti != null && {
			col: letterMulti.collumn,
			row: letterMulti.row,
			multi: letterMulti?.getLetterMultiplier()
		})
	},
	...(wordMulti && { wordMulti: { col: wordMulti.collumn, row: wordMulti.row } })
};

window.copy(`${boardLetters}|${JSON.stringify(data)}`);
