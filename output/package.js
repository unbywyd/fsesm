import { lstat, readFile, writeFile } from "node:fs/promises";
import { findFileUpwards } from "./upwards.js";
/**
 * Finds the nearest `package.json` file.
 * Returns `null` if the file does not exist.
 * @param options FindPackageJsonOptions to find the `package.json` file.
 * @returns The path to the `package.json` file.
 */
export async function findPackageJson(options = {}) {
    const filePath = await findFileUpwards("package.json", options);
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
 * Reads the nearest `package.json` file.
 * Returns `null` if the file does not exist.
 * @param options FindPackageJsonOptions to find the `package.json` file.
 * @returns The path and parsed JSON data.
 */
export async function readPackageJson(options = {}) {
    const filePath = await findPackageJson(options);
    if (!filePath)
        return null;
    const source = await readFile(filePath, "utf-8");
    const parsed = JSON.parse(source);
    return { path: filePath, data: parsed };
}
/**
 * Updates the nearest `package.json` file.
 * Returns `null` if the file does not exist.
 * @param options FindPackageJsonOptions to find the `package.json` file.
 * @param update Function to update the JSON data.
 * @returns The updated JSON data.
 */
export async function updatePackageJson(options = {}, update) {
    const data = await readPackageJson(options);
    if (!data)
        return null;
    const updated = await update(data.data);
    await writeFile(data.path, JSON.stringify(updated, null, 2) + "\n");
    return updated;
}
//# sourceMappingURL=package.js.map