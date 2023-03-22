# stdoutToJSON 📇

![Typed with TypeScript](https://flat.badgen.net/badge/icon/Typed?icon=typescript&label&labelColor=blue&color=555555)
[![npm version](https://badge.fury.io/js/stdouttojson.svg)](https://badge.fury.io/js/stdouttojson)
![ci](https://github.com/yowainwright/stdouttojson/actions/workflows/ci.yml/badge.svg)
[![Github](https://badgen.net/badge/icon/github?icon=github&label&color=grey)](https://github.com/yowainwright/stdouttojson)
![Twitter](https://img.shields.io/twitter/url?url=https%3A%2F%2Fgithub.com%2Fyowainwright%2Fstdouttojson)

**stdoutToJSON** is JavaScript utility for converting [stdout](https://en.wikipedia.org/wiki/Standard_streams#Standard_output_(stdout)) to JSON.<br>
This is useful for using `JSON` which has been output as `stdout`.

---

## Why Use _stdoutToJSON_?

**stdoutToJSON** takes in a `stdout` string of **JSON-like** shape and reconstructs to be parsable by `JSON.parse`. 👌<br>
**_This is very useful for testing CLI stdout outputs!_**

**_For example, say you have some `stdout` like so._**

```typescript
  "{\n" +
  "  options: { isTestingCLI: true },\n" +
  "  urls: [ 'https://example.com?gclid=test-clickid' ],\n" +
  "  cookies: [ { name: 'foo', value: '1' } ]\n" +
  "}\n";
```

**_With **stdoutToJSON**, you can pass that `stdout` as an argument!_**

```typescript
const stdout = "{\n" +
  "  options: { isTestingCLI: true },\n" +
  "  urls: [ 'https://example.com?gclid=test-clickid' ],\n" +
  "  cookies: [ { name: 'foo', value: '1' } ]\n" +
  "}\n";
const json = stdoutToJSON(stdout);
```

**_And you will be get usable JSON!!_**

```typescript
{
  options: { isTestingCLI: "true" },
  urls: ["https://example.com?gclid=test-clickid"],
  cookies: [{ name: "foo", value: "1" }],
}
```

For more detail, here's an [architectural gist](https://gist.github.com/yowainwright/ba8164ad5d968f35ae86e2ba6c91c592) for reference.

---

## Basic Usage

The following snippet (a CLI unit test) represents a basic use-case and what the **stdoutToJSON** does.

```typescript
import { exec } from 'child_process';
import { stdoutToJSON } from 'stdoutToJSON';
// or, const stdoutToJSON from 'stdoutToJSON';
// or, const { stdoutToJSON } = require('stdoutToJSON')
// or, const stdoutToJSON = require('stdoutToJSON').default

describe('cli', () => {
  it('returns stdout of an expected shape', (done) => {
    exec(`${<sme-cmd> --someJSONKey 'foo' }`, (_, stdout) => {
      const { someJSONKey } = stdoutToJSON(stdout); // where "someJSONKey" could be any expected key
      expect(someJSONkey).toEqual('foo');
    });
  });
});

```

---

## Arguments

| argument | required or optional | description |
| --- | --- | --- |
| **`stdout`** | `required` | a string of JSON-like shape |
| **`matchers`** | `optional` | an optional array to perform further string operations \***or** `null` |
| **`debug`** | `optional` | an optional boolean to enable debugging |

\***nullish matcher** arguments can be used to enable debugging with the default matchers.

```typescript
stoutToJSON('{"foo": "bar"}', null, true); // enables debugging with standard matchers
```

---

## Advanced Usage

This example provides insight into using the `matchers` argument.

```typescript
import { exec } from 'child_process';
import stdoutToJSON, { INITIAL_MATCHERS } from 'stdoutToJSON';
// import stdoutJSON from 'stdoutJSON'; (also works)

describe('cli', () => {
  it('returns stdout of an expected shape', (done) => {
    exec(`${<cmd> --someJSONKey 'foo'}`, (_, stdout) => {
      const UPDATED_MATCHERS = INITIAL_MATCHERS.concat([{ value: '<some-matcher-rgx', edit: '<some-new-value' }])
      /*
       * where "some-matcher-rgx" is a regex pattern and the edit is the expected new value
       */
      const { someJSONKey } = stdoutToJSON(stdout, matchers); // where "someJSONKey" could be any expected key
      expect(someJSONkey).toEqual('foo');
    });
  });
});

```

---

## Exposed Functions

In the section below, a description table and code blocks are provide to describe each function's usage.

| function | shape |
| --- | --- |
| [`stdoutToJSON`](#stdoutToJSON) | returns a JSON object from a string of JSON-like shape |
| [`matcher`](#matcher) | returns an iterated string based on a Matcher array's `value` and `edit` value replacements |

### `stdoutToJSON`

Importing and function shape detail
```typescript
import { stdoutToJSON } from 'stdoutToJSON';
// or, const stdoutToJSON from 'stdoutToJSON';
// or, const { stdoutToJSON } = require('stdoutToJSON')
// or, const stdoutToJSON = require('stdoutToJSON').default

// view type details below
stdoutToJSON(stdout: string, matchers: Matcher[] = INITIAL_MATCHERS);
// returns JSON
```

### `matcher`

Importing and function shape detail

```typescript
import { matcher } from 'stdoutToJSON';

// view type details below
matcher(str: string, matchers: Matcher[] = INITIAL_MATCHERS);
//returns replaced JSON-like string
```
#### Updating or Creating a Matcher Array (`Matcher[]`)

[Matchers](https://github.com/yowainwright/stdoutToJSON/blob/master/src/index.ts#L23-L56) can be exposed, overridden, and replaced.

To create and use your own Matcher array, import whatever `constants` you want and add to or update them as needed.

Matchers are written in simple regex string format making it easy to update and modify matchers.

```typescript
import { INITIAL_MATCHERS, stdoutToJSON } from "stdoutToJSON";

// concat your own matcher (can also be done with spread, etc
const MY_MATCHER = INITIAL_MATCHERS.concat([{ value: '<some-matcher-rgx', edit: '<some-new-value' }])

// execute your customer matchers
stdoutToJSON(stdout, MY_MATCHER);
```

---

## Types

Listed below are both types used to describe `stdoutToJSON` input and output

### `WithWildcards`

A generic type matching any JSON-like output

```typescript
/**
 * @description matches a JSON-like shape of unknown keys and values
 */
export type WithWildcards<T> = T & { [key: string]: unknown };
```

### `Matcher`

A type used to describe a **"matcher"** which is an input **value** (a regex string to match) and an output **edit** (a string to be output for each match within a string)

```typescript
/**
 * @description the Matcher shape matches a regex input string and expected output string, useful `String.prototype.replace`
 * @param {value} string a string contain a regex pattern to match
 * @param {edit} string
 */
export type Matcher = {
  value: string;
  edit: string;
};
```

---

## Synopsis

Being able to quickly test CLI commands is imperative to my daily workflow.

`stdoutToJSON` allows me to hack CLI programs and quickly test the `stdout` ouput within tests. See the end-to-end example below for the full picture.
## End-to-end Example

The example below displays a CLI program code block and a code block which tests the CLI program.
### Example CLI Program

Using a boolean flag (`--isTestingCLI`), the CLI program is able to exited before actually executing it's purpose (the `script`).

Adding a `console.log` in the if block of the flag check produces an `stdout` output which can be tested.

```typescript
#!/usr/bin/env node
const { program } = require("commander");
const { cosmiconfigSync } = require("cosmiconfig");
const { script } = require("./script");
const version = "VERSION";

/**
 * @notes
 * This config name is intentionally not specific to this pragram.
 * Hopefully, more scripts can be added!
 */
const explorer = cosmiconfigSync("config");

/**
 * action
 * @param {Options} options
 * @notes
 * a default config is used by default
 * a config passed in via arguments trumps the default config
 * an individual config trumps the config passed in via arguments
 */
export function action(options: Options = {}): void {
  const { config: defaultConfig = {} } = explorer.search() || {};
  const urls = options?.urls || defaultConfig?.urls || [];
  const config = options?.config || defaultConfig;
  if (options.isTestingCLI) {
    console.log({ urls, config });
    return;
  }
  script({ options });
}

program
  .version(version)
  .description("tests cli")
  .option("-u, --urls [urls...]", "urls to run scripts on")
  .option("-c, --config <config>", "config file to use")
  .option("-t, --isTestingCLI", "enables CLI testing, no scripts are run")
  .action(action)
  .parse(process.argv);

export { program };
```

### Example CLI Program Test

Because the CLI program exits and outputs `stdout`, the `stdout` output can be tested! However, `stdout` produces an awkward string if the `console.log` contains more than a simple string. This is the the big initial use-case for `stdoutToJSON`.

Using `stdoutToJSON` we can do a deep test of the `stdout` output!

This makes it easy the test the CLI itself in an efficient way!

```typescript
import { exec } from "child_process";
import { stdoutToJSON } from "stdoutToJSON";

describe("program", () => {
  it("works with defaults", (done) => {
    exec(
      `ts-node ../src/program.ts --isTestingCLI`,
      (err, stdout) => {
        if (err) {
          done();
          return;
        }

        const { config, url } =
          convertStdoutToJson(stdout);
        expect(url).toEqual([]);
        expect(config).toEqual({});
        done();
      }
    );
  });

  it("prefers config urls to an empty array", (done) => {
    exec(
      `ts-node ../src/program.ts --isTestingCLI --config .configrc`,
      (err, stdout) => {
        if (err) {
          done();
          return;
        }

        const { config, urls } =
          convertStdoutToJson(stdout);
        expect(urls).toEqual(['https://localhost:3000/', 'https://test.com']);
        expect(config.urls).toEqual(['https://localhost:3000/', 'https://test.com']);
        done();
      }
    );
  });

  it("prefers urls options over config.urls or an empty array", (done) => {
    exec(
      `ts-node ../src/program.ts --isTestingCLI --config .configrc --urls 'https://foo.com' 'https://bar.com'`,
      (err, stdout) => {
        if (err) {
          done();
          return;
        }

        const { config, urls } =
          convertStdoutToJson(stdout);
        expect(urls).toEqual(['https://foo.com', 'https://bar.com']);
        expect(config.urls).toEqual(['https://localhost:3000/', 'https://test.com']);
        done();
      }
    );
  });
});
```

---

## Debugging

Listed below are some issue with using this tool and how to fix them.

### Types Errors with the returned result

```typescript
import { Options } from '../types'

...

const { options } = stdoutToJSON(stdout)
const optionsResults = (options as Options)
// should be good to go!

...

```

---

## Security

**stdoutToJSON** has no dependencies and is meant to be installed as a `devDependency`.<br>
AKA if you're testing a CLI's interface it's a no-brainer to use for unit testing! Its tiny and secure. 🛡

---

## Local Setup

1. Clone
```
git clone git@github.com:yowainwright/stdoutToJSON.git
```

2. Setup
```
nvm i && pnpm i -g && pnpm i && pnpm prepare
# nvm or equivalent
```

3. Write awesomeness + a test. 🚀

---

## Videos

[![Loom video](https://cdn.loom.com/sessions/thumbnails/6b7082bd802b43618646242477701def-with-play.gif)](https://loom.com/share/6b7082bd802b43618646242477701def)

---

The name was changed from `stdoutJSON` to `stdoutToJSON`. Thanks to [OolongHell](https://www.reddit.com/r/node/comments/tx8sxo/stdoutjson_a_simple_node_js_utility_to_make/i3njq3w/?context=3) for assistance in making the reasoning and use case of this utility clearer.

Feel free to reach/fork with improvements—or if I can help clarify the docs. If you have a stdout string that doesn't work, please make an [issue](/issues), or submit a [pull request](/pulls) with a [test](src/__tests__/index.test.ts) and an updated [matcher](src/index.ts).  See [the setup](#local-setup) instructions. Thanks! 🤝

---

Made by [@yowainwright](https://github.com/yowainwright), MIT 2022
