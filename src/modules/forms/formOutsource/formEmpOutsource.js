import React, { Component } from 'react'
import CalendarPicker from '../../../modules/popup/Calendar'
import DropDown from '../../../modules/popup/DropDown'
import EmployeeSearchForm from '../formInbox/employeeSearchForm'
import NumberFormat from 'react-number-format'
import SearchEmployeeOutsource from '../../../components/outsource/searchEmployeeOutsource'
import M from 'moment'
import * as R from 'ramda'

const dataCreate = {
    "oaID": "",
    "osaCost": '',
    "osaDesc": "",
    "osaName": "",
    "osaOUID": "",
    "osaResourceID": "",
    "osaStartDate": "",
    "osaEndDate": "",
    "osaStatus": "",
    "osaType": "",
    "osaVendorID": "",
    "recordID": "",
    'vendorName': ''
}

class FormEmployeeOutsource extends Component {
    constructor(props) {
        super(props)
        this.state = {
            bizparDepartment: props.bizparDepartment,
            type: props.type,
            searchVisible: false,
            employeeName: "",
            data: props.data ? {
                ...props.data,
                osaStartDate: !R.isNil(props.data.osaStartDate) ? M(props.data.osaStartDate, 'DD-MM-YYYY HH:mm:ss').format('YYYY-MM-DD') : '',
                osaEndDate: !R.isNil(props.data.osaEndDate) ? M(props.data.osaEndDate, 'DD-MM-YYYY HH:mm:ss').format('YYYY-MM-DD') : ''
            } : { ...dataCreate, oaID: 'OA-' + M() }
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.data !== prevProps.data) {
            this.setState({
                data: {
                    ...this.props.data,
                    osaStartDate: !R.isNil(this.props.data.osaStartDate) ? M(this.props.data.osaStartDate, 'DD-MM-YYYY HH:mm:ss').format('YYYY-MM-DD') : '',
                    osaEndDate: !R.isNil(this.props.data.osaEndDate) ? M(this.props.data.osaEndDate, 'DD-MM-YYYY HH:mm:ss').format('YYYY-MM-DD') : ''
                }
            })
        }
    }

    dataDepartment = [
        {
            "bizparKey": "IT",
            "bizparValue": "IT DEPARTMENT"
        },
        {
            "bizparKey": "HR",
            "bizparValue": "HR DEPARTMENT"
        },
        {
            "bizparKey": "M",
            "bizparValue": "MARKETING DEPARTMENT"
        }
    ]

    openSearchEmployee = () => {
        this.setState({ searchVisible: !this.state.searchVisible })
    }

    handleChooseEmployee = (value) => {
        let { outsourceName } = value
        let index = R.findIndex(R.propEq('vendorID', value.osVendorID))(this.props.rawDataVendor)
        let vendorName = index >= 0 && this.props.rawDataVendor[index].vendorName
        this.setState({
            searchVisible: false,
            data: {
                ...this.state.data,
                vendorName: vendorName,
                osaVendorID: value.osVendorID,
                osaName: outsourceName
            }
        })
    }

    renderEdit() {
        let { type, data, searchVisible } = this.state
        let index = R.findIndex(R.propEq('vendorID', data.osaVendorID))(this.props.rawDataVendor)
        let vendorName = index >= 0 && this.props.rawDataVendor[index].vendorName
        return (
            <div className="a-s-p-place active">
                {searchVisible &&
                    <SearchEmployeeOutsource
                        onClickClose={this.openSearchEmployee.bind(this)}
                        onChoose={this.handleChooseEmployee.bind(this)}
                    />}
                <div className="a-s-p-top">
                    <div className="grid grid-2x">
                        <div className="col-1" style={{ width: "140%" }}>
                            <div className="display-flex-normal margin-top-10px">
                                <i className="fa fa-1x fa-building"></i>
                                <span className="txt-site txt-11 txt-main margin-left-10px">
                                    Outsource Assignment - {type === "edit" ? "Edit Form" : "View Form"}
                                </span>
                            </div>
                        </div>
                        <div className="col-2 content-right">
                            <button
                                onClick={this.props.closeSlide}
                                className="btn btn-circle btn-grey">
                                <i className="fa fa-lg fa-arrow-right" />
                            </button>
                        </div>
                    </div>
                </div>
                <form action="#" onSubmit={(e) => {
                    e.preventDefault()
                    this.props.onClickSave(this.state.data)
                }}>
                    <div className="a-s-p-mid a-s-p-pad border-top">
                        <div className="display-flex-normals margin-bottom-10px">
                            <div className="padding-top-15px padding-bottom-15px">
                                <div className="margin-bottom-15px">
                                    <div className="margin-5px">
                                        <div className="txt-site txt-11 txt-main txt-bold">
                                            <h4>Vendor ID<span style={{ color: "red" }}>*</span></h4>
                                        </div>
                                    </div>
                                    <input
                                        type="text"
                                        className="txt txt-sekunder-color"
                                        readOnly
                                        style={{ backgroundColor: "#E6E6E6" }}
                                        placeholder={"Vendor ID"}
                                        value={data.osaVendorID}
                                    />
                                </div>
                                <div className="card-date-picker margin-bottom-20px">
                                    <div className="margin-5px">
                                        <div className="txt-site txt-11 txt-main txt-bold">
                                            <h4>Vendor Name <span style={{ color: "red" }}>*</span></h4>
                                        </div>
                                    </div>
                                    <input
                                        type="text"
                                        className="txt txt-sekunder-color"
                                        placeholder={"Vendor Name"}
                                        style={{ backgroundColor: "#E6E6E6" }}
                                        readOnly
                                        value={vendorName}
                                    />
                                </div>
                                <div className="card-date-picker  margin-bottom-15px">
                                    <div className="margin-5px">
                                        <div className="txt-site txt-11 txt-main txt-bold">
                                            <h4>Employee Outsource Name<span style={{ color: "red" }}>*</span></h4>
                                        </div>
                                    </div>
                                    <div className="double">
                                        <input
                                            style={{ backgroundColor: "#E6E6E6", padding: 15 }}
                                            value={data.osaName}
                                            className="input"
                                            name="search"
                                            disabled
                                            placeholder="Employee Outsource Name ">
                                        </input>
                                        <button
                                            className="btn btn-grey border-left btn-no-radius"
                                            type="button"
                                            onClick={this.openSearchEmployee.bind(this)}
                                        >
                                            <i className="fa fa-lg fa-search"></i>
                                        </button>
                                    </div>
                                </div>
                                <div className="margin-bottom-15px">
                                    <div className="margin-5px">
                                        <div className="txt-site txt-11 txt-main txt-bold">
                                            <h4>Department User<span style={{ color: "red" }}>*</span></h4>
                                        </div>
                                    </div>
                                    <DropDown
                                        title="-- please select department --"
                                        type="bizpar"
                                        data={this.dataDepartment}
                                        disabled={type === "view"}
                                        onChange={(e) => {
                                            this.setState({
                                                data: {
                                                    ...data,
                                                    osaOUID: e
                                                }
                                            })
                                        }}
                                        value={data.osaOUID}
                                    />
                                </div>
                                <div className="margin-bottom-15px">
                                    <div className="margin-5px">
                                        <div className="txt-site txt-11 txt-main txt-bold">
                                            <h4>Start Date<span style={{ color: "red" }}>*</span></h4>
                                        </div>
                                    </div>
                                    <CalendarPicker disabled={type === "view"}
                                        onChange={(e) => {
                                            this.setState({
                                                data: {
                                                    ...data,
                                                    osaStartDate: e
                                                }
                                            })
                                        }}
                                        date={data.osaStartDate} />
                                </div>
                                <div className="margin-bottom-15px">
                                    <div className="margin-5px">
                                        <div className="txt-site txt-11 txt-main txt-bold">
                                            <h4>End Date<span style={{ color: "red" }}>*</span></h4>
                                        </div>
                                    </div>
                                    <CalendarPicker disabled={type === "view"}
                                        onChange={(e) => {
                                            this.setState({
                                                data: {
                                                    ...data,
                                                    osaEndDate: e
                                                }
                                            })
                                        }}
                                        date={data.osaEndDate} />
                                </div>
                                <div className="margin-bottom-15px">
                                    <div className="margin-5px">
                                        <div className="txt-site txt-11 txt-main txt-bold">
                                            <h4>Cost/Month<span style={{ color: "red" }}>*</span></h4>
                                        </div>
                                    </div>
                                    <NumberFormat
                                        style={{ backgroundColor: type !== 'view' ? null : "#E6E6E6" }}
                                        className="txt txt-sekunder-color"
                                        thousandSeparator={true}
                                        required
                                        // onValueChange={(e) =>
                                        //     this.setState({ data: { ...data, cost: e.formattedValue } })
                                        // } 
                                        onChange={(e) => {
                                            this.setState({
                                                data: { ...data, osaCost: e.target.value }
                                            })
                                        }}
                                        value={data.osaCost}
                                        />
                                    {/* <input
                                        type="text"
                                        className="txt txt-sekunder-color"
                                        placeholder={"Monthly Cost"}
                                        required
                                        style={{ backgroundColor: type === "view" ? "#E6E6E6" : null }}
                                        readOnly={type === "view"}
                                        value={data.cost}
                                    /> */}
                                </div>
                                <div className="padding-15px">
                                    <div className="grid grid-2x">
                                        <div className="col-1"></div>
                                        <div className="col-2 content-right">
                                            {type === "edit" ?
                                                <button className="btn btn-blue" type="submit">
                                                    <span>SAVE</span>
                                                </button> : null}
                                            <button
                                                style={{ marginLeft: "15px" }}
                                                className="btn btn-primary"
                                                type="button"
                                                onClick={this.props.closeSlide}>
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
        )
    }

    render() {
        let { type, searchVisible, employeeName, data } = this.state
        console.log(data.osaStartDate)
        console.log(data.osaEndDate)
        return (
            <div>
                {type === "create" ?
                    <div className="app-popup app-popup-show">
                        <div className="padding-top-20px" />
                        <div className="popup-content-small background-white border-radius">
                            <div className="popup-panel grid grid-2x">
                                <div className="col-1">
                                    <div className="popup-title">
                                        {'Outsource Assignment - Create Form'}
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
                            {searchVisible &&
                                <SearchEmployeeOutsource
                                    onClickClose={this.openSearchEmployee.bind(this)}
                                    onChoose={this.handleChooseEmployee.bind(this)}
                                />}
                            <form action="#" onSubmit={(e) => {
                                e.preventDefault()
                                this.props.onClickSave(this.state.data)
                            }}>
                                <div className="border-bottom padding-15px grid grid-mobile-none gap-20px">
                                    <div className="margin-bottom-15px">
                                        <div className="margin-5px">
                                            <div className="txt-site txt-11 txt-main txt-bold">
                                                <h4>Vendor ID<span style={{ color: "red" }}>*</span></h4>
                                            </div>
                                        </div>
                                        <input
                                            type="text"
                                            className="txt txt-sekunder-color"
                                            readOnly
                                            style={{ backgroundColor: "#E6E6E6" }}
                                            placeholder={"Vendor ID"}
                                            value={data.osaVendorID}
                                        />
                                    </div>
                                    <div className="margin-bottom-15px">
                                        <div className="margin-5px">
                                            <div className="txt-site txt-11 txt-main txt-bold">
                                                <h4>Vendor Name<span style={{ color: "red" }}>*</span></h4>
                                            </div>
                                        </div>
                                        <input
                                            type="text"
                                            className="txt txt-sekunder-color"
                                            placeholder={"Vendor Name"}
                                            readOnly
                                            style={{ backgroundColor: "#E6E6E6" }}
                                            value={data.vendorName}
                                        />
                                    </div>
                                    <div className="card-date-picker margin-bottom-20px">
                                        <div className="margin-5px">
                                            <div className="txt-site txt-11 txt-main txt-bold">
                                                <h4>Employee Outsource Name <span style={{ color: "red" }}>*</span></h4>
                                            </div>
                                        </div>
                                        <div className="double">
                                            <input
                                                style={{ backgroundColor: "#E6E6E6", padding: 15 }}
                                                value={data.osaName}
                                                className="input"
                                                name="search"
                                                disabled
                                                placeholder="Employee Outsource Name ">
                                            </input>
                                            <button
                                                className="btn btn-grey border-left btn-no-radius"
                                                type="button"
                                                disabled={type !== 'create' ? true : false}
                                                onClick={this.openSearchEmployee.bind(this)}
                                            >
                                                <i className="fa fa-lg fa-search"></i>
                                            </button>
                                        </div>
                                    </div>
                                    <div className="margin-bottom-15px">
                                        <div className="margin-5px">
                                            <div className="txt-site txt-11 txt-main txt-bold">
                                                <h4>Department User<span style={{ color: "red" }}>*</span></h4>
                                            </div>
                                        </div>
                                        <DropDown
                                            title="-- please select department --"
                                            type="bizpar"
                                            data={this.dataDepartment}
                                            onChange={(e) => {
                                                this.setState({
                                                    data: {
                                                        ...data,
                                                        osaOUID: e
                                                    }
                                                })
                                            }}
                                            value={data.osaOUID}
                                        />
                                    </div>
                                    <div className="margin-bottom-20px">
                                        <div className="grid grid-2x grid-mobile-none gap-20px">
                                            <div className="column-1">
                                                <div className="margin-5px">
                                                    <div className="txt-site txt-11 txt-main txt-bold">
                                                        <h4>Start Date</h4>
                                                    </div>
                                                </div>
                                                <CalendarPicker
                                                    onChange={(e) => {
                                                        this.setState({
                                                            data: {
                                                                ...data,
                                                                osaStartDate: e
                                                            }
                                                        })
                                                    }}
                                                    date={data.osaStartDate}
                                                />
                                            </div>
                                            <div className="column-2">
                                                <div className="margin-5px">
                                                    <div className="txt-site txt-11 txt-main txt-bold">
                                                        <h4>End Date</h4>
                                                    </div>
                                                </div>
                                                <CalendarPicker
                                                    onChange={(e) => {
                                                        this.setState({
                                                            data: {
                                                                ...data,
                                                                osaEndDate: e
                                                            }
                                                        })
                                                    }}
                                                    date={data.osaEndDate} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="margin-bottom-15px">
                                        <div className="margin-5px">
                                            <div className="txt-site txt-11 txt-main txt-bold">
                                                <h4>Cost/Month<span style={{ color: "red" }}>*</span></h4>
                                            </div>
                                        </div>
                                        <NumberFormat
                                            style={{ backgroundColor: type !== 'view' ? null : "#E6E6E6" }}
                                            className="txt txt-sekunder-color"
                                            thousandSeparator={true}
                                            // value={data.cost}
                                            required
                                            // onValueChange={(e) => {
                                            //     this.setState({
                                            //         data: {
                                            //             ...data,
                                            //             osaCost: e.formattedValue
                                            //         }
                                            //     })
                                            // }}
                                            onChange={(e) => {
                                                this.setState({
                                                    data: { ...data, osaCost: e.target.value }
                                                })
                                            }}
                                            value={data.osaCost}
                                        />
                                        {/* <input
                                            type="text"
                                            className="txt txt-sekunder-color"
                                            placeholder={"Cost/Month"}
                                            required
                                        /> */}
                                    </div>
                                    <div className="col-2 content-right margin-top-20px">
                                        <button
                                            className="btn btn-blue margin-right-10px"
                                            type="submit">
                                            <span>SAVE</span>
                                        </button>
                                        <button
                                            className="btn btn-primary"
                                            type="button"
                                            onClick={this.props.onClickClose}>
                                            <span>CLOSE</span>
                                        </button>
                                    </div>
                                </div>
                            </form>
                            <div className="margin-bottom-20px"></div>
                        </div>
                    </div > : this.renderEdit()}
            </div>
        )
    }
}

export default FormEmployeeOutsource