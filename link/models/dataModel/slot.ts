import type { Component } from "./component.ts";
import type { Reference } from "./reference.ts";
import type { MakeMemberPartial } from "./member.ts";
import type { Field } from "./field.ts";

type No$Type<T> = Omit<T, "$type">

/** `components` and `children` are sent as `null` if they are an empty list. */
export interface Slot{
    isReferenceOnly: boolean
    
    id: string
    parent: Omit<Reference, "$type">

    position: No$Type<Field<"float3">>
    rotation: No$Type<Field<"floatQ">>
    scale: No$Type<Field<"float3">>

    isActive: No$Type<Field<"bool">>
    isPersistent: No$Type<Field<"bool">>

    name: No$Type<Field<"string">>
    tag: No$Type<Field<"string">>
    orderOffset: No$Type<Field<"long">>

    components: Component[] | null
    children: Slot[] | null
}

export interface SlotPartial{
    id?: string
    parent?: No$Type<MakeMemberPartial<Reference>>

    position?: No$Type<MakeMemberPartial<Field<"float3">>>
    rotation?: No$Type<MakeMemberPartial<Field<"floatQ">>>
    scale?: No$Type<MakeMemberPartial<Field<"float3">>>

    isActive?: No$Type<MakeMemberPartial<Field<"bool">>>
    isPersistent?: No$Type<MakeMemberPartial<Field<"bool">>>

    name?: No$Type<MakeMemberPartial<Field<"string">>>
    tag?: No$Type<MakeMemberPartial<Field<"string">>>
    orderOffset?: No$Type<MakeMemberPartial<Field<"long">>>
}