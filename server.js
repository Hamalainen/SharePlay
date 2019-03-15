
//Install express server
const express = require('express');
const path = require('path');

const app = express();

// Serve only the static files form the dist directory
app.use(express.static(__dirname + '/dist/SharePlay'));

app.get('/*', function(req,res) {
    
res.sendFile(path.join(__dirname+'/dist/SharePlay/index.html'));
});
const clientPort = process.env.PORT || 8080;

// Start the app by listening on the default Heroku port
app.listen(clientPort);

console.log("clientport: " + clientPort)


// const express = require('express');
const socketIO = require('socket.io');
// const path = require('path');

const PORT = process.env.PORT || 3000;
const INDEX = path.join(__dirname, '/dist/SharePlay/index.html');

const server = express()
  .use((req, res) => res.sendFile(INDEX) )
  .listen(PORT, () => console.log(`Listening on ${ PORT }`));

const io = socketIO(server);

io.on('connection', (socket) => {
  console.log(`Client ${socket.id} connected`);
  socket.on('disconnect', () => console.log(`Client ${socket.id} disconnected`));
});

setInterval(() => io.emit('time', new Date().toTimeString()), 1000);
