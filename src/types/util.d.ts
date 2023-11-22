/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Utility type to extract all inheretances
 */
export type Prettify<T> = {
  [K in keyof T]: T[K]
} & object

/**
 * Utility type to unwrap return type of an async function
 */
export type PromiseReturnType<T extends (...args: any[]) => any> = Awaited<
  ReturnType<T>
>

/**
 * Augmented Omit utility which suggests parameters
 */
export type FancyOmit<T, K extends keyof T> = Omit<T, K>

/**
 * Deconstructs objects key into a union of its values.
 *
 * @example
 * const Foo = { a: "a", b: "b" } as const
 *
 * type FKeys = FancyKeys<typeof FOO>
 * //   ^?  "a" | "b"
 *
 */
export type Deconstructed<T> = T[keyof T]

// TODO: Implement UseOptimistic when it is available in stable

// TODO: Learn how to change console.log default depth to infinity by some declaration magik
/**
 * console.log(user)
 * console.dir(user, { depth: Infinity })
 */

declare module "*.png"
