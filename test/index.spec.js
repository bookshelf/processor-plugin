const { equal, throws } = require('assert')
const knex = require('knex')
const sinon = require('sinon')
const db = knex({ client: 'sqlite3', connection: ':memory:', useNullAsDefault: true })
const bookshelf = require('bookshelf')(db)
const processor = require('..')

describe('Processor Plugin', function() {
  var User

  function lowerCaseProcessor(string) {
    return string.toLowerCase()
  }

  function trimProcessor(string) {
    return string.trim()
  }

  before(function() {
    bookshelf.plugin(processor)
    User = bookshelf.Model.extend({ tableName: 'users' })
  })

  describe('Model#processors', function() {
    it('is false by default', function() {
      equal(new User().processors, false)
    })
  })

  describe('Model#set()', function() {
    it("throws an error if the specified processor doesn't exist", function() {
      var OtherUser = User.extend({
        processors: {
          username: 'nothingHere'
        }
      })

      function setUsername() {
        new OtherUser().set('username', 'test')
      }

      throws(setUsername)
    })

    it('processes the set attribute with the correct processor', function() {
      var OtherUser = User.extend({
        processors: {
          username: lowerCaseProcessor
        }
      })
      var otherUser = new OtherUser().set('username', 'TesT')

      equal(otherUser.get('username'), 'test')
    })

    it('can accept an object with attributes to process', function() {
      var OtherUser = User.extend({
        processors: {
          username: lowerCaseProcessor
        }
      })
      var otherUser = new OtherUser().set({ username: 'TesT' })

      equal(otherUser.get('username'), 'test')
    })

    it('can process an attribute with multiple processors', function() {
      var OtherUser = User.extend({
        processors: {
          username: [lowerCaseProcessor, trimProcessor]
        }
      })
      var otherUser = new OtherUser().set('username', 'TesT   ')

      equal(otherUser.get('username'), 'test')
    })

    it("doesn't do any processing if no processors are specified", function() {
      var OtherUser = User.extend({
        processors: {
          bogus: [lowerCaseProcessor]
        }
      })
      var otherUser = new OtherUser().set('username', 'TesT')

      equal(otherUser.get('username'), 'TesT')
    })

    it('can use an anonymous processor function', function() {
      var OtherUser = User.extend({
        processors: {
          username: function(string) {
            return string + '_custom'
          }
        }
      })
      var otherUser = new OtherUser().set('username', 'TesT')

      equal(otherUser.get('username'), 'TesT_custom')
    })

    it('does nothing if not passing a key name', function() {
      const spiedProcess = sinon.spy(bookshelf.Model.prototype, 'processAttribute')
      const OtherUser = User.extend({
        processors: { username: lowerCaseProcessor }
      })
      new OtherUser().set()
      spiedProcess.restore()

      equal(spiedProcess.called, false)
    })
  })
})
