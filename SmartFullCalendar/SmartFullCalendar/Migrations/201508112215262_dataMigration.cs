namespace SmartFullCalendar.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class dataMigration : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("dbo.Events", "UserId", "dbo.AspNetUsers");
            DropIndex("dbo.Events", new[] { "UserId" });
            AlterColumn("dbo.Events", "UserId", c => c.String(maxLength: 128));
            CreateIndex("dbo.Events", "UserId");
            AddForeignKey("dbo.Events", "UserId", "dbo.AspNetUsers", "Id");
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.Events", "UserId", "dbo.AspNetUsers");
            DropIndex("dbo.Events", new[] { "UserId" });
            AlterColumn("dbo.Events", "UserId", c => c.String(nullable: false, maxLength: 128));
            CreateIndex("dbo.Events", "UserId");
            AddForeignKey("dbo.Events", "UserId", "dbo.AspNetUsers", "Id", cascadeDelete: true);
        }
    }
}
