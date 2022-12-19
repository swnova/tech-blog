const path = require('path');
require('dotenv').config();
const express = require('express');
const sequelize = require('./config/connection');
const session = require('express-session');
const routes = require('./controllers');

const helpers = require('./utils/helpers');

require('dotenv').config();
const exphbs = require('express-handlebars');


const SequelizeStore = require('connect-session-sequelize')(session.Store);

const app = express();
const PORT = process.env.PORT || 3001;

const sess = {
  secret: 'notsosecret',
  cookie: {
    maxAge:1000*60*60*2
  },
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize
  })
};
app.use(session(sess));
const hbs = exphbs.create({helpers});

//middleware
app.use(express.static(path.join(__dirname, 'public')))


app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(routes);
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}!`);
  sequelize.sync({ force: false });
});