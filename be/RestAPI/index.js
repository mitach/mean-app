const express = require('express');

const routes = require('./routes');
const { initDatabase } = require('./config/database-config');
const { PORT } = require('./constants');

const app = express();

require('./config/express-config')(app);

app.use(routes);

initDatabase()
    .then(() => {
        app.listen(PORT, () => console.log(`The app is listenong on http://localhost:${PORT}`));
    })
    .catch(err => {
        console.log('Cannot connect to database:', err);
    });