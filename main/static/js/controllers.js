JobAPP.controller("HomeCtrl", ["$log", "jobsService", "moment", "$location", homeCtrl])
  .controller("JobCtrl", ["$log", "jobsService", "moment", "$routeParams", jobCtrl])
  .controller("AddJobCtrl", ["$log", "jobsService", "$routeParams", addJobCtrl]);

function homeCtrl($log, jobsService, moment, $location) {
  var vm = this;
  vm.jobDesc = "";
  vm.loc = "";
  vm.jobList = [];
  vm.ready = false;
  vm.moment = moment;

  vm.page = 0;
  vm.hasNextPage = false;
  vm.hasPreviousPage = false;
  vm.previousPageUrl = "";
  vm.nextPageUrl = "";
  vm.previousPageData = [];
  vm.nextPageData = [];



  vm.search = function() {
    jobsService.requestJobs(vm.jobDesc, vm.loc, vm.page).then(function(response){
      vm.jobList = response.list;
      vm.ready = true;
      vm.checkNextPage();
      location.href = "#/jobs/";
    });
  }

  vm.search();

  vm.handleEnter = function($event, job) {
    if ($event.which === 13)
      vm.loadJob(job);
  }

  vm.loadJob = function (the_job) {
    location.href = "#/job/" + the_job.id;
  }

  vm.checkNextPage = function() {
    vm.hasNextPage = false;
    jobsService.requestJobs(vm.jobDesc, vm.loc, vm.page+1).then(function(response) {
      if (response.length > 0) {
        vm.hasNextPage = true;
      }
      vm.nextPageData = response;
    });
  }

  vm.nextPage = function() {
    vm.previousPageData = vm.jobList;
    vm.jobList = vm.nextPageData;
    vm.checkNextPage();
    $location.search({"page": vm.page});
    vm.page++;
  }

  vm.previousPage = function() {
    jobsService.requestJobs(vm.jobDesc, vm.loc, vm.page-1).then(function(response){
      vm.jobList = response;
      vm.ready = true;
      vm.checkNextPage();
    });
    vm.page--;
    $location.search({"page": vm.page});
  }

  vm.addJobPage = function() {
    location.href = "#/addjob";
  };

};

function jobCtrl($log, jobsService, moment, $routeParams) {
  var vm = this;
  vm.job = {};
  vm.job.type = "";
  vm.job.location = "";
  vm.job.title = "";
  vm.job.description = "";
  vm.job.how_to_apply = "";
  vm.job.company = "";
  vm.job.company_url = "";
  vm.job.company_logo = "";
  vm.moment = moment;
  vm.ready = false;

  jobsService.loadJob($routeParams.id).then(function(response) {
    vm.job = response.data;
    vm.ready = true;

  });
}

function addJobCtrl($log, jobsService, $routeParams) {
  var vm = this;
  var prev = false;
  vm.job = {};
  vm.job.type = "Job Hours";
  vm.job.location = "";
  vm.job.title = "";
  vm.job.description = "";
  vm.job.how_to_apply = "";
  vm.job.company = "";
  vm.job.company_url = "";
  vm.job.company_logo = "";

  vm.fileBtn = function() {
    vm.prev = true;
    angular.element(document.getElementById("fileInput"))[0].click();
  };

  vm.save = function() {
      vm.job.company_logo = vm.previewSource;
      jobsService.createJob(vm.job).then(function(job) {
        vm.prev = false;
        location.hash = '/job/' + job.id;
      });
    };
}
