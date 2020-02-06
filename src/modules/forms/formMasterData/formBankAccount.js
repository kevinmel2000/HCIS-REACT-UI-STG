import React, { Component } from "react";
import M from "moment";
import CalendarPicker from "../../../modules/popup/Calendar";
import Select from 'react-select';
import DropDown from "../../../modules/popup/DropDown";
import Api from "../../../Services/Api";

const dateNow = M().format("DD-MM-YYYY HH:mm:ss");

const payload = {
    "bankAddress": '',
    "bankCode": '',
    "bankCreational": {
        "createdBy": "SYSTEM",
        "createdDate": dateNow,
        "modifiedBy": "SYSTEM",
        "modifiedDate": dateNow
    },
    "bankID": 'BANK-' + M(),
    "bankName": '',
    "bankStatus": "ACTIVE",
    "bicode": '',
    "countryID": '',
    "countryName": '',
    "description": '',
    "districtID": '',
    "districtName": '',
    "provinceID": '',
    "provinceName": ''
}

class FormBankAccount extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: this.props.rawData ? {
                ...this.props.rawData,
                countryID: this.props.rawData.country.countryID,
                countryName: this.props.rawData.country.countryName,
                provinceID: this.props.rawData.province.provinceID,
                provinceName: this.props.rawData.province.provinceName,
                districtID: this.props.rawData.district.kabkotID,
                districtName: this.props.rawData.district.kabkotName
            } : []
            ,
            dataSend: {
                ...payload
            },
            countryData: [],
            countryValue: [],
            provinceData: [],
            kabkotData: [],
        }
    }

    componentDidMount() {
        if (this.props.type !== 'create') {
            this.setState({
                countryValue: {
                    value: this.props.rawData.country.countryID,
                    label: this.props.rawData.country.countryName
                },
                provinceValue: {
                    value: this.props.rawData.province.provinceID,
                    label: this.props.rawData.province.provinceName
                },
                kabkotValue: {
                    value: this.props.rawData.district.kabkotID,
                    label: this.props.rawData.district.kabkotName
                }
            })
            this.getProvinceByCountryID(this.props.rawData.country.countryID)
            this.getDistrictById(this.props.rawData.province.provinceID)
        }
        this.getCountry()
    }

    componentDidUpdate(prevProps) {
        if (this.props.data !== prevProps.data) {
            this.setState({ data: this.props.rawData })
            this.getCountry()
        }
    }

    getCountry() {
        let body = {
            params: {
                "countryStatus": "ACTIVE"
            },
            offset: 0,
            limit: 200
        }
        Api.create('MASTERDATA').getCountryMasterByCountryStatus(body).then(
            (res) => {
                if (res.status === 200) {
                    console.log(res.data);
                    if (res.data.status === 'S') {
                        let array = []
                        res.data.data.map((item) => {
                            array.push({
                                value: item.countryID,
                                label: item.countryName
                            })
                        })
                        setTimeout(() => {
                            this.setState({
                                countryData: array
                            }, () => console.log(this.state.countryData))
                        }, 200);
                    }
                }
            }
        )
    }

    getCountryByID(id, type) {
        Api.create('MASTERDATA').getCountryByIDCountry(id).then(
            (res) => {
                console.log(res)
                if (res.status === 200) {
                    if (type === "create") {
                        this.setState({
                            dataSend: {
                                ...this.state.dataSend,
                                countryName: res.data.data.countryName
                            }
                        })
                    } else {
                        this.setState({
                            data: {
                                ...this.state.data,
                                countryName: res.data.data.countryName
                            }
                        })
                    }
                } else {
                    this.setState({
                        data: {
                            ...this.state.data,
                            countryName: ''
                        }
                    })
                }
            })
    }

    getProvinceByCountryID(id) {
        Api.create('MASTERDATA').getProvinceByCountryID(id).then(
            (res) => {
                if (res.status === 200) {
                    console.log(res.data);
                    if (res.data.status === 'S') {
                        let array = []
                        res.data.data.map((item) => {
                            array.push({
                                value: item.provinceID,
                                label: item.provinceName
                            })
                        })
                        setTimeout(() => {
                            this.setState({
                                provinceData: array
                            })
                        }, 200);
                    }
                }
            })
    }

    getProvinceByID(id, type) {
        Api.create('MASTERDATA').getProvinceByIDProvince(id).then(
            (res) => {
                console.log(res)
                if (res.status === 200) {
                    if (type === "create") {
                        this.setState({
                            dataSend: {
                                ...this.state.dataSend,
                                provinceName: res.data.data.provinceName
                            }
                        })
                    } else {
                        this.setState({
                            data: {
                                ...this.state.data,
                                provinceName: res.data.data.provinceName
                            }
                        })
                    }
                }
            })
    }

    getDistrictById(id) {
        Api.create('MASTERDATA').getKabKotByProvinceID(id).then(
            (res) => {
                if (res.status === 200) {
                    console.log(res.data);
                    if (res.data.status === 'S') {
                        let array = []
                        res.data.data.map((item) => {
                            array.push({
                                value: item.kabkotID,
                                label: item.kabkotName
                            })
                        })
                        setTimeout(() => {
                            this.setState({
                                kabkotData: array
                            })
                        }, 200);
                    }
                }
            })
    }

    getDistrictByIdDistrict(id, type) {
        Api.create('MASTERDATA').getKabKotByIDKabKot(id).then(
            (res) => {
                console.log(res)
                if (res.status === 200) {
                    if (type === "create") {
                        this.setState({
                            dataSend: {
                                ...this.state.dataSend,
                                districtName: res.data.data.kabkotName
                            }
                        })
                    } else {
                        this.setState({
                            data: {
                                ...this.state.data,
                                districtName: res.data.data.kabkotName
                            }
                        })
                    }
                }
            })
    }

    validation() {
        this.props.onClickSave(this.state.data);
    }

    createData() {
        this.props.onClickSave(this.state.dataSend)
    }

    render() {
        return this.props.type === "create" ? (
            this.renderCreate()
        ) : (
                <div className="a-s-p-place active">
                    <div className="a-s-p-top">
                        <div className="grid grid-2x">
                            <div className="col-1" style={{ width: "140%" }}>
                                <div className="display-flex-normal margin-top-10px">
                                    <i className="fa fa-1x fa-building"></i>
                                    <span className="txt-site txt-11 txt-main margin-left-10px">
                                        {this.props.type === "edit" ? "Bank Account - Edit Form" : "Bank Account - View Form"}
                                    </span>
                                </div>
                            </div>
                            <div className="col-2 content-right">
                                <button
                                    onClick={this.props.closeSlide}
                                    className="btn btn-circle btn-grey"
                                >
                                    <i className="fa fa-lg fa-arrow-right" />
                                </button>
                            </div>
                        </div>
                    </div>
                    <form
                        action="#"
                        onSubmit={e => {
                            e.preventDefault();
                            this.validation()
                        }}
                    >
                        <div className="a-s-p-mid a-s-p-pad border-top">
                            <div className="display-flex-normals margin-bottom-10px">
                                <div className="padding-top-15px padding-bottom-15px">
                                    <div className="margin-bottom-15px">
                                        <div className="margin-5px">
                                            <div className="txt-site txt-11 txt-main txt-bold">
                                                <h4>
                                                    Bank ID<span style={{ color: "red" }}>*</span>
                                                </h4>
                                            </div>
                                        </div>
                                        <input
                                            type="text"
                                            className="txt txt-sekunder-color"
                                            readOnly
                                            value={this.state.data.bankID}
                                            style={{ backgroundColor: "#E6E6E6" }}
                                            placeholder={"Bank ID"}
                                        />
                                    </div>
                                    <div className="margin-bottom-15px">
                                        <div className="margin-5px">
                                            <div className="txt-site txt-11 txt-main txt-bold">
                                                <h4>
                                                    Bank Code <span style={{ color: "red" }}>*</span>
                                                </h4>
                                            </div>
                                        </div>
                                        <input
                                            onChange={(e) => {
                                                this.setState({
                                                    data: {
                                                        ...this.state.data,
                                                        bankCode: e.target.value
                                                    }
                                                })
                                            }}
                                            type="text"
                                            className="txt txt-sekunder-color"
                                            readOnly={this.props.type !== "edit" ? true : false}
                                            value={this.state.data.bankCode}
                                            style={this.props.type !== "edit" ? { backgroundColor: "#E6E6E6" } : null}
                                            placeholder={"Bank Code"}
                                        />
                                    </div>
                                    <div className="margin-bottom-15px">
                                        <div className="margin-5px">
                                            <div className="txt-site txt-11 txt-main txt-bold">
                                                <h4>
                                                    BI Code <span style={{ color: "red" }}>*</span>
                                                </h4>
                                            </div>
                                        </div>
                                        <input
                                            onChange={(e) => {
                                                this.setState({
                                                    data: {
                                                        ...this.state.data,
                                                        bicode: e.target.value
                                                    }
                                                })
                                            }}
                                            type="text"
                                            className="txt txt-sekunder-color"
                                            readOnly={this.props.type !== "edit" ? true : false}
                                            value={this.state.data.bicode}
                                            style={this.props.type !== "edit" ? { backgroundColor: "#E6E6E6" } : null}
                                            placeholder={"BI Code"}
                                        />
                                    </div>
                                    <div className="margin-bottom-15px">
                                        <div className="margin-5px">
                                            <div className="txt-site txt-11 txt-main txt-bold">
                                                <h4>
                                                    Bank Name <span style={{ color: "red" }}>*</span>
                                                </h4>
                                            </div>
                                        </div>
                                        <input
                                            onChange={(e) => {
                                                this.setState({
                                                    data: {
                                                        ...this.state.data,
                                                        bankName: e.target.value
                                                    }
                                                })
                                            }}
                                            type="text"
                                            className="txt txt-sekunder-color"
                                            readOnly={this.props.type !== "edit" ? true : false}
                                            value={this.state.data.bankName}
                                            style={this.props.type !== "edit" ? { backgroundColor: "#E6E6E6" } : null}
                                            placeholder={"Bank Name"}
                                        />
                                    </div>
                                    <div className="margin-bottom-15px">
                                        <div className="margin-5px">
                                            <div className="txt-site txt-11 txt-main txt-bold">
                                                <h4>
                                                    Country<span style={{ color: "red" }}>*</span>
                                                </h4>
                                            </div>
                                        </div>
                                        <Select
                                            value={this.state.countryValue}
                                            onChange={(dt) => {
                                                this.setState({
                                                    data: {
                                                        ...this.state.data,
                                                        countryID: dt.value,
                                                        countryName: dt.label,
                                                    },
                                                    provinceValue: [],
                                                    kabkotValue: [],
                                                    countryValue: dt
                                                })
                                                this.getProvinceByCountryID(dt.value)
                                            }}
                                            options={this.state.countryData}
                                        />
                                        {/* <DropDown
                                            title="-- please select country --"
                                            // bizValue={this.state.data.country.countryName}
                                            data={this.state.countryData}
                                            onChange={(dt) => {
                                                let id = dt
                                                this.setState({
                                                    data: {
                                                        ...this.state.data,
                                                        countryID: dt,
                                                    }
                                                })
                                                this.getProvinceByCountryID(id)
                                                this.getCountryByID(id)
                                            }}
                                            value={this.state.data.country ? this.state.data.country.countryID : ''}
                                            bizValue={this.state.data.country ? this.state.data.country.countryName : ''}
                                            type='bizpar'
                                        /> */}
                                    </div>
                                    <div className="margin-bottom-15px">
                                        <div className="margin-5px">
                                            <div className="txt-site txt-11 txt-main txt-bold">
                                                <h4>
                                                    Province<span style={{ color: "red" }}>*</span>
                                                </h4>
                                            </div>
                                        </div>
                                        <Select
                                            value={this.state.provinceValue}
                                            onChange={(dt) => {
                                                this.setState({
                                                    data: {
                                                        ...this.state.data,
                                                        provinceID: dt.value,
                                                        provinceName: dt.label
                                                    },
                                                    provinceValue: dt,
                                                    kabkotValue: []
                                                })
                                                this.getDistrictById(dt.value)
                                            }}
                                            options={this.state.provinceData}
                                        />
                                        {/* <DropDown title="-- please select province --"
                                            // bizValue={dataEdit.vendorType}
                                            data={this.state.provinceData}
                                            onChange={(dt) => {
                                                let id = dt
                                                this.setState({
                                                    data: {
                                                        ...this.state.data,
                                                        provinceID: dt
                                                    }
                                                })
                                                this.getDistrictById(id)
                                                this.getProvinceByID(id)
                                            }}
                                            value={this.state.data.province}
                                            type='bizpar'
                                        /> */}
                                    </div>
                                    <div className="margin-bottom-15px">
                                        <div className="margin-5px">
                                            <div className="txt-site txt-11 txt-main txt-bold">
                                                <h4>
                                                    District<span style={{ color: "red" }}>*</span>
                                                </h4>
                                            </div>
                                        </div>
                                        <Select
                                            value={this.state.kabkotValue}
                                            defaultValue={this.state.kabkotValue}
                                            onChange={(dt) => {
                                                this.setState({
                                                    data: {
                                                        ...this.state.data,
                                                        districtID: dt.value,
                                                        districtName: dt.label
                                                    },
                                                    kabkotValue: dt
                                                })
                                            }}
                                            options={this.state.kabkotData}
                                        />
                                    </div>
                                    <div className="margin-bottom-15px">
                                        <div className="margin-5px">
                                            <div className="txt-site txt-11 txt-main txt-bold">
                                                <h4>
                                                    Bank Address<span style={{ color: "red" }}>*</span>
                                                </h4>
                                            </div>
                                        </div>
                                        <textarea
                                            type="text"
                                            className="txt txt-sekunder-color"
                                            rows={4}
                                            placeholder={"Bank Address"}
                                            onChange={(e) => {
                                                this.setState({
                                                    data: {
                                                        ...this.state.data,
                                                        bankAddress: e.target.value
                                                    }
                                                })
                                            }}
                                            value={this.state.data.bankAddress}
                                            readOnly={this.props.type !== "edit" ? true : false}
                                            style={this.props.type !== "edit" ? { backgroundColor: "#E6E6E6" } : null}
                                        />
                                    </div>
                                    <div className="margin-bottom-15px">
                                        <div className="margin-5px">
                                            <div className="txt-site txt-11 txt-main txt-bold">
                                                <h4>
                                                    Description<span style={{ color: "red" }}>*</span>
                                                </h4>
                                            </div>
                                        </div>
                                        <textarea
                                            type="text"
                                            className="txt txt-sekunder-color"
                                            rows={4}
                                            placeholder={"Description"}
                                            onChange={(e) => {
                                                this.setState({
                                                    data: {
                                                        ...this.state.data,
                                                        description: e.target.value
                                                    }
                                                })
                                            }}
                                            value={this.state.data.description}
                                            readOnly={this.props.type !== "edit" ? true : false}
                                            style={this.props.type !== "edit" ? { backgroundColor: "#E6E6E6" } : null}
                                        />
                                    </div>
                                    <div className="padding-15px">
                                        <div className="grid grid-2x">
                                            <div className="col-1"></div>
                                            <div className="col-2 content-right">
                                                <button className="btn btn-blue" type="submit">
                                                    <span>SAVE</span>
                                                </button>
                                                <button
                                                    style={{ marginLeft: "15px" }}
                                                    className="btn btn-primary"
                                                    type="button"
                                                    onClick={this.props.closeSlide.bind(this)}
                                                >
                                                    <span>CLOSE</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            );
    }

    renderCreate() {
        return (
            <div>
                <div className="app-popup app-popup-show">
                    <div className="padding-top-20px" />
                    <div className="popup-content background-white border-radius">
                        <div className="popup-panel grid grid-2x">
                            <div className="col-1">
                                <div className="popup-title">
                                    {"Master Vendor - Create Form"}
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
                        <form
                            action="#"
                            onSubmit={e => {
                                e.preventDefault();
                            }}
                        >
                            <div className="border-bottom padding-15px grid grid-2x grid-mobile-none gap-15px">
                                <div className="column-1">
                                    <div className="margin-bottom-15px">
                                        <div className="margin-5px">
                                            <div className="txt-site txt-11 txt-main txt-bold">
                                                <h4>
                                                    Bank ID<span style={{ color: "red" }}>*</span>
                                                </h4>
                                            </div>
                                        </div>
                                        <input
                                            type="text"
                                            className="txt txt-sekunder-color"
                                            readOnly
                                            value={this.state.dataSend.bankID}
                                            style={{ backgroundColor: "#E6E6E6" }}
                                            placeholder={"Bank ID"}
                                        />
                                    </div>
                                    <div className="margin-bottom-15px">
                                        <div className="margin-5px">
                                            <div className="txt-site txt-11 txt-main txt-bold">
                                                <h4>
                                                    Bank Code <span style={{ color: "red" }}>*</span>
                                                </h4>
                                            </div>
                                        </div>
                                        <input
                                            type="text"
                                            className="txt txt-sekunder-color"
                                            onChange={(e) => {
                                                this.setState({
                                                    dataSend: {
                                                        ...this.state.dataSend,
                                                        bankCode: e.target.value
                                                    }
                                                })
                                            }}
                                            value={this.state.dataSend.bankCode}
                                            placeholder={"Bank Code"}
                                        />
                                    </div>
                                    <div className="margin-bottom-15px">
                                        <div className="margin-5px">
                                            <div className="txt-site txt-11 txt-main txt-bold">
                                                <h4>
                                                    BI Code <span style={{ color: "red" }}>*</span>
                                                </h4>
                                            </div>
                                        </div>
                                        <input
                                            type="text"
                                            className="txt txt-sekunder-color"
                                            onChange={(e) => {
                                                this.setState({
                                                    dataSend: {
                                                        ...this.state.dataSend,
                                                        bicode: e.target.value
                                                    }
                                                })
                                            }}
                                            value={this.state.dataSend.biCode}
                                            placeholder={"BI Code"}
                                        />
                                    </div>
                                    <div className="margin-bottom-15px">
                                        <div className="margin-5px">
                                            <div className="txt-site txt-11 txt-main txt-bold">
                                                <h4>
                                                    Bank Name <span style={{ color: "red" }}>*</span>
                                                </h4>
                                            </div>
                                        </div>
                                        <input
                                            type="text"
                                            className="txt txt-sekunder-color"
                                            onChange={(e) => {
                                                this.setState({
                                                    dataSend: {
                                                        ...this.state.dataSend,
                                                        bankName: e.target.value
                                                    }
                                                })
                                            }}
                                            value={this.state.dataSend.bankName}
                                            placeholder={"Bank Name"}
                                        />
                                    </div>
                                    <div className="margin-bottom-15px">
                                        <div className="margin-5px">
                                            <div className="txt-site txt-11 txt-main txt-bold">
                                                <h4>
                                                    Country<span style={{ color: "red" }}>*</span>
                                                </h4>
                                            </div>
                                        </div>
                                        <Select
                                            value={this.state.countryValue}
                                            onChange={(dt) => {
                                                this.setState({
                                                    dataSend: {
                                                        ...this.state.dataSend,
                                                        countryID: dt.value,
                                                        countryName: dt.label,
                                                    },
                                                    provinceValue: [],
                                                    kabkotValue: [],
                                                    countryValue: dt
                                                })
                                                this.getProvinceByCountryID(dt.value)
                                            }}
                                            options={this.state.countryData}
                                        />
                                    </div>
                                    <div className="margin-bottom-15px">
                                        <div className="margin-5px">
                                            <div className="txt-site txt-11 txt-main txt-bold">
                                                <h4>
                                                    Province<span style={{ color: "red" }}>*</span>
                                                </h4>
                                            </div>
                                        </div>
                                        <Select
                                            value={this.state.provinceValue}
                                            onChange={(dt) => {
                                                this.setState({
                                                    dataSend: {
                                                        ...this.state.dataSend,
                                                        provinceID: dt.value,
                                                        provinceName: dt.label
                                                    },
                                                    provinceValue: dt,
                                                    kabkotValue: []
                                                })
                                                this.getDistrictById(dt.value)
                                            }}
                                            options={this.state.provinceData}
                                        />
                                    </div>
                                </div>
                                <div className="column-2">
                                    <div className="margin-bottom-15px">
                                        <div className="margin-5px">
                                            <div className="txt-site txt-11 txt-main txt-bold">
                                                <h4>
                                                    District<span style={{ color: "red" }}>*</span>
                                                </h4>
                                            </div>
                                        </div>
                                        <Select
                                            value={this.state.kabkotValue}
                                            defaultValue={this.state.kabkotValue}
                                            onChange={(dt) => {
                                                this.setState({
                                                    dataSend: {
                                                        ...this.state.dataSend,
                                                        districtID: dt.value,
                                                        districtName: dt.label
                                                    },
                                                    kabkotValue: dt
                                                })
                                            }}
                                            options={this.state.kabkotData}
                                        />
                                    </div>
                                    <div className="margin-bottom-15px">
                                        <div className="margin-5px">
                                            <div className="txt-site txt-11 txt-main txt-bold">
                                                <h4>
                                                    Bank Address<span style={{ color: "red" }}>*</span>
                                                </h4>
                                            </div>
                                        </div>
                                        <textarea
                                            type="text"
                                            className="txt txt-sekunder-color"
                                            rows={6}
                                            placeholder={"Bank Address"}
                                            onChange={(e) => {
                                                this.setState({
                                                    dataSend: {
                                                        ...this.state.dataSend,
                                                        bankAddress: e.target.value
                                                    }
                                                })
                                            }}
                                            value={this.state.dataSend.bankAddress}
                                        />
                                    </div>
                                    <div className="margin-bottom-15px">
                                        <div className="margin-5px">
                                            <div className="txt-site txt-11 txt-main txt-bold">
                                                <h4>
                                                    Description<span style={{ color: "red" }}>*</span>
                                                </h4>
                                            </div>
                                        </div>
                                        <textarea
                                            type="text"
                                            className="txt txt-sekunder-color"
                                            rows={6}
                                            placeholder={"Description"}
                                            onChange={(e) => {
                                                this.setState({
                                                    dataSend: {
                                                        ...this.state.dataSend,
                                                        description: e.target.value
                                                    }
                                                })
                                            }}
                                            value={this.state.dataSend.description}
                                        />
                                    </div>
                                    <div className="padding-15px">
                                        <div className="grid grid-2x">
                                            <div className="col-1"></div>
                                            <div className="col-2 content-right">
                                                <button className="btn btn-blue" type="button" onClick={() => this.createData()}>
                                                    <span>SAVE</span>
                                                </button>
                                                <button
                                                    style={{ marginLeft: "15px" }}
                                                    className="btn btn-primary"
                                                    type="button"
                                                    onClick={this.props.onClickClose.bind(this)}
                                                >
                                                    <span>CLOSE</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}


export default FormBankAccount;