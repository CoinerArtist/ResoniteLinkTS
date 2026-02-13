import type { MessageGeneric } from "../message.ts";

export interface GetComponentDefinition extends MessageGeneric<"getComponentDefinition">{
    componentType: string
    flattened?: boolean
}