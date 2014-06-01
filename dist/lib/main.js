"use strict";
var I18nliner = require("./i18nliner")["default"] || require("./i18nliner");
var i18nJsExtension = require("./extension/i18n_js")["default"] || require("./extension/i18n_js");

I18nliner.extendI18nJs = i18nJsExtension;

exports["default"] = I18nliner;