/**
 * When you have a function that sometimes gets called too many times in a short span without your control,
 * you can use this call to deduplicate your calls.
 * First construct a static instance of CallDeduplicator<T>, and then functions executed with call() will be deduplicated.
 */
export class CallDeduplicator<T> {
    private lastCallTime: number | undefined = undefined
    private lastResult: unknown /*| undefined*/ = undefined
    private readonly duplicateIntervalMs: number

    /**
     * @param duplicateIntervalMs The amount of time in milliseconds that if multiple calls happen in that timespan,
     * the call() callback won't be called again and will instead reuse the previous value
     */
    constructor(duplicateIntervalMs: number) {
        this.duplicateIntervalMs = duplicateIntervalMs
    }

    /**
     * Executes the provided callback, but if this is called only shortly thereafter (the amount of time specified by duplicateIntervalMs),
     * then the callback won't be executed again and the previous value will be used.
     */
    call(func: () => T): T {
        const now = Date.now()
        if (this.lastCallTime !== undefined && now - this.lastCallTime < this.duplicateIntervalMs) {
            return this.lastResult as T
        }
        this.lastCallTime = now
        const result = func()
        this.lastResult = result
        return result
    }
}