interface AwaitedProps<T> {
  promise: Promise<T>
  children: (value: T) => JSX.Element
}

/**
 * This allows to break promises without the need of creating new component
 *
 * @example
 * ```tsx
 * // Inside server component
 * <Suspense fallback={...}>
 *   <Await promise={somePromise}>
 *     {(res) => (
 *       <li>
 *         {res.map(({ id }) => (
 *           <li key={id}>{id}</li>
 *         ))}
 *       </li>
 *     )}
 *   </Await>
 * </Suspense>
 * ```
 */
export async function Await<T>({ promise, children }: AwaitedProps<T>) {
  return children(await promise)
}

// TODO: Implement Awaited Component
