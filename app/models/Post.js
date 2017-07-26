import mongoose from 'mongoose';

const PostSchema = mongoose.Schema({
	wid : {
		type : mongoose.Schema.Types.ObjectId,
		ref : 'wall'
	},
	uid : {
		type : mongoose.Schema.Types.ObjectId,
		ref : 'user'
	},
	title : {
		type : String,
		required : true
	},
	media : [{
		originalname : String,
		mimetype : String,
		size : Number,
		path : String,
		location : {
			x : Number,
			y : Number,
			z : Number
		},
		likes : [{
			type : mongoose.Schema.Types.ObjectId,
			ref : 'user'
		}],
		comments : [{
			uid : {
				type : mongoose.Schema.Types.ObjectId,
				ref : 'user'
			},
			comment : String,
			replies : [{
				uid : {
					type : mongoose.Schema.Types.ObjectId,
					ref : 'user'
				},
				reply : String
			}]
		}],
		hashtags : [String],
		link_to : [{
			pid : {
				type : mongoose.Schema.Types.ObjectId,
				ref : 'post'
			},
			desc : String
		}]
	}]
}, {
	timestamps : true
});

mongoose.model('post', PostSchema);