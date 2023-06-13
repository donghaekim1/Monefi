import React from "react";
import { useDropzone } from "react-dropzone";
import "./files.css";
import PropTypes from "prop-types";
import { UploadCloud } from "react-feather";

function DropzoneComponent({ onDrop }) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
  });

  return (
    <div>
      <div {...getRootProps({ className: "dropzone-1" })}>
        <input className="input-zone" {...getInputProps()} />
        <div className="text-center">
          {isDragActive ? (
            <p className="dropzone-content">
              Release to drop the files here
              <div></div>
              <UploadCloud className="mt-3 " />
            </p>
          ) : (
            <p className="dropzone-content">
              Drag and drop files here or click
              <div></div>
              <UploadCloud className="mt-3 " />
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default DropzoneComponent;

DropzoneComponent.propTypes = {
  onDrop: PropTypes.func.isRequired,
};
