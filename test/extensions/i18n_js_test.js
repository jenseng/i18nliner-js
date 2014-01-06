import {assert} from "chai";
import sinon from "sinon";
import extend from "../../lib/extensions/i18n_js";

describe("I18nJs extension", function() {
  var I18n = {
    translate: function(key, options) {
      return this.interpolate(options.defaultValue, options);
    },

    interpolate: function(string, options) {
      var matches = string.match(this.PLACEHOLDER);
      var placeholder;
      if (!matches)
        return string;
      for (var i = 0, len = matches.length; i < len; i++) {
        placeholder = matches[i];
        var name = placeholder.replace(this.PLACEHOLDER, "$1");
        string = string.replace(placeholder, options[name]);
      }
      return string;
    }
  };
  extend(I18n);

  describe("translate", function() {
    it("should should normalize the arguments passed into the original translate", function() {
      var spy = sinon.spy(I18n, "translateWithoutI18nliner");
      assert.equal(
        I18n.translate("Hello %{name}", {name: "bob"}),
        "Hello bob"
      );
      assert.deepEqual(
        ["Hello %{name}", {defaultValue: "Hello %{name}", name: "bob"}],
        spy.args[0]
      );
      spy.restore();
    });

    it("should apply wrappers", function() {
      var result = I18n.translate("Hello *bob*. Click **here**", {wrappers: ['<b>$1</b>', '<a href="/">$1</a>']});
      assert.equal(result, "Hello <b>bob</b>. Click <a href=\"/\">here</a>");
    });

    it("should html-escape the default when applying wrappers", function() {
      var result = I18n.translate("*bacon* > narwhals", {wrappers: ['<b>$1</b>']});
      assert.equal(result, "<b>bacon</b> &gt; narwhals");
    });
  });

  describe("interpolate", function() {
    it("should not escape anything if none of the components are html-safe", function() {
      var result = I18n.interpolate("hello & good day, %{name}", {name: "<script>"});
      assert.equal(
        result,
        "hello & good day, <script>"
      );
    });

    it("should html-escape the string and other values if any value is html-safe", function() {
      var markup = "<input>";
      var result = I18n.interpolate("type %{input} & you get this: %h{output}", {input: markup, output: markup});
      assert.equal(
        result,
        "type &lt;input&gt; &amp; you get this: <input>"
      );
    });
  });
});
