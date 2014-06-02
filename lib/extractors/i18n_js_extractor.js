import esprima from "esprima";
import estraverse from "estraverse";
import TranslateCall from "./translate_call";
import Utils from "../utils";
import CallHelpers from "../call_helpers";
import TranslationHash from "./translation_hash";

function I18nJsExtractor(options) {
  this.source = options.source;
}

Utils.extend(I18nJsExtractor.prototype, CallHelpers);

I18nJsExtractor.prototype.run = function() {
  this.translations = new TranslationHash();

  var ast = esprima.parse(this.source, {loc: true});
  estraverse.traverse(ast, {
    enter: this.enter.bind(this),
    leave: function() {}
  });
};

I18nJsExtractor.prototype.isExtractableCall = function(node, receiver, method) {
  return node.type === "MemberExpression" &&
    !node.computed &&
    receiver.type === "Identifier" &&
    receiver.name === "I18n" &&
    method.type === "Identifier" &&
    (method.name === "t" || method.name === "translate");
};

I18nJsExtractor.prototype.enter = function(node) {
  if (node.type === "CallExpression")
    this.processCall(node);
};

I18nJsExtractor.prototype.processCall = function(node) {
  var callee = node.callee;
  var receiver = callee.object;
  var method = callee.property;

  if (this.isExtractableCall(callee, receiver, method)) {
    var line = receiver.loc.start.line;
    receiver = receiver.name;
    method = method.name;

    // convert nodes to literals where possible
    var args = this.processArguments(node.arguments);
    this.processTranslateCall(line, receiver, method, args);
  }
};

I18nJsExtractor.prototype.processArguments = function(args) {
  var result = [];
  for (var i = 0, len = args.length; i < len; i++) {
    result.push(this.evaluateExpression(args[i]));
  }
  return result;
};

I18nJsExtractor.prototype.evaluateExpression = function(node, identifierToString) {
  if (node.type === "Literal")
    return node.value;
  if (node.type === "Identifier" && identifierToString)
    return node.name;
  if (node.type === "ObjectExpression")
    return this.objectFrom(node);
  return this.UNSUPPORTED_EXPRESSION;
};

I18nJsExtractor.prototype.processTranslateCall = function(line, receiver, method, args) {
  var call = new TranslateCall(line, method, args);
  var translations = call.translations();
  for (var i = 0, len = translations.length; i < len; i++)
    this.translations.set(translations[i][0], translations[i][1]);
};

I18nJsExtractor.prototype.objectFrom = function(node) {
  var object = {};
  var props = node.properties;
  var prop;
  var key;
  for (var i = 0, len = props.length; i < len; i++) {
    prop = props[i];
    key = this.evaluateExpression(prop.key, true);
    if (typeof key !== 'string')
      return this.UNSUPPORTED_EXPRESSION;
    object[key] = this.evaluateExpression(prop.value);
  }
  return object;
};

export default I18nJsExtractor;
