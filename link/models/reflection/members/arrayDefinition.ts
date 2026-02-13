import type { TypeReference } from "../typeReference.ts";
import type { MemberDefinitionGeneric } from "./memberDefinition.ts";

export interface ArrayDefinition extends MemberDefinitionGeneric<"array">{
    valueType: TypeReference
}