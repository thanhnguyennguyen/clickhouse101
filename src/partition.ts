import { ClickhouseOrm, DATA_TYPE, ModelSyncTableConfig } from "clickhouse-orm"
import config from "config"

const chOrm = ClickhouseOrm({
  db: {
    name: config.clickhouse.write.dbName,
  },
  debug: true,
  client: {
    url: config.clickhouse.write.url,
    port: config.clickhouse.write.port,
    basicAuth: {
      username: config.clickhouse.write.user,
      password: config.clickhouse.write.password,
    },
    debug: false,
    isUseGzip: true,
    format: "json", // "json" || "csv" || "tsv"
  },
})

type transferDataType = {
  logId: string,
  amount?: number;
  time: Date;
  from?: string;
  to?: string;
}
const table1Schema: ModelSyncTableConfig<transferDataType> = {
  tableName: "transfer",
  schema: {
    time: { type: DATA_TYPE.DateTime, default: Date },
    logId: { type: DATA_TYPE.String }, 
    amount: { type: DATA_TYPE.Int32 },
    to: { type: DATA_TYPE.String }, // ALTER TABLE transfer ADD INDEX to_addr_index to TYPE bloom_filter GRANULARITY 1
    from: { type: DATA_TYPE.String }, // // ALTER TABLE transfer ADD INDEX from_addr_index from TYPE bloom_filter GRANULARITY 1
  },
  options: `ENGINE = MergeTree
  PARTITION BY toYYYYMMDD(time)
  ORDER BY time`,
  autoCreate: true,
  autoSync: true,
};

/* @typescript-eslint/explicit-function-return-type
*/
const main = async() => {
    // create database 'orm_test'
    await chOrm.createDatabase();
    // register schema and create [if] table
    const Table1Model =await chOrm.model(table1Schema);


    const resCreate = await Table1Model.insertMany([
        {
            amount: 1100,
            time: new Date(),
            logId: "0xfffA285B4cA6Ead9e537279e6B0d6d233D5e56bb_0x9059F758e2D7aB314407Cf6ae821b024e538c792_1100",
            from: "0xfffA285B4cA6Ead9e537279e6B0d6d233D5e56bb",
            to: "0x9059F758e2D7aB314407Cf6ae821b024e538c792",
        },
        {
          amount: 1100,
          time: new Date(),
          logId: "0xfffA285B4cA6Ead9e537279e6B0d6d233D5e56bb_0x9059F758e2D7aB314407Cf6ae821b024e538c792_1100_1",
          from: "0xfffA285B4cA6Ead9e537279e6B0d6d233D5e56bb",
          to: "0x9059F758e2D7aB314407Cf6ae821b024e538c792",
        },
        {
          amount: 1200,
          time: new Date(),
          logId: "0xfffA285B4cA6Ead9e537279e6B0d6d233D5e56bb_0x9059F758e2D7aB314407Cf6ae821b024e538c792_1200",
          from: "0xfffA285B4cA6Ead9e537279e6B0d6d233D5e56bb",
          to: "0x9059F758e2D7aB314407Cf6ae821b024e538c792",
        },
        {
          amount: 100,
          time: new Date(),
          logId: "0xfffA285B4cA6Ead9e537279e6B0d6d233D5e56bb_0x9059F758e2D7aB314407Cf6ae821b024e538c792_100",
          from: "0xfffA285B4cA6Ead9e537279e6B0d6d233D5e56bb",
          to: "0x9059F758e2D7aB314407Cf6ae821b024e538c792",
        },
        {
          amount: 1100,
          time: new Date(),
          logId: "0xD3c37f28F92CBC432cF7376Ae6b32B2E30Ef3f9D_0x9059F758e2D7aB314407Cf6ae821b024e538c792_1100",
          from: "0xD3c37f28F92CBC432cF7376Ae6b32B2E30Ef3f9D",
          to: "0x9059F758e2D7aB314407Cf6ae821b024e538c792",
        },
        {
          amount: 1100,
          logId: "0xD3c37f28F92CBC432cF7376Ae6b32B2E30Ef3f9D_0x9059F758e2D7aB314407Cf6ae821b024e538c792_1100_1",
          time: new Date(),
          from: "0xD3c37f28F92CBC432cF7376Ae6b32B2E30Ef3f9D",
          to: "0x9059F758e2D7aB314407Cf6ae821b024e538c792",
        },
        {
          amount: 1234,
          logId: "0xfffA285B4cA6Ead9e537279e6B0d6d233D5e56bb_0xD3c37f28F92CBC432cF7376Ae6b32B2E30Ef3f9D_1234",
          time: new Date(),
          from: "0xfffA285B4cA6Ead9e537279e6B0d6d233D5e56bb",
          to: "0xD3c37f28F92CBC432cF7376Ae6b32B2E30Ef3f9D",
        },
        {
          amount: 9000,
          logId: "0xfffA285B4cA6Ead9e537279e6B0d6d233D5e56bb_0x9059F758e2D7aB314407Cf6ae821b024e538c792_9000",
          time: new Date(),
          from: "0xfffA285B4cA6Ead9e537279e6B0d6d233D5e56bb",
          to: "0x9059F758e2D7aB314407Cf6ae821b024e538c792",
        },      
    ]);
    console.log("create:", resCreate);



    // INDEX 
    // https://clickhouse.com/docs/en/optimize/skipping-indexes#skip-index-types
    // ALTER TABLE transfer ADD INDEX from_addr_index from TYPE bloom_filter GRANULARITY 1
    // ALTER TABLE transfer ADD INDEX to_addr_index to TYPE bloom_filter GRANULARITY 1
    
    // This command only makes the index for the new data. Wishing to create for already inserted, you can use this:
    // ALTER TABLE projects MATERIALIZE INDEX name_index;
}

main()
