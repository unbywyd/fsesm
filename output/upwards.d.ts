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
export declare function findFileUpwards(fileName: string, options?: FindFileUpwardsOptions): Promise<string | null>;
//# sourceMappingURL=upwards.d.ts.map