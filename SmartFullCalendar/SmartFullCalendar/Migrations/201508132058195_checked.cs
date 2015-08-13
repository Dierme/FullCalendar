namespace SmartFullCalendar.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class _checked : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Events", "Checked", c => c.Boolean());
        }
        
        public override void Down()
        {
            DropColumn("dbo.Events", "Checked");
        }
    }
}
