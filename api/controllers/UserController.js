/**
 * UserController
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
   * (specific to UserController)
   */
  _config: {},




  create: function(request, response) {

    if(request.method === "GET") {
      response.view('signup', { title: 'Microblogging app signup' });
    } else if(request.method === "POST") {
      var datas = request.body;

      User.create(datas).done(function(err, user) {
        if(err) response.view('signup', { errors: err });
        else {
          response.view('signup', { user: user });
        }
      });

      response.view('signup', { user: datas || new User() });
    }

  },

  login: function(request, response) {

    if(request.method === "GET") {
      response.view('login', { title: 'Microblogging app login' });
    } else if(request.method === "POST") {
      User.findOne({ email: request.body.email })
        .done(function(err, user) {
          if(err) {
            sails.log("Failed login...");
            response.view('login', { errors: err })
          } else {
            if(user && (request.param("password") == user.password)) {
              request.session.authenticated = true;
              request.session.user = user;
              sails.log(user);
              response.redirect('/');
            } else {
              sails.log("utente non trovato");
              request.session.authenticated = false;
              response.view('login', { errors: [{ message: 'Utente non trovato' }] })
            }
          }
        });
    }

  },

  find: function(request,response){

      if(typeof request.param("id")!= 'undefined'){
          User.findOne(request.param("id")).populate('comments').done(function(err,utente){
              if (err) {
                  sails.log(err);
                  response.view('users/read' ,{errors: err});
              } else {
                var comments = [];
                for(var c=0; c<utente.comments.length; c++) {
                  if (typeof utente.comments[c] != 'object') {
                    sails.log.warn('typeof = ' + typeof utente.comments[c]);
                  } else {
                    comments.push(utente.comments[c]);
                  }
                }
                sails.log.warn('Found comments: '+JSON.stringify(comments));

                async.map(comments, function(comment, cb) {
                  User.findOne(comment.author).done(function(err, author) {
                    if(err) {
                      sails.log.error(err);
                      response.send(500, err);
                    }
                    Post.findOne(comment.id).populate('taggedUsers').done(function(err, post) {
                      if(err) {
                        sails.log.error(err);
                        response.send(500, err);
                      }
                      comment.author = author.toJSON();
                      if(post.taggedUsers.length > 0) {
                        for(var i in post.taggedUsers) {
                          comment.taggedUsers[i] = post.taggedUsers[i];
                        }
                      }
                      cb(null, comment);
                    });
                  });
                }, function(err, comments) {
                  sails.log('Transformed comments:');
                  sails.log(comments);
                  var usr = utente.toJSON();
                  usr.comments = comments;
                  response.view('users/read', {result: usr});
                });
              }
          });
      }else {
          User.find().done(function (err, utenti) {
              if (err) {
                  sails.log(err);
                  response.view('users/list', {errors: err});
              } else {
                  response.view('users/list', {result: utenti});
                  sails.log(utenti);
              }
          });
      }
  },

  update: function(request, response) {

    var resObject = {};
    User.findOne(request.param('id')).done(function(err, usr) {
      if(err) {
        request.flash('error', 'Unable to retrieve the user...');
        resObject = { errors: err };
      } else {
        if(request.method === 'GET') {
          resObject = { user: usr };
        } else {
          for(var key in request.body) {
            usr[key] = request.body[key];
          }
          usr.save(function(err) {
            if(err) {
              request.flash('error', 'Unable to save the user...');
              resObject = { errors: err, user: usr };
            } else {
              request.flash('success', 'User saved successfully!');
              resObject = { user: usr };
            }
          });
        }
      }
    });
    response.view('users/update', resObject);

  },

    destroy: function(request,response){
      User.destroy(request.param("id")).done(function(err){
          if(err){
              sails.log("Utente non cancellato");
          }else{
              request.flash("success","Utente eliminato!");
          }
          response.redirect('/user');
      });

    },

  logout: function(req, res) {
    if(req.session.authenticated) {
      req.session.authenticated = false;
      delete req.session.user;
      res.redirect('/');
    } else {
      res.redirect('/user/login');
    }
  }

  
};
