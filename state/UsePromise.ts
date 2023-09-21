import {useEffect, useState} from "react";

/**
 * Effect for easily using Promises in React components.
 * Normally, once the deps change the value will be set to undefined and the promise function will be called again to get a new value.
 * This behavior makes sense for when the existing data is no longer relevant when the deps changes.
 * If retainValueBetweenChanges is true, once the deps change the value will be kept as-is,
 * and once the promise function has resolved again it will instantly switch to the new value.
 * This behavior makes more sense when the existing data is still relevant even when deps change,
 * for example when the promise simply fetches an update for the same data.
 */
export function usePromise<T>(promise: () => Promise<NonNullable<T>> | T, deps: unknown[], retainValueBetweenChanges?: boolean): T | undefined {
    const [result, setResult] = useState<T | undefined>(undefined)

    useEffect(() => {
        if (retainValueBetweenChanges !== true) setResult(undefined);
        void Promise.resolve(promise()).then(setResult)
    }, deps)
    return result
}
