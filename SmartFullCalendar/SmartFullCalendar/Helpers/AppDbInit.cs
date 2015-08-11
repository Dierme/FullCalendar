using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using SmartFullCalendar.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;

namespace SmartFullCalendar.Helpers
{
    public class AppDbInit : CreateDatabaseIfNotExists<ApplicationDbContext>
    {
        protected override void Seed(ApplicationDbContext context)
        {
            var userManager = new UserManager<ApplicationUser>(new UserStore<ApplicationUser>(context));

            var user = new ApplicationUser { UserName = "bb@bb.com", Email = "bb@bb.com" };
            string password = "123Aa123";
            var result = userManager.Create(user, password);

            var testEvent = new Event()
            {
                Id = "1",
                DateAdd = DateTime.Now,
                DateEnd = DateTime.Now.AddDays(3),
                DateStart = DateTime.Now,
                Category = Category.Fun,
                Description = "test",
                Location = "test",
                Title = "test",
                UserId = user.Id
            };
            var testEvent2 = new Event()
            {
                Id = "2",
                DateAdd = DateTime.Now,
                DateEnd = DateTime.Now.AddMonths(1).AddDays(3),
                DateStart = DateTime.Now.AddMonths(1),
                Category = Category.Fun,
                Description = "test",
                Location = "test",
                Title = "test",
                UserId = user.Id
            };
            context.Events.Add(testEvent);
            context.Events.Add(testEvent2);

            context.SaveChanges();
            base.Seed(context);
        }
        public AppDbInit() {  }

    }
}