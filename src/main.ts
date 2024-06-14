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

type browserDataType = {
  status?: number;
  time: Date;
  browser?: string;
  browser_v?: string;
}
const table1Schema: ModelSyncTableConfig<browserDataType> = {
  tableName: "browser",
  schema: {
    time: { type: DATA_TYPE.DateTime, default: Date },
    status: { type: DATA_TYPE.Int32 },
    browser: { type: DATA_TYPE.String },
    browser_v: { type: DATA_TYPE.String },
  },
  options: `ENGINE = MergeTree
  PARTITION BY toYYYYMM(time)
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
    const Table1Model = await chOrm.model(table1Schema);

    // create data
    // const resCreate = await Table1Model.insertMany([
    //     {
    //         status: 1,
    //         time: new Date(),
    //         browser: "chrome",
    //         browser_v: "90.0.1.21",
    //     },
    //     {
    //         status: 1,
    //         time: new Date(),
    //         browser: "Firefix",
    //         browser_v: "90.0.1.25",
    //     }
    // ]);
    // console.log("create:", resCreate);

    const d  = await Table1Model.find({
      select: "*",
      limit: 3,
      // where: `browser='Firefix'`,
      })
      console.log(d)

      // update: delete and insert new one

      // const oldData : browserDataType = d[0] as browserDataType
      // const newData = {
      //   status: oldData.status,
      //   time: oldData.time,
      //   browser: "Firefox",
      //   browser_v: oldData.browser_v,
      // }
      // await 
      // await Promise.all([
      //   Table1Model.create(newData),
      //   Table1Model.delete({
      //     where: `browser='Firefix'`,
      //   })
      // ])


    // // find
    // Table1Model.find({
    // select: "*",
    // limit: 3,
    // }).then((res) => {
    // console.log("find:", res);
    // });  
    
    
    // count

    const total = await Table1Model.find({
      select: `count(*) AS total`,
    });
    console.log(total)

    // count group by

    const count = await Table1Model.find({
      select: `browser,count(*) as count`,
      groupBy: "browser",
    });
    console.log(count)

    // test sum
    const sum = await Table1Model.find({
      select: `browser,sum(status) as sum`,
      groupBy: "browser",
    });
    console.log(sum)
}

main()