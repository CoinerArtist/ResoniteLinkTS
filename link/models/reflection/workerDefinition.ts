import type { MemberDefinition } from "./members/index.ts";
import type { TypeDefinition } from "./typeDefinition.ts";

export interface WorkerDefinition{
    type: TypeDefinition
    members: Record<string, MemberDefinition>
}