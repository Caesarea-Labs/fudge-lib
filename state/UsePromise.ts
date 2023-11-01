import {useEffect, useState} from "react"

/**
 * MIGRATION NOTE - New usePromise() now returns an array instead of a single value.
 * To make it compile, do `[value] = usePromise()` instead of `value = usePromise()`
 * HOWEVER all usages of usePromise() should optimally do `[value, loading] = usePromise()` and show some sort of loading indicator while
 * `loading` is true. This is because `value` will no longer be undefined after the first value has been received.
 * This is generally better because old usages of usePromise() would just completely lose all content while a new value is being loaded, leading
 * to bad user experience.
 *
 * Effect for easily using Promises in React components.
 * Normally, once the deps change the value will be set to undefined and the promise function will be called again to get a new value.
 * This behavior makes sense for when the existing data is no longer relevant when the deps change.
 * If retainValueBetweenChanges is true, once the deps change the value will be kept as-is,
 * and once the promise function has resolved again it will instantly switch to the new value.
 * This behavior makes more sense when the existing data is still relevant even when deps change,
 * for example when the promise simply fetches an update for the same data.
 * @return T | undefined: The result of the promise or undefined if no promise has been resolved yet.
 * @return boolean: Whether a promise is currently in the process of being resolved. Use this to know whether we are "loading".
 */
export function usePromise<T>(promise: () => Promise<NonNullable<T>> | T, deps: unknown[]): [T | undefined, boolean] {
    const [result, setResult] = useState<PromiseState<T>>({kind: "loading"})

    useEffect(() => {
        setResult({kind: "loading"})
        void Promise.resolve(promise()).then(newValue => {
            setResult({kind: "success", value: newValue})
        }).catch(err => {
            setResult({kind: "error", error: err})
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps)
    switch (result.kind) {
        case "loading":
            return [undefined, true]
        case "success":
            return [result.value, false]
        case "error":
            throw result.error
    }
}


interface PromiseError {
    error: unknown
    kind: "error"
}

interface PromiseFulfilled<T> {
    value: T
    kind: "success"
}

interface PromiseLoading {
    kind: "loading"
}

type PromiseState<T> = PromiseLoading | PromiseFulfilled<T> | PromiseError

