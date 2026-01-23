export function isNullableType(type: string): boolean { return type.endsWith("?") }
export function isArrayType(type: string): boolean { return type.endsWith("[]") }

/** Removes Nullable(`?`) or Array(`[]`) from a Resonite type string. */
export function getPrimitiveType(type: string): string {
    if(isNullableType(type)) return type.slice(0, -1)
    if(isArrayType(type)) return type.slice(0, -2)
    return type
}

// --- //

export interface number2{
    x: number
    y: number
}
export interface boolean2{
    x: boolean
    y: boolean
}

export interface number3{
    x: number
    y: number
    z: number
}
export interface boolean3{
    x: boolean
    y: boolean
    z: boolean
}

export interface number4{
    x: number
    y: number
    z: number
    w: number
}
export interface boolean4{
    x: boolean
    y: boolean
    z: boolean
    w: boolean
}

export type numberQ = number4

export interface number2x2{
    m00: number, m01: number
    m10: number, m11: number
}

export interface number3x3{
    m00: number, m01: number, m02: number
    m10: number, m11: number, m12: number
    m20: number, m21: number, m22: number
}

export interface number4x4{
    m00: number, m01: number, m02: number, m03: number
    m10: number, m11: number, m12: number, m13: number
    m20: number, m21: number, m22: number, m23: number
    m30: number, m31: number, m32: number, m33: number
}

/** Uses `[0.0, 1.0]` range */
export interface color{
    r: number, g: number, b: number, a: number
}

/** Uses `[0.0, 1.0]` range */
export interface colorX extends color{
    profile: "Linear" | "sRGB" | "sRGBAlpha"
}

/** Uses `[0, 255]` range */
export type color32 = color