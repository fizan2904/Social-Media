import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const User = mongoose.model('user');

export default {
	signup : (req, res, next) => {
		req.checkBody('username', 'Username already in use').notEmpty();
		req.checkBody('password', 'Password is required').notEmpty();
		req.checkBody('password1', 'Password\'s do not match').equals(req.body.password1);

		let errors = req.validationErrors();

		if(errors) res.send(errors);

		User.findOne({ username: req.body.username })
			.catch(err => { throw new Error('Database error'); })
			.then(user => {
				if(user){
					res.send('Username already in use');
				}else{
					bcrypt.genSalt(11, (err, salt) => {
						bcrypt.hash(req.body.username, salt, (err, hash) => {
							req.body.password = hash;
							return next();
						});
					});
				}
			});

	},
	login : (req, res, next) => {
		if(req.body.username && req.body.username && typeof req.body.username === 'string' && typeof req.body.password === 'string'){
			return next();
		}else{
			res.send('Validation errors');
		}
	}
};