import type { MemberGeneric, Member } from "./member.ts";

export interface SyncList<T extends Member = Member> extends MemberGeneric<"list">{
    elements: T[]
}