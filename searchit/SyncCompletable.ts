import {Completable, Completion} from "./SearchitBar"


/**
 * Easy implementation for completable that assumes no server work is needed for getting the completion results.
 * For server-based completions, implement `Completable` directly.
 */
export function syncCompletable(options: (text: string) => Completion[]): Completable {
    return {
        options: (text) => {
            const value = options(text)
            return Promise.resolve(value)
        },
        cancel: () => {
        }
    }
}


/**
 * Easiest implementation for completable - will simply show all completions that are a superstring of the typed word (Case-insensitive).
 */
export function substringCompletable(completions: Completion[]): Completable {
    return syncCompletable(text => {
        return completions.filter(completion => {
            const lowercaseLabel = completion.label.toLowerCase()
            const lowercaseText = text.toLowerCase()
            return includesPartially(lowercaseLabel, lowercaseText)
        })
    })
}

/**
 * Completes the key with the given values in a key-value expression.
 */
export function keyValuesCompletable(key: string, values: string[]): Completable {
    const keyExpression = key + ":"
    const lowercaseKey = keyExpression.toLowerCase()
    return syncCompletable(text => {
        const lowercaseText = text.toLowerCase()
        if (lowercaseText.startsWith(keyExpression) && text.includes(":")) {
            // Complete value
            const inputtedValue = lowercaseText.removeBeforeFirstExclusive(":")
            return values.filter(value => includesPartially(value.toLowerCase(), inputtedValue))
                         .map(value => ({label: value, newText: keyExpression + value + " "}))
        } else if (includesPartially(lowercaseKey, lowercaseText)) {
            // Complete key
            return [{label: keyExpression, newText: keyExpression, terminator: false}]
        } else {
            return []
        }

    })
}

function includesPartially(string: string, toInclude: string): boolean {
    return string.includes(toInclude) && string !== toInclude
}

/**
 * Simple {@link Completion} that has the label of the specified text and inserts a space after completing it.
 */
export function spacedCompletion(text: string): Completion {
    return {
        label: text,
        newText: `${text} `
    }
}

/**
 * Simple {@link Completion} with the label of the specified text that inserts that simply completes that text.
 */
export function identityCompletion(text: string): Completion {
    return {
        label: text,
        newText: text
    }
}