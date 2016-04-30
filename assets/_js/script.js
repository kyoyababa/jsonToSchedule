jQuery(function($) {

  if ( !window.navigator.onLine ) {
    alert('Network is unavailable.');
    return false;
  }

  // major consts
  const SHOWN_CLASS     = 'shown';
  const HIDDEN_CLASS    = 'hidden';
  const DURATION        = 150;
  const SCHEDULES_ID    = 'jsi-schedules';
  const DATE_ERROR      = 'Invalid Date';
  const GMAP_ENDPOINT   = 'https://maps.googleapis.com/maps/api/staticmap?';
  var $schedules        = $('#' + SCHEDULES_ID);

  // major variants
  var schedules = new Array();
  var minimumDate;
  var maximumDate;
  var tourDates;

  // major functions
  var $addShownClass = function(element) {
    element.addClass(SHOWN_CLASS);
  }
  var $removeShownClass = function(element) {
    element.removeClass(SHOWN_CLASS);
  }

  $.getJSON('./assets/js/schedule.json', function(data) {
    if ( data.googleMapAPIKey ) {
      var gMapAPIKey = data.googleMapAPIKey;
    }

    if ( data.flickrAPIKey ) {
      var flickrAPIKey = data.flickrAPIKey;
    }

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

        // show alert when illegal data exists
        if ( !schedules[i][SCHEDULE_D[0]] ) {
          alert('ERROR: Title in No.' + (i+1) + 'does not have any value.');
          return false;
        }

        if ( schedules[i][SCHEDULE_D[1]] == DATE_ERROR || schedules[i][SCHEDULE_D[2]] == DATE_ERROR ) {
          alert('ERROR: you set wrong data / time in schedule No.' + (i+1) + '(' + schedules[i][SCHEDULE_D[0]] + ')' + '. Start and End value must be specified.');
          return false;
        }

        if ( schedules[i][SCHEDULE_D[1]] > schedules[i][SCHEDULE_D[2]] ) {
          alert('ERROR: you set earlier date as "Start" than "End" in schedule No.' + (i+1) + '(' + schedules[i][SCHEDULE_D[0]] + ')');
          return false;
        }

        if ( !minimumDate || minimumDate > schedules[i][SCHEDULE_D[1]] ) {
          minimumDate = schedules[i][SCHEDULE_D[1]];
        }

        if ( !maximumDate || maximumDate < schedules[i][SCHEDULE_D[2]] ) {
          maximumDate = schedules[i][SCHEDULE_D[2]];
        }
      }
    }

    $renderingBasicDOMs = function () {
      var tourDates = Math.floor((maximumDate - minimumDate) / MS_PER_DAY) + 2;
      var currentDate = new Date(minimumDate);

      var $basicDOM =  '<ol></ol>';

      // show alert when schedule includes over 10 days
      if ( tourDates > 10 ) {
        alert('ERROR: you set ' + tourDates +  ' days in schedule lists but unfortunately this application does not allow over 10 days.');
        return false;
      }

      $schedules.append($basicDOM);

      for (var i = 0; i < tourDates; i++) {
        if ( i != 0 ) {
          new Date(currentDate.setDate(currentDate.getDate() + 1));
        }

        var currentDateText = WEEKDAY[currentDate.getDay()] + ' / ' + MONTH_NAMES[currentDate.getMonth()] + ' ' + currentDate.getDate() + ' ' + currentDate.getFullYear();

        // insert each days page
        var $insert =  '<li data-month="' + currentDate.getMonth() + '" data-day="' + currentDate.getDate() + '">';
            $insert +=   '<h2>' + currentDateText + '</h2>';
            $insert +=   '<ul>';
            $insert +=   '</ul>';
            $insert += '</li>';
        $schedules.find('ol').append($insert);
      }
    }

    $renderingEachScheduleDetail = function () {
      for(var i = 0; i < schedules.length; i++) {
        var _this = schedules[i];
        var $i = 0;

        $schedules.find('li').each(function() {
          var $_this = $(this);

          if (
              $(this).data(LIST_D[0]) === _this[[SCHEDULE_D[1]]].getMonth() &&
              $(this).data(LIST_D[1]) === _this[[SCHEDULE_D[1]]].getDate()
            ) {
            var startTime = '';
                if ( _this[SCHEDULE_D[1]].getHours() < 10 ) {
                  startTime += '0';
                }
                startTime += _this[SCHEDULE_D[1]].getHours();
                startTime += ':';
                if ( _this[SCHEDULE_D[1]].getMinutes() < 10 ) {
                  startTime += '0';
                }
                startTime += _this[SCHEDULE_D[1]].getMinutes();

            var endTime = '';
                if ( _this[SCHEDULE_D[2]].getHours() < 10 ) {
                  endTime += '0';
                }
                endTime += _this[SCHEDULE_D[2]].getHours();
                endTime += ':';
                if ( _this[SCHEDULE_D[2]].getMinutes() < 10 ) {
                  endTime += '0';
                }
                endTime += _this[SCHEDULE_D[2]].getMinutes();

            var duration = (_this[SCHEDULE_D[2]] - _this[SCHEDULE_D[1]]) / MS_PER_MIN;

            var $insert =  '<li data-startTime="' + _this[SCHEDULE_D[1]] +'" data-endTime="' + _this[SCHEDULE_D[2]] + '" data-place="' + _this[SCHEDULE_D[6]] + '">';

                $insert +=   '<p class="ps-blank">';
                $insert +=     '<span>blank time:</span>';
                $insert +=     '<span class="jsc-blank"></span>';
                $insert +=     '<a href="javascript: void(0);" class="jsc-root" target="_blank">Open Route</a>'
                $insert +=   '</p>';

                $insert +=   '<h3>' + _this[SCHEDULE_D[0]] + '</h3>';
                $insert +=   '<p class="ps-time"><time>' + startTime + '</time> - <time>' + endTime + '</time> (' + duration + 'mins)</p>';

                if ( _this[SCHEDULE_D[6]] ) {
                  var $mapLink = '<a href="https://www.google.co.jp/maps/place/' + _this[SCHEDULE_D[6]] + '" target="_blank">Open Map</a>';
                } else {
                  var $mapLink = null;
                }

                if ( _this[SCHEDULE_D[6]] ) {
                  $insert +=   '<address>' + _this[SCHEDULE_D[6]] + $mapLink + '</address>';
                }

                $insert +=   '<p class="ps-image jsc-flickr-image"></p>';

                if ( _this[SCHEDULE_D[5]] ) {
                  $insert +=   '<p class="ps-description">' + _this[SCHEDULE_D[5]] + '</p>';
                }
                $insert += '</li>';

            $_this.find('ul').append($insert);
          }
        });
      }
    }

    $calculateBlankTimes = function() {
      $('.jsc-blank').each(function() {
        var $li = $(this).parent('p').parent('li');

        var prevEndTime = $li.prev('li').attr('data-endTime');
        var thisStartTime = $li.attr('data-startTime');

        if ( prevEndTime && thisStartTime ) {
          var duration = (new Date(thisStartTime) - new Date(prevEndTime)) / MS_PER_MIN;
        } else {
          var duration = '-';
        }

        $(this).text( duration + ' mins' );
      });
    }

    $activateSlideToggle = function() {
      const SHOWN_CLASS = 'shown';

      // automatically open first day's schedule
      $schedules.find('ol > li').eq(0).addClass(SHOWN_CLASS);

      // activate slideToggle()
      $schedules.find('ol > li').find('h2').click(function() {
        $(this).parent('li').toggleClass(SHOWN_CLASS);
      });
    }

    $rootHrefDispatcher = function() {
      $('.jsc-root').each(function() {
        var $li = $(this).parent('p').parent('li');

        var prevPlace = $li.prev('li').attr('data-place');
        var thisPlace = $li.attr('data-place');

        if ( prevPlace && thisPlace ) {
          const GMAP_DIR_ENDPOINT = 'https://www.google.co.jp/maps/dir';
          var targetAttr = GMAP_DIR_ENDPOINT + '/' + prevPlace + '/' + thisPlace;

          $(this).attr('href', targetAttr);
        } else {
          $(this).addClass(HIDDEN_CLASS);
        }
      });
    }

    $insertFlickrImage = function() {
      $('.jsc-flickr-image').each(function() {
        var $imageElement = $(this);
        var query = $imageElement.parent('li').find('h3').text();

        if ( query && flickrAPIKey ) {
          $.ajax({
            type: 'GET',
            url: 'https://www.flickr.com/services/rest/',
            data: {
              format: 'json',
              method: 'flickr.photos.search',
              api_key: flickrAPIKey,
              sort: 'interestingness-desc',
              tags: query,
              per_page: '1',
            },
            dataType: 'jsonp',
            jsonp: 'jsoncallback',
            success: function(data){
              if ( data.stat == 'ok' && data.photos.photo.length > 0 ) {
                var photo = data.photos.photo[0];
                var path = 'http://farm' + photo.farm + '.static.flickr.com/' + photo.server + '/' + photo.id + '_' + photo.secret + '_m.jpg';

                $imageElement.append('<img src="' + path + '" alt="">');
              }
            }
          });
        }
      });
    }

    $(function() {
      // DOM structures
      $insertAppTitle();
      $fetchScheduleData();
      $calculateMinimumAndMaximumDate();
      $renderingBasicDOMs();
      $renderingEachScheduleDetail();
      $calculateBlankTimes();
      $activateSlideToggle();
      $rootHrefDispatcher();
      $insertFlickrImage();
    });
  });
});
