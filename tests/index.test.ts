import assert from "assert";

import { stdoutToJSON } from "../src/index";

export const STDOUT_MOCK =
  "{\n" +
  "  options: { isTestingCLI: true },\n" +
  "  urls: [ 'https://example.com?gclid=test-clickid' ],\n" +
  "  cookies: [ { name: 'foo', value: '1' } ]\n" +
  "}\n";

export const STDOUT_TRAILING_COMMA_MOCK =
  "{\n" +
  "  options: { isTestingCLI: true },\n" +
  "  urls: [ 'https://example.com?gclid=test-clickid' ],\n" +
  "  cookies: [ { name: 'foo', value: '1' }, ],\n" +
  "}\n";

export const STDOUT_ARRAY_MOCK =
  "{\n" +
  "  options: { isTestingCLI: true },\n" +
  "  urls: [ 'https://example.com?gclid=test-clickid' ],\n" +
  "  cookies: [ { name: 'foo', value: '1' }, ],\n" +
  "  items: ['item1','item2'],\n" +
  "  test: true,\n" +
  "}\n";

export const DEFAULT_EXPECTATION = {
  options: { isTestingCLI: "true" },
  urls: ["https://example.com?gclid=test-clickid"],
  cookies: [{ name: "foo", value: "1" }],
};

const runTest = (testName, testFunction) => {
  try {
    testFunction();
    console.log(`Test passed: ${testName}`);
  } catch (error) {
    console.error(`Test failed: ${testName}`);
    console.error(error);
  }
}

runTest("stringifiedJSON default", () => {
  const result = stdoutToJSON(STDOUT_MOCK);
  assert.deepStrictEqual(result, DEFAULT_EXPECTATION);
});

runTest("works with trailing commas", () => {
  const result = stdoutToJSON(STDOUT_ARRAY_MOCK);
  assert.deepStrictEqual(result, {
    ...DEFAULT_EXPECTATION, items: ['item1', 'item2'], test: 'true'
  });
});

runTest("works with simple arrays", () => {
  const result = stdoutToJSON(STDOUT_TRAILING_COMMA_MOCK);
  assert.deepStrictEqual(result, DEFAULT_EXPECTATION);
});

runTest("works with simple 1 line objects", () => {
  const result = stdoutToJSON('{ options: { isTestingCLI: true }, config: {} }\n');
  assert.deepStrictEqual(result, { "config": {}, "options": { "isTestingCLI": "true" } });
});

runTest("works with a string only", () => {
  const result = stdoutToJSON('test\n');
  assert.deepStrictEqual(result, 'test');
});

runTest("works with an array only", () => {
  const result = stdoutToJSON('["test",]\n');
  assert.deepStrictEqual(result, ["test"]);
});

runTest("works with a 2 dimensional array only", () => {
  const result = stdoutToJSON('[["foo","bar",]]\n');
  assert.deepStrictEqual(result, [["foo", "bar"]]);
});

runTest("works with a 2 dimensional array and trailing comma", () => {
  const result = stdoutToJSON('[["foo","bar",],]\n');
  assert.deepStrictEqual(result, [["foo", "bar"]]);
});

runTest("works with an array of objects", () => {
  const result = stdoutToJSON('[{foo:"bar"},]\n', null, true);
  assert.deepStrictEqual(result, [{ foo: "bar" }]);
});

/**
 * @todos
 * - heavy json test
 */
