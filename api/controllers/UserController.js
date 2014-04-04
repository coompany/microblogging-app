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

      response.view('signup');
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
            if(user) {
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
          User.findOne(request.param("id")).done(function(err,utente){
              if (err) {
                  sails.log(err);
                  response.view('users/read' ,{errors: err});
              } else {
                  response.view('users/read', {result: utente.toJSON()});
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
