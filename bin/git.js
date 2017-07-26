var Git = require('nodegit');

// Git.Clone("https://github.com/nodegit/nodegit", "./tmp")
// 	.then(repo => {
// 		console.log(repo);
// 		return repo.getCommit("59b20b8d5c6ff8d09518454d4dd8b7b30f095ab5");
// 	})
// 	.then(commit => {
// 		console.log(commit);
// 		return commit.getEntry("README.md");
// 	})
// 	.then(entry => {
// 		console.log(entry);
// 		return entry.getBlob().then(blob => {
// 			console.log(blob);
// 			blob.entry = entry;
// 			return blob;
// 		});
// 	})
// 	.then(blob => {
// 		console.log(blob.blob.entry.path() + blob.entry.sha() + blob.rawsize() + "b");
// 		console.log(Array(72).join("=") + "\n\n");
// 		console.log(String(blob));
// 	})
// 	.catch(err => { console.log(err); });

Git.Repository.open("tmp")
	.then(function(repo) {
		return repo.getMasterCommit();
	})
	.then(function(firstCommitOnMaster) {
		var history = firstCommitOnMaster.history();
		var count = 0;
		history.on("commit", function(commit) {
			if (++count >= 9) {
				return;
			}
			console.log("commit " + commit.sha());
			var author = commit.author();
			console.log("Author:\t" + author.name() + " <" + author.email() + ">");
			console.log("Date:\t" + commit.date());
			console.log("\n    " + commit.message());
		});
	history.start();
  });