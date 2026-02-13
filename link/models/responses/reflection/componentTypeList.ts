import type { ResponseGeneric } from "../response.ts";

export interface ComponentTypeList extends ResponseGeneric<"componentTypeList">{
    componentTypes: string[]
    subcategories: string[]
    totalComponentCount: number
}