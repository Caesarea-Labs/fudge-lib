import {keyValuesCompletable} from "./SyncCompletable"

const AllDateOptions = [
    "today",
    "yesterday",
    "lastWeek",
    "lastMonth"
]

export const defaultCompletables = [keyValuesCompletable("from", AllDateOptions), keyValuesCompletable("to", AllDateOptions)]