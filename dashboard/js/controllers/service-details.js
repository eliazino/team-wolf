angular
  .module('app')
  .controller('serviceDetailsCtrl', ['$scope', '$location', '$http', '$state', 'UserService', 'DTOptionsBuilder', '$rootScope', '$timeout',  serviceDetailsCtrl]);
	function serviceDetailsCtrl($scope, $location, $http, $state, UserService, DTOptionsBuilder, $rootScope, $timeout) {     
        if($rootScope.validate()){
            $('body').removeClass('modal-open');
            $('.modal-backdrop').remove();
            $scope.department = JSON.parse(sessionStorage.getItem('departmentID'));
            var custom = new $rootScope.customMessage();
            var  url= UserService.apiRoot+'admin/get/merchantstore/'+$scope.department.merchantID;
            var data= {};
            config = $rootScope.getHeader(1);
            $http.get(url, config).then(function(response){
                if(response.data.error.status == 0){
                    $scope.departments = response.data.content.data;
                }else{}
                }, function(response){
            });
            url= UserService.apiRoot+'admin/get/department';
            $http.get(url, config).then(function(response){
                if(response.data.error.status == 0){
                    $scope.biller = response.data.content.data;
                }else{

                }
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
            $scope.trashBill = function(code, obj){
                if(confirm("The Bill will be Removed! Confirm or cancel to continue")){
                    //obj = document.getElementById("delbtn");
                    obj.innerHTML = "<i class='fa fa-spinner fa-spin'></i> Please wait...";            
                    var  url= UserService.apiRoot+'admin/update/outlet/billers';
                    var data = {
                        "data": $rootScope.cred()
                    };
                    data.data.merchantID = $scope.department.merchantID;
                    data.data.reason = 0;
                    data.data.deptID = code;
                    var config = $rootScope.getHeader();
                    $http.post(url, data, config).then(function(response){
                        if(response.data.error.status == 0){
                            $state.reload();
                        }else{
                            $rootScope.mCra(custom.error(response.data.error.message));
                            obj.innerHTML = "<span class=\"fa fa-minus-circle\"></span> Remove Bill";
                        }
                    }, function(response){
                        $rootScope.mCra(custom.error("An Unknown error ocurred"));
                        obj.innerHTML = "<span class=\"fa fa-minus-circle\"></span> Remove Bill";
                    });
                };
            };
            $scope.addBill = function(obj){
                obj = document.getElementById("Savebtn");
                obj.innerHTML = document.getElementById("workr").innerHTML;
                var  url= UserService.apiRoot+'admin/update/outlet/billers';
                var data = {
                    "data": $rootScope.cred()
                };
                data.data.deptID = document.getElementById("cat").options[document.getElementById("cat").selectedIndex].value;
                data.data.reason = 1;
                data.data.merchantID = $scope.department.merchantID;
                var config = $rootScope.getHeader(0);
                $http.post(url, data, config).then(function(response){
                    if(response.data.error.status == 0){
                        $state.reload();
                    }else{
                        $rootScope.mCra(custom.error(response.data.error.message));
                    }
                    obj.innerHTML = "<i class=\"fa fa-plus-square\"></i> Add Selected";
                }, function(response){
                    $rootScope.mCra(custom.error("An Unknown error ocurred"));
                    obj.innerHTML = "<i class=\"fa fa-plus-square\"></i> Add Selected";
                });
            }
        }else{
            //route to login
            $location.path("/login");
        }
    }