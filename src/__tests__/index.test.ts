import { stdoutJSON } from "../index";

export const STDOUT_MOCK =
  "{\n" +
  "  options: { isTestingCLI: true },\n" +
  "  urls: [ 'https://example.com?gclid=test-clickid' ],\n" +
  "  cookies: [ { name: 'foo', value: '1' } ]\n" +
  "}\n";

describe("stringifiedJSON", () => {
  it("default", () => {
    const result = stdoutJSON(STDOUT_MOCK);
    expect(result).toEqual({
      options: { isTestingCLI: "true" },
      urls: ["https://example.com?gclid=test-clickid"],
      cookies: [{ name: "foo", value: "1" }],
    });
  });
});
