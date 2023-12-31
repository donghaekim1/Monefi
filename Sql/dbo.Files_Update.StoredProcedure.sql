USE [MoneFi]
GO
/****** Object:  StoredProcedure [dbo].[Files_Update]    Script Date: 5/25/2023 12:37:55 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE proc [dbo].[Files_Update]
				@IsDeleted bit,
				@Id int
as

/*

Declare @Id int = 99

Declare @IsDeleted bit = 1

Select *
from dbo.Files
Where Id = @Id

Execute dbo.Files_Update
		@Id	
		,@IsDeleted	

Select *
from dbo.Files
Where Id = @Id
*/

BEGIN

UPDATE [dbo].[Files]

   SET [IsDeleted] = @IsDeleted

	From dbo.Files

 WHERE Id = @Id

END
GO
