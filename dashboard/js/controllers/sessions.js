angular
  .module('app')
  .controller('logoutCtrl', ['$scope', '$location', '$http', '$state', 'UserService', '$rootScope', '$timeout',  logoutCtrl])
  .controller('loginCtrl', ['$scope', '$location', '$http', '$state', 'UserService', '$rootScope', '$timeout', '$window', loginCtrl])
  .controller('registerCtrl', ['$scope', '$location', '$http', '$state', 'UserService', '$rootScope', '$timeout',  registerCtrl]);
  function logoutCtrl($scope, $location, $http, $state, UserService, $rootScope, $timeout) {
      localStorage.clear();
      $location.path("/login");
  };
  function loginCtrl($scope, $location, $http, $state, UserService, $rootScope, $timeout, $window) {
    var custom = new $rootScope.customMessage();
    var header = $rootScope.getHeader(0);
    if(!$rootScope.validate()){
        $scope.login = function(ev){
            var obj = ev.currentTarget;
            var username = $("#username").val();
            var pass = $("#password").val();
            var former = obj.innerHTML;
            var url = UserService.apiRoot+'fmcg/login';
            if(username != null && username.length > 2 && pass.length != null && pass.length > 2){
                var datum = {
                    data:{
                        "username":username,
                        "password":pass
                    }
                };
                obj.innerHTML = '<i class="fa fa-spinner fa-spin"></i> working';
                var config = $rootScope.getHeader(0);
                $http.post(url, datum, config).then(function(response){
                    if(response.data.error.status == 0){
                      $rootScope.mCra(custom.success(response.data.success.message));
                      console.log(response.data.content.data[0]);
                      localStorage.setItem('pd', JSON.stringify(response.data.content.data[0]));
                      $window.location.reload();
                      //$location.path('/dashboard')
                    }else{
                        obj.innerHTML = former;
                        $rootScope.mCra(custom.error(response.data.error.message));
                    }
                }, function(response){
                  obj.innerHTML = former;
                });
            }else{
                $rootScope.mCra(custom.error("username and password field are required")); return;
            }
            obj.innerHTML = '<i class="fa fa-spinner fa-spin"></i> working';
        }
    }else{
        $location.path('/dashboard');
    }
 }
 function registerCtrl($scope, $location, $http, $state, UserService, $rootScope, $timeout, $filter) {
    if(!$rootScope.validate()){
        if(sessionStorage.getItem("otoken") && sessionStorage.getItem("hospitalID")){
            $("#hospitalAccount").hide("slow");
            $("#userAccount").show("slow");
        }
        var custom = new $rootScope.customMessage();
        var  url= UserService.apiRoot+'get/states';
        var lastPOP = null;
        var data= {};
        var config = {
            
        };
        $http.get(url, config).then(function(response){
            if(response.data.error.status == 0){
                $scope.states = response.data.content.data; 
            }else{                         
            }
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
        $scope.signup = function(obj){
            var  url= UserService.apiRoot+'any/create/hospital';
            var data = {
                "data":{
                'hospitalName': $("#name").val(),
                'address': $("#address").val(),
                "phone": $("#phone").val(),
                "email": $("#email").val(),
                "state": $('#state').find(":selected").val(),
                "LG": $('#LG').find(":selected").val(),
                "accessCode": $("#accessCode").val(),
                "logo":lastPOP
                }
            };
            var config = {
                method: 'POST',
                headers : {
                    'Content-Type': 'application/json;'
                }
            }
            if(data.data.hospitalName.length < 2){ $rootScope.mCra(custom.error("Company Name is invalid")); return; }
            if(data.data.address.length < 2){ $rootScope.mCra(custom.error("Address is invalid")); return; }
            if(data.data.phone.length < 2){ $rootScope.mCra(custom.error("Phone Number is invalid")); return; }
            obj.currentTarget.innerHTML = "<i class='fa fa-cog fa-spin'></i> working...";
            $http.post(url, data, config).then(function(response){
                if(response.data.error.status == 0){
                    sessionStorage.setItem("otoken", response.data.content.otoken);
                    sessionStorage.setItem("hospitalID", response.data.content.ftoken);
                    $scope.hospitalID = response.data.content.HMOID;
                    $scope.ftoken = response.data.content.ftoken
                    $rootScope.mCra(custom.success(response.data.success.message+". Now add Login Account"));
                    $scope.isunRegistered = false;
                    $("#hospitalAccount").hide("slow");
                    $("#userAccount").show("slow");
                }else{
                    $rootScope.mCra(custom.error(response.data.error.message));
                    obj.currentTarget.innerHTML = "Create Account";
                }
            },function(err){
                $rootScope.mCra(custom.error("Something went wrong"));
                obj.currentTarget.innerHTML = "Create Account";
            });
        };
        $scope.fileChanged = function(){
            obj = document.getElementById("fileInput");
            var imageURL = obj.files[0];
            imageName = obj.files[0].name;
            var reader  = new FileReader();
            var image = document.getElementById("preview");
            // it's onload event and you forgot (parameters)
            reader.onload = function(e)  {
                // the result image data
                if(imageURL.size/1024 <= 15000){
                    if(e.target.error == null){
                        if(e.target.result.substr(0, 10) == "data:image"){
                            image.src = e.target.result;
                            lastPOP = image.src.replace(/^data:image\/(png|jpg);base64,/, "");
                            document.getElementById("dohos").disabled = "";
                            imageSet = true;
                        }else{
                            alert("The image is invalid");
                        }				
                    }else{
                        alert("The image selected is invalid!");
                    }
                }else{
                    alert("The Max. allowed file size is 150Kb");
                }
            }
            // you have to declare the file loading
            reader.readAsDataURL(imageURL);
        };
        $scope.createUser = function(obj){
            var fullname = $("#userfullname").val();
            var phone = $("#userPhone").val();
            var gender = $("#userGender").find(":selected").val();
            var address = $("#userAddress").val();
            var username = $("#username").val();
            var email = $("#userEmail").val();
            var password = $("#userPassword").val();
            var pass2 = $("#userPassword2").val();
            if(fullname == null || fullname.length < 4){$rootScope.mCra(custom.error("Fullname is invalid")); return;}
            if(phone == null){$rootScope.mCra(custom.error("Phone Number is invalid")); return;}
            if(address == null){$rootScope.mCra(custom.error("Address is invalid")); return;}
            if(username == null || username.length < 3){$rootScope.mCra(custom.error("Username is invalid")); return;}
            if(email == null){$rootScope.mCra(custom.error("Email is invalid")); return;}
            if(password == null || password.length < 6){ $rootScope.mCra(custom.error("Password cannot be less than 6 characters")); return;}
            if(password != pass2){$rootScope.mCra(custom.error("Password do not match")); return;}
            var  url= UserService.apiRoot+'admin/create/staff';
            var data = {
                "data":{
                'fullname': fullname,
                'address': address,
                "phone": phone,
                "email": email,
                "username": username,
                "password": pass2,
                "gender": gender,
                "otoken": sessionStorage.getItem("otoken"),
                "ftoken": sessionStorage.getItem("hospitalID")
                }
            };
            var config = {
                method: 'POST',
                headers : {
                    'Content-Type': 'application/json;'
                }
            }
            obj.innerHTML = "<i class='fa fa-spinner fa-spin'></i> Please Wait...";
            $http.post(url, data, config).then(function(response){
                if(response.data.error.status == 0){
                    $rootScope.mCra(custom.success("Account creation Completed, Now login with your account"));
                    sessionStorage.removeItem("hospitalID");
                    sessionStorage.removeItem("otoken");
                    $location.path('/login');
                }else{
                    $rootScope.mCra(custom.error(response.data.error.message));
                    obj.currentTarget.innerHTML = "Create Account";
                }
            },function(err){
                $rootScope.mCra(custom.error("Something went wrong"));
                obj.currentTarget.innerHTML = "Create Account";
            });
        };
    }else{
        $location.path('/dashboard');
    }
 }