#angular-textbox.io

##What does this do?

###tl;dr
`angular-textbox.io` provides an AngularJS Directive that allows the Textbox.io WYSIWYG Rich Text Editor to be part of your `<form>`.

##Requirements
* AngularJS **1.3** *
* Textbox.io **1.2+**

*In its current form it will not work with earlier releases of AngularJS as it uses the `$validators` pipeline.  If you need to use this with earlier releases of AngularJS please contact us at <mailto:support@ephox.com>.

##Usage
Implementing this custom directive is straightforward and simple.

####Add the Textbox.io files to your project
Textbox.io itself has a set of files that need to be available in your application in order for the directive to function properly.  When you download Textbox.io you need to place the `textboxio` folder somewhere that is accessible to the user's browser at runtime.  You need to make sure you have a `<script>` tag in your page that loads the `textboxio.js` JavaScript file.  The remainder of this document assumes the Textbox.io files are in a web-accessible location and you already have a `<script>` tag in place loading the `textboxio.js` JavaScript file

####Add the files from angular-textbox.io to your project
The 3 files provided need to be available to your application.  Where you place them is up to you and there seems to be a multitude of "best practices" for how to organize your files in an Angular project.  We will not attempt to tell you **where** to place the files but make sure you load the files in your main html page!

####Add a `ephox.textboxio` module dependency to your application's module
For example, if your main module was called `blogApp` you would define `blogApp` in this fashion:

`angular.module('blogApp', ['ngRoute', 'ephox.textboxio']);`

...where the array defines required modules.

####Add the `tbio` attribute to a `<textarea>` in your form.
To turn a regular `<textarea>` into a Textbox.io editor instance you must add the `tbio` attribute to the `<textarea>`.  The minimum required tag would then look like this:

`<textarea tbio ng-model=“your.model.reference” rows=“15” id=“tbioTextArea” name=“tbioTextArea” ></textarea>`

**Make sure you do not have any space or text between the opening and closing `<textarea>` tags** - doing so will cause issues with loading data into Textbox.io.  It will also trigger an automatic failure of the `tbio-required` validation.

*Note:  Each `<textarea>` must have a unique `id` attribute as that is how the directive locates the `<textarea>` in the DOM.*

####The **configuration** attribute *(optional - but not really optional)*
The Directive supports the use of a `configuration` attribute on the `<textarea>` tag.  This allows you to pass a String that the directive will use to find a valid configuration for the editor.  If you don’t use this attribute the editor will open with its default configuration (almost never what you really want).

`<textarea tbio ng-model=“your.model.reference” configuration=“simple” rows=“15” id=“tbioTextArea” name=“tbioTextArea” ></textarea>`

…where `simple` is a Sting that matches the name of one of the properties defined in the `tbioConfigFactory.js` file.  The sample `tbioConfigFactory.js` file includes two properties as examples of how this should work.  The `configuration` parameter's value must match the name of a propery created in the `tbioConfigFactory.js` file.

##Optional Features
####**Validation** attributes
The Directive supports the use of two attributes to handle validation of the “length” of the content in the editor instance.  As the “length” of HTML content can be difficult to calculate the directive simply takes the HTML content and…

* Removes all HTML tags
* Removes all HTML entities
* Counts the remaining characters

The three attributes you can add are:

* `tbio-required` (the editor must have some content)
* `tbio-minlength` (the editor must have some minimum number of text characters)
* `tbio-maxlength` (the editor cannot exceed some maximum number of text characters)

Using these would lead to the following `<textarea>` tag in your form:

`<textarea tbio tbio-minlength=“25” tbio-maxlength=“50000” ng-model=“your.model.reference” configuration=“simple” rows=“15” id=“tbioTextArea” name=“tbioTextArea”></textarea>`

*Note:  You can certainly use other standard AngularJS attributes on the `<textarea>`.  We don’t recommend using `required`, `ng-minlength` or `ng-maxlength` as they count HTML tags as characters of content.  We suggest you use `tbio-required`, `tbio-minlength` and/or `tbio-maxlength` instead.*

####**Custom Validation** Functions
AngularJS 1.3 added a new validation feature - the `$validators` pipeline.  This allows you to easily add custom validation to an ngModel object using a rather simple syntax:

```
ngModel.$validators.myValidation = function (modelValue, viewValue) {
	//Your code here that returns true (valid) or false (invalid)
}
```

You can add your own functions to the `tbioValidationsFactory.js` file and they will be added at runtime to the `$validators` pipeline.  The `tbioValidationsFactory.js` contains two sample functions so you can see how to setup these functions.

## Files Included
In order to implement this you need three custom files:

* tbio.js
* tbioConfigFactory.js
* tbioValidationsFactory.js

In total these files provide a module (`textboxio`) that contains 3 directives, 2 factories, and 1 controller to manage the implementation of Textbox.io  in an AngularJS form.


##The complete details on what this does
####(when tl;dr is not enough!)
AngularJS provides a built in two-way data binding between form (view) elements and the underlying (data) model.  While this works well for standard form elements, AngularJS does not know how to interact with Textbox.io.

This is primarily due to the fact that Textbox.io “hides” the form field (`<textarea>`) and superimposes an iFrame over the form field.  This means that when you are typing into Textbox.io you are not updating an AngularJS aware view so the underlying model is not updated.  When the form is submitted, the content of Textbox.io is not included.

This set of AngularJS Directives and Factories solves this issue by managing the process of...

* Deploying Textbox.io to the page
* Managing the sync of data between Textbox.io and the AngularJS view and model objects
* Allowing for validation of content in the editor
 * required (via `tbio-required` attribute)
 * minimum chars of text (via `tbio-minlength` attribute)
 * maximum chars of text (via `tbio-maxlength` attribute)
* Allowing for developer-defined custom validation functions to be added to the $validators pipeline for all Textbox.io instances
