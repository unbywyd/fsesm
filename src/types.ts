export type UpdateJsonFunc<T extends Record<string, any> = Record<string, any>> = (data: T) => Promise<T> | T;
