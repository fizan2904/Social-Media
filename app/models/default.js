import mongoose from 'mongoose';

const DefaultSchema = mongoose.Schema({
	uid : {
		type : mongoose.Schema.Types.ObjectId,
		ref : 'user'
	},
	follower : {
		should_request : {
			type : Boolean,
			default : true
		}
	}
}, {
	timestamps : true
});

mongoose.model('default', DefaultSchema);