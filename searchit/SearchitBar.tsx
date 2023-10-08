import {AutoCompleteWidthPx, useAutoComplete} from "./impl/Autocomplete"
import {AutocompleteContent} from "./impl/SearchItBarImpl"
import {CssTextField} from "./impl/CssTextField"
import {State} from "../state/State"
import styles from "./impl/searchit.module.css"
import {styleWithVariables} from "../react/Styles.ts"
import {AppTheme} from "../theme/AppTheme.ts"
import {CSSProperties} from "react"

export interface SearchitProps {
    config: AutoCompleteConfig,
    /**
     * The text that is written in the search bar
     * This value only changes on SUBMISSION as in when pressing space, enter, selecting completion, etc.
     * This is so the value can be easily consumed on every state change - whenever query changes, do a new network request.
     */
    query: State<string>
    /**
     * Should be true when the query changed and new results were not received yet from the server.
     */
    loading: boolean
    /**
     * Exposed to allow customizing styles of external div
     */
    className?: string,
    /**
     * Exposed to allow customizing styles of external div
     */
    style?: CSSProperties
}

export interface AutoCompleteConfig {
    /**
     * This is the most important part of configuring the completion.
     * Each value specified here denotes something that can be completed.
     * For example, if you want to allow to complete the text "hello",
     * add a completable that returns a "hello" completion when parts of "hello" are present in the text.
     * You could also add another completable that completes the text "world", but only when the word starts with "hello", etc.
     */
    completables: Completable[]

    /**
     * Specify an error that was received as a result of the query to mark the search bar red.
     */
    error: string | undefined

    /**
     * If set to false, when you focus the text field and nothing was typed yet in the current word, no completions will be shown.
     * If set to true, completions will always be shown.
     * Default - false
     */
    alwaysShowCompletions?: boolean
}


export interface Completable {
    /**
     * Given the text, what completion options should be shown.
     * The `text` passed here is only the currently typed word and not the entire query
     */
    options: (text: string) => Promise<Completion[]>
    /**
     * Method that will cancel getting the options for [text]
     */
    cancel: (text: string) => void

}

export interface Completion {
    /**
     * The text that will be shown in the completion
     */
    label: string
    /**
     * The text that will be inserted instead of the text that user wrote when the completion is selected
     */
    newText: string

    /**
     * If false, completing this won't trigger an update in the query and won't cause a new search.
     */
    terminator?: boolean
}


/**
 * A text field that allows auto-complete.
 * IMPORTANT: You must call {@link initKeyboardShortcuts} before ReactDom.createRoot() for hotkeys to work.
 * See {@link SearchitProps}
 */
export function SearchitBar(props: SearchitProps) {
    const autocomplete = useAutoComplete(props.config, props.query)

    return <div className={props.className} style={{ position: "relative", alignSelf: "center", width: "100%", height: "100%",...props.style}}>
        <CssTextField
            error={props.config.error}
            state={autocomplete.query}
            leadingIcon={
                <div className={styles.loader} style={styleWithVariables(
                    {
                        visibility: !autocomplete.submitted || props.loading ? undefined : "hidden",
                        animation: props.loading ? undefined : "unset",
                        "--loader-color-1": props.loading ? undefined : undefined,
                        "--loader-color-2": props.loading ? undefined : AppTheme.warn,
                        "--loader-size": "3px"
                    }
                )}/>
            }
            inputRef={autocomplete.inputRef}
            onFocus={() => autocomplete.show()}
            onBlur={() => autocomplete.hide()}
            spellCheck={false}
        />

        {/*This is just some hack to be able to determine the exact width of text*/}
        <span ref={autocomplete.textHackRef} style={{position: "fixed", top: 0, left: 0, visibility: "hidden"}}>
            {autocomplete.query.value}
        </span>


        {/*Position the autocomplete in the exact caret position*/}
        <AutocompleteContent
            className={styles.autocompleteOverlay}
            isLoading={autocomplete.isLoadingCompletions}
            typedWord={autocomplete.currentTypedWord}
            items={autocomplete.completions}
            style={{left: autocomplete.position.x, top: autocomplete.position.y, width: AutoCompleteWidthPx}}
            onSelectItem={(completion) => autocomplete.complete(completion)}/>
    </div>

}
