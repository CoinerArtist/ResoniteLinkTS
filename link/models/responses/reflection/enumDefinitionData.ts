import type { EnumDefinition } from "../../reflection/index.ts";
import type { ResponseGeneric } from "../response.ts";

export interface EnumDefinitionData extends ResponseGeneric<"enumDefinitionData">{
    definition: EnumDefinition
}