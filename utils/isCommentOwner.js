const Comment = require("../models/comment");

const isCommentOwner = async (req, res, next) => {
  const comment = await Comment.findById(req.params.commentId).exec();

  if (comment.owner.id.equals(req.user._id)) {
    return next();
  } else {
    res.redirect("back");
  }
};

module.exports = isCommentOwner;
