using SmartFullCalendar.Helpers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SmartFullCalendar.Models
{
    public class ListViewModel<T>
    {
        public IEnumerable<T> List { get; set; }
        public PagingInfo PagingInfo { get; set; }
        public string StartISO { get; set; }
        public string EndISO { get; set; }
        public string ShortStartDateString { get; set; }
        public string ShortEndDateString { get; set; }

    }
}