import type { WorkerDefinition } from "./workerDefinition.ts";

export interface ComponentDefinition extends WorkerDefinition{
    baseTypeIsComponent: boolean,
    categoryPath: string
}