import mongoose from 'mongoose';
import IRF from './../inRoutes/IRF';
import WallController from './../controllers/Wall';

const router = require('express').Router();

// Create a Wall

router.post('/create', IRF.Auth.ensureAuth, (req, res) => {
	let newWall = new WallController(req);
	newWall.create()
		.catch(() => { throw new Error('Error from catch') })
		.then(wall => { res.send(wall); });
});

// Adds a User

router.post('/addUser/:wid', IRF.Auth.ensureAuth, (req, res) => {
	let newWall = new WallController(req);
	newWall.addUser()
		.catch(err => { if(err == "Wrong"){ res.send('Something fishy'); }})
		.then(() => { res.send('success'); });
});

// Returns the wall details

router.get('/:wid', IRF.Auth.ensureAuth, (req, res) => {
	let newWall = new WallController(req);
	newWall.findWall()
		.catch(err => { res.send(err); })
		.then(data => { res.send(data); });
});

// Returns users of the wall id given

router.get('/users/:wid', IRF.Auth.ensureAuth, (req, res) => {
	let newWall = newWall(req);
	newWall.findUsers()
		.catch(err => { res.send(err); })
		.then(data => { res.send(data); });
});

// Removes the user of the wall with given id

router.get('/removeUser/:wid/:uid', IRF.Auth.ensureAuth, (req, res) => {
	let newWall = new WallController(req);
	newWall.removeUser()
		.catch(err => { res.send(err); })
		.then(() => { res.send('Success'); });
});

// Removes the wall

router.get('/remove/:wid', IRF.Auth.ensureAuth, (req, res) => {
	let newWall = new WallController(req);
	newWall.removeWall()
		.catch(err => { res.send(err); })
		.then(() => { res.send('Success'); });
});

// Returns all walls

router.get('/', IRF.Auth.ensureAuth, (req, res) => {
	let newWall = new WallController(req);
	newWall.findWalls()
		.catch(err => { res.send(err); })
		.then(data => { res.send(data); });
});

export default router;