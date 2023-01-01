/**
 * stdoutToJSON 📇
 * @description a naive tool useful for outputting stdout as JSON
 * @notes This is a naive tool, that does a decent job of outputting a stdout string as JSON
 * - The use-case of a such a tool initially is for testing cli scenarios 👌
 */
export const OBJECT_MATCHERS = [
    { value: " +", edit: "" },
    { value: " ", edit: "" },
    { value: "'", edit: '"' },
    { value: ":", edit: '":' },
    { value: "{", edit: '{"' },
    { value: ",", edit: ',"' },
    { value: '{"}', edit: '{}' }, // remove extra double quotes from empty JSON object
];
export const TRAILING_COMMAS_MATCHERS = [
    { value: ',"}', edit: "}" },
    { value: '",]', edit: '"]' },
    { value: '"},"]', edit: '"}]' },
    { value: '"},]', edit: '"}]' },
    { value: '},}', edit: '}}' },
    { value: '],"]', edit: ']]' },
    { value: '",}', edit: '"}' },
    { value: '","]', edit: '"]' }, // remove trailing comma from last string item in an array
];
export const BOOLEAN_MATCHERS = [
    { value: "true", edit: '"true"' },
    { value: "false", edit: '"false"' }, // wrap false for JSON parse capability
];
export const BROWSER_MATCHERS = [
    { value: 'https"', edit: "https" },
    { value: 'http"', edit: "http" }, // match http after initial pattern match
];
const EXTRA_QUOTES_MATCHERS = [{ value: '",""', edit: '","' }];
// merge matchers together
const INITIAL_MATCHERS = OBJECT_MATCHERS.concat(BOOLEAN_MATCHERS, BROWSER_MATCHERS, TRAILING_COMMAS_MATCHERS, EXTRA_QUOTES_MATCHERS);
/**
 * matcher
 * @description allows more configuration options
 * @param {str} string
 * @param {matchers} array
 * @returns {string}
 */
export function matcher(str, matchers = INITIAL_MATCHERS, debug = false) {
    const updatedMatchers = matchers === null ? INITIAL_MATCHERS : matchers;
    return updatedMatchers.reduce((updatedStr, { value, edit }) => {
        const update = updatedStr.replace(new RegExp(value, "g"), edit);
        if (debug)
            console.debug({ value, edit, update });
        return update;
    }, str);
}
/**
 * stdoutToJSON
 * @description turns stdout into a JSON object
 * @param {stdout} string
 * @param {matchers} array
 * @param {debug} string
 * @returns {object} a JSON object of unknown type
 */
export function stdoutToJSON(stdout, matchers, debug = false) {
    const jsonLikeString = stdout
        .split("\n") // remove new line chars => []
        .map((item) => item.trim()) // remove whitespace
        .filter((item) => item !== "") // filter empty array items
        .join(""); // return the modified string
    if (debug)
        console.debug({ jsonLikeString });
    // see the matcher instructions above for detail
    const stringifiedJSONForParsing = matcher(jsonLikeString, matchers, debug);
    // string => JSON
    if (debug)
        console.debug({ stringifiedJSONForParsing });
    // => JSON
    const isObject = ['{', '['].some(item => stringifiedJSONForParsing.includes(item));
    if (isObject) {
        const parsedJSON = JSON.parse(stringifiedJSONForParsing);
        if (debug)
            console.debug({ parsedJSON });
        return parsedJSON;
    }
    return stringifiedJSONForParsing;
}
export default stdoutToJSON;
