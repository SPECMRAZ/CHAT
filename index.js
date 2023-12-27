const express = require('express');

const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
  connectionStateRecovery: {}
});

const sqlite3 = require('sqlite3');
const { open } = require('sqlite');



async function main() {
  // open the database file
  const db = await open({
    filename: 'chat.db',
    driver: sqlite3.Database
  });

  // create our 'messages' table (you can ignore the 'client_offset' column for now)
  await db.exec(`
    CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        client_offset TEXT UNIQUE,
        content TEXT
    );
  `);


  app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
  })

  app.use(express.static(__dirname + '/assets'))

  io.on('connection', (socket) => {
    socket.on('chatMessage', async (data) => {
      //...

      let result;
      try {
        // store the message in the database
        result = await db.run('INSERT INTO messages (content) VALUES (?)', data.message);
      } catch (e) {
        // TODO handle the failure
        return console.log(e);
      }
      // include the offset with the message
      io.emit('chatMessage', data, result.lastID);
      //...
      // io.emit('chatMessage', {
      //   message: data.message,
      //   name: data.name,
      // })
    })


    socket.on('userAction', (data) => {
      io.emit('userAction', {
        name: data.name,
        action: data.action,
      })
    })
  })
  
  // if (!socket.recovered) {
  //   // if the connection state recovery was not successful
  //   try {
  //     await db.each('SELECT id, content FROM messages WHERE id > ?',
  //       [socket.handshake.auth.serverOffset || 0],
  //       (_err, row) => {
  //         socket.emit('chatMessage', row.content, row.id);
  //       }
  //     )
  //   } catch (e) {
  //     // something went wrong
  //     console.log(e);
  //   }
  // }


  http.listen(3000, () => {
    console.log('Server started');
  })
}


main()