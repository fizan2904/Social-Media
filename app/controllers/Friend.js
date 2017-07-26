'use strict'

import mongoose from 'mongoose';

const Friend = mongoose.model('friend');

class Friend{
	constructor(req){
		this.req = req;
	}

	addRequest(){
		return new Promise((fulfill, reject) => {
			Friend.findOne({
				$or : [
					{ uid1 : this.req.session.passport.user._id, uid2 : this.req.params.uid, friends : false },
					{ uid1 : this.req.session.passport.user._id, uid2 : this.req.params.uid, friends : true },
					{ uid1 : this.req.params.uid, uid2 : this.req.session.passport.user._id, friends : false },
					{ uid1 : this.req.params.uid, uid2 : this.req.session.passport.user._id, friends : true }
				]
			}).catch(err => { reject(err); })
			.then(data => {
				if(data != null){
					reject('Already exists');
				}
				let newRequest = new Friend({
					uid1 : this.req.session.passport.user._id,
					uid2 : this.req.params.uid,
					friends : false
				});
				newRequest.save()
					.catch(err => { reject(err); })
					.then(newRequest => { fulfill(request); });
			});
		});
	}

	removeRequest(){
		return new Promise((fulfill, reject) => {
			Friend.findById(this.req.params.rid)
				.catch(err => { reject(err); })
				.then(data => {
					if(data == null){
						reject('No such request');
					}
					Friend.removeById(this.req.params.rid)
						.catch(err => { reject(err); })
						.then(() => { fulfill('Success'); });
				});
		});
	}

	acceptRequest(){
		return new Promise((fulfill, reject) => {
			Friend.findById(this.req.params.rid)
				.catch(err => { reject(err); })
				.then(request => {
					if(request == null){
						reject('No such request');
					}
					if(uid2 == this.req.session.passport.user._id){
						Friend.findByIdAndUpdate(this.req.params.rid, { $set : { friends : true }}, err => {
							if(err) { reject(err); }
							fulfill();
						});
					}else{
						reject('Something Fishy');
					}
				});
		});
	}

	rejectRequest(){
		return new Promise((fulfill, reject) => {
			Friend.findById(this.req.params.rid)
				.catch(err => { reject(err); })
				.then(request => {
					if(request == null){
						reject('No such request');
					}
					if(uid2 == this.req.session.passport.user._id){
						Friend.removeById(this.req.params.rid)
							.catch(err => { reject(err); })
							.then(() => { fulfill(); });
					}else{
						reject('something Fishy');
					}
				});
		});
	}
}