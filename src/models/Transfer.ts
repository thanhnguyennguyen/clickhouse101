import { DATA_TYPE, ModelSyncTableConfig } from "clickhouse-orm"
import { IDataModel } from "./interface"

export interface ITranferModel extends IDataModel {
    logId: string,
    amount?: number
    time: Date
    from?: string
    to?: string
}
export const modelName = "Transfer"
export const schema: ModelSyncTableConfig<ITranferModel> = {
    tableName: "transfer",
    schema: {
      time: { type: DATA_TYPE.DateTime, default: Date },
      logId: { type: DATA_TYPE.String }, 
      amount: { type: DATA_TYPE.Int32 },
      to: { type: DATA_TYPE.String }, // ALTER TABLE transfer ADD INDEX to_addr_index to TYPE bloom_filter GRANULARITY 1
      from: { type: DATA_TYPE.String }, // // ALTER TABLE transfer ADD INDEX from_addr_index from TYPE bloom_filter GRANULARITY 1
    },
    options: `ENGINE = MergeTree
    PARTITION BY toYYYYMM(time)
    ORDER BY time`,
    autoCreate: true,
    autoSync: true,
}

