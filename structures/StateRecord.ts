import {useState} from "react"
import {TsKey} from "../types/Basic"


/**
 * Record that uses React state to make it so when the record is modified, components will get re-rendered.
 */
export interface StateRecord<K extends TsKey, V> {
    delete(key: K): void

    set(key: K, value: V): void

    values(): V[]
}

export function useStateRecord<K extends TsKey, V>(initialRecord?: Record<K, V>): StateRecord<K, V> {
    const [record, setRecord] = useState<Record<K, V>>(initialRecord ?? {} as Record<K, V>)
    return {
        delete(key: K) {
            setRecord(old => {
                delete old[key]
                return old
            })
        },
        values(): V[] {
            return Object.values(record)
        },
        set(key: K, value: V) {
            setRecord(old => {
                old[key] = value
                return old
            })
        }
    }
}