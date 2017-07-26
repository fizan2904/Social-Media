import mongoose from 'mongoose';

const GroupWallUserSchema = mongoose.Schema({
	wid : {
		type : mongoose.Schema.Types.ObjectId,
		ref : 'wall'
	},
	uid : {
		type : mongoose.Schema.Types.ObjectId,
		ref : 'User'
	},
	admin : {
		type : Boolean,
		default : false
	}
}, {
	timestamps : true
});

mongoose.model('groupWallUser', GroupWallUserSchema);