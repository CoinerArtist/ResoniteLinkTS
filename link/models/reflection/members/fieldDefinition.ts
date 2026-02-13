import type { TypeReference } from "../typeReference.ts";
import type { MemberDefinitionGeneric } from "./memberDefinition.ts";

export interface FieldDefinition extends MemberDefinitionGeneric<"field">{
    valueType: TypeReference
}