'use strict';

angular.module('boxColorChangerApp', [])

    .directive('matrixCell', function($rootScope) {
        return {
            restrict: 'A',
            link: function(scope, ele, attrs) {
                ele.on('click', function(e) {

                    var selectedColor   =   scope.colorSelector;
                    if(typeof selectedColor  == 'undefined'){
                        alert("Please select a color before clicking on boxes");
                        return;
                    }

                    var isColored   =   ele.hasClass('colored');

                    if(isColored){
                        alert("Already applied "+attrs.matrixCell+" color");
                    } else {
                        ele.addClass(selectedColor);
                        ele.addClass('colored');
                        attrs.matrixCell    =   selectedColor;
                    }

                    var element =   ele;

                });

                return $rootScope.$on('reset', function(event) {
                    var colors  =   ['red','blue','green'];

                    ele.removeClass('colored');

                    $.each(colors, function(index,value){
                        ele.removeClass(value);
                    });
                });
            }
        };
    })

    .directive('resetMatrix',function($rootScope){
        return {
            restrict:   'E',
            replace:    true,
            template:   '<button class="btn btn-primary">Reset</button>',
            link:   function(scope, ele, attrs) {
                ele.on('click',function(){
                    $rootScope.$broadcast('reset');
                });


            }
        }
    });



