import type { MessageGeneric } from "../message.ts";

export interface GetComponentTypeList extends MessageGeneric<"getComponentTypeList">{
    categoryPath: string
}