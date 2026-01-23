import type { MemberGeneric, Member } from "./member.ts";

export interface SyncObject<T extends {[key: string]: Member} = Record<string, Member>> extends MemberGeneric<"syncObject">{
    members: T
}