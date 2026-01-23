import type { Field } from "./field.ts";
import type { MakeMemberPartial, Member } from "./member.ts";

/** If the component has `isReferenceOnly: true`, `members` is actually `null`.
 *  
 * This is only relevant in a few cases, so it is more convenient to not tell typescript about it. */
export interface Component<T extends string = string, M extends {[key: string]: Member} = Record<string, Member>>{
    isReferenceOnly: boolean

    id: string
    componentType: T
    members: M & {
        persistent: Field<"bool">,
        UpdateOrder: Field<"int">,
        Enabled: Field<"bool">
    }
}

export type ComponentPartial = MakeComponentPartial<Component>

export interface MakeComponentPartial<T extends Component>{
    id?: string
    members?: {
        [P in keyof T["members"]]?: MakeMemberPartial<T["members"][P]>
    }
}

export interface MakeComponentPartialForAdd<T extends Component> extends MakeComponentPartial<T>{ componentType: T["componentType"] }
export interface MakeComponentPartialForUpdate<T extends Component> extends MakeComponentPartial<T>{ id: string }