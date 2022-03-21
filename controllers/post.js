const Post = require("../models/post.js")

/**
 * Get posts by timestamp
 * Support infinite scrolling
 */

//Deprecated

// exports.getPosts = async (req, res) => {
//     try {
//       var timestamp = req.query.timestamp??Date.now();
//       var limit = req.query.limit??20;
//       const posts = await Post.find( { timestamp: { $lt: timestamp } } )
//       .limit( limit )
//       .sort( '-timestamp' ).select("-content").populate("author", "firstname lastname _id");
//       return res.status(200).json(posts);
//     } catch (err) {
//       console.error(err);
//       return res.status(500).json(err);
//     }
//   };

/**
 * Search posts by flair and query
 * Support infinite scrolling
 */
exports.searchForPosts = async (req,res) => {
  //Nullcheck data
  var timestamp = req.query.timestamp??Date.now();
  var limit = req.query.limit??20;
  var query = req.query.query==""?null:req.query.query;
  var posts;
  if (query) {
    posts = await Post.find({
      "timestamp": { $lt: timestamp },
      $text: {$search: query},
    }).limit( limit )
    .sort( '-timestamp' ).select("-content").populate("author", "fullname _id");
  } else {
    posts = await Post.find({
      "timestamp": { $lt: timestamp },
    }).limit( limit )
    .sort( '-timestamp' ).select("-content").populate("author", "fullname _id");
  }
  
  return res.status(200).json(posts);
}

//Get post by Post._id
exports.getPostById = async (req, res) => {
    try {
        const id = req.params.id;
        const post = await Post.findById(id).populate("author", "fullname _id");
        return res.status(200).json(post);
    } catch (err) {
        console.error(err);
        return res.status(500).json(err);
    }
};
/**
 * Create a new post
 * Post contain text and image
 */
exports.createPost = async (req, res) => {
    try {
      const post = new Post({
        title: req.body.title,
        desc: req.body.desc,
        timestamp: Date.now(),
        author: res.locals.user._id,
        content: req.body.content,
        thumbnail: res?.locals?.images[0]??'',
      });
      const createdPost = await post.save();
      console.log("Created new post:", createdPost._id);
      return res.status(200).json(createdPost);
    } catch (err) {
      console.error(err);
      return res.status(500).json(err);
    }
};