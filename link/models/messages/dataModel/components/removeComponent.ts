import type { MessageGeneric } from "../../message.ts";

export interface RemoveComponent extends MessageGeneric<"removeComponent">{
    componentId: string
}