import {Completeable, Completion} from "./SearchitBar"

/**
 * Easy implementation for completable that assumes no server work is needed for getting the completion results.
 * For server-based completions, implement `Completable` directly.
 */
export function syncCompletable(options: (text: string) => Completion[]): Completeable {
    return {
        options: (text) => {
            const value = options(text)
            return Promise.resolve(value);
        },
        cancel: () => {
        }
    }
}

/**
 * Easiest implementation for completable - will simply show all completions that are a superstring of the typed word (Case-insensitive).
 */
export function substringSyncCompletable(completions: Completion[]): Completeable {
    return syncCompletable(text => {
        return completions.filter(completion => {
            const lowercaseLabel = completion.label.toLowerCase()
            const lowercaseText = text.toLowerCase()
            return lowercaseLabel.includes(lowercaseText) && lowercaseLabel !== lowercaseText;
        })
    })
}