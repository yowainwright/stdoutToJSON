import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import { terser } from "rollup-plugin-terser";

import {
  author,
  description,
  homepage,
  license,
  name,
  version,
} from "./package.json";

const banner = `/**
  ${name} - ${description}
  @version v${version}
  @link ${homepage}
  @author ${author}
  @license ${license}
**/`;

const plugins = [
  typescript({
    tsconfig: false,
    lib: ["esnext", "dom"],
    target: "es5",
    moduleResolution: "node",
    resolveJsonModule: true,
    removeComments: true,
  }),
  nodeResolve(),
  commonjs(),
  terser(),
];

export default {
  input: "src/index.ts",
  output: {
    banner,
    file: "dist/index.js",
    format: "umd",
    name: "stdouttojson",
    exports: "named",
  },
  plugins,
};
