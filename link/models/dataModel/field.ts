import type { MemberGeneric } from "./member.ts";
import type { FieldType, ResoToTS } from "./primitiveContainers.ts";

export interface FieldGeneric<T extends string, U> extends MemberGeneric<T>{
    value: U
}

export type Field<T extends FieldType = FieldType, U extends string = string> =
  T extends "enum" ? FieldGeneric<T, string> & { enumType: U }
: T extends "enum?" ? FieldGeneric<T, string | null> & { enumType: U }
: T extends FieldType ? FieldGeneric<T, ResoToTS<T>>
: never