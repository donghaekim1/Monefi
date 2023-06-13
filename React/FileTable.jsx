import React from "react";
import PropTypes from "prop-types";
import {Link} from "react-router-dom";
import {useTable, usePagination} from "react-table";
import {Col, Card, Row, Table, Button, OverlayTrigger, Tooltip} from "react-bootstrap";
import "./files.css";
import debug from "sabio-debug";
import * as fileService from "services/fileService";
import Swal from "sweetalert2";
import {FileImage, FileWord, FileEarmarkSpreadsheet, FiletypePpt, FileText, FileEarmarkSlides, Exclamation, FiletypePdf, FiletypeGif, FiletypeHtml, FileZip, FiletypeMp3, FiletypeMp4} from "react-bootstrap-icons";

export default function FileTable({aFile, triggerParentUpdate}) {
  const data = React.useMemo(() => aFile, [aFile]);
  const _logger = debug.extend("FileTable");

  const onDownloadBtnClicked = () => {
    Swal.fire({
      title: "Download Success",
      text: "Downloading content",
      icon: "success",
      confirmButtonText: "OK",
    });
  };

  const onDeleteBtnClicked = response => {
    _logger(response, "28");

    triggerParentUpdate(response);
    fileService
      .deleteById(response)
      .then(updatedFile => onDeleteFileSuccess(updatedFile, response))
      .catch(onDeleteFileError);
  };

  const onDeleteFileSuccess = (updatedFile, id) => {
    _logger(updatedFile, "recover success!");
    _logger(id, "id response");
    triggerParentUpdate(id);

    Swal.fire({
      title: "Success",
      text: "File Deleted",
      icon: "success",
      confirmButtonText: "OK",
    });
  };

  const onDeleteFileError = error => {
    _logger({error: error});

    Swal.fire({
      title: "Error",
      text: "Error when deleting",
      icon: "error",
      confirmButtonText: "OK",
    });
  };

  const onRecoverBtnClicked = response => {
    const fileObj = {
      isDeleted: false,
    };
    fileService
      .update(response, fileObj)
      .then(updatedFile => onRecoverBtnSuccess(updatedFile, response))
      .catch(onRecoverBtnError);
  };

  const onRecoverBtnSuccess = (updatedFile, id) => {
    _logger(updatedFile, "recover success!");
    _logger(id, "id response");
    triggerParentUpdate(id);

    Swal.fire({
      title: "Success",
      text: "File Recovered",
      icon: "success",
      confirmButtonText: "OK",
    });
  };

  const onRecoverBtnError = error => {
    _logger({error: error});

    Swal.fire({
      title: "Error",
      text: "Error when recovering",
      icon: "error",
      confirmButtonText: "OK",
    });
  };

  const getFileTypeIcon = value => {
    return (
      <div className="icon-shape icon-lg rounded-3">
        <Link to="#">
          {value === "xlsx" ? (
            <FileEarmarkSpreadsheet size={24} />
          ) : value === "image" ? (
            <FileImage size={24} />
          ) : value === "doc" ? (
            <FileWord size={24} />
          ) : value === "ppt" ? (
            <FiletypePpt size={24} />
          ) : value === "txt" ? (
            <FileText size={24} />
          ) : value === "mov" ? (
            <FileEarmarkSlides size={24} />
          ) : value === "pdf" ? (
            <FiletypePdf size={24} />
          ) : value === "gif" ? (
            <FiletypeGif size={24} />
          ) : value === "html" ? (
            <FiletypeHtml size={24} />
          ) : value === "zip" ? (
            <FileZip size={24} />
          ) : value === "mp3" ? (
            <FiletypeMp3 size={24} />
          ) : value === "mp4" ? (
            <FiletypeMp4 size={24} />
          ) : (
            <Exclamation size={24} className="text-danger" />
          )}
        </Link>
      </div>
    );
  };

  const columns = React.useMemo(
    () => [
      {
        Header: "Name",
        accessor: "name",
        Cell: ({value}) => (
          <OverlayTrigger placement="top" overlay={<Tooltip>{value}</Tooltip>}>
            <span className="d-inline-block">{value}</span>
          </OverlayTrigger>
        ),
      },
      {
        Header: "Preview",
        accessor: "url",
        Cell: ({value, row}) => {
          const lastDotIndex = row.original.url.lastIndexOf(".");
          const fileExtension = row.original.url.substring(lastDotIndex + 1).toLowerCase();
          const imageExtensions = ["jpg", "jpeg", "png", "gif"];
          const docExtensions = ["txt", "xlsx", "doc", "docx", "ppt", "pptx", "pdf"];
          if (imageExtensions.includes(fileExtension)) {
            return <img src={value} alt="Preview" className="images-thumbnail" />;
          } else if (docExtensions.includes(fileExtension)) {
            return (
              <a href={`https://docs.google.com/gview?url=${value}&embedded=true`} rel="noreferrer" target="_blank">
                <i className="fa fa-eye i-resize" aria-hidden="true"></i>
              </a>
            );
          } else {
            return (
              <span className="d-inline-block">
                <i className="fa fa-eye-slash i-resize" aria-hidden="true"></i>
              </span>
            );
          }
        },
      },
      {
        Header: "Created By",
        accessor: row => (
          <>
            <img src={row?.createdBy?.avatarUrl} alt="" className="rounded-circle p-1 ms-3 images-thumbnail" />
            <div>{`${row?.createdBy?.firstName} ${row?.createdBy?.mi} ${row?.createdBy?.lastName}`}</div>
          </>
        ),
      },
      {
        Header: "File Type",
        accessor: "fileTypeId.name",
        Cell: ({value}) => {
          return (
            <div className="d-flex align-items-center">
              <div className="ms-3">{getFileTypeIcon(value)}</div>
            </div>
          );
        },
      },
      {
        Header: "Date Created",
        accessor: "dateCreated",
        Cell: ({value}) => {
          const date = new Date(value);
          return date.toLocaleString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: true,
          });
        },
      },
      {
        accessor: "options",
        Header: "OPTIONS",
        Cell: ({row}) => {
          const aFile = row.original;
          if (aFile.isDeleted === false) {
            return (
              <React.Fragment>
                <a href={aFile?.url} download>
                  <Button type="download" value="download" className="text-muted me-2 text-primary-hover " onClick={onDownloadBtnClicked}>
                    <i className="fe fe-download fs-5"></i>
                  </Button>
                </a>

                <Button type="button" className="text-muted text-primary-hover btn-danger" data-template="six" onClick={() => onDeleteBtnClicked(aFile.id)}>
                  <i className="fa fa-trash fs-5"></i>
                </Button>
              </React.Fragment>
            );
          } else {
            const aFile = row.original;
            return (
              <React.Fragment>
                <Button type="reset" value="reset" className="text-muted text-primary-hover" onClick={() => onRecoverBtnClicked(aFile.id)}>
                  <i className="fa fa-undo fs-5"></i>
                </Button>
              </React.Fragment>
            );
          }
        },
      },
    ],
    []
  );

  const {getTableProps, getTableBodyProps, headerGroups, page, prepareRow} = useTable(
    {
      columns,
      data,
      initialState: {
        pageSize: 10,
        hiddenColumns: columns.map(column => {
          if (column.show === false) return column.accessor || column.id;
          else return false;
        }),
      },
    },
    usePagination
  );

  return (
    <React.Fragment>
      <Row>
        <Col lg={12} md={12} sm={12}>
          <Card>
            <Card.Body className="p-0">
              <div className="Table-responsive border-0 overflow-y-hidden">
                <Table {...getTableProps()} className="text-nowrap layout-fix table-columns">
                  <thead className="table-light">
                    <tr {...headerGroups[0].getHeaderGroupProps()}>
                      {headerGroups[0].headers.map(column => (
                        <th key={column.id} {...column.getHeaderProps()}>
                          {column.render("Header")}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody {...getTableBodyProps()}>
                    {page.map(row => {
                      prepareRow(row);
                      return (
                        <tr key={row.id} {...row.getRowProps()}>
                          {row.cells.map(cell => {
                            return (
                              <td key={cell.column.id} {...cell.getCellProps()} className="align-middle url-column">
                                {cell.render("Cell")}
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  );
}

FileTable.propTypes = {
  aFile: PropTypes.arrayOf(
    PropTypes.shape({
      url: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      isDeleted: PropTypes.bool.isRequired,
      createdBy: PropTypes.shape({
        id: PropTypes.number.isRequired,
        firstName: PropTypes.string.isRequired,
        lastName: PropTypes.string.isRequired,
        mi: PropTypes.string.isRequired,
      }).isRequired,
      dateCreated: PropTypes.string.isRequired,
    })
  ).isRequired,
  row: PropTypes.shape({
    name: PropTypes.string.isRequired,
    original: PropTypes.shape({
      id: PropTypes.number.isRequired,
      url: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      isDeleted: PropTypes.bool.isRequired,
      createdBy: PropTypes.shape({
        id: PropTypes.number.isRequired,
        firstName: PropTypes.string.isRequired,
        lastName: PropTypes.string.isRequired,
        mi: PropTypes.string.isRequired,
        avatarUrl: PropTypes.string.isRequired,
      }).isRequired,
      dateCreated: PropTypes.string.isRequired,
    }),
    createdBy: PropTypes.shape({
      id: PropTypes.number.isRequired,
      firstName: PropTypes.string.isRequired,
      lastName: PropTypes.string.isRequired,
      mi: PropTypes.string.isRequired,
      avatarUrl: PropTypes.string.isRequired,
    }).isRequired,
    fileTypeId: PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    }).isRequired,
    id: PropTypes.string.isRequired,
    getRowProps: PropTypes.func.isRequired,
    cells: PropTypes.arrayOf(
      PropTypes.shape({
        column: PropTypes.shape({
          id: PropTypes.string.isRequired,
        }).isRequired,
        getCellProps: PropTypes.func.isRequired,
        render: PropTypes.func.isRequired,
      })
    ).isRequired,
  }),
  triggerParentUpdate: PropTypes.func.isRequired,
  value: PropTypes.func,
};
