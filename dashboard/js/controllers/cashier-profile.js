angular
  .module('app')
  .controller('cashierprofileCtrl', ['$scope', '$location', '$http', '$state', 'UserService', 'DTOptionsBuilder', '$rootScope', '$timeout',  cashierprofileCtrl]);
	function cashierprofileCtrl($scope, $location, $http, $state, UserService, DTOptionsBuilder, $rootScope, $timeout) {
        if($rootScope.validate()){
            $('body').removeClass('modal-open');
            $('.modal-backdrop').remove();
            $scope.user = JSON.parse(localStorage.getItem('pd'));
            var custom = new $rootScope.customMessage();
            var data= {};
            config = $rootScope.getHeader(1);
            if(!sessionStorage.getItem("cashierProfile")) $location.path('/dashboard')
            $scope.profile = JSON.parse(sessionStorage.getItem("cashierProfile"));
            var url= UserService.apiRoot+'admin/get/transactions/'+$scope.profile.cashierType+'/'+$scope.profile.merchantID+'/'+$scope.profile.cashierID+'/-/-/0/77777777';
            $http.get(url, config).then(function(response){
                if(response.data.error.status == 0){
                    $scope.transactions = response.data.content.data;
                }else{}
                }, function(response){
            });
            /* Get Devices */
            url= UserService.apiRoot+'admin/get/devices/-';
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
            $scope.filter = function(obj){
                obj = obj.currentTarget;
                var fromDate = document.getElementById("fromDate").value == ""? "0" : new Date(document.getElementById("fromDate").value).valueOf()/1000;
                var toDate = document.getElementById("toDate").value == ""? "7000000" : new Date(document.getElementById("toDate").value).valueOf()/1000;
                var url= UserService.apiRoot+'admin/get/transactions/'+$scope.profile.cashierType+'/'+$scope.profile.merchantID+'/'+$scope.profile.cashierID+'/-/-/'+fromDate+'/'+toDate;
                config = $rootScope.getHeader(1);
                obj.innerHTML = "<i class='fa fa-spinner fa-spin'></i> working";
                $http.get(url, config).then(function(response){
                    if(response.data.error.status == 0){
                        $scope.transactions = response.data.content.data;
                        obj.innerHTML = '<i class="fa fa-filter"></i> Filter';
                    }else{}
                    }, function(response){
                        obj.innerHTML = '<i class="fa fa-filter"></i> Filter';
                });
            }
            $scope.editAgent = function(data, obj){
                url = UserService.apiRoot+'admin/update/cashier';
                var ob = document.getElementById("Savebtn");
                ob.innerHTML = "<i class='fa fa-spinner fa-spin'></i> working...";
                var fullname = document.getElementById("fullname").value;
                var email = document.getElementById("email").value;
                var phone = document.getElementById("phone").value;
                var gender = document.getElementById("gender").options[document.getElementById("gender").selectedIndex].value;
                var device = document.getElementById("device").options[document.getElementById("device").selectedIndex].value;
                var password = document.getElementById("password").value;
                var pin = document.getElementById("pin").value;
                if(password !== document.getElementById("password2").value){ $rootScope.mCra(custom.error("The password does not match"));  ob.innerHTML= "save"; return;  }
                if(fullname.length < 5){ $rootScope.mCra(custom.error("The fullname field looks flimsy "));  ob.innerHTML= "save";  return; }
                if(device == 0){ $rootScope.mCra(custom.warning("Unlinking Device will make the agent not have a device")); }
                if(pin == 0){ $rootScope.mCra(custom.warning("The PIN must be 4 characters long")); ob.innerHTML= "save";  return; }
                var datum = {
                    "fullname":fullname,
                    "email":email,
                    "phone":phone,
                    "gender":gender,
                    "cashierID":data.cashierID,
                    "newDevice":device,
                    "oldDevice": data.device,
                    "password":password,
                    'username': JSON.parse(localStorage.getItem('pd')).username,
                    'publicKey': JSON.parse(localStorage.getItem('pd')).publicKey,
                    "pin":pin,
                    "hospitalID":JSON.parse(localStorage.getItem('pd')).hospitalID
                }
                var config = {
                    headers : {
                        'Content-Type': 'application/json'
                    }
                }
                data = {
                    "data":datum
                };
                $http.put(url, data, config).then(function(response){
                    if(response.data.error.status == 0){
                        $rootScope.mCra(custom.success(response.data.success.message));
                        $state.reload();
                    }else{
                         $rootScope.mCra(custom.error(response.data.error.message));
                    }
                    ob.innerHTML = "save";
                }, function(response){
                    $rootScope.mCra(custom.error(response.data.error.message));
                    ob.innerHTML = "save";
                });
            }
            $scope.purge = function(x, obj){
                if(confirm("Are you sure? The Cashier will be Removed!")){}else{return;}
                obj.currentTarget.innerHTML = '<i class="fa fa-spinner fa-spin"></i> Removing';
                if(arguments.length > 0){
                    $rootScope.mCra(custom.warning("Deleting with ID "+x.cashierID));
                     var  url= UserService.apiRoot+'admin/delete/cashier';
                    var data = {
                        "data": $rootScope.cred()
                    };
                    data.data.cashierID = x.cashierID;
                    var config = {
                            headers : {
                                'Content-Type': 'application/json'
                    }
                    }
                    $http.post(url, data, config).then(function(response){
                        if(response.data.error.status == 0){
                            $rootScope.mCra(custom.success(response.data.success.message));
                            $location.path("/dashboard");
                        }else{
                             obj.currentTarget.innerHTML="Remove";
                            $rootScope.mCra(custom.error(response.data.error.message));
                        }
                    }, function(response){
                    });
                }else{
                    obj.currentTarget.innerHTML="Remove";
                    $rootScope.mCra(custom.error("Sorry, the Cashier could not be removed!"));
                }
            };
            $scope.togglekey = function(x, ev){
                a = (x.valid == 0)? 1 : 0;
                var former = ev.currentTarget.innerHTML;
                var message = (a == 0)? "The Cashier will be Locked!" : "The Cashier will be Unlocked!";
                if(confirm("Are you sure? "+message)){}else{return;}
                ev.currentTarget.innerHTML = '<h4 style="color:rgb(220, 183, 20)"><i class="fa fa-spinner fa-spin"></i></h4><h4> working</h4>';
                var url= UserService.apiRoot+'admin/set/cashier/'+a;
                var data = {
                    "data":$rootScope.cred()
                };
                data.data.cashierID = x.cashierID;
                var config = {
                        headers : {
                            'Content-Type': 'application/json'
                }
                }
                $http.put(url, data, config).then(function(response){
                    if(response.data.error.status == 0){
                        //$scope.cards = response.data.content.cards;
                        $rootScope.mCra(custom.success(response.data.success.message));
                        var newIcon = (a == 0)? "<i class='fa fa-unlock'></i>" : "<i class='fa fa-lock'></i>";
                        var newWord = (a == 0)? "Unlock" : "Lock";
                        ev.currentTarget.innerHTML = '<h4 style="color:rgb(220, 183, 20)">'+newIcon+'</h4><h4>'+newWord+'</h4>';
                        $scope.profile.valid = a;
                        sessionStorage.setItem("cashierProfile", JSON.stringify($scope.profile));
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