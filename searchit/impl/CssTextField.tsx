import styles from "./searchit.module.css"
import React, {Ref} from "react"
import {ReactComponent} from "../../types/React"
import {State} from "../../state/State"
import {Column} from "../../react/Flow"
import {withClassName} from "../../react/Styles"
import {AppTheme} from "../../theme/AppTheme"

//TODO: test errors

const errorTextSize = "0.8rem"

/**
 * The props of this textField are passed directly the inner input element.
 */
export function CssTextField(props: {
    error?: string,
    state: State<string>,
    leadingIcon?: ReactComponent,
    inputRef?: Ref<HTMLInputElement>
} & React.HTMLAttributes<HTMLInputElement>) {
    const {error, state, leadingIcon, inputRef, ...inputProps} = props
    const divStyle = {borderColor: props.error !== undefined ? AppTheme.error : undefined}
    // const test = withClassName(inputProps, styles.input)
    return <Column style={{width: "100%"}}>
        {/*Balance the bottom placeholder text so the input will be centered*/}
        {PlaceHolderText(errorTextSize)}
        <div style={divStyle} className={styles.inputWrapper}>
            {props.leadingIcon}
            <input {...withClassName(inputProps, styles.textfieldInput)} ref={props.inputRef} value={props.state.value}
                   onChange={e => props.state.setValue(e.target.value)}/>
        </div>

        {/*Even if there is no error, have hidden text so the component won't enlarge when there's an error*/}
        {props.error === undefined ? PlaceHolderText(errorTextSize) : <span
            style={{color: AppTheme.error, fontSize: errorTextSize}}>{props.error}</span>}
    </Column>
}

function PlaceHolderText(fontSize: string) {
    return <span style={{visibility: "hidden", fontSize: fontSize}}>placeholder</span>
}
