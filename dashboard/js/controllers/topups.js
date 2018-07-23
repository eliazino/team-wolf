angular
  .module('app')
  .controller('topupCtrl', ['$scope', '$location', '$http', '$state', 'UserService', 'DTOptionsBuilder', '$rootScope', '$timeout',  topupCtrl]);
	function topupCtrl($scope, $location, $http, $state, UserService, DTOptionsBuilder, $rootScope, $timeout) {
        if($rootScope.validate()){
            $('body').removeClass('modal-open');
            $('.modal-backdrop').remove();
            $scope.user = JSON.parse(localStorage.getItem('pd'));
            var custom = new $rootScope.customMessage();
            var  url= UserService.apiRoot+'admin/get/department';
            var data= {};
            config = $rootScope.getHeader(1);
            url= UserService.apiRoot+'admin/get/topup/-/-/0/77777777777';
            $http.get(url, config).then(function(response){
                if(response.data.error.status == 0){
                    $scope.transactions = response.data.content.data;
                    //$scope.history = response.data.content.hist;
                }else{
                }
                }, function(response){
            });
            url= UserService.apiRoot+'admin/get/agent';
            $http.get(url, config).then(function(response){
                if(response.data.error.status == 0){
                    $scope.agents = response.data.content.data;
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
            url= UserService.apiRoot+'admin/get/topup/-/-/0/77777777777';
            $http.get(url, config).then(function(response){
                if(response.data.error.status == 0){
                    $scope.transactions = response.data.content.data;
                    //$scope.history = response.data.content.hist;
                }else{
                }
                }, function(response){
            });
            url= UserService.apiRoot+'admin/get/agent';
            $http.get(url, config).then(function(response){
                if(response.data.error.status == 0){
                    $scope.agents = response.data.content.data;
                }else{		         	}
                }, function(response){
            });
            $scope.submitTopUp = function(a){
                var agent = document.getElementById("agentSelector").options[document.getElementById("agentSelector").selectedIndex].value;
                var cashier = document.getElementById("cashierSelector").options[document.getElementById("cashierSelector").selectedIndex].value;
                var amount = document.getElementById("amount").value;
                var obj = a.currentTarget;
                var k = document.getElementById("key").value;
                //obj.innerHTML = "<i class='fa fa-spinner fa-spin'></i> working..."
                if(agent == 0){ $rootScope.mCra(custom.error("You have not selected a valid Agent")); return; }
                if(amount < 1){ $rootScope.mCra(custom.error("You Did not write enough value. At least ₦1 is expected")); return; }
                if(k.length < 2){ $rootScope.mCra(custom.error("You Did not Input your password which is required")); return; }
                if(confirm("Please confirm the topup of "+amount+" to "+document.getElementById("agentSelector").options[document.getElementById("agentSelector").selectedIndex].text)){
                    obj.innerHTML = "<i class='fa fa-spinner fa-spin'></i> working...";
                    var url = UserService.apiRoot+'admin/create/points';
                    var data= {
                        "data": $rootScope.cred()          
                    };
                    data.data.agentID = agent;
                    data.data.cashierID = cashier;
                    data.data.amount = amount;
                    data.data.k = k;
                    var config = $rootScope.getHeader(0);
                    $http.post(url, data, config).then(function(response){
                       if(response.data.error.status == 0){
                           obj.innerHTML = 'Confirm Top up & Continue <i class="fa fa-chevron-right"></i>';
                           $scope.transactions = response.data.content.data;
                           $rootScope.mCra(custom.success(response.data.success.message));
                           $state.reload();
                       }else{
                        obj.innerHTML = 'Confirm Top up & Continue <i class="fa fa-chevron-right"></i>';
                           $rootScope.mCra(custom.error(response.data.error.message));
                       }
                   }, function(response){
                   });
                    return
                }else{
                    return;
                }
            }
            $scope.fetchCashier = function(ob){
                document.getElementById("loading").innerHTML = "<i class='fa fa-spinner fa-spin'></i>";
                var obj = document.getElementById("agentSelector");
                index = obj.options[obj.selectedIndex].value;
                var url= UserService.apiRoot+'admin/get/cashier/agent/'+index+'/-';
                $http.get(url, config).then(function(response){
                    if(response.data.error.status == 0){
                        $scope.cashiers = response.data.content.data;
                        document.getElementById("loading").innerHTML = "";
                    }else{
                     document.getElementById("loading").innerHTML = "";
                     }
                    }, function(response){
                     document.getElementById("loading").innerHTML = "";
                });
            };
            $scope.filterTransactions = function(){
                var obj = document.getElementById("filterOBJ");
                obj.innerHTML = "<i class='fa fa-spinner fa-spin'></i> Fetching";
                var agentID = document.getElementById("agent").options[document.getElementById("agent").selectedIndex].value;
                var fromDate = document.getElementById("fromDate").value == ""? "0" : new Date(document.getElementById("fromDate").value).valueOf()/1000;
                var toDate = document.getElementById("toDate").value == ""? "9999999999999999999" : new Date(document.getElementById("toDate").value).valueOf()/1000;
                var url= UserService.apiRoot+'admin/get/topup/'+agentID+'/-/'+fromDate+'/'+toDate;
                $http.get(url, config).then(function(response){
                    if(response.data.error.status == 0){
                        $scope.transactions = response.data.content.data;                   
                        /*var processedResponses = $rootScope.fetchDistinct(response.data.content.data);
                        $scope.canteenOpp = processedResponses[0];
                        $scope.canteenDetails = processedResponses[1];
                        dataService.set(processedResponses);*/
                    }else{ }
                    }, function(response){
                });
                 obj.innerHTML = "Filter";
            }
        }else{
            //route to login
            $location.path("/login");
        }
    }