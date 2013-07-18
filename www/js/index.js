$('#reposHome').bind('pageinit', function(event) {
  $.mobile.allowCrossDomainPages = true;
  $.support.cors = true;
  loadRepos();
});

function loadRepos() {
  $
      .ajax('http://10.0.10.67:8888/servicedesk/frontend.json')
      .done(
          function(result) {
            var table = $('#dashboard');
            var tbody = $(table[0].tBodies);
            $
                .each(
                    result.values,
                    function(index, value) {
                      console.debug(value.number);
                      var tr1 = $('<tr></tr>');
                      tr1
                          .append('<th>'
                              + value.number + '</th>');
                      tr1.append('<td>' + value.company.name + '</td>');
                      tr1.append('<td>' + value.queue + '</td>');
                      tr1.append('<td>' + value.receiver.cn + '</td>');
                      tbody.append(tr1);
                    });
            $('#dashboard').table('refresh');
          }, function(err) {
            console.debug(err);
          });
}