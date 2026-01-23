import type { MessageGeneric } from "../../message.ts";

export interface GetSlot extends MessageGeneric<"getSlot">{
    slotId: string,
    depth?: number,
    includeComponentData?: boolean
}