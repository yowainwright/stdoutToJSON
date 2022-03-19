import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import { uglify } from "rollup-plugin-uglify";

import {
  author,
  description,
  homepage,
  license,
  name,
  version,
} from "./package.json";

const preamble = `/**
  ${name} - ${description}
  @version v${version}
  @link ${homepage}
  @author ${author}
  @license ${license}
**/`;

const plugins = [
  resolve(),
  commonjs(),
  typescript({
    tsconfig: false,
    lib: ["esnext", "dom"],
    target: "es5",
    moduleResolution: "node",
    resolveJsonModule: true,
  }),
  uglify({ output: { preamble } }),
];

export default {
  input: "src/index.ts",
  plugins,
  output: {
    file: "dist/index.js",
    format: "umd",
    name: "stdoutjson",
    exports: "named",
  },
};
