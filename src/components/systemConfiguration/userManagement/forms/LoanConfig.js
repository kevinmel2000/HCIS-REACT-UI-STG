import React, { Component } from 'react'
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles'
import MUIDataTable from "mui-datatables-bitozen"
import PopUp from '../../../pages/PopUpAlert'
import LoadingBar from "react-top-loading-bar"
import ResizeSlider from '../../../../modules/resize/Slider'
import SplitPaneSecond from 'react-split-pane'
import { Redirect } from 'react-router-dom'
import IdleTimer from 'react-idle-timer'
import LoanConfigCreateForm from './create/loan/LoanConfigCreateForm'
import NumberFormat from 'react-number-format'

import Api from '../../../../Services/Api'
import * as R from 'ramda'
import M from 'moment'
import { getBizpar } from '../../../../Services/Utils'
import { connect } from 'react-redux'
import AuthAction from '../../../../Redux/AuthRedux'

var ct = require("../../../../modules/custom/customTable")
const getMuiTheme = () => createMuiTheme(ct.customTable())
const options = ct.customOptions()


class LoanConfig extends Component {
    constructor(props) {
        super(props)
        this.state = {
            formRescheduleVisible: false,
            savePopUpVisible: false,
            saveOk: false,
            button: "",
            allowResize: false,
            defaultSize: 0,
            minSize: 0,
            maxSize: 0,
            timeout: 1000 * 100 * 9,
            isTimedOut: false,
            table_limit: 5,
            table_page: 0,
            table_query: "",
            // data: [],
            dataDetail: [],
            dataTable: [],
            rawData: [],
            // formCreate: false,
            payloadLoan: [],
            bizparLoanType: [],
            selectedIndex: 0,
        }
        this.idleTimer = null
    }

    componentDidMount() {
        if (!R.isNil(this.props.auth.user)) {
            this.onFinishFetch()
        }

        this.getBizpar()
        this.getData(this.state.table_page, this.state.table_limit)
    }

    async getBizpar() {
        let bizparLoanType = await getBizpar('FACILITY_TYPE')

        this.setState({
            bizparLoanType
        })

        // console.log(this.state.bizparLoanType)
    }

    async getData(page, limit) {
        let payload = {
            "limit": limit,
            "offset": page,
            "params": {}
        }

        let response = await Api.create("CFG").getAllLoanRule(payload)
        if (response.data && response.data.status === "S") {
            let dataTable = response.data.data.map((value, index) => {
                const { loanRuleID, loanRuleName, loanRuleEffectiveDate, loanRuleDescription, laonRuleStatus } = value
                return [
                    index += 1,
                    loanRuleID,
                    loanRuleName,
                    loanRuleEffectiveDate,
                    loanRuleDescription,
                    laonRuleStatus,
                    // laonRuleStatus === "ACTIVE" ? "YES" : "NO"
                ]
            })
            this.setState({ dataTable, rawData: response.data.data })
        } else {
            alert("Failed: " + response.data.message)
        }
    }

    async handleSubmit(payload) {
        payload = {
            ...payload,
            loanRuleEffectiveDate: M(payload.loanRuleEffectiveDate).format("DD-MM-YYYY")
        }

        // console.log(payload)

        let response = await Api.create("CFG").postLoanRule(payload)
        if (response.data && response.data.status === "S") {
            this.openPopUp("save")
            this.getData(this.state.table_page, this.state.table_limit)
        } else {
            alert("Failed: " + response.data.message)
        }
    }

    async handleUpdate(payload) {
        payload = {
            ...payload,
            loanRuleEffectiveDate: M(payload.loanRuleEffectiveDate).format("DD-MM-YYYY"),
            loanRuleType: ""
        }

        // console.log(payload)

        let response = await Api.create("CFG").updateLoanRule(payload)
        if (response.data && response.data.status === "S") {
            this.openPopUp("save")
            this.getData(this.state.table_page, this.state.table_limit)
        } else {
            alert("Failed: " + response.data.message)
        }
    }

    async handleDelete() {
        let { rawData, selectedIndex } = this.state
        let payload = {
            "referenceID": rawData[selectedIndex].loanRuleID,
            "requestBy": "SYSTEM",
            "requestDate": M().format("DD-MM-YYYY HH:mm:ss")
        }

        console.log(payload)

        let response = await Api.create("CFG").deleteLoanRule(payload)

        console.log(response)
        if (response.data && response.data.status === "S") {
            this.setState({ deletePopUpVisible: !this.state.deletePopUpVisible })
            this.getData(this.state.table_page, this.state.table_limit)
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
                    payloadLoan: this.state.rawData[selectedIndex],
                })
                break
            case 'slide-edit':
                this.setState({
                    formDetailVisible: true,
                    selectedIndex,
                    button: "edit",
                    payloadLoan: this.state.rawData[selectedIndex],
                })
                break

            default:
                break
        }
    }

    columns = [
        "No",
        "loan Rule ID",
        "loan Rule Name",
        "loan Rule Effective Date",
        "loan Rule Description",
        "laon Rule Status",
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
                                onClick={() => this.openPopUp("delete", tableMeta.rowIndex)}
                                className="btnAct margin-right-10px">
                                <i className="fa fa-trash-alt" style={{ backgroundColor: 'transparent', color: 'red', fontSize: 20 }} />
                            </button>
                            <button
                                type='button'
                                onClick={this.opSidePage("slide-detail", tableMeta.rowIndex)}
                                className="btnAct">
                                <i className="fa fa-ellipsis-v" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }} />
                            </button>
                        </div>
                    )
                }
            }
        }
    ]

    openPopUp = (type, index, button) => {
        switch (type) {
            case "save":
                this.setState({ savePopUpVisible: !this.state.savePopUpVisible, button })
                this.clResizePane()
                break
            case "delete":
                this.setState({ deletePopUpVisible: !this.state.deletePopUpVisible, selectedIndex: index })
                this.clResizePane()
                break
            case "ok":
                this.setState({ savePopUpVisible: false, saveOk: !this.state.saveOk })
                this.clResizePane()
                break
            case "create":
                this.setState({ formCreateVisible: !this.state.formCreateVisible })
                this.clResizePane()
                break
            case "createRequest":
                this.setState({ formCreateRequest: !this.state.formCreateRequest })
                this.clResizePane()
                break
            default:
                break
        }
    }

    render() {
        if (R.isNil(this.props.auth.user)) return <Redirect to={{ pathname: "/" }} ></Redirect>
        let { formDetailVisible, deletePopUpVisible, savePopUpVisible, saveOk, timeout, minSize, maxSize, allowResize, defaultSize, button, selectedIndex, formCreateVisible } = this.state
        return (
            <div>
                <ResizeSlider
                    allowResize={allowResize}
                    defaultSize={defaultSize}
                    minSize={minSize}
                    maxSize={maxSize}
                    main={(
                        <div className="a-s-p-place a-s-p-content active">
                            <div className="a-s-p-top">
                                <div className="grid grid-2x">
                                    <div className="col-1">
                                        <div className="margin-left-15px margin-top-10px margin-bottom-10px display-flex-normal">
                                            <div>
                                                <i className="color-blue fa fa-1x fa-sign-out-alt margin-right-10px"></i>
                                            </div>
                                            <div>
                                                <div className="txt-site txt-12 txt-bold txt-main">
                                                    Loan Configuration
                                                </div>
                                                <div className="txt-site txt-10 txt-thin txt-primary">
                                                    Loan Configuration
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="a-s-p-mid border-top">
                                <LoadingBar onRef={ref => (this.LoadingBar = ref)} />
                                <div className='padding-10px grid grid-2x'>
                                    <div className='column-1'></div>
                                    <div className='column-2 content-right'>
                                        <button
                                            type="button"
                                            onClick={() => this.openPopUp("create")}
                                            className="btn btn-small-circle btn-sekunder margin-left-5px">
                                            <i className="fa fa-lw fa-plus" />
                                        </button>
                                    </div>
                                </div>
                                <div className="padding-10px">
                                    <MuiThemeProvider theme={getMuiTheme()}>
                                        <MUIDataTable
                                            title='Loan Configuration List'
                                            subtitle={'lorem ipsum dolor'}
                                            data={this.state.dataTable}
                                            columns={this.columns}
                                            options={options}
                                        />
                                    </MuiThemeProvider>
                                </div>
                                {formCreateVisible && (
                                    <LoanConfigCreateForm
                                        type="create"
                                        loginEmployeeID={this.props.auth.employeeID}
                                        onClickClose={() => this.openPopUp("create")}
                                        onClickSave={this.handleSubmit.bind(this)}
                                        // onClickSave={() => this.openPopUp("save")}
                                    />
                                )}
                            </div>
                        </div>
                    )}
                    side={(
                        <div className="a-s-p-side">
                            {formDetailVisible && (
                                <LoanConfigCreateForm
                                    type={this.state.button}
                                    payload={this.state.payloadLoan}
                                    loginEmployeeID={this.props.auth.employeeID}
                                    onClickClose={() => this.openPopUp("edit")}
                                    onClickSave={this.handleUpdate.bind(this)}
                                    closeSlide={this.clResizePane}
                                    // onClickSave={() => this.openPopUp("save")}
                                />
                            )}
                        </div>
                    )}
                />

                {savePopUpVisible && (
                    <PopUp
                        type={"save"}
                        class={"app-popup app-popup-show"}
                        // onClick={this.state.formCreate ? this.openCreateForm.bind(this) : this.openSavePopUp.bind(this)}
                        onClick={() => this.openPopUp("save")}
                        // onClickSave={button === "decline" ? this.opSidePage("slide-decline", selectedIndex) : button === "change" ? this.opSidePage("slide-reschedule", selectedIndex) : () => this.openPopUp("ok")}
                    />
                )}

                {saveOk && (
                    <PopUp
                        type={"save"}
                        class={"app-popup app-popup-show"}
                        onClick={() => this.openPopUp("ok")}
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

export default connect(mapStateToProps, mapDispatchToProps)(LoanConfig)