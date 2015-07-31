angular.module('roomEase')

    .controller('calendarCtrl', function ($scope, Request, $location, $modal, $log, eventAPIRequests){
        $scope.calendarView = 'month';
        $scope.calendarDay = new Date();


        //Helps convert UTC timestamps received from database into timezone-friendly Date objects
        $scope.fixDate = function (dateObj) {
            var newDate = new Date(dateObj);
            var offset = newDate.getTimezoneOffset();
            var year = newDate.getFullYear();
            var month = newDate.getMonth();
            var day = newDate.getDate();
            var hour = newDate.getHours();
            var minutes = newDate.getMinutes();
            var setDate = new Date(year, month, day, hour, minutes);
            return setDate;
        };

        //Similar to fixdate, but makes sure to account for timezone difference before saving to database
        $scope.saveDate = function (dateObj) {
            var newDate = new Date(dateObj);
            var offset = newDate.getTimezoneOffset();
            var year = newDate.getFullYear();
            var month = newDate.getMonth();
            var day = newDate.getDate();
            var hour = newDate.getHours();
            var minutes = newDate.getMinutes();
            var setDate = new Date(year, month, day, hour, minutes - offset);
            return setDate;
        };

        //Fetches all calendar events from database
        $scope.getEvents = function(event) {
            eventAPIRequests.getEvents().then(function(res){
              $scope.events = [];
              if(Array.isArray(res)){
                //Adjusts start and end times for events so they will display correctly
                  for (var i = 0; i < res.length; i++) {
                      $scope.events.push(res[i]);
                      $scope.events[i].start_at = $scope.fixDate($scope.events[i].start_at);
                      $scope.events[i].end_at = $scope.fixDate($scope.events[i].end_at);
                      $scope.events[i].startsAt = $scope.events[i].start_at;
                      $scope.events[i].endsAt = $scope.events[i].end_at;
                      //(Optional) Prevent badge icon from incrementing on calendar
                      $scope.events[i]['incrementsBadgeTotal'] = false;
                  };
              } else { 
                return;
              }
            });
        };

        //If the event exists in the database (has an id), send update query to database
        $scope.updateEvent = function(event) {
            if(event.id){
                eventAPIRequests.updateEvent({
                    title: event.title,
                    eventType: event.type,
                    startAt: event.startsAt,
                    endAt: event.endsAt,
                    id: event.id

                }).then($scope.getEvents(function(err, result) {
                        if err console.error(err);
                    })
                );
        //Else, create a new event in the database
            } else {
                eventAPIRequests.createEvent({
                title: event.title,
                eventType: event.type,
                startAt: event.startsAt,
                endAt: event.endsAt
        //Grab all events from the database again
            }).then($scope.getEvents(function(err, result) {
                    if err console.error(err);
                })
            );
            }
        };

        $scope.deleteEvent = function(event) {
            eventAPIRequests.deleteEvent({
                title: event.title,
                eventType: event.type,
                startAt: event.startsAt,
                endAt: event.endsAt,
                id: event.id

            }).then($scope.getEvents(function(err, result) {
                    if err console.error(err);
                })
            );

            eventAPIRequests.getEvents().then(function (res) {
                // console.log(res);
            });
        };

        //Initialize the events by grabbing them from the database the first time the view loads
        $scope.events = $scope.getEvents();
            
            var defaultEvent = {
                title: '(Click to Edit)', // The title of the event
                type: 'info', // The type of the event (determines its color). Can be important, warning, info, inverse, success or special
                startsAt: $scope.saveDate(new Date()), // A javascript date object for when the event starts
                endsAt: $scope.saveDate(new Date()), // Optional - a javascript date object for when the event ends
                editable: true, // If edit-event-html is set and this field is explicitly set to false then dont make it editable.
                deletable: true, // If delete-event-html is set and this field is explicitly set to false then dont make it deleteable
                draggable: false, //Allow an event to be dragged and dropped
                resizable: false, //Allow an event to be resizable
                incrementsBadgeTotal: false, //If set to false then will not count towards the badge total amount on the month and year view
                cssClass: 'a-css-class-name' //A CSS class (or more, just separate with spaces) that will be added to the event when it is displayed on each view. Useful for marking an event as selected / active etc
            };
        
        $scope.createDefaultEvent = function () {

            eventAPIRequests.createEvent({
                title: defaultEvent.title,
                eventType: defaultEvent.type,
                startAt: defaultEvent.startsAt,
                endAt: defaultEvent.endsAt

            }).then($scope.getEvents(function(err, result) {
                    if err console.error(err);
                })
            );

            return defaultEvent;
        };

// Modal

    function showModal(action, event) {
      $modal.open({
        templateUrl: 'modalContent.html',
        controller: function() {
          var vm = this;
          vm.action = action;
          vm.event = event;
        },
        controllerAs: 'vm'
      });
    }

    $scope.eventClicked = function(event) {
      showModal('Clicked', event);
    };

    $scope.eventEdited = function(event) {
      showModal('Clicked', event);
    };

    $scope.eventDeleted = function(event) {
      $scope.deleteEvent(event);
    };

    $scope.toggle = function($event, field, event) {
      $event.preventDefault();
      $event.stopPropagation();
      event[field] = !event[field];
    };

    $scope.openEventModal = function () {
        $scope.events.push(defaultEvent);
        $scope.eventClicked($scope.events[$scope.events.length-1]);
    };

});