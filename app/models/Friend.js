import mongoose from 'mongoose';

const FriendSchema = mongoose.Schema({
	uid1 : {
		type : mongoose.Schema.Types.ObjectId,
		ref : 'user'
	},
	uid2 : {
		type : mongoose.Schema.Types.Objectid,
		ref : 'user'
	},
	friends : {
		type : Boolean,
		default : false
	}
}, {
	timestamps : true
});

mongoose.model('friend', FriendSchema);