import type { EmptyElement } from "./emptyElement.ts";
import type { Field } from "./field.ts";
import type { Reference } from "./reference.ts";
import type { SyncList } from "./syncList.ts";
import type { SyncObject } from "./syncObject.ts";

export interface MemberGeneric<T extends string>{
    $type: T
    id: string
}

// So, fun fact : typescript has two main way of creating types, `type` and `interface`
// In most case, the only difference is the notation and they are otherwise identical                       (to be precise, (nearly) all `interface`s can be rewritten using `type`, `type`s are more flexible)

// Here, this is not the case :)

// I started with `type`, big mistake
// `MakeMemberPartial` would cause the autocomplete to take seconds to show up by simply being used with a generic somewhere in the file
// Turns out that `interface`s are slightly more efficient than `type`s in general because typescript can reuse thems
// Mix that with the recursive type below and that slight difference gets huge

// Simply replacing every possible `type` with an `interface` fixed it

export type Member = Field | Reference | SyncList | SyncObject | EmptyElement

export type MakeMemberPartial<T extends Member> = 
  T extends {$type: "list"}
? {$type: "list", elements: MakeMemberPartial<T["elements"][number]>[]}
: T extends {$type: "syncObject"}
? {$type: "syncObject", members: {[P in keyof T["members"]]?: MakeMemberPartial<T["members"][P]>}}
: Omit<T, "id" | "targetType" | "enumType"> & {id?: string}