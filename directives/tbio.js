(function () {
    var tbioDirective = ['$log', function ($log) {
        //        $log.log('Loading Textbox.io Directive');
        var link = function (scope, element, attrs, controllers) {
            //var idOfElement = '[' + element.prop('id') + '] ';
            //$log.log('In TBIO directive for ID ' + idOfElement);
            var tbioCtrl = controllers[0];
            var ngModelCtrl = controllers[1];
            if (ngModelCtrl) {
                tbioCtrl.init(element, attrs, ngModelCtrl);
            }
        };

        return {
            restrict: 'A',
            priority: 100,
            require: ['tbio', 'ngModel'],
            controller: 'TextboxioController',
            scope: {
                configuration: '=' //tbioConfiguration JavaScript object
            },
            link: link
        };
    }];

    var tbioMinLengthDirective = ['$log', function ($log) {
        //$log.log('Loading Textbox.io Min Length Directive');
        var link = function (scope, element, attrs, ngModelCtrl) {
            if (!ngModelCtrl) return;
            var minlength = 0;
            attrs.$observe('tbioMinlength', function (value) {
                minlength = parseInt(value) || 0;
                ngModelCtrl.$validate();
            });
            ngModelCtrl.$validators.tbioMinlength = function (modelValue, viewValue) {
                var jStrippedString = jQuery(modelValue).text().trim();
                //$log.log('Stripped string: [' + jStrippedString + ']');
                //if (viewValue) {
                //    $log.log('MIN length check. Is ' + jStrippedString.length + '>=' + minlength);
                //}
                return ngModelCtrl.$isEmpty(jStrippedString) || jStrippedString.length >= minlength;
            };
        };

        return {
            restrict: 'A',
            require: 'ngModel',
            link: link
        };
    }];

    var tbioMaxLengthDirective = ['$log', function ($log) {
        //$log.log('Loading Textbox.io Max Length Directive');
        var link = function (scope, element, attrs, ngModelCtrl) {
            if (!ngModelCtrl) return;
            var maxlength = -1;
            attrs.$observe('tbioMaxlength', function (value) {
                maxlength = isNaN(parseInt(value)) ? -1 : parseInt(value);
                ngModelCtrl.$validate();
            });
            ngModelCtrl.$validators.tbioMaxlength = function (modelValue, viewValue) {
                var jStrippedString = jQuery(modelValue).text().trim();
                //if (viewValue) {
                //    $log.log('MAX length check. Is ' + jStrippedString.length + '<=' + maxlength);
                //}
                return (maxlength < 0) || ngModelCtrl.$isEmpty(jStrippedString) || (jStrippedString.length <= maxlength);
            };
        };

        return {
            restrict: 'A',
            require: 'ngModel',
            link: link
        };
    }];

    var tbioController = ['$scope', '$interval', '$log', 'tbioConfigFactory', 'tbioValidationsFactory',
                          function ($scope, $interval, $log, tbioConfigFactory, tbioValidationsFactory) {
            //$log.log('Loading Textbox.io Controller');
            this.init = function (element, attrs, ngModelController) {
                //var idOfElement = '[' + element.prop('id') + '] ';
                //$log.log('In this.init for ' + idOfElement);
                var theEditor;
                var config = attrs['configuration'];

                //Populate the editor once the modelValue exists
                //would reload the editor if the model is changed in the background.
                ngModelController.$render = function () {
                    if (!theEditor) { //only load the editor the first time
                        if (tbioConfigFactory.hasOwnProperty(config)) {
                            theEditor = textboxio.replace(element[0], tbioConfigFactory[config]);
                        } else {
                            theEditor = textboxio.replace(element[0]);
                        }
                    }
                    if (ngModelController.$modelValue) {
                        theEditor.content.set(ngModelController.$modelValue);
                    }
                }; //$render end

                // In lieu of events I just update the model every X seconds.
                // Once the editor has event(s) this gets replaced by event code.
                var interval = $interval(function () {
                    ngModelController.$setViewValue(theEditor.content.get());
                }, 500); // interval end

                // When the DOM element is removed from the page AngularJS will trigger the $destroy event on
                // the scope. This gives us a chance to cancel the $interval.
                $scope.$on("$destroy", function (event) {
                    $interval.cancel(interval);
                }); //$on end

                //Allow developer to inject custom validation functions via tbioValidationsFactory
                for (var validationFn in tbioValidationsFactory) {
                    $log.log('Adding custom validation!');
                    ngModelController.$validators[validationFn] = tbioValidationsFactory[validationFn];
                };
            }; //init end
    }];

    //Create the actual Controller and Directive
    angular.module('ephox.textboxio', [])
        .controller('TextboxioController', tbioController)
        .directive('tbio', tbioDirective)
        .directive('tbioMinlength', tbioMinLengthDirective)
        .directive('tbioMaxlength', tbioMaxLengthDirective);
}());
