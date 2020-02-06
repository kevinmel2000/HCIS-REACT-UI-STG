import React, { Component } from 'react'
import ReactTooltip from 'react-tooltip'
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

class SlideFormEducation extends Component {
    constructor(props) {
        super(props)
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
            educationData,
            bizparEduLevel, bizparEduType,

        };
        console.log(this.props.educationData)
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
        <div className="border-bottom padding-15px grid grid-mobile-none gap-20px">
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
                        bizValue={this.state.educationData.educationConfigurationType.bizparValue}
                        disabled
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
                        bizValue={this.state.educationData.educationConfigurationLevel.bizparValue}
                        disabled
                        type="bizpar"
                        data={this.props.bizparEduLevel}
                        value={this.state.educationData.educationConfigurationLevel.bizparKey} />
                </div>
            </div>
        </div>
    )

    renderTable = () => (
        <div>
            <div className="padding-15px">
                {this.props.type === "update" && (
                    <div className="col-2 content-right margin-bottom-5px">
                        <button
                            type="button"
                            className="btn btn-circle background-blue"
                            onClick={this.openCloseCreate.bind(this)}
                        >
                            <i className="fa fa-1x fa-plus" />
                        </button>
                    </div>
                )}
                <div>
                    <MuiThemeProvider theme={this.getMuiTheme()}>
                        <MUIDataTable
                            title={<span>Institute List <span style={{ color: "red" }}>*</span></span>}
                            subtitle={"lorem ipsum dolor"}
                            data={this.state.dataTableIns}
                            columns={this.props.type === "view" ? this.columnsInstituteView : this.columnsInstitute}
                            options={this.options}
                        />
                    </MuiThemeProvider>
                </div>
            </div>
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
                            subtitle={"lorem ipsum dolor"}
                            data={this.state.dataTableDep}
                            columns={this.props.type === "view" ? this.columnsDepartmentView : this.columnsDepartment}
                            options={this.options}
                        />
                    </MuiThemeProvider>
                </div>
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
                        className="btn btn-blue"
                        type="button"
                        onClick={this.props.onClickClose}
                    >
                        <span>CLOSE</span>
                    </button>
                </div>
            </div>
        </div>
    )

    componentDidUpdate(prevProps) {
        if (this.props.educationData !== prevProps.educationData) {
            if (this.props.type !== "create") {
                this.getEducationByEduID(this.props.educationData.educationConfigurationID)
            }
            let { instituteID, depBizparKey } = []
            instituteID = this.props.educationData.educationConfigurationInstitutes.map((value) => {
                return value.instituteID

            })
            depBizparKey = this.props.educationData.educationConfigurationDepartements.map((value) => {
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
            this.setState({
                educationData: this.props.educationData
            })
        }

    }

    render() {
        return (
            <div>
                <div className="a-s-p-place active">
                    <div className="a-s-p-top">
                        <div className="grid grid-2x">
                            <div className="col-1" style={{ width: "140%" }}>
                                <div className="display-flex-normal margin-top-10px">
                                    <i className="fa fa-1x fa-graduation-cap"></i>
                                    <span className="txt-site txt-11 txt-main margin-left-10px">
                                        Education Configuration - {this.props.type === 'update' ? 'Edit' : 'View'} Form
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
                    <form action="#"
                        onSubmit={(e) => {
                            e.preventDefault()
                            let payload = this.state.educationData
                            payload = {
                                ...payload,
                                educationConfigurationInstitutes: this.state.dataInstituteID,
                                educationConfigurationDepartements: this.state.dataDepartmentBizparKey,
                                educationConfigurationCreationalSpecificationDTO: {
                                    createdBy: this.state.educationData.educationConfigurationCreationalSpecificationDTO.createdBy,
                                    createdDate: this.state.educationData.educationConfigurationCreationalSpecificationDTO.createdDate,
                                    modifiedBy: this.props.user.employeeID,
                                    modifiedDate: M().format('DD-MM-YYYY HH:mm:ss')
                                }
                            }
                            if (R.isEmpty(payload.educationConfigurationInstitutes)) return alert('Please add some institute !')
                            if (R.isEmpty(payload.educationConfigurationDepartements)) return alert('Please add some major !')
                            this.props.onClickSave(payload)
                        }}>
                        <div className="a-s-p-mid a-s-p-pad border-top">
                            <div className="display-flex-normals margin-bottom-15px">
                                <div>
                                    {this.renderForm()}
                                    {this.renderTable()}
                                    <div className="padding-top-15px padding-bottom-15px">
                                        <div className="border-top padding-top-20px">
                                            <div className="grid grid-2x">
                                                <div className="col-1 content-left">
                                                    <button
                                                        onClick={this.props.closeSlide}
                                                        type='button'
                                                        className="btn btn-primary margin-right-10px content-left">
                                                        BACK
                                                   </button>
                                                </div>
                                                {this.props.type === 'update' && (
                                                    <div className="col-2 content-right">
                                                        <button type="submit" className="btn btn-blue">
                                                            SAVE
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </form>
                    <ReactTooltip />
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
            </div>
        )
    }
}

export default SlideFormEducation