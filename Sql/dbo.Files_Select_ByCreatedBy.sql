USE [MoneFi]
GO
/****** Object:  StoredProcedure [dbo].[Files_Select_ByCreatedBy]    Script Date: 6/12/2023 10:03:58 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author: Dong hae Kim
-- Create date: 05/04/2023
-- Description: Select Paginated by CreatedBy procedure
-- Code Reviewer: None

-- MODIFIED BY: Dong hae Kim
-- MODIFIED DATE:05/26/2023
-- Code Reviewer: 
-- Note: Adding User's full name and ordering my selected by with date created
-- =============================================

ALTER proc [dbo].[Files_Select_ByCreatedBy]
				@PageIndex int
				,@PageSize int
				,@CreatedBy int

as
/*
Declare @PageIndex int = 0
		,@PageSize int = 2
		,@CreatedBy int = 1

Execute dbo.Files_Select_ByCreatedBy
		@PageIndex
		,@PageSize
		,@CreatedBy

*/

BEGIN

		
	 Declare @offset int = @PageIndex * @PageSize

	 SELECT f.[Id]
      ,f.[Name]
      ,[Url]
      ,[FileTypeId]
	  ,ft.Name as FileTypeName
      ,[IsDeleted]
      ,[CreatedBy]
	  ,u.FirstName
	  ,u.Mi
	  ,u.LastName
	  ,u.AvatarUrl
      ,f.[DateCreated]
	  ,[TotalCount] = COUNT(1) OVER()

	FROM [dbo].[Files] as f
	INNER JOIN dbo.FileTypes as ft ON f.FileTypeId = ft.Id
	INNER JOIN dbo.Users as u on f.CreatedBy = u.Id

	WHERE f.CreatedBy = @CreatedBy

	ORDER BY f.DateCreated DESC

	OFFSET @offSet Rows
	Fetch Next @PageSize Rows ONLY


END