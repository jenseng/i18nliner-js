/* global describe, it */
import {assert} from "chai";
import TranslateCall from "../../lib/extractors/translate_call";
import Errors from "../../lib/errors";

describe("TranslateCall", function() {
  function call() {
    return new TranslateCall(null, 't', [].slice.call(arguments));
  }

  describe("signature", function() {
    it("should reject extra arguments", function() {
      assert.throws(function() {
        call("key", "value", {}, "wat");
      }, Errors.InvalidSignature);
    });

    it("should accept a valid key or default", function() {
      assert.doesNotThrow(function() {
        call("key", "value", {});
      });

      assert.doesNotThrow(function() {
        call("key_or_value", {});
      });
    });

    it("should require at least a key or default", function() {
      assert.throws(function() {
        call();
      }, Errors.InvalidSignature);
    });

    it("should require a literal default", function() {
      assert.throws(function() {
        call("key.key", TranslateCall.prototype.UNSUPPORTED_EXPRESSION);
      }, Errors.InvalidSignature);
    });

    // for legacy calls, e.g. I18n.t("key", {defaultValue: "foo"})
    it("should allow the default to be specified in the options object", function() {
      var c = call("key", {defaultValue: "foo"});
      assert.equal(c.defaultValue, "foo");
    });

    it("should ensure options is an object literal, if provided", function() {
      assert.throws(function() {
        call("key", "value", TranslateCall.prototype.UNSUPPORTED_EXPRESSION);
      }, Errors.InvalidSignature);
    });
  });

  describe("key inference", function() {
    it("should generate literal keys", function() {
      assert.deepEqual(
        call("zomg key").translations(),
        [["zomg key", "zomg key"]]
      );
    });
  });

  describe("normalization", function() {
    it("should strip whitespace from defaults", function() {
      assert.equal(
        call("\t whitespace \n\t ").translations()[0][1],
        "whitespace"
      );
    });
  });

  describe("pluralization", function() {
    describe("defaults", function() {
      it("should be inferred", function() {
        assert.deepEqual(
          call("person", {count: 1}).translations(),
          [
            ["person.one", "1 person"],
            ["person.other", "%{count} people"]
          ]
        );
      });

      it("should not be inferred if given multiple words", function() {
        assert.deepEqual(
          call("happy person", {count: 1}).translations()[0][1],
          "happy person"
        );
      });
    });

    it("should accept valid objects", function() {
      assert.deepEqual(
        call({one: "asdf", other: "qwerty"}, {count: 1}).translations(),
        [["qwerty.one", "asdf"], ["qwerty.other", "qwerty"]]
      );
      assert.deepEqual(
        call("some_stuff", {one: "asdf", other: "qwerty"}, {count: 1}).translations(),
        [["some_stuff.one", "asdf"], ["some_stuff.other", "qwerty"]]
      );
    });

    it("should reject invalid keys", function() {
      assert.throws(function() {
        call({one: "asdf", twenty: "qwerty"}, {count: 1});
      }, Errors.InvalidPluralizationKey);
    });

    it("should require essential keys", function() {
      assert.throws(function() {
        call({one: "asdf"}, {count: 1});
      }, Errors.MissingPluralizationKey);
    });

    it("should reject invalid count defaults", function() {
      assert.throws(function() {
        call({one: "asdf", other: TranslateCall.prototype.UNSUPPORTED_EXPRESSION}, {count: 1});
      }, Errors.InvalidPluralizationDefault);
    });

    it("should complain if no :count is provided", function() {
      assert.throws(function() {
        call({one: "asdf", other: "qwerty"});
      }, Errors.MissingCountValue);
    });
  });

  describe("validation", function() {
    it("should require all interpolation values", function() {
      assert.throws(function() {
        call("asdf %{bob}");
      }, Errors.MissingInterpolationValue);
    });

    it("should require all interpolation values in count defaults", function() {
      assert.throws(function() {
        call({one: "asdf %{bob}", other: "querty"});
      }, Errors.MissingInterpolationValue);
    });
  });
});
