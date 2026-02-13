import type { TypeReference } from "../typeReference.ts";
import type { MemberDefinitionGeneric } from "./memberDefinition.ts";

export interface EmptyMemberDefinition extends MemberDefinitionGeneric<"empty">{
    memberType: TypeReference
}