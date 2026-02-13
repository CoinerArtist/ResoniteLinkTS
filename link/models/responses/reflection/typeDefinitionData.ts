import type { TypeDefinition } from "../../reflection/index.ts";
import type { ResponseGeneric } from "../response.ts";

export interface TypeDefinitionData extends ResponseGeneric<"typeDefinitionData">{
    definition: TypeDefinition
}