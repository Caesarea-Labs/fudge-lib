export function systemIsDarkMode(): boolean {
    return window.matchMedia !== undefined && window.matchMedia('(prefers-color-scheme: dark)').matches
}