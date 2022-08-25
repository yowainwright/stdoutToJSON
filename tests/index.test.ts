import { test, expect } from "vitest";

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

test("stringifiedJSON default", () => {
  const result = stdoutToJSON(STDOUT_MOCK);
  expect(result).toEqual(DEFAULT_EXPECTATION);
});

test("works with trailing commas", () => {
  const result = stdoutToJSON(STDOUT_ARRAY_MOCK);
  expect(result).toEqual({
    ...DEFAULT_EXPECTATION, items: ['item1', 'item2'], test: 'true'
  });
});

test("works with simple arrays", () => {
  const result = stdoutToJSON(STDOUT_TRAILING_COMMA_MOCK);
  expect(result).toEqual(DEFAULT_EXPECTATION);
});

test("works with simple 1 line objects", () => {
  const result = stdoutToJSON('{ options: { isTestingCLI: true }, config: {} }\n');
  expect(result).toEqual({ "config": {}, "options": { "isTestingCLI": "true" } });
});

test("works with a string only", () => {
  const result = stdoutToJSON('test\n');
  expect(result).toEqual('test');
});

test("works with an array only", () => {
  const result = stdoutToJSON('["test",]\n');
  expect(result).toEqual(["test"]);
});

test("works with a 2 dimensional array only", () => {
  const result = stdoutToJSON('[["foo","bar",]]\n');
  expect(result).toEqual([["foo", "bar"]]);
});

test("works with a 2 dimensional array and trailing comma", () => {
  const result = stdoutToJSON('[["foo","bar",],]\n');
  expect(result).toEqual([["foo", "bar"]]);
});

test("works with an array of objects", () => {
  const result = stdoutToJSON('[{foo:"bar"},]\n', null, true);
  expect(result).toEqual([{ foo: "bar" }]);
});

/**
 * @todos
 * - heavy json test
 */
