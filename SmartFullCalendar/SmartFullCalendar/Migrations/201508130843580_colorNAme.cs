namespace SmartFullCalendar.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class colorNAme : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Events", "ColorName", c => c.String());
        }
        
        public override void Down()
        {
            DropColumn("dbo.Events", "ColorName");
        }
    }
}
