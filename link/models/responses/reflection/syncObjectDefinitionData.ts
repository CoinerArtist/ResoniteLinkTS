import type { SyncObjectDefinition } from "../../reflection/index.ts";
import type { ResponseGeneric } from "../response.ts";

export interface SyncObjectDefinitionData extends ResponseGeneric<"syncObjectDefinitionData">{
    definition: SyncObjectDefinition
}