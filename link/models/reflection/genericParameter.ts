import type { TypeReference } from "./typeReference.ts";

export interface GenericParameter{
    name: string
    types: TypeReference[]
    unmanaged: boolean
    struct: boolean
    enum: boolean
    class: boolean
}