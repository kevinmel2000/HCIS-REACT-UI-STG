import React, { Component } from "react"
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles"
import MUIDataTable from "mui-datatables-bitozen"
import M from 'moment'
import * as R from 'ramda'
import API from '../../../Services/Api'
import PopUp from '../../../components/pages/PopUpAlert'
import DropDown from '../../../modules/popup/DropDown'
import CalendarPicker from '../../../modules/popup/Calendar'
import FormOutsourceAddressDetail from "./formOutsourceAddressDetail"

var ct = require("../../../modules/custom/customTable")

const defaultPayloadFamily = {
  "applicantFamilyID": "",
  "familyBirthDate": "",
  "familyBirthPlace": "",
  "familyDivorceDate": "",
  "familyEducationLevel": "",
  "familyGenderType": "",
  "familyKTPNumber": "",
  "familyMaritalStatus": "",
  "familyName": "",
  "familyNationalityType": "",
  "familyOccupation": "",
  "familyRelationshipType": "",
  "familyReligionType": "",
  "familyType": "",
  "applicantFamilyAddress": {
    "address": []
  }
}


class FormOutsourceFamilyDetail extends Component {
  constructor(props) {
    super(props);
    let { applicantDataFamily, bizparFamilyType, bizparFamilyRelational, bizparEducationLevel, bizparNationality, bizparGender, bizparReligion } = this.props;

    this.state = {
      payloadFamily: applicantDataFamily ? applicantDataFamily : defaultPayloadFamily,
      bizparFamilyType,
      bizparFamilyRelational,
      bizparEducationLevel,
      bizparNationality,
      bizparGender,
      bizparReligion,
      dataTableAddress: [],
      rawDataAddress: [],
      createVisible: false,
      createPopUpVisible: false,
      deletePopUpVisible: false,
      editVisible: false,
      viewVisible: false,
      bizparAddressType: [],
      countryStatus: [],
      provinceStatus: [],
      kec: [],
      kel: [],
      kabKot: [],
      placeDate: false
    };
  }

  componentWillReceiveProps(newProps) {
    let { applicantDataFamily } = newProps
    this.setState({ applicantDataFamily })
  }

  componentWillMount() {
    let { payloadFamily } = this.state
    let xxa = []
    if (!R.isEmpty(payloadFamily.applicantFamilyAddress.address)) {
      let addModif = Object.assign([], payloadFamily.applicantFamilyAddress.address)
      xxa = addModif.map((data, index) => {
        let obj = {
          ...data,
          country: data.country.countryID,
          addressType: data.addressType.bizparKey,
          province: data.province.provinceID,
          kabkot: data.kabkot.kabkotID,
          kecamatan: data.kecamatan.kecamatanID,
          kelurahan: data.kelurahan.kelurahanID
        }
        return obj
      })
    }

    this.setState({
      payloadFamily: {
        ...this.state.payloadFamily,
        familyBirthDate: payloadFamily.familyBirthDate === "" || payloadFamily.familyBirthDate === null ? "" : M(payloadFamily.familyBirthDate, 'DD-MM-YYYY').format('YYYY-MM-DD'),
        familyDivorceDate: payloadFamily.familyDivorceDate === "" || payloadFamily.familyDivorceDate === null ? "" : M(payloadFamily.familyDivorceDate, 'DD-MM-YYYY').format('YYYY-MM-DD'),
        familyRelationshipType: payloadFamily.familyRelationshipType && !R.isNil(payloadFamily.familyRelationshipType.bizparKey) ? payloadFamily.familyRelationshipType.bizparKey : payloadFamily.familyRelationshipType,
        familyEducationLevel: payloadFamily.familyEducationLevel && !R.isNil(payloadFamily.familyEducationLevel.bizparKey) ? payloadFamily.familyEducationLevel.bizparKey : payloadFamily.familyEducationLevel,
        familyGenderType: payloadFamily.familyGenderType && !R.isNil(payloadFamily.familyGenderType.bizparKey) ? payloadFamily.familyGenderType.bizparKey : payloadFamily.familyGenderType,
        familyMaritalStatus: payloadFamily.familyMaritalStatus && !R.isNil(payloadFamily.familyMaritalStatus.bizparKey) ? payloadFamily.familyMaritalStatus.bizparKey : payloadFamily.familyMaritalStatus,
        familyReligionType: payloadFamily.familyReligionType && !R.isNil(payloadFamily.familyReligionType.bizparKey) ? payloadFamily.familyReligionType.bizparKey : payloadFamily.familyReligionType,
        familyNationalityType: payloadFamily.familyNationalityType && !R.isNil(payloadFamily.familyNationalityType.bizparKey) ? payloadFamily.familyNationalityType.bizparKey : payloadFamily.familyNationalityType,
        familyType: payloadFamily.familyType && !R.isNil(payloadFamily.familyType.bizparKey) ? payloadFamily.familyType.bizparKey : payloadFamily.familyType,
        applicantFamilyAddress: {
          address: xxa
        }
      }
    })
  }

  getMuiTheme = () => createMuiTheme(ct.customTable());

  options = ct.customOptions();

  async getBizparAddressType() {
    let payloadAddress = {
      params: {
        bizparCategory: "ADDRESS_TYPE"
      },
      offset: 0,
      limit: 10
    }
    API.create('BIZPAR').getBizparByCategory(payloadAddress).then(
      (res) => {
        if (res.status === 200) {
          if (res.data.status === 'S') {
            this.setState({
              bizparAddressType: res.data.data
            })
          }
        }
      })
  }

  async getCountryStatus() {
    let payloadCountry = {
      params: {
        "countryStatus": "ACTIVE"
      },
      offset: 0,
      limit: 200
    }
    API.create('MASTERDATA').getCountryMasterByCountryStatus(payloadCountry).then(
      (res) => {
        if (res.status === 200) {
          if (res.data.status === 'S') {
            this.setState({
              countryStatus: res.data.data
            })
          }
        }
      })
  }

  componentDidMount() {
    this.getBizparAddressType();
    this.getCountryStatus();
  }

  handleAddress(index, tipe) {
    let id = R.isNil(this.state.payloadFamily.applicantFamilyAddress.address[index].country) ||
      R.isEmpty(this.state.payloadFamily.applicantFamilyAddress.address[index].country) ? null : this.state.payloadFamily.applicantFamilyAddress.address[index].country
    this.setState({
      selectedIndex: index,
      tipe
    })
    this.getProvinceByCountryID(id)
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
            this.getKabKot(this.state.payloadFamily.applicantFamilyAddress.address[this.state.selectedIndex].province)
          }
        }
        if (res.status === 404) {
          this.getKabKot(null)
        }
      })
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
            this.getKecamatan(this.state.payloadFamily.applicantFamilyAddress.address[this.state.selectedIndex].kabkot)
          }
        }
        if (res.status === 404) {
          this.getKecamatan(null)
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
            this.getKelurahan(this.state.payloadFamily.applicantFamilyAddress.address[this.state.selectedIndex].kecamatan)
          }
        }
        if (res.status === 404) {
          this.getKelurahan(null)
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
            switch (this.state.tipe) {
              case 'edit':
                this.openCloseEditAddress(this.state.selectedIndex)
                break
              case 'view':
                this.openCloseViewAddress(this.state.selectedIndex)
                break
              default:
                break
            }

          }
        }
        if (res.status === 404) {
          switch (this.state.tipe) {
            case 'edit':
              this.openCloseEditAddress(this.state.selectedIndex)
              break
            case 'view':
              this.openCloseViewAddress(this.state.selectedIndex)
              break
            default:
              break
          }

        }
      })
  }

  columnsAddress = [
    "Address Number",
    {
      name: "Type",
      options: {
        customBodyRender: (val) => {
          let indexType = R.findIndex(R.propEq('bizparKey', val))(this.state.bizparAddressType)
          return indexType >= 0 ? this.state.bizparAddressType[indexType].bizparValue : val
        }
      }
    },
    "Address",
    {
      name: "Action",
      options: {
        customBodyRender: (val, tableMeta) => {
          return (
            this.props.type !== 'view' ?
              <div>
                <button
                  type="button"
                  className="btnAct"
                  style={{ marginRight: 15 }}
                  onClick={() => this.handleAddress(tableMeta.rowIndex, 'edit')}
                >
                  <i className="fa fa-pencil-alt" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }}/>
                </button>
                <button
                  type="button"
                  className="btnAct"
                  style={{ marginRight: 15 }}
                  onClick={() => this.openDeletePopup(tableMeta.rowIndex)}
                >
                    <i className="fa fa-trash-alt" style={{ backgroundColor: 'transparent', color: 'red', fontSize: 20 }}/>
                </button>
                <button
                  type="button"
                  className="btnAct"
                  onClick={() => this.handleAddress(tableMeta.rowIndex, 'view')}
                >
                  <i className="fa fa-ellipsis-v" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }}/>
                </button>
              </div> :
              <button
                type="button"
                className="btnAct"
                onClick={() => this.handleAddress(tableMeta.rowIndex, 'view')}
              >
                <i className="fa fa-ellipsis-v" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }}/>
              </button>
          );
        }
      }
    }
  ];

  openCloseCreateAddress() {
    let createPopUpVisible = this.state.createPopUpVisible ? !this.state.createPopUpVisible : false;
    this.setState({ createVisible: !this.state.createVisible, createPopUpVisible })
  }

  openCloseEditAddress(selectedIndex) {
    this.setState({ editVisible: !this.state.editVisible, selectedIndex })
  }

  openCloseViewAddress(selectedIndex) {
    this.setState({ viewVisible: !this.state.viewVisible, selectedIndex })
  }

  openDeletePopup(selectedIndex) {
    this.setState({
      deletePopUpVisible: !this.state.deletePopUpVisible,
      selectedIndex
    });
  }

  addAddress() {
    this.setState({
      createVisible: false,
      deletePopUpVisible: false,
      editVisible: false,
    })
  }

  opPlaceDate = () => {
    if (this.state.placeDate === false) {
      this.setState({
        placeDate: true
      })
    } else {
      this.setState({
        placeDate: false
      })
    }
  }


  handleIDNumber = (e) => {
    if (isNaN(e.target.value)) return true
    this.setState({
      payloadFamily: {
        ...this.state.payloadFamily,
        familyKTPNumber: e.target.value
      }
    })
  }

  render() {
    let dataTableAddress = this.state.payloadFamily.applicantFamilyAddress.address.map((value) => {
      const { addressID, addressType, streetName } = value;
      return [
        addressID, addressType, streetName
      ]
    })

    return (
      <div className="app-popup app-popup-show">
        <div className="padding-top-20px" />
        <div className="popup-content background-white border-radius">
          <div className="popup-panel grid grid-2x">
            <div className="col-1">
              <div className="popup-title">
                {this.props.type === "create"
                  ? "Applicant Detail - Family - Create Form"
                  : this.props.type === "update"
                    ? "Applicant Detail - Family - Edit Form"
                    : "Applicant Detail - Family - View Form"}
              </div>
            </div>
            <div className="col-2 content-right">
              <button
                type="button"
                className="btn btn-circle btn-grey"
                onClick={this.props.onClickClose}
              >
                <i className="fa fa-lg fa-times" />
              </button>
            </div>
          </div>
          <form action="#">
            <div className="border-bottom padding-15px grid grid-3x grid-mobile-none gap-20px">
              <div className="column-1">
                {this.props.type !== "create" ? (
                  <div className="margin-bottom-20px">
                    <div className="margin-5px">
                      <div className="txt-site txt-11 txt-main txt-bold">
                        <h4>Family Number</h4>
                      </div>
                    </div>
                    <input
                      readOnly
                      style={{ backgroundColor: "#E6E6E6" }}
                      type="text"
                      className="txt txt-sekunder-color"
                      placeholder=""
                      required
                      value={this.state.payloadFamily.applicantFamilyID}
                    />
                  </div>
                ) : null}

                <div className="margin-bottom-20px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>Family Type <span style={{ color: "red" }}>*</span></h4>
                    </div>
                  </div>
                  <DropDown
                    title="-- please select address type --"
                    onChange={(dt) => this.setState({
                      payloadFamily: {
                        ...this.state.payloadFamily,
                        familyType: dt
                      }
                    })}
                    type="bizpar"
                    disabled={this.props.type !== "create" ? true : false}
                    data={this.props.bizparFamilyType}
                    value={
                      this.state.payloadFamily.familyType &&
                        this.state.payloadFamily.familyType.bizparKey ?
                        this.state.payloadFamily.familyType.bizparKey :
                        this.state.payloadFamily.familyType
                    } />
                </div>

                <div className="margin-bottom-20px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>Relationship <span style={{ color: "red" }}>*</span></h4>
                    </div>
                  </div>
                  <DropDown
                    title="-- please select relationship --"
                    onChange={(dt) => this.setState({
                      payloadFamily: {
                        ...this.state.payloadFamily,
                        familyRelationshipType: dt
                      }
                    })}
                    type="bizpar"
                    disabled={this.props.type === "view" ? true : false}
                    data={this.props.bizparFamilyRelational}
                    value={this.state.payloadFamily.familyType &&
                      this.state.payloadFamily.familyRelationshipType.bizparKey ?
                      this.state.payloadFamily.familyRelationshipType.bizparKey :
                      this.state.payloadFamily.familyRelationshipType} />
                </div>

                <div className="margin-bottom-20px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>Name <span style={{ color: "red" }}>*</span></h4>
                    </div>
                  </div>
                  <input
                    readOnly={this.props.type === "view" ? true : false}
                    value={this.state.payloadFamily.familyName && this.state.payloadFamily.familyName ? this.state.payloadFamily.familyName : this.state.payloadFamily.familyName}
                    onChange={(e) => this.setState({
                      payloadFamily: {
                        ...this.state.payloadFamily,
                        familyName: e.target.value
                      }
                    })}
                    style={
                      this.props.type === "view"
                        ? { backgroundColor: "#E6E6E6" }
                        : null
                    }
                    type="text"
                    className="txt txt-sekunder-color"
                    placeholder=""
                    required
                  />
                </div>

                <div className="margin-bottom-20px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>Job</h4>
                    </div>
                  </div>
                  <input
                    readOnly={this.props.type === "view" ? true : false}
                    value={this.state.payloadFamily.familyOccupation}
                    onChange={(e) => this.setState({
                      payloadFamily: {
                        ...this.state.payloadFamily,
                        familyOccupation: e.target.value
                      }
                    })}
                    style={
                      this.props.type === "view"
                        ? { backgroundColor: "#E6E6E6" }
                        : null
                    }
                    type="text"
                    className="txt txt-sekunder-color"
                    placeholder=""
                  />
                </div>
              </div>

              <div className="column-2">
                <div className="margin-bottom-20px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>KTP Number</h4>
                    </div>
                  </div>
                  <input
                    readOnly={this.props.type === "view" ? true : false}
                    maxLength={16}
                    value={this.state.payloadFamily.familyKTPNumber}
                    onChange={this.handleIDNumber.bind(this)}
                    style={
                      this.props.type === "view"
                        ? { backgroundColor: "#E6E6E6" }
                        : null
                    }
                    type="text"
                    className="txt txt-sekunder-color"
                    placeholder=""
                  />
                </div>

                <div className="margin-bottom-20px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>Gender</h4>
                    </div>
                  </div>
                  <DropDown
                    title="-- please select gender --"
                    onChange={(dt) => this.setState({
                      payloadFamily: {
                        ...this.state.payloadFamily,
                        familyGenderType: dt
                      }
                    })}
                    type="bizpar"
                    disabled={this.props.type === "view" ? true : false}
                    data={this.props.bizparGender}
                    value={this.state.payloadFamily.familyGenderType &&
                      this.state.payloadFamily.familyGenderType.bizparKey ?
                      this.state.payloadFamily.familyGenderType.bizparKey :
                      this.state.payloadFamily.familyGenderType} />
                </div>

                <div className="margin-bottom-20px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>Birth Place</h4>
                    </div>
                  </div>
                  <input
                    readOnly={this.props.type === "view" ? true : false}
                    value={this.state.payloadFamily.familyBirthPlace && this.state.payloadFamily.familyBirthPlace ? this.state.payloadFamily.familyBirthPlace : this.state.payloadFamily.familyBirthPlace}
                    onChange={(e) => this.setState({
                      payloadFamily: {
                        ...this.state.payloadFamily,
                        familyBirthPlace: e.target.value
                      }
                    })}
                    style={
                      this.props.type === "view"
                        ? { backgroundColor: "#E6E6E6" }
                        : null
                    }
                    type="text"
                    className="txt txt-sekunder-color"
                    placeholder=""
                  />
                </div>

                <div className="margin-bottom-20px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>Date of Divorce</h4>
                    </div>
                  </div>
                  <CalendarPicker
                    date={this.state.payloadFamily.familyDivorceDate && this.state.payloadFamily.familyDivorceDate ? this.state.payloadFamily.familyDivorceDate : this.state.payloadFamily.familyDivorceDate}
                    disabled={this.props.type === "view" ? true : false}
                    onChange={(e) => this.setState({
                      payloadFamily: {
                        ...this.state.payloadFamily,
                        familyDivorceDate: M(e).format("YYYY-MM-DD")
                      }
                    })} />
                </div>
              </div>

              <div className="column-3">
                <div className="margin-bottom-20px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                    <h4>Date of Birth</h4>
                    </div>
                  </div>
                  <CalendarPicker
                    date={this.state.payloadFamily.familyBirthDate && this.state.payloadFamily.familyBirthDate ? this.state.payloadFamily.familyBirthDate : this.state.payloadFamily.familyBirthDate}
                    disabled={this.props.type === "view" ? true : false}
                    onChange={(e) => this.setState({
                      payloadFamily: {
                        ...this.state.payloadFamily,
                        familyBirthDate: M(e).format("YYYY-MM-DD")
                      }
                    })} /> </div>

                <div className="margin-bottom-20px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>Religion</h4>
                    </div>
                  </div>
                  <DropDown
                    title="-- please select religion --"
                    onChange={(dt) => this.setState({
                      payloadFamily: {
                        ...this.state.payloadFamily,
                        familyReligionType: dt
                      }
                    })}
                    type="bizpar"
                    disabled={this.props.type === "view" ? true : false}
                    data={this.props.bizparReligion}
                    value={this.state.payloadFamily.familyReligionType &&
                      this.state.payloadFamily.familyReligionType.bizparKey ?
                      this.state.payloadFamily.familyReligionType.bizparKey :
                      this.state.payloadFamily.familyReligionType} />
                </div>

                <div className="margin-bottom-20px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>Education</h4>
                    </div>
                  </div>
                  <DropDown
                    title="-- please select education --"
                    onChange={(dt) => this.setState({
                      payloadFamily: {
                        ...this.state.payloadFamily,
                        familyEducationLevel: dt
                      }
                    })}
                    type="bizpar"
                    disabled={this.props.type === "view" ? true : false}
                    data={this.props.bizparEducationLevel}
                    value={this.state.payloadFamily.familyEducationLevel &&
                      this.state.payloadFamily.familyEducationLevel.bizparKey ?
                      this.state.payloadFamily.familyEducationLevel.bizparKey :
                      this.state.payloadFamily.familyEducationLevel} />
                </div>

                <div className="margin-bottom-20px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>Citizenship</h4>
                    </div>
                  </div>
                  <DropDown
                    title="-- please select citizenship --"
                    onChange={(dt) => this.setState({
                      payloadFamily: {
                        ...this.state.payloadFamily,
                        familyNationalityType: dt
                      }
                    })}
                    type="bizpar"
                    disabled={this.props.type === "view" ? true : false}
                    data={this.props.bizparNationality}
                    value={this.state.payloadFamily.familyNationalityType &&
                      this.state.payloadFamily.familyNationalityType.bizparKey ?
                      this.state.payloadFamily.familyNationalityType.bizparKey :
                      this.state.payloadFamily.familyNationalityType} />
                </div>
              </div>
            </div>

            <div className="padding-10px">
              <div className="col-2 content-right margin-bottom-10px">
                {this.props.type !== 'view' ?
                  <button
                    type="button"
                    className="btn btn-circle background-blue"
                    onClick={this.openCloseCreateAddress.bind(this)}
                  >
                    <i className="fa fa-1x fa-plus" />
                  </button>
                  : null}
              </div>

              <MuiThemeProvider theme={this.getMuiTheme()}>
                <MUIDataTable
                  title="Address"
                  data={dataTableAddress}
                  columns={this.columnsAddress}
                  options={this.options}
                />
              </MuiThemeProvider>
            </div>

            {this.state.createVisible && (
              <FormOutsourceAddressDetail
                onClickSave={(value) => this.addAddress(value)}
                type="create"
                bizparAddressType={this.state.bizparAddressType}
                countryStatus={this.state.countryStatus}
                provinceStatus={this.state.provinceStatus}
                onClickClose={this.openCloseCreateAddress.bind(this)}
              />
            )}

            {this.state.editVisible && (
              <FormOutsourceAddressDetail
                onClickSave={(value) => this.addAddress(value)}
                data={this.state.payloadFamily.applicantFamilyAddress.address[this.state.selectedIndex]}
                type="update"
                bizparAddressType={this.state.bizparAddressType}
                countryStatus={this.state.countryStatus}
                provinceStatus={this.state.provinceStatus}
                kabKot={this.state.kabKot}
                kec={this.state.kec}
                kel={this.state.kel}
                onClickClose={this.openCloseEditAddress.bind(this)}
              />
            )}

            {this.state.viewVisible && (
              <FormOutsourceAddressDetail
                data={this.state.payloadFamily.applicantFamilyAddress.address[this.state.selectedIndex]}
                type="view"
                bizparAddressType={this.state.bizparAddressType}
                countryStatus={this.state.countryStatus}
                provinceStatus={this.state.provinceStatus}
                kabKot={this.state.kabKot}
                kec={this.state.kec}
                kel={this.state.kel}
                onClickClose={this.openCloseViewAddress.bind(this)}
              />
            )}

            {this.state.deletePopUpVisible && (
              <PopUp type={'delete'} class={"app-popup app-popup-show"}
                onClick={this.openDeletePopup.bind(this)}
                onClickDelete={() => this.addAddress(this.state.selectedIndex, true)}
              />
            )}

            <div className="padding-15px">
              <div className="grid grid-2x">
                <div className="col-1" />
                <div className="col-2 content-right">
                  {this.props.type !== "view" ? (
                    <button
                      style={{ marginLeft: "15px" }}
                      className="btn btn-blue"
                      type="button"
                      onClick={this.props.onSave.bind(this)}
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
        <div className="padding-bottom-20px" />
      </div>
    );
  }
}
export default FormOutsourceFamilyDetail;
