import React, { Component } from "react";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables-bitozen";
import FormNesSubDistrict from "./formNesSubDistrict";
import PopUp from "../../../components/pages/PopUpAlert";
import API from "../../../Services/Api"
import M from 'moment'

var ct = require("../../../modules/custom/customTable");
const payloadDistrictDefault = {
  "kabkotCreationalDTO": {
    "createdBy": "SYSTEM",
    "createdDate": M().format("DD-MM-YYYY HH:mm:ss"),
    "modifiedBy": "SYSTEM",
    "modifiedDate": ""
  },
  "kabkotID": "",
  "kabkotName": "",
  "kabkotStatus": "ACTIVE",
  "setkecamatan": []
}

class FormNesDistrict extends Component {
  constructor(props) {
    super(props)
    this.state = {
      createVisible: false,
      editVisible: false,
      detailVisible: false,
      deletePopUpVisible: false,
      savePopUpVisible: false,
      // data: props.data ? props.data : payloadDistrictDefault,
      data: props.data ? props.data : {
        ...payloadDistrictDefault,
        kabkotCreationalDTO: {
          ...payloadDistrictDefault.kabkotCreationalDTO, createdBy: props.user.employeeID, modifiedBy: props.user.employeeID
        }
      },
      dataTableSubDistrict: [],
      provinceID: props.provinceID
    };
  }

  async getKecamatanByKabKotID(value) {
    API.create("MASTERDATA")
      .getKecamatanByKabKotID(value)
      .then(res => {
        if (res.status === 200) {
          console.log(res.data);
          if (res.data.status === "S") {
            this.setState({
              dataTableSubDistrict: res.data.data
            });
          }
          let dataTableSubDistrict = this.state.dataTableSubDistrict.map((value) => {
            const { kecamatanID, kecamatanName, kecamatanStatus } = value;
            return [
              kecamatanID,
              kecamatanName,
              kecamatanStatus,
              // zipCode
            ]
          })
          this.setState({
            dataTableSubDistrict,
            rawDataSubDistrict: res.data.data
          })
        }
      });
  }

  componentDidMount() {
    this.getKecamatanByKabKotID(this.state.data.kabkotID)
  }

  getMuiTheme = () => createMuiTheme(ct.customTable());

  options = ct.customOptions5();

  columns = [
    "Sub District ID",
    "Sub District Name",
    {
      name: "Sub District Status",
      options: {
        customBodyRender: (val) => {
          return (
            <div>
              {val === "ACTIVE" ? (
                <div>
                  <i
                    type="button"
                    className="fa fa-lw fa-circle"
                    style={{ color: "green", marginRight: 10 }}
                  />
                  {val}
                </div>
              ) : (
                  <div>
                    <i
                      className="fa fa-lw fa-circle"
                      style={{ color: "red", marginRight: 10 }}
                    />
                    {val}
                  </div>
                )}
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
            this.props.type !== "detail" ?
              <div>
                <button
                  className="btnAct"
                  style={{ marginRight: 15, backgroundColor: 'transparent' }}
                  type="button"
                  onClick={() => this.openEditForm(tableMeta.rowIndex)}
                >
                  <i className="fa fa-lw fa-pencil-alt" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }} />
                </button>
                <button
                  type="button"
                  className="btnAct"
                  style={{ marginRight: 15, backgroundColor: 'transparent' }}
                  onClick={() => this.openDeletePopup(tableMeta.rowIndex)}
                >
                  <i className="fa fa-lw fa-trash-alt" style={{ backgroundColor: 'transparent', color: 'red', fontSize: 20 }} />
                </button>
                <button
                  type="button"
                  className="btnAct"
                  style={{ marginRight: 15, backgroundColor: 'transparent' }}
                  onClick={() => this.openDetailForm(tableMeta.rowIndex)}
                >
                  <i className="fa fa-lw fa-ellipsis-v" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }} />
                </button>
              </div> :
              <button
                type="button"
                className="btnAct"
                style={{ marginRight: 15, backgroundColor: 'transparent' }}
                onClick={() => this.openDetailForm(tableMeta.rowIndex)}
              >
                <i className="fa fa-lw fa-ellipsis-v" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }} />
              </button>
          );
        }
      }
    }
  ];

  openCreateForm = () => {
    this.setState({ createVisible: !this.state.createVisible })
  };

  openEditForm = (index = null) => {
    this.setState({ editVisible: !this.state.editVisible, selectedIndex: index })
  };

  openDetailForm = (index) => {
    this.setState({ detailVisible: !this.state.detailVisible, selectedIndex: index })
  };

  openSavePopUp = () => {
    this.setState({ savePopUpVisible: !this.state.savePopUpVisible })
  };

  openDeletePopup = (index) => {
    this.setState({ deletePopUpVisible: !this.state.deletePopUpVisible, selectedIndex: index })
  };

  handlePopUp = () => {
    this.getKecamatanByKabKotID(this.state.data.kabkotID)
    this.setState({
      savePopUpVisible: false,
      createVisible: false,
      editVisible: false
    })
  }

  handleSubmit = async (data, kabkotID) => {
    let payload = {
      kabkotID: kabkotID,
      kecamatan: {
        ...data,
        kecamatanCreationalDTO: {
          ...data.kecamatanCreationalDTO,
          createdDate: M().format("DD-MM-YYYY HH:mm:ss")
        },
      }
    }
    let response = await API.create('MASTERDATA').postKecamatan(payload)
    console.log(JSON.stringify(payload))
    if (response.ok && response.data.status === 'S') {
      this.openSavePopUp()
      let dataTableSubDistrict = Object.assign([], this.state.dataTableSubDistrict)
      dataTableSubDistrict.push(
        data.kecamatanID,
        data.kecamatanName,
        data.kecamatanStatus
      )
      this.setState({ dataTableSubDistrict })
      this.getKecamatanByKabKotID(this.state.data.kabkotID)
    } else {
      if (response.data && response.data.message) alert("Data Already Exist")
    }
  }

  handleUpdate = async (data, kabkotID) => {
    let payload = {
      ...data,
      kecamatanCreationalDTO: {
        ...data.kecamatanCreationalDTO,
        createdDate: data.kecamatanCreationalDTO.createdDate,
        modifiedBy: this.props.user.employeeID,
        modifiedDate: M().format("DD-MM-YYYY HH:mm:ss")
      },
    }
    let response = await API.create('MASTERDATA').updateKecamatan(payload)
    if (response.ok && response.data.status === 'S') {
      this.openSavePopUp()
      let dataTableSubDistrict = Object.assign([], this.state.dataTableSubDistrict)
      dataTableSubDistrict.splice(this.state.selectedIndex, 0,
        data.kecamatanID,
        data.kecamatanName,
        data.kecamatanStatus
      )
      this.setState({ dataTableSubDistrict })
      this.getKecamatanByKabKotID(this.state.data.kabkotID)
    } else {
      if (response.data && response.data.message) alert("Failed, Please Try Again")
    }
  }

  handleDelete = async () => {
    let payload = {
      referenceID: this.state.rawDataSubDistrict[this.state.selectedIndex].kecamatanID,
      requestBy: "DELETE-TEST",
      requestDate: M().format("DD-MM-YYYY HH:mm:ss")
    }
    let response = await API.create('MASTERDATA').deleteKecamatan(payload)
    if (response.ok && response.data.status === 'S') {
      this.setState({ deletePopUpVisible: false })
      let dataTableSubDistrict = Object.assign([], this.state.dataTableSubDistrict)
      dataTableSubDistrict.splice(this.state.selectedIndex, 1)
      this.setState({ dataTableSubDistrict })
    } else {
      if (response.data && response.data.message) alert("Failed, Please Try Again")
    }
  }

  render() {
    let { kabkotID, kabkotName } = this.state.data
    return (
      <div className={"app-popup app-popup-show"}>
        <div className="padding-top-20px" />
        <div className="popup-content-small background-white border-radius">
          <div className="popup-panel grid grid-2x">
            <div className="col-1">
              <div className="popup-title">
                {this.props.title}
              </div>
            </div>
            <div className="col-2 content-right">
              <button
                className="btn btn-circle btn-grey"
                onClick={this.props.onClickClose}
              >
                <i className="fa fa-lg fa-times" />
              </button>
            </div>
          </div>
          <form action="#"
            onSubmit={(e) => {
              e.preventDefault()
              this.props.onClickSave(this.state.data, this.state.provinceID)
            }}
          >
            <div className="border-bottom padding-15px grid grid-2x grid-mobile-none gap-20px">
              <div className="column-1">
                <div className="margin-bottom-20px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>District ID <span style={{ color: "red" }}>*</span></h4>
                    </div>
                  </div>
                  <input
                    readOnly={this.props.type === "create" ? false : true}
                    style={{ backgroundColor: this.props.type === "create" ? "" : "#E6E6E6" }}
                    type="text"
                    className="txt txt-sekunder-color"
                    placeholder=""
                    required
                    value={kabkotID}
                    onChange={(e) => {
                      this.setState({
                        data: {
                          ...this.state.data,
                          kabkotID: e.target.value
                        }
                      })
                    }}
                  />
                </div>

                <div className="margin-bottom-20px">
                  <div className="margin-5px">
                    <span className="txt-site txt-11 txt-main txt-bold">
                      Status
                    </span>
                  </div>
                  <div className="margin-15px">
                    <label className="radio">
                      <input type="checkbox" checked disabled />
                      <span className="checkmark" />
                      <span className="txt-site txt-11 txt-bold txt-main">
                        Active
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="column-2">
                <div className="margin-bottom-20px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>District Name <span style={{ color: "red" }}>*</span></h4>
                    </div>
                  </div>
                  <input
                    readOnly={this.props.type === "detail" ? true : false}
                    style={{ backgroundColor: this.props.type === "detail" ? "#E6E6E6" : "" }}
                    type="text"
                    className="txt txt-sekunder-color"
                    placeholder=""
                    required
                    value={kabkotName}
                    onChange={(e) => {
                      this.setState({
                        data: {
                          ...this.state.data,
                          kabkotName: e.target.value
                        }
                      })
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="padding-15px">
              <div className="padding-5px grid grid-2x">
                <div className="col-1">
                  <div className="txt-site txt-18 txt-bold txt-main padding-top-5px">
                    {/* Sub District */}
                  </div>
                </div>
                {this.props.type === "edit" && (
                  <div className="col-2 content-right">
                    <button
                      type="button"
                      className="btn btn-circle background-blue"
                      style={{ marginRight: 5 }}
                      onClick={this.openCreateForm.bind(this)}
                    >
                      <i className="fa fa-1x fa-plus" />
                    </button>
                  </div>
                )}
              </div>
              <MuiThemeProvider theme={this.getMuiTheme()}>
                <MUIDataTable
                  title='Sub District'
                  subtitle={"lorem ipsum dolor"}
                  data={this.state.dataTableSubDistrict}
                  columns={this.columns}
                  options={this.options}
                />
              </MuiThemeProvider>
            </div>

            <div className="padding-15px">
              <div className="grid grid-2x">
                <div className="col-1" />
                <div className="col-2 content-right">
                  {this.props.type !== "detail" ? (
                    <button
                      style={{ marginLeft: "15px" }}
                      className="btn btn-blue"
                      type="submit"
                    >
                      <span>SAVE</span>
                    </button>
                  ) : null}
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
        </div>

        {this.state.createVisible && (
          <FormNesSubDistrict
            user={this.props.user}
            type={"create"}
            title={"NES Create - Sub District"}
            kabkotID={this.state.data.kabkotID}
            onClickClose={this.openCreateForm}
            onClickSave={this.handleSubmit.bind(this)}
            onClickDelete={this.openDeletePopup}
          />
        )}

        {this.state.editVisible && (
          <FormNesSubDistrict
            user={this.props.user}
            type={"edit"}
            data={this.state.rawDataSubDistrict[this.state.selectedIndex]}
            title={"NES Update - Sub District"}
            onClickClose={() => this.openEditForm(null)}
            onClickSave={this.handleUpdate.bind(this)}
            onClickDelete={this.openDeletePopup}
          />
        )}

        {this.state.detailVisible && (
          <FormNesSubDistrict
            user={this.props.user}
            type={"detail"}
            title={"NES Detail - Sub District"}
            data={this.state.rawDataSubDistrict[this.state.selectedIndex]}
            onClickClose={this.openDetailForm}
            onClickDelete={this.openDeletePopup}
          />
        )}

        {this.state.savePopUpVisible && (
          <PopUp
            type={"save"}
            class={"app-popup app-popup-show"}
            onClick={this.handlePopUp.bind(this)}
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
        <div className="padding-bottom-20px" />
      </div>
    );
  }
}

export default FormNesDistrict;
