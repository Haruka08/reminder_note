// importing express
const express = require('express');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3001;

const notes = require('./db/db');
const uuid = require('./helpers/uuid');

// initialising express()
const app = express();

// to convert client side data to be parsed to JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'))
});

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'))
  });

// read db.json
app.get('/api/notes', (req, res) => {
    console.info(req.body);

      fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
          console.error(err);
        } else {
          // Convert string into JSON object
          const parsedNote = JSON.parse(data);
    return res.json(parsedNote)}

        })
  });

// write the new note to db.json
app.post('/api/notes', (req, res) => {
    console.info(`${req.method} request received to get reviews`);

    const { title, text } = req.body;

    if (title && text) {
      const newNote = {
        title,
        text,
        note_id: uuid(),
      };
  
      // Obtain existing note
      fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
          console.error(err);
        } else {
          // Convert string into JSON object
          const parsedNote = JSON.parse(data);
  
          // Add a new note
          parsedNote.push(newNote);
  
          // Write updated note back to the file
          fs.writeFile(
            './db/db.json',
            JSON.stringify(parsedNote, null, 4),
            (writeErr) =>
              writeErr
                ? console.error(writeErr)
                : console.info('Successfully updated reviews!')
          );
        }
    })

    const response = {
        status: 'success',
        body: newNote,
      };
  
      console.log(response);
      res.status(201).json(response);
    } else {
      res.status(500).json('Error in posting review');
    }
});

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);