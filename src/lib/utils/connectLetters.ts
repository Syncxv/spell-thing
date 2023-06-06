import type { Letter } from '$lib/types';

export interface LinePos {
	rotation: number;
	width: number;
	startLetterPosition: {
		x: number;
		y: number;
	};
}

export function getConnectionPos(startLetter: Letter, endLetter: Letter): LinePos | undefined {
	if (!startLetter.elem || !endLetter.elem) return;

	const startBox = startLetter.elem.getBoundingClientRect();
	const startLetterPosition = { x: startBox.left, y: startBox.top };

	const endBox = endLetter.elem.getBoundingClientRect();
	const endLetterPosition = { x: endBox.left, y: endBox.top };

	const directionVector = subtractVectors(startLetterPosition, endLetterPosition);
	const unitDirectionVector = normalizeVector(directionVector);
	const rotation = calculateRotation(unitDirectionVector);

	const width = getMagnitude(startLetterPosition, endLetterPosition);

	return {
		rotation,
		width,
		startLetterPosition
	};
}

interface Vec2 {
	x: number;
	y: number;
}

export function subtractVectors(v1: Vec2, v2: Vec2): Vec2 {
	return { x: v2.x - v1.x, y: v2.y - v1.y };
}

export function normalizeVector(v: Vec2): Vec2 {
	const magnitude = Math.sqrt(v.x * v.x + v.y * v.y);
	return { x: v.x / magnitude, y: v.y / magnitude };
}

export function calculateRotation(v: Vec2): number {
	return Math.atan2(v.y, v.x);
}

export function getMagnitude(p1: Vec2, p2: Vec2): number {
	const xDiff = p2.x - p1.x;
	const yDiff = p2.y - p1.y;
	return Math.sqrt(xDiff * xDiff + yDiff * yDiff);
}
