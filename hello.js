const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const cors = require('cors');

const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());
app.post('/saveData', (req, res) => {
   const data = req.body.data;
   const filePath = 'data.txt';
   const newContent = data;
   fs.writeFile(filePath, newContent, 'utf8', (err) => {
      if (err) {
         console.error('Error writing to file:', err);
         return;
      }
      console.log('File has been updated successfully!');
   });
});

app.listen(port, () => {
   console.log(`Server is running on http://localhost:${port}`);
});