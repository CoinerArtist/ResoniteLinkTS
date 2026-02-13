import type { TypeDefinition } from "./typeDefinition.ts";

export interface EnumDefinition{
    type: TypeDefinition
    backingType: string
    values: Record<string, number>
    isFlags: boolean
}