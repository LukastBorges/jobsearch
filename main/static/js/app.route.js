(function() {
  JobAPP.config(config);

  function config($routeProvider) {
    $routeProvider
      .when('/jobs', {
        templateUrl: 'templates/jobs.html'
      })
      .when('/job/:id', {
        templateUrl: 'templates/job.html',
        controller: 'JobCtrl as vm'
      })
      .when('/addjob', {
        templateUrl: 'templates/addjob.html',
        controller: 'AddJobCtrl as vm'
      })
      .otherwise({
        redirectTo: '/jobs'
      });
  }
}());
