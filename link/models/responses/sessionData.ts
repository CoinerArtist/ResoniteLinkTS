import type { ResponseGeneric } from "./response.ts"

export interface SessionData extends ResponseGeneric<"sessionData">{
    resoniteVersion: string
    resoniteLinkVersion: string
    uniqueSessionId: string
}