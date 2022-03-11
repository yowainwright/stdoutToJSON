
/**
 * stdoutJson 🕸
 * @description a naive tool useful for outputting stdout as JSON
 * @notes This is a naive tool, that does a decent job of outputting a stdout string as JSON
 * - The use-case of a such a tool initially is for testing cli scenarios 👌
 */

/**
 * @note matches JSON-like shape of unknown values, etc
 */
export type WithWildcards<T> = T & { [key: string]: unknown }
/**
 * @note the Matcher shape
 * @param {value} string a string contain a regex pattern to match
 * @param {edit} string
 */
export type Matcher = {
  value: string;
  edit: string;
};

export const OBJECT_MATCHERS: Matcher[] = [
  { value: 's+', edit: '' }, // remove spaces
  { value: ':', edit: '":' } // add double quotes to end of a JSON object key
  { value: '{', edit: '{"' }, // add double quotes to the beginning of JSON object key
  { value: ',', edit: ',"' }, // add comma to wrap new data item
]

export const BOOLEAN_MATCHERS: Matcher[] = [
  { value: 'true', edit: '"true"' }, // wrap true for JSON parse capability
	{ value: 'false', edit: '"false"' }, // wrap false for JSON parse capability
];

export const BROWSER_MATCHERS: Matcher[] = [
  { value: 'https"', edit: 'https' }, // match https after initial pattern match
  { value: 'http"', edit: 'http' }, // match http after initial pattern match
];

const INITIAL_MATCHERS: Matcher[] = OBJECT_MATCHERS.concat.apply(BOOLEAN_MATCHERS, BROWSER_MATCHERS);

/**
 * matcher
 * @description allows more configuration options
 * @param {str} string
 * @param {matchers} array
 * @returns {string}
 */
export function matcher(str: string, matchers: Matcher[] = INITIAL_MATCHERS): string {
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
		.split('\n') // remove new line chars => []
		.map((item) => item.trim()) // remove whitespace
		.filter((item) => item !== '') // filter empty array items
		.join('') // return the modified string

  // see the matcher instructions above for detail
	const stringifiedJSONForParsing = matcher(jsonLikeString, matchers);

	const parsedJSON = JSON.parse(stringifiedJSONForParsing)
	return parsedJSON
}

export default stdoutJson
