type GlobOptions = {
    cwd?: string;
    maxDepth?: number;
    ignore?: string | string[];
    matchFilesWithoutExtensions?: boolean;
    absolute?: boolean;
    useGitignore?: boolean;
    type?: 'files' | 'folders' | 'all';
};
/**
 * Finds files and folders matching glob patterns.
 * @param patterns Glob patterns to search for.
 * @param options GlobOptions to configure the search.
 * @returns A promise that resolves to an array of matching paths.
 */
export declare function find(patterns: string | string[], options?: GlobOptions): Promise<string[]>;
export {};
//# sourceMappingURL=find.d.ts.map