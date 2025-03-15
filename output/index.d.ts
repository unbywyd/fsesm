import { UpdateJsonFunc } from "./types.js";
/**
 * Ensures that a directory exists.
 * Creates it recursively if it doesn't exist.
 */
export declare function ensureDir(dirPath: string): Promise<void>;
/**
 * Ensures that a file exists.
 * If missing, it creates parent directories and an empty file.
 */
export declare function ensureFile(filePath: string): Promise<void>;
/**
 * Reads and parses a JSON file.
 * Returns `null` if the file does not exist or has invalid JSON.
 */
export declare function readJson<T = unknown>(filePath: string): Promise<T | null>;
/**
 * Writes an object to a JSON file.
 * Creates parent directories if needed.
 */
export declare function writeJson(filePath: string, data: unknown): Promise<void>;
/**
 * Updates a JSON file using an async updater function.
 * The updater receives the current data and should return the updated data.
 */
export declare function updateJson<T = unknown>(filePath: string, updater: UpdateJsonFunc<T>): Promise<void>;
/**
 * Writes data to a file, ensuring parent directories exist.
 */
export declare function outputFile(filePath: string, data: string | Buffer): Promise<void>;
/**
 * Moves a file or directory.
 * - If moving across devices (EXDEV), it will copy and delete.
 * - If `overwrite = true`, it removes the destination before renaming.
 */
export declare function move(src: string, dest: string, overwrite?: boolean): Promise<void>;
/**
 * Copies a file or directory.
 * Uses Node.js `fs.cp()`, which supports recursive copying.
 */
export declare function copy(src: string, dest: string): Promise<void>;
/**
 * Removes a file or directory recursively.
 */
export declare function remove(path: string): Promise<void>;
/**
 * Checks whether a file or directory exists.
 */
export declare function pathExists(path: string): Promise<boolean>;
/**
 * Ensures a symbolic link exists at `dest`, pointing to `src`.
 * If `dest` exists but is not a symlink, it is replaced.
 */
export declare function ensureSymlink(src: string, dest: string, type?: "file" | "dir" | "junction"): Promise<void>;
/**
 * Empties a directory by removing its contents.
 * If the directory does not exist, it is created.
 */
export declare function emptyDir(dirPath: string): Promise<void>;
/**
 * Alias for `ensureDir()`.
 */
export declare const mkdirs: typeof ensureDir;
/**
 * Reads a file safely, returning `null` if it doesn't exist.
 * If `encoding` is `null`, returns a Buffer.
 */
export declare function readFileSafe(filePath: string, encoding?: BufferEncoding | null): Promise<string | Buffer | null>;
/**
 * Checks if a path is a directory.
 */
export declare function isDirectory(path: string): Promise<boolean>;
/**
 * Checks if a path is a file.
 */
export declare function isFile(path: string): Promise<boolean>;
/**
 * Recursively lists all files in a directory (parallelized for performance).
 */
export declare function listFiles(dirPath: string): Promise<string[]>;
export * from "./types.js";
export * from "./find.js";
export * from "./env.js";
export * from "./upwards.js";
export * from "./package.js";
//# sourceMappingURL=index.d.ts.map