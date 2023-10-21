import {useState} from "react"
import {ReactSetState} from "../types/React.ts"

export class State<T> {
    readonly value: T
    readonly setValue: ReactSetState<T>

    constructor(value: T, setValue: ReactSetState<T>) {
        this.value = value
        this.setValue = setValue
    }

    destruct(): [T, ReactSetState<T>] {
        return [this.value, this.setValue]
    }

    mapValue(newValue: T): State<T> {
        return new State<T>(newValue, this.setValue)
    }

    onSet(callback: (newValue: T) => void): State<T> {
        return new State(this.value, (newValue) => {
            if (typeof newValue === "function") {
                const newValueHandler = newValue as ((value: T) => T)
                this.setValue((prevState) => {
                    const updatedValue = newValueHandler(prevState)
                    callback(updatedValue)
                    return updatedValue
                })
            } else {
                callback(newValue)
                this.setValue(newValue)
            }
        })
    }

    mapType<R>(oldToNew: (old: T) => R, newToOld: (value: R) => T): State<R> {
        return new State(oldToNew(this.value), (newValue) => {
            if (typeof newValue === "function") {
                const newValueHandler = newValue as ((value: R) => R)
                this.setValue((prevState) => {
                    const updatedValue = newValueHandler(oldToNew(prevState))
                    return newToOld(updatedValue)
                })
            } else {
                this.setValue(newToOld(newValue))
            }
        })
    }

    field<F extends keyof T>(field: F): State<T[F]> {
        return this.mapType(range => range[field], fieldValue => ({...this.value, [field]: fieldValue}))
    }
}

export function useStateObject<T>(initial: T): State<T> {
    const [value, setValue] = useState(initial)
    return new State<T>(value, setValue)
}

