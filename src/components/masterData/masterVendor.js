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
import FormMasterVendor from '../../modules/forms/formOutsource/formMasterVendor'
import Api from '../../Services/Api'
import M from 'moment'

var ct = require("../../modules/custom/customTable")
const getMuiTheme = () => createMuiTheme(ct.customTable())
const options = ct.customOptions()

class MasterVendor extends Component {
    constructor() {
        super()
        this.state = {
            dataTable: [],
            rawData: [],
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

    getVendorType() {
        let bizparVendorType = [
            { bizparKey: 'PT', bizparValue: 'PT' },
            { bizparKey: 'CV', bizparValue: 'CV' },
            { bizparKey: 'FIRMA', bizparValue: 'FIRMA' },
            { bizparKey: 'UD', bizparValue: 'UD' },
        ]
        this.setState({ bizparVendorType })
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
            let dataTable = res.data.data.map((value, index) => {
                const { vendorID, vendorName, } = value
                return [
                    index += 1,
                    vendorID,
                    vendorName
                ]
            })
            this.onFinishFetch()
            this.setState({
                dataTable,
                rawData: res.data.data
            })
        }
    }

    async postDataVendor(value) {
        let createdBy = this.props.auth.user.employeeID
        let payload = {
            "vendorAddress": value.vendorAddress,
            "vendorDesc": value.vendorDesc,
            "vendorEmail": value.vendorEmail,
            "vendorExpireDate": value.vendorExpireDate,
            "vendorID": value.vendorID,
            "vendorName": value.vendorName,
            "vendorPhone": value.vendorPhone,
            "vendorPICName": value.vendorPICName,
            "vendorPICphone": value.vendorPICphone,
            "vendorRegistrationDate": value.vendorRegistrationDate,
            "vendorStatus": "ACTIVE",
            "vendorType": value.vendorType,
            "vendorOutsourceCreationalDTO": {
                "createdBy": createdBy,
                "createdDate": M().format('DD-MM-YYYY HH:mm:ss'),
            }
        }
        let res = await Api.create('MASTERDATA').postVendor(payload)
        if (res.data.status === 'S') {
            this.openPopUp('save')
            this.getDataVendor()
        }
    }

    async updateDataVendor(value) {
        let updateby = this.props.auth.user.employeeID
        let payload = {
            "vendorAddress": value.vendorAddress,
            "vendorDesc": value.vendorDesc,
            "vendorEmail": value.vendorEmail,
            "vendorExpireDate": value.vendorExpireDate,
            "vendorID": value.vendorID,
            "vendorName": value.vendorName,
            "vendorPhone": value.vendorPhone,
            "vendorPICName": value.vendorPICName,
            "vendorPICphone": value.vendorPICphone,
            "vendorRegistrationDate": value.vendorRegistrationDate,
            "vendorStatus": "ACTIVE",
            "vendorType": value.vendorType,
            "vendorOutsourceCreationalDTO": {
                "createdBy": value.vendorOutsourceCreationalDTO.createdBy,
                "createdDate": value.vendorOutsourceCreationalDTO.createdDate,
                "modifiedBy": updateby,
                "modifiedDate": M().format('DD-MM-YYYY HH:mm:ss')
            }
        }
        let res = await Api.create('MASTERDATA').putVendor(payload)
        if (res.data.status === 'S') {
            this.openPopUp('save')
            this.getDataVendor()
        }
    }

    async deleteDataVendor() {
        // return console.log(this.state.rawData[this.state.selectedIndex].vendorID)
        let referenceID = this.state.rawData[this.state.selectedIndex].vendorID
        let requestBy = this.props.auth.user.employeeID
        let payload = {
            "referenceID": referenceID,
            "requestBy": requestBy,
            "requestDate": M().format('DD-MM-YYYY HH:mm:ss')
        }
        let res = await Api.create('MASTERDATA').deleteVendor(payload)
        if (res.data.status === 'S') {
            this.openPopUp('delete')
            this.getDataVendor()
        }
    }

    componentDidMount() {
        if (!R.isNil(this.props.auth.user)) {
            this.getDataVendor()
            this.getVendorType()
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
                })
                break
            case 'slide-view':
                this.setState({
                    viewVisible: true,
                    selectedIndex,
                })
                break
            default:
                break
        }
    }

    openPopUp = (type, index) => {
        switch (type) {
            case "save":
                this.setState({ savePopUpVisible: !this.state.savePopUpVisible, createVisible: false })
                this.clResizePane()
                break
            case "delete":
                this.clResizePane()
                this.setState({ deletePopUpVisible: !this.state.deletePopUpVisible, selectedIndex: index })
                break
            default:
                break
        }
    }

    columns = [
        "No",
        "Vendor ID",
        "Vendor Name",
        {
            name: "Detail",
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
                                onClick={() => this.openPopUp('delete', tableMeta.rowIndex)}
                                className="btnAct margin-right-10px">
                                <i className="fa fa-trash-alt" style={{ backgroundColor: 'transparent', color: 'red', fontSize: 20 }} />
                            </button>
                            {/* <button
                                type='button'
                                onClick={this.opSidePage("slide-view", tableMeta.rowIndex)}
                                className="btnAct">
                                <i className="fa fa-ellipsis-v" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }} />
                            </button> */}
                        </div>
                    )
                }
            }
        }
    ]

    data = [
        ["1", "OUT-2020-0001", "PT. TIGA DAYA DIGITAL"],
        ["2", "OUT-2020-0002", "PT. TIGA DAYA"],
        ["3", "OUT-2020-0003", "PT. TIGA "],
        ["4", "OUT-2020-0004", "PT. DAYA DIGITAL"],
        ["5", "OUT-2020-0005", "PT. DIGITAL"],
        ["6", "OUT-2020-0006", "PT. TIGA DIGITAL"],
    ]

    render() {
        if (R.isNil(this.props.auth.user)) return <Redirect to={{ pathname: "/" }} ></Redirect>
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
                                                title='Vendor Outsourcing'
                                                subtitle={"lorem ipsum dolor"}
                                                data={this.state.dataTable}
                                                columns={this.columns}
                                                options={options}
                                            />
                                        </MuiThemeProvider>
                                    </div>
                                    {createVisible && (
                                        <FormMasterVendor
                                            type={"create"}
                                            bizparVendorType={this.state.bizparVendorType}
                                            onClickSave={this.postDataVendor.bind(this)}
                                            onClickClose={this.openCreateForm.bind(this)}
                                        />
                                    )}
                                </div>
                            )}
                            side={(
                                <div className="a-s-p-side">
                                    {editVisible && (
                                        <FormMasterVendor
                                            type={"edit"}
                                            bizparVendorType={this.state.bizparVendorType}
                                            rawData={this.state.rawData[this.state.selectedIndex]}
                                            onClickSave={this.updateDataVendor.bind(this)}
                                            closeSlide={this.clResizePane.bind(this)}
                                            createdBy={this.props.auth.user.employeeID}
                                        />
                                    )}
                                    {viewVisible && (
                                        <FormMasterVendor
                                            type={"view"}
                                            bizparVendorType={this.state.bizparVendorType}
                                            rawData={this.state.rawData[this.state.selectedIndex]}
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
                                onClickDelete={() => this.deleteDataVendor()}
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

export default connect(mapStateToProps, mapDispatchToProps)(MasterVendor)