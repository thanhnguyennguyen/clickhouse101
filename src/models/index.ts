import { ClickhouseOrm } from "clickhouse-orm"
import Model from "clickhouse-orm/dist/model"
import config from "config"
import fs from 'fs'
import path from 'path'
import { IDataModel } from "./interface"

const rchOrm = ClickhouseOrm({
  db: {
    name: config.clickhouse.write.dbName,
  },
  debug: true,
  client: {
    url: config.clickhouse.read.url,
    port: config.clickhouse.read.port,
    basicAuth: {
      username: config.clickhouse.read.user,
      password: config.clickhouse.read.password,
    },
    debug: false,
    isUseGzip: true,
    format: "json", // "json" || "csv" || "tsv"
  },
})

const wchOrm = ClickhouseOrm({
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

  
const db : {[key: string]: {[key: string]: Model<IDataModel>}} = {
    read: {},
    write: {}
}
const init = async() => {
    // create database 'orm_test'
    await rchOrm.createDatabase()
    await wchOrm.createDatabase()
}
init()

// import all file in this dir, except index.js
fs.readdirSync(__dirname)
  .filter(function (file) {
    return (
      file.indexOf('.') !== 0 &&
      file !== 'index.js' &&
      file !== 'interface.js' &&
      file.indexOf('.map') < 0
    )
  })
  .forEach(async function (file) {
    const { schema, modelName } = await import(`${path.join(__dirname, file)}`)
    const rmodel = await rchOrm.model<IDataModel>(schema)
    const wmodel = await wchOrm.model<IDataModel>(schema)
    db.read[modelName] = rmodel
    db.write[modelName] = wmodel
  })

  export default db
