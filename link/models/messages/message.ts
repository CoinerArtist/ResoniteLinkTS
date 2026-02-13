import type { DataModelOperation, RequestSessionData, DataModelOperationBatch, GetComponentDefinition, GetComponentTypeList, GetEnumDefinition, GetGenericTypeDefinition, GetSyncObjectDefinition, GetTypeDefinition } from "./index.ts";

export interface MessageGeneric<T extends string>{
    $type: T
    messageId?: string
}

export type Message = 
RequestSessionData | DataModelOperation | DataModelOperationBatch |
GetComponentDefinition | GetComponentTypeList | GetEnumDefinition | GetGenericTypeDefinition | GetSyncObjectDefinition | GetTypeDefinition

// Todo add data imports