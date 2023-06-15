import React, {useState, useEffect} from "react";
import {Col, Row, Nav, Tab, Breadcrumb, Card} from "react-bootstrap";
import FileTable from "./FileTable";
import * as fileService from "services/fileService";
import debug from "sabio-debug";
import Pagination from "rc-pagination";
import "rc-pagination/assets/index.css";
import locale from "rc-pagination/lib/locale/en_US";
import Swal from "sweetalert2";

const FileManager = () => {
  const [file, setFile] = useState({allFiles: [], search: "", pageIndex: 0, pageSize: 10, current: 1, totalCount: 1});
  const [activeTab, setActiveTab] = useState("all");
  const _logger = debug.extend("UploadFile");

  useEffect(() => {
    if (file?.search?.length > 0) {
      if (activeTab === "all") {
        fileService.searchAllPagination(file.pageIndex, file.pageSize, file.search).then(onGetAllFilesSuccess).catch(onGetFilesError);
      } else if (activeTab === "active") {
        fileService.searchPagination(file.pageIndex, file.pageSize, file.search, false).then(onGetAllFilesSuccess).catch(onGetFilesError);
      } else if (activeTab === "deleted") {
        fileService.searchPagination(file.pageIndex, file.pageSize, file.search, true).then(onGetAllFilesSuccess).catch(onGetFilesError);
      }
    } else {
      if (activeTab === "all") {
        fileService.selectAll(file.pageIndex, file.pageSize).then(onGetAllFilesSuccess).catch(onGetFilesError);
      } else if (activeTab === "active") {
        fileService.getByIsDeleted(file.pageIndex, file.pageSize, false).then(onGetAllFilesSuccess).catch(onGetFilesError);
      } else if (activeTab === "deleted") {
        fileService.getByIsDeleted(file.pageIndex, file.pageSize, true).then(onGetAllFilesSuccess).catch(onGetFilesError);
      }
    }
  }, [activeTab, file.search, file.current]);

  const onGetAllFilesSuccess = response => {
    _logger("ping ok", response);
    const files = response.data.item.pagedItems;

    const pageIndex = response.data.item.pageIndex;
    const pageSize = response.data.item.pageSize;
    const totalCount = response.data.item.totalCount;

    setFile(prevState => {
      const newState = {...prevState};
      newState.allFiles = files;
      newState.pageIndex = pageIndex;
      newState.pageSize = pageSize;
      newState.totalCount = totalCount;
      return newState;
    });
  };

  const onGetFilesError = error => {
    _logger({error: error});
    Swal.fire({
      title: "Error",
      text: "Error when getting files",
      icon: "error",
      confirmButtonText: "OK",
    });
  };

  const mapFiles = aFile => {
    return <FileTable key={aFile.allFiles.id} aFile={aFile.allFiles} triggerParentUpdate={triggerParentUpdate} />;
  };

  const onFormFieldChange = event => {
    const target = event.target;
    const newUserValue = target.value;
    const nameOfField = target.name;
    setFile(prevState => {
      const newUserObject = {
        ...prevState,
      };
      newUserObject[nameOfField] = newUserValue;
      return newUserObject;
    });
  };

  const handlePageChange = page => {
    setFile(prevState => {
      const newState = {...prevState};
      newState.pageIndex = page - 1;
      newState.current = page;

      _logger("page change new state", newState);
      return newState;
    });
  };

  const triggerParentUpdate = deletedPerson => {
    _logger("onDelete", {deletedPerson: deletedPerson});

    setFile(prevState => {
      const indexOfPerson = prevState.allFiles.findIndex(singleArrayMember => singleArrayMember.id === deletedPerson);

      const updatedPeople = [...prevState.allFiles];

      if (indexOfPerson >= 0) {
        updatedPeople.splice(indexOfPerson, 1);
      }

      return {
        ...prevState,
        allFiles: updatedPeople,
      };
    });
  };

  _logger("this is new state", file);
  return (
    <React.Fragment>
      <Tab.Container
        defaultActiveKey="all"
        activeKey={activeTab}
        onSelect={key => {
          setActiveTab(key);
          setFile(prevState => ({...prevState, pageIndex: 0, current: 1}));
        }}
      >
        <Row>
          <Col lg={12} md={12} sm={12}>
            <div className="border-bottom pb-4 mb-4 d-md-flex align-items-center justify-content-between">
              <div className="mb-3 mb-md-0">
                <h1 className="mb-1 h2 fw-bold">Files Manager</h1>
                <Breadcrumb>
                  <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
                  <Breadcrumb.Item active>Files Manager</Breadcrumb.Item>
                </Breadcrumb>
              </div>
              <div></div>
            </div>
          </Col>
        </Row>

        <Row>
          <Col lg={12} md={12} sm={12}>
            <Card>
              <Card.Header className="border-bottom-0 p-0 bg-white">
                <Nav className="nav-lb-tab">
                  <Nav.Item>
                    <Nav.Link eventKey="all" className="mb-sm-3 mb-md-0">
                      All
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="active" className="mb-sm-3 mb-md-0">
                      Active
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="deleted" className="mb-sm-3 mb-md-0">
                      Deleted
                    </Nav.Link>
                  </Nav.Item>
                </Nav>
              </Card.Header>
              <Card.Body className="p-0">
                <Card.Header>
                  <Row>
                    <Col lg={8} md={8} sm={12}>
                      <Pagination showTotal={(total, range) => `Showing ${range[0]}-${range[1]} of ${total}`} locale={locale} onChange={handlePageChange} current={file.current} total={file.totalCount} pageSize={file.pageSize} />
                    </Col>
                    <Col lg={4} md={4} sm={12}>
                      <form>
                        <div className="input-group rounded">
                          <input type="search" id="search" className=" rounded" name="search" placeholder="   Search Files" aria-label="Search" aria-describedby="search-addon" value={file.search} onChange={onFormFieldChange} />
                        </div>
                      </form>
                    </Col>
                  </Row>
                </Card.Header>
                <Tab.Content>
                  <Tab.Pane eventKey="all" className="pb-4" onSelect={() => setActiveTab("all")}>
                    <div className="files-container flex-wrap">{file?.allFiles.length > 0 ? mapFiles(file) : "No files found."}</div>
                  </Tab.Pane>
                </Tab.Content>
                <Tab.Content>
                  <Tab.Pane eventKey="active" className="pb-4" onSelect={() => setActiveTab("active")}>
                    <div className="files-container flex-wrap">{file?.allFiles.length > 0 ? mapFiles(file) : "No files found."}</div>
                  </Tab.Pane>
                </Tab.Content>
                <Tab.Content>
                  <Tab.Pane eventKey="deleted" className="pb-4" onSelect={() => setActiveTab("deleted")}>
                    <div className="files-container flex-wrap">{file?.allFiles.length > 0 ? mapFiles(file) : "No files found."}</div>
                  </Tab.Pane>
                </Tab.Content>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Tab.Container>
    </React.Fragment>
  );
};

export default FileManager;
