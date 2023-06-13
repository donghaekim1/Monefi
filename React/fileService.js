import axios from "axios";
import * as helper from "./serviceHelpers";

const fileService = {
  endpoint: `${helper.API_HOST_PREFIX}/api/files`,
};

const uploadFiles = payload => {
  const config = {
    method: "POST",
    url: `${fileService.endpoint}/aws/upload`,
    data: payload,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(response => {
    return {
      id: response.data.item,
      ...payload,
    };
  });
};

const uploadFilesAnon = payload => {
  const config = {
    method: "POST",
    url: `${fileService.endpoint}/register/upload`,
    data: payload,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config).then(response => {
    return {
      id: response.data.item,
      ...payload,
    };
  });
};

const selectAll = (pageIndex, pageSize) => {
  const config = {
    method: "GET",
    url: `${fileService.endpoint}?pageIndex=${pageIndex}&pageSize=${pageSize}`,

    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };

  return axios(config);
};

const searchAllPagination = (pageIndex, pageSize, query) => {
  const config = {
    method: "GET",
    url: `${fileService.endpoint}/search?pageIndex=${pageIndex}&pageSize=${pageSize}&query=${query}`,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };

  return axios(config);
};

const searchPagination = (pageIndex, pageSize, query, isDeleted) => {
  const config = {
    method: "GET",
    url: `${fileService.endpoint}/search?pageIndex=${pageIndex}&pageSize=${pageSize}&query=${query}&isDeleted=${isDeleted}`,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };

  return axios(config);
};

const deleteById = id => {
  const config = {
    method: "DELETE",
    url: `${fileService.endpoint}/${id}`,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };
  return axios(config);
};

const update = (id, payload) => {
  const config = {
    method: "PUT",
    url: `${fileService.endpoint}/${id}`,
    data: payload,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };

  return axios(config).then(response => {
    return {
      id: response,
      ...payload,
    };
  });
};

const getByIsDeleted = (pageIndex, pageSize, isDeleted) => {
  const config = {
    method: "GET",
    url: `${fileService.endpoint}/deleted/${isDeleted}?pageIndex=${pageIndex}&pageSize=${pageSize}`,
    crossdomain: true,
    headers: { "Content-Type": "application/json" },
  };

  return axios(config);
};

export { uploadFiles, selectAll, searchAllPagination, searchPagination, deleteById, update, getByIsDeleted, uploadFilesAnon };
