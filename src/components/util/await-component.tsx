interface AwaitedProps<T> {
  promise: Promise<T>
  children: (value: T) => React.JSX.Element | null | boolean
}

/**
 * #### *Must be used in server components*
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
