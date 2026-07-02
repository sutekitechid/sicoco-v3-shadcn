/**
 * Simple, dependency-free fuzzy substring matching with a small scoring
 * boost for whole-word / prefix hits.
 */

export interface FuzzyMatch<T> {
	item: T
	score: number
	matchedIndices: number[]
}

/**
 * Score `query` against `text` and return a non-negative number
 * (0 = no match). Higher is better.
 */
export function scoreMatch(query: string, text: string): { score: number; indices: number[] } {
	if (!query) return { score: 0, indices: [] }
	const q = query.toLowerCase()
	const t = text.toLowerCase()

	// Exact substring match.
	const idx = t.indexOf(q)
	if (idx >= 0) {
		const prefixBoost = idx === 0 ? 100 : 50
		const wholeWordBoost = t[idx + q.length] === undefined || /\W/.test(t[idx - 1] ?? '') ? 20 : 0
		return { score: 200 + prefixBoost + wholeWordBoost - idx, indices: spread(idx, q.length) }
	}

	// Subsequence match (all chars of q appear in t, in order).
	const indices = matchSubsequence(q, t)
	if (indices.length === q.length) {
		let score = 10
		// Bonus: tighter runs of consecutive characters are better.
		for (let i = 1; i < indices.length; i++) {
			const cur = indices[i]
			const prev = indices[i - 1]
			if (cur === undefined || prev === undefined) continue
			if (cur === prev + 1) score += 5
			else if (cur - prev <= 3) score += 2
		}
		// Penalty for large gap between first and last char.
		const first = indices[0]
		const last = indices[indices.length - 1]
		if (first !== undefined && last !== undefined) {
			score -= (last - first - q.length) * 0.1
		}
		return { score: Math.max(score, 0.1), indices }
	}

	return { score: 0, indices: [] }
}

function spread(start: number, length: number): number[] {
	return Array.from({ length }, (_, i) => start + i)
}

function matchSubsequence(q: string, t: string): number[] {
	const out: number[] = []
	let qi = 0
	let ti = 0
	while (qi < q.length && ti < t.length) {
		if (t[ti] === q[qi]) {
			out.push(ti)
			qi++
		}
		ti++
	}
	return out
}

/**
 * Rank a list of items by their `getText` representation. Items with a
 * score of 0 are filtered out, and the result is sorted descending by
 * score.
 */
export function fuzzySearch<T>(
	items: T[],
	query: string,
	getText: (item: T) => string,
): FuzzyMatch<T>[] {
	if (!query.trim()) return items.map((item) => ({ item, score: 1, matchedIndices: [] }))
	const out: FuzzyMatch<T>[] = []
	for (const item of items) {
		const { score, indices } = scoreMatch(query, getText(item))
		if (score > 0) out.push({ item, score, matchedIndices: indices })
	}
	out.sort((a, b) => b.score - a.score)
	return out
}
