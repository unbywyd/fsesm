import { UpdateJsonFunc } from "./types.js";
export type FindEnvFileOptions = {
    cwd?: string;
    name?: string;
    maxDepth?: number;
};
/**
 * Finds the nearest `.env` file.
 * Returns `null` if the file does not exist.
 * @param options FindEnvFileOptions to find the `.env` file.
 * @returns The path to the `.env` file.
 */
export declare function findEnvFile(options?: FindEnvFileOptions): Promise<string | null>;
/**
 * Reads the nearest `.env` file.
 * Returns `null` if the file does not exist.
 * @param options FindEnvFileOptions to find the `.env` file.
 * @returns The path and parsed `.env` data.
 */
export declare function readEnvFile<T extends Record<string, any> = Record<string, any>>(options?: FindEnvFileOptions): Promise<{
    path: string;
    data: T;
} | null>;
/**
* Parses a string of environment variables into an object.
* @param source The source string to parse.
* @param returnEmptyAsNull Whether to return empty values as `null`.
* @returns The parsed object.
*/
export declare function parseEnv<T extends Record<string, any> = Record<string, string | number | boolean | null>>(source: string, returnEmptyAsNull?: boolean): T;
/**
 * Writes a key-value pair to an `.env` file.
 * If the key already exists, it will be updated.
 * @param envPath The path to the `.env` file.
 * @param key The key to write.
 * @param value The value to write.
 * @param onlyIfEmpty Whether to write only if the key is empty.
 */
export declare function writeEnvVar(envPath: string, key: string, value: string, onlyIfEmpty?: boolean): Promise<void>;
export declare function getEmptyEnvKeys<T extends Record<string, any> = Record<string, any>>(envPath: string): Promise<(keyof T)[]>;
/**
 * Writes a record of key-value pairs to an `.env` file.
 * If the key already exists, it will be updated.
 * @param envPath The path to the `.env` file.
 * @param record The record to write.
 */
export declare function writeEnvRecord(envPath: string, record: Record<string, string>): Promise<void>;
/**
 * Updates an `.env` file using an async updater function.
 * The updater receives the current data and should return the updated data.
 * @param envPath The path to the `.env` file.
 * @param update Function to update the `.env` data.
 */
export declare function updateEnv<T extends Record<string, any> = Record<string, any>>(envPath: string, update: UpdateJsonFunc<T>): Promise<void>;
//# sourceMappingURL=env.d.ts.map