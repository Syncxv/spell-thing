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
	const rowCompare = a.row - b.row;
	const colCompare = a.column - b.column;
	return rowCompare !== 0 ? rowCompare : colCompare;
};

// (e) => e.boardData sometimes returns an empty board :sus
const boardData = findInPixiJsStage(window.stage, (e) => e.children?.length === 25).parent
	.boardData;

const boardLetters = Object.values(boardData.getAllLetters())
	.sort(sortLetters)
	.map((m) => m.display)
	.join('');

const letterMulti = boardData.getAllLettersList().find((m) => m.hasMultiplier());

const wordMulti =
	boardData.wordMultiplierPosition != null && Object.values(boardData.wordMultiplierPosition);

const data = {
	letterMulti: {
		col: letterMulti?.column,
		row: letterMulti?.row,
		multi: letterMulti?.getLetterMultiplier()
	},
	...(wordMulti && { wordMulti: { col: wordMulti.column, row: wordMulti.row } })
};

window.copy(`${boardLetters},${JSON.stringify(data)}`);
