import { opendir, readFile } from 'node:fs/promises';
import path from 'node:path';

type GlobOptions = {
    cwd?: string;
    maxDepth?: number;
    ignore?: string | string[];
    matchFilesWithoutExtensions?: boolean;
    absolute?: boolean;
    useGitignore?: boolean;
    type?: 'files' | 'folders' | 'all'; // New option: search type
};

/**
 * Finds files and folders matching glob patterns.
 * @param patterns Glob patterns to search for.
 * @param options GlobOptions to configure the search.
 * @returns A promise that resolves to an array of matching paths.
 */
export async function find(
    patterns: string | string[],
    options: GlobOptions = {}
): Promise<string[]> {
    const {
        cwd = process.cwd(),
        maxDepth = Infinity,
        ignore = [],
        matchFilesWithoutExtensions = true,
        absolute = false,
        useGitignore = false,
        type = 'files', // Default to searching for files
    } = options;

    const baseDir = path.resolve(cwd);
    const results: string[] = [];

    // Normalize patterns and compile to regular expressions
    const patternList = Array.isArray(patterns) ? patterns : [patterns];
    const normalizedPatterns = patternList.map((p) => p.replace(/\\/g, '/'));
    const matchers = normalizedPatterns.map(globToRegex);

    // Load and combine ignore patterns from .gitignore
    const gitignorePatterns = useGitignore ? await loadGitignore(baseDir) : [];
    const ignoreList = [...(Array.isArray(ignore) ? ignore : [ignore]), ...gitignorePatterns];

    // Normalize ignore patterns and separate into negative and regular
    const ignoreMatchers: RegExp[] = [];
    const ignoreNegMatchers: RegExp[] = [];
    for (const ign of ignoreList) {
        const normIgn = ign.replace(/\\/g, '/');
        if (normIgn.startsWith('!')) {
            ignoreNegMatchers.push(globToRegex(normIgn.substring(1)));
        } else {
            ignoreMatchers.push(globToRegex(normIgn));
        }
    }

    /**
     * Recursive directory traversal and collection of matching files/folders.
     */
    async function walk(dirPath: string, currentDepth: number) {
        if (currentDepth > maxDepth) return;

        try {
            const dir = await opendir(dirPath);
            const promises: Promise<void>[] = [];

            for await (const dirent of dir) {
                const name = dirent.name;
                const fullPath = path.join(dirPath, name);
                const relPath = path.relative(baseDir, fullPath);
                const relPathUnix = relPath.split(path.sep).join('/');

                if (isIgnored(relPathUnix)) continue;

                if (dirent.isDirectory()) {
                    if (type === 'folders' || type === 'all') {
                        if (matchers.some(matcher => matcher.test(relPathUnix))) {
                            results.push(absolute ? path.resolve(baseDir, relPath) : relPath);
                        }
                    }

                    if (currentDepth < maxDepth) {
                        promises.push(walk(fullPath, currentDepth + 1));
                    }
                } else if (dirent.isFile() && (type === 'files' || type === 'all')) {
                    if (!matchFilesWithoutExtensions && path.extname(name) === '') continue;

                    if (matchers.some(matcher => matcher.test(relPathUnix))) {
                        results.push(absolute ? path.resolve(baseDir, relPath) : relPath);
                    }
                }
            }

            await Promise.all(promises);
        } catch (err) {
            console.error(`Error reading directory ${dirPath}:`, err);
        }
    }

    await walk(baseDir, 0);
    return results;

    /**
     * Checks if a path should be ignored.
     */
    function isIgnored(relPathUnix: string): boolean {
        if (ignoreNegMatchers.some((matcher) => matcher.test(relPathUnix))) {
            return false;
        }
        if (ignoreMatchers.some((matcher) => matcher.test(relPathUnix))) {
            return true;
        }
        return false;
    }

    /**
     * Converts a glob pattern to a regular expression.
     */
    function globToRegex(pattern: string): RegExp {
        let escaped = pattern
            .replace(/[.+^${}()|[\]\\]/g, "\\$&")
            .replace(/\?/g, "[^/]")
            .replace(/\*\*\//g, "(?:.+/)?")
            .replace(/\*/g, "[^/]*");

        return new RegExp(`^${escaped}$`);
    }

    /**
     * Loads and parses the .gitignore file.
     */
    async function loadGitignore(dir: string): Promise<string[]> {
        try {
            const gitignorePath = path.join(dir, '.gitignore');
            const content = await readFile(gitignorePath, 'utf-8');
            return content
                .split('\n')
                .map((line) => line.trim())
                .filter((line) => line && !line.startsWith('#'));
        } catch {
            return [];
        }
    }
}