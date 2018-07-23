angular
  .module('app')
  .controller('cashierCtrl', ['$scope', '$location', '$http', '$state', 'UserService', 'DTOptionsBuilder', '$rootScope', '$timeout',  cashierCtrl]);
	function cashierCtrl($scope, $location, $http, $state, UserService, DTOptionsBuilder, $rootScope, $timeout) {
        if($rootScope.validate()){
            $('body').removeClass('modal-open');
            $('.modal-backdrop').remove();
            $scope.user = JSON.parse(localStorage.getItem('pd'));
            var custom = new $rootScope.customMessage();
            var data= {};
            config = $rootScope.getHeader(1);
            var type = "-";
            var merchant = "-";
            $scope.usertype = "Unsorted";
            $scope.activeID = "-";
            $scope.nameActive = "";
            if(sessionStorage.getItem("departmentID")){
                document.getElementById("type").selectedIndex = 2;
                type = "outlet";
                document.getElementById("indvd").disabled = "";
                merchant = JSON.parse(sessionStorage.getItem("departmentID")).merchantID;
                populateUnames(0);
                $scope.usertype = "Filter by Department";
                $scope.activeID = merchant;
                $scope.nameActive = sessionStorage.getItem("uname");
            }else if(sessionStorage.getItem("agentID")){
                document.getElementById("type").selectedIndex = 1;
                type = "agent";
                document.getElementById("indvd").disabled = "";
                merchant = JSON.parse(sessionStorage.getItem("agentID")).agentID;
                populateUnames(1);
                $scope.usertype = "Filter by Agent";
                $scope.activeID = merchant;
                $scope.nameActive = sessionStorage.getItem("uname");
            }
            var url = UserService.apiRoot+'admin/get/cashier/'+type+'/'+merchant+'/-';
            $http.get(url, config).then(function(response){
                if(response.data.error.status == 0){
                    $scope.cashiers = response.data.content.data;
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
            $scope.filter = function(obj){
                obj = obj.currentTarget;
                var cats = $('#type').find(":selected").val().toLowerCase();
                var merchant = $('#indvd').find(":selected").val().toLowerCase();
                var url = UserService.apiRoot+'admin/get/cashier/'+cats+'/'+merchant+'/-';
                config = $rootScope.getHeader(1);
                obj.innerHTML = "<i class='fa fa-spinner fa-spin'></i> working";
                $http.get(url, config).then(function(response){
                    if(response.data.error.status == 0){
                        $scope.cashiers = response.data.content.data;
                        obj.innerHTML = '<i class="fa fa-filter"></i> Filter';
                    }else{}
                    }, function(response){
                        obj.innerHTML = '<i class="fa fa-filter"></i> Filter';
                });
            }
            function populateUnames(type){
                var url;
                if(type == 0){
                    url = UserService.apiRoot+"admin/get/outlet";
                }else{
                    url = UserService.apiRoot+"admin/get/agent";
                }
                $http.get(url, config).then(function(response){
                    if(response.data.error.status == 0){
                        $scope.unames = response.data.content.data;
                    }else{}
                    }, function(response){
                });
            }
            $("#type").change(function(){
                $("#fetcher").html("<i class='fa fa-spinner fa-spin'></i> Fetching...");
                var id = $('#type').find(":selected").val().toLowerCase();
                var  url= UserService.apiRoot+'admin/get/'+id;
                $http.get(url, config).then(function(response){
                    if(response.data.error.status == 0){
                        $scope.unames = response.data.content.data;
                        $scope.nameActive = "";
                        $("#fetcher").html(""); 
                    }else{
                        $("#fetcher").html("<i class='fa fa-exclamation-circle'></i> Fetch Failed");              
                    }
                    }, function(response){
                        $("#fetcher").html("<i class='fa fa-exclamation-circle'></i> Fetch Failed");
                });
            });
            $scope.details = function(obj){
                sessionStorage.setItem("cashierProfile", JSON.stringify(obj));
                $location.path('/cashier-profile');
            }
        }else{
            //route to login
            $location.path("/login");
        }
    }