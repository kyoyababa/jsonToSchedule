jQuery(function($) {

  // major DOMs
  var $firstPage = $('#jsi-first-page');
  var $secondPage = $('#jsi-second-page');

  // major variants
  var schedules = new Array();
  var minimumDate;
  var maximumDate;
  var tourDates;

  $.getJSON('./assets/js/schedule.json', function(data) {
    $insertAppTitle = function() {
      $('.jsc-app-title').text(data.appTitle);
    }

    $fetchScheduleData = function() {
      schedules = data.schedules;
      schedules.sort(function(a, b){
        if( a[SCHEDULE_D[1]] < b[SCHEDULE_D[1]] ) return -1;
        if( a[SCHEDULE_D[1]] > b[SCHEDULE_D[1]] ) return 1;
        return 0;
      });
    }

    $calculateMinimumAndMaximumDate = function() {
      for(var i = 0; i < schedules.length; i++) {
        var _this = schedules[i];

        // clean up schedules data
        schedules[i][SCHEDULE_D[1]] = new Date(_this[SCHEDULE_D[1]]);
        schedules[i][SCHEDULE_D[2]] = new Date(_this[SCHEDULE_D[2]]);
        schedules[i].Day            = WEEKDAY[_this[SCHEDULE_D[1]].getDay()];
        schedules[i].Duration       = schedules[i][SCHEDULE_D[2]] - schedules[i][SCHEDULE_D[1]];

        // for debug
        if ( schedules[i][SCHEDULE_D[1]] > schedules[i][SCHEDULE_D[2]] ) {
          alert('ERROR: you set earlier date as "Start" than "End" in schedule-' + i);
        }

        if ( !minimumDate || minimumDate > schedules[i][SCHEDULE_D[1]] ) {
          minimumDate = schedules[i][SCHEDULE_D[1]];
        }

        if ( !maximumDate || maximumDate < schedules[i][SCHEDULE_D[2]] ) {
          maximumDate = schedules[i][SCHEDULE_D[2]];
        }
      }
    }

    $insertDateTextsToFirstPage = function (){
      var minimumDateText = WEEKDAY[minimumDate.getDay()] + ' ' + MONTH_NAMES[minimumDate.getMonth()] + ' ' + minimumDate.getDate();
      var maximumDateText = WEEKDAY[maximumDate.getDay()] + ' ' + MONTH_NAMES[maximumDate.getMonth()] + ' ' + maximumDate.getDate();
      $('#jsi-from-date').text(minimumDateText);
      $('#jsi-to-date').text(maximumDateText);
    }

    $renderingBasicDOMs = function () {
      var tourDates = Math.floor((maximumDate - minimumDate + 1) / MS_PER_DAY) + 1;
      var currentDate = new Date(minimumDate);

      for (var i = 0; i < tourDates; i++) {
        if ( i != 0 ) {
          new Date(currentDate.setDate(currentDate.getDate() + 1));
        }

        var currentDateText = WEEKDAY[currentDate.getDay()] + ' ' + MONTH_NAMES[currentDate.getMonth()] + ' ' + currentDate.getDate() + ' ' + currentDate.getFullYear();

        // insert date for first page
        var $insert =  '<li>';
            $insert +=   '<dl>';
            $insert +=     '<dt>Day ' + (i + 1) + '</dt>';
            $insert +=     '<dd>' + currentDateText + '</dd>';
            $insert +=   '</dl>';
            $insert += '</li>';
        $firstPage.find('ol').append($insert);

        // insert each days page
        var $insert =  '<ol data-month="' + currentDate.getMonth() + '" data-day="' + currentDate.getDate() + '">';
            $insert +=   '<li>';
            $insert +=     '<h2>' + currentDateText + '</h2>';
            $insert +=     '<ul>';
            $insert +=     '</ul>';
            $insert +=     '<p><a href="javascript: void(0);">Back</a></p>';
            $insert +=   '</li>';
            $insert += '</ol>';
        $secondPage.append($insert);
      }
    }

    $renderingEachScheduleDetail = function () {
      for(var i = 0; i < schedules.length; i++) {
        var _this = schedules[i];

        $secondPage.find('ol').each(function() {
          var $_this = $(this);
          if (
              $(this).data(LIST_D[0]) === _this[[SCHEDULE_D[1]]].getMonth() &&
              $(this).data(LIST_D[1]) === _this[[SCHEDULE_D[1]]].getDate()
            ) {
            var startTime =  _this[SCHEDULE_D[3]];
                startTime += ' / ';
                startTime += MONTH_NAMES[_this[SCHEDULE_D[1]].getMonth()];
                startTime += ' ';
                startTime += _this[SCHEDULE_D[1]].getDate();
                startTime += ' ';
                if ( _this[SCHEDULE_D[1]].getHours() < 10 ) {
                  startTime += '0';
                }
                startTime += _this[SCHEDULE_D[1]].getHours();
                startTime += ':';
                if ( _this[SCHEDULE_D[1]].getMinutes() < 10 ) {
                  startTime += '0';
                }
                startTime += _this[SCHEDULE_D[1]].getMinutes();

            var endTime =  MONTH_NAMES[_this[SCHEDULE_D[2]].getMonth()];
                endTime += ' ';
                endTime += _this[SCHEDULE_D[2]].getDate();
                endTime += ' ';
                if ( _this[SCHEDULE_D[2]].getHours() < 10 ) {
                  startTime += '0';
                }
                endTime += _this[SCHEDULE_D[2]].getHours();
                endTime += ':';
                if ( _this[SCHEDULE_D[2]].getMinutes() < 10 ) {
                  startTime += '0';
                }
                endTime += _this[SCHEDULE_D[2]].getMinutes();

            var $insert =  '<li>';
                $insert +=   '<h3>' + _this[SCHEDULE_D[0]] + '</h3>';
                $insert +=   '<p><address>' + _this[SCHEDULE_D[6]] + '</address></p>';
                $insert +=   '<p><time>' + startTime + '</time> - <time>' + endTime + '</time></p>';
                $insert +=   '<p>' + _this[SCHEDULE_D[5]] + '</p>';
                $insert += '</li>';

            $_this.find('li').find('ul').append($insert);
          }
        });
      }
    }

    $(function() {
      $insertAppTitle();
      $fetchScheduleData();
      $calculateMinimumAndMaximumDate();
      $insertDateTextsToFirstPage();
      $renderingBasicDOMs();
      $renderingEachScheduleDetail();
    });
  });
});
