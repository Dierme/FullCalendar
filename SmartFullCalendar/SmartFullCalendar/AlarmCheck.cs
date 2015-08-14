using Microsoft.AspNet.SignalR.Hubs;
using Microsoft.AspNet.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Web;
using System.Web.Hosting;
using SmartFullCalendar.Models.Abstracts;
using SmartFullCalendar.Models;
using System.Net;

namespace SmartFullCalendar
{
    public class AlarmCheck : IRegisteredObject
    {
        private static AlarmCheck instance;

        public static AlarmCheck GetInstance(string UserID, string UserName, IRepository repos)
        {
            if (instance == null)
            {
                instance = new AlarmCheck(UserID, UserName, repos);
                return instance;
            }
            return instance;
        }

        private IRepository _repository;
        private readonly IHubContext _alarmHub;
        private Timer _timer;
        private string _userId;
        private string _userName;


        public AlarmCheck(string UserId, string UserName, IRepository repos)
        {
            _repository = repos;
            _userId = UserId;
            _userName = UserName;
            _alarmHub = GlobalHost.ConnectionManager.GetHubContext<AlarmHub>();
            StartTimer();
        }

        private void StartTimer()
        {

            var delayStartby = 10000;
            var repeatEvery = 10000;

            _timer = new Timer(CheckAlarm, null, delayStartby, repeatEvery);
        }

        private void CheckAlarm(object state)
        {          
            IEnumerable<Event> ListOfEvents = _repository.GetAllUserEventsStartToday(_userId); 
                       
            foreach (Event TheEvent in ListOfEvents)
            {               
                TimeSpan TimeForEvent = TheEvent.DateStart - DateTime.Now;
                double timespanishe = Math.Ceiling(TimeForEvent.TotalMinutes);
                //_alarmHub.Clients.Group(_userName).timeSpan(timespanishe);
               
                if (timespanishe == 60 && !TheEvent.Checked)
                {
                    TheEvent.Checked = true;
                    _alarmHub.Clients.Group(_userName).upcomingEvent("Title: " + TheEvent.Title + "<br>" + "Begins: " + TheEvent.DateStart.ToString());
        
                }
            } 
        }

        public void Stop(bool immediate)
        {
            _timer.Dispose();

            HostingEnvironment.UnregisterObject(this);
        }
    }
}