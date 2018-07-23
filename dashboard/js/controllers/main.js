//main.js
angular
.module('app')
.controller('cardChartCtrl1', cardChartCtrl1)
.controller('cardChartCtrl2', cardChartCtrl2)
.controller('cardChartCtrl3', cardChartCtrl3)
.controller('cardChartCtrl4', cardChartCtrl4)
.controller('trafficDemoCtrl', trafficDemoCtrl)
/*.controller('socialBoxCtrl', socialBoxCtrl)
.controller('sparklineChartCtrl', sparklineChartCtrl)
.controller('barChartCtrl', barChartCtrl)
.controller('horizontalBarsCtrl', horizontalBarsCtrl)
.controller('horizontalBarsType2Ctrl', horizontalBarsType2Ctrl)
.controller('usersTableCtrl', usersTableCtrl)*/
.controller('overrideAll', overrideAll);

//convert Hex to RGBA
function convertHex(hex,opacity){
  hex = hex.replace('#','');
  r = parseInt(hex.substring(0,2), 16);
  g = parseInt(hex.substring(2,4), 16);
  b = parseInt(hex.substring(4,6), 16);

  result = 'rgba('+r+','+g+','+b+','+opacity/100+')';
  return result;
}


overrideAll.$inject = ['$scope', '$location', '$http', '$state', 'UserService', '$rootScope', '$timeout'];
function overrideAll($scope, $location, $http, $state, UserService, $rootScope, $timeout){
  var custom = new $rootScope.customMessage();
  $scope.labels = ['January','February','March','April','May','June','July', 'August', 'September', 'Octomber', 'November', 'December'];
  $scope.colors = [{
    backgroundColor: brandPrimary,
    borderColor: 'rgba(255,255,255,.55)',
  }];
  function getOptions(data){
    options = {
      maintainAspectRatio: false,
      scales: {
        xAxes: [{
          gridLines: {
            color: 'transparent',
            zeroLineColor: 'transparent'
          },
          ticks: {
            fontSize: 2,
            fontColor: 'transparent',
          }
  
        }],
        yAxes: [{
          display: false,
          ticks: {
            display: false,
            min: Math.min.apply(Math, data) - 5,
            max: Math.max.apply(Math, data) + 5,
          }
        }],
      },
      elements: {
        line: {
          borderWidth: 1
        },
        point: {
          radius: 4,
          hitRadius: 10,
          hoverRadius: 4,
        },
      },
    };
    return options;
  }
  var states = ["NG-AB", "NG-AD", "NG-AK", "NG-AN", "NG-BA", "NG-BE", "NG-BO", "NG-BY", "NG-CR", "NG-DE", "NG-EB", "NG-ED", "NG-EK", "NG-EN", "NG-FC", "NG-GO", "NG-IM", "NG-JI", "NG-KD", "NG-KE", "NG-KN", "NG-KO", "NG-KT", "NG-KW", "NG-LA", "NG-NA", "NG-NI", "NG-OG", "NG-ON", "NG-OS", "NG-OY", "NG-PL", "NG-RI", "NG-SO", "NG-TA", "NG-YO", "NG-ZA"];
        $scope.createDummyData = function () {
            var dataTemp = {};
            angular.forEach(states, function (state, key) {
                dataTemp[state] = {value: Math.random()}
            });
            $scope.dummyData = dataTemp;
        };
        //$scope.createDummyData();

        $scope.changeHoverRegion = function (region) {
            $scope.hoverRegion = region;
        };
  if($rootScope.validate()){
    $description = $(".description");

  $('.state').hover(function() {    
    $(this).attr("class", "enabled heyo");
    $description.addClass('active');
    $description.html($(this).attr('id'));
  }, function() {
    $description.removeClass('active');
  });

$(document).on('mousemove', function(e){  
  $description.css({
    left:  e.pageX,
    top:   e.pageY - 70
  });
  
});
    var config = $rootScope.getHeader(1);    
    var  url= UserService.apiRoot+'any/get/products';
      var data= {};
      config = $rootScope.getHeader(1);
      $http.get(url, config).then(function(response){
        if(response.data.error.status == 0){
            $scope.products = response.data.content.data;
        }else{}
        }, function(response){
    });
    url= UserService.apiRoot+'fmcg/get/dashboard/0/8695875786465364/-';
    $http.get(url, config).then(function(response){
      if(response.data.error.status == 0){
        var datas = response.data.content.data;
        var biggest = datas[0].torder;
        var dataTemp = {};
        $scope.scale = [];
        for(var i = 0; i < datas.length; i++){
          var calc = Math.round(parseInt(datas[i].torder)/parseInt(biggest) * 100) / 100;
          var distr = findIn(datas[i].code, response.data.content.distributors);
          var rets = findIn(datas[i].code, response.data.content.retailers);
          dataTemp[datas[i].code] = {value: calc, data:datas[i].torder+" Peices", distributors : distr.distCount, retailers : rets.retCount};
          //if(!in_array(calc, $scope.scale)) $scope.scale.push(calc);
        }
        for(var i = 0; i <= 1; i += 0.1){
          var obj = {};
          obj.value = i;
          obj.scale = Math.round((i/1)*biggest);
          $scope.scale.push(obj);
        }
        var retls = response.data.content.retailers;
        var distr = response.data.content.distributors;
        for(var i = 0; i < retls.length; i++){
           if(dataTemp[retls[i].code] == undefined){ 
                dataTemp[retls[i].code] = {value: 0, data:"Data unavailable", distributors : distr[i].distCount, retailers : retls[i].retCount};
               }else{
                 dataTemp[retls[i].code].distributors = distr[i].distCount;
                 dataTemp[retls[i].code].retailers = retls[i].retCount;
               }
            }
        $scope.dummyData = dataTemp;
      }
      }, function(response){
    });
    function findIn(needle, hay){
      for (var i = 0; i < hay.length; i++){
        if(needle == hay[i].code) return hay[i];
      }
      return false;
    }
    $scope.filterTransactions = function(){
      var ob = document.getElementById("filterOBJ");
      ob.innerHTML = "<i class='fa fa-spinner fa-spin'></i> Fetching";
      var fromDate = document.getElementById("fromDate").value == ""? "0" : new Date(document.getElementById("fromDate").value).valueOf()/1000;
      var toDate = document.getElementById("toDate").value == ""? "9999999999999999999" : new Date(document.getElementById("toDate").value).valueOf()/1000;
      var  url= UserService.apiRoot+'fmcg/get/dashboard/'+fromDate+'/'+toDate+'/'+$('#product').find(":selected").val();
      $http.get(url, config).then(function(response){
          if(response.data.error.status == 0){
            var datas = response.data.content.data;
            var biggest = datas[0].torder;
            var dataTemp = {};
            $scope.scale = [];
            for(var i = 0; i < datas.length; i++){
              var calc = Math.round(parseInt(datas[i].torder)/parseInt(biggest) * 100) / 100;
              //var distr = findIn(datas[i].code, response.data.content.distributors);
              //var rets = findIn(datas[i].code, response.data.content.retailers);
              dataTemp[datas[i].code] = {value: calc, data:datas[i].torder+" Peices"};
              //if(!in_array(calc, $scope.scale)) $scope.scale.push(calc);
            }
            for(var i = 0; i <= 1; i += 0.1){
              var obj = {};
              obj.value = i;
              obj.scale = Math.round((i/1)*biggest);
              $scope.scale.push(obj);
            }
            var retls = response.data.content.retailers;
            var distr = response.data.content.distributors;
            for(var i = 0; i < retls.length; i++){
              if(dataTemp[retls[i].code] == undefined){ 
                dataTemp[retls[i].code] = {value: 0, data:"Data unavailable", distributors : distr[i].distCount, retailers : retls[i].retCount};
               }else{
                 dataTemp[retls[i].code].distributors = distr[i].distCount;
                 dataTemp[retls[i].code].retailers = retls[i].retCount;
               }
            }
            $scope.dummyData = dataTemp;
            ob.innerHTML = '<i class="fa fa-filter"></i> Filter';
          }else{
              $rootScope.mCra(custom.error(response.data.error.message));
              ob.innerHTML = '<i class="fa fa-filter"></i> Filter';
           }
          }, function(response){
              ob.innerHTML = '<i class="fa fa-filter"></i> Filter';
      });
  }
  }else{
    $rootScope.mCra(custom.success("The Active login is Invalid. Login Again!"));
  }
  function userchart(data){
    data = completeData(data);
    $scope.options = getOptions(data);
    $scope.data = [
      data
    ];
  }
  function transactionchart(data){
    data = completeData(data);
    $scope.options01 = getOptions(data);
    $scope.data01 = [
      data
    ];
  }
  function topupdevicechart(data){
    data = completeData(data);
    $scope.options02 = getOptions(data);
    $scope.data02 = [
      data
    ];
  }
  function topupcardchart(data){
    data = completeData(data);
    $scope.options03 = getOptions(data);
    $scope.data03 = [
      data
    ];
  }
  function bigGraph(data, series, xval){
    $scope.labelsB = xval;
    $scope.seriesB = series;
    $scope.dataB = data;
    var max = Math.max.apply(null, [Math.max.apply(null, data[0]), Math.max.apply(null, data[1]), Math.max.apply(null, data[2])]);
    console.log(max);
    $scope.colorsB = [{
      backgroundColor: convertHex(brandInfo,10),
      borderColor: brandInfo,
      pointHoverBackgroundColor: '#fff'

    }, {
      backgroundColor: 'transparent',
      borderColor: brandSuccess,
      pointHoverBackgroundColor: '#fff'
    },{
      backgroundColor: 'transparent',
      borderColor: brandDanger,
      pointHoverBackgroundColor: '#fff',
      borderWidth: 1,
      borderDash: [8, 5]
    }];
    $scope.optionsB = {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        xAxes: [{
          gridLines: {
            drawOnChartArea: false,
          },
          ticks: {
            callback: function(value) {
              //console.log(value);
              return value;//value.charAt(0);
            }
          }
        }],
        yAxes: [{
          ticks: {
            beginAtZero: true,
            maxTicksLimit: 5,
            stepSize: Math.ceil(max / 5),
            max: max
          }
        }]
      },
      elements: {
        point: {
          radius: 0,
          hitRadius: 10,
          hoverRadius: 4,
          hoverBorderWidth: 3,
        }
      },
    }
  }
  function completeData(data){
    if(data.length < 12){
      data = data.concat(Array.apply(null, Array(12 - data.length)).map(Number.prototype.valueOf,0));
    }
    return data;
  }
}

cardChartCtrl1.$inject = ['$scope', '$location', '$http', '$state', 'UserService', '$rootScope', '$timeout'];
function cardChartCtrl1($scope, $location, $http, $state, UserService, $rootScope, $timeout) {
  /*$scope.labels = ['January','February','March','April','May','June','July', 'August', 'September', 'Octomber', 'November', 'December'];
  $scope.data = [
    [65, 59, 84, 84, 51, 55, 40, 0, 0, 0, 0, 0]
  ];
  $scope.colors = [{
    backgroundColor: brandPrimary,
    borderColor: 'rgba(255,255,255,.55)',
  }];
  $scope.options = {
    maintainAspectRatio: false,
    scales: {
      xAxes: [{
        gridLines: {
          color: 'transparent',
          zeroLineColor: 'transparent'
        },
        ticks: {
          fontSize: 2,
          fontColor: 'transparent',
        }

      }],
      yAxes: [{
        display: false,
        ticks: {
          display: false,
          min: Math.min.apply(Math, $scope.data[0]) - 5,
          max: Math.max.apply(Math, $scope.data[0]) + 5,
        }
      }],
    },
    elements: {
      line: {
        borderWidth: 1
      },
      point: {
        radius: 4,
        hitRadius: 10,
        hoverRadius: 4,
      },
    },
  }*/
}

cardChartCtrl2.$inject = ['$scope'];
function cardChartCtrl2($scope) {

 /* $scope.labels = ['January','February','March','April','May','June','July'];
  $scope.data = [
    [1, 18, 9, 17, 34, 22, 11]
  ];
  $scope.colors = [{
    backgroundColor: brandInfo,
    borderColor: 'rgba(255,255,255,.55)',
  }];
  $scope.options = {
    maintainAspectRatio: false,
    scales: {
      xAxes: [{
        gridLines: {
          color: 'transparent',
          zeroLineColor: 'transparent'
        },
        ticks: {
          fontSize: 2,
          fontColor: 'transparent',
        }

      }],
      yAxes: [{
        display: false,
        ticks: {
          display: false,
          min: Math.min.apply(Math, $scope.data[0]) - 5,
          max: Math.max.apply(Math, $scope.data[0]) + 5
        }
      }],
    },
    elements: {
      line: {
        tension: 0.00001,
        borderWidth: 1
      },
      point: {
        radius: 4,
        hitRadius: 10,
        hoverRadius: 4,
      },

    },
  }*/
}

cardChartCtrl3.$inject = ['$scope'];
function cardChartCtrl3($scope) {

 /* $scope.labels = ['January','February','March','April','May','June','July'];
  $scope.data = [
    [78, 81, 80, 45, 34, 12, 40]
  ];
  $scope.data4 = [
    [35, 23, 56, 22, 97, 23, 64]
  ];
  $scope.colors = [{
    backgroundColor: 'rgba(255,255,255,.2)',
    borderColor: 'rgba(255,255,255,.55)',
  }];
  $scope.options = {
    maintainAspectRatio: false,
    scales: {
      xAxes: [{
        display: false
      }],
      yAxes: [{
        display: false
      }]
    },
    elements: {
      line: {
        borderWidth: 2
      },
      point: {
        radius: 0,
        hitRadius: 10,
        hoverRadius: 4,
      },
    },
  }*/
}

function random(min,max) {
  return Math.floor(Math.random()*(max-min+1)+min);
}

cardChartCtrl4.$inject = ['$scope'];
function cardChartCtrl4($scope) {

  /*var elements = 16;
  var labels = [];
  var data = [];
  //
  for (var i = 2000; i <= 2000 + elements; i++) {
    labels.push(i);
    data.push(random(40,100));
  }

  $scope.labels = labels;

  $scope.data = [data];

  $scope.colors = [{
    backgroundColor: 'rgba(255,255,255,.3)',
    borderWidth: 0
  }];
  $scope.options = {
    maintainAspectRatio: false,
    scales: {
      xAxes: [{
        display: false,
        barPercentage: 0.6,
      }],
      yAxes: [{
        display: false
      }]
    },
  }*/
}

trafficDemoCtrl.$inject = ['$scope'];
function trafficDemoCtrl($scope){

  function random(min,max) {
    return Math.floor(Math.random()*(max-min+1)+min);
  }

  var elements = 27;
  var data1 = [];
  var data2 = [];
  var data3 = [];

  for (var i = 0; i <= elements; i++) {
    data1.push(random(50,200));
    data2.push(random(80,100));
    data3.push(65);
  }

  $scope.labels = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'Monday', 'Thursday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  $scope.series = ['Current', 'Previous', 'BEP'];
  $scope.data = [ data1, data2, data3];
  $scope.colors = [{
    backgroundColor: convertHex(brandInfo,10),
    borderColor: brandInfo,
    pointHoverBackgroundColor: '#fff'

  }, {
    backgroundColor: 'transparent',
    borderColor: brandSuccess,
    pointHoverBackgroundColor: '#fff'
  },{
    backgroundColor: 'transparent',
    borderColor: brandDanger,
    pointHoverBackgroundColor: '#fff',
    borderWidth: 1,
    borderDash: [8, 5]
  }];
  $scope.options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      xAxes: [{
        gridLines: {
          drawOnChartArea: false,
        },
        ticks: {
          callback: function(value) {
            return value;//value.charAt(0);
          }
        }
      }],
      yAxes: [{
        ticks: {
          beginAtZero: true,
          maxTicksLimit: 5,
          stepSize: Math.ceil(250 / 5),
          max: 250
        }
      }]
    },
    elements: {
      point: {
        radius: 0,
        hitRadius: 10,
        hoverRadius: 4,
        hoverBorderWidth: 3,
      }
    },
  }
}

dateRangeCtrl.$inject = ['$scope'];
function dateRangeCtrl($scope) {
  $scope.date = {
    startDate: moment().subtract(5, 'days'),
    endDate: moment()
  };
  $scope.opts = {
    drops: 'down',
    opens: 'left',
    ranges: {
      'Today': [moment(), moment()],
      'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
      'Last 7 days': [moment().subtract(7, 'days'), moment()],
      'Last 30 days': [moment().subtract(30, 'days'), moment()],
      'This month': [moment().startOf('month'), moment().endOf('month')]
    }
  };

  //Watch for date changes
  $scope.$watch('date', function(newDate) {
    //console.log('New date set: ', newDate);
  }, false);

  function gd(year, month, day) {
    return new Date(year, month - 1, day).getTime();
  }
}
/*
socialBoxCtrl.$inject = ['$scope'];
function socialBoxCtrl($scope) {

  $scope.labels = ['January','February','March','April','May','June','July'];
  $scope.data1 = [
    [65, 59, 84, 84, 51, 55, 40]
  ];
  $scope.data2 = [
    [1, 13, 9, 17, 34, 41, 38]
  ];
  $scope.data3 = [
    [78, 81, 80, 45, 34, 12, 40]
  ];
  $scope.data4 = [
    [35, 23, 56, 22, 97, 23, 64]
  ];
  $scope.colors = [{
    backgroundColor: 'rgba(255,255,255,.1)',
    borderColor: 'rgba(255,255,255,.55)',
    pointHoverBackgroundColor: '#fff'
  }];
  $scope.options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      xAxes: [{
        display:false,
      }],
      yAxes: [{
        display:false,
      }]
    },
    elements: {
      point: {
        radius: 0,
        hitRadius: 10,
        hoverRadius: 4,
        hoverBorderWidth: 3,
      }
    },
  }
}

sparklineChartCtrl.$inject = ['$scope'];
function sparklineChartCtrl($scope) {
  $scope.labels = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
  $scope.data1 = [
    [65, 59, 84, 84, 51, 55, 40]
  ];
  $scope.data2 = [
    [1, 13, 9, 17, 34, 41, 38]
  ];
  $scope.data3 = [
    [78, 81, 80, 45, 34, 12, 40]
  ];
  $scope.data4 = [
    [35, 23, 56, 22, 97, 23, 64]
  ];
  $scope.default = [{
    backgroundColor: 'transparent',
    borderColor: '#d1d4d7',
  }];
  $scope.primary = [{
    backgroundColor: 'transparent',
    borderColor: brandPrimary,
  }];
  $scope.info = [{
    backgroundColor: 'transparent',
    borderColor: brandInfo,
  }];
  $scope.danger = [{
    backgroundColor: 'transparent',
    borderColor: brandDanger,
  }];
  $scope.warning = [{
    backgroundColor: 'transparent',
    borderColor: brandWarning,
  }];
  $scope.success = [{
    backgroundColor: 'transparent',
    borderColor: brandSuccess,
  }];
  $scope.options = {
    scales: {
      xAxes: [{
        display:false,
      }],
      yAxes: [{
        display:false,
      }]
    },
    elements: {
      point: {
        radius: 0,
        hitRadius: 10,
        hoverRadius: 4,
        hoverBorderWidth: 3,
      }
    },
  }
}

horizontalBarsCtrl.$inject = ['$scope'];
function horizontalBarsCtrl($scope) {

  $scope.data = [
    {
      day: 'Monday',    new: 34, recurring: 78
    },
    {
      day: 'Tuesday',   new: 56, recurring: 94
    },
    {
      day: 'Wednesday', new: 12, recurring: 67
    },
    {
      day: 'Thursday',  new: 43, recurring: 91
    },
    {
      day: 'Friday',    new: 22, recurring: 73
    },
    {
      day: 'Saturday',  new: 53, recurring: 82
    },
    {
      day: 'Sunday',    new: 9,  recurring: 69
    }
  ];
}

horizontalBarsType2Ctrl.$inject = ['$scope'];
function horizontalBarsType2Ctrl($scope) {

  $scope.gender = [
    {
      title: 'Male',
      icon: 'icon-user',
      value: 43
    },
    {
      title: 'Female',
      icon: 'icon-user-female',
      value: 37
    },
  ];

  $scope.source = [
    {
      title: 'Organic Search',
      icon: 'icon-globe',
      value: 191235,
      percent: 56
    },
    {
      title: 'Facebook',
      icon: 'icon-social-facebook',
      value: 51223,
      percent: 15
    },
    {
      title: 'Twitter',
      icon: 'icon-social-twitter',
      value: 37564,
      percent: 11
    },
    {
      title: 'LinkedIn',
      icon: 'icon-social-linkedin',
      value: 27319,
      percent: 8
    }
  ];
}

usersTableCtrl.$inject = ['$scope', '$timeout'];
function usersTableCtrl($scope, $timeout) {

  $scope.users = [
    {
      avatar: '1.jpg',
      status: 'active',
      name: 'Yiorgos Avraamu',
      new: true,
      registered: 'Jan 1, 2015',
      country: 'USA',
      flag: 'us',
      usage: '50',
      period: 'Jun 11, 2015 - Jul 10, 2015',
      payment: 'mastercard',
      activity: '10 sec ago',
      satisfaction: '48'
    },
    {
      avatar: '2.jpg',
      status: 'busy',
      name: 'Avram Tarasios',
      new: false,
      registered: 'Jan 1, 2015',
      country: 'Brazil',
      flag: 'br',
      usage: '10',
      period: 'Jun 11, 2015 - Jul 10, 2015',
      payment: 'visa',
      activity: '5 minutes ago',
      satisfaction: '61'
    },
    {
      avatar: '3.jpg',
      status: 'away',
      name: 'Quintin Ed',
      new: true,
      registered: 'Jan 1, 2015',
      country: 'India',
      flag: 'in',
      usage: '74',
      period: 'Jun 11, 2015 - Jul 10, 2015',
      payment: 'stripe',
      activity: '1 hour ago',
      satisfaction: '33'
    },
    {
      avatar: '4.jpg',
      status: 'offline',
      name: 'Enéas Kwadwo',
      new: true,
      registered: 'Jan 1, 2015',
      country: 'France',
      flag: 'fr',
      usage: '98',
      period: 'Jun 11, 2015 - Jul 10, 2015',
      payment: 'paypal',
      activity: 'Last month',
      satisfaction: '23'
    },
    {
      avatar: '5.jpg',
      status: 'active',
      name: 'Agapetus Tadeáš',
      new: true,
      registered: 'Jan 1, 2015',
      country: 'Spain',
      flag: 'es',
      usage: '22',
      period: 'Jun 11, 2015 - Jul 10, 2015',
      payment: 'google',
      activity: 'Last week',
      satisfaction: '78'
    },
    {
      avatar: '6.jpg',
      status: 'busy',
      name: 'Friderik Dávid',
      new: true,
      registered: 'Jan 1, 2015',
      country: 'Poland',
      flag: 'pl',
      usage: '43',
      period: 'Jun 11, 2015 - Jul 10, 2015',
      payment: 'amex',
      activity: 'Yesterday',
      satisfaction: '11'
    }
  ]
}

clientsTableCtrl.$inject = ['$scope', '$timeout'];
function clientsTableCtrl($scope, $timeout) {

  $scope.users = [
    {
      avatar: '1.jpg',
      status: 'active',
      name: 'Yiorgos Avraamu',
      registered: 'Jan 1, 2015',
      activity: '10 sec ago',
      transactions: 189,
      comments: 72
    },
    {
      avatar: '2.jpg',
      status: 'busy',
      name: 'Avram Tarasios',
      registered: 'Jan 1, 2015',
      activity: '5 minutes ago',
      transactions: 156,
      comments: 76
    },
    {
      avatar: '3.jpg',
      status: 'away',
      name: 'Quintin Ed',
      registered: 'Jan 1, 2015',
      activity: '1 hour ago',
      transactions: 189,
      comments: 72
    },
    {
      avatar: '4.jpg',
      status: 'offline',
      name: 'Enéas Kwadwo',
      registered: 'Jan 1, 2015',
      activity: 'Last month',
      transactions: 189,
      comments: 72
    },
    {
      avatar: '5.jpg',
      status: 'active',
      name: 'Agapetus Tadeáš',
      registered: 'Jan 1, 2015',
      activity: 'Last week',
      transactions: 189,
      comments: 72
    },
    {
      avatar: '6.jpg',
      status: 'busy',
      name: 'Friderik Dávid',
      registered: 'Jan 1, 2015',
      activity: 'Yesterday',
      transactions: 189,
      comments: 72
    }
  ]
}

function random(min,max) {
  return Math.floor(Math.random()*(max-min+1)+min);
}

barChartCtrl.$inject = ['$scope'];
function barChartCtrl($scope) {

  var elements = 16;
  var labels = [];
  var data = [];
  var data1 = [];
  var data2 = [];

  for (var i = 0; i <= elements; i++) {
    labels.push('1');
    data.push(random(40,100));
    data1.push(random(20,100));
    data2.push(random(60,100));
  }

  $scope.labels = labels;

  $scope.data = [data];
  $scope.data1 = [data1];
  $scope.data2 = [data2];

  $scope.options = {
    showScale: false,
    scaleFontSize: 0,
    scaleShowGridLines: false,
    barStrokeWidth : 0,
    barBackground: 'rgba(221, 224, 229, 1)',

    // pointDot :false,
    // scaleLineColor: 'transparent',
  };

  $scope.colors = [{
    backgroundColor : brandInfo,
    borderColor : 'rgba(0,0,0,1)',
    highlightFill: '#818a91',
    pointborderColor: '#000'
  }];
}
*/
