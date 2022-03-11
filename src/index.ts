export type WithWildcards<T> = T & { [key: string]: unknown }
export type Matcher = { [key: string]: string }

/**
 * executeMatcher
 * @desicription allows more configuration options
 * @param {str} string
 * @param {matchers} array
 * @returns {string}
 */
export function executeMatcher(str, matchers: Matcher[]): string {
	return matchers.reduce(
		(updatedStr, { value, edit }) =>
			updatedStr.replace(new RegExp(value, 'g'), edit),
		str,
	)
}

/**
 * stdoutJson
 * @description turns stdout into a JSON object
 * @param {stdout} string
 * @param {matchers} array
 * @returns {object} a JSON object of unknown type
 */
export function stdoutJson(
	stdout: string,
	matchers?: Matcher[],
): WithWildcards<unknown> {
	const jsonLikeString = stdout
		.split('\n')
		.map((item) => item.trim())
		.filter((item) => item !== '')
		.join('')
		.replace(/\s+/g, '')
		.replace(/'/g, '"')

	const stringifiedJSONForParsing = jsonLikeString
		.replace(/{/g, '{"')
		.replace(/:/g, '":')
		.replace(/,/g, ',"')

	const stringifiedJSONWithCommonMatchers = stringifiedJSONForParsing
		.replace(/true/g, '"true"')
		.replace(/false/g, '"false"')
		.replace(/https"/g, 'https')

	const stringifiedJSON =
		matchers.length >= 1
			? executeMatcher(stringifiedJSONWithCommonMatchers, matchers)
			: stringifiedJSONWithCommonMatchers

	const parsedJSON = JSON.parse(stringifiedJSON)
	return parsedJSON
}

export default stdoutJson
