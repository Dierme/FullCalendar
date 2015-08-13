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
        ClearInfoPopup();
        $('#infoId').val(calEvent.id);
        $('#infoTitle').text(calEvent.title);
        if (calEvent.description != null)
            $('#infoDescription').text(calEvent.description);
        $('#infoDateStart').text(calEvent.start.toString());
        if (calEvent.end != null)
            $('#infoDateEnd').text(calEvent.end.toString());
        if (calEvent.location != null)
            $('#infoLocation').text(calEvent.location);
        if (calEvent.category != null)
        {
            switch (calEvent.category) {
                case 0:
                    $('#infoCategory').text('Home');
                    break;
                case 1:
                    $('#infoCategory').text('Business');
                    break;
                case 2:
                    $('#infoCategory').text('Study');
                    break;
                case 3:
                    $('#infoCategory').text('Fun');
                    break;
                case 4:
                    $('#infoCategory').text('Other');
                    break;
            }
        }
        $('#infoDialog').modal('show');
    },

    select: function (startDate, endDate, allDay, jsEvent, view) {
        ClearCreatePopup();
        startDate.setHours(startDate.getHours() + 1);
        endDate.setHours(endDate.getHours() + 1);
        $('#createDateAdd').val(new Date().toISOString());
        $('#datetimepicker1').data("DateTimePicker").date(startDate);
        if (!(endDate.getTime() === startDate.getTime()))
        {
            $('#datetimepicker2').data("DateTimePicker").date(endDate);
        }
        $('#createDialog').modal('show');
    },

    eventDrop: function (event, dayDelta, minuteDelta, allDay, revertFunc, jsEvent, ui, view)
    {
                
    }
});

$(function () {
    $('#datetimepicker1').datetimepicker();
    $('#datetimepicker2').datetimepicker();    
    $('#datetimepicker1').data("DateTimePicker").widgetPositioning({ vertical: 'bottom', horizontal: 'left' });
    $('#datetimepicker2').data("DateTimePicker").widgetPositioning({ vertical: 'bottom', horizontal: 'left' });
});

$("#eventCreateForm").submit(function () {
    var jqxhr = $.post('api/event/create', $('#eventCreateForm').serialize())
        .success(function () {
            $('#calendar').fullCalendar('refetchEvents');
            alert("Saved");
        })
        .error(function (errors) {
            var message = '';
            var a = errors.responseJSON;
            $.each(a, function (i, fieldItem)
            {
                $.each(fieldItem._errors, function (j, error)
                {
                    message += error['<ErrorMessage>k__BackingField']+'\n';                    
                })                
            })
            alert(message);           
        });
    return false;
});

$("#btnPopupSave").click(function (e)
{
    var start = $('#datetimepicker1').data("DateTimePicker").date();
    var end = $('#datetimepicker2').data("DateTimePicker").date();
    if (start != null && end != null) {
        var startDate = start.toDate();
        var endDate = end.toDate();
        if (startDate.getTime() > endDate.getTime()) {
            $('#datetimepicker1').data("DateTimePicker").date(endDate);
            $('#datetimepicker2').data("DateTimePicker").date(startDate);
        }        
    }
    $("#eventCreateForm").submit();
});

$("#btnPopupRemove").click(function () {
    $.ajax({
        type: 'DELETE',
        url: '/api/event/remove?Id=' + $('#infoId').val(),
        success: function () {
            alert("Success!");
            $('#calendar').fullCalendar('refetchEvents');
        }
    });
});

function ClearCreatePopup()
{
    $('#createTitle').val('');
    $('#createDescription').val('');
    $('#createDateAdd').val('');
    $('#datetimepicker1').val('');
    $('#datetimepicker2').val('');
    $('#createLocation').val('');
    $('#createCategory').val('Home');    
}

function ClearInfoPopup() {
    $('#infoId').val('');
    $('#infoTitle').text('');
    $('#infoDescription').text('');
    $('#infoDateStart').text('');
    $('#infoDateEnd').text('');
    $('#infoLocation').text('');
    $('#infoCategory').text('');
}