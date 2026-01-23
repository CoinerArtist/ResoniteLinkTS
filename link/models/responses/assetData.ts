import type { ResponseGeneric } from "./response.ts"

export interface AssetData extends ResponseGeneric<"assetData">{
    assetUrl: string
}