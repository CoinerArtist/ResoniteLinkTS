import type { MessageGeneric } from "../message.ts";

export interface GetSyncObjectDefinition extends MessageGeneric<"getSyncObjectDefinition">{
    syncObjectType: string
    flattened?: boolean
}