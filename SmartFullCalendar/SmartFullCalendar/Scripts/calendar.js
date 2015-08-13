$('#calendar').fullCalendar({
    header:{
        left: 'prev,next,today',
        center: 'title',
        right: 'month, agendaWeek, agendaDay'
    },
    editable: false,
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
                        add: $(this).attr('DateAdd'),
                        color: $(this).attr('ColorName'),
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

        ClearEditPopup();        
        $('#editTitle').val(calEvent.title);
        $('#editDescription').val(calEvent.description);
        $('#editDateAdd').val(calEvent.add);
        $('#editdatetimepicker1').data("DateTimePicker").date(calEvent.start);
        $('#editdatetimepicker2').data("DateTimePicker").date(calEvent.end);
        $('#editLocation').val(calEvent.location);
        $('#editCategory').val(calEvent.category);        
        $('#editId').val(calEvent.id);

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
    $('#editdatetimepicker1').datetimepicker();
    $('#editdatetimepicker2').datetimepicker();
    $('#dateReport1').datetimepicker();
    $('#dateReport2').datetimepicker();
    $('#datetimepicker1').data("DateTimePicker").widgetPositioning({ vertical: 'bottom', horizontal: 'left' });
    $('#datetimepicker2').data("DateTimePicker").widgetPositioning({ vertical: 'bottom', horizontal: 'left' });
});

$("#eventCreateForm").submit(function () {
    var jqxhr = $.post('api/event/', $('#eventCreateForm').serialize())
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

$("#btnPopupEdit").click(function () {
        $("#editDialog").modal('show');
        $("#infoDialog").modal('hide');
    });

$("#btnPopupSaveChanges").click(function () {
        var editEvent = {
                Id: $('#editId').val(),
                Title: $('#editTitle').val(),
                DateAdd: new Date(),
                DateStart: $('#editdatetimepicker1').data("DateTimePicker").date().toDate(),
                DateEnd: $('#editdatetimepicker2').data("DateTimePicker").date().toDate(),
                Description: $('#editDescription').val(),
                Location: $('#editLocation').val(),
                Category: $('#editCategory').val(),
            };
    $.ajax({
            type: 'PUT',
            url: '/api/event/',
            data: JSON.stringify(editEvent),
            contentType: "application/json;charset=utf-8",
            dataType: 'JSON',
            success: function () {
                alert("Success");
                $('#calendar').fullCalendar('refetchEvents');
            },
        error: function (e) {
                alert(e);
            },
    });
});


$("#btnReport").click(function (e) {
    var start = $('#dateReport1').data("DateTimePicker").date();
    var end = $('#dateReport2').data("DateTimePicker").date();
    if (start != null && end != null) {
        var startDate = start.toDate().toISOString();
        var endDate = end.toDate().toISOString();
        var url = "/Report/Index?startISO=" + startDate + "&endISO=" + endDate;
        window.location.assign(url);
        console.log(startDate);
        console.log(endDate);
        console.log(url);
        window.location.assign(url);
    }    
});

function ClearCreatePopup()
{
    $('#createTitle').val('');
    $('#createDescription').val('');
    $('#createDateAdd').val('');
    $('#datetimepicker1 input').val('');
    $('#datetimepicker2 input').val('');
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

function ClearEditPopup() {
    $('#editTitle').val('');
    $('#editDescription').val('');
    $('#editDateAdd').val('');
    $('#editdatetimepicker1 input').val('');
    $('#editdatetimepicker2 input').val('');
    $('#editLocation').val('');
    $('#editCategory').val('Home');
}