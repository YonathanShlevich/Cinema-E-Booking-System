
const express = require('express');
const oracledb = require('oracledb');

const app = express();
const PORT = process.env.PORT || 5000;

// Oracle DB connection configuration
const dbConfig = {
  user: 'ADMIN',
  password: 'Secondtry123!',
  connectString: '(description= (retry_count=20)(retry_delay=3)(address=(protocol=tcps)(port=1522)(host=adb.us-ashburn-1.oraclecloud.com))(connect_data=(service_name=g4972bb3a0743d2_cinemasystems_low.adb.oraclecloud.com))(security=(ssl_server_dn_match=yes)))'
};

// Establish connection pool
async function init() {
  try {
    await oracledb.createPool(dbConfig);
    console.log('Oracle Database connection pool created');
  } catch (err) {
    console.error('Error creating Oracle Database connection pool', err);
  }
}

// Initialize connection pool
init();

// Sample endpoint to fetch data from Oracle DB
app.get('/api/data', async (req, res) => {
  let connection;
  try {
    connection = await oracledb.getConnection();
    const result = await connection.execute('SELECT * FROM your_table');
    res.json(result.rows);
  } catch (err) {
    console.error('Error executing query', err);
    res.status(500).json({ error: 'Error executing query' });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error('Error closing connection', err);
      }
    }
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});