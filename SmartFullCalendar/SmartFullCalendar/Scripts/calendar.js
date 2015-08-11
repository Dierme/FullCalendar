$('#calendar').fullCalendar({
    header:{
        left: 'prev,next,today',
        center: 'title',
        right: 'month, agendaWeek, agendaDay'
    },
    editable: true,
    allDaySlot: false,
    selectable: true,
    events: function (start, end, callback) {
        console.log(start.toISOString());
        console.log(end.toISOString());
        $.ajax({
            url: '/api/event/',
            dataType: 'json',
            data: {
                startISO: start.toISOString(),
                endISO: end.toISOString()
            },
            success: function (doc) {
                var events = [];
                $(doc).each(function () {
                    console.log($(this).attr('Id'));
                    console.log($(this).attr('Title'));
                    console.log($(this).attr('DateStart'));
                    events.push({
                        id: $(this).attr('Id'),
                        title: $(this).attr('Title'),
                        start: $(this).attr('DateStart'),
                        end: $(this).attr('DateEnd'),
                        description: $(this).attr('Description'),
                        location: $(this).attr('Location'),
                        category: $(this).attr('Category'),
                        allDay: false                        
                    });                    
                });
                callback(events);
            }            
        });
    },
    eventClick: function (calEvent, jsEvent, view) {
        $('input[name =Id]').val(calEvent.id);
        $('input[name =Title]').val(calEvent.title);
        $('input[name =Description]').val(calEvent.description);

        $('#infoDialog').modal('show');
    },
    dayClick: function (date, allDay, jsEvent, view) {        
        $('#createDialog').modal('show');
    },
    select: function (startDate, endDate, allDay, jsEvent, view) {
        $('#createDialog').modal('show');
    }
});
$(function () {
    $('#datetimepicker1').datetimepicker();
});