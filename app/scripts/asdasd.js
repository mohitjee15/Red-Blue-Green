/**
 * Created by mohit on 4/29/2014.
 */
define(
    ['jQuery',
        'angular',
        'audio',
        'moment',
        'chosen_jquery_min',
        'jQuerySlimscroll'
    ], function(jquery,angular,audiojs,moment) {

        // console.log(angular);
        // console.log(jquery);

        angular.module('customerPortalApp.directives', ['ui.bootstrap'])
            .directive('accessLevel', ['Auth', function(Auth) {
                return {
                    restrict: 'A',
                    link: function($scope, element, attrs) {
                        var prevDisp = element.css('display')
                            , userRole
                            , accessLevel;

                        $scope.user = Auth.user;
                        $scope.$watch('user', function(user) {
                            if(user.role)
                                userRole = user.role;
                            updateCSS();
                        }, true);

                        attrs.$observe('accessLevel', function(al) {
                            if(al) accessLevel = $scope.$eval(al);
                            updateCSS();
                        });

                        function updateCSS() {
                            if(userRole && accessLevel) {
                                if(!Auth.authorize(accessLevel, userRole))
                                    element.css('display', 'none');
                                else
                                    element.css('display', prevDisp);
                            }
                        }
                    }
                };
            }])

            .directive('activeNav', ['$location', function($location) {
                return {
                    restrict: 'A',
                    link: function(scope, element, attrs) {
                        var nestedA = element.find('a')[0];
                        var path = nestedA.href;

                        scope.location = $location;
                        scope.$watch('location.absUrl()', function(newPath) {
                            if (path === newPath) {
                                element.addClass('active');
                            } else {
                                element.removeClass('active');
                            }
                        });
                    }

                };
            }])

            .directive('scroll', ['$window', function($window) {
                return function(scope, element, attrs) {
                    angular.element($window).bind("scroll", function() {
                        if (this.pageYOffset >= 100) {
                            scope.boolChangeClass = true;
                        } else {
                            scope.boolChangeClass = false;
                        }
                        scope.$apply();
                    });
                };
            }])
            .directive('zdTooltip', function(){
                return function(scope, element, attrs){
                    scope.$watch('campaignsList', function(){
                        element.tooltip();
                    });
                }
            })

            .directive('zdAudio', function(){
                return function(scope, element, attrs){
                    scope.$watch('contentsList', function(){
                        audiojs.events.ready(function() {
                            var as = audiojs.create(element);
                        });
                    });
                }
            })

            .directive('zdDaterange', function(){
                var today = new Date();
                var dd = today.getDate();
                var mm = today.getMonth()+1; //January is 0!

                var yyyy = today.getFullYear();
                if(dd<10){dd='0'+dd} if(mm<10){mm='0'+mm} today = dd+'/'+mm+'/'+yyyy;

                return function(scope, element, attrs){
                    element.daterangepicker({
                        format: 'DD/MM/YYYY', startDate:today}, function(start, end){
                    });
                }
            })

            .directive('zdDatepicker', function(){

                return {
                    restrict: 'A',
                    scope: false,
                    link: function(scope, element, attrs) {
                        element.datepicker();
                    }
                }
            })

            .directive('ngInitial', function() {
                return {
                    restrict: 'A',
                    controller: [
                        '$scope', '$element', '$attrs', '$parse', function($scope, $element, $attrs, $parse) {
                            var getter, setter, val;
                            val = $attrs.ngInitial || $attrs.value;
                            getter = $parse($attrs.ngModel);
                            setter = getter.assign;
                            setter($scope, val);
                        }
                    ]
                };
            })

            .directive('zdConfirmClick', [
                function(){
                    return {
                        priority: 1,
                        terminal: true,
                        link: function (scope, element, attr) {
                            var msg = attr.zdConfirmClick || "Are you sure?";
                            var clickAction = attr.ngClick;
                            element.bind('click',function (event) {
                                if ( window.confirm(msg) ) {
                                    scope.$apply(function() {
                                        scope.$eval(clickAction);
                                    });
                                    //scope.$eval(clickAction)
                                }
                            });
                        }
                    };
                }])

            .directive('chosen', function(){
                var linker = function(scope,element,attrs){

                    var watch_var = attrs.chosen;

                    scope.$watch(watch_var, function(){
                        $(element).trigger('chosen:updated');
                    });

                    /*  scope.$watch(attrs['ngModel'], function() {
                     console.log('hii');
                     $(element).trigger('chosen:updated');
                     });*/

                    $(element).chosen({ width: '260px', max_selected_options:1});
                };
                return{
                    terminal: 'A',
                    link: linker

                }
            })
            .directive("autofill", function () {  // directive to handle autofill values
                return {
                    require: "ngModel",
                    link: function (scope, element, attrs, ngModel) {
                        scope.$on("autofill:update", function() {
                            ngModel.$setViewValue(element.val());
                        });
                    }
                }
            })

            .directive('toggleRightOffScreen', [
                '$rootScope', function($rootScope) {
                    return {
                        restrict: 'A',
                        link: function(scope, ele, attrs) {
                            var $window, Timer, app, updateClass;
                            app = $('body');
                            $window = $(window);
                            ele.on('click', function(e) {
                                //Make the left menu smaller
                                if (!app.hasClass('nav-min')) {
                                    app.addClass('nav-min');
                                    $rootScope.$broadcast('minNav:enabled');
                                }

                                ele =   $(ele);
                                var onScreen    =   $('.on-screen-content');
                                var rightOffScreen =   $(".right-off-screen");
                                var rightOffScreenStatus    =   rightOffScreen.hasClass('expanded');
                                var sidebarContent  =   $('.off-screen-data');

                                //Display/hide off-screen
                                if(rightOffScreenStatus){//its expanded so now shrink eveything
                                    sidebarContent.css('display','none');
                                    onScreen.css('width','97.2%');
                                    rightOffScreen.css('width','1%');
                                    /*ele.removeClass('glyphicon-chevron-right');
                                     ele.addClass('glyphicon-chevron-left');*/
                                } else { //shrunk so now expand eveything
                                    sidebarContent.css('display','table-cell');
                                    onScreen.css('width','78%');
                                    rightOffScreen.css('width','22%');
                                    /*ele.removeClass('glyphicon-chevron-left');
                                     ele.addClass('glyphicon-chevron-right');*/

                                }

                                rightOffScreen.toggleClass('expanded');

                                return e.preventDefault();
                            });

                            //add a default width for this div plus main container div
                            var defaultScreenConfigure  =   function(){
                                "use strict";
                                var onScreen    =   $('.on-screen-content');
                                var rightOffScreen =   $(".right-off-screen");
                                var sidebarContent  =   $('.off-screen-data');
                                sidebarContent.css('display','none');
                                onScreen.css('width','97.2%');
                                rightOffScreen.css('width','1%');
                            };

                            return defaultScreenConfigure();
                        }
                    };
                }
            ])


            //template directives

            .directive('i18n', [
                'localize', function(localize) {
                    var i18nDirective;
                    i18nDirective = {
                        restrict: "EA",
                        updateText: function(ele, input, placeholder) {
                            var result;
                            result = void 0;
                            if (input === 'i18n-placeholder') {
                                result = localize.getLocalizedString(placeholder);
                                return ele.attr('placeholder', result);
                            } else if (input.length >= 1) {
                                result = localize.getLocalizedString(input);
                                return ele.text(result);
                            }
                        },
                        link: function(scope, ele, attrs) {
                            scope.$on('localizeResourcesUpdated', function() {
                                return i18nDirective.updateText(ele, attrs.i18n, attrs.placeholder);
                            });
                            return attrs.$observe('i18n', function(value) {
                                return i18nDirective.updateText(ele, value, attrs.placeholder);
                            });
                        }
                    };
                    return i18nDirective;
                }
            ])

            .directive('imgHolder', [
                function() {
                    return {
                        restrict: 'A',
                        link: function(scope, ele, attrs) {
                            return Holder.run({
                                images: ele[0]
                            });
                        }
                    };
                }
            ]).directive('customBackground', function() {
                return {
                    restrict: "A",
                    controller: [
                        '$scope', '$element', '$location', function($scope, $element, $location) {
                            var addBg, path;
                            path = function() {
                                return $location.path();
                            };
                            addBg = function(path) {
                                $element.removeClass('body-home body-special body-tasks body-lock');
                                switch (path) {
                                    case '/':
                                        return $element.addClass('body-home');
                                    case '/404':
                                    case '/pages/500':
                                    case '/pages/signin':
                                    case '/pages/signup':
                                        return $element.addClass('body-special');
                                    case '/pages/lock-screen':
                                        return $element.addClass('body-special body-lock');
                                    case '/tasks':
                                        return $element.addClass('body-tasks');
                                }
                            };
                            addBg($location.path());
                            return $scope.$watch(path, function(newVal, oldVal) {
                                if (newVal === oldVal) {
                                    return;
                                }
                                return addBg($location.path());
                            });
                        }
                    ]
                };
            }).directive('uiColorSwitch', [
                function() {
                    return {
                        restrict: 'A',
                        link: function(scope, ele, attrs) {
                            return ele.find('.color-option').on('click', function(event) {
                                var $this, hrefUrl, style;
                                $this = $(this);
                                hrefUrl = void 0;
                                style = $this.data('style');
                                if (style === 'loulou') {
                                    hrefUrl = 'styles/main.css';
                                    $('link[href^="styles/main"]').attr('href', hrefUrl);
                                } else if (style) {
                                    style = '-' + style;
                                    hrefUrl = 'styles/main' + style + '.css';
                                    $('link[href^="styles/main"]').attr('href', hrefUrl);
                                } else {
                                    return false;
                                }
                                return event.preventDefault();
                            });
                        }
                    };
                }
            ]).directive('toggleMinNav', [
                '$rootScope', function($rootScope) {
                    return {
                        restrict: 'A',
                        link: function(scope, ele, attrs) {
                            var $window, Timer, app, updateClass;
                            app = $('body');
                            $window = $(window);
                            ele.on('click', function(e) {
                                if (app.hasClass('nav-min')) {
                                    app.removeClass('nav-min');

                                    var offScreen =   $("#off-screen-toggle");

                                    if(offScreen){
                                        var onScreen    =   $('.on-screen-content');
                                        var rightOffScreen =   $(".right-off-screen");
                                        var sidebarContent  =   $('.off-screen-data');

                                        sidebarContent.css('display','none');
                                        onScreen.css('width','97.2%');
                                        rightOffScreen.css('width','1%');
                                        rightOffScreen.removeClass('expanded');
                                        /* offScreen.removeClass('glyphicon-chevron-right');
                                         offScreen.addClass('glyphicon-chevron-left');*/
                                    }


                                } else {
                                    app.addClass('nav-min');
                                    $rootScope.$broadcast('minNav:enabled');
                                }
                                return e.preventDefault();
                            });
                            Timer = void 0;
                            updateClass = function() {
                                var width;
                                width = $window.width();
                                if (width < 768) {
                                    return app.removeClass('nav-min');
                                }
                            };
                            return $window.resize(function() {
                                var t;
                                clearTimeout(t);
                                return t = setTimeout(updateClass, 300);
                            });
                        }
                    };
                }
            ])
            .directive('slimScroll', [
                function() {
                    return {
                        restrict: 'A',
                        link: function(scope, ele, attrs) {
                            return $(ele).slimScroll({
                                height: '100%'
                            });
                        }
                    };
                }
            ])
            .directive('collapseNav', [
                function() {
                    return {
                        restrict: 'A',
                        link: function(scope, ele, attrs) {
                            var $a, $aRest, $lists, $listsRest, app;
                            $lists = $(ele).find('ul').parent('li');
                            $lists.append('');
                            $a = $lists.children('a');
                            $listsRest = $(ele).children('li').not($lists);
                            $aRest = $listsRest.children('a');
                            app = $('body');
                            $a.on('click', function(event) {
                                var $parent, $this;
                                if (app.hasClass('nav-min')) {
                                    return false;
                                }
                                $this = $(this);
                                $parent = $this.parent('li');
                                $lists.not($parent).removeClass('open').find('ul').slideUp();
                                $parent.toggleClass('open').find('ul').slideToggle();
                                return event.preventDefault();
                            });
                            $aRest.on('click', function(event) {
                                return $lists.removeClass('open').find('ul').slideUp();
                            });
                            return scope.$on('minNav:enabled', function(event) {
                                return $lists.removeClass('open').find('ul').slideUp();
                            });
                        }
                    };
                }
            ]).directive('highlightActive', [
                function() {
                    return {
                        restrict: "A",
                        controller: [
                            '$scope', '$element', '$attrs', '$location', function($scope, $element, $attrs, $location) {
                                var highlightActive, links, path;
                                links = $element.find('a');
                                path = function() {
                                    return $location.path();
                                };
                                highlightActive = function(links, path) {
                                    path = '#' + path;
                                    return angular.forEach(links, function(link) {
                                        var $li, $link, href;
                                        $link = angular.element(link);
                                        $li = $link.parent('li');
                                        href = $link.attr('href');

                                        console.log(link);
                                        if ($li.hasClass('active')) {
                                            $li.removeClass('active');
                                        }

                                        if (path.indexOf(href) === 0) {
                                            console.log($li);
                                            console.log(indexOf);
                                            return $li.addClass('active');
                                        }
                                    });
                                };
                                highlightActive(links, $location.path());
                                return $scope.$watch(path, function(newVal, oldVal) {
                                    if (newVal === oldVal) {
                                        return;
                                    }
                                    return highlightActive(links, $location.path());
                                });
                            }
                        ]
                    };
                }
            ]).directive('toggleOffCanvas', [
                function() {
                    return {
                        restrict: 'A',
                        link: function(scope, ele, attrs) {
                            return ele.on('click', function() {
                                return $('body').toggleClass('on-canvas');
                            });
                        }
                    };
                }
            ]).directive('goBack', [
                function() {
                    return {
                        restrict: "A",
                        controller: [
                            '$scope', '$element', '$window', function($scope, $element, $window) {
                                return $element.on('click', function() {
                                    return $window.history.back();
                                });
                            }
                        ]
                    };
                }
            ]);



    });