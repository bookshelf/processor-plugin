/**
 * Attribute Processor Plugin
 *
 * Allows defining custom processor functions that handle transformation of values whenever they are `.set()` on a
 * model. This plugin modifies the {@link Model#set} method so that any defined processor functions get called when a
 * value is set on a model.
 */
module.exports = function processorPlugin(bookshelf) {
  const proto = bookshelf.Model.prototype

  bookshelf.Model = bookshelf.Model.extend({
    set(key, value, options) {
      if (!key) return this

      if (this.processors) {
        if (typeof key === 'object') {
          const processedAttributes = {}

          for (const attributeName in key) {
            processedAttributes[attributeName] = this.processAttribute(attributeName, key[attributeName])
          }

          return proto.set.call(this, processedAttributes, value, options)
        }

        value = this.processAttribute(key, value)
      }

      return proto.set.call(this, key, value, options)
    },

    /**
     * @method Model#processAttribute
     * @memberof Model
     * @private
     * @description
     * Tries to process an attribute using the associated processor or just returning the value as it is if there are no
     * processors defined for the attribute being transformed. This method is used internally by the Processor Plugin
     * and there is usually no reason to use it directly.
     *
     *     var bookshelf = Bookshelf(knex)
     *     var MyModel = bookshelf.model('MyModel', {
     *       tableName: 'my_models',
     *       processors: {
     *         name: function(value) { return value.trim() }
     *       }
     *     })
     *
     *     bookshelf.plugin('processor')
     *     var processedValue = new MyModel().processAttribute('something   ', 'name')
     *     // processedValue === 'something'
     *
     * @param {mixed} value The value that is to be transformed.
     * @param {string} key The attribute name key.
     * @return {mixed} The transformed value.
     */
    processAttribute(key, value) {
      let processes

      if (this.processors && this.processors[key]) processes = this.processors[key]
      if (!processes) return value
      if (!Array.isArray(processes)) processes = [processes]

      processes.forEach(process => {
        value = process(value)
      })

      return value
    },

    /**
     * @name Model#processors
     * @type {(Boolean|Object)}
     * @description
     * An object mapping attribute names to one or more processor functions to apply to that attribute. By default the
     * value of this property is `false` to indicate that this model doesn't have any processors set.
     * @default false
     */
    processors: false
  })
}
