import type { TypeReference } from "../typeReference.ts";
import type { MemberDefinitionGeneric } from "./memberDefinition.ts";

export interface ReferenceDefinition extends MemberDefinitionGeneric<"reference">{
    targetType: TypeReference
}