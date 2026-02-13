import type { MessageGeneric } from "../message.ts";

export interface GetEnumDefinition extends MessageGeneric<"getEnumDefinition">{
    type: string
}