import type { Component, MakeComponentPartialForAdd, MakeComponentPartialForUpdate } from "../../../index.ts";
import type { MessageGeneric } from "../../message.ts";

export interface AddComponent<T extends Component = Component> extends MessageGeneric<"addComponent">{
    data: MakeComponentPartialForAdd<T>
    containerSlotId: string
}

export interface UpdateComponent<T extends Component = Component> extends MessageGeneric<"updateComponent">{
    data: MakeComponentPartialForUpdate<T>
}