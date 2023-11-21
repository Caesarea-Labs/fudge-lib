import React, {useMemo, useRef} from "react"
import {ReactComponent} from "../types/React.ts"

class RefArray<T, El> {
    private readonly data: T[]
    private readonly refs: React.MutableRefObject<El>[]
     readonly length: number
    constructor(data: T[]) {
        this.data = [...data]
        this.refs = data.map(() => React.createRef() as React.MutableRefObject<El>)
        this.length = data.length
    }


    use<R>(components: (item: T, ref: React.RefObject<El>, i :number) => R): R[] {
        return this.data.map((child, i) => components(child,this.refs[i],i))
    }

    getAt(index: number) : React.RefObject<El> | undefined {
        return this.refs[index]
    }
    //TODO: consider changing implementation to a map to make this faster
    get(value: T) : React.RefObject<El> | undefined {
        const index = this.data.indexOfOrThrow(value)
        return this.getAt(index)
    }
    getBy(condition: (value: T) => boolean) : React.RefObject<El> | undefined {
        const index = this.data.firstIndex(condition)
        return this.getAt(index)
    }
}

/**
 * Allows assign refs to multiple items.
 * First display components and assign them the ref with `display`
 * Then use the refs with `use`.
 */
export function useRefs<T, El>(fromArr: T[]): RefArray<T, El> {
    return useMemo(() => new RefArray<T, El>(fromArr), [fromArr, fromArr.length])
}

// export function useRefs<T>(fromArr: unknown[]) : React.RefObject<React.MutableRefObject<T>[]> {
//     return useRef<React.MutableRefObject<T>[]>(
//         fromArr.map(() => React.createRef() as React.MutableRefObject<T>)
//     )
// }
//
// export function refArray<T>(refs: React.RefObject<React.MutableRefObject<T>[]>): (node: T) => void {
//     return (node) => {
//         if (node !== null) {
//             refs.current[i].current = node
//         }
//     }
// }