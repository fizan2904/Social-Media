'use strict'

import mongoose from 'mongoose';

const Follower = mongoose.model('follower');
const Default = mongoose.model('default');

class Follower{
	constructor(req){
		this.req = req;
	}

	addRequest(){
		return new Promise((fulfill, reject) => {
			Follower.findOne({
				uid : this.req.params.uid,
				follower : this.req.session.passport.user._id,
			}).catch(err => { reject(err); })
			.then(follower => {
				if(follower != null){
					reject('Already data exist');
				}
				Default.findOne({ uid : this.req.session.passport.user._id }, { follower : 1 })
					.catch(err => { reject(err); })
					.then(defaults => {
						if(defaults.follower){
							let newFollower = new Follower({
								uid : this.req.params.uid,
								follower : this.req.session.passport.user._id,
								following : false
							});
							newFollower.save()
								.catch(err => { reject(err); })
								.then(() => { fulfill(); });
						}else{
							let newFollower = new Follower({
								uid : this.req.params.uid,
								follower : this.req.session.passport.user._id,
								following : true
							});
							newFollower.save()
								.catch(err => { reject(err); })
								.then(() => { fulfill(); });
						}
					});
			});
		});
	}

	removeRequest(){
		return new Promise((fulfill, reject) => {
			Follower.findById(this.req.params.rid)
				.catch(err => { reject(err); })
				.then(request => {
					if(request.following == true){
						reject('Something fishy');
					}
					Follower.removeById(this.req.params.rid)
						.catch(err => { reject(err); })
						.then(() => { fulfill('Success'); });
				});
		});
	}

	acceptRequest(){
		return new Promise((fulfill, reject) => {
			Follower.findById(this.rea.params.rid)
				.catch(err => { reject(err); })
				.then(request => {
					if(request.following == true){
						fulfill();
					}else{
						Follower.updateById(this.req.params.rid, { $set : { following : true }}, err => {
							if(err){ reject(err); }
							fulfill();
						});
					}
				});
		});
	}
}