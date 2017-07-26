import mongoose from 'mongoose';
import IRF from './../inRoutes/IRF';
import PostController from './../controllers/Post';

const router = require('express').Router();

router.get('/:wid', IRF.Auth.ensureAuth, (req, res) => {
	let newPost = new PostController(req);
	newPost.listWallPosts()
		.catch(err => { res.send(err); })
		.then(data => { res.send(data); });
});

router.get('/add/:wid', IRF.Auth.ensureAuth, (req, res) => {
	let newPost = new PostController(req);
	newPost.addPost()
		.catch(err => { res.send(err); })
		.then(() => { res.send('Success'); });
});

router.get('/remove/:wid', IRF.Auth.ensureAuth, (req, res) => {
	let newPost = new PostController(req);
	newPost.removePost()
		.catch(err => { res.send(err); })
		.then(() => { res.send('Success'); });
});

router.post('/update/:pid', IRF.Auth.ensureAuth, (req, res) => {
	let newPost = new PostController(req);
	newPost.updatePost()
		.catch(err => { res.send(err); })
		.catch(data => { res.send(data); });
})

export default router;