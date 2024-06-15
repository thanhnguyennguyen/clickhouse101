import { DATA_TYPE, ModelSyncTableConfig } from "clickhouse-orm"
import { IDataModel } from "./interface"

export interface IAccountModel extends IDataModel {
    address: string,
    balance?: number
    isContract?: boolean,
    status?: number,
    createdAt?: Date
    updatedAt?: Date
}
export const modelName = "Account"
export const schema: ModelSyncTableConfig<IAccountModel> = {
    tableName: "account",
    schema: {
      address: { type: DATA_TYPE.String }, 
      balance: { type: DATA_TYPE.Int64 },
      isContract: { type: DATA_TYPE.Boolean },
      status: { type: DATA_TYPE.Int8, default: 1 },
      createdAt: { type: DATA_TYPE.DateTime, default: Date },
      updatedAt: { type: DATA_TYPE.DateTime, default: Date  },
    },
    options: `ENGINE = MergeTree
    PRIMARY KEY (address)`,
    autoCreate: true,
    autoSync: true,
}
