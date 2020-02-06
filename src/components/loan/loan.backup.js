import React, { Component } from 'react'
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles'
import MUIDataTable from "mui-datatables-bitozen"
import PopUp from '../pages/PopUpAlert'
import LoadingBar from "react-top-loading-bar"
import ResizeSlider from '../../modules/resize/Slider'
import SplitPaneSecond from 'react-split-pane'
import { Redirect } from 'react-router-dom'

import Api from '../../Services/Api'
import * as R from 'ramda'
import { connect } from 'react-redux'

import AuthAction from '../../Redux/AuthRedux'
import IdleTimer from 'react-idle-timer'
import CalendarPicker from '../../modules/popup/Calendar'
import DropDown from '../../modules/popup/DropDown'
import NumberFormat from 'react-number-format'
import FormEditLoan from './formEditLoan'

var ct = require("../../modules/custom/customTable")
const getMuiTheme = () => createMuiTheme(ct.customTable())
const options = ct.customOptions()


class Loan extends Component {
    constructor(props) {
        super(props)
        this.state = {
            formRescheduleVisible: false,
            savePopUpVisible: false,
            editVisible: false,
            deletePopUpVisible: false,
            viewVisible: false,
            saveOk: false,
            button: "",
            data: [],
            allowResize: false,
            defaultSize: 0,
            minSize: 0,
            maxSize: 0,
            timeout: 1000 * 100 * 9,
            isTimedOut: false,
            table_limit: 5,
            table_page: 0,
            table_query: "",
            dataTable: [],
            rawData: [],
        }
        this.idleTimer = null
    }

    componentDidMount() {
        if (!R.isNil(this.props.auth.user)) {
            this.onFinishFetch()
        }

        this.getData(this.state.table_page, this.state.table_limit)
    }

    async getData(page, limit) {
        let payload = {
            "limit": limit,
            "offset": page,
            "params": {}
        }

        let response = await Api.create("LOAN_QUERY").getAllLoan(payload)
        if (response.data && response.data.status === "S") {
            let dataTable = response.data.data.map((value, index) => {
                const { employeeID, loanID, loanAmount, loanApprovalDate, loanReason, loanRequestDate, loanStatus, loanType, recordID } = value
                return [
                    index += 1,
                    loanID,
                    employeeID,
                    loanAmount,
                    loanApprovalDate,
                    loanReason,
                    loanRequestDate,
                    loanStatus,
                    loanType,
                    recordID,
                ]
            })
            this.setState({ dataTable, rawData: response.data.data })
            console.log('frt', response.data.data)
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
                    data: this.state.dataTable[selectedIndex],
                })
                break
            default:
                break
        }
    }

    openCloseEdit(selectedIndex) {
        let savePopUpVisible = this.state.savePopUpVisible ? !this.state.savePopUpVisible : false;
        this.setState({
            editVisible: !this.state.editVisible, selectedIndex,
            savePopUpVisible
        });
    }

    openCloseView(selectedIndex) {
        this.setState({ viewVisible: !this.state.viewVisible, selectedIndex });
    }

    openDeletePopup(index) {
        this.setState({ deletePopUpVisible: !this.state.deletePopUpVisible, selectedIndex: index })
    };

    openCloseCreate(type, selectedIndex = null) {
        let { createVisible, editVisible, viewVisible, openDeletePopup } = this.state
        let createPopUpVisible = this.state.createPopUpVisible ? !this.state.createPopUpVisible : false;
        switch (type) {
            case "edit":
                this.setState({ editVisible: !editVisible, createPopUpVisible, selectedIndex })
                break;
            case "view":
                this.setState({ viewVisible: !viewVisible, selectedIndex })
                break;
            case "delete":
                this.setState({ openDeletePopup: !openDeletePopup, selectedIndex })
                break;
            default:
                break;
        }
    }

    columns = [
        "No",
        "Loan ID",
        "Employee ID",
        "Loan Amount",
        "Loan Approval Date",
        "Loan Reason",
        {
            name: "Action",
            options: {
                customBodyRender: (val, tableMeta) => {
                    return (
                        // <div>
                        //     <button
                        //         type='button'
                        //         onClick={this.opSidePage("slide-detail", tableMeta.rowIndex)}
                        //         className="btnAct">
                        //         <i className="fa fa-ellipsis-v" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }} />
                        //     </button>
                        // </div>
                        <div className='grid grid-3x'>
                            <div className='column-1'>
                                <button
                                    type="button"
                                    className="btnAct"
                                    style={{ marginRight: 5 }}
                                    onClick={() => this.openCloseEdit(tableMeta.rowIndex)}
                                >
                                    <i className="fa fa-lw fa-pencil-alt" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }} />
                                </button>
                            </div>
                            <div className='column-2'>
                                <button
                                    type="button"
                                    className="btnAct"
                                    style={{ marginRight: 5 }}
                                    onClick={() => this.openDeletePopup(tableMeta.rowIndex)}
                                >
                                    <i className="fa fa-lw fa-trash-alt" style={{ backgroundColor: 'transparent', color: 'red', fontSize: 20 }} />
                                </button>
                            </div>
                            <div className='column-3'>
                                <button
                                    type="button"
                                    className="btnAct"
                                    onClick={() => this.openCloseView(tableMeta.rowIndex)}
                                >
                                    <i className="fa fa-lw fa-ellipsis-v" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }} />
                                </button>
                            </div>
                        </div>
                    )
                }
            }
        }
    ]

    data = [
        ["1", "192939923", "SARAS MUTIA", "Rp 15.000.000", "Rp 1.546.454", "Rp 15.000.000", '15000000', '1546454', '10000000'],
        ["2", "192838281", "AJENG RAHAYU", "Rp 15.000.000", "Rp 2.456.234", "Rp 15.000.000", '15000000', '2456234', '10000000'],
        ["3", "190288392", "MUHAMMAD BARKAH", "Rp 15.000.000", "Rp 1.653.223", "Rp 15.000.000", '15000000', '1653233', '10000000'],
        ["4", "190928382", "DEDE YALIAN", "Rp 15.000.000", "Rp 3.423.213", "Rp 15.000.000", '15000000', '3423213', '10000000'],
    ]

    openPopUp = (type, button) => {
        switch (type) {
            case "save":
                this.setState({ savePopUpVisible: !this.state.savePopUpVisible, button })
                break
            case "ok":
                this.setState({ savePopUpVisible: false, saveOk: !this.state.saveOk })
                this.clResizePane()
                break
            default:
                break
        }
    }

    renderDetail = (type) => {
        let { data } = this.state
        return (
            <div className="a-s-p-place active">
                <div className="a-s-p-top">
                    <div className="grid grid-2x">
                        <div className="col-1">
                            <div className="display-flex-normal margin-top-10px">
                                <i className="fa fa-1x fa-file-invoice-dollar"></i>
                                <span className="txt-site txt-11 txt-main margin-left-10px">
                                    Loan Detail
                                </span>
                            </div>
                        </div>
                        <div className="col-2 content-right">
                            <button
                                className="btn btn-circle btn-grey"
                                onClick={this.clResizePane}
                            >
                                <i className="fa fa-lg fa-arrow-right" />
                            </button>
                        </div>
                    </div>
                </div>
                <form action="#">
                    <div className="a-s-p-mid a-s-p-pad border-top">
                        <div className="display-flex-normals margin-bottom-10px">
                            <div className="padding-top-15px padding-bottom-15px">
                                <div className="margin-bottom-15px">
                                    <div className="margin-5px">
                                        <div className="txt-site txt-11 txt-main txt-bold">
                                            <h4>Loan ID</h4>
                                        </div>
                                    </div>
                                    <input
                                        style={{ backgroundColor: "#E6E6E6" }}
                                        readOnly
                                        className="txt txt-sekunder-color"
                                        type="text"
                                        value={data[1]}
                                    ></input>
                                </div>
                                <div className="margin-bottom-15px">
                                    <div className="margin-5px">
                                        <div className="txt-site txt-11 txt-main txt-bold">
                                            <h4>Employee ID</h4>
                                        </div>
                                    </div>
                                    <input
                                        style={{ backgroundColor: "#E6E6E6" }}
                                        readOnly
                                        className="txt txt-sekunder-color"
                                        type="text"
                                        value={data[2]}
                                    ></input>
                                </div>
                                <div className="margin-bottom-15px">
                                    <div className="margin-5px">
                                        <div className="txt-site txt-11 txt-main txt-bold">
                                            <h4>Loan Amount</h4>
                                        </div>
                                    </div>
                                    <input
                                        style={{ backgroundColor: "#E6E6E6" }}
                                        readOnly
                                        className="txt txt-sekunder-color"
                                        type="text"
                                        value={data[3]}
                                    ></input>
                                </div>
                                <div className="margin-bottom-15px">
                                    <div className="margin-5px">
                                        <div className="txt-site txt-11 txt-main txt-bold">
                                            <h4>Loan Approval Date</h4>
                                        </div>
                                    </div>
                                    <input
                                        style={{ backgroundColor: "#E6E6E6" }}
                                        readOnly
                                        className="txt txt-sekunder-color"
                                        type="text"
                                        value={data[4]}
                                    ></input>
                                    {/* <CalendarPicker
                                        date={data[4]}
                                        disabled={type === 'detail' ? true : false}
                                        onChange={e => console.log(e)} /> */}
                                </div>
                                <div className="margin-bottom-15px">
                                    <div className="margin-5px">
                                        <div className="txt-site txt-11 txt-main txt-bold">
                                            <h4>Loan Reason</h4>
                                        </div>
                                    </div>
                                    <input
                                        style={{ backgroundColor: "#E6E6E6" }}
                                        readOnly
                                        className="txt txt-sekunder-color"
                                        type="text"
                                        value={data[5]}
                                    ></input>
                                </div>
                                <div className="margin-bottom-15px">
                                    <div className="margin-5px">
                                        <div className="txt-site txt-11 txt-main txt-bold">
                                            <h4>Loan Request Date</h4>
                                        </div>
                                    </div>
                                    <input
                                        style={{ backgroundColor: "#E6E6E6" }}
                                        readOnly
                                        className="txt txt-sekunder-color"
                                        type="text"
                                        value={data[6]}
                                    ></input>
                                    {/* <CalendarPicker
                                        date={data[6]}
                                        disabled={type === 'detail' ? true : false}
                                        onChange={e => console.log(e)} /> */}
                                </div>
                                <div className="margin-bottom-15px">
                                    <div className="margin-5px">
                                        <div className="txt-site txt-11 txt-main txt-bold">
                                            <h4>Loan Status</h4>
                                        </div>
                                    </div>
                                    <input
                                        style={{ backgroundColor: "#E6E6E6" }}
                                        readOnly
                                        className="txt txt-sekunder-color"
                                        type="text"
                                        value={data[7]}
                                    ></input>
                                </div>
                                <div className="margin-bottom-15px">
                                    <div className="margin-5px">
                                        <div className="txt-site txt-11 txt-main txt-bold">
                                            <h4>Loan Type</h4>
                                        </div>
                                    </div>
                                    <input
                                        style={{ backgroundColor: "#E6E6E6" }}
                                        readOnly
                                        className="txt txt-sekunder-color"
                                        type="text"
                                        value={data[8]}
                                    ></input>
                                </div>
                                <div className="margin-bottom-15px">
                                    <div className="margin-5px">
                                        <div className="txt-site txt-11 txt-main txt-bold">
                                            <h4>Record ID</h4>
                                        </div>
                                    </div>
                                    <input
                                        style={{ backgroundColor: "#E6E6E6" }}
                                        readOnly
                                        className="txt txt-sekunder-color"
                                        type="text"
                                        value={data[9]}
                                    ></input>
                                </div>
                                {/* <div className="margin-bottom-15px">
                                    <div className="margin-5px">
                                        <div className="txt-site txt-11 txt-main txt-bold">
                                            <h4>DSR</h4>
                                        </div>
                                    </div>
                                    <NumberFormat
                                        style={{ backgroundColor: type !== 'detail' ? null : "#E6E6E6" }}
                                        className="txt txt-sekunder-color"
                                        thousandSeparator={true}
                                        value={data[6]}
                                        required
                                        onValueChange={(e) =>
                                            e.formattedValue
                                            // this.setState({
                                            //     dataDetail: {
                                            //         ...dataDetail,
                                            //         plafond: e.formattedValue
                                            //     }
                                            // })
                                        } />
                                </div>
                                <div className="margin-bottom-15px">
                                    <div className="margin-5px">
                                        <div className="txt-site txt-11 txt-main txt-bold">
                                            <h4>Total Commitment</h4>
                                        </div>
                                    </div>
                                    <NumberFormat
                                        style={{ backgroundColor: type !== 'detail' ? null : "#E6E6E6" }}
                                        className="txt txt-sekunder-color"
                                        thousandSeparator={true}
                                        value={data[6]}
                                        required
                                        onValueChange={(e) =>
                                            e.formattedValue
                                            // this.setState({
                                            //     dataDetail: {
                                            //         ...dataDetail,
                                            //         plafond: e.formattedValue
                                            //     }
                                            // })
                                        } />
                                </div>
                                <div className="margin-bottom-15px">
                                    <div className="margin-5px">
                                        <div className="txt-site txt-11 txt-main txt-bold">
                                            <h4>Current Commitment</h4>
                                        </div>
                                    </div>
                                    <NumberFormat
                                        style={{ backgroundColor: type !== 'detail' ? null : "#E6E6E6" }}
                                        className="txt txt-sekunder-color"
                                        thousandSeparator={true}
                                        value={data[8]}
                                        required
                                        onValueChange={(e) =>
                                            e.formattedValue
                                            // this.setState({
                                            //     dataDetail: {
                                            //         ...dataDetail,
                                            //         plafond: e.formattedValue
                                            //     }
                                            // })
                                        } />
                                </div>
                                <div className="margin-bottom-15px">
                                    <div className="margin-5px">
                                        <div className="txt-site txt-11 txt-main txt-bold">
                                            <h4>Current Installment/Month</h4>
                                        </div>
                                    </div>
                                    <NumberFormat
                                        style={{ backgroundColor: type !== 'detail' ? null : "#E6E6E6" }}
                                        className="txt txt-sekunder-color"
                                        thousandSeparator={true}
                                        value={data[7]}
                                        required
                                        onValueChange={(e) =>
                                            e.formattedValue
                                            // this.setState({
                                            //     dataDetail: {
                                            //         ...dataDetail,
                                            //         plafond: e.formattedValue
                                            //     }
                                            // })
                                        } />
                                </div>
                                <div className="margin-bottom-15px">
                                    <div className="margin-5px">
                                        <div className="txt-site txt-11 txt-main txt-bold">
                                            <h4>Loan Type</h4>
                                        </div>
                                    </div>
                                    <DropDown
                                        title="-- please select sk reference --"
                                        onChange={dt => console.log(dt)}
                                        // type="bizpar"
                                        disabled={type === 'detail'}
                                        value={'1'}
                                        data={[{ id: "1", title: "PINJAMAN CICILAN MOTOR KARYAWAN", value: "1" }]}
                                    />
                                </div>
                                <div className="margin-bottom-15px">
                                    <div className="margin-5px">
                                        <div className="txt-site txt-11 txt-main txt-bold">
                                            <h4>Loan Ammount</h4>
                                        </div>
                                    </div>
                                    <NumberFormat
                                        style={{ backgroundColor: type !== 'detail' ? null : "#E6E6E6" }}
                                        className="txt txt-sekunder-color"
                                        thousandSeparator={true}
                                        value={data[8]}
                                        required
                                        onValueChange={(e) =>
                                            e.formattedValue
                                            // this.setState({
                                            //     dataDetail: {
                                            //         ...dataDetail,
                                            //         plafond: e.formattedValue
                                            //     }
                                            // })
                                        } />
                                </div> */}
                                <div className="padding-15px">
                                    <div className="grid">
                                        <div className="content-right">
                                            <button
                                                className="btn btn-primary"
                                                type="button"
                                                onClick={this.clResizePane}
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
            </div >
        )
    }

    render() {
        if (R.isNil(this.props.auth.user)) return <Redirect to={{ pathname: "/" }} ></Redirect>
        let { formDetailVisible, savePopUpVisible, saveOk, timeout, minSize, maxSize, allowResize, defaultSize, button, selectedIndex } = this.state
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
                                    <div className="padding-10px">
                                        <MuiThemeProvider theme={getMuiTheme()}>
                                            <MUIDataTable
                                                title='Loan'
                                                subtitle={'lorem ipsum dolor'}
                                                data={this.state.dataTable}
                                                columns={this.columns}
                                                options={options}
                                            />
                                        </MuiThemeProvider>
                                    </div>
                                </div>
                            )}
                            side={(
                                <div className="a-s-p-side">
                                    {formDetailVisible && this.renderDetail(this.state.button)}
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
                                onClick={() => this.openPopUp("ok")}
                            />
                        )}

                        {this.state.editVisible && (
                            <FormEditLoan
                                type={"update"}
                                onClickClose={() => this.openCloseCreate("edit")}
                                data={this.data}
                            />
                        )}

                        {this.state.viewVisible && (
                            <FormEditLoan
                                type={"view"}
                                onClickClose={() => this.openCloseCreate("view")}
                                data={this.data}
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

export default connect(mapStateToProps, mapDispatchToProps)(Loan)