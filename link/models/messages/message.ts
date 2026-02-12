import type { DataModelOperation, RequestSessionData, DataModelOperationBatch } from "./index.ts";

export interface MessageGeneric<T extends string>{
    $type: T
    messageId?: string
}

export type Message = 
RequestSessionData | DataModelOperation | DataModelOperationBatch
// Todo add data imports