import React, { Component } from "react";
import PopUp from "../../../components/pages/PopUpAlert";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables-bitozen";
import FormCompanyAddress from "./formCompanyAddDetail";
import { connect } from "react-redux";
import MasterDataAction from "../../../Redux/MasterdataRedux";
import LoadingBar from "react-top-loading-bar";
import * as R from "ramda";
import API from "../../../Services/Api";
import M from 'moment';
import uuid from "uuid";


var ct = require("../../../modules/custom/customTable");

class FormCompany extends Component {
  constructor(props) {
    super(props);
    let { companyData } = this.props;

    this.state = {
      companyData,
      createVisible: false,
      editVisible: false,
      viewVisible: false,
      deletePopUpVisible: false,
      createPopUpVisible: false,
      fetching: false,
      refreshing: false,
      dataTable: [],
      rawData: [],
      BizparAddressType: [],
      countryStatus: [],
      provinceStatus: []
    };
  }

  componentDidMount() {
    this.startFetch();
    this.props.getAddress({
      "params": {
        "refObjectID": this.state.companyData.esid
      },
      "offset": 0,
      "limit": 20
    });
    this.getBizparAddressType();
    this.getCountryStatus();
    this.getProvinceByCountryID();
  }

  async getBizparAddressType() {
    let payloadAddress = {
      params: {
        bizparCategory: "ADDRESS_TYPE"
      },
      offset: 0,
      limit: 10
    };
    API.create("BIZPAR")
      .getBizparByCategory(payloadAddress)
      .then(res => {
        if (res.status === 200) {
          console.log(res.data);
          if (res.data.status === "S") {
            this.setState({
              bizparAddressType: res.data.data
            });
          }
        }
      });
  }

  async getCountryStatus() {
    let payloadCountry = {
      params: {
        countryStatus: "ACTIVE"
      },
      offset: 0,
      limit: 200
    };
    API.create("MASTERDATA")
      .getCountryMasterByCountryStatus(payloadCountry)
      .then(res => {
        if (res.status === 200) {
          console.log(res.data);
          if (res.data.status === "S") {
            this.setState({
              countryStatus: res.data.data
            });
          }
        }
      });
  }

  async getProvinceByCountryID() {
    API.create("MASTERDATA")
      .getProvinceByCountryID()
      .then(res => {
        if (res.status === 200) {
          console.log(res.data);
          if (res.data.status === "S") {
            this.setState({
              provinceStatus: res.data.data
            });
          }
        }
      });
  }

  componentWillReceiveProps(newProps) {
    if (
      !newProps.masterdata.fetching &&
      !R.isNil(newProps.masterdata.address)
    ) {
      this.onFinishFetch();
      let dataTable = newProps.masterdata.address.map((value, index) => {
        if (value === null) {
          return [];
        } else {
          const { addressID, addressType, streetName } = value;
          return [addressID, addressType.bizparValue, streetName];
        }
      });

      this.setState({
        rawData: newProps.masterdata.address,
        dataTable
      });
    } else {
      this.onFinishFetch();
    }

    this.setState({
      fetching: newProps.masterdata.fetching,
      refreshing: newProps.masterdata.fetching
    });
  }

  startFetch = () => {
    this.LoadingBar.continousStart();
  };

  onFinishFetch = () => {
    if (typeof this.LoadingBar === "object") this.LoadingBar.complete();
  };

  openCreateAddressForm(type, selectedIndex = null) {
    let {
      createVisible,
      editVisible,
      viewVisible,
      openDeletePopup
    } = this.state;
    let createPopUpVisible = this.state.createPopUpVisible
      ? !this.state.createPopUpVisible
      : false;
    switch (type) {
      case "create":
        this.setState({ createVisible: !createVisible, createPopUpVisible });
        break;
      case "edit":
        this.setState({
          editVisible: !editVisible,
          createPopUpVisible,
          selectedIndex
        });
        break;
      case "view":
        this.setState({ viewVisible: !viewVisible, selectedIndex });
        break;
      case "delete":
        this.setState({ openDeletePopup: !openDeletePopup, selectedIndex });
        break;
      default:
        break;
    }
  }

  openSavePopUp = () => {
    if (
      (this.state.saveClass === "app-popup app-popup-show" &&
        this.state.formCompanyDetailVisible) ||
      (this.state.saveClass === "app-popup app-popup-show" &&
        this.state.createClass === "app-popup app-popup-show")
    ) {
      this.setState({
        dataTable: [],
        saveClass: "app-popup",
        createClass: "app-popup"
      });
    } else {
      this.setState({ saveClass: "app-popup app-popup-show" });
    }
  };

  openDeletePopup = selectedIndex => {
    this.setState({
      deletePopUpVisible: !this.state.deletePopUpVisible,
      selectedIndex
    });
  };

  postAddress(payload) {
    payload = {
      ...payload,
      addressID: uuid.v1()
    }
    console.log('post ' ,payload);
    API.create('MASTERDATA').postAddress(payload).then(
      (res) => {
        if(res.status === 200) {
        if(res.data.status === 'S') {
          console.log(res.data)
          this.setState({ createPopUpVisible: true, dataTable : [] })
          this.props.getAddress({
            "params": {
              "refObjectID": this.state.companyData.esid
            },
            "offset": 0,
            "limit": 20
          })
        } else {
          alert('Failed: '+ res.data.message)
        }
      } else {
        console.log(res)
      }
    })
  }

  deleteAddress(){
    let payload = {
      referenceID: this.state.rawData[this.state.selectedIndex].addressID,
      requestBy : "SYSTEM",
      requestDate : M().format("DD-MM-YYYY HH:mm:ss")
    }

    API.create('MASTERDATA').deleteAddress(payload).then(
      (res) => {
        if(res.status === 200) {
        if(res.data.status === 'S') {
          console.log(res.data)
          this.setState({ deletePopUpVisible: !this.state.deletePopUpVisible })
          this.props.getAddress({
            "params": {
              "refObjectID": this.state.companyData.esid
            },
            "offset": 0,
            "limit": 20
          })
        } else {
          alert('Failed: '+ res.data.message)
        }
      } else {
        console.log(res)
      }
    })
  }

  updateAddress(payload){
    API.create('MASTERDATA').updateAddress(payload).then(
      (res) => {
        if(res.status === 200) {
        if(res.data.status === 'S') {
          console.log(res.data)
          this.setState({ createPopUpVisible: true , dataTable : [] })
          this.props.getAddress({
            "params": {
              "refObjectID": this.state.companyData.esid
            },
            "offset": 0,
            "limit": 20
          })
        } else {
          alert('Failed: '+ res.data.message)
        }
      } else {
        console.log(res)
      }
    })
  }

  handleSubmit(value) {
    value.refObjectID = this.state.companyData.esid;
    let payload = Object.assign({}, value);
    this.postAddress(payload);
  }

  handleDelete(){
    this.deleteAddress();
  }

  handleChange(value){
    let payload = Object.assign({}, value);
    this.updateAddress(payload);
  }

  getMuiTheme = () => createMuiTheme(ct.customTable());

  options = ct.customOptions();

  columnsAddress = [
    {
      name: "AddressID",
      options: {
        customBodyRender: (val, tableMeta) => {
          return (
            <div
              style={{ cursor: "pointer" }}
              onClick={() =>
                this.openCreateAddressForm("view", tableMeta.rowIndex)
              }
            >
              {val}
            </div>
          );
        }
      }
    },
    "Address Type",
    "Street Name",
    {
      name: "Action",
      options: {
        customBodyRender: (val, tableMeta) => {
          return (
            <div>
              {this.props.type !== 'view' ?
              <button
                type="button"
                className="btn btn-red btn-small-circle"
                style={{ marginRight: 5 }}
                onClick={() =>
                  this.openCreateAddressForm("edit", tableMeta.rowIndex)
                }
              >
                <i className="fa fa-lw fa-pencil-alt" />
              </button>
              : null }
              {this.props.type !== 'view' ? 
              <button
                type="button"
                className="btn btn-red btn-small-circle"
                onClick={() => this.openDeletePopup(tableMeta.rowIndex)}
              >
                <i className="fa fa-lw fa-trash-alt" />
              </button>
              : null }
            </div>
          );
        }
      }
    }
  ];

  dataAddress = [["AD-001", "Domisili", "Pulgeb"]];

  render() {
    let { selectedIndex } = this.state;
    return (
      <div className="vertical-tab-content active">
        <LoadingBar onRef={ref => (this.LoadingBar = ref)} />
        <form action="#">
          <div className="border-bottom padding-10px grid-mobile-none gap-20px">
            <div className="col-1 content-right">
              {this.props.type !== 'view'?
              <button
                type="button"
                className="btn btn-circle background-blue"
                style={{ marginRight: 5 }}
                onClick={() => this.openCreateAddressForm("create")}
              >
                <i className="fa fa-1x fa-plus" />
              </button>
              : null }
            </div>
            <div className="padding-5px" />
            <MuiThemeProvider theme={this.getMuiTheme()}>
              <MUIDataTable
                data={this.state.dataTable}
                columns={this.columnsAddress}
                options={this.options}
              />
            </MuiThemeProvider>
          </div>

          {this.state.createVisible && (
            <FormCompanyAddress
              type={"create"}
              onClickClose={() => this.openCreateAddressForm("create")}
              onClickSave={value => this.handleSubmit(value, "create")}
              bizparAddressType={this.state.bizparAddressType}
              countryStatus={this.state.countryStatus}
              provinceStatus={this.state.provinceStatus}
            />
          )}
          {this.state.editVisible && (
            <FormCompanyAddress
              type={"update"}
              onClickClose={() => this.openCreateAddressForm("edit")}
              onClickSave={value => this.handleChange(value, "edit")}
              companyDataAddress={this.state.rawData[selectedIndex]}
              bizparAddressType={this.state.bizparAddressType}
              countryStatus={this.state.countryStatus}
              provinceStatus={this.state.provinceStatus}
            />
          )}
          {this.state.viewVisible && (
            <FormCompanyAddress
              type={"view"}
              onClickClose={() => this.openCreateAddressForm("view")}
              companyDataAddress={this.state.rawData[selectedIndex]}
              bizparAddressType={this.state.bizparAddressType}
              countryStatus={this.state.countryStatus}
              provinceStatus={this.state.provinceStatus}
            />
          )}

          {this.state.createPopUpVisible && (
            <PopUp
              type={"save"}
              class={"app-popup app-popup-show"}
              onClick={
              this.state.createVisible ? () => this.openCreateAddressForm("create") : () => this.openCreateAddressForm("edit")}
            />
          )}

          {this.state.deletePopUpVisible && (
            <PopUp type={'delete'} class={"app-popup app-popup-show"} 
              onClick={this.openDeletePopup.bind(this)} 
              onClickDelete={this.handleDelete.bind(this)}
              />  
          )}
        </form>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    masterdata: state.masterdata
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getAddress: obj => dispatch(MasterDataAction.getAddress(obj))
  };
};

export default connect(mapStateToProps,mapDispatchToProps)(FormCompany);
