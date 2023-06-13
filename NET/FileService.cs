using Sabio.Data.Providers;
using Sabio.Models.Files;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Sabio.Data;
using static System.Net.Mime.MediaTypeNames;
using Sabio.Models;
using Sabio.Models.Requests;
using Sabio.Models.Domain;
using Microsoft.AspNetCore.Http;
using System.IO;
using Sabio.Web.Models.Responses;
using Amazon.S3;
using Amazon.S3.Transfer;
using Amazon.Runtime;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;
using Sabio.Models.AppSettings;
using File = Sabio.Models.Files.File;
using System.Drawing.Text;
using Sabio.Services.Interfaces;
using Sabio.Models.Enums;

namespace Sabio.Services
{
    public class FileService : IFileService
    {
        IDataProvider _data = null;
        private AWSStorageConfig _awsKeys;

        public FileService(IDataProvider data, IConfiguration config, IOptions<AWSStorageConfig> awsKeys)
        {
            _data = data;
            _awsKeys = awsKeys.Value;
        }

        private int GetFileTypeId(string fileExt)
        {
            switch (fileExt.ToLower())
            {
                case ".pdf":
                    return (int)FileType.Pdf;
                case ".txt":
                    return (int)FileType.Txt;
                case ".jpg":
                case ".png":
                case ".jpeg":
                    return (int)FileType.Image;
                case ".gif":
                    return (int)FileType.Gif;
                case ".xlsx":
                    return (int)FileType.Xlsx;
                case ".doc":
                case ".docx":
                    return (int)FileType.Doc;
                case ".ppt":
                case ".pptx":
                    return (int)FileType.Ppt;
                case ".mov":
                    return (int)FileType.Mov;
                case ".htm":
                case ".html":
                    return (int)FileType.Html;
                case ".zip":
                    return (int)FileType.Zip;
                case ".mp3":
                    return (int)FileType.Mp3;
                case ".mp4":
                    return (int)FileType.Mp4;
                default:
                    return 0;
            }
        }

        public async Task<List<FileResponse>> UploadFilesAsync(List<IFormFile> files, int userId)
        {
            List<FileResponse> fileResponses = new List<FileResponse>();

            var credentials = new BasicAWSCredentials(_awsKeys.AccessKey, _awsKeys.Secret);
            var config = new AmazonS3Config()
            {
                RegionEndpoint = Amazon.RegionEndpoint.USWest2
            };

            using var client = new AmazonS3Client(credentials, config);
            var fileTransferUtility = new TransferUtility(client);

            foreach (var file in files)
            {
                var fileExt = Path.GetExtension(file.FileName);
                var keyName = $"{Guid.NewGuid()}/{file.FileName}";

                var filePath = Path.GetTempFileName();

                using (var stream = System.IO.File.Create(filePath))
                {
                    await file.CopyToAsync(stream);
                }

                var fileTypeId = GetFileTypeId(fileExt);

                if (fileTypeId == 0)
                {
                    throw new Exception("Encountered unexpected File type. Could not upload.");
                }

                var request = new FileAddRequest
                {
                    Name = file.FileName,
                    Url = $"https://sabio-training.s3-us-west-2.amazonaws.com/{keyName}",
                    FileTypeId = fileTypeId
                };

                var uploadRequest = new TransferUtilityUploadRequest()
                {
                    BucketName = _awsKeys.BucketName,
                    FilePath = filePath,
                    Key = keyName
                };

                await fileTransferUtility.UploadAsync(uploadRequest);

                int fileId = Add(request, userId);

                var fileResponse = new FileResponse
                {
                    FileId = fileId,
                    Url = request.Url
                };

                fileResponses.Add(fileResponse);
            }

            return fileResponses;
        }

        public int Add(FileAddRequest model, int userId)
        {
            int id = 0;

            string procName = "[dbo].[Files_Insert]";
            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {
                AddCommonParams(model, col);
                col.AddWithValue("@CreatedBy", userId);

                SqlParameter idOut = new SqlParameter("@Id", SqlDbType.Int);
                idOut.Direction = ParameterDirection.Output;

                col.Add(idOut);

            }, returnParameters: delegate (SqlParameterCollection returnCollection)
            {
                object oId = returnCollection["@Id"].Value;

                int.TryParse(oId.ToString(), out id);

            });

            return id;
        }

        public Paged<File> GetByCreatedBy(int pageIndex, int pageSize, int userId)
        {
            Paged<File> pagedList = null;

            List<File> list = null;

            int totalCount = 0;

            _data.ExecuteCmd("[dbo].[Files_Select_ByCreatedBy]", (param) =>
            {
                param.AddWithValue("@PageIndex", pageIndex);
                param.AddWithValue("@PageSize", pageSize);
                param.AddWithValue("@CreatedBy", userId);
            },
                (reader, recordSetIndex) =>
                {
                    int index = 0;
                    File file = MapFile(reader, ref index);
                    if (totalCount == 0)
                    {
                        totalCount = reader.GetSafeInt32(index);
                    }

                    if (list == null)
                    {
                        list = new List<File>();
                    }

                    list.Add(file);
                });
            if (list != null)
            {
                pagedList = new Paged<File>(list, pageIndex, pageSize, totalCount);
            }
            return pagedList;
        }

        public Paged<File> GetByIsDeleted(int pageIndex, int pageSize, bool isDeleted)
        {
            Paged<File> pagedList = null;

            List<File> list = null;

            int totalCount = 0;

            _data.ExecuteCmd("[dbo].[Files_Select_ByIsDeleted]", (param) =>
            {
                param.AddWithValue("@PageIndex", pageIndex);
                param.AddWithValue("@PageSize", pageSize);
                param.AddWithValue("@IsDeleted", isDeleted);
            },
                (reader, recordSetIndex) =>
                {
                    int index = 0;
                    File file = MapFile(reader, ref index);
                    if (totalCount == 0)
                    {
                        totalCount = reader.GetSafeInt32(index);
                    }

                    if (list == null)
                    {
                        list = new List<File>();
                    }

                    list.Add(file);
                });
            if (list != null)
            {
                pagedList = new Paged<File>(list, pageIndex, pageSize, totalCount);
            }
            return pagedList;
        }

        public Paged<File> GetAll(int pageIndex, int pageSize)
        {
            Paged<File> pagedList = null;

            List<File> list = null;

            int totalCount = 0;

            _data.ExecuteCmd("[dbo].[Files_SelectAll]", (param) =>
            {
                param.AddWithValue("@PageIndex", pageIndex);
                param.AddWithValue("@PageSize", pageSize);
            },
                (reader, recordSetIndex) =>
                {
                    int index = 0;
                    File file = MapFile(reader, ref index);
                    if (totalCount == 0)
                    {
                        totalCount = reader.GetSafeInt32(index);
                    }

                    if (list == null)
                    {
                        list = new List<File>();
                    }

                    list.Add(file);
                });
            if (list != null)
            {
                pagedList = new Paged<File>(list, pageIndex, pageSize, totalCount);
            }
            return pagedList;
        }

        public void Delete(int id)
        {

            string procName = "[dbo].[Files_Delete]";
            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {

                col.AddWithValue("@Id", id);


            }, returnParameters: null);

        }

        public void Update(FileUpdateRequest model)
        {

            string procName = "[dbo].[Files_Update]";
            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {
                col.AddWithValue("@Id", model.Id);
                col.AddWithValue("@IsDeleted", model.IsDeleted);

            }, returnParameters: null);

        }

        public Paged<File> SearchPagination(int pageIndex, int pageSize, string query, bool? isDeleted = null)
        {
            Paged<File> pagedList = null;
            List<File> list = null;
            int totalCount = 0;

            _data.ExecuteCmd("[dbo].[Files_SearchPagination]", (param) =>
            {
                param.AddWithValue("@PageIndex", pageIndex);
                param.AddWithValue("@PageSize", pageSize);
                param.AddWithValue("@Query", query);
                param.AddWithValue("@IsDeleted", isDeleted);
            },
            (reader, recordSetIndex) =>
            {
                int index = 0;
                File file = MapFile(reader, ref index);
                if (totalCount == 0)
                {
                    totalCount = reader.GetSafeInt32(index);
                }

                if (list == null)
                {
                    list = new List<File>();
                }

                list.Add(file);
            });
            if (list != null)
            {
                pagedList = new Paged<File>(list, pageIndex, pageSize, totalCount);
            }
            return pagedList;
        }

        private static File MapFile(IDataReader reader, ref int startingIndex)
        {
            File aFile = new File();

            aFile.Id = reader.GetSafeInt32(startingIndex++);
            aFile.Name = reader.GetSafeString(startingIndex++);
            aFile.Url = reader.GetSafeString(startingIndex++);
            aFile.FileTypeId = new LookUp
            {
                Id = reader.GetSafeInt32(startingIndex++),
                Name = reader.GetSafeString(startingIndex++),
            };
            aFile.IsDeleted = reader.GetSafeBool(startingIndex++);
            aFile.CreatedBy = new BaseUser
            {
                Id = reader.GetSafeInt32(startingIndex++),
                FirstName = reader.GetSafeString(startingIndex++),
                Mi = reader.GetSafeString(startingIndex++),
                LastName = reader.GetSafeString(startingIndex++),
                AvatarUrl = reader.GetSafeString(startingIndex++),
            };
            aFile.DateCreated = reader.GetSafeDateTime(startingIndex++);

            return aFile;
        }

        private static void AddCommonParams(FileAddRequest model, SqlParameterCollection col)
        {
            col.AddWithValue("@Name", model.Name);
            col.AddWithValue("@Url", model.Url);
            col.AddWithValue("@FileTypeId", model.FileTypeId);
        }
    }
}