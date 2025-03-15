import { access, constants, lstat } from "node:fs/promises";
import { join, dirname } from "node:path";

export type FindFileUpwardsOptions = {
    cwd?: string;
    maxDepth?: number;
};

/**
 * Finds a file by searching upwards from the current working directory.
 * Returns `null` if the file does not exist.
 * @param fileName The name of the file to find.
 * @param options FindFileUpwardsOptions to find the file.
 * @returns The path to the file.
 */
export async function findFileUpwards(
    fileName: string,
    options: FindFileUpwardsOptions = {}
): Promise<string | null> {
    if (!fileName || typeof fileName !== "string") {
        throw new Error("fileName must be a non-empty string");
    }

    const cwd = options.cwd ?? process.cwd();
    const maxDepth = options.maxDepth ?? Infinity;
    let currentPath = cwd;
    let depth = 0;

    while (depth <= maxDepth) {
        const filePath = join(currentPath, fileName);
        try {
            await access(filePath, constants.F_OK);

            const stats = await lstat(filePath);
            if (stats.isFile()) {
                return filePath;
            }
        } catch (err: any) {
            if (err.code !== "ENOENT" && err.code !== "EACCES" && err.code !== "EPERM") {
                throw err;
            }
        }

        const parentPath = dirname(currentPath);
        if (parentPath === currentPath) break;
        currentPath = parentPath;
        depth++;
    }

    return null;
}