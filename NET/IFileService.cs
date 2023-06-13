using Microsoft.AspNetCore.Http;
using Sabio.Models;
using Sabio.Models.Files;
using Sabio.Models.Requests;
using Sabio.Web.Models.Responses;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Sabio.Services.Interfaces
{
    public interface IFileService
    {
        int Add(FileAddRequest model, int userId);

        Paged<File> GetByCreatedBy(int pageIndex, int pageSize, int userId);

        Paged<File> GetByIsDeleted(int pageIndex, int pageSize, bool isDeleted);

        Paged<File> GetAll(int pageIndex, int pageSize);

        void Delete(int id);

        void Update(FileUpdateRequest model);

        Paged<File> SearchPagination(int pageIndex, int pageSize, string query, bool? isDeleted = null);

        Task<List<FileResponse>> UploadFilesAsync(List<IFormFile> files, int userId);
    }
}