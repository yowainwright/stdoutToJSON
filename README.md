# stdoutJSON 🕸

A naive tool, useful for outputting stdout as JSON.

**This is a naive utility!**<br>
It takes in a string argument **assuming** that it was passed in from an `stdout` output of **JSON-like** shape.
From there, the utility attempts to reconstruct the string argument so that it can be interpreted by `JSON.parse(<costructed-string>)`. 👌

This tool was made for testing stdout outputs of CLI programs. It has no dependencies required in it's distributables.<br>
AKA it is secure to use. 🛡

---

## Install

```sh
npm install stdoutJSON -D
```

## Basic Usage

The following snippet represents a basic use-case and what the utility to was written to do.

```typescript
import { exec } from 'child_process';
import { stdoutJSON } from 'stdoutJSON';
// import stdoutJSON from 'stdoutJSON'; (also works)

describe('cli', () => {
  it('returns stdout of an expected shape', (done) => {
    exec(`${<cmd>}`, (_, stdout) => {
      const { someJSONKey } = stdoutJSON(stdout); // where "someJSONKey" could be any expected key
      expect(someJSONkey).toBeDefined();
    });
  });
});

```

## Arguments

| argument | required or optional | description |
| --- | --- | --- |
| **`stdout`** | `required` | a string of JSON-like shape |
| **`matchers`** | `optional` | an optional array to perform further string operations |

## Advanced Usage

This example provided insight into using the `matchers` arguement.

```typescript
import { exec } from 'child_process';
import { stdoutJSON, INITIAL_MATCHERS } from 'stdoutJSON';
// import stdoutJSON from 'stdoutJSON'; (also works)

describe('cli', () => {
  it('returns stdout of an expected shape', (done) => {
    exec(`${<cmd>}`, (_, stdout) => {
      const UPDATED_MATCHERS = INITIAL_MATCHERS.concat([{ value: '<some-matcher-rgx', edit: '<some-new-value' }])
      /*
       * where "some-matcher-rgx" is a regex pattern and the edit is the expected new value
       */
      const { someJSONKey } = stdoutJSON(stdout, matchers); // where "someJSONKey" could be any expected key
      expect(someJSONkey).toBeDefined();
    });
  });
});

```

## Exposed Functions

In the section below, a description table and code blocks are provide to describe each function's usage.

| function | shape |
| --- | --- |
| [`stdoutJSON`](#stdoutjson) | returns a JSON object from a string of JSON-like shape |
| [`matcher`](#matcher) | returns an iterated string based on a Matcher array's `value` and `edit` value replacements |

### `stdoutJSON`

Importing and function shape detail
```typescript
import { stdoutJSON } from 'stdoutJSON';
// import stdoutJSON from 'stdoutJSON'; (also works)

// view type details below
stdoutJSON(stdout: string, matchers: Matcher[] = INITIAL_MATCHERS);
// returns JSON
```

### `matcher`

Importing and function shape detail

```typescript
import { matcher } from 'stdoutJSON';

// view type details below
matcher(str: string, matchers: Matcher[] = INITIAL_MATCHERS);
//returns replaced JSON-like string
```

## Exposed Constants

In the section below, each importable constant is described along with what each of its `matchers` do. All provided is an example on how to create your own Matcher array `Matcher[]`.

| constant | value/edit details | matchers: value ➔ edit |
| --- | --- | --- | --- |
| **`OBJECT_MATCHER`** | a brute force string sweep<br>matching common JSON-like items and replacing<br>them with proper `JSON.parse` formatting | `' +'` ➔ `""`<br> `" "` ➔ `""`<br> `"'"` ➔ `'"'`<br> `":"` ➔ `'":'`<br> `"{"` ➔ `'{"'`<br> `","` ➔ `',"'` |
| **`BOOL_MATCHER`** |  matches boolean values<br>and replacing them with expected<br>`JSON.parse` formatting | `true` ➔ `"true"`<br> `false` ➔ `"false"` |
| **`BROWSER_MATCHER`** | matches browser-specific values<br> and replaces them with expected<br>`JSON.parse` formatting | `'https"'` ➔ `"https"`<br> `'http'` ➔ `"http"` |

### Creating your own Matcher array (`Matcher[]`)

To create and use your own Matcher array, import whatever `constants` you want and add to or update them as needed.

```typescript
import { INITIAL_MATCHERS, stdoutJSON } from "stdoutJSON";

// concat your own matcher (can also be done with spread, etc
const MY_MATCHER = INITIAL_MATCHERS.concat([{ value: '<some-matcher-rgx', edit: '<some-new-value' }])

// execute your customer matchers
stdoutJSON(stdout, MY_MATCHER);
```

## Types

Listed below are both types used to describe `stdoutJSON` input and output

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
## Synopsis

Being able to quickly test CLI commands is imperative to my daily workflow.

`stdoutJSON` allows me to hack CLI programs and quickly test the `stdout` ouput within tests. See the end-to-end example below for the full picture.

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
  if (options.isTestingCLI) {
    console.info({ options });
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

Because the CLI program exits and outputs `stdout`, the `stdout` output can be tested! However, `stdout` produces an awkward string if the `console.log` contains more than a simple string. This is the the big initial use-case for `stdoutJSON`.

Using `stdoutJSON` we can do a deep test of the `stdout` output!

This makes it easy the test the CLI itself in an efficient way!

```typescript
import { exec } from "child_process";
import { stdoutJSON } from "stdoutJSON";

describe("program", () => {
  it("works with defaults", (done) => {
    exec(
      `ts-node ../src/program.ts --isTestingCLI`,
      (err, stdout) => {
        if (err) {
          done();
          return;
        }

        const { options } =
          convertStdoutToJson(stdout);
        expect(options).toEqual(<someJSON>);
        done();
      }
    );
  });
});
```

---

Feel free to reach/fork with improvements—or if I can help clarify the docs. Thanks! 🤝
