import Git from 'nodegit';

const GitUser = mongoose.model('gitUser');
const Repos = mongoose.model('repo');

class Git{
	constructor(req){
		this.req = req;
	}

	push(){
		return new Promise((fulfill, reject) => {
			
		})
	}
}