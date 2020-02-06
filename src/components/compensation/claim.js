import React, { Component } from 'react'
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles'
import MUIDataTable from "mui-datatables-bitozen"
import LoadingBar from "react-top-loading-bar"
import { Redirect } from 'react-router-dom'
import SplitPaneSecond from 'react-split-pane'
import IdleTimer from 'react-idle-timer'
import { connect } from 'react-redux'
import AuthAction from '../../Redux/AuthRedux'
import ResizeSlider from '../../modules/resize/Slider'
import Api from '../../Services/Api'
import NumberFormat from 'react-number-format'
import M from 'moment'
import * as R from 'ramda'
import FileViewer from 'react-file-viewer'

var ct = require("../../modules/custom/customTable")
const getMuiTheme = () => createMuiTheme(ct.customTable())
const options = ct.customOptions()
const options5 = ct.customOptions5()

class Claim extends Component {
    constructor() {
        super()
        this.state = {
            allowResize: false,
            defaultSize: 0,
            minSize: 0,
            maxSize: 0,
            timeout: 1000 * 100 * 9,
            isTimedOut: false,
            formDetailVisible: false,
            formDocVisible: false,
            selectedIndex: null,
            rawData: [],
            dataTable: [],
            dataTableDetail: []
        }
        this.idleTimer = null
    }

    componentDidMount() {
        if (!R.isNil(this.props.auth.user)) {
            this.startFetch()
            this.getData()
        }
    }

    async getData() {
        let payload = {
            "limit": 100,
            "offset": 0
        }
        let response = await Api.create("CNB_QUERY").getAllClaim(payload)
        if (response.data && response.data.status === "S") {
            this.onFinishFetch()
            let dataTable = response.data.data.map((value, index) => {
                if (value === null) return []
                const { claimID, claimDate, employee, claimType, claimStatus, claimBudget, claimValue, claimDescription } = value
                return [
                    index += 1,
                    claimID,
                    claimDate,
                    employee ? employee.employeeID : "-",
                    claimType ? claimType.bizparValue : "-",
                    claimStatus.replace(/_/g, " "),
                    claimBudget,
                    claimValue,
                    claimBudget - claimValue,
                    claimDescription
                ]
            })
            this.setState({ rawData: response.data.data, dataTable })
        } else {
            this.onFinishFetch()
            if (response.data && response.data.message) return alert("Failed: " + response.data.message)
            else return alert("Failed: ", response.message)
        }
    }

    async getDocument() {
        let { rawData, selectedIndex } = this.state
        let claimID = rawData[selectedIndex].claimID
        let length = rawData[selectedIndex].claimURL.split(".").length
        let response = await fetch(process.env.REACT_APP_HCIS_BE_API + 'cnbcmd/api/claim.document.get/' + claimID, {
            headers: {
                'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiJ9.5BG9SEVOGo_xRhtT8IkyoSy60kPg8HM9Vpvb0TdNew4'
            }
        })
        response = await response.blob()
        if (response.size > 0) {
            response = URL.createObjectURL(response)
            this.setState({
                docUrl: response,
                fileType: rawData[selectedIndex].claimURL.split(".")[length - 1],
                formDocVisible: !this.state.formDocVisible
            });
        } else {
            alert("Failed: Document Not Found")
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

    openDocument = () => {
        this.setState({ formDocVisible: false })
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
            allowResize: false,
            defaultSize: 0,
            minSize: 0,
            maxSize: 0
        })
    }

    opSidePage = (menu, selectedIndex) => (e) => {
        this.setState({
            formDetailVisible: false,
            selectedIndex
        })

        this.opResizePane()

        switch (menu) {
            case 'slide-claim':
                let { rawData } = this.state
                let dataTableDetail = []
                dataTableDetail.push([
                    rawData[selectedIndex].claimBudget,
                    rawData[selectedIndex].claimValue,
                    rawData[selectedIndex].claimBudget - rawData[selectedIndex].claimValue,
                    rawData[selectedIndex].claimDescription
                ])
                this.setState({
                    formDetailVisible: true,
                    selectedIndex,
                    dataTableDetail
                })
                break;
            default:
                break
        }
    }

    columns = [
        "No",
        "C&B ID",
        "Date & Time",
        "Employee ID",
        "Claim Type",
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
                        val === "APPROVED" ? "brown" : val === "INITIATE" ? "orange" : val === "REJECTED" ? "#424242" : "gray",
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
            name: "Budget",
            options: {
                customBodyRender: (val) => {
                    return (
                        <div>
                            <NumberFormat
                                displayType={"text"}
                                thousandSeparator={true}
                                prefix={"Rp "}
                                value={val}
                                renderText={value => value + ",00 "}
                            />
                        </div>
                    )
                }
            }
        },
        {
            name: "Claim",
            options: {
                customBodyRender: (val) => {
                    return (
                        <div>
                            <NumberFormat
                                displayType={"text"}
                                thousandSeparator={true}
                                prefix={"Rp "}
                                value={val}
                                renderText={value => value + ",00 "}
                            />
                        </div>
                    )
                }
            }
        },
        {
            name: "Remaining Budget",
            options: {
                customBodyRender: (val) => {
                    return (
                        <div>
                            <NumberFormat
                                displayType={"text"}
                                thousandSeparator={true}
                                prefix={"Rp "}
                                value={val}
                                renderText={value => value + ",00 "}
                            />
                        </div>
                    )
                }
            }
        },
        "Description",
        {
            name: "Detail",
            options: {
                customBodyRender: (val, tableMeta) => {
                    return (
                        <div>
                            <button
                                onClick={this.opSidePage("slide-claim", tableMeta.rowIndex)}
                                className="btnAct">
                                <i className="fa fa-lw fa-ellipsis-v" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }} />
                            </button>
                        </div>
                    )
                }
            }
        },
    ]

    columnsDetail = [
        {
            name: "Budget",
            options: {
                customBodyRender: (val) => {
                    return (
                        <div>
                            <NumberFormat
                                displayType={"text"}
                                thousandSeparator={true}
                                prefix={"Rp "}
                                value={val}
                                renderText={value => value + ",00 "}
                            />
                        </div>
                    )
                }
            }
        },
        {
            name: "Claim",
            options: {
                customBodyRender: (val) => {
                    return (
                        <div>
                            <NumberFormat
                                displayType={"text"}
                                thousandSeparator={true}
                                prefix={"Rp "}
                                value={val}
                                renderText={value => value + ",00 "}
                            />
                        </div>
                    )
                }
            }
        },
        {
            name: "Remaining Budget",
            options: {
                customBodyRender: (val) => {
                    return (
                        <div>
                            <NumberFormat
                                displayType={"text"}
                                thousandSeparator={true}
                                prefix={"Rp "}
                                value={val}
                                renderText={value => value + ",00 "}
                            />
                        </div>
                    )
                }
            }
        },
        "Description",
        {
            name: "Document",
            options: {
                customBodyRender: () => {
                    return (
                        <div>
                            <button
                                type="button"
                                onClick={() => this.getDocument()}
                                className="btnAct">
                                <i className="fa fa-lw fa-print" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }} />
                            </button>
                        </div>
                    )
                }
            }
        }
    ]

    renderDetail() {
        let { rawData, selectedIndex } = this.state
        return (
            <div className="a-s-p-place active">
                <div className="a-s-p-top">
                    <div className="grid grid-2x">
                        <div className="col-1">
                            <div className="display-flex-normal margin-top-10px">
                                <i className="fa fa-lw fa-database"></i>
                                <span className="txt-site txt-11 txt-main margin-left-10px">
                                    C&B - Detail Form
                                </span>
                            </div>
                        </div>
                        <div className="col-2 content-right">
                            <button className="btn btn-circle btn-grey" onClick={this.clResizePane}>
                                <i className="fa fa-lg fa-arrow-right" />
                            </button>
                        </div>
                    </div>
                </div>
                <form action="#">
                    <div className="a-s-p-mid a-s-p-pad border-top">
                        <div className="display-flex-normals margin-bottom-10px">
                            <div className="padding-top-15px padding-bottom-15px">
                                <div className="margin-bottom-20px">
                                    <div className="margin-5px">
                                        <div className="txt-site txt-11 txt-main txt-bold">
                                            <h4>C&B ID</h4>
                                        </div>
                                    </div>
                                    <input
                                        style={{ backgroundColor: '#E6E6E6' }}
                                        className="txt txt-sekunder-color"
                                        type="text"
                                        placeholder=""
                                        value={rawData[selectedIndex].claimID}
                                        disabled
                                    ></input>
                                </div>
                                <div className="margin-bottom-20px">
                                    <div className="margin-5px">
                                        <div className="txt-site txt-11 txt-main txt-bold">
                                            <h4>Date</h4>
                                        </div>
                                    </div>
                                    <input
                                        style={{ backgroundColor: '#E6E6E6' }}
                                        className="txt txt-sekunder-color"
                                        type="text"
                                        placeholder=""
                                        value={M(rawData[selectedIndex].claimDate, "DD-MM-YYYY HH:mm:ss").format("DD-MM-YYYY")}
                                        disabled
                                    ></input>
                                </div>
                                <div className="margin-bottom-20px">
                                    <div className="margin-5px">
                                        <div className="txt-site txt-11 txt-main txt-bold">
                                            <h4>Time</h4>
                                        </div>
                                    </div>
                                    <input
                                        style={{ backgroundColor: '#E6E6E6' }}
                                        className="txt txt-sekunder-color"
                                        type="text"
                                        placeholder=""
                                        value={M(rawData[selectedIndex].claimDate, "DD-MM-YYYY HH:mm:ss").format("HH:mm:ss")}
                                        disabled
                                    ></input>
                                </div>
                                <div className="margin-bottom-20px">
                                    <div className="margin-5px">
                                        <div className="txt-site txt-11 txt-main txt-bold">
                                            <h4>NIK</h4>
                                        </div>
                                    </div>
                                    <input
                                        style={{ backgroundColor: '#E6E6E6' }}
                                        className="txt txt-sekunder-color"
                                        type="text"
                                        placeholder=""
                                        value={rawData[selectedIndex].employee ? rawData[selectedIndex].employee.employeeID : "-" }
                                        disabled
                                    ></input>
                                </div>
                                <div className="margin-bottom-20px">
                                    <div className="margin-5px">
                                        <div className="txt-site txt-11 txt-main txt-bold">
                                            <h4>Employee Name</h4>
                                        </div>
                                    </div>
                                    <input
                                        style={{ backgroundColor: '#E6E6E6' }}
                                        className="txt txt-sekunder-color"
                                        type="text"
                                        placeholder=""
                                        value={rawData[selectedIndex].employee ? rawData[selectedIndex].employee.employeeName : "-" }
                                        disabled
                                    ></input>
                                </div>
                                <div className="margin-bottom-20px">
                                    <div className="margin-5px">
                                        <div className="txt-site txt-11 txt-main txt-bold">
                                            <h4>Claim Type</h4>
                                        </div>
                                    </div>
                                    <input
                                        style={{ backgroundColor: '#E6E6E6' }}
                                        className="txt txt-sekunder-color"
                                        type="text"
                                        placeholder=""
                                        value={rawData[selectedIndex].claimType.bizparValue}
                                        disabled
                                    ></input>
                                </div>

                                <div className="padding-10px">
                                    <MuiThemeProvider theme={getMuiTheme()}>
                                        <MUIDataTable
                                            title='Detail Budget'
                                            subtitle={"lorem ipsum dolor"}
                                            data={this.state.dataTableDetail}
                                            columns={this.columnsDetail}
                                            options={options5}
                                        />
                                    </MuiThemeProvider>
                                </div>

                            </div>
                        </div>
                    </div>
                </form>
                {this.state.formDocVisible ? this.renderDocument() : null}
            </div>
        )
    }

    renderDocument = () => {
        return (
            <div className="app-popup app-popup-show">
                <div className="padding-top-20px" />
                <div className={"popup-content-small background-white border-radius"}>
                    <div className="popup-panel grid grid-2x">
                        <div className="col-1">
                            <div className="popup-title">
                                {"Document Viewer"}
                            </div>
                        </div>
                        <div className="col-2 content-right">
                            <button
                                className="btn btn-circle btn-grey"
                                onClick={this.openDocument.bind(this)}
                            >
                                <i className="fa fa-lg fa-times" />
                            </button>
                        </div>
                    </div>
                    <div style={{ textAlign: "center", height: this.state.fileType === 'xlsx' ? '1000px' : null }}>
                        {this.state.fileType === "jpg" ||
                            this.state.fileType === "png" ||
                            this.state.fileType === "jpeg" ? (
                                <img src={this.state.docUrl} width={"50%"} alt="" />
                            ) : (
                                <FileViewer
                                    fileType={this.state.fileType}
                                    filePath={this.state.docUrl} />
                            )}
                    </div>
                    <div className="padding-15px background-grey">
                        <div className="grid margin-top-15px">
                            <div className="content-right">
                                <button
                                    style={{ marginLeft: "15px" }}
                                    className="btn btn-primary"
                                    type="button"
                                    onClick={this.openDocument.bind(this)}
                                >
                                    <span>CLOSE</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="margin-bottom-15px"></div>
            </div>
        )
    }

    render() {
        if (R.isNil(this.props.auth.user)) return <Redirect to={{ pathname: "/" }} ></Redirect>
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
                                <div className='a-s-p-mid no-header'>
                                    <LoadingBar onRef={ref => (this.LoadingBar = ref)} />
                                    <div className="padding-10px">
                                        <MuiThemeProvider theme={getMuiTheme()}>
                                            <MUIDataTable
                                                title='C&B'
                                                subtitle={"lorem ipsum dolor"}
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
                                    {this.state.formDetailVisible && this.renderDetail()}
                                </div>
                            )}
                        />
                    </div>
                </div>
            </SplitPaneSecond>
        )
    }
}

const mapStateToProps = state => {
    return {
        auth: state.auth
    }
}

const mapDispatchToProps = dispatch => {
    return {
        authLogout: () => dispatch(AuthAction.authLogout())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Claim)