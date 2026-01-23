import type { MemberGeneric } from "./member.ts";

export interface Reference<T extends string = string> extends MemberGeneric<"reference">{
    targetId: string | null
    targetType: T
}