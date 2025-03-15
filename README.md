# **FSESM 🚀 - Modern FS Utilities for ESM & TypeScript Projects**

[![NPM Version](https://img.shields.io/npm/v/fsesm?style=flat-square)](https://www.npmjs.com/package/fsesm)
[![GitHub Stars](https://img.shields.io/github/stars/unbywyd/fsesm?style=flat-square)](https://github.com/unbywyd/fsesm/stargazers)
[![License: MIT](https://img.shields.io/github/license/unbywyd/fsesm?style=flat-square)](LICENSE)

### **A modern, lightweight utility library for working with the file system in ESM and TypeScript projects.**

---

## **🔹 What is FSESM?**

FSESM is a **collection of utility functions** designed to simplify file system operations in **ESM (ECMAScript Modules)** and **TypeScript** projects. It provides **sugar-coated methods** for common tasks like reading, writing, moving, and managing files and directories, while avoiding unnecessary dependencies and keeping your code clean.

With FSESM, you can:

- **Handle files and directories** with ease.
- **Work with JSON and `.env` files** seamlessly.
- **Ensure directories and files exist** before operations.
- **Recursively list files** or check file types.
- **Manage `.env` variables** programmatically.

✅ **Modern.**  
🚀 **Lightweight.**  
🛠️ **TypeScript-first.**

---

## **🚀 Quick Start**

Install FSESM via npm:

```bash
npm install fsesm
```

---

## **🔍 Key Features**

### **1️⃣ File System Utilities**

- **Ensure directories and files exist** before operations.
- **Read, write, and update JSON files** with ease.
- **Move, copy, and remove files/directories** safely.
- **Recursively list files** in a directory.

### **2️⃣ `.env` File Management**

- **Read, write, and update `.env` files** programmatically.
- **Find missing or empty `.env` keys**.
- **Parse `.env` files** into objects with automatic type conversion.

### **3️⃣ Advanced Utilities**

- **Find files upwards** from a directory (e.g., `package.json` or `.env`).
- **Simple glob-based file searching** with support for `.gitignore`.
- **Symlink management** with safety checks.

---

## **📦 Installation**

Install FSESM globally or locally:

```bash
npm install -g fsesm
```

Or add it to your project:

```bash
npm install fsesm
```

---

## **📋 All Methods at a Glance**

| **Method**                                          | **Description**                                                                 | **Parameters**                                                                    |
| --------------------------------------------------- | ------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| **`ensureDir(dirPath)`**                            | Ensures a directory exists. Creates it recursively if missing.                  | `dirPath: string`                                                                 |
| **`ensureFile(filePath)`**                          | Ensures a file exists. Creates parent directories and an empty file if missing. | `filePath: string`                                                                |
| **`readJson<T>(filePath)`**                         | Reads and parses a JSON file. Returns `null` if the file is missing or invalid. | `filePath: string`                                                                |
| **`writeJson(filePath, data)`**                     | Writes an object to a JSON file. Creates parent directories if needed.          | `filePath: string`, `data: unknown`                                               |
| **`updateJson<T>(filePath, updater)`**              | Updates a JSON file using an async updater function.                            | `filePath: string`, `updater: (data: T) => Promise<T> \| T`                       |
| **`outputFile(filePath, data)`**                    | Writes data to a file, ensuring parent directories exist.                       | `filePath: string`, `data: string \| Buffer`                                      |
| **`move(src, dest, overwrite)`**                    | Moves a file or directory. Handles cross-device moves by copying and deleting.  | `src: string`, `dest: string`, `overwrite: boolean = false`                       |
| **`copy(src, dest)`**                               | Copies a file or directory recursively.                                         | `src: string`, `dest: string`                                                     |
| **`remove(path)`**                                  | Removes a file or directory recursively.                                        | `path: string`                                                                    |
| **`pathExists(path)`**                              | Checks if a file or directory exists.                                           | `path: string`                                                                    |
| **`ensureSymlink(src, dest, type)`**                | Ensures a symbolic link exists at the destination.                              | `src: string`, `dest: string`, `type?: "file" \| "dir" \| "junction"`             |
| **`emptyDir(dirPath)`**                             | Empties a directory by removing its contents. Creates the directory if missing. | `dirPath: string`                                                                 |
| **`readFileSafe(filePath, encoding)`**              | Reads a file safely. Returns `null` if the file doesn't exist.                  | `filePath: string`, `encoding: BufferEncoding \| null = "utf-8"`                  |
| **`isDirectory(path)`**                             | Checks if a path is a directory.                                                | `path: string`                                                                    |
| **`isFile(path)`**                                  | Checks if a path is a file.                                                     | `path: string`                                                                    |
| **`listFiles(dirPath)`**                            | Recursively lists all files in a directory.                                     | `dirPath: string`                                                                 |
| **`findPackageJson(options)`**                      | Finds the nearest `package.json` file.                                          | `options: { cwd?: string, maxDepth?: number }`                                    |
| **`readPackageJson<T>(options)`**                   | Reads and parses the nearest `package.json` file.                               | `options: { cwd?: string, maxDepth?: number }`                                    |
| **`updatePackageJson<T>(options, updater)`**        | Updates the nearest `package.json` file using an async updater function.        | `options: { cwd?: string, maxDepth?: number }`, `updater: UpdateJsonFunc<T>`      |
| **`findEnvFile(options)`**                          | Finds the nearest `.env` file.                                                  | `options: { cwd?: string, name?: string, maxDepth?: number }`                     |
| **`readEnvFile<T>(options)`**                       | Reads and parses the nearest `.env` file.                                       | `options: { cwd?: string, name?: string, maxDepth?: number }`                     |
| **`writeEnvVar(envPath, key, value, onlyIfEmpty)`** | Writes a key-value pair to a `.env` file. Updates if the key exists.            | `envPath: string`, `key: string`, `value: string`, `onlyIfEmpty: boolean = false` |
| **`getEmptyEnvKeys(envPath)`**                      | Finds empty or missing keys in a `.env` file.                                   | `envPath: string`                                                                 |
| **`writeEnvRecord(envPath, record)`**               | Writes a record of key-value pairs to a `.env` file.                            | `envPath: string`, `record: Record<string, string>`                               |
| **`updateEnv<T>(envPath, updater)`**                | Updates a `.env` file using an async updater function.                          | `envPath: string`, `updater: UpdateJsonFunc<T>`                                   |
| **`findFileUpwards(fileName, options)`**            | Finds a file by searching upwards from a directory.                             | `fileName: string`, `options: { cwd?: string, maxDepth?: number }`                |
| **`find(patterns, options)`**                       | Finds files or folders matching glob patterns.                                  | `patterns: string \| string[]`, `options: GlobOptions`                            |

---

### **GlobOptions**

| **Option**                    | **Description**                                                                      |
| ----------------------------- | ------------------------------------------------------------------------------------ |
| `cwd`                         | The directory to start searching from. Default: `process.cwd()`.                     |
| `maxDepth`                    | Maximum depth to search. Default: `Infinity`.                                        |
| `ignore`                      | Patterns to ignore. Can include negations (e.g., `!**/node_modules/**`).             |
| `matchFilesWithoutExtensions` | Whether to match files without extensions. Default: `true`.                          |
| `absolute`                    | Whether to return absolute paths. Default: `false`.                                  |
| `useGitignore`                | Whether to respect `.gitignore` files. Default: `false`.                             |
| `type`                        | Type of items to search for: `'files'`, `'folders'`, or `'all'`. Default: `'files'`. |

---

## **🛠️ Methods & Examples**

### **1️⃣ File System Utilities**

#### **`ensureDir(dirPath: string): Promise<void>`**

Ensures a directory exists. Creates it recursively if it doesn't.

```typescript
import { ensureDir } from "fsesm";

await ensureDir("./path/to/directory");
```

#### **`ensureFile(filePath: string): Promise<void>`**

Ensures a file exists. Creates parent directories and an empty file if missing.

```typescript
import { ensureFile } from "fsesm";

await ensureFile("./path/to/file.txt");
```

#### **`readJson<T = unknown>(filePath: string): Promise<T | null>`**

Reads and parses a JSON file. Returns `null` if the file doesn't exist or has invalid JSON.

```typescript
import { readJson } from "fsesm";

const data = await readJson<{ key: string }>("./path/to/file.json");
```

#### **`writeJson(filePath: string, data: unknown): Promise<void>`**

Writes an object to a JSON file. Creates parent directories if needed.

```typescript
import { writeJson } from "fsesm";

await writeJson("./path/to/file.json", { key: "value" });
```

#### **`move(src: string, dest: string, overwrite = false): Promise<void>`**

Moves a file or directory. Handles cross-device moves by copying and deleting.

```typescript
import { move } from "fsesm";

await move("./source/file.txt", "./destination/file.txt");
```

#### **`copy(src: string, dest: string): Promise<void>`**

Copies a file or directory recursively.

```typescript
import { copy } from "fsesm";

await copy("./source/file.txt", "./destination/file.txt");
```

#### **`remove(path: string): Promise<void>`**

Removes a file or directory recursively.

```typescript
import { remove } from "fsesm";

await remove("./path/to/delete");
```

---

### **2️⃣ `.env` File Management**

#### **`readEnvFile<T = Record<string, any>>(options: FindEnvFileOptions): Promise<{ path: string; data: T } | null>`**

Reads and parses a `.env` file into an object.

```typescript
import { readEnvFile } from "fsesm";

const env = await readEnvFile<{ API_KEY: string }>();
```

#### **`writeEnvVar(envPath: string, key: string, value: string, onlyIfEmpty = false): Promise<void>`**

Writes a key-value pair to a `.env` file. Updates the value if the key exists.

```typescript
import { writeEnvVar } from "fsesm";

await writeEnvVar("./.env", "API_KEY", "your-api-key");
```

#### **`getEmptyEnvKeys(envPath: string): Promise<string[]>`**

Finds keys in a `.env` file that are empty or missing.

```typescript
import { getEmptyEnvKeys } from "fsesm";

const missingKeys = await getEmptyEnvKeys("./.env");
```

---

### **3️⃣ Advanced Utilities**

#### **`findFileUpwards(fileName: string, options: FindFileUpwardsOptions): Promise<string | null>`**

Finds a file by searching upwards from the current directory.

```typescript
import { findFileUpwards } from "fsesm";

const packageJsonPath = await findFileUpwards("package.json");
```

#### **`find(patterns: string | string[], options: GlobOptions): Promise<string[]>`**

Finds files or folders matching glob patterns.

```typescript
import { find } from "fsesm";

const files = await find("**/*.ts", { cwd: "./src" });
```

#### **`ensureSymlink(src: string, dest: string, type?: "file" | "dir" | "junction"): Promise<void>`**

Ensures a symbolic link exists at the destination.

```typescript
import { ensureSymlink } from "fsesm";

await ensureSymlink("./source/file.txt", "./destination/link.txt");
```

---

## **🔐 Why FSESM?**

- **No unnecessary dependencies.**
- **Fully typed for TypeScript.**
- **Works seamlessly with ESM projects.**
- **Handles edge cases gracefully.**
- **Lightweight and fast.**

---

## **📜 License**

FSESM is licensed under the **MIT License**.  
© 2025 [Unbywyd](https://unbywyd.com).

---

## **🔗 Links**

🔹 **NPM:** [FSESM on NPM](https://www.npmjs.com/package/fsesm)  
🔹 **GitHub:** [FSESM Repository](https://github.com/unbywyd/fsesm)  
🔹 **Issues:** [Report a bug](https://github.com/unbywyd/fsesm/issues)

---

### **🚀 Simplify your file system operations with FSESM!**

Need more features? Open an issue or contribute on **GitHub**! 😊
