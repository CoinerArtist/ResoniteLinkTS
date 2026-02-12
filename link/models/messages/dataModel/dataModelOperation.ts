import type { AddComponent, AddSlot, GetComponent, GetSlot, RemoveComponent, RemoveSlot, UpdateComponent, UpdateSlot } from "../index.ts";

export type DataModelOperation = 
    GetSlot | AddSlot | UpdateSlot | RemoveSlot |
    GetComponent | AddComponent | UpdateComponent | RemoveComponent 