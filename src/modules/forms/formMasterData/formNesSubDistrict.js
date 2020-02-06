import React, { Component } from "react";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables-bitozen";
import FormNesKelurahan from "./formNesKelurahan";
import PopUp from "../../../components/pages/PopUpAlert";
import API from "../../../Services/Api"
import M from 'moment'
import * as R from 'ramda'

var ct = require("../../../modules/custom/customTable");
const payloadDistrictDefault = {
  "kecamatanCreationalDTO": {
    "createdBy": "SYSTEM",
    "createdDate": M().format("DD-MM-YYYY HH:mm:ss"),
    "modifiedBy": "SYSTEM",
    "modifiedDate": ""
  },
  "kecamatanID": "",
  "kecamatanName": "",
  "kecamatanStatus": "ACTIVE",
  "setkelurahanDTOs": [],
  "zipCode": ""
}

class FormNesSubDistrict extends Component {
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
        kecamatanCreationalDTO: {
          ...payloadDistrictDefault.kecamatanCreationalDTO, createdBy: props.user.employeeID, modifiedBy: props.user.employeeID
        }
      },
      dataTableKelurahan: [],
      kabkotID: props.kabkotID
    };
  }

  async getKelurahanByKecID(value) {
    API.create("MASTERDATA")
      .getKelurahanByKecID(value)
      .then(res => {
        if (res.status === 200) {
          console.log(res.data);
          if (res.data.status === "S") {
            this.setState({
              dataTableKelurahan: res.data.data
            });
          }
          let dataTableKelurahan = this.state.dataTableKelurahan.map((value) => {
            const { kelurahanID, kelurahanName, kelurahanStatus } = value;
            return [
              kelurahanID, kelurahanName, kelurahanStatus
            ]
          })
          this.setState({
            dataTableKelurahan,
            rawDataKelurahan: res.data.data
          })
        }
      });
  }

  componentDidMount() {
    console.log(this.state.data.kecamatanID)
    this.getKelurahanByKecID(this.state.data.kecamatanID)
  }

  getMuiTheme = () => createMuiTheme(ct.customTable());

  options = ct.customOptions5();

  columns = [
    "Kelurahan ID",
    "Kelurahan Name",
    {
      name: "Kelurahan Status",
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
                  type="button"
                  className="btnAct"
                  style={{ marginRight: 15, backgroundColor: 'transparent' }}
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
    this.setState({
      savePopUpVisible: false,
      createVisible: false,
      editVisible: false
    })
  }

  handleSubmit = async (data, kecamatanID) => {
    let payload = {
      kecamatanID: kecamatanID,
      kelurahan: {
        ...data,
        kelurahanCreationalDTO: {
          ...data.kelurahanCreationalDTO,
          createdDate: M().format("DD-MM-YYYY HH:mm:ss")
        },
      }
    }
    let dataKel = this.state.dataTableKelurahan.map((value) => {
      return {
        "kelurahanID": value && value[0]
      }
    })
    let isExist = R.findIndex(R.propEq('kelurahanID', payload.kelurahan.kelurahanID.toUpperCase()))(dataKel)
    if (isExist < 0) {
      let response = await API.create('MASTERDATA').postKelurahan(payload)
      console.log(response)
      console.log(JSON.stringify(payload))
      if (response.ok && response.data.status === 'S') {
        this.openSavePopUp()
        let dataTableKelurahan = Object.assign([], this.state.dataTableKelurahan)
        dataTableKelurahan.push(
          data.kelurahanID,
          data.kelurahanName,
          data.kelurahanStatus
        )
        this.setState({ dataTableKelurahan })
        this.getKelurahanByKecID(this.state.data.kecamatanID)
      } else {
        if (response.data && response.data.message) alert("Failed, Please Try Again")
      }
    } else {
      alert("Data Already Exist")
    }
  }

  handleUpdate = async (data, kabkotID) => {
    let payload = {
      ...data,
      kelurahanCreationalDTO: {
        ...data.kelurahanCreationalDTO,
        createdDate: data.kelurahanCreationalDTO.createdDate,
        modifiedBy: this.props.user.employeeID,
        modifiedDate: M().format("DD-MM-YYYY HH:mm:ss")
      },
    }
    let response = await API.create('MASTERDATA').updateKelurahan(payload)
    if (response.ok && response.data.status === 'S') {
      this.openSavePopUp()
      let dataTableKelurahan = Object.assign([], this.state.dataTableKelurahan)
      dataTableKelurahan.splice(this.state.selectedIndex, 0,
        data.kelurahanID,
        data.kelurahanName,
        data.kelurahanStatus
      )
      this.setState({ dataTableKelurahan })
      this.getKelurahanByKecID(this.state.data.kecamatanID)
    } else {
      if (response.data && response.data.message) alert("Failed, Please Try Again")
    }
  }

  handleDelete = async () => {
    let payload = {
      referenceID: this.state.rawDataKelurahan[this.state.selectedIndex].kelurahanID,
      requestBy: "DELETE-TEST",
      requestDate: M().format("DD-MM-YYYY HH:mm:ss")
    }
    let response = await API.create('MASTERDATA').deleteKelurahan(payload)
    if (response.ok && response.data.status === 'S') {
      let dataTableKelurahan = Object.assign([], this.state.dataTableKelurahan)
      dataTableKelurahan.splice(this.state.selectedIndex, 1)
      this.setState({ dataTableKelurahan, deletePopUpVisible: false })
    } else {
      if (response.data && response.data.message) alert("Failed, Please Try Again")
    }
  }

  render() {
    let { kecamatanID, kecamatanName } = this.state.data
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
              this.props.onClickSave(this.state.data, this.state.kabkotID)
            }}
          >
            <div className="border-bottom padding-15px grid grid-2x grid-mobile-none gap-20px">
              <div className="column-1">
                <div className="margin-bottom-20px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>Sub District ID <span style={{ color: "red" }}>*</span></h4>
                    </div>
                  </div>
                  <input
                    readOnly={this.props.type === "create" ? false : true}
                    style={{ backgroundColor: this.props.type === "create" ? "" : "#E6E6E6" }}
                    type="text"
                    className="txt txt-sekunder-color"
                    placeholder=""
                    required
                    value={kecamatanID}
                    onChange={(e) => {
                      this.setState({
                        data: {
                          ...this.state.data,
                          kecamatanID: e.target.value
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
                      <h4>Sub District Name <span style={{ color: "red" }}>*</span></h4>
                    </div>
                  </div>
                  <input
                    readOnly={this.props.type === "detail" ? true : false}
                    style={{ backgroundColor: this.props.type === "detail" ? "#E6E6E6" : "" }}
                    type="text"
                    className="txt txt-sekunder-color"
                    placeholder=""
                    required
                    value={kecamatanName}
                    onChange={(e) => {
                      this.setState({
                        data: {
                          ...this.state.data,
                          kecamatanName: e.target.value
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
                    {/* Kelurahan */}
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
                  title='Kelurahan'
                  subtitle={"lorem ipsum dolor"}
                  data={this.state.dataTableKelurahan}
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
          <FormNesKelurahan
            user={this.props.user}
            type={"create"}
            title={"NES Create - Kelurahan"}
            kecamatanID={this.state.data.kecamatanID}
            onClickClose={this.openCreateForm}
            onClickSave={this.handleSubmit.bind(this)}
            onClickDelete={this.openDeletePopup}
          />
        )}

        {this.state.editVisible && (
          <FormNesKelurahan
            user={this.props.user}
            type={"edit"}
            data={this.state.rawDataKelurahan[this.state.selectedIndex]}
            title={"NES Update - Kelurahan"}
            onClickClose={() => this.openEditForm(null)}
            onClickSave={this.handleUpdate.bind(this)}
            onClickDelete={this.openDeletePopup}
          />
        )}

        {this.state.detailVisible && (
          <FormNesKelurahan
            user={this.props.user}
            type={"detail"}
            title={"NES Detail - Kelurahan"}
            data={this.state.rawDataKelurahan[this.state.selectedIndex]}
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

export default FormNesSubDistrict;
