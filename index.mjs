import * as readline from "node:readline/promises";
import { stdin, stdout } from "node:process";
import { displayHelp, parseCliArgs } from "./argparse.mjs";
import { newEvaluatorDefault } from "./core.mjs";
import { getInputJson } from "./context.mjs";

/** @import {Input} from "./core.mjs" */

async function main() {
  const args = parseCliArgs();
  const enableStringExt = args.enableStringExt || false;

  if (args.help) {
    displayHelp();
    process.exit(0);
  }

  const inputJsonObj = getInputJson(args);

  let celExpression;
  if (typeof args.eval === "string") {
    celExpression = args.eval;
  } else if (typeof process.env.CEL_EXPRESSION === "string") {
    celExpression = process.env.CEL_EXPRESSION;
  }

  if (typeof celExpression === "string") {
    // Single expression evaluation
    try {
      const celEval = newEvaluatorDefault(celExpression, enableStringExt);
      const result = celEval(inputJsonObj);
      console.log(result);
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error evaluating CEL expression:", error.message);
      } else {
        console.error(
          "An unknown error occurred while evaluating CEL expression:",
          error,
        );
      }
      process.exit(1);
    }
    process.exit(0);
  } else {
    // REPL mode
    const rl = readline.createInterface({
      input: stdin,
      output: stdout,
      prompt: "> ",
    });
    console.log(
      "CEL REPL. Enter expressions. Type '.exit' or press Ctrl+D to quit.",
    );
    rl.prompt();

    for await (const line of rl) {
      try {
        if (line.trim() === ".exit") {
          break;
        }
        if (line.trim() === "") {
          rl.prompt();
          continue;
        }

        const celEval = newEvaluatorDefault(line, enableStringExt);
        const result = celEval(inputJsonObj);
        console.log(result);
      } catch (error) {
        if (error instanceof Error) {
          console.error("Error:", error.message);
        } else {
          console.error("An unknown error occurred:", error);
        }
      }
      rl.prompt();
    }
    console.log("Exiting REPL.");
    rl.close();
    process.exit(0);
  }
}

main();
