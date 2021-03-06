/**
 * User
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  attributes: {

  	/* e.g.
  	nickname: 'string'
  	*/
    username: {
      type: 'string',
      required: true,
      unique: true
    },
    email: {
      type: 'string',
      required: true,
      email: true,
        unique: true
    },
    password: {
      type: 'string',
      required: true,
      minLength: 6
    },
    firstName:{
       type: 'string'
    },
    lastName:{
        type:'string'
    },
    dateOfBirth:{
        type:'date'
    },

    comments: {
      collection: 'post',
      via: 'taggedUsers',
      dominant: true
    },

    toJSON: function() {
      var obj = this.toObject()
      delete obj.password;
      delete obj.createdAt;
      delete obj.updatedAt;
      return obj;
    }

    
  }

};
