export type TsKey = string | number | symbol
export type Require<T, K extends keyof T> = Omit<T, K> & {
    [RequiredProperty in K]-?: T[RequiredProperty]
}
export type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>
export type Replace<T, K extends keyof T, New> = {
    [P in keyof T]: P extends K ? New : T[P]
}
export type TsObject = Record<string, unknown>
