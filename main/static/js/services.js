JobAPP.factory('jobsService', jobsService);

function jobsService($http, $log) {
  var jobList = [];
  // var API_URL = "https://cors-anywhere.herokuapp.com/https://jobs.github.com/";
  var API_URL = "/api/v1/";

  var service = {
    requestJobs: requestJobs,
    loadJob: loadJob,
    createJob: createJob
  };

  return service;

  function requestJobs(job, location, page) {
    var self = this;

    return $http.get(API_URL + "positions?description=" + job +  "&location=" + location + "&page=" + page)
      .then(function(response) {
        return response.data;
      });
  }

  function loadJob(jobid) {
    return $http.get(API_URL + "positions/" + jobid).then(function(response) {
      return response;
    });
  }

  function createJob(job) {
      return $http.post(API_URL + 'positions', {
        title: job.title,
        location: job.location,
        type: job.type,
        description: job.description,
        how_to_apply: job.how_to_apply,
        company: job.company,
        company_url: job.company_url,
        company_logo: job.company_logo
      }).then(function(data) {
        return data.data;
      });
    }

}
