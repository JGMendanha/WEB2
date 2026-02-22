export function toInputDate(date?: string) {
    if (!date) return ""
    return date.substring(0, 16) // remove segundos e nanos
}

export function toApiDate(date?: string) {
    if (!date) return null
    return date.length === 16 ? date + ":00" : date
}