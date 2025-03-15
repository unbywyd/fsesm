import { lstat, readFile, writeFile } from "node:fs/promises";
import { findFileUpwards } from "./upwards.js";
import { UpdateJsonFunc } from "./types.js";

export type FindPackageJsonOptions = {
    cwd?: string;
    maxDepth?: number;
};

/**
 * Finds the nearest `package.json` file.
 * Returns `null` if the file does not exist.
 * @param options FindPackageJsonOptions to find the `package.json` file.
 * @returns The path to the `package.json` file.
 */
export async function findPackageJson(options: FindPackageJsonOptions = {}): Promise<string | null> {
    const filePath = await findFileUpwards("package.json", options);
    if (!filePath) return null;
    try {
        const stats = await lstat(filePath);
        if (stats.isFile()) {
            return filePath;
        }
    } catch (err: any) {
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
export async function readPackageJson<T extends Record<string, any> = Record<string, any>>(options: FindPackageJsonOptions = {}): Promise<{
    path: string;
    data: T;
} | null> {
    const filePath = await findPackageJson(options);
    if (!filePath) return null;
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
export async function updatePackageJson<T extends Record<string, any> = Record<string, any>>(update: UpdateJsonFunc<T>, options: FindPackageJsonOptions = {}): Promise<T | null> {
    const data = await readPackageJson(options);
    if (!data) return null;
    const updated = await update(data.data as T);
    await writeFile(data.path, JSON.stringify(updated, null, 2) + "\n");
    return updated;
}