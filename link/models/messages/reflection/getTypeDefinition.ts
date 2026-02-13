import type { MessageGeneric } from "../message.ts";

export interface GetTypeDefinition extends MessageGeneric<"getTypeDefinition">{
    type: string
}