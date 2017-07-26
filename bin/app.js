import morgan from 'morgan';
import express from 'express';
import passport from 'passport';
import mongoose from 'mongoose';
import models from './../app/Models';
import bodyParser from 'body-parser';
import session from 'express-session';
import compression from 'compression';
import flash from 'connect-flash-plus';
import cookieParser from 'cookie-parser';
import expressValidator from 'express-validator';
import passportConfig from '../app/controllers/Auth';

const app = express();
const MONGO_URI = 'mongodb://localhost/chun';
const MongoStore = require('connect-mongo')(session);

mongoose.Promise = global.Promise;
mongoose.connect(MONGO_URI);
mongoose.connection
	.on('error', () => {
		console.log('Error esatblishing connection');
	})
	.once('open', () => {
		console.log('Success establishing connection');
	});

app.use(morgan('dev'));
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : false }));
app.use(bodyParser.text({ type : 'text/html' }));
app.use(cookieParser());
app.use(session({
 	resave: true,
 	saveUninitialized: true,
  	secret: 'aaabbbccc',
  	store: new MongoStore({
    	url: MONGO_URI,
    	autoReconnect: true
  	})
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(expressValidator({
	errorFormatter : function(param, msg, value){
		var namespace = param.split('.'),
		root = namespace.shift(),
		formParam = root;
		while(namespace.length){
			formParam += '[' + namespace.shift() + ']';
		}return{
			param : formParam,
			msg : msg,
			value : value
		};
	}
}));
app.use(flash());
app.use(function(req, res, next){
	res.locals.success_msg = req.flash('success_msg');
	res.locals.error_msg = req.flash('Error_msg');
	res.locals.error = req.flash('error');
	res.locals.user = req.user || null;
	next();
});
app.use(express.static(__dirname + '/../tmp'));

import Routes from './../app/Routes';

app.use('/', Routes.index);
app.use('/user', Routes.user);
app.use('/wall', Routes.wall);
app.use('/post', Routes.post);
app.use('/friend', Routes.friend);
app.use('/follower', Routes.follower);
app.use('/dashboard', Routes.dashboard);

app.listen((process.env.PORT || 3000), () => {
	console.log('Server started at port 3000');
});