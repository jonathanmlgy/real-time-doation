var express = require("express"); 
var session = require('express-session');
var path = require("path"); 
var app = express(); 
var bodyParser = require('body-parser'); 
let count = 0;
const http = require('http').Server(app);
//attach http server to socket.io
const io = require('socket.io')(http);
let amount = 100;



app.use(session({
    secret: 'keyboardkitteh',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 }
}))

app.use(bodyParser.urlencoded({ extended: true })); // use it!

app.use(express.static(path.join(__dirname, "./static"))); // static content

app.set('views', path.join(__dirname, './views')); // setting up ejs and our views folder
app.set('view engine', 'ejs'); // root route to render the index.ejs view

app.get('/', function(req, res) { // post route for adding a user
    res.render("index");
})

//create a new connection
io.on('connection', function (socket) {
    console.log('a user connected:' + socket.id);
    socket.emit('donation', amount);

    socket.on('donate', function() {
        amount += 10;
        io.emit('donation', amount);
    });

    socket.on('redeem', function() {
        if (amount >= 10) {
            amount -= 10;
            io.emit('donation', amount);
        }
    });

    socket.on('beta', function(data) {
        io.emit('updateAllClients', data);
    });
});

// tell the express app to listen on port 8000
http.listen(8000, function() {
    console.log("listening on port 8000");
});
