(function () {
	'use strict';
	
	function repoCommentIdMiddleware(req, res, next) {
		if (!req || !req.params || !req.params.userid || 
			!req.params.commentid) {
			return apiView(res, {
				status: 400,
				message: "Repo and Comment ID is a required request parameter"
			});
		}
		next();
	}
	
	module.exports = repoCommentIdMiddleware;
	
}());