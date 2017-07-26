import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import passport from 'passport';
import AuthController from './../controllers/Auth';
import IRF from './../inRoutes/IRF';

const router = require('express').Router();
const User = mongoose.model('user');
const UserDetails = mongoose.model('userDetails');
const LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy(AuthController.strategy));
passport.serializeUser(AuthController.serialize);
passport.deserializeUser(AuthController.deserialize);

router.post('/signup', IRF.UserValidation.signup, (req, res) => {
	let newUser = new User({
		username : req.body.username,
		password : req.body.password
	});
	newUser.save()
		.catch(err => { throw new Error('Database error'); })
		.then(() => res.send('success'));
});

router.post('/login', IRF.UserValidation.login, 
	passport.authenticate(
		'local',{
			successRedirect:'/dashboard',
			failureRedirect:'/user/login',
			failureFlash: true
		}
	)
);

router.get('/logout', (req, res) => {
	req.logout();
	res.redirect('/user/logout');
});

router.post('/details', IRF.Auth.ensureAuth, (req, res) => {
	let newDet = new UserDetails(req.body);
	UserDetails.findOneAndUpdate({
		uid : req.session.passport.user._id
	}, {
		$set : {newDet}
	}, {
		upsert : true, new : true
	}, (err, docs) => {
		res.send(docs);
	});
});

router.get('/details', IRF.Auth.ensureAuth, (req, res) => {
	UserDetails.findOne({ uid : req.session.passport.user._id })
		.catch(err => { throw new Error('Database error'); })
		.then(data => { res.send(data); });
});

export default router;