using Microsoft.AspNet.Identity;
using SmartFullCalendar.Models.Abstracts;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;

namespace SmartFullCalendar.Models.EFRpositories
{
    public class EventRepository : IRepository
    {
        private IStoreAppContext context;

        public EventRepository()
            : this(new ApplicationDbContext())
        { }

        public EventRepository(IStoreAppContext appContext)
        {
            context = appContext;
        }

        public IQueryable<Event> List
        {
            get { return context.Events; }
        }

        public async Task<IdentityResult> Create(Event item)
        {             
            item.Id = Guid.NewGuid().ToString();            
            context.Events.Add(item);
            var result = await SaveChangesAsync();
            return result;
        }

        public async Task<IdentityResult> Update(Event item)
        {
            Event dbEntry = await context.Events.FindAsync(item.Id);
            if (dbEntry != null)
            {
                dbEntry.Title = item.Title;
                dbEntry.Description = item.Description;
                dbEntry.Category = item.Category;
                dbEntry.DateAdd = item.DateAdd;
                dbEntry.DateStart = item.DateStart;
                dbEntry.DateEnd = item.DateEnd;
                dbEntry.Location = item.Location;
                dbEntry.UserId = item.UserId;
                dbEntry.ColorName = item.ColorName;
                dbEntry.Checked = item.Checked;
            }
            else
            {
                return null;
            }
            var result = await SaveChangesAsync();
            return result;
        }

        public async Task<IdentityResult> Remove(string id)
        {
            IdentityResult result;

            Event dbEntry = await context.Events.FindAsync(id);
            if (dbEntry != null)
            {
                context.Events.Remove(dbEntry);
            }
            else
            {
                result = IdentityResult.Failed("Object not found and can't be deleted");
                return result;
            }
            result = await SaveChangesAsync();

            return result;
        }

        public async Task<Event> TakeEvent(string id)
        {

            Event dbEntry = await context.Events.FindAsync(id);
            if (dbEntry != null)
            {
                return dbEntry;
            }
            else
            {
                return null;
            }
        }

        public IEnumerable<Event> TakeAllFromTo(string userId, DateTime start, DateTime end)
        {
            var result = context.Events
                    .Where(x =>x.UserId==userId && (x.DateStart >= start && x.DateStart <= end));            
            return result;
        }

        public IEnumerable<Event> GetAllUserCurrentEvents(string userId, DateTime today)
        {
            var result = context.Events
                    .Where(x => x.UserId == userId && ((x.DateStart <= today && x.DateEnd >= today) || (x.DateStart.Day == today.Day && x.DateStart.Month == today.Month && x.DateStart.Year == today.Year) ));
            return result;
        }

        public IEnumerable<Event> GetAllUserEventsStartToday(string userId)
        {
            var result = context.Events
                    .Where(x => x.UserId == userId && (x.DateStart.Day == DateTime.Now.Day && x.DateStart.Month == DateTime.Now.Month && x.DateStart.Year == DateTime.Now.Year));
            return result;
        }

        private async Task<IdentityResult> SaveChangesAsync()
        {
            try
            {
                await context.SaveChangesAsync();
                return IdentityResult.Success;
            }
            catch (Exception e)
            {
                return IdentityResult.Failed(e.Message);
            }
        }
        private static DateTime ConvertFromUnixTimestamp(double timestamp)
        {
            var origin = new DateTime(1970, 1, 1, 0, 0, 0, 0);
            return origin.AddSeconds(timestamp);
        }

    }
}