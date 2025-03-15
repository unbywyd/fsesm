import { readFile, lstat, writeFile } from "node:fs/promises";
import path from "node:path";
import { findFileUpwards } from "./upwards.js";
import { ensureFile } from "./index.js";
/**
 * Finds the nearest `.env` file.
 * Returns `null` if the file does not exist.
 * @param options FindEnvFileOptions to find the `.env` file.
 * @returns The path to the `.env` file.
 */
export async function findEnvFile(fileName, options = {}) {
    const name = fileName ?? ".env";
    const filePath = await findFileUpwards(name, options);
    if (!filePath)
        return null;
    try {
        const stats = await lstat(filePath);
        if (stats.isFile()) {
            return filePath;
        }
    }
    catch (err) {
        if (err.code !== "ENOENT" && err.code !== "EACCES" && err.code !== "EPERM") {
            throw err;
        }
    }
    return null;
}
/**
 * Reads the nearest `.env` file.
 * Returns `null` if the file does not exist.
 * @param options FindEnvFileOptions to find the `.env` file.
 * @returns The path and parsed `.env` data.
 */
export async function readEnvFile(fileName, options = {}) {
    const filePath = await findEnvFile(fileName, options);
    if (!filePath)
        return null;
    const source = await readFile(filePath, "utf-8");
    const parsed = parseEnv(source);
    return { path: filePath, data: parsed };
}
/**
* Parses a string of environment variables into an object.
* @param source The source string to parse.
* @param returnEmptyAsNull Whether to return empty values as `null`.
* @returns The parsed object.
*/
export function parseEnv(source, returnEmptyAsNull = true) {
    const obj = {};
    let lines = source.replace(/\r\n?/g, '\n'); // Normalize line endings
    // Regular expression: supports `export VAR=`, complex keys, `= in value`
    const LINE = /^\s*(?:export\s+)?([\w.@$:-]+)\s*=\s*(.*)?\s*$/gm;
    let match;
    while ((match = LINE.exec(lines)) !== null) {
        let key = match[1].trim();
        let value = match[2]?.trim() ?? '';
        // Remove comments `#`, if they are not inside quotes
        if (!/^['"`]/.test(value)) {
            value = value.split(/(?<!\\)#/)[0].trim(); // Remove everything after `#`, if not escaped
        }
        // Check for quotes
        if ((value.startsWith('"') && value.endsWith('"')) ||
            (value.startsWith("'") && value.endsWith("'")) ||
            (value.startsWith("`") && value.endsWith("`"))) {
            value = value.slice(1, -1);
        }
        // Handle escaped characters
        value = value.replace(/\\n/g, '\n')
            .replace(/\\r/g, '\r')
            .replace(/\\t/g, '\t')
            .replace(/\\b/g, '\b')
            .replace(/\\f/g, '\f')
            .replace(/\\\\/g, '\\');
        // Automatic type conversion
        obj[key] = convertType(value, returnEmptyAsNull);
    }
    return obj;
}
/**
 * Converts a string to the correct JS type (number, boolean, null)
 */
function convertType(value, returnEmptyAsNull) {
    if (returnEmptyAsNull && value === '')
        return null; // Empty values → null (or leave as string)
    if (/^-?\d+(\.\d+)?$/.test(value))
        return Number(value); // Number (not "123abc")
    if (/^(true|false)$/i.test(value))
        return value.toLowerCase() === "true"; // Boolean (case insensitive)
    if (/^(null|undefined)$/i.test(value))
        return null; // null/undefined → null
    return value; // Leave the rest as string
}
/**
 * Writes a key-value pair to an `.env` file.
 * If the key already exists, it will be updated.
 * @param envPath The path to the `.env` file.
 * @param key The key to write.
 * @param value The value to write.
 * @param onlyIfEmpty Whether to write only if the key is empty.
 */
export async function writeEnvVar(envPath, key, value, onlyIfEmpty = false) {
    const filePath = path.isAbsolute(envPath) ? envPath : path.resolve(process.cwd(), envPath);
    const envFilename = path.basename(filePath);
    try {
        await ensureFile(filePath);
        let envContent = "";
        // Read the file if it exists
        try {
            envContent = await readFile(filePath, "utf8");
        }
        catch {
            console.log(`${envFilename} not found. A new file will be created at ${filePath}.`);
        }
        // Parse the .env content
        const parsedEnv = parseEnv(envContent, false);
        const lines = envContent.split("\n");
        let found = false;
        // Update or add the variable
        const updatedLines = lines.map((line) => {
            const trimmed = line.trim();
            // Skip empty lines and comments
            if (!trimmed || trimmed.startsWith("#"))
                return line;
            const eqIndex = line.indexOf("=");
            if (eqIndex === -1)
                return line; // Skip lines without "="
            const currentKey = line.substring(0, eqIndex).trim();
            if (currentKey === key) {
                found = true;
                // If `onlyIfEmpty`, do not overwrite existing non-empty values
                if (onlyIfEmpty && parsedEnv[key]?.toString().trim() !== "") {
                    console.log(`${key} already exists in ${envFilename} and will not be updated.`);
                    return line;
                }
                // Update the value, preserving formatting
                return `${key}="${value}"`;
            }
            return line; // Leave the line unchanged
        });
        // If the key was not found, add it
        if (!found) {
            updatedLines.push(`${key}="${value}"`);
        }
        // Write the updated content back to the file
        await writeFile(filePath, updatedLines.join("\n"), "utf8");
    }
    catch (error) {
        console.error(`Failed to update ${key} in ${envFilename}:`, error instanceof Error ? error.message : error);
    }
}
/*
* Finds the keys in an `.env` file that are empty or missing.
* @param envPath The path to the `.env` file.
* @returns The keys that are empty or missing.
* @throws If the file does not exist.
*/
export async function getEmptyEnvKeys(envPath) {
    try {
        const envContent = await readFile(envPath, "utf-8");
        const parsedEnv = parseEnv(envContent, false);
        const missingKeys = [];
        for (const [key, value] of Object.entries(parsedEnv)) {
            if (value === null || value === "") {
                missingKeys.push(key);
            }
        }
        return missingKeys;
    }
    catch (error) {
        console.error(`.env not found at path: ${envPath}`);
        throw error;
    }
}
/**
 * Writes a record of key-value pairs to an `.env` file.
 * If the key already exists, it will be updated.
 * @param envPath The path to the `.env` file.
 * @param record The record to write.
 */
export async function writeEnvRecord(envPath, record) {
    try {
        await ensureFile(envPath);
        for (const [key, value] of Object.entries(record)) {
            await writeEnvVar(envPath, key, value);
        }
    }
    catch (error) {
        console.error(`Error saving ${envPath}:`, error);
    }
}
/**
 * Updates an `.env` file using an async updater function.
 * The updater receives the current data and should return the updated data.
 * @param envPath The path to the `.env` file.
 * @param update Function to update the `.env` data.
 */
export async function updateEnv(envPath, update) {
    const envContent = await readFile(envPath, "utf-8");
    const parsedEnv = parseEnv(envContent, false);
    const updated = await update(parsedEnv);
    await writeEnvRecord(envPath, updated);
}
//# sourceMappingURL=env.js.map