// A dynamic class is a css class that has a css variable as an input that we specify in the style
import React, {CSSProperties} from "react"

/**
 * Adds the given builtin style and classname to the user provided userProps.
 * The userProps have greater priority, meaning the user can override builtin style values.
 */
export function withStyle<T>(userProps: React.HTMLAttributes<T>, builtinStyle: React.CSSProperties, builtinClass?: string): React.HTMLAttributes<T> {
    return {...userProps, className: mergeClassname(userProps.className, builtinClass), style: mergeStyle(userProps.style, builtinStyle)}
}

/**
 * Adds the given builtin classname to the user provided userProps.
 * The userProps have greater priority, meaning the user can override builtin the class styles with its own class.
 */
export function withClassName<T>(userProps: React.HTMLAttributes<T>, builtinClassname: string): React.HTMLAttributes<T> {
    return {...userProps, className: mergeClassname(userProps.className, builtinClassname)}
}

/**
 * Allows inputting values dynamically to a css style that requires certain css variables.
 * See {@link SpacedRow} as an example
 */
export function withDynamicClass<T>(tagProps: React.HTMLAttributes<T>, dynamicClass: string, dynamicKey: string,
                                    dynamicValue: string): React.HTMLAttributes<T> {
    return {
        ...tagProps,
        className: mergeClassname(tagProps.className, dynamicClass),
        style: mergeStyle(tagProps.style, {[`--${dynamicKey}`]: dynamicValue})
    }
}

/**
 * Avoids the restrictions of CSSProperties, which allows specifying variable values.
 */
export function styleWithVariables(style: CSSProperties | object): CSSProperties {
    return style as CSSProperties
}


function mergeClassname(userClassname: string | undefined, builtinClassname: string | undefined): string | undefined {
    if (userClassname === undefined) return builtinClassname
    if (builtinClassname === undefined) return userClassname
    // Put builtin before the user class, so user will have higher priority
    return `${builtinClassname} ${userClassname}`
}


// Allow `object` in addedStyle to not get compile errors with custom attributes
function mergeStyle(userStyle: React.CSSProperties | undefined,
                    builtinStyle: React.CSSProperties | object | undefined): React.CSSProperties | undefined {
    if (userStyle === undefined) return builtinStyle
    if (builtinStyle === undefined) return userStyle
    // Put builtin before the user style, so user will have higher priority
    return {...builtinStyle, ...userStyle}
}
