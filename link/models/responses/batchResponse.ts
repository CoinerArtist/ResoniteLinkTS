import type { Response, ResponseGeneric } from "./response.ts"

export interface BatchResponse extends ResponseGeneric<"batchResponse">{
    responses: Response[]
}