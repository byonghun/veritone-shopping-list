// Use this for predictable ids
let id = 0;
export const nanoid = (): string => `test-id-${++id}`;

export const __reset = (): void => {
  id = 0;
};
