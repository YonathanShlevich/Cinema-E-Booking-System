const oracledb = require('oracledb');
async function runApp()
{
  let connection;
  try {
    // Use the connection string copied from the cloud console
    // and stored in connstring.txt file from Step 2 of this tutorial
    connection = await oracledb.getConnection({ user: "admin", password: "ManComeOn123!", connectionString: "(description= (retry_count=20)(retry_delay=3)(address=(protocol=tcps)(port=1521)(host=adb.us-ashburn-1.oraclecloud.com))(connect_data=(service_name=g4972bb3a0743d2_clouddb_high.adb.oraclecloud.com))(security=(ssl_server_dn_match=yes)))" });
    
    // Create a table
    //await connection.execute(`begin execute immediate 'drop table nodetab'; exception when others then if sqlcode <> -942 then raise; end if; end;`);
    //await connection.execute(`create table nodetab (id number, data varchar2(20))`);
    
    // Insert some rows
    const sql = `INSERT INTO movies VALUES (:1, :2, :3, :4, :5, :6, :7)`;
    const binds = [ ["Rush Hour", "Comedy" , "Brett Ratner", "https://www.youtube.com/watch?v=JMiFsFQcFLE", "PG-13", "March 12, March 13", "12:00pm, 1:30pm"]];    
    await connection.executeMany(sql, binds);
    // connection.commit(); // uncomment to make data persistent
    
    // Now query the rows back
    const result = await connection.execute(`SELECT * FROM MOVIE`);
    console.dir(result.rows, { depth: null });
  } catch (err) {
    console.error(err);
  } finally {
    if (connection)
      {
        try {
          await connection.close();
        } catch (err) {
          console.error(err);
      }
    }
  }
}
runApp();