import React, { Component } from "react"
import PopUp from "../../../components/pages/PopUpAlert"
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles"
import MUIDataTable from "mui-datatables-bitozen"
import FormCompanyAddress from "./formCompanyAddDetail"
import API from '../../../Services/Api'
import M from 'moment'

var ct = require("../../../modules/custom/customTable")
const getMuiTheme = () => createMuiTheme(ct.customTable())
const options = ct.customOptions5()
// const dateNow = M().format('DD-MM-YYYY HH:mm:ss')

class FormCorporateAddress extends Component {
  constructor(props) {
    super(props);
    let { data, rawData } = this.props;

    this.state = {
      data,
      rawData,
      createVisible: false,
      editVisible: false,
      viewVisible: false,
      deletePopUpVisible: false,
      savePopUpVisible: false,
      fetching: false,
      refreshing: false,
      dataTable: [],
      address: [],
      BizparAddressType: [],
      countryStatus: [],
      provinceStatus: []
    };
  }

  postAddress(payload) {
    payload = {
      ...payload,
      addressID: 'ADD-' + M(),
      refObjectID: this.state.rawData.esid
    }
    // return console.log('post ', payload);
    API.create('MASTERDATA').postAddress(payload).then(
      (res) => {
        if (res.status === 200) {
          if (res.data.status === 'S') {
            this.props.backToPage()
          } else {
            alert('Failed: ' + res.data.message)
          }
        } else {
          console.log(res)
        }
      })
  }

  deleteAddress() {
    let payload = {
      referenceID: this.state.data[this.state.selectedIndex].addressID,
      requestBy: "SYSTEM",
      requestDate: M().format("DD-MM-YYYY HH:mm:ss")
    }

    API.create('MASTERDATA').deleteAddress(payload).then(
      (res) => {
        if (res.status === 200) {
          if (res.data.status === 'S') {
            console.log(res.data)
            this.setState({ deletePopUpVisible: !this.state.deletePopUpVisible })
            this.props.backToPage()
          } else {
            alert('Failed: ' + res.data.message)
          }
        } else {
          console.log(res)
        }
      })
  }

  updateAddress(payload) {
    API.create('MASTERDATA').updateAddress(payload).then(
      (res) => {
        if (res.status === 200) {
          if (res.data.status === 'S') {
            console.log(res.data)
            this.props.backToPage()
          } else {
            alert('Failed: ' + res.data.message)
          }
        } else {
          console.log(res)
        }
      })
  }

  componentDidMount() {
    this.getBizparAddressType();
    this.getCountryStatus();
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

  openCreateAddressForm(type, selectedIndex = null) {
    let {
      createVisible,
      editVisible,
      viewVisible,
      openDeletePopup
    } = this.state;
    let savePopUpVisible = this.state.savePopUpVisible
      ? !this.state.savePopUpVisible
      : false;
    switch (type) {
      case "create":
        this.setState({ createVisible: !createVisible, savePopUpVisible });
        break;
      case "edit":
        this.setState({
          editVisible: !editVisible,
          savePopUpVisible,
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

  handleAddress(index, tipe) {
    this.setState({
      selectedIndex: index,
      tipe
    })
    this.getProvinceByCountryID(this.state.data[index].country.countryID)
  }

  async getKabKot(value) {
    API.create('MASTERDATA').getKabKotByProvinceID(value).then(
      (res) => {
        if (res.status === 200) {
          console.log(res.data);
          if (res.data.status === 'S') {
            this.setState({
              kabKot: res.data.data
            })
            this.getKecamatan(this.state.data[this.state.selectedIndex].kabkot.kabkotID)
          }
        }
      })
  }

  async getKecamatan(value) {
    API.create('MASTERDATA').getKecamatanByKabKotID(value).then(
      (res) => {
        if (res.status === 200) {
          console.log(res.data);
          if (res.data.status === 'S') {
            this.setState({
              kec: res.data.data
            })
            this.getKelurahan(this.state.data[this.state.selectedIndex].kecamatan.kecamatanID)
          }
        }
      })
  }

  async getKelurahan(value) {
    API.create('MASTERDATA').getKelurahanByKecID(value).then(
      (res) => {
        if (res.status === 200) {
          console.log(res.data);
          if (res.data.status === 'S') {
            this.setState({
              kel: res.data.data
            })
            this.openCreateAddressForm(this.state.tipe, this.state.selectedIndex)
          }
        }
      })
  }

  async getProvinceByCountryID(value) {
    API.create('MASTERDATA').getProvinceByCountryID(value).then(
      (res) => {
        if (res.status === 200) {
          console.log(res.data);
          if (res.data.status === 'S') {
            this.setState({
              provinceStatus: res.data.data
            })
            this.getKabKot(this.state.data[this.state.selectedIndex].province.provinceID)
          }
        }
      })
  }

  columnsAddress = [
    'AddressID',
    "Address Type",
    "Street Name",
    {
      name: "Action",
      options: {
        customBodyRender: (val, tableMeta) => {
          return (
            <div>
              {this.props.type !== 'detail' ?
                <button
                  type="button"
                  className="btnAct"
                  style={{ marginRight: 15 }}
                  onClick={() => this.handleAddress(tableMeta.rowIndex, 'edit')}
                >
                  <i className="fa fa-lw fa-pencil-alt" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }}/>
                </button>
                : null}
              {this.props.type !== 'detail' ?
                <button
                  type="button"
                  className="btnAct"
                  style={{ marginRight: 15 }}
                  onClick={() => this.openDeletePopup(tableMeta.rowIndex)}
                >
                  <i className="fa fa-lw fa-trash-alt" style={{ backgroundColor: 'transparent', color: 'red', fontSize: 20 }}/>
                </button>
                : null}
              <button
                type="button"
                className="btnAct"
                onClick={() => this.handleAddress(tableMeta.rowIndex, 'view')}
              >
                <i className="fa fa-lw fa-ellipsis-v" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }}/>
              </button>
            </div>
          );
        }
      }
    }
  ];

  componentDidUpdate(prevProps) {
    if (this.props.data) {
      if (this.props.data !== prevProps.data) {
        this.setState({
          data: this.props.data
        })
      }
    }
  }


  render() {
    let { selectedIndex } = this.state;
    let address = this.state.data
    // console.log('address', address)
    let dataTable = address ? address.map((value) => {
      // if (value === null) {
      //   return []
      // }
      const { addressID, addressType, streetName } = value
      return [
        addressID,
        addressType.bizparValue,
        streetName
      ]
    }) : []
    return (
      <div className="vertical-tab-content active">
        <form action="#">
          <div className="border-bottom padding-15px grid-mobile-none gap-20px">
            <div className="col-1 content-right margin-bottom-10px">
              {this.props.type !== 'detail' ?
                <button
                  type="button"
                  className="btn btn-circle background-blue"
                  onClick={() => this.openCreateAddressForm("create")}
                >
                  <i className="fa fa-1x fa-plus" />
                </button>
                : null}
            </div>
            <MuiThemeProvider theme={getMuiTheme()}>
              <MUIDataTable
                title='Address'
                subtitle={"lorem ipsum dolor"}
                data={dataTable}
                columns={this.columnsAddress}
                options={options}
              />
            </MuiThemeProvider>
          </div>

          {this.state.createVisible && (
            <FormCompanyAddress
              type={"create"}
              onClickClose={() => this.openCreateAddressForm("create")}
              // onClickSave={() => this.setState({ savePopUpVisible: !this.state.savePopUpVisible })}
              onClickSave={this.postAddress.bind(this)}
              bizparAddressType={this.state.bizparAddressType}
              countryStatus={this.state.countryStatus}
            />
          )}
          {this.state.editVisible && (
            <FormCompanyAddress
              type={"update"}
              onClickClose={() => this.openCreateAddressForm("edit")}
              // onClickSave={() => this.setState({ savePopUpVisible: !this.state.savePopUpVisible })}
              onClickSave={this.updateAddress.bind(this)}
              companyDataAddress={address[selectedIndex]}
              bizparAddressType={this.state.bizparAddressType}
              countryStatus={this.state.countryStatus}
              provinceStatus={this.state.provinceStatus}
              kabKot={this.state.kabKot}
              kec={this.state.kec}
              kel={this.state.kel}
            />
          )}
          {this.state.viewVisible && (
            <FormCompanyAddress
              type={"view"}
              onClickClose={() => this.openCreateAddressForm("view")}
              companyDataAddress={address[selectedIndex]}
              bizparAddressType={this.state.bizparAddressType}
              countryStatus={this.state.countryStatus}
              provinceStatus={this.state.provinceStatus}
              kabKot={this.state.kabKot}
              kec={this.state.kec}
              kel={this.state.kel}
            />
          )}

          {this.state.savePopUpVisible && (
            <PopUp
              type={"save"}
              class={"app-popup app-popup-show"}
              onClick={this.state.createVisible ? () => this.openCreateAddressForm("create") : () => this.openCreateAddressForm("edit")}
            />
          )}

          {this.state.deletePopUpVisible && (
            <PopUp
              type={'delete'}
              class={"app-popup app-popup-show"}
              onClick={this.openDeletePopup.bind(this)}
              onClickDelete={this.deleteAddress.bind(this)}
            />
          )}
        </form>
      </div>
    );
  }
}

export default FormCorporateAddress