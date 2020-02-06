import React, { Component } from "react";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables-bitozen";
import PopUp from "../pages/PopUpAlert"; 
import FormUploadCreate from "../../modules/forms/formTraining/upload/formUploadCreate";
import FormUploadEdit from "../../modules/forms/formTraining/upload/formUploadEdit";

var ct = require("../../modules/custom/customTable");
const getMuiTheme = () => createMuiTheme(ct.customTable());
const options = ct.customOptions();

class Upload extends Component {
  constructor() {
    super();
    this.state = {
      detailVisible: false,
      createVisible: false,
      editVisible: false,

      savePopUpVisible: false,
      deletePopUpVisible: false
    };
  }

  startFetch = () => {
    this.LoadingBar.continousStart();
  };

  handleUpdate = () => {
    this.openSavePopUp();
  };

  openSavePopUp = () => {
    this.setState({ savePopUpVisible: !this.state.savePopUpVisible });
  };

  componentDidMount() {
    this.onFinishFetch();
  }

  onFinishFetch = () => {
    if (typeof this.LoadingBar === "object") this.LoadingBar.complete();
  };

  openCreate = index => {
    this.setState({
      createVisible: !this.state.createVisible,
      selectedIndex: index
    });
  };

  openEdit = index => {
    this.setState({
      editVisible: !this.state.editVisible,
      selectedIndex: index,
      type:"edit"
    });
  };

  openDetail = index => {
    this.setState({
      detailVisible: !this.state.detailVisible,
      selectedIndex: index,
      type:"detail"
    });
  };

  openDeletePopup = index => {
    this.setState({
      deletePopUpVisible: !this.state.deletePopUpVisible,
      selectedIndex: index
    });
  };

  columns = [
    "No",
    "Transaction Number",
    {
      name: <div style={{ float: "center" }}>Training</div>,
      options: {
        filter: false,
        customHeadRender: (columnMeta) => (
          <th key={3} style={{ cursor: 'pointer', backgroundColor: '#F6F6F6', color: '#555555', fontSize: 13, fontWeight: 1 }}>
            <div style={{ borderBottom: "1px rgba(0,0,0,0.1) solid" }}>{columnMeta.name}</div>
            <div className="grid grid-7x" style={{ backgroundColor: '#F6F6F6', color: '#555555', fontSize: 13, fontWeight: 1 }}>
              <div className="col-1">
                {"Training Code"}
              </div>
              <div className="col-2">
                {"Type"}
              </div>
              <div className="col-3">
                {"Name"}
              </div>
              <div className="col-4">
                {"Date"}
                <div className="grid grid-2x">
                  <div className="col-1">
                    {"Start"}
                  </div>
                  <div className="col-2">
                    {"End"}
                  </div>
                </div>
              </div>
              <div className="col-5">
                {"Place"}
              </div>
              <div className="col-6">
                {"Provider"}
              </div>
              <div className="col-7">
                {"Total"}
                <div className="grid grid-2x">
                  <div className="col-1">
                    {"Participant"}
                  </div>
                  <div className="col-2">
                    {"Cost"}
                  </div>
                </div>
              </div>
            </div>
          </th>
        ),
        customBodyRender: (val) => {
          return (
            <div>
              <div className="grid grid-7x content-center">
                <div className="col-1">
                  {val}
                </div>
                <div className="col-2">
                  {val}
                </div>
                <div className="col-3">
                  {val}
                </div>
                <div className="col-4">
                  <div className="grid grid-2x">
                    <div className="col-1">
                      {val}
                    </div>
                    <div className="col-2">
                      {val}
                    </div>
                  </div>
                </div>
                <div className="col-5">
                  {val}
                </div>
                <div className="col-6">
                  {val}
                </div>
                <div className="col-7">
                  <div className="grid grid-2x">
                    <div className="col-1">
                      {val}
                    </div>
                    <div className="col-2">
                      {val}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        }
      }
    },
    {
      name: "Document",
      options: {
        customBodyRender: (val, tableMeta) => {
          return (
            <div style={{ textAlign: "center" }}>
              <button
                type="button"
                className="btn btn-blue btn-small-circle float-center"
                style={{ marginRight: 5 }}
              >
                <i className="fa fa-lw fa-file-alt" />
              </button>
            </div>
          );
        }
      }
    },
    {
      name: "Detail",
      options: {
        customBodyRender: (val, tableMeta) => {
          return (
            <div>
              <button
                type="button"
                className="btn btn-blue btn-small-circle"
                style={{ marginRight: 5 }}
                onClick={() =>
                  this.openDetail(tableMeta.rowIndex)
                }
              >
                <i className="fa fa-lw fa-sign-out-alt" />
              </button>
            </div>
          );
        }
      }
    },
    {
      name: "Action",
      options: {
        customBodyRender: (val, tableMeta) => {
          return (
            <div>
              <button
                type="button"
                className="btn btn-blue btn-small-circle"
                style={{ marginRight: 5 }}
                onClick={() =>
                  this.openEdit(tableMeta.rowIndex)
                }
              >
                <i className="fa fa-lw fa-pencil-alt" />
              </button>
              <button
                type="button"
                className="btn btn-red btn-small-circle"
                style={{ marginRight: 5 }}
                onClick={() =>
                  this.openDeletePopup(tableMeta.rowIndex)
                }
              >
                <i className="fa fa-lw fa-trash-alt" />
              </button>
            </div>
          );
        }
      }
    }
  ];

  dataTable = [
    ["223131", "7 Mei 2019", "Droping", "COP-090800", "Tjoang Munara", "Created", "50.0000"]
  ];

  render() {
    return (
      <div className="main-content">
        <div>
          <div className="vertical-tab-content active">
            <form action="#">
              <div className="padding-5px grid grid-2x" >
                <div className="col-1">
                  {/* <span style={{ textDecoration: "underline" }}>Template Download</span>
                  <br /><br /><span>Training <i class="fa fa-file-alt"></i></span> */}
                </div>
                <div className="col-2 content-right">
                  <button
                    type="button"
                    className="btn btn-circle background-blue"
                    onClick={this.openCreate}
                  >
                    <i className="fa fa-plus" />
                  </button>
                </div>
              </div>
              <div className="padding-5px">
                {/** Show Table */}
                <MuiThemeProvider theme={getMuiTheme()}>
                  <MUIDataTable
                    title='Training Upload'
                    data={this.dataTable}
                    columns={this.columns}
                    options={options}
                  />
                </MuiThemeProvider>
              </div>
            </form>
            
            {this.state.createVisible && (
              <FormUploadCreate
                onClickSave={this.handleUpdate.bind(this)}
                onClickClose={this.openCreate}
              />
            )}

            {this.state.editVisible && (
              <FormUploadEdit
                type={this.state.type}
                onClickSave={this.handleUpdate.bind(this)}
                onClickClose={this.openEdit}
              />
            )}

            {this.state.detailVisible && (
              <FormUploadEdit
                type={this.state.type}
                onClickSave={this.handleUpdate.bind(this)}
                onClickClose={this.openDetail}
              />
            )}

            {this.state.savePopUpVisible && (
              <PopUp
                type={"save"}
                class={"app-popup app-popup-show"}
                onClick={this.openSavePopUp.bind(this)}
              />
            )}

            {this.state.deletePopUpVisible && (
                  <PopUp
                    type={"delete"}
                    class={"app-popup app-popup-show"}
                    onClick={this.openDeletePopup}
                    onClickDelete={this.handleDelete}
                  />
                )}
          </div>
        </div>
      </div>
    )
  }
}

export default Upload