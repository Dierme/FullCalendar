using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace SmartFullCalendar.Helpers
{
    public static class Helpers
    {
        public static MvcHtmlString PageLinks(this HtmlHelper html, PagingInfo pagingInfo, Func<int, string> pageUrl)
        {
            TagBuilder ul = new TagBuilder("ul");
            ul.AddCssClass("pagination");

            TagBuilder liLeft = new TagBuilder("li");
            TagBuilder aLeft = new TagBuilder("a");
            if (pagingInfo.CurrentPage <= 1)
            {
                liLeft.AddCssClass("disabled");
            }
            else
            {
                aLeft.MergeAttribute("href", pageUrl(pagingInfo.CurrentPage - 1));
            }
            aLeft.InnerHtml = "&larr;";
            liLeft.InnerHtml += aLeft;
            ul.InnerHtml += liLeft;

            for (int i = 1; i <= pagingInfo.TotalPages; i++)
            {
                TagBuilder li = new TagBuilder("li");
                TagBuilder a = new TagBuilder("a");
                a.MergeAttribute("href", pageUrl(i));
                a.InnerHtml = i.ToString();
                li.InnerHtml += a;

                if (i == pagingInfo.CurrentPage)
                    li.AddCssClass("active");

                ul.InnerHtml += li;
            }

            TagBuilder liRight = new TagBuilder("li");
            TagBuilder aRight = new TagBuilder("a");
            if (pagingInfo.CurrentPage >= pagingInfo.TotalPages)
            {
                liRight.AddCssClass("disabled");
            }
            else
            {
                aRight.MergeAttribute("href", pageUrl(pagingInfo.CurrentPage + 1));
            }
            aRight.InnerHtml = "&rarr;";
            liRight.InnerHtml += aRight;
            ul.InnerHtml += liRight;
            return MvcHtmlString.Create(ul.ToString());
        }
    }
}