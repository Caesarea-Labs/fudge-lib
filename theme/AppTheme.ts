/**
 * Theme colors that can be used in styles.
 * Under the hood it's a shorthand for doing "var(--xxx)" for accessing theme variables
 */
export namespace AppTheme {
    export const background = "var(--background)"
    export const surface = "var(--surface)"
    export const contrastSurface = "var(--contrast-surface)"
    export const contrastText = "var(--contrast-text)"
    export const hover = "var(--hover)"
    export const highlight = "var(--highlight)"
    export const error = "var(--error)"
    export const contrastError = "var(--contrast-error)"
    export const warn = "var(--warn)"
    export const selected = "var(--selected)"
    export const border = "var(--border)"
    export const strongText = "var(--strong-text)"
    export const debug = "var(--debug)"
    export const primary = "var(--primary)"
    export const subtitleText = "var(--subtitle-text)"
}

export function systemIsDarkMode(): boolean {
    return window.matchMedia !== undefined && window.matchMedia('(prefers-color-scheme: dark)').matches
}
