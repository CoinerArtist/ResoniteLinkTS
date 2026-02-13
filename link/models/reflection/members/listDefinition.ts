import type { MemberDefinition, MemberDefinitionGeneric } from "./memberDefinition.ts";

export interface ListDefinition extends MemberDefinitionGeneric<"list">{
    elementDefinition: MemberDefinition
}