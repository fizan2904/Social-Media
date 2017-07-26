import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

let UserSchema = mongoose.Schema({
	username : {
		type : String,
		required : true
	},
	password : {
		type : String,
		required : true
	}
}, {
	timestamps : true
});

mongoose.model('user', UserSchema);