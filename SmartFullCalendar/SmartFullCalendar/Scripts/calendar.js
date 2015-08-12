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
        
    },

    dayClick: function (date, allDay, jsEvent, view) {
        $('input[name =Title]').val('');
        $('input[name =Description]').val('');
        $('input[name =DateAdd]').val(new Date().toISOString());
        $('#datetimepicker1').data("DateTimePicker").date(date);
        $('#datetimepicker1').data("DateTimePicker").widgetPositioning({vertical:'top',horizontal:'left'});
        $('#datetimepicker2').data("DateTimePicker").widgetPositioning({ vertical: 'bottom', horizontal: 'left' });
        $('#createDialog').modal('show');
    },

    select: function (startDate, endDate, allDay, jsEvent, view) {
        $('#createDialog').modal('show');
    }
});
$(function () {
    $('#datetimepicker2').datetimepicker();
    $('#datetimepicker1').datetimepicker();    
});

$("#eventForm").submit(function () {
    var jqxhr = $.post('api/event/create', $('#eventForm').serialize())
        .success(function () {
            $('#message').val("Good");
            $('#calendar').fullCalendar('refetchEvents');
        })
        .error(function () {
            $('#message').html("Error posting the update.");
        });
    return false;
});
$("#btnPopupSave").click(function (e)
{
    $("#eventForm").submit();
});