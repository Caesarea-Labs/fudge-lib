import {defaultJsonSerializer, StringSerializer} from "../structures/json.ts"

/**
 * Denotes a server response.
 * S - The success response
 * E - A custom error response, if one exists.
 *
 * S and E can be any type. However, the response will always be an object,
 * meaning if S or E are primitive they will be wrapped into an object,
 * for example a string will be wrapped into a StringWrapper and the string value will need to be retrieved with .string.
 */
export type Result<S, E = void> = (ResultSuccess<S> | ResultError<E>) & IsCheckable<S, E>

export class HttpServer {
    private readonly url: string

    constructor(url: string) {
        this.url = url
    }

    async doRequest<Suc, Err = void>(endpoint: string, req: unknown, json?: StringSerializer<never>): Promise<Result<Suc, Err>> {
        let response: Response
        try {
            response = await fetch(this.url, {
                body: JSON.stringify({
                    body: req ?? {},
                    endpoint
                }),
                method: "POST"
            })
        } catch (e) {
            return requestFetchError(e as TypeError)
        }

        const body = await response.text()
        let parsed: never
        try {
            parsed = (json ?? defaultJsonSerializer()).parse(body)
        } catch (e) {
            if (response.ok) {
                throw e
            }// If we can't parse it, we assume it's a generic error
            else {
                return requestCodeError(body, response.status)
            }
        }
        if (response.ok) {
            return requestSuccess(parsed)
        } else {
            return requestCustomError(parsed)
        }
    }
}


export interface IsSuccessCheckable<S> {
    /**
     * No error occurred, and we will now be able to access the success body
     */
    isOk(): this is AsObject<S>
}

export interface IsFetchErrorCheckable {
    /**
     * Error occurred during the fetch() call itself, meaning there was no opportunity for the browser or the server to respond with anything.
     */
    isFetchErr(): this is FetchError
}

export interface IsStatusErrorCheckable {
    /**
     * Non-200 status code was returned as a result of some generic problem like incorrect format, cors issues, internal server error, etc.
     */
    isStatusError(): this is StatusError
}

export interface IsCustomErrorCheckable<E> {
    /**
     * Non-200 status code was returned explicitly by server code to denote some specific condition, with extra info represented by the type E.
     */
    isCustomError(): this is CustomError<E>
}


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isGenericError<E>(result: Result<any, E>): result is GenericError {
    // eslint-disable-next-line
    return result.isStatusError() || result.isFetchErr()
}


type IsCheckable<S, E> = IsSuccessCheckable<S> & IsFetchErrorCheckable & IsCustomErrorCheckable<E> & IsStatusErrorCheckable


export type ResultSuccess<S> = AsObject<S>
export type ResultError<E> = CustomError<E> | GenericError
export type CustomError<E> = AsObject<E>

export type AsObject<T> = T extends object ? T : T extends string ? StringWrapper : T extends boolean ? BooleanWrapper : T extends number
    ? NumberWrapper :
    T extends void | undefined ? VoidResponse : never
export type BooleanWrapper = {
    isTrue: boolean
}

export type NumberWrapper = {
    value: number
}

export type StringWrapper = {
    string: string
}

export type VoidResponse = Record<string, never>

export type GenericError = FetchError | StatusError

export interface FetchError {
    error: TypeError
}

export interface StatusError {
    error: string
    code: number
}

export function requestSuccess<T>(response: T): ResultSuccess<T> & IsCheckable<never, never> {
    return serverResToClientRes(response, true)
}

export function requestFetchError(error: TypeError): FetchError & IsCheckable<never, never> {
    return {
        error,
        ...typeChecks({ok: false, fetchError: true, customError: false, codeError: false})
    }
}

export function requestCodeError(error: string, code: number): StatusError & IsCheckable<never, never> {
    return {
        error,
        code,
        ...typeChecks({ok: false, fetchError: false, customError: false, codeError: true})
    }
}


export function requestCustomError<T>(response: T): ResultError<T> & IsCheckable<never, never> {
    // This is a safe cast, TS is just being stupid
    return {...serverResToClientRes(response, false)} as unknown as ResultError<T> & IsCheckable<never, never>
}

function serverResToClientRes<T>(response: T, ok: boolean): AsObject<T> & IsCheckable<never, never> {
    const asObject = wrapToObject(response) as IsCheckable<never, never> & AsObject<T>
    transferProps(typeChecks({ok, fetchError: false, customError: !ok, codeError: false}), asObject)
    return asObject
}

function transferProps<F, T extends F>(from: F, to: T) {
    for (const prop in from) {
        // This is correct IDK what it wants
        // @ts-ignore
        to[prop] = from[prop]
    }
}

function typeChecks<S, E>({ok, fetchError, customError, codeError}: {
    ok: boolean,
    fetchError: boolean,
    codeError: boolean,
    customError: boolean
}): IsCheckable<S, E> {
    return {
        isCustomError: () => customError,
        isFetchErr: () => fetchError,
        isOk: () => ok,
        isStatusError: () => codeError
    }
}

// We need the returned result to always be an object, so we can put the isOk and isErr methods
function wrapToObject<T>(item: T): AsObject<T> {
    switch (typeof item) {
        case "undefined": {
            const retval: VoidResponse = {}
            return retval as AsObject<T>
        }
        case "object":
            return item as AsObject<T>
        case "boolean": {
            const retval: BooleanWrapper = {isTrue: item}
            return retval as AsObject<T>
        }
        case "number": {
            const retval: NumberWrapper = {value: item}
            return retval as AsObject<T>
        }
        case "string": {
            const retval: StringWrapper = {string: item}
            return retval as AsObject<T>
        }
        default:
            throw new Error(`Unexpected response ${String(item)}`)
    }
}