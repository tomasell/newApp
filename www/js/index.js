/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
  // Application Constructor
  initialize : function() {
    this.bindEvents();
  },
  // Bind Event Listeners
  //
  // Bind any events that are required on startup. Common events are:
  // 'load', 'deviceready', 'offline', and 'online'.
  bindEvents : function() {
    document.addEventListener('deviceready', this.onDeviceReady, false);
  },
  // deviceready Event Handler
  //
  // The scope of 'this' is the event. In order to call the 'receivedEvent'
  // function, we must explicity call 'app.receivedEvent(...);'
  onDeviceReady : function() {
    app.receivedEvent('deviceready');
  },
  // Update DOM on a Received Event
  receivedEvent : function(id) {
    var parentElement = document.getElementById(id);
    var listeningElement = parentElement.querySelector('.listening');
    var receivedElement = parentElement.querySelector('.received');

    listeningElement.setAttribute('style', 'display:none;');
    receivedElement.setAttribute('style', 'display:block;');

    console.log('Received Event: ' + id);
  }
};
var ticket = {
  frontend : function() {

    var request = new XMLHttpRequest();
    request.open("GET", "http://10.0.10.67:8888/servicedesk/frontend.json",
        true);
    request.onreadystatechange = function() {
      if (request.readyState == 4) {
        if (request.status == 200 || request.status == 0) {
          var table = $('<table data-role="table" id="table-column-toggle" '
              + 'data-mode="columntoggle" class="ui-responsive table-stroke">'
              + '<thead></thead>' + '<tbody></tbody></table>');
          var thead = $(table[0].tHead);
          var tbody = $(table[0].tBodies);
          var tr = $('<tr></tr>');
          tr.append('<th data-priority="1">Number</th>');
          tr.append('<th data-priority="2">Company</th>');
          tr.append('<th data-priority="3">Queue</th>');
          tr.append('<th data-priority="4">Receiver</th>');
          thead.append(tr);
          var tweets = $.parseJSON(request.responseText);
          $.each(tweets.values, function(index, value) {
            var tr1 = $('<tr></tr>');
            tr1.append('<td>'+value.number+'</td>');
            tr1.append('<td>'+value.company.name+'</td>');
            tr1.append('<td>'+value.queue+'</td>');
            tr1.append('<td>'+value.receiver.cn+'</td>');
            tbody.append(tr1 );
            console.debug(value.number);
          });
          $('#dashboard').append(table);
        }
      }
    };
    request.send();

    // $.ajax('http://10.0.10.67:8888/servicedesk/frontend.json', {
    // type : 'GET',
    // dataType : 'json'
    // }).done(
    // function($result) {
    // var table = $('<table data-role="table" id="table-column-toggle" '
    // + 'data-mode="columntoggle" class="ui-responsive table-stroke">'
    // + '<thead></thead>' + '<tbody></tbody></table>');
    // var thead = $(table[0].tHead);
    // var tbody = $(table[0].tBodies);
    // var tr = $('<tr></tr>');
    // tr.append('<th data-priority="1">Number</th>');
    // tr.append('<th data-priority="2">Company</th>');
    // tr.append('<th data-priority="3">Queue</th>');
    // tr.append('<th data-priority="4">Receiver</th>');
    // thead.append(tr);
    //
    // // var tr1 = tbody.append("<tr>");
    // // tr1.append('<th>1</th>');
    // // tr1.append('<th>SAIV</th>');
    // // tr1.append('<th>WIFI</th>');
    // // tr1.append('<th>Alex</th>');
    //
    // $('#dashboard').append(table);
    //
    // // level_1.push(value.value[0]);
    // // level_3.push(value.value[1]);
    // // level_5.push(value.value[2]);
    // // tmpdate = new Date(year, month, day, value.key[3]);
    // // ticks.push('h ' + tmpdate.getHours());
    // // thead.append('<th>' + 'h ' + tmpdate.getHours() + '</th>');
    // // level5_row.append('<td>' + value.value[2] + '</td>');
    // // level3_row.append('<td>' + value.value[1] + '</td>');
    // // level1_row.append('<td>' + value.value[0] + '</td>');
    // // });
    // },function(){
    // var table = $('<table data-role="table" id="table-column-toggle" '
    // + 'data-mode="columntoggle" class="ui-responsive table-stroke">'
    // + '<thead></thead>' + '<tbody></tbody></table>');
    // var thead = $(table[0].tHead);
    // var tbody = $(table[0].tBodies);
    // var tr = $('<tr></tr>');
    // tr.append('<th data-priority="1">error</th>');
    // tr.append('<th data-priority="2">Company</th>');
    // thead.append(tr);
    //
    // // var tr1 = tbody.append("<tr>");
    // // tr1.append('<th>1</th>');
    // // tr1.append('<th>SAIV</th>');
    // // tr1.append('<th>WIFI</th>');
    // // tr1.append('<th>Alex</th>');
    //
    // $('#dashboard').append(table);
    // });
  }
};