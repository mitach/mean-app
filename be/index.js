const express = require('express');

const routes = require('./RestAPI/routes');
const { initDatabase } = require('./RestAPI/config/database-config');
const { PORT } = require('./RestAPI/constants');
const bodyParser = require('body-parser');

const path = require('path');

const app = express();

require('./RestAPI/config/express-config')(app);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use('/postimages', express.static(path.join('./RestAPI/images/post-images')));
app.use('/blogimages', express.static(path.join('./RestAPI/images/blog-images')));
app.use('/avatars', express.static(path.join('./RestAPI/images/avatars')));
app.use('/mainphoto', express.static(path.join('./RestAPI/main-photo')));


app.use(routes);

initDatabase()
    .then(() => {
        app.listen(PORT, () => console.log(`The app is listening on http://localhost:${PORT}`));
    })
    .catch(err => {
        console.log('Cannot connect to database:', err);
    });