'use strict';

angular.module('boxColorChangerApp')
  .controller('MainCtrl', function ($scope){
    var totalNumbers    =   9;

    $scope.numbersArray =   [];

    for(var i=1; i <= totalNumbers; i++){
        $scope.numbersArray.push(i);
    }
  });
