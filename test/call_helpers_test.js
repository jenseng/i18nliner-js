/* global describe, it */
import {assert} from "chai";
import CallHelpers from "../lib/call_helpers";

describe("CallHelpers", function() {
  describe("applyWrappers", function() {
    it("should apply array wrappers", function() {
      assert.equal(
        CallHelpers.applyWrappers(
          "*hello* ***bob*** **lol**",
          ["<b>$1</b>", "<em>$1</em>", "<i>$1</i>"]
        ),
        "<b>hello</b> <i>bob</i> <em>lol</em>"
      );
    });

    it("should apply object wrappers", function() {
      assert.equal(
        CallHelpers.applyWrappers(
          "*hello* ***bob*** **lol**",
          {"*": "<b>$1</b>", "**": "<em>$1</em>", "***": "<i>$1</i>"}
        ),
        "<b>hello</b> <i>bob</i> <em>lol</em>"
      );
    });
  });
});


