'use strict'

import mongoose from 'mongoose';

const Wall = mongoose.model('wall');
const Post = mongoose.model('post');
const GroupWallUser = mongoose.model('groupWallUser');
const SharedWallUser = mongoose.model('sharedWallUser');

class PostController{
	constructor(req){
		this.req = req;
	}

	addPost(){
		return new Promise((fulfill, reject) => {
			Wall.findById(this.req.params.wid)
				.catch(err => { reject(err); })
				.then(wall => {
					if(wall != null){
						if(wall.uid == this.req.session.passport.user._id){
							let newPost = new Post(this.req.body.post);
							newPost.save()
								.catch(err => { reject(err); })
								.then(() => { fulfill(newPost); });
						}else{
							if(wall.wall_type == "Shared"){
								SharedWallUser.findOne({ wid : this.req.params.wid, uid : this.req.session.passport.user._id })
									.catch(err => { reject(err); })
									.then(user => {
										if(user != null){
											if(user.authority != 444){
												let newPost = new Post(this.req.body.post);
												newPost.save()
													.catch(err => { reject(err); })
													.then(newPost => { fulfill(newPost); });
											}else{
												reject('Not authorized to post');
											}
										}
									});
							}else if(wall.wall_type == "Group"){
								if(wall.settings.allCanPost){
									let newPost = new Post(this.req.body.post);
									newPost.save()
										.catch(err => { reject(err); })
										.then(newPost => { fulfill(newPost); });
								}else{
									GroupWallUser.findOne({ wid : this.req.params.wid, uid : this.req.session.passport.user._id })
										.catch(err => { reject(err); })
										.then(user => {
											if(user != null){
												if(user.admin){
													let newPost = new Post(this.req.body.post);
													newPost.save()
														.catch(err => { reject(err); })
														.then(newPost => { fulfill(newPost); });
												}else{
													reject('Not admin');
												}
											}else{
												reject('Something fishy');
											}
										});
								}
							}else{
								reject('Something fishy');
							}
						}
					}else{
						reject('No such wall');
					}
				});
		});
	}

	removePost(){
		return new Promise((fulfill, reject) => {
			Post.findById(this.req.params.pid)
				.catch(err => { reject(err); })
				.then(post => {
					if(post != null){
						if(post.uid == this.req.session.passport.user._id){
							Post.removeById(this.req.params.pid)
								.catch(err => { reject(err); })
								.then(() => { fulfill(); });
						}else{
							Wall.findById(post.wid)
								.catch(err => { reject(err); })
								.then(wall => {
									if(wall.wall_type == "Private" || wall.wall_type == "Public"){
										reject('Something fishy');
									}else if(wall.wall_type == "Shared"){
										SharedWallUser.findOne({ wid : post.wid, uid : this.req.session.passport.user._id })
											.catch(err => { reject(err); })
											.then(shared => {
												if(shared.authority >= 444){
													Post.removeById(this.req.params.pid)
														.catch(err => { reject(err); })
														.then(() => { fulfill(); });
												}else{
													reject('Not authorized');
												}
											});
									}else {
										reject('err');
									}
								});
						}
					}
				});
		});
	}

	updatePost(){
		return new Promise((fulfill, reject) => {
			Post.findById(this.req.params.pid)
				.catch(err => { reject(err); })
				.then(post => {
					if(post == null){
						reject();
					}
					if(post.uid == this.req.session.passport.user._id){
						Post.findByIdAndUpdate(this.req.params.pid, { $set : this.req.body.updates }, { upsert : false, new : true }, (err, upd) => {
							if(err){ reject(err); }
							fulfill(upd);
						});
					}else{
						Wall.findById(post.wid)
							.catch(err => { reject(err); })
							.then(wall => {
								if(wall.wall_type == "Shared"){
									SharedWallUser.findOne({ uid : this.req.session.passport.user._id })
										.catch(err => { reject(err); })
										.then(user => {
											if(user.authority >= 222){
												Post.findByIdAndUpdate(this.params.pid, { $set : this.req.body.updates }, { upsert : false, new : true }, (err, upd) => {
													if(err){ reject(err); }
													fulfill(upd);
												});
											}
										});
								}
							});
					}
				});
		});
	}

	listWallPosts(){
		return new Promise((fulfill, reject) => {
			Wall.findById(this.req.params.wid)
				.catch(err => { reject(err); })
				.then(wall => {
					if(wall == null){
						reject('No such wall');
					}
					Post.find({ wid : this.req.params.wid })
						.catch(err => { reject(err); })
						.then(posts => {
							fulfill(posts);
						});
				});
		});
	}
}

export default PostController;