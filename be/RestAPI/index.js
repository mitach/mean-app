const express = require('express');

const routes = require('./routes');
const { initDatabase } = require('./config/database-config');
const { PORT } = require('./constants');
const bodyParser = require('body-parser');

const path = require('path');

const app = express();

require('./config/express-config')(app);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use('/images', express.static(path.join('./RestAPI/images')));
app.use('/blogimages', express.static(path.join('./RestAPI/blog-images')));
app.use('/avatars', express.static(path.join('./RestAPI/avatars')));
app.use('/mainphoto', express.static(path.join('./RestAPI/main-photo')));


app.use(routes);

initDatabase()
    .then(() => {
        app.listen(PORT, () => console.log(`The app is listening on http://localhost:${PORT}`));
    })
    .catch(err => {
        console.log('Cannot connect to database:', err);
    });