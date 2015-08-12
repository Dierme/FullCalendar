﻿$('#calendar').fullCalendar({
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
        alert("hi");
    },

    select: function (startDate, endDate, allDay, jsEvent, view) {
        ClearCreatePopup();        
        $('input[name =DateAdd]').val(new Date().toISOString());
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

$("#eventForm").submit(function () {
    var jqxhr = $.post('api/event/create', $('#eventForm').serialize())
        .success(function () {
            $('#calendar').fullCalendar('refetchEvents');
            alert("Saved");
        })
        .error(function (errors) {
            var message = '';
            var a = errors.responseJSON;
            $.each(a, function (i, fieldItem)
            {
                console.log(fieldItem);
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
        console.log(startDate);
        console.log(endDate);
        if (startDate.getTime() > endDate.getTime()) {
            $('#datetimepicker1').data("DateTimePicker").date(endDate);
            $('#datetimepicker2').data("DateTimePicker").date(startDate);
        }
        startDate = $('#datetimepicker1').data("DateTimePicker").date().toDate();
        endDate = $('#datetimepicker2').data("DateTimePicker").date().toDate();       
    }
    alert($('input[name =DateStart]').val());
    alert($('input[name =DateEnd]').val());
    $("#eventForm").submit();
});

function ClearCreatePopup()
{
    $('input[name =Title]').val('');
    $('input[name =Description]').val('');
    $('input[name =DateAdd]').val('');
    $('#datetimepicker1').data("DateTimePicker").date('');
    $('#datetimepicker1').data("DateTimePicker").date('');
    $('input[name =DateEnd]').val('');
    $('input[name =Location]').val('');
    $('input[name =Description]').val('');
}