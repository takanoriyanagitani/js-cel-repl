import * as cel from "@bufbuild/cel";
import { STRINGS_EXT_FUNCS } from "@bufbuild/cel/ext/strings";

/** @import {CelResult} from "@bufbuild/cel" */
/** @import {CelInput} from "@bufbuild/cel" */

/** @typedef {Record<string, CelInput>} Input */

/**
 * Creates a new CEL evaluator function from an expression.
 * @param {string} expr - The CEL expression string.
 * @param {boolean} [enableStringExt=false] - Whether to enable extended string functions.
 * @returns {function(Input): CelResult} A function that evaluates the expression with a given input.
 */
export function newEvaluatorDefault(expr, enableStringExt = false) {
  const envOptions = {};
  if (enableStringExt) {
    envOptions.funcs = STRINGS_EXT_FUNCS;
  }
  const env = cel.celEnv(envOptions);
  return cel.plan(
    env,
    cel.parse(expr),
  );
}
