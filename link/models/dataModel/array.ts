import type { MemberGeneric } from "./member.ts";
import type { ArrayType, ResoToTS } from "./primitiveContainers.ts";

export interface SyncArrayGeneric<T extends string, U> extends MemberGeneric<T>{ 
    values: U
}

export type SyncArray<T extends ArrayType = ArrayType> = SyncArrayGeneric<T, ResoToTS<T>>