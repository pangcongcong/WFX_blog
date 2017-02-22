'use strict';

exports.__esModule = true;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _map = require('babel-runtime/core-js/map');

var _map2 = _interopRequireDefault(_map);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _base = require('./base.js');

var _base2 = _interopRequireDefault(_base);

var _nodemailer = require('nodemailer');

var _nodemailer2 = _interopRequireDefault(_nodemailer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _class = function (_Base) {
  (0, _inherits3.default)(_class, _Base);

  function _class() {
    (0, _classCallCheck3.default)(this, _class);
    return (0, _possibleConstructorReturn3.default)(this, _Base.apply(this, arguments));
  }

  /**
   * get
   * @return {[type]} [description]
   */
  _class.prototype.getAction = function () {
    var _ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(self) {
      var where, modelInstance, user, users, posts, postsNum, commentsNum;
      return _regenerator2.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              where = {};
              modelInstance = this.modelInstance.field('id,name,display_name,email,type,status,create_time,last_login_time,app_key,app_secret');

              if (!this.id) {
                _context.next = 8;
                break;
              }

              where.id = this.id;
              _context.next = 6;
              return modelInstance.where(where).find();

            case 6:
              user = _context.sent;
              return _context.abrupt('return', this.success(user));

            case 8:

              if (this.get('type') === 'contributor') {
                where = { status: 2, type: 3 };
              } else {
                where = { status: ['!=', 2], type: ['!=', 3], _logic: 'OR' };
              }

              _context.next = 11;
              return modelInstance.where(where).select();

            case 11:
              users = _context.sent;
              _context.next = 14;
              return this.model('post').field('user_id, COUNT(*) as post_num, SUM(comment_num) as comment_num').setRelation(false).group('user_id').select();

            case 14:
              posts = _context.sent;
              postsNum = new _map2.default(posts.map(function (_ref2) {
                var user_id = _ref2.user_id,
                    post_num = _ref2.post_num;
                return [user_id, post_num];
              }));
              commentsNum = new _map2.default(posts.map(function (_ref3) {
                var user_id = _ref3.user_id,
                    comment_num = _ref3.comment_num;
                return [user_id, comment_num];
              }));


              users.forEach(function (user) {
                user.post_num = postsNum.get(user.id) || 0;
                user.comment_num = commentsNum.get(user.id) || 0;
              });

              return _context.abrupt('return', this.success(users));

            case 19:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, this);
    }));

    function getAction(_x) {
      return _ref.apply(this, arguments);
    }

    return getAction;
  }();
  /**
   * add user
   * @return {[type]} [description]
   */


  _class.prototype.postAction = function () {
    var _ref4 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(self) {
      var data, insertId;
      return _regenerator2.default.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              if (!(this.get('type') === 'key')) {
                _context2.next = 4;
                break;
              }

              _context2.next = 3;
              return this.generateKey(self);

            case 3:
              return _context2.abrupt('return', _context2.sent);

            case 4:
              data = this.post();
              _context2.next = 7;
              return this.modelInstance.addUser(data, this.ip());

            case 7:
              insertId = _context2.sent;
              return _context2.abrupt('return', this.success({ id: insertId }));

            case 9:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, this);
    }));

    function postAction(_x2) {
      return _ref4.apply(this, arguments);
    }

    return postAction;
  }();

  _class.prototype.generateKey = function () {
    var _ref5 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(self, status) {
      var isAdmin, app_key, app_secret, user, options, transporter, site_url;
      return _regenerator2.default.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              isAdmin = this.userInfo.type === firekylin.USER_ADMIN;
              // let isMine = this.userInfo.id === this.id;

              if (isAdmin) {
                _context3.next = 3;
                break;
              }

              return _context3.abrupt('return', this.failed());

            case 3:
              app_key = think.uuid();
              app_secret = think.uuid();
              _context3.next = 7;
              return this.modelInstance.generateKey(this.id, app_key, app_secret, status);

            case 7:
              _context3.next = 9;
              return this.modelInstance.where({ id: this.id }).find();

            case 9:
              user = _context3.sent;
              _context3.next = 12;
              return this.model('options').getOptions();

            case 12:
              options = _context3.sent;
              transporter = _nodemailer2.default.createTransport();
              site_url = options.hasOwnProperty('site_url') ? options.site_url : 'http://' + http.host;

              transporter.sendMail({
                from: 'no-reply@firekylin.org',
                to: user.email,
                subject: '\u3010' + options.title + '\u3011\u7F51\u7AD9\u63A8\u9001\u7533\u8BF7\u6210\u529F',
                text: '\u4F60\u7684\u63A8\u9001\u7533\u8BF7\u5BA1\u6279\u901A\u8FC7\uFF0C\u8BF7\u5C06\u4E0B\u9762\u7684\u4FE1\u606F\u6DFB\u52A0\u5230\u81EA\u5DF1\u7684\u535A\u5BA2\u4E2D\u5B8C\u6210\u6700\u540E\u7684\u63A8\u9001\u64CD\u4F5C\u3002\n        \u7F51\u7AD9\u540D\u79F0\uFF1A' + options.title + '\n        \u7F51\u7AD9\u5730\u5740\uFF1A' + site_url + '\n        app_key: ' + app_key + '\n        app_secret: ' + app_secret + '\n      '
              });

              if (status != null) {
                this.id = null;
              }
              _context3.next = 19;
              return this.getAction(self);

            case 19:
              return _context3.abrupt('return', _context3.sent);

            case 20:
            case 'end':
              return _context3.stop();
          }
        }
      }, _callee3, this);
    }));

    function generateKey(_x3, _x4) {
      return _ref5.apply(this, arguments);
    }

    return generateKey;
  }();
  /**
   * update user info
   * @return {[type]} [description]
   */


  _class.prototype.putAction = function () {
    var _ref6 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4(self) {
      var type, data, rows;
      return _regenerator2.default.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              type = this.get('type');

              if (this.id) {
                _context4.next = 3;
                break;
              }

              return _context4.abrupt('return', this.fail('PARAMS_ERROR'));

            case 3:
              if (!(type === 'contributor')) {
                _context4.next = 7;
                break;
              }

              _context4.next = 6;
              return this.generateKey(self, 1);

            case 6:
              return _context4.abrupt('return', _context4.sent);

            case 7:
              data = this.post();

              data.id = this.id;
              _context4.next = 11;
              return this.modelInstance.saveUser(data, this.ip());

            case 11:
              rows = _context4.sent;
              return _context4.abrupt('return', this.success({ affectedRows: rows }));

            case 13:
            case 'end':
              return _context4.stop();
          }
        }
      }, _callee4, this);
    }));

    function putAction(_x5) {
      return _ref6.apply(this, arguments);
    }

    return putAction;
  }();

  return _class;
}(_base2.default);

exports.default = _class;