import IRF from './../inRoutes/IRF';
import FriendController from './../controllers/Friend';

const router = require('express').Router();

router.get('/request/:uid', IRF.Auth.ensureAuth, (req, res) => {
	let newFriend = new FriendController(req);
	newFriend.addRequest()
		.catch(err => { res.send(err); })
		.then(() => { res.send('success'); });
});

router.get('/remove/:rid', IRF.Auth.ensureAuth, (req, res) => {
	let newFriend = new FriendController(req);
	newFriend.removeRequest()
		.catch(err => { res.send(err); })
		.then(() => { res.send('success'); });
});

router.get('/accept/:rid', IRF.Auth.ensureAuth, (req, res) => {
	let newFriend = new FriendController(req);
	newFriend.acceptRequest()
		.catch(err => { res.send(err); })
		.then(() => { res.send('success'); });
});

router.get('/reject/:rid', IRF.Auth.ensureAuth, (req, res) => {
	let newFriend = new FriendController(req);
	newFriend.rejectRequest()
		.catch(err => { res.send(err); })
		.then(() => { res.send('success'); });
});

export default router;