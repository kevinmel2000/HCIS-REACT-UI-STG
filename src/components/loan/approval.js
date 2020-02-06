import React, { Component } from 'react'
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles'
import MUIDataTable from "mui-datatables-bitozen"
import PopUp from '../pages/PopUpAlert'
import LoadingBar from "react-top-loading-bar"
import ResizeSlider from '../../modules/resize/Slider'
import SplitPaneSecond from 'react-split-pane'
import { Redirect } from 'react-router-dom'
import * as R from 'ramda'
import { connect } from 'react-redux'
import AuthAction from '../../Redux/AuthRedux'
import IdleTimer from 'react-idle-timer'
import CalendarPicker from '../../modules/popup/Calendar'
import DropDown from '../../modules/popup/DropDown'
import NumberFormat from 'react-number-format'

var ct = require("../../modules/custom/customTable")
const getMuiTheme = () => createMuiTheme(ct.customTable())
const options = ct.customOptions()
const bizpar = [
    { bizparKey: 1, bizparValue: ' Pinjaman Cicilan Motor Karyawan Golongan IV' }
]

class Approval extends Component {
    constructor(props) {
        super(props)
        this.state = {
            formRescheduleVisible: false,
            savePopUpVisible: false,
            saveOk: false,
            button: "",
            data: [],
            allowResize: false,
            defaultSize: 0,
            minSize: 0,
            maxSize: 0,
            timeout: 1000 * 100 * 9,
            isTimedOut: false
        }
        this.idleTimer = null
    }

    componentDidMount() {
        if (!R.isNil(this.props.auth.user)) {
            this.onFinishFetch()
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
                    data: this.data[selectedIndex],
                })
                break
            default:
                break
        }

    }

    columns = [
        "No",
        "Employee Id",
        "Employee Name",
        "Loan Request Date ",
        "Loan Type",
        {
            name: "Action",
            options: {
                customBodyRender: (val, tableMeta) => {
                    return (
                        <div>
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

    data = [
        ["1", "32331900", "John Doe", "02-JAN-2020", "Pinjaman Cicilan Motor Karyawan Golongan IV"],
        ["2", "32331853", "Sarah McClane", "03-JAN-2020", "Pinjaman Cicilan Motor Karyawan Golongan II"]
    ]

    openPopUp = (type, button) => {
        switch (type) {
            case "save":
                this.setState({ savePopUpVisible: !this.state.savePopUpVisible, button })
                break
            case "reason":
                this.setState({ reasonVisible: !this.state.reasonVisible })
                break
            case "ok":
                this.setState({ reasonVisible: false, savePopUpVisible: false, saveOk: !this.state.saveOk })
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
                        <div className="col-1" style={{ width: "140%" }}>
                            <div className="display-flex-normal margin-top-10px">
                                <i className="fa fa-1x fa-envelope"></i>
                                <span className="txt-site txt-11 txt-main margin-left-10px">
                                    Loan Request Detail
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
                {/* <div className="a-s-p-top">
                    <div className="grid grid-2x">
                        <div className="col-1">
                            <div className="display-flex-normal margin-top-10px">
                                <i className="fa fa-1x fa-file-invoice-dollar"></i>
                                <span className="txt-site txt-11 txt-main margin-left-10px">
                                    Loan Request Detail
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
                </div> */}
                <form action="#">
                    <div className="a-s-p-mid a-s-p-pad border-top">
                        <div className="display-flex-normals margin-bottom-10px">
                            <div style={{ paddingRight: 20, paddingLeft: 20 }}>
                                <div
                                    style={{ width: '100%', paddingTop: 20 }}
                                >
                                    <button
                                        type='button'
                                        // onClick={() => this.state.data.taskName === 'MPP APPROVAL' ? this.openReportMpp(this.state.data.variables.TASK_REFNO) : null}
                                        // onClick={() => this.openReportMpp(this.state.data.variables.TASK_REFNO)}
                                        style={{
                                            borderRadius: 20,
                                            padding: 10,
                                            width: '100%'
                                        }}
                                        className="btn btn-blue">
                                        {'L-1579665940890'}
                                    </button>
                                </div>
                                <div style={{ paddingTop: 10, textAlign: 'center' }}>
                                    <span style={{ paddingTop: 10 }}>
                                        {'Loan Number'}
                                    </span>
                                </div>
                            </div>
                            <div className="padding-top-15px padding-bottom-15px">
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
                                        placeholder={"32331900"}
                                        value={data[1]}
                                    ></input>
                                </div>
                                <div className="margin-bottom-15px">
                                    <div className="margin-5px">
                                        <div className="txt-site txt-11 txt-main txt-bold">
                                            <h4>Loan Request Date </h4>
                                        </div>
                                    </div>
                                    <CalendarPicker disabled date={'02-01-2019'} onChange={(e) => console.log(e)} />
                                </div>
                                <div className="margin-bottom-15px">
                                    <div className="margin-5px">
                                        <div className="txt-site txt-11 txt-main txt-bold">
                                            <h4>Loan Type</h4>
                                        </div>
                                    </div>
                                    <DropDown
                                        // style={{ backgroundColor: "#E6E6E6" }}
                                        // readOnly
                                        disabled
                                        title='-- please select loan type --'
                                        type='bizpar'
                                        value={1}
                                        data={bizpar}
                                        onChange={(e) => console.log(e)} />
                                </div>
                                <div className="margin-bottom-15px">
                                    <div className="margin-5px">
                                        <div className="txt-site txt-11 txt-main txt-bold">
                                            <h4>Loan Interest</h4>
                                        </div>
                                    </div>
                                    <input
                                        style={{ backgroundColor: "#E6E6E6" }}
                                        readOnly
                                        className="txt txt-sekunder-color"
                                        type="text"
                                        placeholder={"3.5"}
                                    // value={data[4]}
                                    ></input>
                                </div>
                                <div className="margin-bottom-15px">
                                    <div className="margin-5px">
                                        <div className="txt-site txt-11 txt-main txt-bold">
                                            <h4>Loan Amount</h4>
                                        </div>
                                    </div>
                                    <NumberFormat
                                        style={{ backgroundColor: "#E6E6E6" }}
                                        className="txt txt-sekunder-color"
                                        thousandSeparator={true}
                                        value={'15000000'}
                                        required
                                        onValueChange={(e) =>
                                            e.formattedValue
                                        } />
                                </div>
                                <div className="margin-bottom-15px">
                                    <div className="margin-5px">
                                        <div className="txt-site txt-11 txt-main txt-bold">
                                            <h4>Tenor</h4>
                                        </div>
                                    </div>
                                    <input
                                        style={{ backgroundColor: "#E6E6E6" }}
                                        readOnly
                                        className="txt txt-sekunder-color"
                                        type="text"
                                        placeholder={"12"}
                                    // value={data[4]}
                                    ></input>
                                </div>
                                <div className="margin-bottom-15px">
                                    <div className="margin-5px">
                                        <div className="txt-site txt-11 txt-main txt-bold">
                                            <h4>Angsuran</h4>
                                        </div>
                                    </div>
                                    <NumberFormat
                                        style={{ backgroundColor: "#E6E6E6" }}
                                        className="txt txt-sekunder-color"
                                        thousandSeparator={true}
                                        value={"1293750"}
                                        required
                                        onValueChange={(e) =>
                                            e.formattedValue
                                        } />
                                </div>
                                <div className="padding-15px">
                                    <div className="grid">
                                        <div className="content-right">
                                            <button
                                                className="btn btn-blue"
                                                type="button"
                                                onClick={() => this.openPopUp("ok")}
                                            >
                                                <span>APPROVE</span>
                                            </button>
                                            <button
                                                style={{ marginLeft: "15px" }}
                                                className="btn btn-red"
                                                type="button"
                                                // onClick={() => this.openPopUp("ok")}
                                                onClick={() => this.openPopUp('reason')}
                                            >
                                                <span>REJECT</span>
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

    renderReason = () => {
        return (
            <div className="app-popup app-popup-show">
                <div className="padding-top-20px" />
                <div className="popup-content-mikro background-white border-radius">
                    <div className="popup-panel grid grid-2x">
                        <div className="col-1">
                            <div className="popup-title">
                                {'Reject Reason'}
                            </div>
                        </div>
                        <div className="col-2 content-right">
                            <button
                                className="btn btn-circle btn-grey"
                                onClick={() => this.openPopUp('reason')}
                            >
                                <i className="fa fa-lg fa-times" />
                            </button>
                        </div>
                    </div>
                    <div className="padding-15px">
                        <form action="#">
                            <div className="display-flex-normals">
                                <div className="padding-bottom-15px">
                                    <div className="margin-bottom-15px">
                                        <div className="margin-5px">
                                            <div className="txt-site txt-11 txt-main txt-bold">
                                                <h4>Reason</h4>
                                            </div>
                                        </div>
                                        <textarea
                                            className="txt txt-sekunder-color"
                                            type="text"
                                        // placeholder={"Loan Type"}
                                        // value={data[1]}
                                        ></textarea >
                                    </div>
                                </div>
                                <div className="padding-15px">
                                    <div className="grid">
                                        <div className="content-right">
                                            <button
                                                className="btn btn-blue"
                                                type="button"
                                                onClick={() => this.openPopUp("ok")}
                                            >
                                                <span>SUBMIT</span>
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
        let { reasonVisible, formDetailVisible, savePopUpVisible, saveOk, timeout, minSize, maxSize, allowResize, defaultSize, button, selectedIndex } = this.state
        return (
            <div>

                {this.renderDetail()}
            </div>
            // <SplitPaneSecond
            //     split="vertical"
            //     defaultSize={0}
            //     minSize={0}
            //     maxSize={0}
            //     primary="first"
            //     className="main-slider"
            //     style={{ height: 'calc(100vh - 50px)' }}>
            //     <div className="col-1 backgorund-white"></div>
            //     <div className="col-2 background-white">
            //         <IdleTimer
            //             ref={ref => { this.idleTimer = ref }}
            //             element={document}
            //             onActive={this.onActive.bind(this)}
            //             onIdle={this.onIdle.bind(this)}
            //             onAction={this.onAction.bind(this)}
            //             debounce={250}
            //             timeout={timeout} />
            //         <div>
            //             <ResizeSlider
            //                 allowResize={allowResize}
            //                 defaultSize={defaultSize}
            //                 minSize={minSize}
            //                 maxSize={maxSize}
            //                 main={(
            //                     <div className='a-s-p-mid no-header'>
            //                         <LoadingBar onRef={ref => (this.LoadingBar = ref)} />
            //                         <div className="padding-10px">
            //                             <MuiThemeProvider theme={getMuiTheme()}>
            //                                 <MUIDataTable
            //                                     title='Loan Approval'
            //                                     subtitle={'lorem ipsum dolor'}
            //                                     data={this.data}
            //                                     columns={this.columns}
            //                                     options={options}
            //                                 />
            //                             </MuiThemeProvider>
            //                         </div>
            //                     </div>
            //                 )}
            //                 side={(
            //                     <div className="a-s-p-side">
            //                         {formDetailVisible && this.renderDetail(this.state.button)}
            //                     </div>
            //                 )}
            //             />
            //             {reasonVisible && this.renderReason()}
            //             {savePopUpVisible && (
            //                 <PopUp
            //                     type={"simpan"}
            //                     class={"app-popup app-popup-show"}
            //                     onClick={() => this.openPopUp("save")}
            //                     onClickSimpan={button === "decline" ? this.opSidePage("slide-decline", selectedIndex) : button === "change" ? this.opSidePage("slide-reschedule", selectedIndex) : () => this.openPopUp("ok")}
            //                 />
            //             )}

            //             {saveOk && (
            //                 <PopUp
            //                     type={"save"}
            //                     class={"app-popup app-popup-show"}
            //                     onClick={() => this.openPopUp("ok")}
            //                 />
            //             )}
            //         </div>
            //     </div>
            // </SplitPaneSecond>

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

export default connect(mapStateToProps, mapDispatchToProps)(Approval)