import User from './routes/User';
import Wall from './routes/Wall';
import Post from './routes/Post';
import index from './routes/index';
import Friend from './routes/Friend';
import Follower from './routes/Follower';
import Dashboard from './routes/Dashboard';

export default {
	index : index,
	user : User,
	dashboard : Dashboard,
	wall : Wall,
	post : Post,
	friend : Friend,
	follower : Follower
};