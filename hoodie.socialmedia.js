/**
 * Hoodie plugin socialmedia
 * Lightweight and easy socialmedia
 */

/* global Hoodie */

Hoodie.extend(function (hoodie) {
  'use strict';

  var _subscribers = function (task) {
    var defer = window.jQuery.Deferred();
    defer.notify('_subscribers', arguments, false);
    hoodie.pubsub.subscribers(task.profile.userId)
      .then(defer.resolve)
      .fail(defer.reject);
    return defer.promise();
  };

  var _subscriptions = function (task) {
    var defer = window.jQuery.Deferred();
    defer.notify('_subscriptions', arguments, false);
    hoodie.pubsub.subscriptions(task.profile.userId)
      .then(defer.resolve)
      .fail(defer.reject);
    return defer.promise();
  };

  var _handleFollowing = function (task) {
    var defer = window.jQuery.Deferred();
    var ids = pluck(pluck(task.pubsub.subscriptions, 'doc'), 'userId');
    hoodie.profile.get(ids)
      .then(function (_task) {
        task.socialmedia = (!task.socialmedia) ? {} : task.socialmedia;
        task.socialmedia.following = pluck(_task.profile, 'doc');
        defer.resolve(task);
      })
      .fail(defer.reject);
    return defer.promise();
  };

  var _handleFollowers = function (task) {
    var defer = window.jQuery.Deferred();
    var ids = pluck(pluck(task.pubsub.subscribers, 'doc'), 'userId');
    hoodie.profile.get(ids)
      .then(function (_task) {
        task.socialmedia = (!task.socialmedia) ? {} : task.socialmedia;
        task.socialmedia.followers = pluck(_task.profile, 'doc');
        defer.resolve(task);
      })
      .fail(defer.reject);
    return defer.promise();
  };

  function partialRight(fn /*, args...*/) {
    // A reference to the Array#slice method.
    var slice = Array.prototype.slice;
    // Convert arguments object to an array, removing the first argument.
    var args = slice.call(arguments, 1);

    return function () {
      // Invoke the originally-specified function, passing in all just-
      // specified arguments, followed by any originally-specified arguments.
      return fn.apply(this, slice.call(arguments, 0).concat(args));
    };
  }

  function pluck(array, attr) {
    return array.map(function (v, k) {
      return (k === attr);
    });
  }

  hoodie.socialmedia = {

    follow: function (userName) {
      var defer = window.jQuery.Deferred();
      defer.notify('follow', arguments, false);
      var task = {
        socialmedia: {
          userName: userName
        }
      };
      hoodie.task('socialmediafollow').start(task)
        .then(defer.resolve)
        .fail(defer.reject);
      return defer.promise();
    },

    unfollow: function (userName) {
      var defer = window.jQuery.Deferred();
      defer.notify('unfollow', arguments, false);
      var task = {
        socialmedia: {
          userName: userName
        }
      };
      hoodie.task('socialmediaunfollow').start(task)
        .then(defer.resolve)
        .fail(defer.reject);
      return defer.promise();
    },

    verifyUser: function (userName) {
      var defer = window.jQuery.Deferred();
      defer.notify('verifyUser', arguments, false);
      if (!userName) {
        hoodie.profile.get()
          .then(defer.resolve)
          .fail(defer.reject);
      } else {
        hoodie.profile.getByUserName(userName)
          .then(function (task) {
            defer.resolve({
              profile: task.profile
            });
          })
          .fail(defer.reject);
      }
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

    post: function (postObject, userName) {
      var defer = window.jQuery.Deferred();
      defer.notify('post', arguments, false);
      hoodie.socialmedia.verifyUser(userName)
        .fail(defer.reject)
        .then(function (task) {
          task.socialmedia = task.profile;
          task.socialmedia.post = postObject;
          hoodie.task('socialmediapost').start(task)
            .then(defer.resolve)
            .fail(defer.reject);
        });
      return defer.promise();
    },

    updatePost: function (postObject, userName) {
      var defer = window.jQuery.Deferred();
      defer.notify('updatePost', arguments, false);
      hoodie.socialmedia.verifyUser(userName)
        .fail(defer.reject)
        .then(function (task) {
          task.socialmedia = task.profile;
          task.socialmedia.post = postObject;
          hoodie.task('socialmediaupdatepost').start(task)
            .then(defer.resolve)
            .fail(defer.reject);
        });
      return defer.promise();
    },

    deletePost: function (postObject, userName) {
      var defer = window.jQuery.Deferred();
      defer.notify('deletePost', arguments, false);
      hoodie.socialmedia.verifyUser(userName)
        .fail(defer.reject)
        .then(function (task) {
          task.socialmedia = task.profile;
          task.socialmedia.post = postObject;
          hoodie.task('socialmediadeletepost').start(task)
            .then(defer.resolve)
            .fail(defer.reject);
        });
      return defer.promise();
    },

    feed: function (userName) {
      var defer = window.jQuery.Deferred();
      defer.notify('feed', arguments, false);
      hoodie.socialmedia.verifyUser(userName)
        .fail(defer.reject)
        .then(function (task) {
          task.socialmedia = task.profile;
          hoodie.task('socialmediafeed').start(task)
            .then(defer.resolve)
            .fail(defer.reject);
        });
      return defer.promise();
    },

    comment: function (postObject, commentObject) {
      var defer = window.jQuery.Deferred();
      defer.notify('comment', arguments, false);
      var task = {
        socialmedia: {
          post: postObject,
          comment: commentObject
        }
      };
      hoodie.task('socialmediacomment').start(task)
        .then(defer.resolve)
        .fail(defer.reject);
      return defer.promise();
    },
    updateComment: function (postObject, commentObject) {
      var defer = window.jQuery.Deferred();
      defer.notify('updateComment', arguments, false);
      var task = {
        socialmedia: {
          post: postObject,
          comment: commentObject
        }
      };
      hoodie.task('socialmediaupdatecomment').start(task)
        .then(defer.resolve)
        .fail(defer.reject);
      return defer.promise();
    },
    deleteComment: function (postObject, commentObject) {
      var defer = window.jQuery.Deferred();
      defer.notify('', arguments, false);
      var task = {
        socialmedia: {
          post: postObject,
          comment: commentObject
        }
      };
      hoodie.task('socialmediadeletecomment').start(task)
        .then(defer.resolve)
        .fail(defer.reject);
      return defer.promise();
    },
    count: function (postObject, commentObject) {
      var defer = window.jQuery.Deferred();
      defer.notify('count', arguments, false);
      var task = {
        socialmedia: {
          post: postObject,
          countType: commentObject
        }
      };
      hoodie.task('socialmediacount').start(task)
        .then(defer.resolve)
        .fail(defer.reject);
      return defer.promise();
    },
    uncount: function (postObject, commentObject) {
      var defer = window.jQuery.Deferred();
      defer.notify('uncount', arguments, false);
      var task = {
        socialmedia: {
          post: postObject,
          countType: commentObject
        }
      };
      hoodie.task('socialmediauncount').start(task)
        .then(defer.resolve)
        .fail(defer.reject);
      return defer.promise();
    },
    getPost: function (postObject) {
      var defer = window.jQuery.Deferred();
      defer.notify('getPost', arguments, false);
      var task = {
        socialmedia: {
          post: postObject
        }
      };
      hoodie.task('socialmediagetpost').start(task)
        .then(defer.resolve)
        .fail(defer.reject);
      return defer.promise();
    },
    getProfile: function (userName) {
      var defer = window.jQuery.Deferred();
      defer.notify('getProfile', arguments, false);
      hoodie.socialmedia.verifyUser(userName)
        .fail(defer.reject)
        .then(function (task) {
          hoodie.socialmedia.getProfileById(task.userId)
            .then(defer.resolve)
            .fail(defer.reject);
        });
      return defer.promise();
    },
    getProfileById: function (userId) {
      var defer = window.jQuery.Deferred();
      defer.notify('getProfileById', arguments, false);
      hoodie.task('socialmediagetprofile').start({userId: userId})
        .then(defer.resolve)
        .fail(defer.reject);
      return defer.promise();
    },
    updateProfile: function (profileObject) {
      var defer = window.jQuery.Deferred();
      defer.notify('updateProfile', arguments, false);
      hoodie.task('socialmediaupdateprofile').start({profileObject: profileObject})
        .then(defer.resolve)
        .fail(defer.reject);
      return defer.promise();
    },
    share: function (postObject) {
      var defer = window.jQuery.Deferred();
      defer.notify('share', arguments, false);
      var task = {
        socialmedia: {
          post: postObject
        }
      };
      hoodie.task('socialmediashare').start(task)
        .then(defer.resolve)
        .fail(defer.reject);
      return defer.promise();
    },
    notification : {
      create: function (from, to, notificationType) {
        var defer = window.jQuery.Deferred();
        defer.notify('notification:create', arguments, false);
        var task = {
          socialmedia: {
            notification: {
              from: from,
              to: to,
              notificationType: notificationType,
              status: 'new'
            }
          }
        };
        hoodie.task('socialmedianotification').start(task)
          .then(defer.resolve)
          .fail(defer.reject);
        return defer.promise();
      },
      on: function (cb) {
        hoodie.store.on('notification:add', function (doc) {
          out('notification', doc, 'on');
          if (doc.status === 'new') {
            doc.status = 'read';
            hoodie.store.update('notification', doc.id, doc)
              .then(function () {
                cb(null, doc);
              })
              .fail(cb);
          } else {
            cb(null, doc);
          }
        });
      },
      list: function () {
        var defer = window.jQuery.Deferred();
        defer.notify('notification:create', arguments, false);
        hoodie.store.findAll('notification')
          .then(defer.resolve)
          .fail(defer.reject);
        return defer.promise();
      }
    },
    requestFriend: function (userName) {
      var defer = window.jQuery.Deferred();
      defer.notify('requestFriend', arguments, false);
      hoodie.socialmedia.verifyUser(userName)
        .fail(defer.reject)
        .then(function (task) {
          hoodie.socialmedia.notification.create(hoodie.id(), task.profile.userId, 'requestFriend')
            .then(defer.resolve)
            .fail(defer.reject);
        });
      return defer.promise();
    },
    acceptedFriend: function (userId) {
      var defer = window.jQuery.Deferred();
      defer.notify('acceptedFriend', arguments, false);
        hoodie.socialmedia.notification.create(hoodie.id(), userId, 'acceptedFriend')
          .then(defer.resolve)
          .fail(defer.reject);

      return defer.promise();
    },
    rejectedFriend: function (userName) {
      var defer = window.jQuery.Deferred();
      defer.notify('requestFriend', arguments, false);
      hoodie.socialmedia.verifyUser(userName)
        .fail(defer.reject)
        .then(function (task) {
          hoodie.socialmedia.notification.create(hoodie.id(), task.profile.userId, 'rejectedFriend')
            .then(defer.resolve)
            .fail(defer.reject);
        });
      return defer.promise();
    }
  };
  hoodie.socialmedia.like = partialRight(hoodie.socialmedia.count, 'like');
  hoodie.socialmedia.unlike = partialRight(hoodie.socialmedia.uncount, 'like');
  hoodie.socialmedia.abuse = partialRight(hoodie.socialmedia.count, 'abuse');

  // var debugPromisseGstart = function (text) {
  //   var defer = window.jQuery.Deferred();
  //   (window.debug === 'socialmedia') && console.groupCollapsed(text);
  //   defer.resolve({});
  //   return defer.promise();
  // };

  // var debugPromisseGend = function () {
  //   var defer = window.jQuery.Deferred();
  //   (window.debug === 'socialmedia') && console.groupEnd();
  //   defer.resolve({});
  //   return defer.promise();
  // };

  function out(name, obj, task) {
    if (window.debug === 'socialmedia') {
      var group = (task) ? 'task: ' + task + '(' + name + ')': 'method: ' + name;

      console.groupCollapsed(group);
      if (!!obj)
        console.table(obj);
      console.groupEnd();
    }
  }

  if (window.debug === 'socialmedia') {
    hoodie.task.on('start', function () {
      out('start', arguments[0], arguments[0].type);
    });

    // task aborted
    hoodie.task.on('abort', function () {
      out('abort', arguments[0], arguments[0].type);
    });

    // task could not be completed
    hoodie.task.on('error', function () {
      out('error', arguments, arguments[1].type);
    });

    // task completed successfully
    hoodie.task.on('success', function () {
      out('success', arguments[0], arguments[0].type);
    });
  }
});
