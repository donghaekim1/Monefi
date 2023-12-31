USE [MoneFi]
GO
/****** Object:  StoredProcedure [dbo].[Files_SearchPagination]    Script Date: 6/12/2023 10:03:45 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author: Dong hae Kim
-- Create date: 05/04/2023
-- Description: This is a search pagination 
-- Code Reviewer: None

-- MODIFIED BY: Dong hae Kim
-- MODIFIED DATE:06/12/2023
-- Code Reviewer: 
-- Note: Allowing names to be searchable through the search bar by adding a condition in line 65-68
-- =============================================

ALTER proc [dbo].[Files_SearchPagination]
				@PageIndex int
				,@PageSize int
				,@Query nvarchar(100)
				,@IsDeleted bit = null

as
/*
Declare @PageIndex int = 0
		,@PageSize int = 4
		,@Query nvarchar(100) = 'test'

Execute dbo.Files_SearchPagination
		@PageIndex
		,@PageSize
		,@Query

		Select *
		from dbo.FileTypes

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

 FROM [dbo].[Files] AS f
  INNER JOIN dbo.FileTypes AS ft ON f.FileTypeId = ft.Id
  INNER JOIN dbo.Users AS u ON f.CreatedBy = u.Id

  WHERE (f.Name LIKE @Query + '%'
		OR ft.Name LIKE @Query + '%'
		OR u.FirstName LIKE @Query + '%'
		OR u.LastName LIKE @Query + '%')
    AND (@IsDeleted IS NULL OR f.IsDeleted = @IsDeleted)

  ORDER BY f.DateCreated DESC
  OFFSET @Offset ROWS
  FETCH NEXT @PageSize ROWS ONLY

END