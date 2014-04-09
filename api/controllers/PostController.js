/**
 * PostController
 *
 * @module      :: Controller
 * @description	:: A set of functions called `actions`.
 *
 *                 Actions contain code telling Sails how to respond to a certain type of request.
 *                 (i.e. do stuff, then send some JSON, show an HTML page, or redirect to another URL)
 *
 *                 You can configure the blueprint URLs which trigger these actions (`config/controllers.js`)
 *                 and/or override them with custom routes (`config/routes.js`)
 *
 *                 NOTE: The code you write here supports both HTTP and Socket.io automatically.
 *
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

module.exports = {
    
  


  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to PostController)
   */
  _config: {
    pluralize: true
  },


  create: function(req, res) {

    User.findOne(req.param('author') || req.session.user.id).done(function(err, user) {
      if(err) {
        res.send(500, err);
      } else {
        if(user) {
          var taggedUsers = req.param('taggedUsers');
          sails.log(taggedUsers);
          Post.create({
            text: req.param('text'),
            author: user.id
          }).exec(function(err, post) {
            if(err) {
              sails.log.error('Post create err: '+err);
              req.flash('error', 'Error creating the message...');
              res.redirect('back');
            } else {
              async.eachSeries(taggedUsers, function(user, cb) {
                post.taggedUsers.add(user);
                post.save(function(err) {
                  if(err) {
                    sails.log.error('Post save err: '+err);
                    res.send(500, err);
                  } else {
                    sails.log('Post saved: '+JSON.stringify(post));
                    cb();
                  }
                });
              }, function(err) {
                req.flash('success', 'Post added successfully!');
                sails.log('Post saving: '+JSON.stringify(post));
                res.redirect('back');
              });
            }
          });
        } else {
          req.flash('error', 'Unable to find the requested user...');
          res.redirect('back');
        }
      }
    });

  }

  
};
