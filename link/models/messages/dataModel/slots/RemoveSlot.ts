import type { MessageGeneric } from "../../message.ts";

export interface RemoveSlot extends MessageGeneric<"removeSlot">{
    slotId: string
}