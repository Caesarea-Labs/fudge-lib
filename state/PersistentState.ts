import {State, useStateObject} from "./State";
import {defaultJsonSerializer, JsonSerializer} from "../json";

export class PersistentValue<T> {
    private readonly key: string
    private readonly serializer: JsonSerializer<T>

    constructor(key: string, parser?: JsonSerializer<T>) {
        this.key = key;
        this.serializer = parser ?? defaultJsonSerializer()
    }

    getValue(): T | null {
        const result = localStorage.getItem(this.key);
        if (result === null) return null
        return this.serializer.parse(result)
    }

    setValue(value: T) {
        localStorage.setItem(this.key, this.serializer.stringify(value))
    }
}


export function usePersistentState<T>(key: string, defaultValue: T | (() => T), jsonSerializer?: JsonSerializer<T>): State<T> {
    const persistent = new PersistentValue<T>(key, jsonSerializer)
    const valueState = useStateObject<T>(
        persistent.getValue() ?? (typeof defaultValue === "function" ? (defaultValue as () => T)() : defaultValue)
    )

    return valueState.onSet(newValue => persistent.setValue(newValue))
}
