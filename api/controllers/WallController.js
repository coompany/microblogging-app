/**
 * WallController.js 
 *
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

module.exports = {

  _config: {},

  index: function(req, res) {

    Post.find().sort({ createdAt: 'desc' }).limit(30).populate('taggedUsers').populate('author').exec(function(err, posts) {

      if(err) {
        sails.log.error(err);
        res.send(500, err);
      }
      res.view('wall/index', { posts: posts });

    });

  }

};
