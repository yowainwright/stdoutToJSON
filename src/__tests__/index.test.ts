import { test, it, expect } from "vitest";

import { stdoutToJSON } from "../index";

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

test("stringifiedJSON", () => {
  it("default", () => {
    const result = stdoutToJSON(STDOUT_MOCK);
    expect(result).toEqual(DEFAULT_EXPECTATION);
  });
  it("works with trailing commas", () => {
    const result = stdoutToJSON(STDOUT_ARRAY_MOCK);
    expect(result).toEqual(DEFAULT_EXPECTATION);
  });
  it("works with simple arrays", () => {
    const result = stdoutToJSON(STDOUT_TRAILING_COMMA_MOCK);
    expect(result).toEqual({
      ...DEFAULT_EXPECTATION,
      items: ["item1", "item2"],
    });
  });
});
