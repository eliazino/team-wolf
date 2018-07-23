angular
  .module('app')
  .controller('serviceCtrl', ['$scope', '$location', '$http', '$state', 'UserService', 'DTOptionsBuilder', '$rootScope', '$timeout',  serviceCtrl]);
	function serviceCtrl($scope, $location, $http, $state, UserService, DTOptionsBuilder, $rootScope, $timeout) {     
        if($rootScope.validate()){
            $('body').removeClass('modal-open');
            $('.modal-backdrop').remove();
            $scope.user = JSON.parse(localStorage.getItem('pd'));
            var custom = new $rootScope.customMessage();
            var  url= UserService.apiRoot+'get/states';
            var data= {};
            config = $rootScope.getHeader(1);
            $http.get(url, config).then(function(response){
                if(response.data.error.status == 0){
                    $scope.states = response.data.content.data;
                }else{}
                }, function(response){
            });
            var  url= UserService.apiRoot+'any/get/products';
            var data= {};
            config = $rootScope.getHeader(1);
            $http.get(url, config).then(function(response){
                if(response.data.error.status == 0){
                    $scope.products = response.data.content.data;
                }else{}
                }, function(response){
            });
            $("#state").change(function(){
                $("#fetcher").html("<i class='fa fa-spinner fa-spin'></i> Fetching matched LG");
                var id = $('#state').find(":selected").val();
                var  url= UserService.apiRoot+'get/lgs/'+id;
                $http.get(url, config).then(function(response){
                    if(response.data.error.status == 0){
                        $scope.lgs = response.data.content.data;
                        $("#fetcher").html(""); 
                    }else{
                        $("#fetcher").html("<i class='fa fa-exclamation-circle'></i> Fetch Failed");              
                    }
                    }, function(response){
                        $("#fetcher").html("<i class='fa fa-exclamation-circle'></i> Fetch Failed");
                });
            });
            var  url= UserService.apiRoot+'fmcg/get/dist/-/-';
            $http.get(url, config).then(function(response){
                if(response.data.error.status == 0){
                    $scope.services = response.data.content.data;
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
            $scope.saveDept = function(obj){
                var obj = obj.currentTarget;
                var department = $("#name").val();
                var descr = $("#descr").val();
                if(department.length < 4){ $rootScope.mCra(custom.error("The department name cannot be less than 5 characters")); return; }
                //if(descr.length < 4){ $rootScope.mCra(custom.error("The description cannot be less than 5 characters")); return; }
                obj.innerHTML = "<i class='fa fa-spinner fa-spin'></i> Please wait";
                var url = UserService.apiRoot+"admin/create/department"
                var config = $rootScope.getHeader(0);
                var data = $rootScope.cred();
                data.departmentName = department;
                data.description = descr;
                data = {
                    "data":data
                }
                $http.post(url, data, config).then(function(response){
                    if(response.data.error.status == 0){
                      $rootScope.mCra(custom.success(response.data.success.message));
                      $state.reload();
                    }else{
                        obj.innerHTML = '<i class="fa fa-save"></i> Save';
                        $rootScope.mCra(custom.error(response.data.error.message));
                    }
                }, function(response){
                  obj.innerHTML = '<i class="fa fa-save"></i> Save';
                });
            }
            $scope.saveService = function(obj){
                var obj = obj.currentTarget;
                var service = $("#sname").val();
                var category = $('#categ').find(":selected").val();
                var price = $("#price").val();
                var quantity = $("#quantity").val();
                var serviceType = $('#stype').find(":selected").val();
                if(service.length < 4){ $rootScope.mCra(custom.error("The service name cannot be less than 5 characters")); return; }
                if(!parseInt(category)){ $rootScope.mCra(custom.error("The Category is invalid")); return; }
                if(!parseInt(price)){ $rootScope.mCra(custom.error("The price is invalid")); return; }
                //if(descr.length < 4){ $rootScope.mCra(custom.error("The description cannot be less than 5 characters")); return; }
                obj.innerHTML = "<i class='fa fa-spinner fa-spin'></i> Please wait";
                var url = UserService.apiRoot+"admin/create/service"
                var config = $rootScope.getHeader(0);
                var data = $rootScope.cred();
                data.department = category;
                var service = [{
                    "name":service,
                    "price":price,
                    "quantity":quantity,
                    "type":serviceType
                    }
                ]
                data.services = service;
                data = {
                    "data":data
                }
                $http.post(url, data, config).then(function(response){
                    if(response.data.error.status == 0){
                      $rootScope.mCra(custom.success("Service has been added"));
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
                if(confirm("Are you sure? Deleting Service, confirm or cancel to continue")){
                    obj = obj.currentTarget;
                    obj.innerHTML = "<i class='fa fa-spinner fa-spin'></i> Please wait";
                    var  url= UserService.apiRoot+'admin/delete/service';
                    var config = $rootScope.getHeader(0);
                    var data = $rootScope.cred();
                    data.serviceID = x.id;
                    data = {
                        "data":data
                    };
                    $http.put(url, data, config).then(function(response){
                        if(response.data.error.status == 0){
                          $rootScope.mCra(custom.success("Service has been removed"));
                          $state.reload();
                        }else{
                            obj.innerHTML = '<i class="fa fa-save"></i> Save';
                            $rootScope.mCra(custom.error(response.data.error.message));
                        }
                    }, function(response){
                      obj.innerHTML = '<i class="fa fa-save"></i> Save';
                    });
                }
            }
            $scope.filter = function($obj){
                var state = $('#state').find(":selected").val();
                var lg = $('#lg').find(":selected").val()
                var  url= UserService.apiRoot+'fmcg/get/dist/'+state+'/'+lg;
                config = $rootScope.getHeader(1);
                $http.get(url, config).then(function(response){
                    if(response.data.error.status == 0){
                        $scope.services = response.data.content.data;
                    }else{}
                    }, function(response){
                });
            }
            $scope.viewQ = function(obj, data){
                $scope.lastX = data;
                var  url= UserService.apiRoot+'fmcg/get/transactions/0/dist/'+data.username+'/0/90988796798979098/'+$('#product').find(":selected").val();
                var data= {};
                config = $rootScope.getHeader(1);
                $http.get(url, config).then(function(response){
                    if(response.data.error.status == 0){
                        $scope.transactions = response.data.content.data;
                    }else{}
                    }, function(response){
                });
            }
            $scope.filterTransactions = function(){
                var obj = document.getElementById("filterOBJ");
                obj.innerHTML = "<i class='fa fa-spinner fa-spin'></i> Fetching";
                var fromDate = document.getElementById("fromDate").value == ""? "0" : new Date(document.getElementById("fromDate").value).valueOf()/1000;
                var toDate = document.getElementById("toDate").value == ""? "9999999999999999999" : new Date(document.getElementById("toDate").value).valueOf()/1000;
                var  url= UserService.apiRoot+'fmcg/get/transactions/0/dist/'+$scope.lastX.username+'/'+fromDate+'/'+toDate+'/'+$('#product').find(":selected").val();
                $http.get(url, config).then(function(response){
                    if(response.data.error.status == 0){
                        $scope.transactions = response.data.content.data;
                        obj.innerHTML = '<i class="fa fa-filter"></i> Filter';
                    }else{
                        $rootScope.mCra(custom.error(response.data.error.message));
                        obj.innerHTML = '<i class="fa fa-filter"></i> Filter';
                     }
                    }, function(response){
                        obj.innerHTML = '<i class="fa fa-filter"></i> Filter';
                });
            }
        }else{
            //route to login
            $location.path("/login");
        }
    }