import mongoose from 'mongoose';

const FollowerSchema = mongoose.Schema({
	uid : {
		type : mongoose.Schema.Types.ObjectId,
		ref : 'user'
	},
	follower : {
		type : mongoose.Schema.Types.ObjectId,
		ref : 'user'
	},
	following : {
		type : Boolean,
		default : false
	}
}, {
	timestamps : true
});

mongoose.model('follower', FollowerSchema);