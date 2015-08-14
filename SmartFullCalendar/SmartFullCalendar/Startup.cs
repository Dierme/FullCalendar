using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(SmartFullCalendar.Startup))]
namespace SmartFullCalendar
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
            app.MapSignalR();
        }
    }
}
