namespace SmartFullCalendar.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class dateendnullable : DbMigration
    {
        public override void Up()
        {
            AlterColumn("dbo.Events", "DateEnd", c => c.DateTime());
        }
        
        public override void Down()
        {
            AlterColumn("dbo.Events", "DateEnd", c => c.DateTime(nullable: false));
        }
    }
}
