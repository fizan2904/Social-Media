import mongoose from 'mongoose';
import IRF from './../inRoutes/IRF';

const router = require('express').Router();

router.get('/', IRF.Auth.ensureAuth, (req, res) => {
	res.send('dash');
});

export default router;