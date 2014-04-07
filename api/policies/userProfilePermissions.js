/**
 * Created by acidghost on 07/04/14.
 */

module.exports = function userProfilePermissions (req, res, next) {

  sails.log('userProfilePermissions: '+req.param('id')+' : '+req.session.user.id);
  if(req.param('id') != req.session.user.id) {
    req.flash('error', 'You don\'t have permissions to do that...');
    return res.redirect('back');
  }

  next();

};
