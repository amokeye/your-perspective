const express = require('express');
const routes = require('./controllers');
const sequelize = require('./config/connection');
const path = require('path');
const exphbs = require('express-handlebars');
const app = express();
const session = require('express-session'); 
const helpers = require('./utils/helpers');
const hbs = exphbs.create({ helpers });

const SequelizeStore = require('connect-session-sequelize')(session.Store);

// include env file
require('dotenv').config();

const PORT = process.env.PORT || 3001;

// creates session instance with a unique id
const sess = {
    secret: 'my secret',
    cookie: { maxAge: 3600000 },
    resave: false,
    saveUninitialized: true,
    store: new SequelizeStore ({
        db: sequelize
    })
};

app.use(session(sess));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

// turn on routes
app.use(routes);

// turn on connection to db and server
sequelize.sync({ force: false }).then(() => {
    app.listen(PORT, () => console.log(`App running on port ${PORT}!`));
});