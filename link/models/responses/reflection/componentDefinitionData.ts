import type { ComponentDefinition } from "../../reflection/index.ts";
import type { ResponseGeneric } from "../response.ts";

export interface ComponentDefinitionData extends ResponseGeneric<"componentDefinitionData">{
    definition: ComponentDefinition
}