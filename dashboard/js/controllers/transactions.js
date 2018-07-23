angular
  .module('app')
  .controller('transactionCtrl', ['$scope', '$location', '$http', '$state', 'UserService', 'DTOptionsBuilder', '$rootScope', '$timeout',  transactionCtrl]);
	function transactionCtrl($scope, $location, $http, $state, UserService, DTOptionsBuilder, $rootScope, $timeout) {
        if($rootScope.validate()){
            $('body').removeClass('modal-open');
            $('.modal-backdrop').remove();
            $scope.user = JSON.parse(localStorage.getItem('pd'));
            $scope.userID = "-";
            var custom = new $rootScope.customMessage();
            $(document).ready(function(){
                if(sessionStorage.getItem("departmentID")){
                    $("#type").prop('selectedIndex', 1);
                    $scope.userID = JSON.parse(sessionStorage.getItem("departmentID")).merchantID;
                }else if(sessionStorage.getItem("agentID")){
                    $("#type").prop('selectedIndex', 0);
                    $scope.userID = JSON.parse(sessionStorage.getItem("agentID")).agentID;
                }else{
                    $("#type").prop('selectedIndex', 1);
                }
                var now = new Date();
                var month = (now.getMonth() + 1);               
                var day = now.getDate();
                if (month < 10) 
                    month = "0" + month;
                if (day < 10) 
                    day = "0" + day;
                var today = now.getFullYear() + '-' + month + '-' + day;
                $('#fromDate').val(today);
                $('#toDate').val(today);
                getAccounts();                
                $scope.filterTransactions();
            });            
            var data= {};
            var config = $rootScope.getHeader(1);
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
                $scope.pSum = 0;
                $scope.topSum = 0;
                $scope.balSum = 0;
                angular.forEach(displayedRows, function(row) {
                // Careful on the content of `row`
                //$scope.sum += parseFloat(row[6]);
                try{
                    var t = row[5].replace(",","").replace("₦","").replace(" ", "");
                    var ts = row[6].replace(",","").replace("₦","").replace(" ", "");
                    var bs = row[8].replace(",","").replace("₦","").replace(" ", "");
                    //$scope.tcSum += parseFloat(t2);
                    $scope.pSum += parseFloat(t);
                    $scope.topSum += parseFloat(ts);
                    $scope.balSum += parseFloat(bs);
                }catch(e){

                    }
                });
            }
            $scope.filterTransactions = function(acv, b){
                var obj = document.getElementById("filterOBJ");
                obj.innerHTML = "<i class='fa fa-spinner fa-spin'></i> Fetching";
                var type = document.getElementById("type").options[document.getElementById("type").selectedIndex].value;
                var account = document.getElementById("account").options[document.getElementById("account").selectedIndex].value;
                var fromDate = document.getElementById("fromDate").value == ""? "0" : new Date(document.getElementById("fromDate").value).valueOf()/1000;
                var toDate = document.getElementById("toDate").value == ""? "9999999999999999999" : new Date(document.getElementById("toDate").value).valueOf()/1000;
                var dep = document.getElementById("department").options[document.getElementById("department").selectedIndex].value;
                if(arguments.length !== 2 ){ account = $scope.userID; }
                var url= UserService.apiRoot+'admin/get/transactions/'+type+'/'+account+'/-/-/-/'+fromDate+'/'+toDate+'/'+dep;
                $http.get(url, config).then(function(response){
                    if(response.data.error.status == 0){
                        $scope.transactions = response.data.content.data;
                        /*var processedResponses = $rootScope.fetchDistinct(response.data.content.data);
                        $scope.canteenOpp = processedResponses[0];
                        $scope.canteenDetails = processedResponses[1];
                        dataService.set(processedResponses);*/
                        obj.innerHTML = '<i class="fa fa-filter"></i> Filter';
                    }else{
                        $rootScope.mCra(custom.error(response.data.error.message));
                        obj.innerHTML = '<i class="fa fa-filter"></i> Filter';
                     }
                    }, function(response){
                        obj.innerHTML = '<i class="fa fa-filter"></i> Filter';
                });
            }
            $("#type").change(function(){
                getAccounts();
            });
            function getAccounts(){
                $("#fetcher").html("<i class='fa fa-spinner fa-spin'></i> Fetching...");
                var id = $('select#type').find(":selected").val().toLowerCase();
                var  url= UserService.apiRoot+'admin/get/'+id;
                $http.get(url, config).then(function(response){
                    if(response.data.error.status == 0){
                        $scope.account = response.data.content.data;
                        $("select#account").val($scope.userID);
                        $scope.nameActive = "";
                        $("#fetcher").html(""); 
                    }else{
                        $("#fetcher").html("<i class='fa fa-exclamation-circle'></i> Fetch Failed");              
                    }
                    }, function(response){
                        $("#fetcher").html("<i class='fa fa-exclamation-circle'></i> Fetch Failed");
                });
            }
            var  url= UserService.apiRoot+'admin/get/department';
            var data= {};
            config = $rootScope.getHeader(1);
            $http.get(url, config).then(function(response){
                if(response.data.error.status == 0){
                    $scope.departments = response.data.content.data;
                }else{}
                }, function(response){
            });
        }else{
            //route to login
            $location.path("/login");
        }
    }