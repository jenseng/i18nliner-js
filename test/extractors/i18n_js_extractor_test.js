/* global describe, it */
import {assert} from "chai";
import I18nJsExtractor from "../../lib/extractors/i18n_js_extractor";
import Errors from "../../lib/errors";

describe("I18nJsExtractor", function() {
  describe(".translations", function() {
    function extract(source) {
      var extractor = new I18nJsExtractor({source: source});
      extractor.run();
      return extractor.translations;
    }

    it("should ignore non-t calls", function() {
      assert.deepEqual(
        extract("foo('Foo')"),
        {}
      );
    });

    it("should not extract t calls with no default", function() {
      assert.deepEqual(
        extract("I18n.t('foo.foo')"),
        {}
      );
    });

    it("should extract valid t calls", function() {
      assert.deepEqual(
        extract("I18n.t('Foo')"),
        {Foo: "Foo"}
      );
      assert.deepEqual(
        extract("I18n.t('bar', 'Baz')"),
        {bar: "Baz"}
      );
      assert.deepEqual(
        extract("I18n.translate('one', {one: '1', other: '2'}, {count: 1})"),
        {"one.one": "1", "one.other": "2"}
      );
      assert.deepEqual(
        extract("I18n.t({one: 'just one', other: 'zomg lots'}, {count: 1})"),
        {"zomg lots.one": "just one", "zomg lots.other": "zomg lots"}
      );
    });

    it("should bail on invalid t calls", function() {
      assert.throws(function(){
        extract("I18n.t(foo)");
      }, Errors.InvalidSignature);
      assert.throws(function(){
        extract("I18n.t('foo', foo)");
      }, Errors.InvalidSignature);
      assert.throws(function(){
        extract("I18n.t('foo', \"hello \" + man)");
      }, Errors.InvalidSignature);
      assert.throws(function(){
        extract("I18n.t('a', \"a\", {}, {})");
      }, Errors.InvalidSignature);
      assert.throws(function(){
        extract("I18n.t({one: '1', other: '2'})");
      }, Errors.MissingCountValue);
    });
  });
});
