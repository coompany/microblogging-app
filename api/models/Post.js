/**
 * Post
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  attributes: {
  	
  	text: {
      type: 'string',
      required: true,
      maxLength: 140
    },

    author: {
      model: 'user'
    },
    taggedUsers: {
      collection: 'user',
      via: 'comments'
    }
    
  }

};
