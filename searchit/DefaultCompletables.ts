import {keyValuesCompletable} from "./SyncCompletable"

const AllDateOptions = [
    "today",
    "yesterday",
    "lastWeek",
    "lastMonth"
]

// Prepend "from/to" to all available dates
// const allDateCompletions: Completion[] = keyValuesCompletable("") AllDateOptions.flatMap(s => [
//         spacedCompletion(`from:${s}`), spacedCompletion(`to:${s}`)
//     ]
// )


// const dateCompletable = substringCompletable(allDateCompletions)
export const defaultCompletables = [keyValuesCompletable("from", AllDateOptions), keyValuesCompletable("to", AllDateOptions)]