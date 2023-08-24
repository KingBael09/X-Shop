/**
 * Utility type to extract all inheretances
 */
export type Prettify<T> = {
  [K in keyof T]: T[K]
} & object

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type FunctionType = (...args: any[]) => any

/**
 * Utility type to unwrap return type of an async function
 */
export type PromiseReturnType<T extends FunctionType> = Awaited<ReturnType<T>>

/**
 * Augmented Omit utility which suggests parameters
 */
export type FancyOmit<T, K extends keyof T> = Omit<T, K>
