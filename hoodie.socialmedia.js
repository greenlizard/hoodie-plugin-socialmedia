/**
 * Hoodie plugin socialmedia
 * Lightweight and easy socialmedia
 */

/* global Hoodie */

Hoodie.extend(function (hoodie) {
  'use strict';

  var _subscribers = function (task) {
    var defer = window.jQuery.Deferred();
    hoodie.task('subscribers').start(task)
      .then(defer.resolve)
      .fail(defer.reject);
    return defer.promise();
  };

  var _subscriptions = function (task) {
    var defer = window.jQuery.Deferred();
    hoodie.task('subscriptions').start(task)
      .then(defer.resolve)
      .fail(defer.reject);
    return defer.promise();
  };

  var _handleFollowing = function (task) {
    task.following = task.subscriptions;
    return task;
  };

  var _handleFollowers = function (task) {
    task.followers = task.subscribers;
    return task;
  };

  hoodie.socialmedia = {

    follow: function (userName) {
      var task = {
        userName: userName
      };
      return hoodie.task('follow').start(task);
    },

    verifyUser: function (userName) {
      var defer = window.jQuery.Deferred();
      var task;
      if (!userName) {
        task = {
          userId: hoodie.id()
        }
        defer.resolve(task);
      } else {
        task = {
          userName: userName
        };
        hoodie.task('lookup').start(task)
          .then(function (task) {
            defer.resolve({
              userId: task.userId,
              userName: task.userName
            })
          })
          .fail(defer.reject);
      };
      return defer.promise();
    },

    following: function (userName) {
      return hoodie.socialmedia.verifyUser(userName)
        .then(_subscriptions)
        .then(_handleFollowing);
    },

    followers: function (userName) {
      return hoodie.socialmedia.verifyUser(userName)
        .then(_subscribers)
        .then(_handleFollowers);
    },

    unfollow: function (userName) {
      var task = {
        userName: userName
      };
      return hoodie.task('unfollow').start(task);
    },

    post: function (postObject, userName) {
      var defer = window.jQuery.Deferred();
      hoodie.socialmedia.verifyUser(userName)
        .then(function (task) {
          task.postObject = postObject;
          hoodie.task('post').start(task)
            .then(defer.resolve)
            .fail(defer.reject);
        });
      return defer.promise();
    },

    updatePost: function (postObject, userName) {
      var defer = window.jQuery.Deferred();
      hoodie.socialmedia.verifyUser(userName)
        .then(function (task) {
          task.postObject = postObject;
          hoodie.task('updatepost').start(task)
            .then(defer.resolve)
            .fail(defer.reject);
        });
      return defer.promise();
    },

    deletePost: function (postObject, userName) {
      var defer = window.jQuery.Deferred();
      hoodie.socialmedia.verifyUser(userName)
        .then(function (task) {
          task.postObject = postObject;
          hoodie.task('deletepost').start(task)
            .then(defer.resolve)
            .fail(defer.reject);
        });
      return defer.promise();
    },

    feed: function (userName) {
      var defer = window.jQuery.Deferred();
      hoodie.socialmedia.verifyUser(userName)
        .then(function (task) {
          hoodie.task('feed').start({userId: task.userId})
            .then(defer.resolve)
            .fail(defer.reject);
        });
      return defer.promise();
    },

    comment: function (postObjectPost, postObjectComment) {
      var defer = window.jQuery.Deferred();
      hoodie.task('comment').start({postObject: postObjectPost, commentObject: postObjectComment})
        .then(defer.resolve)
        .fail(defer.reject);
      return defer.promise();
    },
    count: function (postObjectPost, countType) {
      var defer = window.jQuery.Deferred();
      hoodie.task('count').start({postObject: postObjectPost, countType: countType})
        .then(defer.resolve)
        .fail(defer.reject);
      return defer.promise();
    },
    uncount: function (postObjectPost, countType) {
      var defer = window.jQuery.Deferred();
      hoodie.task('uncount').start({postObject: postObjectPost, countType: countType})
        .then(defer.resolve)
        .fail(defer.reject);
      return defer.promise();
    },
    getPost: function (postObjectPost) {
      var defer = window.jQuery.Deferred();
      hoodie.task('getpost').start({postObject: postObjectPost})
        .then(defer.resolve)
        .fail(defer.reject);
      return defer.promise();
    },
  }
  hoodie.socialmedia.like = _.partialRight(hoodie.socialmedia.count, 'like');
  hoodie.socialmedia.unlike = _.partialRight(hoodie.socialmedia.uncount, 'like');
  hoodie.socialmedia.abuse = _.partialRight(hoodie.socialmedia.count, 'abuse');

});
