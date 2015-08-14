namespace SmartFullCalendar.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class somemigration : DbMigration
    {
        public override void Up()
        {
            AlterColumn("dbo.Events", "Checked", c => c.Boolean(nullable: false));
        }
        
        public override void Down()
        {
            AlterColumn("dbo.Events", "Checked", c => c.Boolean());
        }
    }
}
