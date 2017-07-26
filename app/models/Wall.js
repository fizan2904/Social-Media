import mongoose from 'mongoose';

const WallSchema = mongoose.Schema({
	uid : {
		type : mongoose.Schema.Types.ObjectId,
		ref : 'user'
	},
	title : {
		type : String,
		required : true
	},
	wall_type : {
		type : String,
		enum : [ "Public", "Private", "Shared", "Group" ]
	},
	master_password : {
		type : String
	}
}, {
	timestamps : true
});

mongoose.model('wall', WallSchema);