import * as mssql from 'mssql'

//Function to connect to database and execute query
const executeQuery = function(query: string) {
  const config: mssql.config = {
    user: `${process.env.USERNAME}`,
    password: `${process.env.PASSWORD}`,
    server: `${process.env.HOSTNAME}`,
    port: parseInt(`${process.env.PORTNO}`),
    database: `${process.env.DATABASE}`
  }
  return new mssql.ConnectionPool(config)
    .connect()
    .then(pool => {
      console.log('connected')
      return pool.request().query(query)
    })
    .then(result => {
      const rows = result.recordset
      // console.log(rows)
      // @ts-ignore
      mssql.close()
      return rows
    })
    .catch(err => {
      console.log(err)
      // @ts-ignore
      mssql.close()
      return 'ERROR'
    })
}

export default executeQuery
