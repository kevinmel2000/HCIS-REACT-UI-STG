import React, { Component } from "react";

import M from "moment";
import API from "../../../Services/Api";
import * as R from 'ramda'

import DropDown from '../../../modules/popup/DropDown';

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
  "isPrimary": true
};

class FormCompany extends Component {
  constructor(props) {
    super(props);
    let { companyDataAddress } = this.props;
    this.state = {
      payloadAddress: companyDataAddress ? this.parseAddress(companyDataAddress) : defaultPayloadAddress,
      prevCountry: companyDataAddress ? companyDataAddress.country.countryID : defaultPayloadAddress.country,
      prevProvince: companyDataAddress ? companyDataAddress.province.provinceID : defaultPayloadAddress.province,
      prevKabkot: companyDataAddress ? companyDataAddress.kabkot.kabkotID : defaultPayloadAddress.kabkot,
      prevKec: companyDataAddress ? companyDataAddress.kecamatan.kecamatanID : defaultPayloadAddress.kecamatan,
      provinceStatus: props.provinceStatus,
      kabKot: props.kabKot,
      kec: props.kec,
      kel: props.kel,
      subZipcode: '-- no zipcode available--'
    }
  }

  async getKabKot(value) {
    API.create("MASTERDATA")
      .getKabKotByProvinceID(value)
      .then(res => {
        if (res.status === 200) {
          console.log(res.data);
          if (res.data.status === "S") {
            this.setState({
              kabKot: res.data.data
            });
          }
        }
      });
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

  async getKecamatan(value) {
    API.create("MASTERDATA")
      .getKecamatanByKabKotID(value)
      .then(res => {
        if (res.status === 200) {
          console.log(res.data);
          if (res.data.status === "S") {
            this.setState({
              kec: res.data.data
            });
          }
        }
      });
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

  async getKelurahan(value) {
    API.create("MASTERDATA")
      .getKelurahanByKecID(value)
      .then(res => {
        if (res.status === 200) {
          console.log(res.data);
          if (res.data.status === "S") {
            this.setState({
              kel: res.data.data
            });
          }
        }
      });
  }

  handleProvince(value) {
    this.getKabKot(value);
    this.setState({
      payloadAddress: {
        ...this.state.payloadAddress,
        province: value
      }
    })
  }

  handleKabKot(value) {
    this.getKecamatan(value);
    this.setState({
      payloadAddress: {
        ...this.state.payloadAddress,
        kabkot: value
      }
    });
  }

  handleKecamatan(value) {
    this.getKelurahan(value);
    this.setState({
      payloadAddress: {
        ...this.state.payloadAddress,
        kecamatan: value
      }
    });
  }

  handleKelurahan(value) {
    this.setState({
      payloadAddress: {
        ...this.state.payloadAddress,
        kelurahan: value
      }
    });
  }

  parseAddress(value) {
    let address = value;
    address = {
      ...address,
      country: address.country.countryID,
      addressType: address.addressType.bizparKey,
      province: address.province.provinceID,
      kabkot: address.kabkot.kabkotID,
      kecamatan: address.kecamatan.kecamatanID,
      kelurahan: address.kelurahan.kelurahanID
    };
    return address;
  }

  componentWillMount() {
    let { companyDataAddress } = this.props
    if (companyDataAddress) this.setState({ subZipcode: companyDataAddress && companyDataAddress.kelurahan.subZipcode ? companyDataAddress.kelurahan.subZipcode : '--no zipcode available --' })
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

  renderForm = () => (
    <div className="border-bottom padding-15px grid grid-2x grid-mobile-none gap-20px">
      <div className="column-1">
        {this.props.type !== "create" ?
          <div className="margin-bottom-20px">
            <div className="margin-5px">
              <div className="txt-site txt-11 txt-main txt-bold">
                <h4>Address ID</h4>
              </div>
            </div>
            <input
              readOnly
              value={
                this.state.payloadAddress.addressID &&
                  this.state.payloadAddress.addressID
                  ? this.state.payloadAddress.addressID
                  : this.state.payloadAddress.addressID
              }
              style={{ backgroundColor: "#E6E6E6" }}
              type="text"
              className="txt txt-sekunder-color"
              placeholder=""
              required
            />
          </div>
          : null}

        <div className="margin-bottom-20px">
          <div className="margin-5px">
            <div className="txt-site txt-11 txt-main txt-bold">
              <h4>Address type <span style={{ color: "red" }}>*</span></h4>
            </div>
          </div>
          <DropDown
            title="-- please select address type --"
            onChange={dt =>
              this.setState({
                payloadAddress: {
                  ...this.state.payloadAddress,
                  addressType: dt
                }
              })
            }
            disabled={this.props.type === "view" ? true : false}
            data={this.props.bizparAddressType}
            value={
              this.state.payloadAddress.addressType &&
                this.state.payloadAddress.addressType.bizparKey
                ? this.state.payloadAddress.addressType.bizparKey
                : this.state.payloadAddress.addressType
            }
            type="bizpar" />
        </div>

        <div className="margin-bottom-20px">
          <div className="margin-5px">
            <div className="txt-site txt-11 txt-main txt-bold">
              <h4>Country Name</h4>
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

        <div className="margin-bottom-20px">
          <div className="margin-5px">
            <div className="txt-site txt-11 txt-main txt-bold">
              <h4>Province Name</h4>
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
              <h4>District Name</h4>
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
              <h4>Sub District Name</h4>
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
      </div>

      <div className="column-2">
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
              <h4>RT</h4>
            </div>
          </div>
          <input
            readOnly={this.props.type === "view" ? true : false}
            style={
              this.props.type === "view" ? { backgroundColor: "#E6E6E6" } : null
            }
            value={
              this.state.payloadAddress.rt && this.state.payloadAddress.rt
                ? this.state.payloadAddress.rt
                : this.state.payloadAddress.rt
            }
            onChange={e => {
              if (isNaN(e.target.value)) return true
              this.setState({
                payloadAddress: {
                  ...this.state.payloadAddress,
                  rt: e.target.value
                }
              })
            }
            }
            type="text"
            className="txt txt-sekunder-color"
            placeholder=""
          />
        </div>

        <div className="margin-bottom-20px">
          <div className="margin-5px">
            <div className="txt-site txt-11 txt-main txt-bold">
              <h4>RW</h4>
            </div>
          </div>
          <input
            value={
              this.state.payloadAddress.rw && this.state.payloadAddress.rw
                ? this.state.payloadAddress.rw
                : this.state.payloadAddress.rw
            }
            onChange={e => {
              if (isNaN(e.target.value)) return true
              this.setState({
                payloadAddress: {
                  ...this.state.payloadAddress,
                  rw: e.target.value
                }
              })
            }
            }
            readOnly={this.props.type === "view" ? true : false}
            style={
              this.props.type === "view" ? { backgroundColor: "#E6E6E6" } : null
            }
            type="text"
            className="txt txt-sekunder-color"
            placeholder=""
          />
        </div>

        <div className="margin-bottom-20px">
          <div className="margin-5px">
            <div className="txt-site txt-11 txt-main txt-bold">
              <h4>Street Name <span style={{ color: "red" }}>*</span></h4>
            </div>
          </div>
          <input
            value={
              this.state.payloadAddress.streetName &&
                this.state.payloadAddress.streetName
                ? this.state.payloadAddress.streetName
                : this.state.payloadAddress.streetName
            }
            onChange={e =>
              this.setState({
                payloadAddress: {
                  ...this.state.payloadAddress,
                  streetName: e.target.value
                }
              })
            }
            readOnly={this.props.type === "view" ? true : false}
            style={
              this.props.type === "view" ? { backgroundColor: "#E6E6E6" } : null
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
              <h4>Status</h4>
            </div>
          </div>
          <label className="switch green">
            <input
              type="checkbox"
              value={this.state.payloadAddress.addressStatus && this.state.payloadAddress.addressStatus ? this.state.payloadAddress.addressStatus : this.state.payloadAddress.addressStatus}
              onChange={(e) => this.setState({
                parseAddress: {
                  ...this.state.payloadAddress,
                  addressStatus: e.target.checked
                }
              })}
              checked={this.state.payloadAddress.addressStatus}
              disabled
            />
            <span className="slider round status-on-off" />
          </label>
        </div>
      </div>
    </div>
  );

  renderFooter = () => (
    <div className="padding-15px">
      <div className="grid grid-2x">
        <div className="col-1" />
        <div className="col-2 content-right">
          {this.props.type !== "view" ? (
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
  );
  render() {
    // console.log(this.state.provinceStatus)
    // console.log(this.state.kabKot)
    return (
      <div className="app-popup app-popup-show">
        <div className="padding-top-20px" />
        <div className="popup-content background-white border-radius">
          <div className="popup-panel grid grid-2x">
            <div className="col-1">
              <div className="popup-title">
                {this.props.type === "create"
                  ? "Corporate - Address - Create Form"
                  : this.props.type === "update"
                    ? "Corporate - Address - Edit Form"
                    : "Corporate - Address - View Form"}
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
          <form action="#" onSubmit={(e) => {
            e.preventDefault()
            if (R.isEmpty(this.state.payloadAddress.addressType) || R.isEmpty(this.state.payloadAddress.addressType.bizparKey)) {
              return alert('Address Type is Required.')
            }
            else

              this.props.onClickSave({ ...this.state.payloadAddress, subZipcode: this.state.payloadAddress.subZipcode === '-- no zipcode available--' ? '' : this.state.payloadAddress.subZipcode })
          }}>
            {this.renderForm()}
            {this.renderFooter()}
          </form>
        </div>
        <div className="padding-bottom-20px" />
      </div>
    );
  }
}

export default FormCompany;