USE [MoneFi]
GO
/****** Object:  StoredProcedure [dbo].[FileTypes_SelectAll]    Script Date: 5/17/2023 5:04:15 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author: Dong hae Kim
-- Create date: 05/04/2023
-- Description: SelectAll procedure for FileTypes
-- Code Reviewer: None

-- MODIFIED BY: Dong hae Kim
-- MODIFIED DATE:05/04/2023
-- Code Reviewer: 
-- Note: 
-- =============================================


CREATE proc [dbo].[FileTypes_SelectAll]



as
/*


Execute dbo.FileTypes_SelectAll

Select *
from dbo.FileTypes

*/

BEGIN


SELECT [Id]
      ,[Name]
  FROM [dbo].[FileTypes]

END
GO
