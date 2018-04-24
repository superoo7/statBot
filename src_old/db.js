import * as sql from 'mssql';

//Function to connect to database and execute query
export const executeQuery = function(query) {
  const config = {
    user: process.env.USERNAME,
    password: process.env.PASSWORD,
    server: process.env.HOSTNAME,
    port: process.env.PORTNO,
    database: process.env.DATABASE
  };

  return new sql.ConnectionPool(config)
    .connect()
    .then(pool => {
      console.log('connected');
      return pool.request().query(query);
    })
    .then(result => {
      const rows = result.recordset;
      console.log(rows);
      sql.close();
      return rows;
    })
    .catch(err => {
      console.log(err);
      sql.close();
      return 'ERROR';
    });
};
