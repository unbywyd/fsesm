import { access, constants, cp, lstat, mkdir, open, readdir, readFile, rename, rm, symlink, unlink, writeFile, } from "node:fs/promises";
import { dirname, join } from "node:path";
/**
 * Ensures that a directory exists.
 * Creates it recursively if it doesn't exist.
 */
export async function ensureDir(dirPath) {
    await mkdir(dirPath, { recursive: true });
}
/**
 * Ensures that a file exists.
 * If missing, it creates parent directories and an empty file.
 */
export async function ensureFile(filePath) {
    try {
        await ensureDir(dirname(filePath));
        const fileHandle = await open(filePath, "a");
        await fileHandle.close();
    }
    catch {
        // Ignore errors
    }
}
/**
 * Reads and parses a JSON file.
 * Returns `null` if the file does not exist or has invalid JSON.
 */
export async function readJson(filePath) {
    try {
        const data = await readFile(filePath, "utf-8");
        return JSON.parse(data);
    }
    catch {
        return null;
    }
}
/**
 * Writes an object to a JSON file.
 * Creates parent directories if needed.
 */
export async function writeJson(filePath, data) {
    await ensureDir(dirname(filePath));
    await writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
}
/**
 * Updates a JSON file using an async updater function.
 * The updater receives the current data and should return the updated data.
 */
export async function updateJson(filePath, updater) {
    const data = await readJson(filePath);
    if (!data)
        return;
    const updated = await updater(data);
    await writeJson(filePath, updated);
    return updated;
}
/**
 * Writes data to a file, ensuring parent directories exist.
 */
export async function outputFile(filePath, data) {
    await ensureDir(dirname(filePath));
    await writeFile(filePath, data);
}
/**
 * Moves a file or directory.
 * - If moving across devices (EXDEV), it will copy and delete.
 * - If `overwrite = true`, it removes the destination before renaming.
 */
export async function move(src, dest, overwrite = false) {
    try {
        if (overwrite && (await pathExists(dest))) {
            await remove(dest);
        }
        await rename(src, dest);
    }
    catch (err) {
        if (err.code === "EXDEV") {
            await ensureDir(dirname(dest));
            await cp(src, dest, { recursive: true });
            await rm(src, { recursive: true, force: true });
            return;
        }
        throw err;
    }
}
/**
 * Copies a file or directory.
 * Uses Node.js `fs.cp()`, which supports recursive copying.
 */
export async function copy(src, dest) {
    await cp(src, dest, { recursive: true });
}
/**
 * Removes a file or directory recursively.
 */
export async function remove(path) {
    await rm(path, { recursive: true, force: true });
}
/**
 * Checks whether a file or directory exists.
 */
export async function pathExists(path) {
    try {
        await access(path, constants.F_OK);
        return true;
    }
    catch {
        return false;
    }
}
/**
 * Ensures a symbolic link exists at `dest`, pointing to `src`.
 * If `dest` exists but is not a symlink, it is replaced.
 */
export async function ensureSymlink(src, dest, type) {
    try {
        const stats = await lstat(dest);
        if (!stats.isSymbolicLink()) {
            await unlink(dest);
            await symlink(src, dest, type);
        }
    }
    catch (err) {
        if (err.code === "ENOENT") {
            await symlink(src, dest, type);
        }
        else {
            throw err;
        }
    }
}
/**
 * Empties a directory by removing its contents.
 * If the directory does not exist, it is created.
 */
export async function emptyDir(dirPath) {
    await remove(dirPath);
    await ensureDir(dirPath);
}
/**
 * Alias for `ensureDir()`.
 */
export const mkdirs = ensureDir;
/**
 * Reads a file safely, returning `null` if it doesn't exist.
 * If `encoding` is `null`, returns a Buffer.
 */
export async function readFileSafe(filePath, encoding = "utf-8") {
    if (!filePath || typeof filePath !== "string") {
        return null;
    }
    try {
        return await readFile(filePath, encoding ?? undefined);
    }
    catch (err) {
        if (err.code === "ENOENT" || err.code === "EACCES" || err.code === "EPERM") {
            return null;
        }
        throw err;
    }
}
/**
 * Checks if a path is a directory.
 */
export async function isDirectory(path) {
    if (!path || typeof path !== "string") {
        return false; // Prevents TypeError when calling lstat
    }
    try {
        return (await lstat(path)).isDirectory();
    }
    catch (err) {
        if (err.code === "ENOENT" || err.code === "EACCES" || err.code === "EPERM") {
            return false; // Path does not exist or permission denied
        }
        throw err; // Unexpected errors should not be swallowed
    }
}
/**
 * Checks if a path is a file.
 */
export async function isFile(path) {
    if (!path || typeof path !== "string") {
        return false; // Prevents TypeError when calling lstat
    }
    try {
        return (await lstat(path)).isFile();
    }
    catch (err) {
        if (err.code === "ENOENT" || err.code === "EACCES" || err.code === "EPERM") {
            return false; // Path does not exist or permission denied
        }
        throw err; // Other unexpected errors should not be swallowed
    }
}
/**
 * Recursively lists all files in a directory (parallelized for performance).
 */
export async function listFiles(dirPath) {
    if (!dirPath || typeof dirPath !== "string") {
        return [];
    }
    try {
        const entries = await readdir(dirPath, { withFileTypes: true });
        if (entries.length === 0)
            return [];
        const filePaths = await Promise.all(entries.map(async (entry) => {
            const fullPath = join(dirPath, entry.name);
            return entry.isDirectory() ? await listFiles(fullPath) : fullPath;
        }));
        return filePaths.flat();
    }
    catch (err) {
        if (err.code === "ENOENT" || err.code === "EACCES" || err.code === "EPERM") {
            return [];
        }
        throw err;
    }
}
export * from "./types.js";
export * from "./find.js";
export * from "./env.js";
export * from "./upwards.js";
export * from "./package.js";
//# sourceMappingURL=index.js.map