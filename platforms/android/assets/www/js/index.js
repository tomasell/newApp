$('#reposHome').bind('pageinit', function(event) {
  $.mobile.allowCrossDomainPages = true;
  $.support.cors = true;
  loadRepos();
});

function loadRepos() {
  $.ajax('http://10.0.10.67:8888/servicedesk/frontend.json').done(
      function(result) {
        var table = $('#dashboard');
        var tbody = $(table[0].tBodies);
        $.each(result.values, function(index, value) {
          var tr1 = $('<tr></tr>');
          tr1.append('<th><a href="views/ticket.html?ticket=' + value.number
              + '">' + value.number + '</a></th>');
          tr1.append('<td>' + value.company.name + '</td>');
          tr1.append('<td>' + value.queue + '</td>');
          tr1.append('<td>' + value.receiver.cn + '</td>');
          tbody.append(tr1);
        });
        $('#dashboard').table('refresh');
      });
}

$('#ticket').live('pageshow', function(event) {
  var ticket = getUrlVars().ticket;
  loadTicket(ticket);
});

function loadTicket(ticket) {
  $.ajax('http://10.0.10.67:8888/servicedesk/tickets/' + ticket + '.json/edit')
      .done(
          function(ticket) {
            $('#header').append('<h1>' + ticket.number + '</h1>');
            $('#content').append(
                '<textarea rows="4" disabled>' + ticket.issue + '</textarea>');
            $('#content').append('<dt>TIPOLOGIA</dt>');
            var queue;
            switch (ticket.queue) {
            case 0:
              queue = 'Unknown';
            case 1:
              queue = 'Collaboration Office';
            case 2:
              queue = 'Collaboration Enterprise';
            case 3:
              queue = 'Networking';
            case 4:
              queue = 'Ponti radio';
            case 5:
              queue = 'Wi-Fi';
            case 6:
              queue = 'Datacenter';
            }
            $('#content').append('<dd>' + queue + '</dd>');
          });
}

function getUrlVars() {
  var vars = [], hash;
  var hashes = window.location.href
      .slice(window.location.href.indexOf('?') + 1).split('&');
  for ( var i = 0; i < hashes.length; i++) {
    hash = hashes[i].split('=');
    vars.push(hash[0]);
    vars[hash[0]] = hash[1];
  }
  return vars;
}