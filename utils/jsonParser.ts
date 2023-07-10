export const customStringify = (data: any): string => {
    return JSON.stringify(
        data,
        (key, value) => (typeof value === 'bigint' ? value.toString() : value) // return everything else unchanged
    )
}