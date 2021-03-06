var Reaction = require("../reaction"),
    path = require("path"),
    _ = require("underscore");

var PartialReaction = Reaction.extend();

PartialReaction.selector = "div[src], li[src], span[src]";

PartialReaction.preparse = function(el, state) {
  var src = el.attr("src"),
      file = path.resolve(state.currentDir(), src),
      template = $(state.templates[file]);

  if(!template.length) {
    file = src = path.normalize(src);
    // EndDash works with requirejs or <script type="text/enddash"> on a page.
    template = $(state.templates[src]);
  }

  if (!template.length) {
    throw new Error("could not find partial " + file + " in " +  _.last(state.pathStack));
  }
  state.pathStack.push(file);
  el.html(template);
};

PartialReaction.afterPreparse = function(el, state) {
  state.pathStack.pop();
  if(typeof el.attr("data-replace") !== "undefined") {
    var contents = el.contents().remove();
    el.replaceWith(contents);
  }
};

module.exports = PartialReaction;
