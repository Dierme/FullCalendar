using Microsoft.AspNet.Identity;
using SmartFullCalendar.Models;
using SmartFullCalendar.Models.Abstracts;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;

namespace SmartFullCalendar.Controllers
{
    [Authorize]
    public class EventController : ApiController
    {
        private IRepository repository;

        public EventController(IRepository repos)
        {
            repository = repos;
        }

        [HttpPost]
        [ActionName("Create")]
        public async Task<HttpResponseMessage> CreateEvent([FromBody]Event item)
        {
            if (item != null) 
            {
                item.UserId = User.Identity.GetUserId();
                item.ColorName = GetEnumColor(item.Category);
                item.Checked = false;
            }

            if (!ModelState.IsValid)
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest, ModelState);
            }
            IdentityResult result = await repository.Create(item);
            HttpResponseMessage errorResult = GetErrorResult(result);

            if (errorResult != null)
            {
                return errorResult;
            }
            return Request.CreateResponse(HttpStatusCode.Created);
        }

        [HttpPut]
        public async Task<HttpResponseMessage> UpdateEvent([FromBody]Event item)
        {
            if (item != null)
            {
                item.UserId = User.Identity.GetUserId();
                item.ColorName = GetEnumColor(item.Category);
                item.Checked = false;
            }
            if (!ModelState.IsValid)
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest, ModelState);
            }
            IdentityResult result = await repository.Update(item);
            HttpResponseMessage errorResult = GetErrorResult(result);

            if (errorResult != null)
            {
                return errorResult;
            }

            return Request.CreateResponse(HttpStatusCode.OK, item);
        }

        [HttpDelete]
        [ActionName("Remove")]
        public async Task<HttpResponseMessage> RemoveEvent(string Id)
        {
            if (!ModelState.IsValid)
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest, ModelState);
            }
            IdentityResult result = await repository.Remove(Id);
            HttpResponseMessage errorResult = GetErrorResult(result);

            if (errorResult != null)
            {
                return errorResult;
            }

            return new HttpResponseMessage(HttpStatusCode.OK);
        }

        [HttpGet]
        public async Task<HttpResponseMessage> GetEvent(string id)
        {

            Event result = await repository.TakeEvent(id);

            if (result == null)
            {
                return Request.CreateResponse(HttpStatusCode.NotFound);
            }

            return Request.CreateResponse(HttpStatusCode.OK, result);
        }

        [HttpGet]
        public HttpResponseMessage GetAll(string startISO, string endISO)
        {
            DateTime startDate;
            DateTime endDate;
            var converted = DateTime.TryParse(startISO, out startDate);
            converted = DateTime.TryParse(endISO, out endDate);
            if (converted)
            {
                var userId = User.Identity.GetUserId();
                var result = repository.TakeAllFromTo(userId, startDate, endDate).ToArray();
                return Request.CreateResponse(HttpStatusCode.OK, result);
            }
            return Request.CreateResponse(HttpStatusCode.BadRequest);
        }

        #region Helpers  
        private string GetEnumColor(Category category)
        {
            switch (category) 
            {
                case Category.Home:
                    return "#CD9B1D";                    
                case Category.Business:
                    return "#9400D3";                    
                case Category.Study:
                    return "#A0522D";
                case Category.Other:
                    return "#3A5FCD";
                case Category.Fun:
                    return "#EE6363";
                default:
                    return "#CD6090";
            };
        }
        private HttpResponseMessage GetErrorResult(IdentityResult result)
        {
            if (result == null)
            {
                return Request.CreateResponse(HttpStatusCode.NotFound);
            }

            if (!result.Succeeded)
            {
                if (result.Errors != null)
                {
                    foreach (string error in result.Errors)
                    {
                        ModelState.AddModelError("", error);
                    }
                }

                if (ModelState.IsValid)
                {
                    // No ModelState errors are available to send, so just return an empty BadRequest.
                    return Request.CreateResponse(HttpStatusCode.BadRequest);
                }

                return Request.CreateResponse(HttpStatusCode.BadRequest, ModelState);
            }

            return null;
        }
        #endregion
    }
}