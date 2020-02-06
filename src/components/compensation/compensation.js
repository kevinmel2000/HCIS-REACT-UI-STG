import React, { Component } from 'react'
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles'
import MUIDataTable from "mui-datatables-bitozen"
import CompensationDetail from './compensationDetail'
import PopUp from '../pages/PopUpAlert'
import Api from '../../Services/Api'
import LoadingBar from 'react-top-loading-bar'
import FormCompensationCreate from '../../modules/forms/formCompensation/formCompensationCreate'
import { connect } from 'react-redux'
import M from 'moment'
import { Redirect } from 'react-router-dom'
import * as R from 'ramda'
import AuthAction from '../../Redux/AuthRedux'
import IdleTimer from 'react-idle-timer'
import ResizeSlider from '../../modules/resize/Slider'
import SplitPaneSecond from 'react-split-pane'

var ct = require("../../modules/custom/customTable")
const getMuiTheme = () => createMuiTheme(ct.customTable())
const options = ct.customOptions()
const monthNames = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"]

class compensation extends Component {
    constructor(props) {
        super(props)
        this.state = {
            detailVisible: false,
            createVisible: false,
            editVisible: false,
            selectedIndex: null,
            type: "",
            savePopUpVisible: false,
            saveOk: false,
            rawData: [],
            auth: props.auth,
            timeout: 1000 * 100 * 9,
            showModal: false,
            userLoggedIn: false,
            isTimedOut: false,
            allowResize: false,
            defaultSize: 0,
            minSize: 0,
            maxSize: 0
        }
        this.idleTimer = null
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

    openDetailForm = (type, index) => {
        this.clResizePane()
        this.setState({ detailVisible: !this.state.detailVisible, selectedIndex: index, type })
    }

    openSavePopUp = (payload) => {
        this.setState({ savePopUpVisible: !this.state.savePopUpVisible, payload })
    }

    openSaveOk = () => {
        this.clResizePane()
        this.setState({ saveOk: !this.state.saveOk, savePopUpVisible: false, detailVisible: false, createVisible: false, editVisible: false })
    }

    openCreateForm = () => {
        this.clResizePane()
        this.setState({ createVisible: !this.state.createVisible })
    }

    openEditForm = (index) => {
        this.setState({ editVisible: !this.state.editVisible, selectedIndex: index })
    }

    startFetch = () => {
        this.LoadingBar.continousStart()
    }

    onFinishFetch = () => {
        if (typeof this.LoadingBar === "object") this.LoadingBar.complete()
    }

    async getData() {
        let payload = {
            "limit": 500,
            "offset": 0
        }

        let response = await Api.create("CNB_QUERY").getAllBatchPayroll(payload)
        if (response.data && response.data.status === "S") {
            let dataTable = response.data.data.map((value, index) => {
                const { batchPayrollID, batchPayrollMonth, batchPayrollYear, batchPayrollStatus } = value
                return [
                    index += 1,
                    batchPayrollID,
                    `${monthNames[batchPayrollMonth - 1]}  ${batchPayrollYear}`,
                    batchPayrollStatus,
                    batchPayrollStatus
                ]
            })
            this.setState({ rawData: response.data.data, dataTable })
            this.onFinishFetch()
        } else {
            this.onFinishFetch()
            alert("Failed: " + response.data && response.data.message)
        }
    }

    async handleSubmit(payload) {
        let response = await Api.create("CNB").postBatchPayroll(payload)
        if (response.data && response.data.status === "S") {
            this.openSaveOk()
            this.getData()
        } else {
            alert("Failed: " + response.data.message)
        }
    }

    async handleUpdate(payload) {
        let payloadDetail = payload.batchPayrollDetail.map((value) => {
            return {
                ...value,
                employeeID: typeof value.employeeID === "object" ? value.employeeID.employeeID : value.employeeID
            }
        })
        payload = {
            ...payload,
            batchPayrollDetail: payloadDetail,
            updatedBy: "SYSTEM",
            updatedDate: M().format("DD-MM-YYYY HH:mm:ss"),
        }
        let response = await Api.create("CNB").putBatchPayroll(payload)
        if (response.data && response.data.status === "S") {
            this.openSaveOk()
            this.getData()
        } else {
            alert("Failed: " + response.data.message)
        }
    }

    opResizePane = () => {
        this.setState({
            allowResize: true,
            defaultSize: 370,
            minSize: 370,
            maxSize: 870
        })
    }

    opSidePage = (menu, index) => (e) => {
        e.preventDefault()
        this.setState({
            editVisible: false,
            // viewVisible: false
        })

        this.opResizePane()

        switch (menu) {
            case 'slide-payroll':
                this.setState({
                    editVisible: true,
                    selectedIndex: index
                })
                break
            case 'slide-blacklist-view':
                this.setState({
                    viewVisible: true,
                    selectedIndex: index
                })
                break
            default:
                break
        }

    }

    clResizePane = () => {
        this.setState({
            allowResize: false,
            editVisible: false,
            defaultSize: 0,
            minSize: 0,
            maxSize: 0
        })
    }

    componentDidMount() {
        if (!R.isNil(this.props.auth.user)) {
            this.startFetch()
            this.getData()
        }
    }

    columns = [
        "No",
        "Payroll Batch ID",
        "Month",
        {
            name: "Status",
            options: {
              customBodyRender: val => {
                return (
                  <div>
                    <i
                      className="fa fa-lw fa-circle"
                      style={{
                        color:
                        val === "INITIATE" ? "orange" : val === "DONE" ? "brown" : "gray",
                        marginRight: 10,
                        padding: "5px"
                      }}
                    />
                    {val}
                  </div>
                );
              }
            }
        },
        {
            name: "Action",
            options: {
                customBodyRender: (val, tableMeta) => {
                    return (
                        <div>
                            {val === "INITIATE" ?
                                <button
                                    type="button"
                                    className="btnAct"
                                    style={{ marginRight: 15 }}
                                    onClick={this.opSidePage("slide-payroll", tableMeta.rowIndex)}
                                >
                                    <i className="fa fa-lw fa-pencil-alt" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20}} />
                                </button> : null}
                            <button
                                onClick={() => this.openDetailForm("batch", tableMeta.rowIndex)}
                                className="btnAct">
                                <i className="fa fa-lw fa-ellipsis-v" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }} />
                            </button>
                        </div>
                    )
                }
            }
        }
    ]

    render() {
        if (R.isNil(this.props.auth.user)) return <Redirect to={{ pathname: "/" }}></Redirect>
        let { detailVisible, savePopUpVisible, saveOk, createVisible, editVisible } = this.state
        let months = monthNames.map((value, index) => {
            return {
                bizparKey: index + 1,
                bizparValue: value
            }
        })

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
                        timeout={this.state.timeout} />
                    <div>
                        <ResizeSlider
                            allowResize={this.state.allowResize}
                            defaultSize={this.state.defaultSize}
                            minSize={this.state.minSize}
                            maxSize={this.state.maxSize}
                            main={(
                                <div>
                                    <LoadingBar onRef={ref => (this.LoadingBar = ref)} />
                                    <div className="a-s-p-place a-s-p-content active">
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
                                        <div className="a-s-p-mid">
                                            <div className="padding-10px">
                                                <div className="app-open-close margin-bottom-20px">
                                                    <div className="app-open-close-content">
                                                        <MuiThemeProvider theme={getMuiTheme()}>
                                                            <MUIDataTable
                                                                title='Payroll'
                                                                subtitle={"lorem ipsum dolor"}
                                                                data={this.state.dataTable}
                                                                columns={this.columns}
                                                                options={options}
                                                            />
                                                        </MuiThemeProvider>
                                                    </div>
                                                </div>
                                            </div>
                                            {createVisible &&
                                                <FormCompensationCreate
                                                    type={"create"}
                                                    dataMonths={months}
                                                    companyID={this.state.auth.user.companyID}
                                                    onClickSave={this.openSavePopUp.bind(this)}
                                                    onClickClose={this.openCreateForm.bind(this)}
                                                />
                                            }

                                            {detailVisible &&
                                                <CompensationDetail
                                                    type={this.state.type}
                                                    user={this.state.auth.user}
                                                    data={this.state.rawData[this.state.selectedIndex]}
                                                    getData={this.getData.bind(this)}
                                                    openSavePopUp={this.openSavePopUp.bind(this)}
                                                    onClickClose={this.openDetailForm.bind(this)}
                                                />}
                                        </div>
                                    </div>
                                </div>
                            )}
                            side={(
                                <div className="a-s-p-side">
                                    {editVisible &&
                                        <FormCompensationCreate
                                            type={"edit"}
                                            data={this.state.rawData[this.state.selectedIndex]}
                                            dataMonths={months}
                                            onClickSave={this.openSavePopUp.bind(this)}
                                            closeSlide={this.clResizePane}
                                        />
                                    }
                                </div>
                            )}
                        />

                        {savePopUpVisible && (
                            <PopUp
                                type={"simpan"}
                                class={"app-popup app-popup-show"}
                                onClick={this.openSavePopUp.bind(this)}
                                onClickSimpan={this.state.createVisible ? this.handleSubmit.bind(this, this.state.payload) : this.handleUpdate.bind(this, this.state.payload)}
                            />
                        )}

                        {saveOk && (
                            <PopUp
                                type={"save"}
                                class={"app-popup app-popup-show"}
                                onClick={this.openSaveOk.bind(this)}
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
        auth: state.auth,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        authLogout: () => dispatch(AuthAction.authLogout())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(compensation)