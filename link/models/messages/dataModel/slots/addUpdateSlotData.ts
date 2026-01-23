import type { RequiredBy } from "../../../../types.ts";
import type { SlotPartial } from "../../../index.ts";
import type { MessageGeneric } from "../../message.ts";

export interface AddSlot extends MessageGeneric<"addSlot">{
    data: SlotPartial
}

export interface UpdateSlot extends MessageGeneric<"updateSlot">{
    data: RequiredBy<SlotPartial, "id">
}