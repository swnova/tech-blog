const router = require('express').Router();
const {User, Post, Comment} = require('../../models');
const session = require('express-session');
const withAuth = require('../../utils/auth')
const SequelizeStore = require('connect-session-sequelize')(session.Store);

