import type { MessageGeneric } from "../message.ts";

export interface GetGenericTypeDefinition extends MessageGeneric<"getGenericTypeDefinition">{
    genericInstanceType: string
}