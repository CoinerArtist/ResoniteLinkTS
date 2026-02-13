import type { ArrayDefinition } from "./arrayDefinition.ts";
import type { EmptyMemberDefinition } from "./emptyMemberDefinition.ts";
import type { FieldDefinition } from "./fieldDefinition.ts";
import type { ListDefinition } from "./listDefinition.ts";
import type { ReferenceDefinition } from "./referenceDefinition.ts";
import type { SyncObjectMemberDefinition } from "./syncObjectMemberDefinition.ts";

export interface MemberDefinitionGeneric<T extends string, U = string>{
    $type: T
    type: U
}

export type MemberDefinition = ArrayDefinition | EmptyMemberDefinition | FieldDefinition | ListDefinition | ReferenceDefinition | SyncObjectMemberDefinition