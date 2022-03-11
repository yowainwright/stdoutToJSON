# WIP: stdoutJSON 🕸

A naive tool useful for outputting stdout as JSON.

**This is a naive utility function!**<br> 
It takes in a string argument **assuming** that it was passed in from an `stdout` output of JSON-like shape. 
From there it attempts to reconstruct a string so that it can be interpreted by `JSON.parse(<costructed-string>)`. 👌

This tool was made for testing stdout output of CLI programs and has no dependencies required in it's distributables.<br>
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
