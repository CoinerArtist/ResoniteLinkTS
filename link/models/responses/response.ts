import type { AssetData, ComponentData, SessionData, SlotData, BatchResponse, NewEntityId, ComponentDefinitionData, ComponentTypeList, EnumDefinitionData, SyncObjectDefinitionData, TypeDefinitionData } from "./index.ts";

export interface ResponseGeneric<T extends string>{
    $type: T
    sourceMessageId: string | null
    success: boolean
    errorInfo: string | null
}

export type SuccessResponse = ResponseGeneric<"response">

export type Response = 
    AssetData | ComponentData | SessionData | SlotData | SuccessResponse | BatchResponse | NewEntityId |
    ComponentDefinitionData | ComponentTypeList | EnumDefinitionData | SyncObjectDefinitionData | TypeDefinitionData