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
export declare function findPackageJson(options?: FindPackageJsonOptions): Promise<string | null>;
/**
 * Reads the nearest `package.json` file.
 * Returns `null` if the file does not exist.
 * @param options FindPackageJsonOptions to find the `package.json` file.
 * @returns The path and parsed JSON data.
 */
export declare function readPackageJson<T extends Record<string, any> = Record<string, any>>(options?: FindPackageJsonOptions): Promise<{
    path: string;
    data: T;
} | null>;
/**
 * Updates the nearest `package.json` file.
 * Returns `null` if the file does not exist.
 * @param options FindPackageJsonOptions to find the `package.json` file.
 * @param update Function to update the JSON data.
 * @returns The updated JSON data.
 */
export declare function updatePackageJson<T extends Record<string, any> = Record<string, any>>(options: FindPackageJsonOptions, update: UpdateJsonFunc<T>): Promise<T | null>;
//# sourceMappingURL=package.d.ts.map