const express = require('express');
const cookieParser = require('cookie-parser');
const hbs = require('express-handlebars');
const path = require('path');
const mongoose = require('mongoose');

const homeHandler = require('./controllers/home');
const roomHandler = require('./controllers/room');

const app = express();
const port = 8080;

// Use your MongoDB Atlas connection string here
const mongoURI = 'mongodb+srv://hnguy513:OdoXPO84kYDxjG4f@cluster0.owidxmi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';


mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Failed to connect to MongoDB', err));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.engine('hbs', hbs({ extname: 'hbs', defaultLayout: 'layout', layoutsDir: __dirname + '/views/layouts/' }));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.get('/', homeHandler.getHome);
app.post('/create', homeHandler.createRoom);
app.get('/:roomName', roomHandler.getRoom);
app.get('/:roomName/messages', roomHandler.getMessages);
app.post('/:roomName/messages', roomHandler.postMessage);
app.get('/:roomName/search', roomHandler.searchMessages);

app.listen(port, () => console.log(`Server listening on http://localhost:${port}`));
