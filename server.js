const PORT = 8000
const express = require('express')
const cors = require('cors')
const app = express()
require('dotenv').config()
const fetch = require('node-fetch');
app.use(express.json())
app.use(cors())

const API_KEY = process.env.API_KEY

const fs = require('fs');
// app.use((req, res, next) => {
//    res.header('Access-Control-Allow-Origin', '*');
//    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
//    next();
// });

// Specify the path to your text file
const filePath = 'data.txt';
global.fileContent = '';

// Use the readFile function to read the contents of the file
fs.readFile(filePath, 'utf8', (err, data) => {
   if (err) {
      console.error('Error reading the file:', err);
      return;
   }

   // Now, 'data' contains the contents of the file
   global.fileContent = data;

   // You can use 'fileContent' variable as needed
   console.log('File content:', global.fileContent);

});

app.post('/completions', async (req, res) => {
   const options = {
      method: "POST",
      headers: {
         "Authorization": `Bearer ${API_KEY}`,
         "Content-Type": "application/json"
      },
      body: JSON.stringify({
         model: "gpt-3.5-turbo",
         messages: [{ role: "user", content: req.body.message }],
         max_tokens: 100,
      })
   }
   try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', options)
      const data = await response.json()
      res.send(data)
   } catch (error) {
      console.error(error)
   }
})

app.listen(PORT, () => console.log('Your server is running on Port: ' + PORT))




