using SmartFullCalendar.Helpers;
using SmartFullCalendar.Models;
using SmartFullCalendar.Models.Abstracts;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Microsoft.AspNet.Identity;

namespace SmartFullCalendar.Controllers
{
    public class ReportController : Controller
    {
        public int PageSize = 8;

        private IRepository repository;

        public ReportController(IRepository repo)
        {
            repository = repo;
        }

        [HttpGet]
        public ActionResult Index(string startISO, string endISO, int page = 1)
        {
            DateTime startDate;
            DateTime endDate;
            DateTime.TryParse(startISO, out startDate);
            DateTime.TryParse(endISO, out endDate);

            string userId = User.Identity.GetUserId();
            ListViewModel<Event> model = new ListViewModel<Event>()
            {
                List = repository.TakeAllFromTo(userId, startDate, endDate).OrderBy(p => p.DateStart)
                    .Skip((page - 1) * PageSize).Take(PageSize),

                PagingInfo = new PagingInfo()
                {
                    CurrentPage = page,
                    ItemsPerPage = PageSize,
                    TotalItems = repository.TakeAllFromTo(userId, startDate, endDate).Count()
                },
                StartISO = startISO,
                EndISO = endISO,
                ShortStartDateString = startDate.ToShortDateString() + " " + startDate.ToShortTimeString(),
                ShortEndDateString = endDate.ToShortDateString() + " " + endDate.ToShortTimeString()
            };
            return View(model);

        }
    }
}