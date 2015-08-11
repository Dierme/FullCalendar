using Microsoft.AspNet.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;

namespace SmartFullCalendar.Models.Abstracts
{
    public interface IRepository
    {
        Task<IdentityResult> Update(Event item);
        Task<IdentityResult> Remove(string id);
        Task<IdentityResult> Create(Event item);
        Task<Event> TakeEvent(string id);
        IEnumerable<Event> TakeAllFromTo(string Id, DateTime startDate, DateTime endDate);

    }
}