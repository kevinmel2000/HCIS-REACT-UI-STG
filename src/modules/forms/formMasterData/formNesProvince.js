import React, { Component } from "react";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables-bitozen";
import FormNesDistrict from "./formNesDistrict";
import PopUp from "../../../components/pages/PopUpAlert";
import API from "../../../Services/Api"
import M from 'moment'

var ct = require("../../../modules/custom/customTable");
const payloadProvinceDefault = {
  "provinceID": "",
  "provinceName": "",
  "provinceStatus": "ACTIVE",
  "setKabKotDTOs": [],
  "provinceCreationalDTO": {
    "createdBy": "SYSTEM",
    "createdDate": M().format("DD-MM-YYYY HH:mm:ss"),
    "modifiedBy": null,
    "modifiedDate": null
  }
}

class FormNesProvince extends Component {
  constructor(props) {
    super(props)
    this.state = {
      createVisible: false,
      editVisible: false,
      detailVisible: false,
      deletePopUpVisible: false,
      savePopUpVisible: false,
      data: props.data ? props.data : {
        ...payloadProvinceDefault,
        provinceCreationalDTO: {
          ...payloadProvinceDefault.provinceCreationalDTO, createdBy: props.user.employeeID, modifiedBy: props.user.employeeID
        }
      },
      dataTableDistrict: [],
      countryID: props.countryID
    };
  }

  async getKabKotByProvinceID(value) {
    API.create("MASTERDATA")
      .getKabKotByProvinceID(value)
      .then(res => {
        if (res.status === 200) {
          console.log(res.data);
          if (res.data.status === "S") {
            this.setState({
              dataTableDistrict: res.data.data
            });
          }
          let dataTableDistrict = this.state.dataTableDistrict.map((value) => {
            const { kabkotID, kabkotName, kabkotStatus } = value;
            return [
              kabkotID,
              kabkotName,
              kabkotStatus
            ]
          })
          this.setState({
            dataTableDistrict,
            rawDataDistrict: res.data.data
          })
        }
      });
  }

  componentDidMount() {
    this.getKabKotByProvinceID(this.state.data.provinceID)
  }

  getMuiTheme = () => createMuiTheme(ct.customTable());

  options = ct.customOptions5();

  columns = [
    "District ID",
    "District Name",
    {
      name: "District Status",
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
    this.getKabKotByProvinceID(this.state.data.provinceID)
    this.setState({
      savePopUpVisible: false,
      createVisible: false,
      editVisible: false
    })
  }

  handleSubmit = async (data, provinceID) => {
    let payload = {
      provinceID: provinceID,
      kabkot: {
        ...data,
        kabkotCreationalDTO: {
          ...data.kabkotCreationalDTO,
          createdDate: M().format("DD-MM-YYYY HH:mm:ss")
        },
      }
    }
    let response = await API.create('MASTERDATA').postKabupatenkota(payload)
    if (response.ok && response.data.status === 'S') {
      this.openSavePopUp()
      let dataTableDistrict = Object.assign([], this.state.dataTableDistrict)
      dataTableDistrict.push(
        data.kabkotID,
        data.kabkotName,
        data.kabkotStatus
      )
      this.setState({ dataTableDistrict })
      this.getKabKotByProvinceID(this.state.data.provinceID)
    } else {
      if (response.data && response.data.message) alert("Data Already Exist")
    }
  }

  handleUpdate = async (data, provinceID) => {
    let payload = {
      ...data,
      kabkotCreationalDTO: {
        ...data.kabkotCreationalDTO,
        createdDate: data.kabkotCreationalDTO.createdDate,
        modifiedBy: this.props.user.employeeID,
        modifiedDate: M().format("DD-MM-YYYY HH:mm:ss")
      },
    }
    let response = await API.create('MASTERDATA').updateKabupatenkota(payload)
    if (response.ok && response.data.status === 'S') {
      this.openSavePopUp()
      let dataTableDistrict = Object.assign([], this.state.dataTableDistrict)
      dataTableDistrict.splice(this.state.selectedIndex, 0,
        data.kabkotID,
        data.kabkotName,
        data.kabkotStatus
      )
      this.setState({ dataTableDistrict })
      this.getKabKotByProvinceID(this.state.provinceID)
    } else {
      if (response.data && response.data.message) alert(response.data.message)
    }
  }

  handleDelete = async () => {
    let payload = {
      referenceID: this.state.rawDataDistrict[this.state.selectedIndex].kabkotID,
      requestBy: "DELETE-TEST",
      requestDate: M().format("DD-MM-YYYY HH:mm:ss")
    }
    let response = await API.create('MASTERDATA').deleteKabupatenkota(payload)
    if (response.ok && response.data.status === 'S') {
      let dataTableDistrict = Object.assign([], this.state.dataTableDistrict)
      dataTableDistrict.splice(this.state.selectedIndex, 1)
      this.setState({ dataTableDistrict, deletePopUpVisible: false })
    } else {
      if (response.data && response.data.message) alert(response.data.message)
    }
  }

  render() {
    let { provinceID, provinceName } = this.state.data
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
              this.props.onClickSave(this.state.data, this.state.countryID)
            }}
          >
            <div className="border-bottom padding-15px grid grid-2x grid-mobile-none gap-20px">
              <div className="column-1">
                <div className="margin-bottom-20px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>Province ID <span style={{ color: "red" }}>*</span></h4>
                    </div>
                  </div>
                  <input
                    readOnly={this.props.type === "create" ? false : true}
                    style={{ backgroundColor: this.props.type === "create" ? "" : "#E6E6E6" }}
                    type="text"
                    className="txt txt-sekunder-color"
                    placeholder=""
                    required
                    value={provinceID}
                    onChange={(e) => {
                      this.setState({
                        data: {
                          ...this.state.data,
                          provinceID: e.target.value
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
                      <h4>Province Name <span style={{ color: "red" }}>*</span></h4>
                    </div>
                  </div>
                  <input
                    readOnly={this.props.type === "detail" ? true : false}
                    style={{ backgroundColor: this.props.type === "detail" ? "#E6E6E6" : "" }}
                    type="text"
                    className="txt txt-sekunder-color"
                    placeholder=""
                    required
                    value={provinceName}
                    onChange={(e) => {
                      this.setState({
                        data: {
                          ...this.state.data,
                          provinceName: e.target.value
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
                    {/* District */}
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
                  title='District'
                  subtitle={"lorem ipsum dolor"}
                  data={this.state.dataTableDistrict}
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
          <FormNesDistrict
            user={this.props.user}
            type={"create"}
            title={"NES Create - District"}
            provinceID={this.state.data.provinceID}
            onClickClose={this.openCreateForm}
            onClickSave={this.handleSubmit.bind(this)}
            onClickDelete={this.openDeletePopup}
          />
        )}

        {this.state.editVisible && (
          <FormNesDistrict
            user={this.props.user}
            type={"edit"}
            data={this.state.rawDataDistrict[this.state.selectedIndex]}
            title={"NES Update - District"}
            onClickClose={() => this.openEditForm(null)}
            onClickSave={this.handleUpdate.bind(this)}
            onClickDelete={this.openDeletePopup}
          />
        )}

        {this.state.detailVisible && (
          <FormNesDistrict
            user={this.props.user}
            type={"detail"}
            title={"NES Detail - District"}
            data={this.state.rawDataDistrict[this.state.selectedIndex]}
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

export default FormNesProvince;
