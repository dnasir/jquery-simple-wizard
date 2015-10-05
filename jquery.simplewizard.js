/*global jQuery:false */

(function ($) {
    "use strict";

    var pluginName = "simpleWizard";

    function Plugin(el, options) {
        this.$el = $(el);
        this.$steps = this.$el.find(".wizard-step");
        this.$indicators = this.$el.find(".wizard-step-indicator");
        this.opts = $.extend({
            cssClassStepDone: "wizard-done",
            cssClassStepActive: "wizard-current",
            onInit: function () {},
            onChange: function () {},
            onFinish: function () {}
        }, options);
        this.onChangeTimeout = null;
        this.init();
    }

    Plugin.prototype = {
        init: function () {
            var self = this;

            self.$el.on("click", ".wizard-next", function (e) {
                e.preventDefault();
                self.nextStep();
            });

            self.$el.on("click", ".wizard-prev", function (e) {
                e.preventDefault();
                self.prevStep();
            });

            self.$el.on("click", ".wizard-goto", function (e) {
                e.preventDefault();
                var targetIndex = $(this).val();
                self.gotoStep(targetIndex);
            });

            self.$el.on("click", ".wizard-finish", function (e) {
                e.preventDefault();
                self.finish();
            });

            self.$el.on("wizard_onChange", function (e) {
                clearTimeout(self.onChangeTimeout);
                self.onChangeTimeout = setTimeout(function () {
                    if (typeof (self.opts.onChange) === "function") {
                        self.opts.onChange(e);
                    }

                    if (self.$indicators.length) {
                        self.updateIndicators();
                    }
                }, 100);
            });

            self.$el.on("wizard_onFinish", function (e) {
                if (typeof (self.opts.onFinish) === "function") {
                    self.opts.onFinish(e);
                }
            });

            this.$steps.first().addClass(this.opts.cssClassStepActive);
            this.$indicators.first().addClass(this.opts.cssClassStepActive);

            this.$el.triggerHandler("wizard_onInit");
        },

        getCurrentStep: function () {
            return this.$steps.filter("." + this.opts.cssClassStepActive).index();
        },

        nextStep: function () {
            if (this.getCurrentStep() >= this.$steps.length) {
                return;
            }

            this.$steps.filter("." + this.opts.cssClassStepActive)
                .addClass(this.opts.cssClassStepDone).removeClass(this.opts.cssClassStepActive)
                .next().addClass(this.opts.cssClassStepActive);
            this.$el.triggerHandler("wizard_onChange");
        },

        prevStep: function () {
            if (this.getCurrentStep() <= 0) {
                return;
            }

            this.$steps.filter("." + this.opts.cssClassStepActive)
                .removeClass(this.opts.cssClassStepActive)
                .prev().addClass(this.opts.cssClassStepActive);
            this.$el.triggerHandler("wizard_onChange");
        },

        gotoStep: function (index) {
            if (index < 0 || index > this.$steps.length) {
                return;
            }

            var current = this.getCurrentStep();
            if (index > current) {
                while (current < this.$steps.length - 1) {
                    this.nextStep();
                    current = this.getCurrentStep();
                }
            } else if (index < current) {
                while (current > 0) {
                    this.prevStep();
                    current = this.getCurrentStep();
                }
            }
        },

        finish: function () {
            this.$el.triggerHandler("wizard_onFinish");
        },

        updateIndicators: function () {
            var current = this.getCurrentStep();
            this.$indicators.filter(function(index) { return index < current; })
                .addClass(this.opts.cssClassStepDone);
            this.$indicators.removeClass(this.opts.cssClassStepActive)
                .eq(current).addClass(this.opts.cssClassStepActive);
        }
    };

    $.fn[pluginName] = function (options) {
        var args = Array.prototype.slice.call(arguments, 1);

        return this.each(function () {
            if (!$.data(this, "plugin_" + pluginName)) {
                $.data(this, "plugin_" + pluginName, new Plugin(this, options));
            } else if (typeof options === "string" && Plugin.prototype.hasOwnProperty(options)) {
                var instance = $.data(this, "plugin_" + pluginName);
                Plugin.prototype[options].apply(instance, args);
            }
        });
    };
})(jQuery);
