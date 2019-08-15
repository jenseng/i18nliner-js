"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _traverse = _interopRequireDefault(require("@babel/traverse"));

var _translate_call = _interopRequireDefault(require("./translate_call"));

var _utils = _interopRequireDefault(require("../utils"));

var _call_helpers = _interopRequireDefault(require("../call_helpers"));

var _translation_hash = _interopRequireDefault(require("./translation_hash"));

var _i18nliner = _interopRequireDefault(require("../i18nliner"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function I18nJsExtractor(options) {
  this.ast = options.ast;
}

_utils.default.extend(I18nJsExtractor.prototype, _call_helpers.default);

I18nJsExtractor.prototype.forEach = function (handler) {
  this.handler = handler;
  this.run();
  delete this.handler;
};

I18nJsExtractor.prototype.run = function () {
  if (!this.handler) {
    this.translations = new _translation_hash.default();
    this.handler = this.translations.set.bind(this.translations);
  }

  (0, _traverse.default)(this.ast, {
    enter: this.enter.bind(this),
    exit: this.exit.bind(this)
  });
};

I18nJsExtractor.prototype.isExtractableCall = function (node, receiver, method) {
  return node.type === "MemberExpression" && !node.computed && receiver.type === "Identifier" && receiver.name === "I18n" && method.type === "Identifier" && (method.name === "t" || method.name === "translate");
};

I18nJsExtractor.prototype.enter = function (node) {
  if (node.type === "CallExpression") this.processCall(node.node);
};

I18nJsExtractor.prototype.exit = function (node) {};

I18nJsExtractor.prototype.processCall = function (node) {
  var callee = node.callee;
  var receiver = callee.object;
  var method = callee.property;

  if (this.isExtractableCall(callee, receiver, method)) {
    var line = receiver.loc.start.line;
    receiver = receiver.name;
    method = method.name; // convert nodes to literals where possible

    var args = this.processArguments(node.arguments);
    this.processTranslateCall(line, receiver, method, args);
  }
};

I18nJsExtractor.prototype.processArguments = function (args) {
  var result = [];

  for (var i = 0, len = args.length; i < len; i++) {
    result.push(this.evaluateExpression(args[i]));
  }

  return result;
};

I18nJsExtractor.prototype.evaluateExpression = function (node, identifierToString) {
  if (node.type === "StringLiteral") return node.value;
  if (node.type === "Identifier" && identifierToString) return node.name;
  if (node.type === "ObjectExpression") return this.objectFrom(node);
  if (node.type === "BinaryExpression" && node.operator === "+") return this.stringFromConcatenation(node);
  if (node.type === "TemplateLiteral") return this.stringFromTemplateLiteral(node);
  return this.UNSUPPORTED_EXPRESSION;
};

I18nJsExtractor.prototype.buildTranslateCall = function (line, method, args) {
  return new _translate_call.default(line, method, args);
};

I18nJsExtractor.prototype.processTranslateCall = function (line, receiver, method, args) {
  var call = this.buildTranslateCall(line, method, args);
  var translations = call.translations();

  for (var i = 0, len = translations.length; i < len; i++) this.handler(translations[i][0], translations[i][1], call);
};

I18nJsExtractor.prototype.objectFrom = function (node) {
  var object = {};
  var props = node.properties;
  var prop;
  var key;

  for (var i = 0, len = props.length; i < len; i++) {
    prop = props[i];
    key = this.evaluateExpression(prop.key, true);
    if (typeof key !== 'string') return this.UNSUPPORTED_EXPRESSION;
    object[key] = this.evaluateExpression(prop.value);
  }

  return object;
};

I18nJsExtractor.prototype.stringFromConcatenation = function (node) {
  var left = this.evaluateExpression(node.left);
  var right = this.evaluateExpression(node.right);
  if (typeof left !== "string" || typeof right !== "string") return this.UNSUPPORTED_EXPRESSION;
  return left + right;
};

I18nJsExtractor.prototype.stringFromTemplateLiteral = function (node) {
  if (node.quasis.length === 1 && node.quasis[0].type === "TemplateElement") {
    return node.quasis[0].value.raw;
  }

  return this.UNSUPPORTED_EXPRESSION;
};

var _default = I18nJsExtractor;
exports.default = _default;
