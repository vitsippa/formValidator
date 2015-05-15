// Generated by CoffeeScript 1.9.1

/*
  @author vitsippa [fsrm365@qq.com]
  @version 1.0.0
  @license MIT
  @see usage:{@link https://github.com/vitsippa/formValidator|GitHub}
 */
var FormValidator;

FormValidator = (function() {
  function FormValidator(options) {
    this.errorQueue = [];
    this.stringValidatorMap = {
      empty: /^\s*\S+/i,
      email: /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,6}\b/i,
      number: /^\d+$/,
      float: /^[\-+]?\d+(\.\d+)?$/
    };
    this.jq = null;
    try {
      this.form = options.form, this.onValidated = options.onValidated, this.queue = options.queue, this.parseMessage = options.parseMessage, this.jq = options.jq;
    } catch (_error) {

    }
    try {
      this.jq = this.jq ? this.jq : jQuery;
    } catch (_error) {

    }
    if (!this.jq) {
      return -1;
    }
    if (!this.jq.isArray(this.queue)) {
      this.queue = [];
    }
    this.getAttrQueue();
    try {
      if (this.jq.isArray(this.queue)) {
        this.bindEventQueue(this.queue);
      }
    } catch (_error) {

    }
    if (this.form) {
      this.bindSubmit();
    }
  }

  FormValidator.prototype.getAttrQueue = function() {
    var errorMsg, event, flag, input, inputArray, j, len, match, regStr, regex, require, results, validator, validatorStr;
    inputArray = this.jq(this.form).find('[data-validator]').toArray();
    results = [];
    for (j = 0, len = inputArray.length; j < len; j++) {
      input = inputArray[j];
      validatorStr = this.jq(input).attr('data-validator');
      event = this.jq(input).attr('data-event');
      require = this.jq(input).attr('data-require');
      errorMsg = this.jq(input).attr('data-errorMsg');
      validator = validatorStr;
      regex = /^\/([\s\S]+?)\/([imgy]{0,4})$/i;
      match = regex.exec(validatorStr);
      if (match !== null) {
        regStr = match[1];
        flag = match.length > 2 ? match[2] : null;
        validator = new RegExp(regStr, flag);
      }
      if (!event || typeof event === 'undefined') {
        event = 'blur';
      }
      require = !!require;
      results.push(this.queue.push({
        tag: input,
        event: event,
        validator: validator,
        require: require,
        errorMsg: errorMsg
      }));
    }
    return results;
  };

  FormValidator.prototype.bindSubmit = function() {
    if (!this.form) {
      return false;
    }
    return this.jq(this.form).submit((function(_this) {
      return function() {
        return _this.onSubmit();
      };
    })(this));
  };

  FormValidator.prototype.bindEventQueue = function(queue) {
    var j, len, q, results;
    if (!this.jq.isArray(queue)) {
      queue = [];
    }
    results = [];
    for (j = 0, len = queue.length; j < len; j++) {
      q = queue[j];
      try {
        results.push(this.bindEvent(q.tag, this._getEventByItem(q), this._getValidatorByItem(q), q));
      } catch (_error) {

      }
    }
    return results;
  };

  FormValidator.prototype._getEventByItem = function(q) {
    try {
      if (typeof q === 'object') {
        q = q.event;
      }
    } catch (_error) {

    }
    if (q && typeof q === 'string') {
      return q;
    }
    return 'blur';
  };

  FormValidator.prototype._getValidatorByItem = function(q) {
    try {
      if (typeof q === 'object') {
        q = q.validator;
      }
    } catch (_error) {

    }
    if (typeof q === 'string') {
      return this.stringValidator;
    }
    if (this.isRegexp(q)) {
      return this.regexpValidator;
    }
    return this.defaultValidator;
  };

  FormValidator.prototype.defaultValidator = function() {};

  FormValidator.prototype.regexpValidator = function(tag, event, param) {
    var isMatch, msg, regexp, val;
    val = this.jq(tag).val();
    regexp = param.validator;
    isMatch = false;
    try {
      isMatch = regexp.test(val);
    } catch (_error) {

    }
    try {
      if (!isMatch) {
        if (typeof param.errorMsg === 'string') {
          msg = this.parseMsg(param.errorMsg, tag);
        }
        this.errorMsg(tag, msg);
      }
    } catch (_error) {

    }
    if (isMatch) {
      this.deleteErrorQueue(tag);
    } else {
      if (param.require) {
        this.addErrorQueue(tag);
      }
    }
    return this.runValidatedCallBack(tag, event, isMatch, param);
  };

  FormValidator.prototype.commonValidatedCallBack = function(tag, event, isMatch, param) {};

  FormValidator.prototype.stringValidator = function(tag, event, param) {
    var isMatch, msg, v, validateString, validateStringLowCase;
    validateString = param.validator;
    isMatch = false;
    validateStringLowCase = validateString.toLowerCase();
    if (this.indexOf(this.keys(this.stringValidatorMap), validateStringLowCase) > -1) {
      v = this.stringValidatorMap[validateStringLowCase];
      if (this.isRegexp(v)) {
        isMatch = this.stringRegexpValidator(tag, validateStringLowCase);
      }
      if (this.isFunction(v)) {
        isMatch = v.apply(this, [tag, validateStringLowCase]);
      }
      isMatch = !!isMatch;
    }
    try {
      if (!isMatch) {
        if (typeof param.errorMsg === 'string') {
          msg = this.parseMsg(param.errorMsg, tag);
        }
        this.errorMsg(tag, msg);
      }
    } catch (_error) {

    }
    if (isMatch) {
      this.deleteErrorQueue(tag);
    } else {
      if (param.require) {
        this.addErrorQueue(tag);
      }
    }
    return this.runValidatedCallBack(tag, event, isMatch, param);
  };

  FormValidator.prototype.parseMsg = function(msg, tag) {
    var val;
    val = this.jq(tag).val();
    msg = msg.replace(/\{val}/ig, val).replace(/\{len}/ig, val.length);
    if (this.isFunction(this.parseMessage)) {
      msg = this.parseMessage(msg, tag);
    }
    return msg;
  };

  FormValidator.prototype.stringRegexpValidator = function(tag, key) {
    var regex, val;
    val = this.jq(tag).val();
    regex = this.stringValidatorMap[key];
    return regex.test(val);
  };

  FormValidator.prototype.bindEvent = function(tag, event, validator) {
    var param;
    param = {};
    if (arguments.length > 3) {
      param = arguments[3];
    }
    return this.jq(tag).on(event, (function(_this) {
      return function() {
        if (_this.isFunction(validator)) {
          return validator.apply(_this, [tag, event, param]);
        }
      };
    })(this));
  };

  FormValidator.prototype.onSubmit = function() {
    var event, j, len, q, ref, tag, validator;
    ref = this.queue;
    for (j = 0, len = ref.length; j < len; j++) {
      q = ref[j];
      try {
        tag = q.tag;
        event = this._getEventByItem(q);
        validator = this._getValidatorByItem(q);
        validator.apply(this, [tag, event, q]);
      } catch (_error) {

      }
    }
    if (this.errorQueue.length > 0) {
      return false;
    }
    try {
      if (this.isFunction(this.onValidated)) {
        return this.onValidated.apply(this.form);
      }
    } catch (_error) {

    }
    return true;
  };

  FormValidator.prototype.runValidatedCallBack = function(tag, event, isMatch, param) {
    try {
      if (this.isFunction(param.cb)) {
        return param.cb(tag, event, isMatch, param);
      } else {
        return this.commonValidatedCallBack(tag, event, isMatch, param);
      }
    } catch (_error) {
      return this.commonValidatedCallBack(tag, event, isMatch, param);
    }
  };

  FormValidator.prototype.errorMsg = function(tag, str) {
    if (typeof layer === 'undefined') {
      return alert(str);
    } else {
      return layer.tips(str, tag, {
        style: ['background-color:#78BA32; color:#fff', '#78BA32'],
        maxWidth: 260,
        time: 3,
        closeBtn: [0, true]
      });
    }
  };

  FormValidator.prototype.inErrorQueue = function(obj) {
    return this.jq.inArray(obj, this.errorQueue);
  };

  FormValidator.prototype.addErrorQueue = function(obj) {
    if (this.inErrorQueue(obj) === -1) {
      this.errorQueue.push(obj);
    }
    return this;
  };

  FormValidator.prototype.deleteErrorQueue = function(obj) {
    var index;
    index = this.inErrorQueue(obj);
    if (index > -1) {
      this.errorQueue.splice(index, 1);
    }
    if (typeof this.errorQueue === 'undefined') {
      this.errorQueue = [];
    }
    return this;
  };

  FormValidator.prototype.addStringValidator = function(string, regexpOrCallBack) {
    this.stringValidatorMap[string] = regexpOrCallBack;
    return this;
  };

  FormValidator.prototype.isRegexp = function(obj) {
    return Object.prototype.toString.call(obj) === '[object RegExp]';
  };

  FormValidator.prototype.isFunction = function(obj) {
    return Object.prototype.toString.call(obj) === '[object Function]';
  };

  FormValidator.prototype.indexOf = function(array, val) {
    var i, j, len, v;
    i = 0;
    for (j = 0, len = array.length; j < len; j++) {
      v = array[j];
      if (v === val) {
        return i++;
      }
    }
    return -1;
  };

  FormValidator.prototype.keys = function(obj) {
    var k, p;
    k = [];
    for (p in obj) {
      k.push(p);
    }
    return k;
  };

  return FormValidator;

})();
