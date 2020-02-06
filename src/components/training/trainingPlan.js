import React, { Component } from 'react'
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles'
import MUIDataTable from "mui-datatables-bitozen"
import TrainignExpense from './trainingExpenseDetail'
import PopUp from '../pages/PopUpAlert'
import LoadingBar from "react-top-loading-bar"
import ResizeSlider from '../../modules/resize/Slider'
import SplitPaneSecond from 'react-split-pane'
import { Redirect } from 'react-router-dom'
import Api from '../../Services/Api'
import * as R from 'ramda'
import M from 'moment'
import { connect } from 'react-redux'
import AuthAction from '../../Redux/AuthRedux'
import IdleTimer from 'react-idle-timer'
import TrainingPlanCreateForm from './trainingPlanCreateForm'
// import CalendarPicker from '../../modules/popup/Calendar'
// import DropDown from '../../modules/popup/DropDown'
// import NumberFormat from 'react-number-format'

var ct = require("../../modules/custom/customTable")
const getMuiTheme = () => createMuiTheme(ct.customTable())
const options = ct.customOptions()
const options5 = ct.customOptions5()

class TrainingPlan extends Component {
    bizparType = [
        { bizparKey: '1', bizparValue: 'HARDSKILL' },
        { bizparKey: '2', bizparValue: 'SOFTSKILL' }
    ]
    bizparProvider = [
        { bizparKey: '1', bizparValue: 'REGULAR' },
        { bizparKey: '2', bizparValue: 'SPECIAL' }
    ]
    constructor(props) {
        super(props)
        this.state = {
            formCreateVisible: false,
            savePopUpVisible: false,
            saveOk: false,
            button: "",
            data: [],
            allowResize: false,
            defaultSize: 0,
            minSize: 0,
            maxSize: 0,
            timeout: 1000 * 100 * 9,
            isTimedOut: false,
            limit: 5,
            offset: 0,
            trainingExpense: false
        }
        this.idleTimer = null
    }

    openExpense(selectedIndex) {
        this.clResizePane()
        this.setState({
            trainingExpense: !this.state.trainingExpense,
            selectedIndex
        })
    }

    componentDidMount() {
        if (!R.isNil(this.props.auth.user)) {
            this.onFinishFetch()
        }
        this.getData(this.state.offset, this.state.limit)
        this.getOrgLevels()
    }

    async getOrgLevels() {
        let response = await Api.create('ES').getPosistion()
        if (response.data && response.data.status === "S") {
            let dataTableOrgLevels = response.data.data.map((value, index) => {
                const { ouid, oujobDesc, oUSalaryStartFrom, oUSalaryStartTo } = value
                return [
                    index += 1,
                    ouid,
                    oujobDesc,
                    oUSalaryStartFrom,
                    oUSalaryStartTo,
                    'unselected'
                ]
            })
            this.setState({ dataTableOrgLevels, dataRawOrgLevels: response.data.data })
            // console.log(this.state.dataTableOrgLevels)
        } else {
            alert("Failed: " + response.data.message)
        }
    }

    async getData(offset, limit) {
        let payload = {
            "limit": limit,
            "offset": offset,
            "params": {}
        }

        let response = await Api.create('TRAINING_QUERY').getAllTrainingPlan(payload)
        if (response.data && response.data.status === "S") {
            let dataTable = response.data.data.map((value, index) => {
                const { trainingID, trainingName, trainingStartDate, trainingEndDate, trainingMaxAttendance, trainingDescription, trainingStatus } = value
                return [
                    index += 1,
                    trainingID,
                    trainingName,
                    trainingStartDate,
                    trainingEndDate,
                    trainingMaxAttendance,
                    trainingDescription,
                    trainingStatus
                ]
            })
            this.setState({ dataTable, rawData: response.data.data })
            // console.log(response.data.data)
        } else {
            alert("Failed: " + response.data.message)
        }
    }

    async handleSubmit(payload) {
        let payloadDefault = {
            ...payload,
            trainingStartDate: M(payload.trainingStartDate).format("DD-MM-YYYY"),
            trainingEndDate: M(payload.trainingEndDate).format("DD-MM-YYYY"),
            // trainingStartTime: M(payload.trainingStartDate).format("DD-MM-YYYY") + ' ' + payload.trainingStartTime,
            // trainingEndTime: M(payload.trainingEndDate).format("DD-MM-YYYY") + ' ' + payload.trainingEndTime,
        }

        // console.log(payloadDefault)

        let response = await Api.create("TRAINING").postTrainingPlan(payloadDefault)
        if (response.data && response.data.status === "S") {
            this.openPopUp("ok")
            this.getData(this.state.offset, this.state.limit)
        } else {
            alert("Failed: " + response.data.message)
        }
    }

    async handleUpdate(payload) {
        let payloadDefault = {
            ...payload,
            trainingStartDate: M(payload.trainingStartDate).format("DD-MM-YYYY"),
            trainingEndDate: M(payload.trainingEndDate).format("DD-MM-YYYY"),
        }

        // console.log(payloadDefault)

        let response = await Api.create("TRAINING").putTrainingPlan(payloadDefault)
        if (response.data && response.data.status === "S") {
            this.openPopUp("ok")
            this.getData(this.state.offset, this.state.limit)
        } else {
            alert("Failed: " + response.data.message)
        }
    }

    async handleDelete() {
        let { rawData, selectedIndex } = this.state
        let payload = {
            "trainingID": rawData[selectedIndex].trainingID,
        }

        // console.log(payload)

        let response = await Api.create("TRAINING").deleteTrainingPlan(payload)

        console.log(response)
        if (response.data && response.data.status === "S") {
            this.setState({ deletePopUpVisible: !this.state.deletePopUpVisible })
            this.getData(this.state.offset, this.state.limit)
        } else {
            alert("Failed: " + response.data.message)
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
            formDetailVisible: false,
            allowResize: false,
            defaultSize: 0,
            minSize: 0,
            maxSize: 0
        })
    }

    opSidePage = (menu, selectedIndex) => (e) => {
        this.setState({
            formDetailVisible: false,
            selectedIndex,
            savePopUpVisible: false,
        })
        this.opResizePane()

        switch (menu) {
            case 'slide-detail':
                this.setState({
                    formDetailVisible: true,
                    selectedIndex,
                    button: "detail",
                    dataDetail: this.state.rawData[selectedIndex],
                })
                break
            case 'slide-edit':
                this.setState({
                    formDetailVisible: true,
                    selectedIndex,
                    button: "edit",
                    dataDetail: this.state.rawData[selectedIndex],
                })
                break

            default:
                break
        }

    }

    columns = [
        "No",
        "Training ID",
        "Training Name",
        "Training Start Date",
        "Training End Date",
        "Training Max Attendance",
        "Training Description",
        "Training Status",
        {
            name: "Action",
            options: {
                customBodyRender: (val, tableMeta) => {
                    return (
                        <div className="display-flex-normal">
                            <button
                                type='button'
                                onClick={this.opSidePage("slide-edit", tableMeta.rowIndex)}
                                className="btnAct margin-right-10px">
                                <i className="fa fa-pencil-alt" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }} />
                            </button>
                            <button
                                type='button'
                                onClick={() => this.openPopUp("delete")}
                                className="btnAct margin-right-10px">
                                <i className="fa fa-trash-alt" style={{ backgroundColor: 'transparent', color: 'red', fontSize: 20 }} />
                            </button>
                            <button
                                type='button'
                                onClick={this.opSidePage("slide-detail", tableMeta.rowIndex)}
                                className="btnAct margin-right-10px">
                                <i className="fa fa-ellipsis-v" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }} />
                            </button>
                            <button
                                type='button'
                                onClick={() => this.openExpense(tableMeta.rowIndex)}
                                className="btnAct">
                                <i className="fa fa-dollar-sign" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }} />
                            </button>
                        </div>
                    )
                }
            }
        }
    ]

    columnsOrg = [
        "Department",
        {
            name: "Action",
            options: {
                customBodyRender: (val, tableMeta) => {
                    return (
                        <div>
                            <button
                                type="button"
                                className="btnAct"
                                onClick={() => this.openPopUp('delete')}
                            >
                                <i className="fa fa-lw fa-trash-alt" style={{ backgroundColor: 'transparent', color: 'red', fontSize: 20 }} />
                            </button>
                        </div>
                    );
                }
            }
        }
    ]

    dataOrg = [['DEVELOPER'], ['IT SERVER'], ['QA / QC']]

    openPopUp = (type, button) => {
        switch (type) {
            case "save":
                this.setState({ savePopUpVisible: !this.state.savePopUpVisible, button })
                break
            case "delete":
                this.setState({ deletePopUpVisible: !this.state.deletePopUpVisible })
                break
            case "ok":
                this.setState({ savePopUpVisible: false, saveOk: !this.state.saveOk })
                this.clResizePane()
                break
            case "saveOrg":
                this.setState({ saveOk: !this.state.saveOk })
                break
            case "create":
                this.clResizePane()
                this.setState({ formCreateVisible: !this.state.formCreateVisible })
                break
            case "search":
                this.setState({ formSearch: !this.state.formSearch })
                break
            case "org":
                this.setState({ saveOk: false, formSearchOrg: !this.state.formSearchOrg })
                break
            default:
                break
        }
    }

    renderSearchOrg = () => {
        let datatable = [
            ['TREASURY'],
            ['DEVELOPER'],
            ['BUSINESS ANALYST'],
            ['ACCOUNT OFFICER'],
        ]
        let columns = [
            "Department",
            {
                name: "Action",
                options: {
                    customBodyRender: (val, tableMeta) => {
                        return (
                            <div>
                                <button
                                    type='button'
                                    onClick={() => this.openPopUp('saveOrg')}
                                    className="btnAct margin-right-10px">
                                    <i className="fa fa-plus" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }} />
                                </button>
                            </div>
                        )
                    }
                }
            }
        ]
        return (
            <div className="app-popup app-popup-show">
                <div className="padding-top-20px" />
                <div className="popup-content-small background-white border-radius">
                    <div className="popup-panel grid grid-2x">
                        <div className="col-1">
                            <div className="popup-title">
                                {'Department - Search Form'}
                            </div>
                        </div>
                        <div className="col-2 content-right">
                            <button
                                className="btn btn-circle btn-grey"
                                onClick={() => this.openPopUp("org")}
                            >
                                <i className="fa fa-lg fa-times" />
                            </button>
                        </div>
                    </div>
                    <div className="padding-15px">
                        <form action="#">
                            <div className="display-flex-normals">
                                <div className="padding-10px">
                                    <MuiThemeProvider theme={getMuiTheme()}>
                                        <MUIDataTable
                                            title={<span>Organization Level List <span style={{ color: "red" }}>*</span></span>}
                                            // subtitle={'lorem ipsum dolor'}
                                            data={datatable}
                                            columns={columns}
                                            options={options5}
                                        />
                                    </MuiThemeProvider>
                                </div>
                                <div className="padding-top-15px">
                                    <div className="grid">
                                        <div className="content-right">
                                            <button
                                                style={{ marginLeft: "15px" }}
                                                className="btn btn-primary"
                                                type="button"
                                                onClick={() => this.openPopUp("org")}
                                            >
                                                <span>CLOSE</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
                <div className="padding-bottom-20px" />
            </div>
        )
    }

    render() {
        if (R.isNil(this.props.auth.user)) return <Redirect to={{ pathname: "/" }} ></Redirect>
        let { formDetailVisible, deletePopUpVisible, savePopUpVisible, saveOk, timeout, minSize, maxSize, allowResize, defaultSize, button, selectedIndex, formSearch, formCreateVisible, formSearchOrg, trainingExpense } = this.state
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
                                    <div className='padding-10px grid grid-2x'>
                                        <div className='column-1'></div>
                                        <div className='column-2 content-right'>
                                            <button
                                                type="button"
                                                onClick={() => this.openPopUp("create")}
                                                className="btn btn-circle btn-blue"
                                            >
                                                <i className="fa fa-lg fa-plus" />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="padding-10px">
                                        <MuiThemeProvider theme={getMuiTheme()}>
                                            <MUIDataTable
                                                title='Training Plan'
                                                subtitle={'Training Plan'}
                                                data={this.state.dataTable}
                                                columns={this.columns}
                                                options={options}
                                            />
                                        </MuiThemeProvider>
                                    </div>
                                    {formCreateVisible && (
                                        <TrainingPlanCreateForm
                                            type={"create"}
                                            payloadOrgLevel={this.state.dataTableOrgLevels}
                                            searchForm={() => this.openPopUp("search")}
                                            onClickClose={() => this.openPopUp("create")}
                                            onClickSave={this.handleSubmit.bind(this)}
                                        />
                                    )}
                                    {trainingExpense && (
                                        <TrainignExpense
                                            onClickClose={() => this.openExpense()}
                                            trainingID={this.state.rawData[selectedIndex].trainingID}
                                        />
                                    )}
                                    {formSearchOrg && this.renderSearchOrg()}
                                </div>
                            )}
                            side={(
                                <div className="a-s-p-side">
                                    {formDetailVisible && (
                                        <TrainingPlanCreateForm
                                            type={this.state.button}
                                            payload={this.state.dataDetail}
                                            payloadOrgLevel={this.state.dataTableOrgLevels}
                                            searchForm={() => this.openPopUp("search")}
                                            onClickClose={this.clResizePane}
                                            onClickSave={this.handleUpdate.bind(this)}
                                        />
                                    )}
                                </div>
                            )}
                        />

                        {savePopUpVisible && (
                            <PopUp
                                type={"simpan"}
                                class={"app-popup app-popup-show"}
                                onClick={() => this.openPopUp("save")}
                                onClickSimpan={button === "decline" ? this.opSidePage("slide-decline", selectedIndex) : button === "change" ? this.opSidePage("slide-reschedule", selectedIndex) : () => this.openPopUp("ok")}
                            />
                        )}

                        {saveOk && (
                            <PopUp
                                type={"save"}
                                class={"app-popup app-popup-show"}
                                onClick={formSearchOrg ? () => this.openPopUp("org") : () => this.openPopUp("ok")}
                            />
                        )}
                        {deletePopUpVisible && (
                            <PopUp
                                type={"delete"}
                                class={"app-popup app-popup-show"}
                                onClick={() => this.openPopUp("delete")}
                                onClickDelete={() => this.handleDelete()}
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

export default connect(mapStateToProps, mapDispatchToProps)(TrainingPlan)