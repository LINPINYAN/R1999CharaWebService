//Reverse 1999 characters yay!
//include the req package
const express = require("express");
const mysql = require('mysql2/promise');
require('dotenv').config();
const port = 26149;

//database config info
const dbConfig ={
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 100,
    queueLimit: 0,
};

//initialize express app
const app = express();
//helps app to read JSON
app.use(express.json());

//start the server
app.listen(port, () => {
    console.log("Server running on port " , port);
});

//Example route: Get all characters
app.get('/allcharacters', async (req, res) => {
    try {
        let connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute("SELECT * FROM defaultdb.characters");
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({message: 'Server error for allcharacters'});
    }
});

//Example route: Add a new character
app.post('/addcharacter', async (req, res) => {
    const {chara_name, chara_pic} = req.body;
    try{
        let connection = await mysql.createConnection(dbConfig);
        await connection. execute('INSERT INTO characters (chara_name, chara_pic) VALUES (?,?)', [chara_name, chara_pic]);
        res.status(201).json({message: 'Character '+chara_name+' added successfully'})
    } catch(err) {
        console.error(err);
        res.status(500).json({message: 'Server error - could not add character '+chara_name});
    }
});

//Update a character
app.post('/updatecharacter', async (req, res) => {
    const { id, chara_name, chara_pic } = req.body;
    try {
        let connection = await mysql.createConnection(dbConfig);
        const [result] = await connection.execute(
            'UPDATE characters SET chara_name = ?, chara_pic = ? WHERE id = ?', [chara_name, chara_pic, id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Character with ID '+id+' not found' });
        }

        res.status(200).json({ message: 'Character '+chara_name+' updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error - could not update character '+chara_name });
    }
});


//Delete a character
app.post('/deletecharacter', async (req, res) => {
    const {id, chara_name} = req.body;
    try{
        let connection = await mysql.createConnection(dbConfig);
        const[result]= await connection.execute('DELETE FROM characters WHERE id = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Character with ID '+id+' not found' });
        }
        res.status(200).json({message: 'Character with ID '+id+' deleted successfully'})
    } catch(err) {
        console.error(err);
        res.status(500).json({message: 'Server error - could not delete character '+chara_name +' '+ id});
    }
});