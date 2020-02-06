import React, { Component } from "react";
import LoadingBar from "react-top-loading-bar";
import * as R from 'ramda'
import { connect } from "react-redux";
import { PDFReader } from 'reactjs-pdf-reader';
import Loader from 'react-loader-spinner'

var ct = require("../../custom/customTable");

class FormEmployee extends Component {
  constructor(props) {
    super(props);
    this.state = {
      detailVisible: false,
      reportVisible: false,
      selectedIndex: null,
      printClass: "app-popup",
      auth: this.props.auth,
      reportURL: '',
    };
  }

  async openReport(value) {
    let response = await fetch(process.env.REACT_APP_HCIS_BE_API + 'report/po/daftar.riwayat.hidup/' + this.state.auth.user.employeeID, {
      headers: {
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiJ9.5BG9SEVOGo_xRhtT8IkyoSy60kPg8HM9Vpvb0TdNew4',
        'Content-Type': 'application/pdf',
      }
    })

    console.log(response)
    response = await response.blob()
    console.log(response)
    if (response.size > 0) {
      response = URL.createObjectURL(response);
      this.setState({ reportURL: response, reportVisible: !this.state.reportVisible })
    }
  }
  closeReport() {
    this.setState({ reportVisible: !this.state.reportVisible })
  }

  async downloadReport(value) {
    let res = await fetch(process.env.REACT_APP_HCIS_BE_API + 'report/po/daftar.riwayat.hidup/' + this.state.auth.user.employeeID, {
      headers: {
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiJ9.5BG9SEVOGo_xRhtT8IkyoSy60kPg8HM9Vpvb0TdNew4',
        'Content-Type': 'application/pdf',
      }
    })
    res = await res.blob()
    console.log(res)
    if (res.size > 0) {
      res = URL.createObjectURL(res);
      window.open(res)
    }
  }

  componentDidMount() {
    this.onFinishFetch();
  }

  startFetch = () => {
    this.LoadingBar.continousStart();
  };

  onFinishFetch = () => {
    if (typeof this.LoadingBar === "object") this.LoadingBar.complete();
  };

  options = ct.customOptions();

  handlePopUp = () => {
    this.setState({
      savePopUpVisible: false
    });
  };

  render() {
    let { biodata, address, photo, emailCompany, emailPersonal, addressDomisili, addressKtp, kecamatanKtp, kelurahanKtp, provinceKtp, rtKtp, rwKtp, postalCodeKtp, kabKotaKtp, kecamatanDomisili, kelurahanDomisili, provinceDomisili, rtDomisili, rwDomisili, postalCodeDomisili, kabKotaDomisili ,loading} = this.props;
    if (this.props.biodata.length !== 0) {
      let biodata = R.clone(this.props.biodata)
      let employeeEmails = R.clone(biodata.employeeEmails)
      let indexCompany = R.findIndex(R.propEq('employeeEmailType', "COMPANY"))(employeeEmails)
      let indexPersonal = R.findIndex(R.propEq('employeeEmailType', "PERSONAL"))(employeeEmails)
      emailCompany = indexCompany !== -1 ? employeeEmails[indexCompany].employeeEmail : ""
      emailPersonal = indexPersonal !== -1 ? employeeEmails[indexPersonal].employeeEmail : ""
    }

    if (address.length !== 0) {
      let employeeAddress = address.map((value, index) => {
        return {
          "addressType": value.addressType.bizparValue,
          "streetName": value.streetName,
          "rt": value.rt,
          "rw": value.rw,
          "kecamatan": value.kecamatan,
          "kelurahan": value.kelurahan,
          "kabkot": value.kabkot,
          "province": value.province,
        }
      })
      let indexDomisili = R.findIndex(R.propEq("addressType", "DOMISILI"))(employeeAddress)
      let indexKtp = R.findIndex(R.propEq("addressType", "KTP"))(employeeAddress)
      addressDomisili = indexDomisili !== -1 ? employeeAddress[indexDomisili].streetName : ""
      addressKtp = indexKtp !== -1 ? employeeAddress[indexKtp].streetName : ""
      rtDomisili = indexDomisili !== -1 ? employeeAddress[indexDomisili].rt : ""
      rtKtp = indexKtp !== -1 ? employeeAddress[indexKtp].rt : ""
      rwDomisili = indexDomisili !== -1 ? employeeAddress[indexDomisili].rw : ""
      rwKtp = indexKtp !== -1 ? employeeAddress[indexKtp].rw : ""
      postalCodeDomisili = indexDomisili !== -1 ? employeeAddress[indexDomisili].kelurahan.subZipcode : ""
      postalCodeKtp = indexKtp !== -1 ? employeeAddress[indexKtp].kelurahan.subZipcode : ""
      kelurahanDomisili = indexDomisili !== -1 ? employeeAddress[indexDomisili].kelurahan.kelurahanName : ""
      kelurahanKtp = indexKtp !== -1 ? employeeAddress[indexKtp].kelurahan.kelurahanName : ""
      kecamatanDomisili = indexDomisili !== -1 ? employeeAddress[indexDomisili].kecamatan.kecamatanName : ""
      kecamatanKtp = indexKtp !== -1 ? employeeAddress[indexKtp].kecamatan.kecamatanName : ""
      kabKotaDomisili = indexDomisili !== -1 ? employeeAddress[indexDomisili].kabkot.kabkotName : ""
      kabKotaKtp = indexKtp !== -1 ? employeeAddress[indexKtp].kabkot.kabkotName : ""
      provinceDomisili = indexDomisili !== -1 ? employeeAddress[indexDomisili].province.provinceName : ""
      provinceKtp = indexKtp !== -1 ? employeeAddress[indexKtp].province.provinceName : ""
    }

    return (
      <div>
        <LoadingBar onRef={ref => (this.LoadingBar = ref)} />
        <div style={{ margin: 'auto' }}>
          <div className='content-right'>
            <button
              className="btn btn-blue btn-circle"
              onClick={this.openReport.bind(this)}>
              <i className="fa fa-lw fa-print" />
            </button>
          </div>
          <table
            class="table table-bordered"
            style={{ width: "calc(100% - 15px)" }}
          >
            <tr>
              <th colSpan="4" style={{ fontSize: '24px', paddingTop: '20px', paddingBottom: '20px' }}>
                EMPLOYEE DATA
              </th>
            </tr>
            <tr>
              <td style={{ width: "20%" }}>NIP</td>
              <td style={{ width: "5%" }}>:</td>
              <td style={{ width: "30%" }}>
                {biodata.length !== 0 ? biodata.employeeNIP : ""}
              </td>
              <td rowSpan="9" style={{ textAlign: "center", width: "100%" }}>
                {loading && (
                  <Loader
                    type="ThreeDots"
                    style={{display:'flex', justifyContent:'center',marginTop:40}}
                    color={"#somecolor"}
                    height={100}
                    width={100}
                    loading={loading}
                    />
                )}
                {(photo === undefined)
                  ? loading === true ? <i />
                  : (<i class="fas fa-portrait fa-10x"/>)
                  : (<img width="100%" src={photo} alt="" />
                )}
              </td>
            </tr>
            <tr>
              <td>Nama</td>
              <td>:</td>
              <td>{biodata.length !== 0 ? biodata.employeeName : ""}</td>
            </tr>
            <tr>
              <td>Tempat Tanggal Lahir</td>
              <td>:</td>
              <td>
                {biodata.length !== 0 ? biodata.employeeBirthPlace + ', ' : ""}
                {biodata.length !== 0 ? biodata.employeeBirthDate : ""}
              </td>
            </tr>
            <tr>
              <td>Jenis Kelamin</td>
              <td>:</td>
              <td>
                {biodata.length !== 0 ? biodata.employeeGender.bizparValue : ""}
              </td>
              <td></td>
            </tr>
            <tr>
              <td>Agama</td>
              <td>:</td>
              <td>
                {biodata.length !== 0
                  ? biodata.employeeReligion.bizparValue
                  : ""}
              </td>
            </tr>
            <tr>
              <td>No. KTP</td>
              <td>:</td>
              <td>{biodata.length !== 0 ? biodata.employeeKTPNumber : ""}</td>
            </tr>
            <tr>
              <td>No. NPWP</td>
              <td>:</td>
              <td>{biodata.length !== 0 ? biodata.employeeNPWPNumber : ""}</td>
            </tr>
            <tr>
              <td>Status Perkawinan</td>
              <td>:</td>
              <td>
                {biodata.length !== 0
                  ? biodata.employeeMaritalStatus.bizparValue
                  : ""}
              </td>
            </tr>
            <tr>
              <td>Pendidikan Terkahir</td>
              <td>:</td>
              <td>
                {biodata.length !== 0 && biodata.employeeFormalEducations.length !== 0
                  ? biodata.employeeFormalEducations[0].formalEducationLevel.bizparValue
                  : ""}
              </td>
            </tr>
            {/**alamat */}
            <tr>
              <td colSpan="4">
                <strong>ALAMAT</strong>
              </td>
            </tr>
            <tr>
              <td>Domisili</td>
              <td>:</td>
              <td colSpan="2">
                {biodata.length !== 0 && addressDomisili ? addressDomisili + ", rt " : ""}
                {biodata.length !== 0 && rtDomisili ? rtDomisili + "/" : ""}
                {biodata.length !== 0 && rwDomisili ? rwDomisili + ', ' : ""}
                {biodata.length !== 0 && postalCodeDomisili ? postalCodeDomisili + ', ' : ""}
                {biodata.length !== 0 && kecamatanDomisili ? kecamatanDomisili + ', ' : ""}
                {biodata.length !== 0 && kelurahanDomisili ? kelurahanDomisili + ', ' : ""}
                {biodata.length !== 0 && kabKotaDomisili ? kabKotaDomisili + ', ' : ""}
                {biodata.length !== 0 && provinceDomisili ? provinceDomisili : ""}
              </td>
            </tr>
            <tr>
              <td>KTP</td>
              <td>:</td>
              <td colSpan="2">
                {biodata.length !== 0 && addressKtp ? addressKtp + ", rt " : ""}
                {biodata.length !== 0 && rtKtp ? rtKtp + "/" : ""}
                {biodata.length !== 0 && rwKtp ? rwKtp + ', ' : ""}
                {biodata.length !== 0 && postalCodeKtp ? postalCodeKtp + ', ' : ""}
                {biodata.length !== 0 && kecamatanKtp ? kecamatanKtp + ', ' : ""}
                {biodata.length !== 0 && kelurahanKtp ? kelurahanKtp + ', ' : ""}
                {biodata.length !== 0 && kabKotaKtp ? kabKotaKtp + ', ' : ""}
                {biodata.length !== 0 && provinceKtp ? provinceKtp : ""}
              </td>
            </tr>
            {/**no telp */}
            <tr>
              <td colSpan="4">
                <strong>NO TELEPON</strong>
              </td>
            </tr>
            <tr>
              <td>HP.1</td>
              <td>:</td>
              <td colSpan="2">
                {biodata.length !== 0
                  ? biodata.employeeHandphoneNumbers[0].employeeHandphoneNumber
                  : ""}
              </td>
            </tr>
            <tr>
              <td>HP.2</td>
              <td>:</td>
              <td colSpan="2">
                {biodata.length !== 0 && biodata.employeeHandphoneNumbers.length !== 1 
                  ? biodata.employeeHandphoneNumbers[1].employeeHandphoneNumber
                  : ""}
              </td>
            </tr>
            {/**ALAMAT EMAIL */}
            <tr>
              <td colSpan="4">
                <strong>ALAMAT EMAIL</strong>
              </td>
            </tr>
            <tr>
              <td>Perusahaan</td>
              <td>:</td>
              <td colSpan="2">
                {biodata.length !== 0
                  ? emailCompany
                  : ""}
              </td>
            </tr>
            <tr>
              <td>Personal</td>
              <td>:</td>
              <td colSpan="2">
                {biodata.length !== 0
                  ? emailPersonal
                  : ""}
              </td>
            </tr>
            <tr>
              <td>Tinggi / Berat Badan</td>
              <td>:</td>
              <td colSpan="2">
                {biodata.length !== 0 ? biodata.employeeHeight + " / " : ""}
                {biodata.length !== 0 ? biodata.employeeWeight : ""}
              </td>
            </tr>
            <tr>
              <td>Golongan Darah</td>
              <td>:</td>
              <td colSpan="2">
                {biodata.length !== 0
                  ? biodata.employeeBloodType.bizparValue
                  : ""}
              </td>
            </tr>
          </table>

        </div>
        {this.state.reportVisible && (
          <div className='app-popup app-popup-show'>
            <div className="padding-top-20px" />
            <div className="popup-content background-white border-radius">
              <div className="popup-panel grid grid-2x">
                <div className="col-1">
                  <div className="popup-title">
                    Report Viewer
                    </div>
                </div>
                <div className="col-2 content-right" style={{marginTop:10}}>
                  <i className="fa fa-download"
                    style={{cursor: "pointer"}}
                    onClick={() => this.downloadReport()}
                  />
                </div>
              </div>
              <PDFReader url={this.state.reportURL} />
              <div className="padding-15px">
                <div className="grid margin-top-15px">
                  <div className="content-right">
                    <button
                      style={{ marginLeft: "15px" }}
                      className="btn btn-primary"
                      type="button"
                      onClick={this.closeReport.bind(this)}
                    >
                      <span>CLOSE</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className='margin-bottom-20px'/>
          </div>
        )}

      </div>
    );
  }
}
const mapStateToProps = state => {
  return {
    auth: state.auth
  };
};

export default connect(mapStateToProps)(FormEmployee);
