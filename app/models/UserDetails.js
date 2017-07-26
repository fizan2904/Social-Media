import mongoose from 'mongoose';

const UserDetailsSchema = mongoose.Schema({
	uid : {
		type : mongoose.Schema.Types.ObjectId,
		ref : 'user'
	},
	firstname : {
		type : String,
		required : true
	},
	lastname : {
		type : String
	},
	email : {
		email_id : {
			type : String,
			lowercase : true
		},
		verified : {
			type : Boolean,
			default : false
		},
		backup_id : {
			type : String,
			lowercase : true
		}
	},
	phone : {
		phone_number : {
			type : Number
		},
		verified : {
			type : Boolean,
			default : false
		}
	}
}, {
	timestamps : true
});

mongoose.model('userDetails', UserDetailsSchema);