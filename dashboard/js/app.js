// Default colors
var brandPrimary =  '#20a8d8';
var brandSuccess =  '#4dbd74';
var brandInfo =     '#63c2de';
var brandWarning =  '#f8cb00';
var brandDanger =   '#f86c6b';

var grayDark =      '#2a2c36';
var gray =          '#55595c';
var grayLight =     '#818a91';
var grayLighter =   '#d1d4d7';
var grayLightest =  '#f8f9fa';

angular
.module('app', [
  'ui.router',
  'oc.lazyLoad',
  'ncy-angular-breadcrumb',
  'angular-loading-bar'
])
.config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider) {
  cfpLoadingBarProvider.includeSpinner = false;
  cfpLoadingBarProvider.latencyThreshold = 1;
}])
.run(['$rootScope', '$state', '$stateParams', function($rootScope, $state, $stateParams) {
  $rootScope.$on('$stateChangeSuccess',function(){
    document.body.scrollTop = document.documentElement.scrollTop = 0;
  });
  $rootScope.$state = $state;
  return $rootScope.$stateParams = $stateParams;
}])
.run(function($rootScope, $timeout, $location) {
  var route = $location.path();
  if(route != '/department' && route != '/agents' && route != '/cashiers' && route != '/service-details' &&  route != '/transactions'){
    sessionStorage.removeItem('departmentID');
    sessionStorage.removeItem('agentID');
  }
  function strrev(s){
      s = s+"";
      return s.split("").reverse().join("");
  };

  $rootScope.dateFormater = function(str){
    var dt = new Date(str*1000);
    formatted = dt.toDateString();
    var hours = dt.getHours();
    var minutes = dt.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;
    var strTime = hours + ':' + minutes + ':' +dt.getSeconds()+ ' ' + ampm;
    return formatted+" "+strTime;
  };
  $rootScope.fetchDistinct = function(data){
      var j = data;
      var summary = [];
      var userDatas = [];
      var start = 0;
      while (start < data.length){
          var obj = data[start];
          var searchresult = findInArray(obj,summary);
          if(searchresult[0]){
              userDatas[searchresult[1]].push(obj);
              summary[searchresult[1]].amount = parseInt(summary[searchresult[1]].amount) + parseInt(obj.amount);
              summary[searchresult[1]].tcount += 1;
          }else{
              obj.tcount = 1;
              summary.push(obj);
              var nArr = [obj];
              userDatas.push(nArr);
          }
          start++;
      }
      return [summary, userDatas];
  }
  function findInArray(needle, arrayStack){
      found = false;
      var index = -1;
      for(counter=0; counter < arrayStack.length; counter++){
          if(needle.staffID === arrayStack[counter].staffID){
              index = counter;
              found = true;
              break;
          }
      }
      return [found, index];
  }
  $rootScope.pricer = function(pri,t){
      pri = pri+"";
      var sign = "";
      if(!parseInt(pri)){
          return t? "₦0" : "0";
      }
      if(parseInt(pri.substr(0,1))){

      }else{
          sign = pri.substr(0,1);
          pri = pri.substr(1,pri.length);
      }
      t = (arguments.length > 1)? t : false;
      r = strrev(pri);
      len = r.length;
      start = 0;
      nstr  = "";
      l = 0;
      iS = false;
      while (start < len){
          if(l == 2 && (start+1) < len){
              nstr = ","+r.substr(start,1)+nstr;
              iS = true;
          }else{
              nstr = r.substr(start,1)+nstr;
          }
          start++;
          if (!(iS)){
              l++;
          }else{
              l = 0;
              iS = false;
          }
      }
  return (t)? sign+" ₦"+nstr : sign+" "+nstr;
  };
  $rootScope.customMessage = function(){
      this.warning = function warning(message){
          return '<div style=\'padding:12px; opacity:.99\'><div style=\'color:#F48622; font-size:16px; background:#FBE9BD; border-left:#F48622 thick solid; width:50%; padding:15px; font-family:Helvetica Neue,Helvetica,Arial,sans-serif;\'><i class=\'fa fa-exclamation-circle\'></i> '+message+'</div></div>';
      }
      this.error = function(message){
          return '<div style=\'padding:12px;\'><div align=\'left\' style=\'color:#ED050B; opacity:.99;width:50%; font-size:15px; background:#F9B4B0; border-left:#ED050B thick solid; padding:15px; font-family:Helvetica Neue,Helvetica,Arial,sans-serif; \' ><i class=\'fa fa-warning\'></i> '+message+'</div></div>';
      }
      this.success = function(message){
          return '<div style=\'padding:12px;\'><div style=\'color:#2B8E11; width:50%; opacity:.99; font-size:16px; background:#BCF8AD; border-left:#2B8E11 thick solid; padding:15px; font-family:Helvetica Neue,Helvetica,Arial,sans-serif;\'><i class=\'fa fa-check-square-o\'></i> '+message+'</div></div>';
      }
  };
  $rootScope.mCra = function(message){
      document.getElementById("stow").style.display = "block";
      document.getElementById("stow").innerHTML = message;
      document.getElementById("stow").opacity = 1;
      clearMessage();
  };
  delay = 4;
  function clearMessage(){
      var timer;
      if(delay === 0){
        $timeout.cancel(timer);
          delay = 4;
          $("#stow").fadeOut(100, function(){
              $("#stow").html('');
          });
      }
      else{
          delay--;
          timer = $timeout(function(){clearMessage();},1000);
      }
  };
  $rootScope.validate = function(){
    if(localStorage.getItem("pd")){
      return true;
    }else{
      return false;
    }
  };
  $rootScope.getHeader = function(type){
    if(type == 0){
      var data = {
        method: 'POST',
              headers : {
                  'Content-Type': 'application/json;'
         }
      };
      return data;
    }else{
      if(!localStorage.getItem("pd")){
        return null;
      }else{
        try{
          var profile = JSON.parse(localStorage.getItem("pd"));
          var data = {
            headers : {
              "username" : profile.username,
              "publicKey" : profile.publicKey
            }            
          }
          return data;
        }catch(e){
          return null;
        }
      }
    }
  }
  $rootScope.cred = function(){
    try{
      var profile = JSON.parse(localStorage.getItem("pd"));
      var data = {
        "username" : profile.username,
        "publicKey" : profile.publicKey
      }
      return data;
    }catch(e){
      return null;
    }
  }
})
.factory('UserService', function() {
return {
//apiRoot : 'http://localhost/healthTouch/public/api/',
apiRoot : 'http://localhost/royalty/fmcg/public/api/',
//apiRoot : 'http://apis.touchandpay.me/HMS/public/api/',
//webroot: 'http://localhost/fpanda/fpanda/'
//webroot: 'http://192.168.4.237/healthTouch/public/api/',
//webroot: 'http://172.16.1.22:6500/fpanda/'
};
})
.directive('fileChange',['$parse', function($parse){
  return{
    require:'ngModel',
    restrict:'A',
    link:function($scope,element,attrs,ngModel){
      var attrHandler=$parse(attrs['fileChange']);
      var handler=function(e){
        $scope.$apply(function(){
          attrHandler($scope,{$event:e,files:e.target.files});
        });
      };
      element[0].addEventListener('change',handler,false);
    }
  }
}]);
