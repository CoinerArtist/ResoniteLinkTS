import type { ResponseGeneric } from "./response.ts"

export interface NewEntityId extends ResponseGeneric<"newEntityId">{
    entityId: string
}