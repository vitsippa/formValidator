###
  @author vitsippa [fsrm365@qq.com]
  @version 1.0.0
  @license MIT
  @see usage:{@link https://github.com/vitsippa/formValidator|GitHub}
###
define ()->
  class FormValidator
    constructor: (options)->
      @errorQueue = []
      @stringValidatorMap =
        empty: /^\s*\S+/i
        email: /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,6}\b/i
        number: /^\d+$/
        float: /^[\-+]?\d+(\.\d+)?$/
      @jq = null
      try
        {@form,@onValidated,@queue,@parseMessage,@jq}=options
      catch
      try
        @jq = if @jq then @jq else jQuery
      catch
      return -1 if !@jq
      @queue = [] if !@jq.isArray(@queue)
      @getAttrQueue()
      try
        @bindEventQueue @queue if @jq.isArray @queue
      catch
      @bindSubmit() if @form
    getAttrQueue: ->
      inputArray = @jq(@form).find('[data-validator]').toArray()
      for input in inputArray
        validatorStr = @jq(input).attr 'data-validator'
        event = @jq(input).attr 'data-event'
        require = @jq(input).attr 'data-require'
        errorMsg = @jq(input).attr 'data-errorMsg'
        validator = validatorStr

        regex = /^\/([\s\S]+?)\/([imgy]{0,4})$/i;
        match = regex.exec validatorStr;
        if match isnt null
          regStr = match[1]
          flag = if match.length > 2 then match[2] else null
          validator = new RegExp(regStr, flag)

        event = 'blur' if !event or typeof event is 'undefined'
        require = !!require
        @queue.push(
          tag: input
          event: event
          validator: validator
          require: require
          errorMsg: errorMsg)
    bindSubmit: ->
      return false if !@form
      @jq(@form).submit =>
        return @onSubmit()

    bindEventQueue: (queue)->
      queue = [] if !@jq.isArray(queue)
      for q in queue
        try
          @bindEvent q.tag, @_getEventByItem(q), @_getValidatorByItem(q), q
        catch

    _getEventByItem: (q)->
      try
        q = q.event if typeof q is 'object'
      catch
      return q if q and typeof q is 'string'
      return 'blur'

    _getValidatorByItem: (q)->
      try
        q = q.validator if typeof q is 'object'
      catch
      return @stringValidator if typeof q is 'string'
      return @regexpValidator if @isRegexp(q)
      return @defaultValidator

    defaultValidator: ->
    regexpValidator: (tag, event, param)->
      val = @jq(tag).val()
      regexp = param.validator
      isMatch = false
      try
        isMatch = regexp.test val
      catch
      try
        if !isMatch
          if typeof param.errorMsg is 'string'
            msg = @parseMsg param.errorMsg, tag
          @errorMsg tag, msg
      catch
      if isMatch
        @deleteErrorQueue tag
      else
        @addErrorQueue tag if param.require
      @runValidatedCallBack tag, event, isMatch, param
    commonValidatedCallBack: (tag, event, isMatch, param)->

    stringValidator: (tag, event, param)->
      validateString = param.validator
      isMatch = false
      validateStringLowCase = validateString.toLowerCase()
      if @indexOf(@keys(@stringValidatorMap), validateStringLowCase) > -1
        v = @stringValidatorMap[validateStringLowCase]
        isMatch = @stringRegexpValidator(tag, validateStringLowCase) if @isRegexp(v)
        isMatch = v.apply(@, [tag, validateStringLowCase]) if @isFunction(v)
        isMatch = !!isMatch
      try
        if !isMatch
          if typeof param.errorMsg is 'string'
            msg = @parseMsg param.errorMsg, tag
          @errorMsg tag, msg
      catch
      if isMatch
        @deleteErrorQueue tag
      else
        @addErrorQueue tag if param.require
      @runValidatedCallBack tag, event, isMatch, param
    parseMsg: (msg, tag)->
      val = @jq(tag).val()
      msg = msg.replace(/\{val}/ig, val).replace(/\{len}/ig, val.length)
      msg = @parseMessage(msg, tag) if @isFunction(@parseMessage)
      msg
    stringRegexpValidator: (tag, key)->
      val = @jq(tag).val()
      regex = @stringValidatorMap[key]
      return regex.test val
    bindEvent: (tag, event, validator)->
      param = {}
      param = arguments[3] if arguments.length > 3
      @jq(tag).on event, =>
        validator.apply @, [tag, event, param] if @isFunction(validator)
    onSubmit: ->
      for q in @queue
        try
          tag = q.tag
          event = @_getEventByItem(q)
          validator = @_getValidatorByItem(q)
          validator.apply @, [tag, event, q]
        catch
      return false if @errorQueue.length > 0
      try
        return @onValidated.apply @form if @isFunction(@onValidated)
      catch
      return true
    runValidatedCallBack: (tag, event, isMatch, param)->
      try
        if @isFunction(param.cb)
          param.cb tag, event, isMatch, param
        else
          @commonValidatedCallBack tag, event, isMatch, param
      catch
        @commonValidatedCallBack tag, event, isMatch, param
    errorMsg: (tag, str)->
      if typeof layer is 'undefined'
        alert str
      else
        layer.tips(str, tag, {
          style: ['background-color:#78BA32; color:#fff', '#78BA32'],
          maxWidth: 260,
          time: 3
          closeBtn: [0, true]
        })
    inErrorQueue: (obj)->
      return @jq.inArray obj, @errorQueue
    addErrorQueue: (obj)->
      @errorQueue.push obj if @inErrorQueue(obj) is -1
      @
    deleteErrorQueue: (obj)->
      index = @inErrorQueue(obj)
      @errorQueue.splice(index, 1) if index > -1
      @errorQueue = [] if typeof @errorQueue is 'undefined'
      @
    addStringValidator: (string, regexpOrCallBack)->
      @stringValidatorMap[string] = regexpOrCallBack
      @
    isRegexp: (obj)->
      return Object.prototype.toString.call(obj) is '[object RegExp]'
    isFunction: (obj)->
      return Object.prototype.toString.call(obj) is '[object Function]'
    indexOf: (array, val)->
      i = 0
      for v in array
        return i++ if v is val
      -1
    keys: (obj)->
      k = []
      for p of obj
        k.push p
      k
