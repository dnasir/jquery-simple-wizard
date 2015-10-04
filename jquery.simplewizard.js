/*global jQuery:false */

(function ($) {
    "use strict";

    var pluginName = "simpleWizard";

    function Plugin(el, options) {
        this.$el = $(el);
        this.$steps = this.$el.find(".wizard-step");
        this.opts = $.extend({
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
                }, 100);
            });

            self.$el.on("wizard_onFinish", function (e) {
                if (typeof (self.opts.onFinish) === "function") {
                    self.opts.onFinish(e);
                }
            });

            this.$steps.first().addClass("wizard-current");

            this.$el.triggerHandler("wizard_onInit");
        },

        getCurrentStep: function () {
            return this.$steps.filter(".wizard-current").index();
        },

        nextStep: function () {
            if (this.getCurrentStep() >= this.$steps.length) {
                return;
            }

            this.$steps.filter(".wizard-current").addClass("wizard-done").removeClass("wizard-current").next().addClass("wizard-current");
            this.$el.triggerHandler("wizard_onChanged");
        },

        prevStep: function () {
            if (this.getCurrentStep() <= 0) {
                return;
            }

            this.$steps.filter(".wizard-current").removeClass("wizard-current").prev().addClass("wizard-current");
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
        }
    };

    $.fn[pluginName] = function (options) {
        return this.each(function () {
            if (!$.data(this, "plugin_" + pluginName)) {
                $.data(this, "plugin_" + pluginName, new Plugin(this, options));
            }
        });
    };
})(jQuery);
