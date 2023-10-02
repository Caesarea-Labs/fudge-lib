import {Completion} from "./SearchitBar";
import {substringSyncCompletable, syncCompletable} from "./SyncCompletable";

const AllDateOptions = [
    "today",
    "yesterday",
    "lastWeek",
    "lastMonth"
]

// Prepend "from/to" to all available dates
const allDateCompletions: Completion[] = AllDateOptions.map(s => {
    const atLeast = `from:${s}`
    return {label: atLeast, newText: atLeast + " "}
}).concat(AllDateOptions.map(s => {
    const exact = `to:${s}`
    return {label: exact, newText: exact + " "}
}))

const dateCompletable = substringSyncCompletable(allDateCompletions)
export const defaultCompletables = [dateCompletable]