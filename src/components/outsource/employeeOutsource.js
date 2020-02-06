import React, { Component } from 'react'
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles'
import MUIDataTable from "mui-datatables-bitozen"
import LoadingBar from "react-top-loading-bar"
import ResizeSlider from '../../modules/resize/Slider'
import SplitPaneSecond from 'react-split-pane'
import { Redirect } from 'react-router-dom'
import * as R from 'ramda'
import { connect } from 'react-redux'
import AuthAction from '../../Redux/AuthRedux'
import IdleTimer from 'react-idle-timer'
import PopUp from '../pages/PopUpAlert'
import FormEmployeeOutsource from '../../modules/forms/formOutsource/formEmpOutsource'
import Api from '../../Services/Api'
import M from 'moment'

var ct = require("../../modules/custom/customTable")
const getMuiTheme = () => createMuiTheme(ct.customTable())
const options = ct.customOptions()

class EmployeeOutsource extends Component {
    constructor() {
        super()
        this.state = {
            dataTable: [],
            rawData: [],
            rawDataVendor: [],
            bizparDepartment: [
                { bizparKey: 'IT', bizparValue: 'IT DEPARTMENT' },
                { bizparKey: 'HR', bizparValue: 'HR DEPARTMENT' },
                { bizparKey: 'M', bizparValue: 'MARKETING' },
            ],
            createVisible: false,
            editVisible: false,
            viewVisible: false,
            allowResize: false,
            savePopUpVisible: false,
            deletePopUpVisible: false,
            defaultSize: 0,
            minSize: 0,
            maxSize: 0,
            timeout: 1000 * 100 * 9,
            isTimedOut: false
        }
        this.idleTimer = null
    }

    async getDataVendor() {
        let payload = {
            "limit": 50,
            "offset": 0,
            "params": {
                "vendorStatus": "ACTIVE"
            }
        }
        let res = await Api.create('MASTERDATA').getAllVendorByStatus(payload)
        if (res.data.status === 'S') {
            this.getDataAssignment(res.data.data)
            this.onFinishFetch()
            this.setState({
                rawDataVendor: res.data.data
            })
        }
    }

    getVendorType() {
        let bizparDepartment = [
            { bizparKey: 'IT', bizparValue: 'IT DEPARTMENT' },
            { bizparKey: 'HR', bizparValue: 'HR DEPARTMENT' },
            { bizparKey: 'M', bizparValue: 'MARKETING' },
        ]
        this.setState({ bizparDepartment })
    }

    async getDataAssignment(vendor) {
        let payload = {
            "limit": 5,
            "offset": 0,
            "params": {}
        }
        let res = await Api.create('OUTSOURCE_QUERY').getAllOutsourceAssignment(payload)
        if (res.data.status === 'S') {
            let dataTable = res.data.data.map((value) => {
                const { oaID, osaCost, osaVendorID, osaName, osaOUID, osaStartDate, osaEndDate } = value
                let index = R.findIndex(R.propEq('vendorID', osaVendorID))(vendor)
                let indexDep = R.findIndex(R.propEq('bizparKey', osaOUID))(this.state.bizparDepartment)
                let vendorName = index >= 0 && this.state.rawDataVendor[index].vendorName
                let departmentUser = indexDep >= 0 && this.state.bizparDepartment[indexDep].bizparValue
                return [
                    oaID,
                    osaName,
                    vendorName,
                    departmentUser,
                    osaStartDate,
                    osaEndDate,
                    // osaStartDate && M(osaStartDate).format('DD-MMM-YYYY'),
                    // osaEndDate && M(osaEndDate).format('DD-MMM-YYYY'),
                    osaCost
                ]
            })
            this.onFinishFetch()
            this.setState({
                dataTable,
                rawData: res.data.data
            })
        }
    }


    componentDidMount() {
        if (!R.isNil(this.props.auth.user)) {
            // this.getVendorType()
            this.getDataVendor()
            // this.getDataAssignment()
        }
    }

    async postDataVendor(value) {
        let createdBy = this.props.auth.user.employeeID
        let payload = {
            "oaID": value.oaID,
            "osaCost": value.osaCost && value.osaCost.replace(/,/gi, ''),
            "osaDesc": value.osaDesc,
            "osaName": value.osaName,
            "osaOUID": value.osaOUID,
            "osaResourceID": value.osaResourceID,
            "osaStartDate": M(value.osaStartDate).format('DD-MM-YYYY HH:mm:ss'),
            "osaEndDate": M(value.osaEndDate).format('DD-MM-YYYY HH:mm:ss'),
            "osaStatus": "ACTIVE",
            "osaType": value.osaType,
            "osaVendorID": value.osaVendorID,
            "recordID": value.recordID,
            "outsourceAssignmentCreationalDTO": {
                "updatedBy": createdBy,
                "updatedDate": M().format('DD-MM-YYYY HH:mm:ss'),
                "createdBy": value.createdBy,
                "createdDate": value.createdDate,
            }
        }
        // return console.log(payload)
        let res = await Api.create('OUTSOURCE').postOutsourceAssignment(payload)
        if (res.data.status === 'S') {
            this.openPopUp('save')
            this.getDataAssignment(this.state.rawDataVendor)
        }
    }

    async updateDataVendor(value) {
        let updatedBy = this.props.auth.user.employeeID
        let payload = {

            "oaID": value.oaID,
            "osaCost": this.state.rawData[this.state.selectedIndex].osaCost === value.osaCost ? value.osaCost : value.osaCost.replace(/,/gi, ''),
            "osaDesc": value.osaDesc,
            "osaName": value.osaName,
            "osaOUID": value.osaOUID,
            "osaResourceID": value.osaResourceID,
            "osaStartDate": M(value.osaStartDate).format('DD-MM-YYYY HH:mm:ss'),
            "osaEndDate": M(value.osaEndDate).format('DD-MM-YYYY HH:mm:ss'),
            "osaStatus": "ACTIVE",
            "osaType": value.osaType,
            "osaVendorID": value.osaVendorID,
            "recordID": value.recordID,
            "outsourceAssignmentCreationalDTO": {
                "updatedBy": updatedBy,
                "updatedDate": M().format('DD-MM-YYYY HH:mm:ss'),
                "createdBy": value.outsourceAssignmentCreationalDTO.createdBy,
                "createdDate": value.outsourceAssignmentCreationalDTO.createdDate,
            }
        }
        // return console.log(payload)
        let res = await Api.create('OUTSOURCE').putOutsourceAssignment(payload)
        if (res.data.status === 'S') {
            this.openPopUp('save')
            this.getDataAssignment(this.state.rawDataVendor)
        }
    }

    async deleteDataVendor(value) {
        let updatedBy = this.props.auth.user.employeeID
        let payload = {
            "oaID": value.oaID,
            "updatedBy": updatedBy,
            "updatedDate": M().format('DD-MM-YYYY HH:mm:ss'),
        }
        let res = await Api.create('OUTSOURCE').deleteOutsourceAssignment(payload)
        if (res.data.status === 'S') {
            this.openPopUp('delete')
            this.getDataAssignment(this.state.rawDataVendor)
        }
    }

    logout() {
        this.props.authLogout()
        return <Redirect to={{ pathname: "/" }} ></Redirect>
    }

    onAction() {
        this.setState({ isTimedOut: false })
    }

    onActive() {
        this.setState({ isTimedOut: false })
    }

    onIdle() {
        const isTimedOut = this.state.isTimedOut
        if (isTimedOut) {
            alert("Your session has timed out. Please log in again")
            this.logout()
        } else {
            this.idleTimer.reset();
            this.setState({ isTimedOut: true })
        }
    }

    startFetch = () => {
        this.LoadingBar.continousStart();
    }

    onFinishFetch = () => {
        if (typeof this.LoadingBar === "object") this.LoadingBar.complete();
    }

    opResizePane = () => {
        this.setState({
            allowResize: true,
            defaultSize: 370,
            minSize: 370,
            maxSize: 850
        })
    }

    clResizePane = () => {
        this.setState({
            editVisible: false,
            viewVisible: false,
            allowResize: false,
            defaultSize: 0,
            minSize: 0,
            maxSize: 0
        })
    }

    openCreateForm = () => {
        this.setState({ createVisible: !this.state.createVisible })
    }

    opSidePage = (menu, selectedIndex) => (e) => {
        this.setState({
            editVisible: false,
            viewVisible: false,
            selectedIndex,
        })

        this.opResizePane()

        switch (menu) {
            case 'slide-edit':
                this.setState({
                    editVisible: true,
                    selectedIndex,
                    dataDetail: {
                        vendorId: this.data[selectedIndex][0],
                        vendorName: this.data[selectedIndex][2],
                        employeeName: this.data[selectedIndex][1],
                        departmentUser: this.data[selectedIndex][3],
                        startDate: this.data[selectedIndex][4],
                        endDate: this.data[selectedIndex][5],
                        cost: '10000000',
                    }
                })
                break
            case 'slide-view':
                this.setState({
                    viewVisible: true,
                    selectedIndex,
                    dataDetail: {
                        vendorId: this.data[selectedIndex][0],
                        vendorName: this.data[selectedIndex][2],
                        employeeName: this.data[selectedIndex][1],
                        departmentUser: this.data[selectedIndex][3],
                        startDate: this.data[selectedIndex][4],
                        endDate: this.data[selectedIndex][5],
                        cost: '10000000',
                    }
                })
                break
            default:
                break
        }
    }

    openPopUp = (type, selectedIndex) => {
        switch (type) {
            case "save":
                this.setState({ savePopUpVisible: !this.state.savePopUpVisible, createVisible: false })
                this.clResizePane()
                break
            case "delete":
                this.clResizePane()
                this.setState({ deletePopUpVisible: !this.state.deletePopUpVisible, selectedIndex })
                break
            default:
                break
        }
    }

    columns = [
        "Outsource ID",
        "Employee Name",
        "Vendor Name",
        "Department User",
        "Start Date",
        "End Date",
        "Cost/Month",
        {
            name: "Action",
            options: {
                customHeadRender: (columnMeta) => (
                    <th key={columnMeta.index}
                        style={{ cursor: 'pointer', borderBottom: "1px rgba(0,0,0,0.1) solid", fontSize: 13, fontWeight: 1, textAlign: "right", paddingRight: "20px", top: 0, position: "sticky", backgroundColor: "#fff", zIndex: 100 }} scope="col">
                        {columnMeta.name}
                    </th>
                ),
                customBodyRender: (val, tableMeta) => {
                    return (
                        <div className='display-flex-normal' style={{ justifyContent: 'flex-end' }}>
                            <button
                                type='button'
                                onClick={this.opSidePage("slide-edit", tableMeta.rowIndex)}
                                className="btnAct margin-right-10px">
                                <i className="fa fa-pencil-alt" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }} />
                            </button>
                            <button
                                type='button'
                                onClick={() => this.openPopUp("delete", tableMeta.rowIndex)}
                                className="btnAct margin-right-10px">
                                <i className="fa fa-trash-alt" style={{ backgroundColor: 'transparent', color: 'red', fontSize: 20 }} />
                            </button>
                            <button
                                type='button'
                                onClick={this.opSidePage("slide-view", tableMeta.rowIndex)}
                                className="btnAct">
                                <i className="fa fa-ellipsis-v" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }} />
                            </button>
                        </div>
                    )
                }
            }
        }
    ]

    data = [
        ["PO-000081", "John Doe", "PT. TIGA DAYA DIGITAL", "IT Department", "01-Jan-2020", "01-Jan-2021", "Rp 10.000.000"],
        ["PO-000082", "John", "PT. TIGA DAYA", "HR Department", "01-Feb-2020", "01-Jan-2021", "Rp 9.000.000"],
        ["PO-000083", "Doe", "PT. TIGA", "Marketing Department", "01-Mar-2020", "01-Jan-2021", "Rp 8.000.000"],
        ["PO-000084", "Doe John", "PT. DAYA DIGITAL", "IT Department", "01-Apr-2020", "01-Jan-2021", "Rp 10.000.000"],
        ["PO-000085", "Jo Oe", "PT. TIGA DIGITAL", "HR Department", "01-May-2020", "01-Jan-2021", "Rp 9.000.000"],
        ["PO-000086", "Ohn Oe", "PT. DIGITAL", "Marketing Department", "01-Jun-2020", "01-Jan-2021", "Rp 8.000.000"]
    ]

    render() {
        if (R.isNil(this.props.auth.user)) return <Redirect to={{ pathname: "/" }} ></Redirect>
        console.log(this.state.bizparDepartment)
        let { timeout, allowResize, defaultSize, minSize, maxSize, createVisible, editVisible, viewVisible, savePopUpVisible, deletePopUpVisible } = this.state
        return (
            <SplitPaneSecond
                split="vertical"
                defaultSize={0}
                minSize={0}
                maxSize={0}
                primary="first"
                className="main-slider"
                style={{ height: 'calc(100vh - 50px)' }}>
                <div className="col-1 backgorund-white"></div>
                <div className="col-2 background-white">
                    <IdleTimer
                        ref={ref => { this.idleTimer = ref }}
                        element={document}
                        onActive={this.onActive.bind(this)}
                        onIdle={this.onIdle.bind(this)}
                        onAction={this.onAction.bind(this)}
                        debounce={250}
                        timeout={timeout} />
                    <div>
                        <ResizeSlider
                            allowResize={allowResize}
                            defaultSize={defaultSize}
                            minSize={minSize}
                            maxSize={maxSize}
                            main={(
                                <div className='a-s-p-mid no-header'>
                                    <LoadingBar onRef={ref => (this.LoadingBar = ref)} />
                                    <div className="a-s-p-top">
                                        <div className="col-2 content-right">
                                            <button
                                                type="button"
                                                className="btn btn-circle background-blue"
                                                style={{ marginRight: 10 }}
                                                onClick={this.openCreateForm.bind(this)}
                                            >
                                                <i className="fa fa-1x fa-plus"></i>
                                            </button>
                                        </div>
                                    </div>
                                    <div className="padding-10px">
                                        <MuiThemeProvider theme={getMuiTheme()}>
                                            <MUIDataTable
                                                title='Outsource Assignment'
                                                subtitle={'lorem ipsum dolor'}
                                                data={this.state.dataTable}
                                                columns={this.columns}
                                                options={options}
                                            />
                                        </MuiThemeProvider>
                                    </div>
                                    {createVisible && (
                                        <FormEmployeeOutsource
                                            type={"create"}
                                            rawDataVendor={this.state.rawDataVendor}
                                            bizparDepartment={this.state.bizparDepartment}
                                            onClickSave={this.postDataVendor.bind(this)}
                                            onClickClose={this.openCreateForm.bind(this)}
                                        />
                                    )}
                                </div>
                            )}
                            side={(
                                <div className="a-s-p-side">
                                    {editVisible && (
                                        <FormEmployeeOutsource
                                            type={"edit"}
                                            rawDataVendor={this.state.rawDataVendor}
                                            bizparDepartment={this.state.bizparDepartment}
                                            data={this.state.rawData[this.state.selectedIndex]}
                                            onClickSave={this.updateDataVendor.bind(this)}
                                            closeSlide={this.clResizePane.bind(this)}
                                        />
                                    )}
                                    {viewVisible && (
                                        <FormEmployeeOutsource
                                            type={"view"}
                                            rawDataVendor={this.state.rawDataVendor}
                                            bizparDepartment={this.state.bizparDepartment}
                                            data={this.state.rawData[this.state.selectedIndex]}
                                            closeSlide={this.clResizePane.bind(this)}
                                        />
                                    )}
                                </div>
                            )}
                        />

                        {savePopUpVisible && (
                            <PopUp
                                type={"save"}
                                class={"app-popup app-popup-show"}
                                onClick={() => this.openPopUp("save")}
                            />
                        )}
                        {deletePopUpVisible && (
                            <PopUp
                                type={"delete"}
                                class={"app-popup app-popup-show"}
                                onClick={() => this.openPopUp("delete")}
                                onClickDelete={() => this.deleteDataVendor(this.state.rawData[this.state.selectedIndex])}
                            />
                        )}
                    </div>
                </div>
            </SplitPaneSecond>
        )
    }
}

const mapStateToProps = state => {
    return {
        auth: state.auth
    };
};

const mapDispatchToProps = dispatch => {
    return {
        authLogout: () => dispatch(AuthAction.authLogout())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(EmployeeOutsource)