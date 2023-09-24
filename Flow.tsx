import React from "react";
import {withClassName, withDynamicClass} from "./react/Styles";
type DivProps = React.HTMLAttributes<HTMLDivElement>

/**
 * Shorthand for `style = {{display: "flex", flexDirection :"row"}}`
 */
export function Row(props: DivProps) {
    return <div {...withClassName(props, "row")}/>
}

/**
 * Shorthand for `style = {{display: "flex", flexDirection :"row"}}`
 */
export function Column(props: DivProps) {
    return <div {...withClassName(props, "column")}/>
}

/**
 * Has a single parameter, `space`, the specifies the space between every 2 children in rem.
 */
export function SpacedRow(props: DivProps & { space: number }) {
    const {space, ...divProps} = props
    // See Flow.module.css
    return <div {...withDynamicClass(divProps, "row spaced-row", "row-space", `${space}rem`)}/>
}

/**
 * Has a single parameter, `space`, the specifies the space between every 2 children in rem.
 */
export function SpacedColumn(props: DivProps & { space: number }) {
    const {space, ...divProps} = props
    // See Flow.module.css
    return <div {...withDynamicClass(divProps, "column spaced-column", "column-space", `${space}rem`)}/>
}


