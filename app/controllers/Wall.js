'use strict'

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const Wall = mongoose.model('wall');
const SharedWallUser = mongoose.model('sharedWallUser');
const GroupWallUser = mongoose.model('groupWallUser');

class WallController{
	constructor(req){
		this.req = req;
	}
	
	validate(){
		return new Promise((fulfill, reject) => {
			if(this.req.body.title && this.req.body.wall_type){
				fulfill();
			}else{
				reject();
			}
		});
	}
	
	create(){
		return new Promise((fulfill, reject) => {
			this.validate()
				.catch(() => { reject(); })
				.then(() => {
					let newWall = new Wall({
						uid : this.req.session.passport.user._id,
						title : this.req.body.title,
						wall_type : this.req.body.wall_type
					});
					if(this.req.body.wall_type == "Shared" && this.req.body.master_password){
						bcrypt.genSalt(11, (err, salt) => {
							bcrypt.hash(this.req.body.master_password, salt, (err, hash) => {
								newWall.master_password = hash;
								newWall.save()
									.catch(err => {
										reject(err);
									})
									.then(() => {
										fulfill(newWall);
									});
							});
						});
					}else{
						newWall.save()
							.catch(err => { reject(err); })
							.then(() => { fulfill(newWall); });
					}
				});
		});
	}

	findWall(){
		return new Promise((fulfill, reject) => {
			Wall.findById(this.req.params.wid)
				.catch(err => { reject(err); })
				.then(wall => {
					if(wall.uid == this.req.session.passport.user._id){
						fulfill(wall);
					}else{
						if(wall.wall_type == "Public"){
							fulfill(wall);
						}else if(wall.wall_type == "Private"){
							if(wall.uid == this.req.session.passport.user._id){
								fulfill(wall);
							}else{
								reject('Something fishy');
							}
						}else if(wall.wall_type == "Group"){
							GroupWallUser.findOne({ wid : this.req.params.wid, uid : this.req.session.passport.user._id })
								.catch(err => { reject(err); })
								.then(data => {
									if(data != null){
										fulfill(wall);
									}else{
										reject('Something fishy');
									}
								});
						}else{
							SharedWallUser.findOne({ wid : this.req.params.wid, uid : this.req.session.passport.user._id })
								.catch(err => { reject(err); })
								.then(data => {
									if(data != null){
										fulfill(wall);
									}else{
										reject('Something fishy');
									}
								});
						}
					}
				});
		});
	}

	findWalls(){
		return new Promise((fulfill, reject) => {
			Wall.find({ uid : this.req.session.passport.user._id })
				.catch(err => { reject(err); })
				.then(walls => {
					SharedWallUser.find({ uid : this.req.session.passport.user._id })
						.catch(err => { reject(err); })
						.then(shared => {
							GroupWallUser.find({ uid : this.req.session.passport.user._id })
							.catch(err => { reject(err); })
							.then(groups => {
								fulfill(walls, shared, groups);
							});
						});
				});
		});
	}

	removeWall(){
		return new Promise((fulfill, reject) => {
			Wall.findById(this.req.params.wid)
				.catch(err => { reject(err); })
				.then(data => {
					if(data != null){
						if(data.wall_type == "Public" || data.wall_type == "Private" || data.wall_type == "Shared"){
							if(data.uid == this.req.session.passport.user._id){
								Wall.removeById(data._id)
									.catch(err => { reject(err); })
									.then(() => {
										if(data.wall_type == "Shared"){
											SharedWallUser.remove({ wid : data._id })
												.catch(err => { reject(err); })
												.then(() => { fulfill(); });
										}
										fulfill();
									});
							}else{
								reject('Something fishy');
							}
						}else{
							GroupWallUser.find({ wid : this.req.params.wid, admin : true })
								.catch(err => { reject(err); })
								.then(docs => {
									if(docs.length != 0){
										reject('Not the only admin');
									}else{
										Wall.removeById(data._id)
											.catch(err => { reject(err); })
											.then(() => {
												GroupWallUser.remove({ wid : data._id })
													.catch(err => { reject(err); })
													.then(() => {
														fulfill();
													});
											});
									}
								});
						}
					}
				});
		});
	}

	addUser(){
		return new Promise((fulfill, reject) => {
			Wall.findById(this.req.params.wid)
				.catch(err => { throw err; })
				.then(data => {
					if(data != null){
						if(data.wall_type == "Shared"){
							SharedWallUser.find()
								.catch(err => { throw err; })
								.then(users => {
									var fin = [];
									for(var i=0;i<this.req.body.participants.length;i++){
										var exists = false;
										for(var j=0;j<users.length;j++){
											if(users[j].uid == this.req.body.participants[i].uid){
												exists = true;
											}
										}
										if(!exists){
											fin.push(new SharedWallUser(this.req.body.participants[i]).save());
											exists = false;
										}
									}
									if(fin.length > 0){
										Promise.all(fin)
											.catch(err => { reject(err); })
											.then(() => { fulfill(); });
									}else{
										reject('Wrong');
									}
								});
						}else{
							GroupWallUser.find()
								.catch(err => { throw err; })
								.then(users => {
									var fin = [];
									for(var i=0;i<this.req.body.participants.length;i++){
										var exists = false;
										for(var j=0;j<users.length;j++){
											if(users[j].uid == this.req.body.participants[i].uid){
												exists = true;
											}
										}
										if(!exists){
											fin.push(new GroupWallUser(this.req.body.participants[i]).save());
											exists = false;
										}
									}
									if(fin.length > 0){
										Promise.all(fin)
											.catch(err => { reject(err); })
											.then(() => { fulfill(); });
									}else{
										reject('Wrong');
									}
								});
						}
					}
				});
		});
	}

	findUsers(){
		return new Promise((fulfill, reject) => {
			Wall.findById(this.req.params.wid)
				.catch(err => { reject(err); })
				.then(data => {
					if(data != null){
						if(data.wall_type == "Shared"){
							SharedWallUser.find({ wid : this.req.params.wid })
								.catch(err => { reject(err); })
								.then(data => { fulfill(data); });
						}else if(data.wall_type == "Group"){
							GroupWallUser.find({ wid : this.req.params.wid })
								.catch(err => { reject(err); })
								.then(data => { fulfill(data); });
						}else{
							reject('Something fishy');
						}
					}else{
						reject('Something fishy');
					}
				});
		});
	}

	removeUser(){
		return new Promise((fulfill, reject) => {
			Wall.findOne({ wid : this.req.params.wid })
				.catch(err => { reject(err); })
				.then(data => {
					if(data != null){
						if(data.wall_type == "Group"){
							GroupWallUser.findOne({ wid : this.req.params.wid, uid : this.req.params.uid })
								.catch(err => { reject(err); })
								.then(user => {
									if(user != null){
										if(data.uid == this.req.session.passport.user._id){
											GroupWallUser.removeById(user._id)
												.catch(err => { reject(err); })
												.then(() => { fulfill(); });
										}
										GroupWallUser.findOne({ wid : this.req.params.wid, uid : this.req.session.passport.user._id })
											.catch(err => { reject(err); })
											.then(docs => {
												if(docs != null){
													if(docs.admin){
														if(user.admin){
															reject('Admin cant be removed');
														}
														GroupWallUser.removeById(user._id)
															.catch(err => { reject(err); })
															.then(() => { fulfill(); });
													}else{
														reject('Not the admin');
													}
												}else{
													reject('Something fishy');
												}
											});
									}
								});
						}else if(data.wall_type == "Shared"){
							if(data.uid == this.req.session.passport.user._id){
								SharedWallUser.findOne({ uid : this.req.params.uid, wid : this.req.params.wid })
									.catch(err => { reject(err); })
									.then(docs => {
										if(docs != null){
											if(data.uid == this.req.session.passport.user._id){
												SharedWallUser.removeById(docs._id)
													.catch(err => { reject(err); })
													.then(() => { fulfill(); });
											}
										}
									});
							}
						}else{
							reject('Something fishy');
						}
					}
				});
		});
	}
}

export default WallController;