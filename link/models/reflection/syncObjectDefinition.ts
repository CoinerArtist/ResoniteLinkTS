import type { WorkerDefinition } from "./workerDefinition.ts";

export interface SyncObjectDefinition extends WorkerDefinition {
    baseTypeIsSyncObject: boolean
}