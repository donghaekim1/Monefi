USE [MoneFi]
GO
/****** Object:  StoredProcedure [dbo].[Files_Delete]    Script Date: 5/17/2023 5:04:15 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author: Dong hae Kim
-- Create date: 05/04/2023
-- Description: This Updates isDeleted
-- Code Reviewer: None

-- MODIFIED BY: Dong hae Kim
-- MODIFIED DATE:05/04/2023
-- Code Reviewer: 
-- Note: 
-- =============================================

CREATE PROC [dbo].[Files_Delete]
    @Id int

AS
/*
Declare @Id int = 5

Select *
from dbo.Files
Where Id= @Id

Execute dbo.Files_Delete
	 @Id

Select *
from dbo.Files
Where Id= @Id
*/

BEGIN

    UPDATE [dbo].[Files]
    SET [IsDeleted] = 1

    WHERE Id = @Id

END
GO
