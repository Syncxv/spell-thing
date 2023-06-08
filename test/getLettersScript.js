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
// (e) => e.boardData sometimes returns an empty board :sus
const boardData = findInPixiJsStage(window.stage, (e) => e.children?.length === 25).parent
	.boardData;

const boardLetters = Object.values(boardData.getAllLetters())
	.sort(sortLetters)
	.map((m) => m.display)
	.join('');

const letterMulti = boardData.getAllLettersList().find((m) => m.hasMultiplier());

const wordMulti = boardData.wordMultiplierPosition != null && boardData.wordMultiplierPosition;

const data = {
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
