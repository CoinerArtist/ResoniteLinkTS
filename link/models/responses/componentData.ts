import type { Component } from "../index.ts";
import type { ResponseGeneric } from "./response.ts"

export interface ComponentData<T extends Component = Component> extends ResponseGeneric<"componentData">{
    data: T
}