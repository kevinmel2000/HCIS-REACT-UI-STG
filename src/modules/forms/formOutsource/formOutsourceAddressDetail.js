import React, { Component } from "react";

import M from 'moment'
import * as R from 'ramda'

import DropDown from '../../../modules/popup/DropDown'

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
}


class FormOutsourceAddressDetail extends Component {

    constructor(props) {
        super(props);
        let { dataAddress } = this.props
        this.state = {
            payloadAddress: dataAddress ? this.parseAddress(dataAddress) : defaultPayloadAddress,
            prevCountry: dataAddress ? dataAddress.country.countryID : defaultPayloadAddress.country,
            prevProvince: dataAddress ? dataAddress.province.provinceID : defaultPayloadAddress.province,
            prevKabkot: dataAddress ? dataAddress.kabkot.kabkotID : defaultPayloadAddress.kabkot,
            prevKec: dataAddress ? dataAddress.kecamatan.kecamatanID : defaultPayloadAddress.kecamatan,
            provinceStatus: props.provinceStatus,
            kabKot: props.kabKot,
            kec: props.kec,
            kel: props.kel,
            subZipcode: '-- no zipcode available--'
        }
        console.log("data Address ==> ", dataAddress)
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
        })
    }

    handleKecamatan(value) {
        this.getKelurahan(value)
        this.setState({
            payloadAddress: {
                ...this.state.payloadAddress,
                kecamatan: value
            }
        })
    }

    handleKelurahan(value) {
        let indexKel = R.findIndex(R.propEq('kelurahanID', value))(this.state.kel)
        this.setState({
            payloadAddress: {
                ...this.state.payloadAddress,
                kelurahan: value
            },
            subZipcode: this.state.kel[indexKel] && this.state.kel[indexKel].subZipcode ? this.state.kel[indexKel].subZipcode : '-- no zipcode available --'
        })
    }

    parseAddress(value) {
        let address = value
        address = {
            ...address,
            country: address.country.countryID,
            addressType: address.addressType.bizparKey,
            province: address.province.provinceID,
            kabkot: address.kabkot.kabkotID,
            kecamatan: address.kecamatan.kecamatanID,
            kelurahan: address.kelurahan.kelurahanID
        }
        return address
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
                                    ? "Profile - Address - Create Form"
                                    : this.props.type === "update"
                                        ? "Profile - Address - Edit Form"
                                        : "Profile - Address - View Form"}
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
                                            readOnly
                                            style={{ backgroundColor: "#E6E6E6" }}
                                            type="text"
                                            className="txt txt-sekunder-color"
                                            placeholder=""
                                            required
                                            value={this.state.payloadAddress.addressID && this.state.payloadAddress.addressID ? this.state.payloadAddress.addressID : this.state.payloadAddress.addressID}
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
                                        <button
                                            style={{ marginLeft: "15px" }}
                                            className="btn btn-blue"
                                            type="button"
                                            onClick={this.props.onClickSave.bind(this)}
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
export default FormOutsourceAddressDetail