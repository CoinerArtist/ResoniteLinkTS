import type { MessageGeneric } from "../../message.ts";

export interface GetComponent extends MessageGeneric<"getComponent">{
    componentId: string
}