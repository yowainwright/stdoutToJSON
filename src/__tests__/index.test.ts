import { stdoutJSON } from "../index";

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

export const DEFAULT_EXPECTATION = {
  options: { isTestingCLI: "true" },
  urls: ["https://example.com?gclid=test-clickid"],
  cookies: [{ name: "foo", value: "1" }],
};

describe("stringifiedJSON", () => {
  it("default", () => {
    const result = stdoutJSON(STDOUT_MOCK);
    expect(result).toEqual(DEFAULT_EXPECTATION);
  });
  it("works with trailing commas", () => {
    const result = stdoutJSON(STDOUT_TRAILING_COMMA_MOCK);
    expect(result).toEqual(DEFAULT_EXPECTATION);
  });
});
