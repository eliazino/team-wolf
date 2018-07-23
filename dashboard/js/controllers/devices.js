angular
  .module('app')
  .controller('devicesCtrl', ['$scope', '$location', '$http', '$state', 'UserService', 'DTOptionsBuilder', '$rootScope', '$timeout',  devicesCtrl]);
	function devicesCtrl($scope, $location, $http, $state, UserService, DTOptionsBuilder, $rootScope, $timeout) {     
        if($rootScope.validate()){
            $('body').removeClass('modal-open');
            $('.modal-backdrop').remove();
            $scope.user = JSON.parse(localStorage.getItem('pd'));
            var custom = new $rootScope.customMessage();
            var  url= UserService.apiRoot+'admin/get/devices/-';
            var data= {};
            config = $rootScope.getHeader(1);
            $http.get(url, config).then(function(response){
                if(response.data.error.status == 0){
                    $scope.devices = response.data.content.data;
                }else{}
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
            $scope.saveDevice = function(obj){
                var obj = obj.currentTarget;
                var deviceName = $("#dname").val();
                var deviceCode = $("#dcode").val();
                if(deviceName.length < 4){ $rootScope.mCra(custom.error("The Device name cannot be less than 5 characters")); return; }
                if(deviceCode.length < 5){ $rootScope.mCra(custom.error("The Category is invalid")); return; }
                //if(descr.length < 4){ $rootScope.mCra(custom.error("The description cannot be less than 5 characters")); return; }
                obj.innerHTML = "<i class='fa fa-spinner fa-spin'></i> Please wait";
                var url = UserService.apiRoot+"admin/create/device"
                var config = $rootScope.getHeader(0);
                var data = {data:$rootScope.cred()};
                data.data.deviceCode = deviceCode;
                data.data.deviceName = deviceName;
                $http.post(url, data, config).then(function(response){
                    if(response.data.error.status == 0){
                      $rootScope.mCra(custom.success("Device has been added"));
                      $state.reload();
                    }else{
                        obj.innerHTML = '<i class="fa fa-save"></i> Save';
                        $rootScope.mCra(custom.error(response.data.error.message));
                    }
                }, function(response){
                  obj.innerHTML = '<i class="fa fa-save"></i> Save';
                });
            }
            $scope.delete = function(x, obj){
                if(confirm("Are you sure? Deleting Device, confirm or cancel to continue")){
                    obj = obj.currentTarget;
                    obj.innerHTML = "<i class='fa fa-spinner fa-spin'></i> Please wait";
                    var  url= UserService.apiRoot+'admin/delete/device';
                    var config = $rootScope.getHeader(0);
                    var data = $rootScope.cred();
                    data.id = x.id;
                    data = {
                        "data":data
                    };
                    $http.post(url, data, config).then(function(response){
                        if(response.data.error.status == 0){
                          $rootScope.mCra(custom.success("Device has been removed"));
                          $state.reload();
                        }else{
                            obj.innerHTML = '<i class="fa fa-trash"></i> Delete';
                            $rootScope.mCra(custom.error(response.data.error.message));
                        }
                    }, function(response){
                      obj.innerHTML = '<i class="fa fa-trash"></i> Delete';
                    });
                }
            }
            $scope.filter = function($obj){
                var cats = $('#cats').find(":selected").val();
                var  url= UserService.apiRoot+'admin/get/services/'+cats;
                config = $rootScope.getHeader(1);
                $http.get(url, config).then(function(response){
                    if(response.data.error.status == 0){
                        $scope.services = response.data.content.data;
                    }else{}
                    }, function(response){
                });
            }
        }else{
            //route to login
            $location.path("/login");
        }
    }