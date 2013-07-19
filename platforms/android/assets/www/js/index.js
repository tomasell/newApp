var months = [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept',
    'Oct', 'Nov', 'Dec' ];

$('#reposHome').bind('pageinit', function(event) {
  $.mobile.allowCrossDomainPages = true;
  $.support.cors = true;
  loadRepos();
});

Queue = {
  0 : 'Unknown',
  1 : 'Collaboration Office',
  2 : 'Collaboration Enterprise',
  3 : 'Networking',
  4 : 'Ponti radio',
  5 : 'Wi-Fi',
  6 : 'Datacenter'
};

function loadRepos() {
  $.ajax('http://10.0.10.67:8888/servicedesk/frontend.json').done(
      function(result) {
        var table = $('#dashboard');
        var tbody = $(table[0].tBodies);
        $.each(result.values, function(index, value) {
          var tr1 = $('<tr></tr>');
          tr1.append('<th><a href="views/ticket.html?ticket=' + value.number
              + '" data-transition="slide">' + value.number + '</a></th>');
          tr1.append('<td>' + value.company.name + '</td>');
          tr1.append('<td>' + value.queue + '</td>');
          if (value.receiver) {
            tr1.append('<td>' + value.receiver.cn + '</td>');
          } else {
            tr1.append('<td></td>');
          }
          tbody.append(tr1);
        });
        $('#dashboard').table('refresh');
      });
}

$('#ticket').live('pagebeforeshow', function(event) {
  var ticket = getUrlVars().ticket;
  loadTicket(ticket);
});

function loadTicket(ticket) {
  array = [];
  array.push($.ajax('http://10.0.10.67:8888/servicedesk/tickets/' + ticket
      + '.json/edit'));
  array.push($.ajax('http://10.0.10.67:8888/saiv/group/service desk'));
  $.when
      .apply(this, array)
      .then(
          function(ticket, agents) {
            ticket = ticket[0];
            agents = jQuery.parseJSON(agents[0]);
            $('#header').append('<h1>' + ticket.number + '</h1>');
            $('#content')
                .append(
                    '<div class="ui-grid-solo"><div class="ui-block-a"><textarea id="issue" readonly>'
                        + ticket.issue + '</textarea></div></div>');
            $('#content').append('<dt>TIPOLOGIA</dt>');
            $('#content').append(
                '<dd><select id = "queue" placeholder value></select></dd>');
            $.each(Queue, function(i, value) {
              if (i == ticket.queue) {
                $('#queue').append(
                    '<option value ="' + i + '" selected>' + value
                        + '</option>');
              } else {
                $('#queue').append(
                    '<option value ="' + i + '">' + value + '</option>');
              }
            });
            var received = new Date(ticket.received.date);
            $('#content').append(
                '<dt>RICEVUTO il ' + received.getDate() + ' '
                    + (months[received.getMonth() + 1]) + ' '
                    + received.getFullYear() + '</dt>');
            $('#content').append(
                '<dd><select id = "receiver" placeholder value></select></dd>');
            $('#receiver').append('<option value =""></option>');
            var agentHref = '{"_class":"BEST\\SAIV\\User\\Model","_key":{"cn":"%s"}}';
            $.each(agents, function(i, agent) {
              if (ticket.receiver && agent.cn == ticket.receiver.cn) {
                $('#receiver').append(
                    '<option value ="' + sprintf(agentHref, agent.cn)
                        + '" selected>' + agent.cn + '</option>');
              } else {
                $('#receiver').append(
                    '<option value ="' + sprintf(agentHref, agent.cn) + '">'
                        + agent.cn + '</option>');
              }
            });
            if (ticket.assigned) {
              var assigned = new Date(ticket.assigned.date);
              $('#content').append(
                  '<dt>ASSEGNATO il ' + assigned.getDate() + ' '
                      + (months[assigned.getMonth() + 1]) + ' '
                      + assigned.getFullYear() + '</dt>');
            } else {
              $('#content').append('<dt>ASSEGNATO</dt>');
            }
            $('#content').append(
                '<dd><select id = "assignee" placeholder value></select></dd>');
            $('#assignee').append('<option value =""></option>');
            $.each(agents, function(i, agent) {
              if (ticket.assignee && agent.cn == ticket.assignee.cn) {
                $('#assignee').append(
                    '<option value ="' + sprintf(agentHref, agent.cn)
                        + '" selected>' + agent.cn + '</option>');
              } else {
                $('#assignee').append(
                    '<option value ="' + sprintf(agentHref, agent.cn) + '">'
                        + agent.cn + '</option>');
              }
            });
            $.each(ticket.notes, function(i, note) {
              createNote(note, i);
            });
          });
}

function createNote(note, index) {
  var name = 'note' + index;
  var created = new Date(note.created.date);
  $('#notes').append(
      '<div id="' + name
          + '" style="background-color: lightgoldenrodyellow;"></div>');
  $('#' + name).append(
      '<dt>' + note.author.cn + ' il ' + created.getDate() + ' '
          + (months[created.getMonth() + 1]) + ' ' + created.getFullYear()
          + '</dt>');
  switch (note.currentStatus) {
  case 1:
    $('#' + name)
        .append(
            '<dd><label style="background-color: lightpink;">ASSEGNATO</label></dd>');
    break;
  case 2:
    $('#' + name).append(
        '<dd><textarea disabled>' + note.text + '</textarea></dd>');
    break;
  case 4:
    $('#' + name)
        .append(
            '<dd><label style="background-color: lightgreen;">RISOLTO</label></dd>');
    if (note.text) {
      $('#' + name).append(
          '<dd><textarea disabled>' + note.text + '</textarea></dd>');
    }
    break;
  }
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

function sprintf() {
  var regex = /%%|%(\d+\$)?([-+\'#0 ]*)(\*\d+\$|\*|\d+)?(\.(\*\d+\$|\*|\d+))?([scboxXuideEfFgG])/g;
  var a = arguments, i = 0, format = a[i++];

  // pad()
  var pad = function(str, len, chr, leftJustify) {
    if (!chr) {
      chr = ' ';
    }
    var padding = (str.length >= len) ? '' : Array(1 + len - str.length >>> 0)
        .join(chr);
    return leftJustify ? str + padding : padding + str;
  };

  // justify()
  var justify = function(value, prefix, leftJustify, minWidth, zeroPad,
      customPadChar) {
    var diff = minWidth - value.length;
    if (diff > 0) {
      if (leftJustify || !zeroPad) {
        value = pad(value, minWidth, customPadChar, leftJustify);
      } else {
        value = value.slice(0, prefix.length) + pad('', diff, '0', true)
            + value.slice(prefix.length);
      }
    }
    return value;
  };

  // formatBaseX()
  var formatBaseX = function(value, base, prefix, leftJustify, minWidth,
      precision, zeroPad) {
    // Note: casts negative numbers to positive ones
    var number = value >>> 0;
    prefix = prefix && number && {
      '2' : '0b',
      '8' : '0',
      '16' : '0x'
    }[base] || '';
    value = prefix + pad(number.toString(base), precision || 0, '0', false);
    return justify(value, prefix, leftJustify, minWidth, zeroPad);
  };

  // formatString()
  var formatString = function(value, leftJustify, minWidth, precision, zeroPad,
      customPadChar) {
    if (precision != null) {
      value = value.slice(0, precision);
    }
    return justify(value, '', leftJustify, minWidth, zeroPad, customPadChar);
  };

  // doFormat()
  var doFormat = function(substring, valueIndex, flags, minWidth, _, precision,
      type) {
    var number;
    var prefix;
    var method;
    var textTransform;
    var value;

    if (substring === '%%') {
      return '%';
    }

    // parse flags
    var leftJustify = false, positivePrefix = '', zeroPad = false, prefixBaseX = false, customPadChar = ' ';
    var flagsl = flags.length;
    for ( var j = 0; flags && j < flagsl; j++) {
      switch (flags.charAt(j)) {
      case ' ':
        positivePrefix = ' ';
        break;
      case '+':
        positivePrefix = '+';
        break;
      case '-':
        leftJustify = true;
        break;
      case "'":
        customPadChar = flags.charAt(j + 1);
        break;
      case '0':
        zeroPad = true;
        break;
      case '#':
        prefixBaseX = true;
        break;
      }
    }

    // parameters may be null, undefined, empty-string or real valued
    // we want to ignore null, undefined and empty-string values
    if (!minWidth) {
      minWidth = 0;
    } else if (minWidth === '*') {
      minWidth = +a[i++];
    } else if (minWidth.charAt(0) == '*') {
      minWidth = +a[minWidth.slice(1, -1)];
    } else {
      minWidth = +minWidth;
    }

    // Note: undocumented perl feature:
    if (minWidth < 0) {
      minWidth = -minWidth;
      leftJustify = true;
    }

    if (!isFinite(minWidth)) {
      throw new Error('sprintf: (minimum-)width must be finite');
    }

    if (!precision) {
      precision = 'fFeE'.indexOf(type) > -1 ? 6 : (type === 'd') ? 0
          : undefined;
    } else if (precision === '*') {
      precision = +a[i++];
    } else if (precision.charAt(0) == '*') {
      precision = +a[precision.slice(1, -1)];
    } else {
      precision = +precision;
    }

    // grab value using valueIndex if required?
    value = valueIndex ? a[valueIndex.slice(0, -1)] : a[i++];

    switch (type) {
    case 's':
      return formatString(String(value), leftJustify, minWidth, precision,
          zeroPad, customPadChar);
    case 'c':
      return formatString(String.fromCharCode(+value), leftJustify, minWidth,
          precision, zeroPad);
    case 'b':
      return formatBaseX(value, 2, prefixBaseX, leftJustify, minWidth,
          precision, zeroPad);
    case 'o':
      return formatBaseX(value, 8, prefixBaseX, leftJustify, minWidth,
          precision, zeroPad);
    case 'x':
      return formatBaseX(value, 16, prefixBaseX, leftJustify, minWidth,
          precision, zeroPad);
    case 'X':
      return formatBaseX(value, 16, prefixBaseX, leftJustify, minWidth,
          precision, zeroPad).toUpperCase();
    case 'u':
      return formatBaseX(value, 10, prefixBaseX, leftJustify, minWidth,
          precision, zeroPad);
    case 'i':
    case 'd':
      number = +value || 0;
      number = Math.round(number - number % 1); // Plain Math.round doesn't just
      // truncate
      prefix = number < 0 ? '-' : positivePrefix;
      value = prefix + pad(String(Math.abs(number)), precision, '0', false);
      return justify(value, prefix, leftJustify, minWidth, zeroPad);
    case 'e':
    case 'E':
    case 'f': // Should handle locales (as per setlocale)
    case 'F':
    case 'g':
    case 'G':
      number = +value;
      prefix = number < 0 ? '-' : positivePrefix;
      method = [ 'toExponential', 'toFixed', 'toPrecision' ]['efg'.indexOf(type
          .toLowerCase())];
      textTransform = [ 'toString', 'toUpperCase' ]['eEfFgG'.indexOf(type) % 2];
      value = prefix + Math.abs(number)[method](precision);
      return justify(value, prefix, leftJustify, minWidth, zeroPad)[textTransform]
          ();
    default:
      return substring;
    }
  };

  return format.replace(regex, doFormat);
}