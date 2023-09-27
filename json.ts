/* eslint-disable @typescript-eslint/no-unsafe-return */
import dayjs from "dayjs";

/**
 * Considering there are multiple ways to serialize a value into JSON, fudge-lib api methods
 * accept a JsonSerializer when automatic JSON serialization is involved.
 * Use {@link defaultJsonSerializer} when you don't need a custom implementation.
 */
export interface JsonSerializer<T> {
    stringify(obj: unknown): string

    parse(string: string): T
}

/**
 * This serializer detects strings that are ISO dates and converts them to dayjs
 */
export function defaultJsonSerializer<T>(): JsonSerializer<T> {
    return {
        parse<T>(string: string): T {
            return JSON.parse(string, (_, value) => {
                // By default, handle reading dayjs instances
                if (typeof value === "string" && isIsoString(value)) {
                    return dayjs(value)
                }
                return value
            })
        },
        stringify(obj: unknown): string {
            // By default, write dayjs instances in a special format, so they can be easily parsed
            return JSON.stringify(obj)
        }
    }
}

// Detects this as an example: 2023-09-15T13:07:11.913Z
function isIsoString(string: string): boolean {
    if (string.length !== 24) return false
    for (let i = 0; i < string.length; i++) {
        const char = string[i]
        // This is faster than it looks because it usually exits at the first branch or the length check above
        if (i <= 3) {
            if (!char.isDigit()) return false
        } else if (i === 4) {
            if (char !== "-") return false
        } else if (i <= 6) {
            if (!char.isDigit()) return false
        } else if (i === 7) {
            if (char !== "-") return false
        } else if (i <= 9) {
            if (!char.isDigit()) return false
        } else if (i === 10) {
            if (char !== "T") return false
        } else if (i <= 12) {
            if (!char.isDigit()) return false
        } else if (i === 13) {
            if (char !== ":") return false
        } else if (i <= 15) {
            if (!char.isDigit()) return false
        } else if (i === 16) {
            if (char !== ":") return false
        } else if (i <= 18) {
            if (!char.isDigit()) return false
        } else if (i === 19) {
            if (char !== ".") return false
        } else if (i <= 22) {
            if (!char.isDigit()) return false
        } else if (i === 23) {
            if (char !== "Z") return false
        } else if (i === 24) return false
        i++
    }
    return true
}

