import React, { Component } from "react";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables-bitozen";
import PopUp from "../../../../components/pages/PopUpAlert";
import FormSearchEmployee from "../../formEmployee/formSearchEmployee";
import DropDown from '../../../../modules/popup/DropDown';

var ct = require("../../../custom/customTable");

class approval extends Component {
  constructor(props) {
    super(props);
    this.state = {
      createClass: "app-popup",
      formSearchEmpVisible: false,
      savePopUpVisible: false,
      deletePopUpVisible: false
    };
  }

  openCreate = () => {
    if (this.state.createClass === "app-popup app-popup-show") {
      this.setState({ createClass: "app-popup" });
    } else {
      this.setState({ createClass: "app-popup app-popup-show" });
    }
  };

  openSearch() {
    this.setState({ formSearchEmpVisible: !this.state.formSearchEmpVisible });
  }

  handleUpdate = () => {
    this.openSavePopUp();
  };

  handleDelete = () => {
    this.setState({ deletePopUpVisible: false });
  };
  openSavePopUp = () => {
    this.setState({ savePopUpVisible: !this.state.savePopUpVisible });
  };

  openDeletePopup = index => {
    this.setState({
      deletePopUpVisible: !this.state.deletePopUpVisible,
      selectedIndex: index
    });
  };

  getMuiTheme = () => createMuiTheme(ct.customTable());

  options = ct.customOptions();

  columns = [
    "No",
    "Approval",
    "Position",
    {
      name: "Action",
      options: {
        customBodyRender: (val, tableMeta) => {
          return (
            <div>
              <button
                type="button"
                className="btnAct"
                style={{ marginRight: 15, backgroundColor: 'transparent' }}
                onClick={() => this.openDeletePopup(tableMeta.rowIndex)}
              >
                <i className="fa fa-lw fa-trash-alt" style={{ backgroundColor: 'transparent', color: 'red', fontSize: 20 }}/>
              </button>
            </div>
          );
        }
      }
    }
  ];

  data = [["1", "Neyar", "CEO"]];

  render() {
    return (
      <div className="vertical-tab-content active">
        <form action="#">
          <div className="border-bottom padding-15px grid-mobile-none gap-20px">
            <div className="col-1 content-right">
              <button
                type="button"
                className="btn btn-circle background-blue"
                onClick={this.openCreate}
              >
                <i className="fa fa-1x fa-plus" />
              </button>
            </div>
            <div className="padding-5px" />
            <MuiThemeProvider theme={this.getMuiTheme()}>
              <MUIDataTable
                data={this.data}
                columns={this.columns}
                options={this.options}
              />
            </MuiThemeProvider>
          </div>

          <div className={this.state.createClass}>
            <div className="padding-top-20px" />
            <div className="popup-content-small background-white border-radius">
              <div className="popup-panel grid grid-2x">
                <div className="col-1">
                  <div className="popup-title">
                    Training Plan - Approval - Create Form
                  </div>
                </div>
                <div className="col-2 content-right">
                  <button
                    style={{ marginLeft: "15px" }}
                    className="btn btn-grey btn-circle"
                    type="button"
                    onClick={this.openCreate}
                  >
                    <i className="fa fa-lg fa-times"></i>
                  </button>
                </div>
              </div>
              <form action="#">
                <div className="border-bottom padding-10px grid-mobile-none gap-20px">
                  <div className="card-date-picker margin-bottom-20px">
                    <div className="margin-5px">
                      <div className="txt-site txt-11 txt-main txt-bold">
                        <h4>Approve By <span style={{ color: "red" }}>*</span></h4>
                      </div>
                    </div>
                    <div className="double">
                      <input
                        style={{ backgroundColor: "#E6E6E6" }}
                        readOnly
                        className='input'
                        type="text"
                        placeholder=""
                      />
                      <button
                        className="btn btn-grey border-left btn-no-radius"
                        type="button"
                        onClick={() => this.openSearch()}
                      >
                        <i className="fa fa-lg fa-search"/>
                      </button>
                    </div>
                  </div>

                  <div className="margin-bottom-10px">
                    <div className="margin-5px">
                      <div className="txt-site txt-11 txt-main txt-bold">
                        <h4>Position <span style={{ color: "red" }}>*</span></h4>
                      </div>
                    </div>
                    <DropDown
                      title="-- please select day type --"
                      onChange={(dt) => console.log(dt)}
                      // type="bizpar"
                      // disabled={this.props.type === "edit" ? true : false}
                      data={[
                        { id: '1', title: 'internal', value: 'internal' },
                        { id: '1', title: 'eksternal', value: 'eksternal' }]} />
                  </div>
                </div>
              </form>
              <div className="padding-15px">
                <div className="grid grid-2x">
                  <div className="col-1" />
                  <div className="col-2 content-right">
                    <button
                      style={{ marginLeft: "15px" }}
                      className="btn btn-blue"
                      type="button"
                      onClick={this.handleUpdate}
                    >
                      <span>Save</span>
                    </button>
                    <button
                      style={{ marginLeft: "15px" }}
                      className="btn btn-primary"
                      type="button"
                      onClick={this.openCreate}
                    >
                      <span>CLOSE</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {this.state.formSearchEmpVisible && (
            <FormSearchEmployee
              onClickClose={this.openSearch.bind(this)}
            // onClickEmp={this.addEmployeeHandler.bind(this)}
            />
          )}

          <div className="padding-15px">
            <div className="grid grid-2x">
              <div className="col-1" />
              <div className="col-2 content-right">
                <button
                  style={{ marginLeft: "15px" }}
                  className="btn btn-blue"
                  type="button"
                  onClick={() => this.props.onClickSave()}
                >
                  <span>SAVE</span>
                </button>
                <button
                  style={{ marginLeft: "15px" }}
                  className="btn btn-blue"
                  type="button"
                  onClick={() => this.props.onClickSave()}
                >
                  <span>PROCESS</span>
                </button>
                <button
                  style={{ marginLeft: "15px" }}
                  className="btn btn-primary"
                  type="button"
                  onClick={this.props.onClickClose}
                >
                  <span>CLOSE</span>
                </button>
              </div>
            </div>
          </div>
        </form>
        {this.state.savePopUpVisible && (
          <PopUp
            type={"save"}
            class={"app-popup app-popup-show"}
            onClick={this.openSavePopUp}
          />
        )}
        {this.state.deletePopUpVisible && (
          <PopUp
            type={"delete"}
            class={"app-popup app-popup-show"}
            onClickDelete={this.handleDelete}
            onClick={this.openDeletePopup}
          />
        )}
      </div>
    );
  }
}

export default approval;
