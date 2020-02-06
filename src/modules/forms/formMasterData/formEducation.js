import React, { Component } from "react";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables-bitozen";
import API from "../../../Services/Api";
import FormEducationInstitute from "../../forms/formMasterData/formEducationInstitute"
import FormEducationDepartment from "../../forms/formMasterData/formEducationDepartment";
import PopUp from "../../../../src/components/pages/PopUpAlert";
import DropDown from '../../../modules/popup/DropDown';
import * as R from 'ramda'
import M from 'moment'
var ct = require("../../../modules/custom/customTable");

const defaultEducation = {
    "educationConfigurationInstitutes": ["INSTITUTE-01", "INSTITUTE-02"],
    "educationConfigurationDepartements": ["EDUDEP-001", "EDUDEP-002"],
    "educationConfigurationType": '',
    "educationConfigurationLevel": '',
    "educationConfigurationStatus": 'ACTIVE',
    "educationConfigurationCreationalSpecificationDTO": {
    }

}

class formEducation extends Component {
    constructor(props) {
        super(props);
        let {
            educationData, bizparEduLevel, bizparEduType
        } = this.props;

        this.state = {
            dataTableIns: [],
            dataTableDep: [],
            rawDataIns: [],
            dataTableDepCreate: [],
            dataTableInsCreate: [],
            formInstituteVisible: true,
            formDepartmentVisible: false,
            createInstituteVisible: false,
            createDepartmentVisible: false,
            deletePopUpInstituteVisible: false,
            deletePopUpVisibleDepartment: false,
            dataInstituteID: [],
            dataDepartmentBizparKey: [],
            optionVisible: false,
            activeTab: "Institute",
            tabMenu: [
                'Institute',
                'Major',
            ],
            educationData: educationData ? {
                ...educationData,
            } : {
                    ...defaultEducation,
                    educationConfigurationID: "EDUCON-" + Date.now(),
                    educationConfigurationCreationalSpecificationDTO: {
                        createdBy: this.props.user.employeeID,
                        createdDate: M().format('DD-MM-YYYY HH:mm:ss'),
                        modifiedBy: this.props.user.employeeID,
                        modifiedDate: null
                    }

                },
            bizparEduLevel, bizparEduType,

        };

    }

    componentDidMount() {
        if (this.props.type !== "create") {
            this.getEducationByEduID(this.state.educationData.educationConfigurationID)
        }
        let { instituteID, depBizparKey } = []
        instituteID = this.state.educationData.educationConfigurationInstitutes.map((value) => {
            return value.instituteID

        })
        depBizparKey = this.state.educationData.educationConfigurationDepartements.map((value) => {
            return value.bizparKey
        })
        this.props.type === "update" ?
            this.setState({
                dataInstituteID: Object.assign([], instituteID),
                dataDepartmentBizparKey: Object.assign([], depBizparKey)
            }) :
            this.setState({
                dataInstituteID: Object.assign([], this.state.dataInstituteID),
                dataDepartmentBizparKey: Object.assign([], this.state.departmentBizparKey)
            })
    }

    getEducationByEduID(value) {
        API.create("MASTERDATA")
            .getEducationByEduID(value)
            .then(res => {
                if (res.status === 200) {
                    if (res.data.status === "S") {
                        let dataTableRawIns = res.data.data.educationConfigurationInstitutes
                        let dataTableRawDep = res.data.data.educationConfigurationDepartements
                        let dataTableIns = dataTableRawIns.map((value) => {
                            return [
                                value.instituteID,
                                value.instituteName,
                                value.instituteAddress
                            ]
                        })
                        let dataTableDep = dataTableRawDep.map((value) => {
                            return [
                                value.bizparValue
                            ]
                        })
                        this.setState({
                            dataTableIns,
                            dataTableDep
                        })
                    }
                }
            });
    }

    opNavigator = (title) => {
        let cl = title === this.state.activeTab ? 'c-n-link active' : 'c-n-link'
        return (
            <li key={title} className={cl} onClick={this.opContent(title)}>
                {title}
            </li>
        );
    }

    opContent = title => e => {
        e.preventDefault();

        let allStateVisibleFalse = {
            ...this.state,
            formInstituteVisible: false,
            formDepartmentVisible: false,
            activeTab: title
        }
        switch (title) {
            case "Institute":
                allStateVisibleFalse = {
                    ...allStateVisibleFalse,
                    formInstituteVisible: true
                }
                break;
            case "Major":
                allStateVisibleFalse = {
                    ...allStateVisibleFalse,
                    formDepartmentVisible: true
                }
                break;
            default:
                break;
        }
        this.setState(allStateVisibleFalse);
    }

    openCloseCreate() {
        this.setState({
            createInstituteVisible: !this.state.createInstituteVisible,
            dataInstituteID: Object.assign([], this.state.dataInstituteID)
        });

    }
    openCloseCreateDepartment() {
        this.setState({
            createDepartmentVisible: !this.state.createDepartmentVisible,
            dataDepartmentBizparKey: Object.assign([], this.state.dataDepartmentBizparKey)
        });
    }

    openDeletePopupDepartmentInstitute = (index) => {
        this.setState({ deletePopUpInstituteVisible: !this.state.deletePopUpInstituteVisible, selectedIndex: index })
    };

    openDeletePopupDepartment = (index) => {
        this.setState({ deletePopUpVisibleDepartment: !this.state.deletePopUpVisibleDepartment, selectedIndex: index })
    };

    addDepartmentHandler(rawDataDepartment, index) {
        let selectedDepartment = rawDataDepartment[index]
        let dataTableDep = Object.assign([], this.state.dataTableDep)
        let dataDepartmentBizparKey = Object.assign([], this.state.dataDepartmentBizparKey)
        let data = dataDepartmentBizparKey.map((value) => {
            return {
                bizparKey: value
            }
        })
        let isExist = R.findIndex(R.propEq('bizparKey', selectedDepartment.bizparKey))(data)
        console.log("ada", isExist)
        if (isExist < 0) {
            dataDepartmentBizparKey.push(
                selectedDepartment.bizparKey
            )
            dataTableDep.push([
                selectedDepartment.bizparValue,
                selectedDepartment.bizparKey

            ])
            dataDepartmentBizparKey = Array.from(new Set(dataDepartmentBizparKey))
            this.setState({
                dataTableDep,
                dataDepartmentBizparKey,
                createDepartmentVisible: !this.state.createDepartmentVisible
            })
        } else {
            alert("Data is Exist.")
        }
    }

    addInstituteHandler(value, rawDataInstitute) {
        let selectedInstitute = rawDataInstitute[value]
        let dataTableIns = Object.assign([], this.state.dataTableIns)
        let dataInstituteID = Object.assign([], this.state.dataInstituteID)
        let dataIns = dataInstituteID.map((value) => {
            return {
                instituteID: value
            }
        })
        let isExist = R.findIndex(R.propEq('instituteID', selectedInstitute.instituteID))(dataIns)
        console.log("ada", isExist)
        if (isExist < 0) {
            dataInstituteID.push(
                selectedInstitute.instituteID
            )
            dataTableIns.push([
                selectedInstitute.instituteID,
                selectedInstitute.instituteName,
                selectedInstitute.instituteAddress
            ])
            dataInstituteID = Array.from(new Set(dataInstituteID))
            this.setState({
                dataTableIns,
                dataInstituteID,
                createInstituteVisible: !this.state.createInstituteVisible
            })
        } else {
            alert("Data is Exist.")
        }
    }

    removeInstituteHandler(selectedIndex) {
        let dataInstituteID = Object.assign([], this.state.dataInstituteID)
        let dataTableIns = Object.assign([], this.state.dataTableIns)
        dataInstituteID.splice(selectedIndex, 1)
        dataTableIns.splice(selectedIndex, 1)
        this.setState({
            dataInstituteID,
            dataTableIns,
            deletePopUpInstituteVisible: false
        })
    }

    removeDepartmentHandler(selectedIndex) {
        let dataDepartmentBizparKey = Object.assign([], this.state.dataDepartmentBizparKey)
        let dataTableDep = Object.assign([], this.state.dataTableDep)

        dataDepartmentBizparKey.splice(selectedIndex, 1)
        dataTableDep.splice(selectedIndex, 1)

        this.setState({
            dataDepartmentBizparKey,
            dataTableDep,
            deletePopUpVisibleDepartment: false
        })
    }

    getMuiTheme = () => createMuiTheme(ct.customTable());

    options = ct.customOptions5();

    columnsInstituteView = [
        "Institute ID",
        "Institute Name",
        "Institute Address",
    ];
    columnsInstitute = [
        "Institute ID",
        "Institute Name",
        "Institute Address",
        {
            name: "Action",
            options: {
                customBodyRender: (val, tableMeta) => {
                    return (
                        <div>
                            <button
                                type="button"
                                className="btnAct"
                                onClick={() => this.openDeletePopupDepartmentInstitute(tableMeta.rowIndex)}
                            >
                                <i className="fa fa-lw fa-trash-alt" style={{ backgroundColor: 'transparent', color: 'red', fontSize: 20 }} />
                            </button>
                        </div>
                    );
                }
            }
        }
    ];
    columnsDepartmentView = [
        "Major"
    ];

    columnsDepartment = [
        "Major",
        {
            name: "Action",
            options: {
                customBodyRender: (val, tableMeta) => {
                    return (
                        <div>
                            <button
                                type="button"
                                className="btnAct"
                                onClick={() => this.openDeletePopupDepartment(tableMeta.rowIndex)}
                            // onClick={() => this.removeDepartmentHandler(tableMeta.rowIndex)}
                            >
                                <i className="fa fa-lw fa-trash-alt" style={{ backgroundColor: 'transparent', color: 'red', fontSize: 20 }} />
                            </button>
                        </div>
                    );
                }
            }
        }
    ];

    renderForm = () => (
        <div className="border-bottom padding-15px grid grid-2x grid-mobile-none gap-20px">
            <div className="column-1">
                <div className="margin-bottom-20px">
                    <div className="margin-5px">
                        <div className="txt-site txt-11 txt-main txt-bold">
                            <h4>Education-Config ID</h4>
                        </div>
                    </div>
                    <input
                        readOnly={this.props.type === "view" ? true : false}
                        style={{ backgroundColor: "#E6E6E6" }}
                        type="text"
                        className="txt txt-sekunder-color"
                        placeholder=""
                        required
                        value={
                            this.state.educationData && this.state.educationData.educationConfigurationID
                        }
                    />
                </div>
                <div className="margin-bottom-20px">
                    <div className="margin-5px">
                        <div className="txt-site txt-11 txt-main txt-bold">
                            <h4>Education Type <span style={{ color: "red" }}>*</span></h4>
                        </div>
                    </div>
                    <DropDown
                        title="-- please select education --"
                        onChange={(dt) => this.setState({
                            educationData: {
                                ...this.state.educationData,
                                educationConfigurationType: {
                                    ...this.state.educationData.educationConfigurationType,
                                    bizparKey: dt
                                }
                            }
                        })}
                        disabled={this.props.type === 'view'}
                        type="bizpar"
                        data={this.props.bizparEduType}
                        value={this.state.educationData.educationConfigurationType.bizparKey} />
                </div>
            </div>
            <div className="column-2">
                <div className="margin-bottom-20px">
                    <div className="margin-5px">
                        <div className="txt-site txt-11 txt-main txt-bold">
                            <h4>Education Level <span style={{ color: "red" }}>*</span></h4>
                        </div>
                    </div>
                    <DropDown
                        title="-- please select education --"
                        onChange={(dt) => this.setState({
                            educationData: {
                                ...this.state.educationData,
                                educationConfigurationLevel: {
                                    ...this.state.educationData.educationConfigurationLevel,
                                    bizparKey: dt
                                }
                            }
                        })}
                        disabled={this.props.type === 'view'}
                        type="bizpar"
                        data={this.props.bizparEduLevel}
                        value={this.state.educationData.educationConfigurationLevel.bizparKey} />
                </div>
            </div>
        </div>
    )

    renderTable = () => (
        <div className="popup-content-grid">
            <div className="popup popup-col-1">
                <ul className="vertical-tab">
                    {this.state.tabMenu.map((data, index) => { return this.opNavigator(data) })}
                </ul>
            </div>
            <div className=" popup popup-col-2">
                {this.state.formInstituteVisible && (
                    <div className="padding-15px">
                        {this.props.type === "view" ? '' :
                            <div className="col-2 content-right margin-bottom-5px">
                                <button
                                    type="button"
                                    className="btn btn-circle background-blue"
                                    onClick={this.openCloseCreate.bind(this)}
                                >
                                    <i className="fa fa-1x fa-plus" />
                                </button>
                            </div>
                        }
                        <div>
                            <MuiThemeProvider theme={this.getMuiTheme()}>
                                <MUIDataTable
                                    title={<span>Institute List <span style={{ color: "red" }}>*</span></span>}
                                    data={this.state.dataTableIns}
                                    columns={this.props.type === "view" ? this.columnsInstituteView : this.columnsInstitute}
                                    options={this.options}
                                />
                            </MuiThemeProvider>
                        </div>
                    </div>
                )}
                {this.state.formDepartmentVisible && (
                    <div className="padding-15px">
                        {this.props.type === "view" ? '' :
                            <div className="col-2 content-right margin-bottom-5px">
                                <button
                                    type="button"
                                    className="btn btn-circle background-blue"
                                    onClick={this.openCloseCreateDepartment.bind(this)}
                                >
                                    <i className="fa fa-1x fa-plus" />
                                </button>
                            </div>
                        }
                        <div>
                            <MuiThemeProvider theme={this.getMuiTheme()}>
                                <MUIDataTable
                                    title={<span>Major List <span style={{ color: "red" }}>*</span></span>}
                                    data={this.state.dataTableDep}
                                    columns={this.props.type === "view" ? this.columnsDepartmentView : this.columnsDepartment}
                                    options={this.options}
                                />
                            </MuiThemeProvider>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )

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
    )

    render() {
        return (
            <div className={"app-popup app-popup-show"}>
                <div className="padding-top-20px" />
                <div className="popup-content background-white border-radius">
                    <div className="popup-panel grid grid-2x">
                        <div className="col-1">
                            <div className="popup-title">
                                {this.props.type === "create"
                                    ? "Education Configuration - Create Form"
                                    : this.props.type === "update"
                                        ? "Education Configuration - Edit Form"
                                        : "Education Configuration - View Form"}
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
                    <form
                        action="#"
                        onSubmit={(e) => {
                            e.preventDefault()
                            let payload = this.state.educationData

                            payload = {
                                ...payload,
                                educationConfigurationInstitutes: this.state.dataInstituteID,
                                educationConfigurationDepartements: this.state.dataDepartmentBizparKey

                            }

                            if (payload.educationConfigurationLevel === "" || payload.educationConfigurationLevel.bizparKey === "") return alert('Please Select ED Level!')
                            if (payload.educationConfigurationType === "" || payload.educationConfigurationType.bizparKey === "") return alert('Please Select ED Type!')
                            if (R.isEmpty(payload.educationConfigurationInstitutes)) return alert('Please add some institute !')
                            if (R.isEmpty(payload.educationConfigurationDepartements)) return alert('Please add some departement !')

                            this.props.onClickSave(payload)
                        }}
                    >
                        {this.renderForm()}
                        {this.renderTable()}
                        {this.renderFooter()}
                    </form>
                </div>
                {this.state.createInstituteVisible && (
                    <FormEducationInstitute
                        onClickClose={this.openCloseCreate.bind(this)}
                        onClick={this.addInstituteHandler.bind(this)}
                        educationData={this.state.educationData}
                    />
                )}
                {this.state.createDepartmentVisible && (
                    <FormEducationDepartment
                        educationData={this.state.educationData}
                        onClickClose={this.openCloseCreateDepartment.bind(this)}
                        onClick={this.addDepartmentHandler.bind(this)}
                    />
                )}
                {this.state.deletePopUpInstituteVisible && (
                    <PopUp
                        type={"delete"}
                        class={"app-popup app-popup-show"}
                        onClickDelete={() => this.removeInstituteHandler(this.state.selectedIndex)}
                        onClick={this.openDeletePopupDepartmentInstitute}
                    />
                )}
                {this.state.deletePopUpVisibleDepartment && (
                    <PopUp
                        type={"delete"}
                        class={"app-popup app-popup-show"}
                        onClickDelete={() => this.removeDepartmentHandler(this.state.selectedIndex)}
                        onClick={this.openDeletePopupDepartment}
                    />
                )}
                <div className="padding-bottom-20px"></div>
            </div>

        );
    }

}
export default formEducation