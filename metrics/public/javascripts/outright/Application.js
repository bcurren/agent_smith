dojo.provide("outright.Application");

outright.reportsMap = {
  registrationsOverTime: {
    offline: "/mock_responses/users_over_time.json",
    online: "/stub_initial_engagement"
  }
};

dojo.declare("outright.Application", null, {
  constructor: function(offline) {
    this.offline = offline;
  },
  
  getReportUri: function(reportType) {
    var reportUris = outright.reportsMap[reportType];
    if (this.isOfflineMode()) {
      return reportUris.offline;
    } else {
      return reportUris.online;
    }
  },
  
  isOfflineMode: function() {
    return this.offline;
  }
});
