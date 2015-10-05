/**
 * jquery-simple-wizard - A jQuery plugin for creating a simple wizard.
 * @version v0.1.0
 * @link https://github.com/dnasir/jquery-simple-wizard
 * @license MIT
 */
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
        this.validation = {
            formToValidate: ($.validator !== undefined ? this.$el.closest("form") : undefined),
            isUnobtrusive: $.validator.unobtrusive !== undefined
        };
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

            self.$el.on("wizard_onInit", function (e) {
                if (typeof (self.opts.onInit) === "function") {
                    self.opts.onInit(e);
                }
            });

            self.$el.on("wizard_onChange", function (e) {
                if (typeof (self.opts.onChange) === "function") {
                    var current = self.getCurrentStep();
                    self.opts.onChange(e, self.$steps.eq(current));
                }
            });

            self.$el.on("wizard_onFinish", function (e) {
                if (typeof (self.opts.onFinish) === "function") {
                    self.opts.onFinish(e);
                }
            });

            self.$el.on("click", "a", function (e) {
                var $target = $(e.target.hash),
                    $targetStep = self.$steps.filter($target);

                if ($targetStep.length) {
                    e.preventDefault();
                    self.gotoStep($targetStep.index());
                }
            });

            this.$steps.first().addClass(this.opts.cssClassStepActive);
            this.$indicators.first().addClass(this.opts.cssClassStepActive);

            if (this.validation.formToValidate) {
                this.validation.formToValidate.validate({
                    ignore: ".wizard-ignore"
                });
            }

            if (this.validation.formToValidate && this.validation.isUnobtrusive) {
                $.data(this.validation.formToValidate[0], "validator").settings.ignore += ",.wizard-ignore";
            }

            this.$el.triggerHandler("wizard_onInit");
        },

        // onChange event handler buffer - this will prevent multiple event raise
        onChangeEventHandler: function () {
            var self = this;

            clearTimeout(self.onChangeTimeout);
            self.onChangeTimeout = setTimeout(function () {
                if (self.$indicators.length) {
                    self.updateIndicators();
                }

                self.$el.triggerHandler("wizard_onChange");
            }, 100);
        },

        // methods

        getCurrentStep: function () {
            return this.$steps.filter("." + this.opts.cssClassStepActive).index();
        },

        nextStep: function () {
            var current = this.getCurrentStep();
            if (!this.isValid(current)) {
                return;
            }

            if (current >= this.$steps.length) {
                return;
            }

            this.$steps.filter("." + this.opts.cssClassStepActive)
                .addClass(this.opts.cssClassStepDone).removeClass(this.opts.cssClassStepActive)
                .next().addClass(this.opts.cssClassStepActive);

            this.onChangeEventHandler();
        },

        prevStep: function () {
            var current = this.getCurrentStep();

            if (current <= 0) {
                return;
            }

            this.$steps.filter("." + this.opts.cssClassStepActive)
                .removeClass(this.opts.cssClassStepActive)
                .prev().addClass(this.opts.cssClassStepActive);

            this.onChangeEventHandler();
        },

        gotoStep: function (index) {
            if (index < 0 || index > this.$steps.length) {
                return;
            }

            var current = this.getCurrentStep();
            if (index > current) {
                while (current < index) {
                    this.nextStep();
                    if (!this.isValid(current)) {
                        break;
                    }
                    current = this.getCurrentStep();
                }
            } else if (index < current) {
                while (current > index) {
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
            this.$indicators
                .filter(function (index) {
                    return index < current;
                })
                .addClass(this.opts.cssClassStepDone);
            this.$indicators.removeClass(this.opts.cssClassStepActive)
                .eq(current).addClass(this.opts.cssClassStepActive);
        },

        isValid: function (current) {
            if (this.validation.formToValidate === undefined) {
                return true;
            }

            this.$steps.not(":eq(" + current + ")").find("input, textarea").addClass("wizard-ignore");

            var result = this.validation.formToValidate.valid();

            this.$steps.find("input, textarea").removeClass("wizard-ignore");

            return result;
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
