import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import { terser } from "rollup-plugin-terser";
import json from "./package.json" assert { type: 'json' };
const { author, description, homepage, license, name, version, } = json;
const banner = `/**
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
        tsconfig: "tsconfig.rollup.json",
    }),
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
