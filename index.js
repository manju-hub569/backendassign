const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
const port = 3001;

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'mydb'
});

db.connect(function(err) {
    try {

    db.query("CREATE DATABASE IF NOT EXISTS mydb", (err, result) => {
        if (!err) {
            console.log('DB mydb Exist')
        }
            else {
                console.log('DB mydb created')
            }
    });

    var sql = "CREATE TABLE users (id INT AUTO_INCREMENT PRIMARY KEY,name VARCHAR(100), email VARCHAR(100), password VARCHAR(100), dob DATE)";
    db.query(sql, function (err, result) {
      if (err) {
        console.log('Table Exist')
      } else {
        console.log('Created users Table')
      }
    });        
    } catch (error) {
        if(error) {
            console.log('error', error)
        }
    }
  });

app.post('/users', (req, res) => {
    const {name, email, password, dob } = req.body;
    let quer = `INSERT INTO users (name, email, password, dob) VALUES ('${name}', '${email}' , '${password}', '${dob}')`;
    db.query(quer, (err , dt) => {
        if(!err) {
            res.send({
                status : true,
                msg : 'Insert Success'
            })
        } else {
            console.log(err)
        }
    })
});

app.get('/users', (req, res) => {
    let quer = `select * from users`;
    db.query(quer, (err , dt) => {
        if(!err) {
            res.send({
                status : true,
                data : dt
            })
        } else {
            console.log(err)
        }
    })
})


app.put('/users', (req, res) => {
    const { id, name, email, password, dob } = req.body;
    const sql = `UPDATE users SET name='${name}', email='${email}', password='${password}', dob='${dob}' WHERE id=${id}`;
    db.query(sql, (err, result) => {
        if (err) {
            console.log('Error updating user:', err);
            return res.status(500).send('Error updating user');
        }
        res.send('User updated successfully');
    });
});


app.delete('/users', (req, res) => {
    const { id } = req.query;
    const sql = `DELETE FROM users WHERE id=${id}`;
    db.query(sql, (err, result) => {
        if (err) {
            console.error('Error deleting user:', err);
            return res.status(500).send('Error deleting user');
        }
        res.send('User deleted successfully');
    });
});



app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
