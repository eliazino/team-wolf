angular
  .module('app')
  .controller('logCtrl', ['$scope', '$location', '$http', '$state', 'UserService', 'DTOptionsBuilder', '$rootScope', '$timeout',  logCtrl]);
	function logCtrl($scope, $location, $http, $state, UserService, DTOptionsBuilder, $rootScope, $timeout) {
        if($rootScope.validate()){
            $('body').removeClass('modal-open');
            $('.modal-backdrop').remove();
            $scope.user = JSON.parse(localStorage.getItem('pd'));
            var custom = new $rootScope.customMessage();
            var data= {};
            config = $rootScope.getHeader(1);
            var url= UserService.apiRoot+'admin/get/logcategory';
            $http.get(url, config).then(function(response){
                if(response.data.error.status == 0){
                    $scope.logCat = response.data.content.data;
                }else{		         	}
                }, function(response){
            });
            url= UserService.apiRoot+'admin/get/logs/-/0/7000000';
            $http.get(url, config).then(function(response){
                if(response.data.error.status == 0){
                    $scope.logs = response.data.content.data;
                }else{		         	}
                }, function(response){
            });
            $scope.dtOptions = DTOptionsBuilder.newOptions()
                .withOption('lengthMenu', [[10, 25, 50, 100, 150, -1], [10, 25, 50, 100, 150, 'All']])
                .withOption('drawCallback', function(){
                    $timeout(function(){
                        compute();
                    });
                });
            $scope.listenForEvoke = function(ev){
                $( ".elsKey" ).keyup(function(){
                    var index = this.id.replace('extended','');
                    $scope.dtInstance.DataTable.column(index).search(this.value).draw();
                });
            };
            $scope.dtInstance = {};
            function compute(){
                var displayedRows = $scope.dtInstance.dataTable._('tr', {filter: 'applied', page: 'current'});
                $scope.tcSum = 0;
                $scope.pSum = 0;
                angular.forEach(displayedRows, function(row) {
                // Careful on the content of `row`
                //$scope.sum += parseFloat(row[6]);
                /*try{
                    var t2 = row[2].replace(",","").replace("₦","");
                    var t = row[3].replace(",","").replace("₦","");
                    $scope.tcSum += parseFloat(t2);
                    $scope.pSum += parseFloat(t);
                    }catch(e){

                    }*/
                });
            }
            $scope.filter = function(obj){
                var obj = obj.currentTarget;
                obj.innerHTML = "<i class='fa fa-spinner fa-spin'></i> Fetching";
                var logC = document.getElementById("logCat").options[document.getElementById("logCat").selectedIndex].value;
                var fromDate = document.getElementById("fromDate").value == ""? "0" : new Date(document.getElementById("fromDate").value).valueOf()/1000;
                var toDate = document.getElementById("toDate").value == ""? "9999999999999999999" : new Date(document.getElementById("toDate").value).valueOf()/1000;
                url= UserService.apiRoot+'admin/get/logs/'+logC+'/'+fromDate+'/'+toDate;
                $http.get(url, config).then(function(response){
                    if(response.data.error.status == 0){
                        $scope.logs = response.data.content.data;
                        /*var processedResponses = $rootScope.fetchDistinct(response.data.content.data);
                        $scope.canteenOpp = processedResponses[0];
                        $scope.canteenDetails = processedResponses[1];
                        dataService.set(processedResponses);*/
                    }else{ }
                    }, function(response){
                });
                 obj.innerHTML = "<i class='fa fa-filter'></i> Filter";
            }
        }else{
            //route to login
            $location.path("/login");
        }
    }