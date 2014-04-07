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
    blueprints: {
      pluralize: true
    }
  },


  create: function(req, res) {

    User.findOne(req.session.user.id).done(function(err, user) {
      if(err) {
        res.send(500, err);
      } else {
        if(user) {
          Post.create({
            text: req.param('message'),
            author: req.session.user.id
          }).done(function(err, post) {
            if(err) {
              req.flash('error', 'Error creating the message...');
              res.view('users/read', { user: user, newPost: post });
            }
          });
        } else {
          req.flash('error', 'Unable to find the requested user...');
        }
      }
    });

  }

  
};
