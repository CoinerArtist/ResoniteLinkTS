import type { TypeReference } from "../typeReference.ts";
import type { MemberDefinitionGeneric } from "./memberDefinition.ts";

export interface SyncObjectMemberDefinition extends MemberDefinitionGeneric<"syncObject", TypeReference>{
    type: TypeReference
}