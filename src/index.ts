import JSON5 from "json5";
/**
 * stdoutToJSON 📇
 * @description a naive tool useful for outputting stdout as JSON
 * @notes This is a naive tool, that does a decent job of outputting a stdout string as JSON
 * - The use-case of a such a tool initially is for testing cli scenarios 👌
 */

/**
 * @description matches a JSON-like shape of unknown keys and values
 */
export type WithWildcards<T> = T & { [key: string]: WithWildcards<T> };

/**
 * @description the Matcher shape matches a regex input string and expected output string, useful `String.prototype.replace`
 * @param {value} string a string contain a regex pattern to match
 * @param {edit} string
 */
export type Matcher = {
  value: string | RegExp;
  edit: string;
};

export const OBJECT_MATCHERS: Matcher[] = [
  { value: " +", edit: "" }, // remove +
  { value: " ", edit: "" }, // remove ' '
  { value: "'", edit: '"' }, // replace ' with "
  { value: ":", edit: '":' }, // add double quotes to end of a JSON object key
  { value: "{", edit: '{"' }, // add double quotes to the beginning of JSON object key
  { value: ",", edit: ',"' }, // add comma to wrap new data item
  { value: '{"}', edit: '{}' }, // remove extra double quotes from empty JSON object
];

export const TRAILING_COMMAS_MATCHERS: Matcher[] = [
  { value: ',"}', edit: "}" }, // remove trailing comma from weirdly closed object
  { value: '",]', edit: '"]' }, // remove trailing comma from last string item in an array
  { value: '"},"]', edit: '"}]' }, // remove trailing comma from last array of objects
  { value: '"},]', edit: '"}]' }, // remove trailing comma from last object in an array of objects
  { value: '},}', edit: '}}' }, // remove trailing comma from last object in an object
  { value: '],"]', edit: ']]' },
  { value: '",}', edit: '"}' }, // remove trailing comma from last property in an object
  { value: '","]', edit: '"]' }, // remove trailing comma from last string item in an array
];

export const BOOLEAN_MATCHERS: Matcher[] = [
  { value: "true", edit: '"true"' }, // wrap true for JSON parse capability
  { value: "false", edit: '"false"' }, // wrap false for JSON parse capability
];

export const BROWSER_MATCHERS: Matcher[] = [
  { value: 'https"', edit: "https" }, // match https after initial pattern match
  { value: 'http"', edit: "http" }, // match http after initial pattern match
];

const EXTRA_QUOTES_MATCHERS: Matcher[] = [{ value: '",""', edit: '","' }];

// merge matchers together
const INITIAL_MATCHERS: Matcher[] = OBJECT_MATCHERS.concat(
  BOOLEAN_MATCHERS,
  BROWSER_MATCHERS,
  TRAILING_COMMAS_MATCHERS,
  EXTRA_QUOTES_MATCHERS
);

/**
 * matcher
 * @description allows more configuration options
 * @param {str} string
 * @param {matchers} array
 * @returns {string}
 */
export function matcher(
  str: string,
  matchers: Matcher[] | null = INITIAL_MATCHERS,
  debug = false
): string {
  const updatedMatchers = matchers === null ? INITIAL_MATCHERS : matchers;
  return updatedMatchers.reduce(
    (updatedStr, { value, edit }) => {
      const update = updatedStr.replace(new RegExp(value, "g"), edit);
      if (debug) console.debug({ value, edit, update });
      return update;
    },
    str
  );
}

/**
 * stdoutToJSON
 * @description turns stdout into a JSON object
 * @param {stdout} string
 * @param {matchers} array
 * @param {debug} string
 * @returns {object} a JSON object of unknown type
 */
export function stdoutToJSON(
  stdout: string,
  matchers?: Matcher[] | null,
  debug = false,
): WithWildcards<unknown> | string {
  const jsonLikeString = stdout
    .split("\n") // remove new line chars => []
    .map((item) => item.trim()) // remove whitespace
    .filter((item) => item !== "") // filter empty array items
    .join(""); // return the modified string

  if (debug) console.debug({ jsonLikeString });

  // see the matcher instructions above for detail
  const stringifiedJSONForParsing = matcher(jsonLikeString, matchers, debug);
  // string => JSON
  if (debug) console.debug({ stringifiedJSONForParsing });
  // => JSON
  const isObject = ['{', '['].some(item => stringifiedJSONForParsing.includes(item));
  if (isObject) {
    const parsedJSON = JSON5.parse(stringifiedJSONForParsing);
    if (debug) console.debug({ parsedJSON });
    return parsedJSON;
  }
  return stringifiedJSONForParsing;
}

export default stdoutToJSON;
