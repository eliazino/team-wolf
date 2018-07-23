angular
  .module('app')
  .controller('patientCtrl', ['$scope', '$location', '$http', '$state', 'UserService', 'DTOptionsBuilder', '$rootScope', '$timeout',  patientCtrl]);
	function patientCtrl($scope, $location, $http, $state, UserService, DTOptionsBuilder, $rootScope, $timeout) {     
        if($rootScope.validate()){
            $('body').removeClass('modal-open');
            $('.modal-backdrop').remove();
            $scope.user = JSON.parse(localStorage.getItem('pd'));
            var custom = new $rootScope.customMessage();
            /* Get Outlets */
            var  url= UserService.apiRoot+'admin/get/customers/-';
            var data= {};
            config = $rootScope.getHeader(1);
            $http.get(url, config).then(function(response){
                if(response.data.error.status == 0){
                    $scope.customers = response.data.content.data;
                }else{}
                }, function(response){
            });
            /* Get Devices */
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
            $scope.setCardTo = function (obj, ev){
                var former = ev.currentTarget.innerHTML;
                a = parseInt(obj.valid);
                b = obj.cardSerial;
                a = (a == 0)? 1 : 0;
                var message = (a == 0)? "The card will be Blocked!" : "The Card will be Unblocked!";
                if(confirm("Are you sure? "+message)){}else{return;}
                ev.currentTarget.innerHTML = "Working...";
                var  url= UserService.apiRoot+'admin/set/card/'+b+'/'+a;
                var data ={
                    data:$rootScope.cred()
                };
                var config = $rootScope.getHeader(0);
                $http.put(url, data, config).then(function(response){
                    if(response.data.error.status == 0){
                        //$scope.cards = response.data.content.cards;
                        $state.reload();
                    }else{
                        $rootScope.mCra(custom.error(response.data.error.message));
                        ev.currentTarget.innerHTML = former;  
                    }
                }, function(response){
                });
            }
        }else{
            //route to login
            $location.path("/login");
        }
    }