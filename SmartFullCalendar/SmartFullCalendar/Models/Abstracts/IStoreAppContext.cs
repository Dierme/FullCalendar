using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartFullCalendar.Models.Abstracts
{
    public interface IStoreAppContext
    {
        DbSet<Event> Events { get; }
        Task<int> SaveChangesAsync();
    }
}
