import type { AddComponent, AddSlot, GetComponent, GetSlot, RemoveComponent, RemoveSlot, RequestSessionData, UpdateComponent, UpdateSlot } from "./index.ts";

export interface MessageGeneric<T extends string>{
    $type: T
    messageId?: string
}

export type Message = 
RequestSessionData | 
GetSlot | AddSlot | UpdateSlot | RemoveSlot |
GetComponent | AddComponent | UpdateComponent | RemoveComponent // Todo add data imports