# jQuery Simple Wizard
A jQuery plugin for creating a simple wizard.

## Why was this created?
I needed a simple jQuery wizard that simply navigates from one step to another, and the ones I've found were too complex. I didn't need the plugin to generate stuff like headings, previous and next buttons, etc. I wanted to have control over what goes on. So I created my own.

## How do I use it?
Firstly, build your wizard markup using the following convention:
```html
<form id="wizard1">
    <div class="wizard-header">
        <ul>
            <li role="presentation" class="wizard-step-indicator">Start</li>
            <li role="presentation" class="wizard-step-indicator">Profile</li>
            <li role="presentation" class="wizard-step-indicator">Message</li>
            <li role="presentation" class="wizard-step-indicator">Finish</li>
        </ul>
    </div>
    <div class="wizard-content">
        <div class="wizard-step">
          <h2>Welcome to my wizard</h2>
          <p>Let's begin</p>
          <button type="button" class="wizard-next">Start</button>
        </div>
        <div class="wizard-step">
            <div>
                <label for="name">Name</label>
                <input type="text" id="name" class="required" />
            </div>
            <button type="button" class="wizard-prev">Previous</button>
            <button type="button" class="wizard-next">Next</button>
        </div>
        <div class="wizard-step">
            <div>
                <label for="message">Message</label>
                <textarea id="message"></textarea>
            </div>
            <button type="button" class="wizard-prev">Previous</button>
            <button type="button" class="wizard-next">Next</button>
        </div>
        <div class="wizard-step">
            <button type="button" class="wizard-prev">Previous</button>
            <button type="button" class="wizard-finish">Finish</button>
            <button type="button" class="wizard-goto" value="0">Go back to start</button>
        </div>
    </div>
</form>
```
Include the plugin files after your jQuery reference, and run the following code:
```javascript
$("#wizard1").simpleWizard();
```
where ``#wizard1`` is a reference to the wizard container.

**Note**

As far as the HTML markup is concerned, as long as you use the ``wizard-step`` class to mark the steps and ``wizard-step-indicator`` to mark the step indicators, as well as the ``wizard-next``,``wizard-prev`` and ``wizard-finish`` buttons, everything else is up to you.

## What can I change?
Currently, there are only two items that you can control - the active state CSS class, and the done state CSS class. I'll update this as I make them available. Include them in the plugin initialisation code.

```javascript
$("#wizard1").simpleWizard({
    cssClassStepDone: "wizard-done", // default value
    cssClassStepActive: "wizard-current", // default value
});
```

## What about events?
You can add event handlers to the plugin initialisation code.

``` javascript
$("#wizard1").simpleWizard({
    onInit: function() {
        alert("Let's get started!")
    },
    onChange: function() {
        alert("More to come..");
    }
    onFinish: function() {
        alert("End of the line, pal.");
    }
});
```

#### onInit
Called when the plugin is done initialising.

#### onChange
Called on every step change.

#### onFinish
Called when the wizard reaches the end.

## What about transition animations?
The plugin will update the CSS class for the step element based on its state, and you can use CSS3 transition for animations. I don't see why we need to use JavaScript animations because I think we should all be using CSS3-capable browsers now.

## What about validation?
This plugin supports jQuery Validation as well as jQuery Unobtrusive Validation. Simply include the libraries in your code prior to the plugin initialisation code for this to apply. Validation will be executed on every step change, and the plugin will prevent the user from moving forward when there's a validation error.
