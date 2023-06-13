using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Build.Utilities;
using Microsoft.CodeAnalysis.Host;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Sabio.Models;
using Sabio.Models.Files;
using Sabio.Models.Requests;
using Sabio.Services;
using Sabio.Services.Interfaces;
using Sabio.Web.Api.StartUp.DependencyInjection;
using Sabio.Web.Controllers;
using Sabio.Web.Models.Responses;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Threading.Tasks;

namespace Sabio.Web.Api.Controllers
{
    [Route("api/files")]
    [ApiController]
    public class FileApiController : BaseApiController
    {
        private IFileService _service = null;
        private IAuthenticationService<int> _authService = null;

        public FileApiController(IFileService service
            , ILogger<FileApiController> logger
            , IAuthenticationService<int> authService) : base(logger) 
        {
            _service = service;
            _authService = authService;
        }

        [HttpPost("aws/upload")]
        public async Task<ActionResult<List<FileResponse>>> UploadFiles(List<IFormFile> files)
        {
            List<FileResponse> fileResponses = new List<FileResponse>();
            ObjectResult result = null;

            try
            {
                int userId = _authService.GetCurrentUserId();
                fileResponses = await _service.UploadFilesAsync(files, userId);

                ItemResponse<List<FileResponse>> response = new ItemResponse<List<FileResponse>>();
                response.Item = fileResponses;
                result = Created201(response);
            }
            catch (Exception ex)
            {
                ErrorResponse response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
                result = StatusCode(500, response);
            }

            return result;
        }

        [AllowAnonymous]
        [HttpPost("register/upload")]
        public async Task<ActionResult<List<FileResponse>>> UploadFilesAnonymous(List<IFormFile> files)
        {
            List<FileResponse> fileResponses = new List<FileResponse>();
            ObjectResult result = null;

            try
            {
                int userId = 0;
                fileResponses = await _service.UploadFilesAsync(files, userId);

                ItemResponse<List<FileResponse>> response = new ItemResponse<List<FileResponse>>();
                response.Item = fileResponses;
                result = Created201(response);
            }
            catch (Exception ex)
            {
                ErrorResponse response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
                result = StatusCode(500, response);
            }

            return result;
        }

        [HttpPost]
        public ActionResult<ItemResponse<int>> Add(FileAddRequest model)
        {

            int userId = _authService.GetCurrentUserId();
            ObjectResult result = null;

            try
            {
                int id = _service.Add(model, userId); 

                ItemResponse<int> response = new ItemResponse<int>();
                response.Item = id;

                result = Created201(response);
            }
            catch (Exception ex)
            {
                Logger.LogError(ex.ToString());
                ErrorResponse response = new ErrorResponse(ex.Message);

                result = StatusCode(500, response);
            }

            return result;
        }

        [HttpGet("users/{userId:int}")]
        public ActionResult<ItemResponse<Paged<File>>> GetPageByCreatedBy(int pageIndex, int pageSize, int userId)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                Paged<File> paged = _service.GetByCreatedBy(pageIndex, pageSize, userId);
                if (paged == null)
                {
                    code = 404;
                    response = new ErrorResponse("App Resource not found");
                }
                else
                {
                    response = new ItemResponse<Paged<File>>() { Item = paged };
                }
            }
            catch (Exception ex)
            {
                Logger.LogError(ex.ToString());
                code = 500;
                response = new ErrorResponse(ex.Message.ToString());
            }

            return StatusCode(code, response);
        }

        [HttpGet("deleted/{isDeleted:bool}")]
        public ActionResult<ItemResponse<Paged<File>>> GetByIsDeleted(int pageIndex, int pageSize, bool isDeleted)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                Paged<File> paged = _service.GetByIsDeleted(pageIndex, pageSize, isDeleted);
                if (paged == null)
                {
                    code = 404;
                    response = new ErrorResponse("App Resource not found");
                }
                else
                {
                    response = new ItemResponse<Paged<File>>() { Item = paged };
                }
            }
            catch (Exception ex)
            {
                Logger.LogError(ex.ToString());
                code = 500;
                response = new ErrorResponse(ex.Message.ToString());
            }

            return StatusCode(code, response);
        }

        [HttpPut("{id:int}")]
        public ActionResult<SuccessResponse> Update(FileUpdateRequest model)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                _service.Update(model);
                response = new SuccessResponse();


            }
            catch (Exception ex)
            {

                code = 500;
                response = new ErrorResponse(ex.Message);
            }

            return StatusCode(code, response);

        }

        [HttpGet("")]
        public ActionResult<ItemResponse<Paged<File>>> GetAll(int pageIndex, int pageSize)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                Paged<File> paged = _service.GetAll(pageIndex, pageSize);
                if (paged == null)
                {
                    code = 404;
                    response = new ErrorResponse("App Resource not found.");
                }
                else
                {
                    response = new ItemResponse<Paged<File>>(){ Item = paged };
                }
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
            }

            return StatusCode(code, response);
        }

        [HttpDelete("{id:int}")]
        public ActionResult<SuccessResponse> Delete(int id)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                _service.Delete(id);
                response = new SuccessResponse();
            }
            catch (Exception ex)
            {
                code = 500;
                response = new ErrorResponse(ex.Message);
            }

            return StatusCode(code, response);
        }

        [HttpGet("search")]
        public ActionResult<ItemResponse<Paged<File>>> SearchPagination(int pageIndex, int pageSize, string query, bool? isDeleted = null)
        {
            int code = 200;
            BaseResponse response = null;

            try
            {
                Paged<File> paged = _service.SearchPagination(pageIndex, pageSize, query, isDeleted);
                if (paged == null)
                {
                    code = 404;
                    response = new ErrorResponse("App Resource not found.");
                }
                else
                {
                    response = new ItemResponse<Paged<File>>() { Item = paged };
                }
            }
            catch (Exception ex)
            {
                Logger.LogError(ex.ToString());
                response = new ErrorResponse(ex.Message.ToString());
            }

            return StatusCode(code, response);
        }

    }
}
