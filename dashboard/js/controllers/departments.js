angular
  .module('app')
  .controller('departmentCtrl', ['$scope', '$location', '$http', '$state', 'UserService', 'DTOptionsBuilder', '$rootScope', '$timeout',  departmentCtrl]);
	function departmentCtrl($scope, $location, $http, $state, UserService, DTOptionsBuilder, $rootScope, $timeout) {     
        if($rootScope.validate()){
            $('body').removeClass('modal-open');
            $('.modal-backdrop').remove();
            $scope.user = JSON.parse(localStorage.getItem('pd'));
            var custom = new $rootScope.customMessage();
            /* Get Outlets */
            var  url= UserService.apiRoot+'any/get/products';
            var data= {};
            config = $rootScope.getHeader(1);
            $http.get(url, config).then(function(response){
                if(response.data.error.status == 0){
                    $scope.department = response.data.content.data;
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
            $scope.save = function(obj){
                var obj = obj.currentTarget;
                var name = $("#name").val();
                if(name.length < 4){ $rootScope.mCra(custom.error("The product name cannot be less than 5 characters")); return; }
                obj.innerHTML = "<i class='fa fa-spinner fa-spin'></i> Please wait";
                var url = UserService.apiRoot+"fmcg/create/product"
                var config = $rootScope.getHeader(0);
                var data = $rootScope.cred();
                data.name = name;
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
            $scope.setRoute = function(obj, route){
                sessionStorage.setItem("departmentID", JSON.stringify(obj));
                sessionStorage.removeItem("agentID");
                sessionStorage.setItem("uname", obj.name);
                $location.path(route);
            }
            $scope.addCashier = function(obj){
                $scope.activeDepartment = obj.merchantID;
                $scope.departmentName = obj.name;
            }
            $scope.saveAgent = function(){
                url = UserService.apiRoot+'admin/create/outlet/cashier';
                var ob = document.getElementById("Savebtn");
                ob.innerHTML = "<i class='fa fa-spinner fa-spin'></i> working...";
                var fullname = document.getElementById("fullname").value;
                var email = document.getElementById("cashieremail").value;
                var phone = document.getElementById("phone").value;
                var gender = document.getElementById("gender").options[document.getElementById("gender").selectedIndex].value;
                var device = document.getElementById("device").options[document.getElementById("device").selectedIndex].value;
                var password = document.getElementById("password").value;
                var username = document.getElementById("username").value;
                var pin = document.getElementById("pin").value;
                if(password.length < 6){ $rootScope.mCra(custom.error("The password length cannot be less than 6 Charcters long"));  ob.innerHTML= "save"; return; }
                if(pin.length !== 4){ $rootScope.mCra(custom.error("The Input PIN is invalid. Expecting 4 charcters"));  ob.innerHTML= "save"; return; }
                if(password !== document.getElementById("password2").value){ $rootScope.mCra(custom.error("The password does not match"));  ob.innerHTML= "save"; return;  }
                if(username.length < 4){ $rootScope.mCra(custom.error("The username length cannot be less than 4 Charcters long"));  ob.innerHTML= "save";  return; }
                if(fullname.length < 5){ $rootScope.mCra(custom.error("The fullname field looks flimsy "));  ob.innerHTML= "save";  return; }
                if(device == 0){ $rootScope.mCra(custom.error("You have not selected a valid device"));  ob.innerHTML= "save";  return; }
                var datum = {
                    "fullname":fullname,
                    "email":email,
                    "phone":phone,
                    "gender":gender,
                    "deviceID":device,
                    "cashierPassword":password,
                    "cashierUsername":username,
                    "username": JSON.parse(localStorage.getItem("pd")).username,
                    "publicKey": JSON.parse(localStorage.getItem("pd")).publicKey,
                    "merchantID": $scope.activeDepartment,
                    "pin":pin,
                    "hospitalID": JSON.parse(localStorage.getItem("pd")).hospitalID
                }
                data = {
                    'data':datum
                }
                var config = $rootScope.getHeader(0);
                $http.post(url, data, config).then(function(response){
                    if(response.data.error.status == 0){
                        $rootScope.mCra(custom.success("The New cashier has been added to "+$scope.departmentName));
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
        }else{
            //route to login
            $location.path("/login");
        }
    }