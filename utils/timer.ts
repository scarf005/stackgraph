export const timer = <T>(name: string, fn: () => T) => {
	const start = performance.now()
	const result = fn()
	console.log(`${name} took ${Math.round(performance.now() - start)}ms`)
	return result
}
