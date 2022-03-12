import { stdoutJSON } from "../index";

export const STDOUT_MOCK =
  "{\n" +
  "  options: { isTestingCLI: true },\n" +
  "  urls: [ 'https://goodrx.com?gclid=test-clickid' ],\n" +
  "  cookies: [ { name: 'grx_cm_signal', value: '1' } ],\n" +
  "  segmentRequest: 'https://segment-api.goodrx.com/v1/'\n" +
  "}\n";

describe("stringifiedJSON", () => {
  it("defaut", () => {
    const result = stdoutJSON(STDOUT_MOCK);
    expect(result).toEqual({
      options: { isTestingCLI: "true" },
      urls: ["https://goodrx.com?gclid=test-clickid"],
      cookies: [{ name: "grx_cm_signal", value: "1" }],
      segmentRequest: "https://segment-api.goodrx.com/v1/",
    });
  });
});
