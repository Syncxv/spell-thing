import type { Letter } from '$lib/types';

export function connectLetters(startLetter: Letter, endLetter: Letter, linkColor: string) {
	if (!startLetter.elem || !endLetter.elem) return;

	const startLetterPosition = {
		x: startLetter.elem.offsetLeft + startLetter.elem.offsetWidth / 2,
		y: startLetter.elem.offsetTop + startLetter.elem.offsetHeight / 2
	};
	const endLetterPosition = {
		x: endLetter.elem.offsetLeft + endLetter.elem.offsetWidth / 2,
		y: endLetter.elem.offsetTop + endLetter.elem.offsetHeight / 2
	};

	const directionVector = subtractVectors(startLetterPosition, endLetterPosition);
	const unitDirectionVector = normalizeVector(directionVector);
	const rotation = calculateRotation(unitDirectionVector);

	const linkDiv = document.createElement('div');
	linkDiv.style.position = 'absolute';
	linkDiv.style.width = `${getMagnitude(startLetterPosition, endLetterPosition)}px`;
	linkDiv.style.height = '2px';
	linkDiv.style.transformOrigin = '0% 50%';
	linkDiv.style.transform = `rotate(${rotation}rad)`;
	linkDiv.style.left = `${startLetterPosition.x}px`;
	linkDiv.style.top = `${startLetterPosition.y}px`;
	linkDiv.style.background = linkColor;
	linkDiv.style.zIndex = '0';
	linkDiv.id = 'bruh-link';
	document.body.appendChild(linkDiv);
}

export function subtractVectors(
	v1: { x: number; y: number },
	v2: { x: number; y: number }
): { x: number; y: number } {
	return { x: v2.x - v1.x, y: v2.y - v1.y };
}

export function normalizeVector(v: { x: number; y: number }): { x: number; y: number } {
	const magnitude = Math.sqrt(v.x * v.x + v.y * v.y);
	return { x: v.x / magnitude, y: v.y / magnitude };
}

export function calculateRotation(v: { x: number; y: number }): number {
	return Math.atan2(v.y, v.x);
}

export function getMagnitude(p1: { x: number; y: number }, p2: { x: number; y: number }): number {
	const xDiff = p2.x - p1.x;
	const yDiff = p2.y - p1.y;
	return Math.sqrt(xDiff * xDiff + yDiff * yDiff);
}
