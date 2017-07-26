const router = require('express').Router();

router.all('/', (req, res, next) => {
	res.send('Index');
});

export default router;