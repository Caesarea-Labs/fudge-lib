import {ReactComponent} from "../types/React.ts"
import {createContext, CSSProperties, useContext} from "react"
import {systemIsDarkMode} from "./AppTheme.ts"


export function useLightMode(): boolean {
    return useContext(ThemeContext)
}

/**
 * Allows calling {@link useLightMode} in children components.
 * Required for {@link ThemeRoot}.
 */
export function ThemeProvider(props: { children: ReactComponent, light: boolean }) {
    return <ThemeContext.Provider value={props.light}>
        {props.children}
    </ThemeContext.Provider>
}

/**
 * Applies css variables matching the current theme. Requires {@link ThemeProvider} to be a parent.
 */
export function ThemeRoot(props: { children: ReactComponent, style?: CSSProperties }) {
    const light = useLightMode()
    return <div style={props.style} className={light ? "light" : undefined}>
        {props.children}
    </div>
}

const ThemeContext = createContext(!systemIsDarkMode())
