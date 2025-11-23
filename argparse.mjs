import { parseArgs } from "node:util";

const HELP_MESSAGE = `
Usage: node index.mjs [options]

CEL REPL CLI

Options:
  -h, --help                Show this help message and exit.
  --json <json_string>      Provide JSON context directly as a string.
  --jsonFile <file_path>    Provide JSON context from a file.
  --eval <cel_expression>   Evaluate a single CEL expression and exit.
  --enableStringExt         Enable extended string functions.

If no --eval is provided, the CLI will start in REPL mode.
`;

/**
 * Displays the help message.
 */
export function displayHelp() {
  console.log(HELP_MESSAGE);
}

/**
 * @typedef {object} ParseArgsOptionDescriptor
 * @property {'string' | 'boolean'} type
 * @property {string} [short]
 * @property {boolean} [multiple]
 * @property {boolean} [allowPositionals]
 */

/**
 * @typedef {Record<string, ParseArgsOptionDescriptor>} ParseArgsOptionsConfig
 */

/**
 * @typedef {object} ParsedCliArgs
 * @property {boolean | undefined} help
 * @property {string | undefined} json
 * @property {string | undefined} jsonFile
 * @property {string | undefined} eval
 * @property {boolean | undefined} enableStringExt
 */

/**
 * Parses command-line arguments.
 * @returns {ParsedCliArgs} Parsed arguments.
 */
export function parseCliArgs() {
  /** @type {ParseArgsOptionsConfig} */
  const options = {
    help: {
      type: "boolean",
      short: "h",
    },
    json: {
      type: "string",
    },
    jsonFile: {
      type: "string",
    },
    eval: {
      type: "string",
    },
    enableStringExt: {
      type: "boolean",
    },
  };

  const { values } = parseArgs({ options, strict: false });
  return /** @type {ParsedCliArgs} */ (values);
}
