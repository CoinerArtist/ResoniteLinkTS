import type { Slot } from "../index.ts";
import type { ResponseGeneric } from "./response.ts"

export interface SlotData extends ResponseGeneric<"slotData">{
    depth: number
    data: Slot
}