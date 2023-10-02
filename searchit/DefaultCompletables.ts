import {Completion} from "./SearchitBar"
import {insertWithSpaceCompletion, substringSyncCompletable} from "./SyncCompletable"

const AllDateOptions = [
    "today",
    "yesterday",
    "lastWeek",
    "lastMonth"
]

// Prepend "from/to" to all available dates
const allDateCompletions: Completion[] = AllDateOptions.flatMap(s => [
        insertWithSpaceCompletion(`from:${s}`), insertWithSpaceCompletion(`to:${s}`)
    ]
)


const dateCompletable = substringSyncCompletable(allDateCompletions)
export const defaultCompletables = [dateCompletable]