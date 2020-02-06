import React, { Component } from "react"
import M from 'moment'
import API from '../../Services/Api'
import * as R from 'ramda'
import { Rabbit as Button } from 'react-button-loaders'

import DropDown from '../../modules/popup/DropDown'

const defaultPayloadAddress = {
  "addressID": "",
  "refObjectID": "",
  "rt": "",
  "rw": "",
  "streetName": "",
  "addressType": "",
  "kecamatan": "",
  "province": "",
  "kabkot": "",
  "kelurahan": "",
  "country": "",
  "addressStatus": "ACTIVE",
  "addressCreationalDTO": {
    "createdBy": "SYSTEM",
    "createdDate": M().format("DD-MM-YYYY HH:mm:ss"),
    "modifiedBy": null,
    "modifiedDate": null
  },
  "primary": true
}


class formAddress extends Component {

  constructor(props) {
    super(props);
    let { data } = this.props
    this.state = {
      payloadAddress: data ? data : defaultPayloadAddress,
      prevCountry: data && data.country ? data.country : defaultPayloadAddress.country,
      prevProvince: data && data.province ? data.province : defaultPayloadAddress.province,
      prevKabkot: data && data.kabkot ? data.kabkot : defaultPayloadAddress.kabkot,
      prevKec: data && data.kecamatan ? data.kecamatan : defaultPayloadAddress.kecamatan,
      provinceStatus: props.provinceStatus,
      kabKot: props.kabKot,
      kec: props.kec,
      kel: props.kel,
      subZipcode: '-- no zipcode available--'
    }
  }

  componentWillMount() {
    if (this.props.type !== 'create') {
      let indexKel = R.findIndex(R.propEq('kelurahanID', this.props.data.kelurahan))(this.state.kel)
      this.setState({
        subZipcode: indexKel >= 0 ? this.state.kel[indexKel].subZipcode : '-- no zipcode available--'
      })
    }
  }

  componentDidUpdate() {
    if (this.state.payloadAddress.country !== this.state.prevCountry) {
      this.setState({
        prevCountry: this.state.payloadAddress.country,
        subZipcode: '-- no zipcode available--',
        kabKot: [],
        kel: [],
        kec: []
      })
    }

    if (this.state.payloadAddress.province !== this.state.prevProvince) {
      this.setState({
        prevProvince: this.state.payloadAddress.province,
        subZipcode: '-- no zipcode available--',
        kel: [],
        kec: []
      })
    }

    if (this.state.payloadAddress.kabkot !== this.state.prevKabkot) {
      this.setState({
        prevKabkot: this.state.payloadAddress.kabkot,
        subZipcode: '-- no zipcode available--',
        kel: [],
      })
    }

    if (this.state.payloadAddress.kecamatan !== this.state.prevKec) {
      this.setState({
        prevKec: this.state.payloadAddress.kecamatan,
        subZipcode: '-- no zipcode available--',
      })
    }

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
          }
        }
      })
  }


  async getKabKot(value) {
    API.create('MASTERDATA').getKabKotByProvinceID(value).then(
      (res) => {
        if (res.status === 200) {
          if (res.data.status === 'S') {
            this.setState({
              kabKot: res.data.data
            })
          }
        }
      })
  }

  async getKecamatan(value) {
    API.create('MASTERDATA').getKecamatanByKabKotID(value).then(
      (res) => {
        if (res.status === 200) {
          if (res.data.status === 'S') {
            this.setState({
              kec: res.data.data
            })
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
          }
        }
      })
  }

  handleProvince(value) {
    this.getKabKot(value);
    this.setState({
      payloadAddress: {
        ...this.state.payloadAddress,
        province: value,
        kabkot: "",
        kecamatan: "",
        kelurahan: ""
      }
      ,
    })
  }

  handleKabKot(value) {
    this.getKecamatan(value);
    this.setState({
      payloadAddress: {
        ...this.state.payloadAddress,
        kabkot: value,
        kecamatan: "",
        kelurahan: "",
      },

    })
  }

  handleKecamatan(value) {
    this.getKelurahan(value)
    this.setState({
      payloadAddress: {
        ...this.state.payloadAddress,
        kecamatan: value,
        kelurahan: ""
      },

    })
  }

  handleKelurahan(value) {
    let indexKel = R.findIndex(R.propEq('kelurahanID', value))(this.state.kel)
    this.setState({
      payloadAddress: {
        ...this.state.payloadAddress,
        kelurahan: value
      },
      subZipcode: R.isEmpty(this.state.kel[indexKel].subZipcode) ? '-- no zipcode available --' : this.state.kel[indexKel].subZipcode
    })
  }

  render() {
    return (
      <div className="app-popup app-popup-show">
        <div className="padding-top-20px" />
        <div className="popup-content background-white border-radius">
          <div className="popup-panel grid grid-2x">
            <div className="col-1">
              <div className="popup-title">
                {this.props.type === "create"
                  ? "Applicant Detail - Family - Address - Create Form"
                  : this.props.type === "update"
                    ? "Applicant Detail - Family - Address - Edit Form"
                    : "Applicant Detail - Family - Address - View Form"}
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
          <form action="#" >
            <div className="border-bottom padding-15px grid grid-2x grid-mobile-none gap-20px">
              <div className="column-1">
                {this.props.type !== "create" ? (
                  <div className="margin-bottom-20px">
                    <div className="margin-5px">
                      <div className="txt-site txt-11 txt-main txt-bold">
                        <h4>Address Number</h4>
                      </div>
                    </div>
                    <input
                      value={this.state.payloadAddress.addressID}
                      readOnly
                      style={{ backgroundColor: "#E6E6E6" }}
                      type="text"
                      className="txt txt-sekunder-color"
                      placeholder=""
                      required
                    />
                  </div>
                ) : null}

                <div className="margin-bottom-20px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>Address Type <span style={{ color: "red" }}>*</span></h4>
                    </div>
                  </div>
                  <DropDown
                    title="-- please select address type --"
                    onChange={(dt) => this.setState({
                      payloadAddress: {
                        ...this.state.payloadAddress,
                        addressType: dt
                      }
                    })}
                    type="bizpar"
                    disabled={this.props.type !== "create" ? true : false}
                    data={this.props.bizparAddressType}
                    value={this.state.payloadAddress.addressType && this.state.payloadAddress.addressType.bizparKey ? this.state.payloadAddress.addressType.bizparKey : this.state.payloadAddress.addressType} />
                </div>

                <div className="margin-bottom-20px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>Address <span style={{ color: "red" }}>*</span></h4>
                    </div>
                  </div>
                  <textarea
                    rows={5}
                    value={this.state.payloadAddress.streetName && this.state.payloadAddress.streetName ? this.state.payloadAddress.streetName : this.state.payloadAddress.streetName}
                    onChange={(e) => this.setState({
                      payloadAddress: {
                        ...this.state.payloadAddress,
                        streetName: e.target.value
                      }
                    })}
                    readOnly={this.props.type === "view" ? true : false}
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
                  <div className="grid grid-2x grid-mobile-none gap-20px">
                    <div className="column-1">
                      <div className="margin-5px">
                        <div className="txt-site txt-11 txt-main txt-bold">
                          <h4>RT</h4>
                        </div>
                      </div>
                      <input
                        value={this.state.payloadAddress.rt && this.state.payloadAddress.rt ? this.state.payloadAddress.rt : this.state.payloadAddress.rt}
                        onChange={(e) => {
                          if (isNaN(e.target.value)) return true
                          this.setState({
                            payloadAddress: {
                              ...this.state.payloadAddress,
                              rt: e.target.value
                            }
                          })
                        }}
                        readOnly={this.props.type === "view" ? true : false}
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
                    <div className="column-2">
                      <div className="margin-5px">
                        <div className="txt-site txt-11 txt-main txt-bold">
                          <h4>RW</h4>
                        </div>
                      </div>
                      <input
                        value={this.state.payloadAddress.rw && this.state.payloadAddress.rw ? this.state.payloadAddress.rw : this.state.payloadAddress.rw}
                        onChange={(e) => {
                          if (isNaN(e.target.value)) return true
                          this.setState({
                            payloadAddress: {
                              ...this.state.payloadAddress,
                              rw: e.target.value
                            }
                          })
                        }}
                        readOnly={this.props.type === "view" ? true : false}
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
                </div>

                <div className="margin-bottom-20px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>Country</h4>
                    </div>
                  </div>
                  <DropDown
                    title="-- please select country name --"
                    onChange={(dt) => {
                      let id = dt
                      this.setState({
                        payloadAddress: {
                          ...this.state.payloadAddress,
                          country: dt
                        }
                      })
                      this.getProvinceByCountryID(id)
                    }}
                    disabled={this.props.type === "view" ? true : false}
                    data={this.props.countryStatus}
                    value={this.state.payloadAddress.country}
                    type="country" />
                </div>
              </div>

              <div className="column-2">
                <div className="margin-bottom-20px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>Province</h4>
                    </div>
                  </div>
                  <DropDown
                    title="-- please select province name --"
                    address={this.state.provinceStatus}
                    dropDownType={'province name'}
                    onChange={dt => this.handleProvince(dt)}
                    disabled={this.props.type === "view" ? true : false}
                    data={this.state.provinceStatus}
                    value={this.state.payloadAddress.province}
                    type="province" />
                </div>

                <div className="margin-bottom-20px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>District</h4>
                    </div>
                  </div>
                  <DropDown
                    title="-- please select district name --"
                    address={this.state.kabKot}
                    dropDownType={'district name'}
                    onChange={dt => this.handleKabKot(dt)}
                    disabled={this.props.type === "view" ? true : false}
                    data={this.state.kabKot}
                    value={this.state.payloadAddress.kabkot}
                    type="district" />
                </div>

                <div className="margin-bottom-20px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>Sub - District</h4>
                    </div>
                  </div>
                  <DropDown
                    title="-- please select sub district name --"
                    address={this.state.kec}
                    dropDownType={'sub district name'}
                    onChange={dt => this.handleKecamatan(dt)}
                    disabled={this.props.type === "view" ? true : false}
                    data={this.state.kec}
                    value={this.state.payloadAddress.kecamatan}
                    type="subdistrict" />
                </div>

                <div className="margin-bottom-20px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>Kelurahan</h4>
                    </div>
                  </div>
                  <DropDown
                    title="-- please select kelurahan --"
                    address={this.state.kel}
                    dropDownType={'kelurahan'}
                    onChange={dt => this.handleKelurahan(dt)}
                    disabled={this.props.type === "view" ? true : false}
                    data={this.state.kel}
                    value={this.state.payloadAddress.kelurahan}
                    type="kelurahan" />
                </div>

                <div className="margin-bottom-20px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>Postal Code</h4>
                    </div>
                  </div>
                  <DropDown
                    title={'-- please select zipcode --'}
                    subZipCode={[this.state.subZipcode]}
                    data={[this.state.subZipcode]}
                    value={this.state.subZipcode}
                    type='subzipcode'
                    disabled
                  />
                </div>
              </div>
            </div>

            <div className="padding-15px">
              <div className="grid grid-2x">
                <div className="col-1" />
                <div className="col-2 content-right">
                  {this.props.type !== "view" ? (
                    <Button
                      state={this.props.sendState}
                      style={{ position: 'absolute', padding: '0 14px', height: 40, borderRadius: 3, fontSize: 10, textAlign: 'center', width: 90, marginLeft: '329px' }}
                      className="btn btn-blue"
                      type="button"
                      onClick={() => {
                        if (R.isEmpty(this.state.payloadAddress.addressType) || R.isEmpty(this.state.payloadAddress.addressType.bizparKey)) {
                          return alert('Address Type is Required.')
                        }
                        if (R.isEmpty(this.state.payloadAddress.streetName)) return alert('Address is Required.')
                        this.props.onClickSave(this.state.payloadAddress)
                      }}
                    >
                      <span>SAVE</span>
                    </Button>
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
export default formAddress;
