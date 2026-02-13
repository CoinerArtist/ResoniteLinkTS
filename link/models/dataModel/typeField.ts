import type { MemberGeneric } from "./member.ts";

/** `TypeField` isn't an actual field since it uses `type` instead of `value`.
 * 
 * Don't mistake for `FieldType`. */
export interface TypeField extends MemberGeneric<"type">{
    type: string | null
}