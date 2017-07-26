import mongoose from 'mongoose';

const SharedWallUserSchema = mongoose.Schema({
	wid : {
		type : mongoose.Schema.Types.ObjectId,
		ref : 'wall'
	},
	uid : {
		type : mongoose.Schema.Types.ObjectId,
		ref : 'user'
	},
	permissions : {
		type : Number,
		default : 744
	},
	password : {
		type : String
	}
}, {
	timestamps : true
});

mongoose.model('sharedWallUser', SharedWallUserSchema);