import { readFileSync } from "node:fs";

/** @import {Input} from "./core.mjs" */

/**
 * Parses a JSON string from an environment variable.
 * @param {string} envVarName - The name of the environment variable.
 * @returns {Input} The parsed JSON object, or an empty object if the variable is not set or invalid.
 */
function getInputJsonFromEnv(envVarName) {
  const jsonString = process.env[envVarName];
  if (!jsonString) {
    console.warn(
      `Warning: Environment variable '${envVarName}' not set. Using empty context.`,
    );
    return /** @type {Input} */ ({});
  }
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    if (error instanceof Error) {
      console.error(
        `Error parsing JSON from environment variable '${envVarName}':`,
        error.message,
      );
    } else {
      console.error(
        `An unknown error occurred while parsing JSON from environment variable '${envVarName}':`,
        error,
      );
    }
    console.warn("Using empty context due to JSON parsing error.");
    return /** @type {Input} */ ({});
  }
}

/** @import {ParsedCliArgs} from "./argparse.mjs" */

/**
 * Gets the input JSON from command-line arguments or environment variables.
 * @param {ParsedCliArgs} args - The parsed command-line arguments.
 * @returns {Input} The input JSON object.
 */
export function getInputJson(args) {
  let inputJsonObj = /** @type {Input} */ ({});

  // Prioritize command-line --json or --json-file
  if (typeof args.json === "string") {
    try {
      inputJsonObj = JSON.parse(args.json);
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error parsing --json argument:", error.message);
      } else {
        console.error(
          "An unknown error occurred while parsing --json argument:",
          error,
        );
      }
      process.exit(1);
    }
  } else if (typeof args.jsonFile === "string") {
    try {
      const fileContent = readFileSync(args.jsonFile, "utf8");
      inputJsonObj = JSON.parse(fileContent);
    } catch (error) {
      if (error instanceof Error) {
        console.error(
          `Error reading or parsing --jsonFile '${args.jsonFile}':`,
          error.message,
        );
      } else {
        console.error(
          `An unknown error occurred while reading or parsing --json-file '${args.jsonFile}':`,
          error,
        );
      }
      process.exit(1);
    }
  } else {
    // Fallback to environment variable if no command-line JSON is provided
    inputJsonObj = getInputJsonFromEnv("CEL_JSON_CONTEXT");
  }

  return inputJsonObj;
}
