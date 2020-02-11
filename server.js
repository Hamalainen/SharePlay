'use strict';

const express = require("express");
const socketIO = require('socket.io');
const path = require('path');






const PORT = process.env.PORT || 3000;

const INDEX = path.join(__dirname, '/dist/SharePlay/index.html');

const server = express()
  .use(express.static(__dirname + '/dist/SharePlay'))
  .use((req, res) => res.sendFile(INDEX))
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

const io = socketIO(server);

let rooms = [
  {
    // id: '',
    // playlist: [],
    // currentVideo: null,
    // playerState: 8,
    // currentTime: 0
    // users: [
    //   {
    //     userName: '',
    //     socketId: '',
    //     ip: '',
    //     zip: '',
    //     city: '',
    //     master: true 
    //   }
    // ]
  }
]

io.on('connection', (socket) => {

  socket.on('joinroom', (res) => {
    var roomExist = false;
    socket.join(res.roomId)
    for (var room of rooms) {
      if (room.id === res.roomId) {
        roomExist = true;
        var user = {
          userName: res.userName,
          socketId: socket.id,
          ip: '',
          zip: '',
          city: '',
          master: false
        }
        room.users.push(user);
        io.in(res.roomId).emit('room', room);
        break;
      }
    }
    if (!roomExist) {
      var room = {
        id: res.roomId,
        playlist: [],
        currentVideo: null,
        playerState: 8,
        currentTime: 0,
        users: [
          {
            userName: res.userName,
            socketId: socket.id,
            ip: '',
            zip: '',
            city: '',
            master: true
          }
        ]
      };
      rooms.push(room);
      io.in(res.roomId).emit('room', room);
      console.log(`socket ${socket.id} created ${room.id}`);
    }

  });

  socket.on('meMaster', (res) => {
    for (var room of rooms) {
      if (room.id === res.roomId) {
        for (var user of room.users) {
          if (user.socketId == socket.id) {
            io.to(`${socket.id}`).emit('isMaster', user.master);
          }
        }
      }
    }
  });

  socket.on('requestRoom', (roomId) => {
    io.in(roomId).emit('room', room);
  })

  socket.on('removedFromPlaylist', (res) => {
    for (var room of rooms) {
      if (room.id === res.roomId) {
        room.playlist.splice(room.playlist.indexOf(res.video.id), 1);
        console.log('removed: ' + res.video.id + 'from roomid: ' + room.id);
        break;
      }
    }
    socket.to(res.roomId).emit('removed', res.video);
  });

  socket.on('realTime', (res) => {
    for (var room of rooms) {
      if (room.id === res.roomId) {
        // for (var user of room.users) {
        //   if (user.socketId == socket.id) {
        //     if (user.master) {
              room.currentVideo = res.currentVideo;
              room.currentTime = res.currentTime;
              room.playerState = res.currentState;
              socket.to(res.roomId).emit('currentPlayer', room);
              break;
            }
      //     }
      //   }
      // }
    }
  });

  socket.on('addedUsername', (res) => {
    if (res.userName !== undefined) {
      for (var room of rooms) {
        if (room.id == res.roomId) {
          if (room.users === undefined) {
            continue;
          }
          for (var user of room.users) {
            if (user.socketId == socket.id) {
              user.userName = res.userName;
              io.in(res.roomId).emit('room', room);
              break;
            }
          }
          break;
        }
      }
    }
  });

  socket.on('addedLocation', (res) => {
    if (res.ip !== undefined) {
      for (var room of rooms) {
        if (room.id == res.roomId) {
          if (room.users === undefined) {
            continue;
          }
          for (var user of room.users) {
            if (user.socketId == socket.id && (user.ip == "" || user.ip != res.ip)) {
              user.ip = res.ip;
              user.zip = res.zip;
              user.city = res.city;
              io.in(res.roomId).emit('room', room);
              break;
            }
          }
          break;
        }
      }
    }
  });

  function addToPlaylist(res) {
    for (var room of rooms) {
      if (room.id === res.roomId) {
        if (!room.playlist.includes(res.video.id)) {
          room.playlist.push(res.video.id);
          break;
        }
      }
    }
    io.in(res.roomId).emit('added', res.video);
  }

  socket.on('addedToPlaylist', (res) => {
    addToPlaylist(res);
  });

  socket.on('play', (res) => {

    for (var room of rooms) {
      if (room.id === res.roomId) {
        for (var user of room.users) {
          if (user.socketId == socket.id) {
            if (user.master) {
              room.currentVideo = res.video;
              io.in(res.roomId).emit('playing', res.video);
              break;
            }
          }
        }
        break;
      }
    }
    addToPlaylist(res);
  });

  socket.on('playerEvent', (res) => {
    for (var room of rooms) {
      if (room.id === res.roomId) {
        for (var user of room.users) {
          if (user.socketId == socket.id) {
            if (res.event.data == 1) {
              // play - only mastersocket can play.
              if (user.master) {
                room.playerState = res.event.data;
                room.currentVideo = res.currentVideo;
                room.currentTime = res.currentTime;
                socket.to(res.roomId).emit('playerState', room);
              }
              else {
                io.to(`${socket.id}`).emit('playerState', room);
                // io.in(res.roomId).emit('playerState', room);
              }
            }
            if (res.event.data == 2) {
              // // pause - only mastersocket can pause.
              if (user.master) {
                room.playerState = res.event.data;
                room.currentVideo = res.currentVideo;
                room.currentTime = res.currentTime;
                socket.to(res.roomId).emit('playerState', room);
              }
              else {
                io.to(`${socket.id}`).emit('playerState', room);
                // io.in(res.roomId).emit('playerState', room);
              }
            }
            if (res.event.data == 3) {
              // someone is buffering - pause all others
              room.playerState = res.event.data;
              room.currentVideo = res.currentVideo;
              room.currentTime = res.currentTime;
              io.in(res.roomId).emit('playerState', room);

              setTimeout(() => {
                if (room.playerState === 3) {
                   room.playerState = 2;
                  io.in(res.roomId).emit('playerState', room);
                }
              }, 5000);
            }
          }
        }
      }
    }
  });

  console.log(`Client ${socket.id} connected`);
  socket.on('disconnect', () => {
    var roomId = "";
    var userIndex = 0;

    for (var room of rooms) {
      if (room.users === undefined) {
        continue;
      }
      else {
        for (var user of room.users) {
          if (user.socketId == socket.id) {
            roomId = room.id;
            if (user.master) {
              if (room.users.length > 1) {
                // if room not empty set master to the socket at first place in room
                room.users[1].master = true;
              }
              else {
                rooms.splice(rooms.indexOf(room.id), 1);
              }
            }
            //removing user from usersarray in room
            room.users.splice(userIndex, 1);
            break;
          }
          userIndex++;
        }
      }



      io.in(roomId).emit('room', room);
      console.log(`Client ${socket.id} disconnected`);
    }
  });

  socket.on('getrooms', () => {
    socket.emit('rooms', JSON.stringify(rooms));
  });


});



var app = express();
var fs = require("fs");


const PORTen = process.env.PORT || 8081;


var apiServer = app.listen(PORTen, function () {
  var host = apiServer.address().address
  var port = apiServer.address().port
  console.log("Example app listening at http://%s:%s", host, port)
});


app.get('/listUsers', function (req, res) {
  //  fs.readFile( __dirname + "/" + "users.json", 'utf8', function (err, data) {
     console.log( "kalsjadjaskdkjdsalkjsdlkajdslksajdlksajdlkjsa" );
     res.end("hshdhahdahdhadhahdahd");
  // });
});