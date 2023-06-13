import React from "react";
import debug from "sabio-debug";
import PropTypes from "prop-types";
import DropzoneComponent from "./DropzoneComponent";
import "./files.css";
import * as fileService from "../../services/fileService";

function UploadFile(props) {
  const _logger = debug.extend("UploadFile");

  const onDropFiles = acceptedFiles => {
    const formData = new FormData();

    for (let index = 0; index < acceptedFiles.length; index++) {
      formData.append("files", acceptedFiles[index]);
    }

    if (props.register === true) {
      fileService.uploadFilesAnon(formData).then(onUploadFileSuccess).catch(onUploadFileError);
    } else {
      fileService.uploadFiles(formData).then(onUploadFileSuccess).catch(onUploadFileError);
    }

  };

  const onUploadFileSuccess = response => {
    _logger(response.id, "File upload success");
    props.getResponseFile(response.id);
  };

  const onUploadFileError = error => {
    _logger({ error: error }, "Error while uploading file!");
  };

  return <DropzoneComponent multiple onDrop={onDropFiles} />;
}

UploadFile.propTypes = {
  getResponseFile: PropTypes.func.isRequired,
  register: PropTypes.string
};

export default UploadFile;
