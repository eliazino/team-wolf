angular
  .module('app')
  .controller('adminCtrl', ['$scope', '$location', '$http', '$state', 'UserService', 'DTOptionsBuilder', '$rootScope', '$timeout',  adminCtrl]);
	function adminCtrl($scope, $location, $http, $state, UserService, DTOptionsBuilder, $rootScope, $timeout) {
        if($rootScope.validate()){
            $('body').removeClass('modal-open');
            $('.modal-backdrop').remove();
            $scope.hospital = JSON.parse(localStorage.getItem("hd"));
            $scope.user = [JSON.parse(localStorage.getItem('pd'))];
            var custom = new $rootScope.customMessage();
            var data= {};
            config = $rootScope.getHeader(1);
            var url= UserService.apiRoot+'admin/get/staff/-';
            $http.get(url, config).then(function(response){
                if(response.data.error.status == 0){
                    $scope.ads = response.data.content.data;
                }else{}
                }, function(response){
            });
            /* Get Tlimit */
            url= UserService.apiRoot+'admin/get/tlimit/0';
            $http.get(url, config).then(function(response){
                if(response.data.error.status == 0){
                    $scope.spoints = response.data.content.data[0].tlimit;
                    $scope.todayleft = response.data.content.hist[0].left;
                    $scope.todayamount = response.data.content.hist[0].amount; 
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
            $scope.saveAdmin = function(obj) {
                var adminJson = JSON.parse(localStorage.getItem("pd"));
                obj = document.getElementById("Savebtn");
                obj.innerHTML = document.getElementById("workr").innerHTML;
                fullname = document.getElementById("fullname").value;
                password = document.getElementById("password").value;
                email = document.getElementById("email").value;
                phone = document.getElementById("phone").value;
                gender = document.getElementById("gender").value;
                address = document.getElementById("address").value;
                username = document.getElementById("username").value;
                accLevel = document.getElementById("accessLevel").options[document.getElementById("accessLevel").selectedIndex].value;
                var  url= UserService.apiRoot+'admin/create/staff';
                var data = {
                        'adminUsername': adminJson.username,
                        'adminPublicKey': adminJson.publicKey,
                        'fullname':fullname,
                        'password':password,
                        'email':email,
                        'phone':phone,
                        'gender':gender,
                        'username':username,
                        'address':address,
                        'agentID':accLevel
                };
                data = {"data":data};
                var config = {
                        headers : {
                            'Content-Type': 'application/json'
                   }
                }
                $http.post(url, data, config).then(function(response){
                    if(response.data.error.status == 0){
                         $rootScope.mCra(custom.success(response.data.success.message));
                         $state.reload();
                         /*obj.innerHTML = "save";
                        document.getElementById("closeBtn").click();
                        $scope.admin = response.data.content.data;
                        document.getElementById("fullname").value = "";
                        document.getElementById("password").value = "";
                        document.getElementById("email").value = "";
                        document.getElementById("phone").value = "";
                        document.getElementById("gender").value = "";
                        document.getElementById("address").value = "";
                        document.getElementById("username").value = "";*/
                    }else{
                        $rootScope.mCra(custom.error(response.data.error.message));
                    }
                    obj.innerHTML = "save";
                }, function(response){
                });
            };
            $scope.updatePoint = function(ev){
                obj = ev.currentTarget;
                var amount = document.getElementById("amount").value;
                var key = document.getElementById("key").value;
                if(amount < 1){ $rootScope.mCra(custom.error("The amount cannot be less than #1")); return; }
                if(key.length < 1){ $rootScope.mCra(custom.error("The password is invalid!")); return; }
                if(!confirm("Are you sure of the point value of #"+amount+"? ")){ return; }
                obj.innerHTML = "<i class='fa fa-spinner fa-spin'></i> Wait...";
                var  url= UserService.apiRoot+'admin/set/pointLimit';
                var data = $rootScope.cred();
                data.k = key;
                data.amount = amount;
                data = $.param(data);
                /*{
                        'username': sessionStorage.getItem('username'),
                        'publicKey': sessionStorage.getItem('publickey'),
                        'hospitalID':$scope.hospital.hospitalID,
                        'amount':amount,
                        'k':key
                };*/
                var config = {
                        headers : {
                            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                }
                }
                $http.post(url, data, config).then(function(response){
                    if(response.data.error.status == 0){
                        $rootScope.mCra(custom.success(response.data.success.message));
                        obj.innerHTML = "save";
                        document.getElementById("closeBtn2").click();
                        document.getElementById("key").value = "";
                        $scope.spoints = response.data.content.data[0].tlimit;
                    }else{
                        $rootScope.mCra(custom.error(response.data.error.message));
                    }
                    obj.innerHTML = "save";
                }, function(response){
                });
            };
            $scope.fastPoint = function(ev){
                obj = ev.currentTarget;
                var amount = document.getElementById("amount2").value;
                var key = document.getElementById("key2").value;
                if(amount < 1){ $rootScope.mCra(custom.error("The amount cannot be less than #1")); return; }
                if(key.length < 1){ $rootScope.mCra(custom.error("The password is invalid!")); return; }
                if(!confirm("Are you sure of the point value of #"+amount+"? ")){ return; }
                obj.innerHTML = "<i class='fa fa-spinner fa-spin'></i> Wait...";
                var  url= UserService.apiRoot+'admin/addto/pointLimit';
                var data = $rootScope.cred();
                data.k = key;
                data.amount = amount;
                data = $.param(data);
                var config = {
                        headers : {
                            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                   }
                }
                $http.post(url, data, config).then(function(response){
                    if(response.data.error.status == 0){
                         $rootScope.mCra(custom.success(response.data.success.message));
                         $state.reload();
                         /*obj.innerHTML = "save";
                         //document.getElementById("closeB").click();
                        document.getElementById("key2").value = "";
                        $scope.todayleft = response.data.content.data[0].left;*/
                    }else{
                        $rootScope.mCra(custom.error(response.data.error.message));
                    }
                    obj.innerHTML = "save";
                }, function(response){
                });
            };
            $scope.editPass = function(data, obj){
                if(arguments.length == 2){
                }else{
                    obj = document.getElementById("editbtn");
                    obj.innerHTML = document.getElementById("work").innerHTML;
                    password = document.getElementById("oldPassword").value;
                    newPassword = document.getElementById("newPassword").value;
                    var  url= UserService.apiRoot+'admin/update/password';
                    var dparam = {
                            'username': sessionStorage.getItem('username'),
                            'publicKey': sessionStorage.getItem('publickey'),
                            'oldPassword':password,
                            'newPassword': newPassword

                    };
                    data = $.param(dparam);
                    var config = {
                            headers : {
                                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                    }
                    };
                    $http.put(url, data, config).then(function(response){
                        if(response.data.error.status == 0){
                            $rootScope.mCra(custom.success(response.data.success.message));
                            obj.innerHTML = "save";
                            document.getElementById("closeBtn2").click();
                            $scope.editPass = response.data.content.data;
                            sessionStorage.setItem('publickey',response.data.content.publicKey);
                            document.getElementById("oldPassword").value = "";
                            document.getElementById("newPassword").value = "";
                        }else{
                            $rootScope.mCra(custom.error(response.data.error.message));
                            obj.innerHTML = "save";
                        }
                    }, function(response){
                        $rootScope.mCra(custom.error(response.data.error.message));
                        obj.innerHTML = "save";
                    });
                }
            }
        }else{
            //route to login
            $location.path("/login");
        }
    }