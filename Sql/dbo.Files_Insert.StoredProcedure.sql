USE [MoneFi]
GO
/****** Object:  StoredProcedure [dbo].[Files_Insert]    Script Date: 5/17/2023 5:04:15 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author: Dong hae Kim
-- Create date: 05/04/2023
-- Description: Insert procedure for Files
-- Code Reviewer: None

-- MODIFIED BY: Dong hae Kim
-- MODIFIED DATE:05/11/2023
-- Code Reviewer: 
-- Note: I deleted IsDeleted from the insert proc 
-- because it is already defaulted to 0 so it should not be in my insert proc
-- =============================================

CREATE proc [dbo].[Files_Insert]
			 @Name nvarchar(100)
			,@Url nvarchar(255)
			,@FileTypeId int
            ,@CreatedBy int
			,@Id int OUTPUT

as

/*
Declare 	@Name nvarchar(100) = 'test'
			,@Url nvarchar(255) = 'test'
			,@FileTypeId int = 1
            ,@CreatedBy int = 1
			,@Id int = 0
Execute dbo.Files_Insert
			@Name
			,@Url
			,@FileTypeId
            ,@CreatedBy
			,@Id OUTPUT

Select *
from dbo.Files


*/

BEGIN

INSERT INTO [dbo].[Files]
           ([Name]
           ,[Url]
           ,[FileTypeId]
           ,[CreatedBy])
     VALUES
           (@Name
		   ,@Url
		   ,@FileTypeId
		   ,@CreatedBy)

		   SET @Id = SCOPE_IDENTITY()


END
GO
