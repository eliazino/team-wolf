angular
.module('app')
.config(['$stateProvider', '$urlRouterProvider', '$ocLazyLoadProvider', '$breadcrumbProvider', function($stateProvider, $urlRouterProvider, $ocLazyLoadProvider, $breadcrumbProvider) {

  $urlRouterProvider.otherwise('/dashboard');

  $ocLazyLoadProvider.config({
    // Set to true if you want to see what and when is dynamically loaded
    debug: true
  });

  $breadcrumbProvider.setOptions({
    prefixStateName: 'app.main',
    includeAbstract: true,
    template: '<li class="breadcrumb-item" ng-repeat="step in steps" ng-class="{active: $last}" ng-switch="$last || !!step.abstract"><a ng-switch-when="false" href="{{step.ncyBreadcrumbLink}}">{{step.ncyBreadcrumbLabel}}</a><span ng-switch-when="true">{{step.ncyBreadcrumbLabel}}</span></li>'
  });

  $stateProvider
  .state('app', {
    abstract: true,
    templateUrl: 'views/common/layouts/full.html',
    //page title goes here
    ncyBreadcrumb: {
      label: 'Root',
      skip: true
    },
    resolve: {
      loadCSS: ['$ocLazyLoad', function($ocLazyLoad) {
        // you can lazy load CSS files
        return $ocLazyLoad.load([{
          serie: true,
          name: 'Flags',
          files: ['node_modules/flag-icon-css/css/flag-icon.min.css']
        },{
          serie: true,
          name: 'Font Awesome',
          files: ['node_modules/font-awesome/css/font-awesome.min.css']
        },{
          serie: true,
          name: 'Simple Line Icons',
          files: ['node_modules/simple-line-icons/css/simple-line-icons.css']
        }]);
      }],
      loadPlugin: ['$ocLazyLoad', function ($ocLazyLoad) {
        // you can lazy load files for an existing module
        return $ocLazyLoad.load([{
          serie: true,
          name: 'chart.js',
          files: [
            'node_modules/chart.js/dist/Chart.min.js',
            'node_modules/angular-chart.js/dist/angular-chart.min.js'
          ]
        }]);
      }],
    }
  })
  .state('app.main', {
    url: '/dashboard',
    templateUrl: 'views/main.html',
    //page title goes here
    ncyBreadcrumb: {
      label: 'Home',
    },
    //page subtitle goes here
    params: { subtitle: 'Welcome to ROOT powerfull Bootstrap & AngularJS UI Kit' },
    resolve: {
      loadPlugin: ['$ocLazyLoad', function ($ocLazyLoad) {
        // you can lazy load files for an existing module
        return $ocLazyLoad.load([
          {
            serie: true,
            name: 'chart.js',
            files: [
              'node_modules/chart.js/dist/Chart.min.js',
              'node_modules/angular-chart.js/dist/angular-chart.min.js'
            ]
          },
        ]);
      }],
      loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
        // you can lazy load controllers
        return $ocLazyLoad.load({
          files: ['js/controllers/main.js']
        });
      }]
    }
  })
  .state('appSimple', {
    abstract: true,
    templateUrl: 'views/common/layouts/simple.html',
    resolve: {
      loadCSS: ['$ocLazyLoad', function($ocLazyLoad) {
        // you can lazy load CSS files
        return $ocLazyLoad.load([{
          serie: true,
          name: 'Font Awesome',
          files: ['node_modules/font-awesome/css/font-awesome.min.css']
        },{
          serie: true,
          name: 'Simple Line Icons',
          files: ['node_modules/simple-line-icons/css/simple-line-icons.css']
        }]);
      }],
    }
  })
  // Additional Pages
  .state('appSimple.login', {
    url: '/login',
    templateUrl: 'views/pages/login.html',
    controller: 'loginCtrl',
    resolve: {
      deps: ['$ocLazyLoad', function ($ocLazyLoad) {
        return $ocLazyLoad.load([
          {
            serie: true,
            files: [          
              'plugins/select2/select2.css'
            ]
                  }]).then(function () {
          return $ocLazyLoad.load('js/controllers/sessions.js');
        });
              }]
    },
    data: {
      title: 'Sign In',
    }
  })
  
  .state('appSimple.register', {
    url: '/register',
    templateUrl: 'views/pages/register.html',
    controller: 'registerCtrl',
    resolve: {
      deps: ['$ocLazyLoad', function ($ocLazyLoad) {
        return $ocLazyLoad.load([
          {
            serie: true,
            files: [          
              'plugins/select2/select2.css'
            ]
                  }]).then(function () {
          return $ocLazyLoad.load('js/controllers/sessions.js');
        });
              }]
    },
    data: {
      title: 'Sign In',
    }
  })
  /*.state('app.logout', {
    url: '/500',
    templateUrl: 'views/pages/500.html',
    controller : 'logoutCtrl',
      loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
        // you can lazy load controllers
        return $ocLazyLoad.load({
          files: ['js/controllers/session.js']
        });
      }]
  })*/
  .state('appSimple.404', {
    url: '/404',
    templateUrl: 'views/pages/404.html'
  })
  .state('appSimple.500', {
    url: '/500',
    templateUrl: 'views/pages/500.html'
  })
  /*.state('app.departments', {
    url: '/departments',
    templateUrl: 'views/pages/departments.html',
    ncyBreadcrumb: {
      label: 'Department',
      loadMyCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
        // you can lazy load controllers
        return $ocLazyLoad.load({
          files: ['js/controllers/departments.js']
        });
      }]
    },
   // controller : 'departmentCtrl',
    //page subtitle goes here
    params: { subtitle: 'Departments' },
    resolve: {
      loadPlugin: ['$ocLazyLoad', function ($ocLazyLoad) {
        // you can lazy load files for an existing module
        return $ocLazyLoad.load([
          {
            serie: true,
            name: 'chart.js',
            files: [              
              'vendors/datatables/media/js/jquery.dataTables.js',
              'plugins/extentions/bootstrap-datatables.js',
              'vendors/datatables/media/css/jquery.dataTables.css',
              'plugins/js2/angular-datatable.js',            
              'plugins/select2/select2.js',
              'plugins/select2/select2.css'
            ]
          },
        ]);
      }]
    }
  })*/
  .state('app.logout', {
    url: '/signin',
    //templateUrl: 'views/pages/login.html',
    controller: 'logoutCtrl',
    resolve: {
      deps: ['$ocLazyLoad', function ($ocLazyLoad) {
        return $ocLazyLoad.load([
          {
            serie: true,
            files: [          
              'plugins/select2/select2.css'
            ]
                  }]).then(function () {
          return $ocLazyLoad.load('js/controllers/sessions.js');
        });
              }]
    },
    data: {
      title: 'Sign In',
    }
  })
  .state('app.departments', {
    url: '/products',
    templateUrl: 'views/pages/departments.html',
    ncyBreadcrumb: {
      label: 'Products'
    },
    resolve: {
      deps: ['$ocLazyLoad', function ($ocLazyLoad) {
        return $ocLazyLoad.load([
          {
            serie: true,
            files: [              
              'vendors/datatables/media/js/jquery.dataTables.js',
              'plugins/extentions/bootstrap-datatables.js',
              'vendors/datatables/media/css/jquery.dataTables.css',
              'plugins/js2/angular-datatable.js',            
              'plugins/select2/select2.js',
              'plugins/select2/select2.css'
            ]
                  }]).then(function () {
          return $ocLazyLoad.load('js/controllers/departments.js');
        });
              }]
    },
    data: {
      title: 'Products',
    }
  })
  .state('app.services', {
    url: '/Distributors',
    templateUrl: 'views/pages/services.html',
    ncyBreadcrumb: {
      label: 'Distributors'
    },
    resolve: {
      deps: ['$ocLazyLoad', function ($ocLazyLoad) {
        return $ocLazyLoad.load([
          {
            serie: true,
            files: [              
              'vendors/datatables/media/js/jquery.dataTables.js',
              'plugins/extentions/bootstrap-datatables.js',
              'vendors/datatables/media/css/jquery.dataTables.css',
              'plugins/js2/angular-datatable.js',            
              'plugins/select2/select2.js',
              'plugins/select2/select2.css'
            ]
                  }]).then(function () {
          return $ocLazyLoad.load('js/controllers/services.js');
        });
              }]
    },
    data: {
      title: 'Distributors',
    }
  })
  .state('app.agents', {
    url: '/retailers',
    templateUrl: 'views/pages/agents.html',
    ncyBreadcrumb: {
      label: 'Retailers'
    },
    resolve: {
      deps: ['$ocLazyLoad', function ($ocLazyLoad) {
        return $ocLazyLoad.load([
          {
            serie: true,
            files: [              
              'vendors/datatables/media/js/jquery.dataTables.js',
              'plugins/extentions/bootstrap-datatables.js',
              'vendors/datatables/media/css/jquery.dataTables.css',
              'plugins/js2/angular-datatable.js',            
              'plugins/select2/select2.js',
              'plugins/select2/select2.css'
            ]
                  }]).then(function () {
          return $ocLazyLoad.load('js/controllers/agents.js');
        });
              }]
    },
    data: {
      title: 'Services',
    }
  })
  .state('app.cashiers', {
    url: '/cashiers',
    templateUrl: 'views/pages/cashiers.html',
    ncyBreadcrumb: {
      label: 'Cashiers'
    },
    resolve: {
      deps: ['$ocLazyLoad', function ($ocLazyLoad) {
        return $ocLazyLoad.load([
          {
            serie: true,
            files: [              
              'vendors/datatables/media/js/jquery.dataTables.js',
              'plugins/extentions/bootstrap-datatables.js',
              'vendors/datatables/media/css/jquery.dataTables.css',
              'plugins/js2/angular-datatable.js',            
              'plugins/select2/select2.js',
              'plugins/select2/select2.css'
            ]
                  }]).then(function () {
          return $ocLazyLoad.load('js/controllers/cashiers.js');
        });
              }]
    },
    data: {
      title: 'Cashier',
    }
  })
  .state('app.cashiersprofile', {
    url: '/cashier-profile',
    templateUrl: 'views/pages/cashier-profile.html',
    ncyBreadcrumb: {
      label: 'Cashier Profile'
    },
    resolve: {
      deps: ['$ocLazyLoad', function ($ocLazyLoad) {
        return $ocLazyLoad.load([
          {
            serie: true,
            files: [              
              'vendors/datatables/media/js/jquery.dataTables.js',
              'plugins/extentions/bootstrap-datatables.js',
              'vendors/datatables/media/css/jquery.dataTables.css',
              'plugins/js2/angular-datatable.js',            
              'plugins/select2/select2.js',
              'plugins/select2/select2.css'
            ]
                  }]).then(function () {
          return $ocLazyLoad.load('js/controllers/cashier-profile.js');
        });
              }]
    },
    data: {
      title: 'Cashier-Profile',
    }
  })
  .state('app.service-details', {
    url: '/service-details',
    templateUrl: 'views/pages/service-details.html',
    ncyBreadcrumb: {
      label: 'Department Services'
    },
    resolve: {
      deps: ['$ocLazyLoad', function ($ocLazyLoad) {
        return $ocLazyLoad.load([
          {
            serie: true,
            files: [              
              'vendors/datatables/media/js/jquery.dataTables.js',
              'plugins/extentions/bootstrap-datatables.js',
              'vendors/datatables/media/css/jquery.dataTables.css',
              'plugins/js2/angular-datatable.js',            
              'plugins/select2/select2.js',
              'plugins/select2/select2.css'
            ]
                  }]).then(function () {
          return $ocLazyLoad.load('js/controllers/service-details.js');
        });
              }]
    },
    data: {
      title: 'Cashier-Profile',
    }
  })
  .state('app.patients', {
    url: '/patients',
    templateUrl: 'views/pages/patients.html',
    ncyBreadcrumb: {
      label: 'Patients'
    },
    resolve: {
      deps: ['$ocLazyLoad', function ($ocLazyLoad) {
        return $ocLazyLoad.load([
          {
            serie: true,
            files: [              
              'vendors/datatables/media/js/jquery.dataTables.js',
              'plugins/extentions/bootstrap-datatables.js',
              'vendors/datatables/media/css/jquery.dataTables.css',
              'plugins/js2/angular-datatable.js',            
              'plugins/select2/select2.js',
              'plugins/select2/select2.css'
            ]
                  }]).then(function () {
          return $ocLazyLoad.load('js/controllers/patients.js');
        });
              }]
    },
    data: {
      title: 'Patients',
    }
  })
  .state('app.cards', {
    url: '/cards',
    templateUrl: 'views/pages/cards.html',
    ncyBreadcrumb: {
      label: 'Cards'
    },
    resolve: {
      deps: ['$ocLazyLoad', function ($ocLazyLoad) {
        return $ocLazyLoad.load([
          {
            serie: true,
            files: [              
              'vendors/datatables/media/js/jquery.dataTables.js',
              'plugins/extentions/bootstrap-datatables.js',
              'vendors/datatables/media/css/jquery.dataTables.css',
              'plugins/js2/angular-datatable.js',            
              'plugins/select2/select2.js',
              'plugins/select2/select2.css'
            ]
                  }]).then(function () {
          return $ocLazyLoad.load('js/controllers/cards.js');
        });
              }]
    },
    data: {
      title: 'Cards',
    }
  })
  .state('app.topups', {
    url: '/topup',
    templateUrl: 'views/pages/topups.html',
    ncyBreadcrumb: {
      label: 'TopUp'
    },
    resolve: {
      deps: ['$ocLazyLoad', function ($ocLazyLoad) {
        return $ocLazyLoad.load([
          {
            serie: true,
            files: [              
              'vendors/datatables/media/js/jquery.dataTables.js',
              'plugins/extentions/bootstrap-datatables.js',
              'vendors/datatables/media/css/jquery.dataTables.css',
              'plugins/js2/angular-datatable.js',            
              'plugins/select2/select2.js',
              'plugins/select2/select2.css'
            ]
                  }]).then(function () {
          return $ocLazyLoad.load('js/controllers/topups.js');
        });
              }]
    },
    data: {
      title: 'topups',
    }
  })
  .state('app.devices', {
    url: '/devices',
    templateUrl: 'views/pages/devices.html',
    ncyBreadcrumb: {
      label: 'Devices'
    },
    resolve: {
      deps: ['$ocLazyLoad', function ($ocLazyLoad) {
        return $ocLazyLoad.load([
          {
            serie: true,
            files: [              
              'vendors/datatables/media/js/jquery.dataTables.js',
              'plugins/extentions/bootstrap-datatables.js',
              'vendors/datatables/media/css/jquery.dataTables.css',
              'plugins/js2/angular-datatable.js',            
              'plugins/select2/select2.js',
              'plugins/select2/select2.css'
            ]
                  }]).then(function () {
          return $ocLazyLoad.load('js/controllers/devices.js');
        });
              }]
    },
    data: {
      title: 'devices',
    }
  })
  .state('app.activitylogs', {
    url: '/logs',
    templateUrl: 'views/pages/logs.html',
    ncyBreadcrumb: {
      label: 'Logs'
    },
    resolve: {
      deps: ['$ocLazyLoad', function ($ocLazyLoad) {
        return $ocLazyLoad.load([
          {
            serie: true,
            files: [              
              'vendors/datatables/media/js/jquery.dataTables.js',
              'plugins/extentions/bootstrap-datatables.js',
              'vendors/datatables/media/css/jquery.dataTables.css',
              'plugins/js2/angular-datatable.js',            
              'plugins/select2/select2.js',
              'plugins/select2/select2.css'
            ]
                  }]).then(function () {
          return $ocLazyLoad.load('js/controllers/logs.js');
        });
              }]
    },
    data: {
      title: 'logs',
    }
  })
  .state('app.admin', {
    url: '/admin',
    templateUrl: 'views/pages/admin.html',
    ncyBreadcrumb: {
      label: 'Admin Page'
    },
    resolve: {
      deps: ['$ocLazyLoad', function ($ocLazyLoad) {
        return $ocLazyLoad.load([
          {
            serie: true,
            files: [              
              'vendors/datatables/media/js/jquery.dataTables.js',
              'plugins/extentions/bootstrap-datatables.js',
              'vendors/datatables/media/css/jquery.dataTables.css',
              'plugins/js2/angular-datatable.js',            
              'plugins/select2/select2.js',
              'plugins/select2/select2.css'
            ]
                  }]).then(function () {
          return $ocLazyLoad.load('js/controllers/admin.js');
        });
              }]
    },
    data: {
      title: 'admin',
    }
  })
  .state('app.transactions', {
    url: '/transactions',
    templateUrl: 'views/pages/transactions.html',
    ncyBreadcrumb: {
      label: 'Transactions'
    },
    resolve: {
      deps: ['$ocLazyLoad', function ($ocLazyLoad) {
        return $ocLazyLoad.load([
          {
            serie: true,
            files: [              
              'vendors/datatables/media/js/jquery.dataTables.js',
              'plugins/extentions/bootstrap-datatables.js',
              'vendors/datatables/media/css/jquery.dataTables.css',
              'plugins/js2/angular-datatable.js',            
              'plugins/select2/select2.js',
              'plugins/select2/select2.css'
            ]
                  }]).then(function () {
          return $ocLazyLoad.load('js/controllers/transactions.js');
        });
              }]
    },
    data: {
      title: 'transactions',
    }
  })
}]);
