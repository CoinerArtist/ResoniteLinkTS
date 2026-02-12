import type { DataModelOperation } from "./dataModel/index.ts";
import type { MessageGeneric } from "./message.ts";

export interface DataModelOperationBatch extends MessageGeneric<"dataModelOperationBatch">{
    operations: DataModelOperation[]
}