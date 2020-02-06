import React, { Component } from 'react'
import M from 'moment'
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles"
import MUIDataTable from "mui-datatables-bitozen"
import FileViewer from 'react-file-viewer'
import DropDown from '../../../modules/popup/DropDown'
import CalendarPicker from '../../../modules/popup/Calendar'
import TimePicker from '../../../modules/popup/Time'
import ReactTooltip from 'react-tooltip'

var ct = require("../../../modules/custom/customTable")
const getMuiTheme = () => createMuiTheme(ct.customTable())
const options = ct.customOptions4()

class FormOvertimeGeneral extends Component {
    constructor(props) {
        super(props)
        this.state = {
            overtimeData: {
                ...props.overtimeData,
                overtimeDate: M(props.overtimeData.overtimeDate, "DD-MM-YYYY").format("YYYY-MM-DD")
            },
            formDocVisible: false,
            formReportVisible: false,
            fileType: "",
            reportType: "",
            docUrl: "",
            reportUrl: ""
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.overtimeData !== prevProps.overtimeData) {
            this.setState({
                overtimeData: {
                    ...this.props.overtimeData,
                    overtimeDate: M(this.props.overtimeData.overtimeDate, "DD-MM-YYYY").format("YYYY-MM-DD")
                }
            })
        }
    }

    openDocument(type) {
        if (type === "doc") return this.setState({ formDocVisible: !this.state.formDocVisible })
        if (type === "report") return this.setState({ formReportVisible: !this.state.formReportVisible })
    }

    async getDocument() {
        let { overtimeData } = this.state
        let length = overtimeData.overtimeDocumentURL.split(".").length
        let response = await fetch(process.env.REACT_APP_HCIS_BE_API + 'tmcmd/api/overtime.document.get/' + overtimeData.overtimeID, {
            headers: {
                'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiJ9.5BG9SEVOGo_xRhtT8IkyoSy60kPg8HM9Vpvb0TdNew4'
            }
        })
        response = await response.blob()
        if (response.size > 0) {
            response = URL.createObjectURL(response)
            this.setState({
                docUrl: response,
                fileType: overtimeData.overtimeDocumentURL.split(".")[length - 1],
                formDocVisible: !this.state.formDocVisible
            });
        } else {
            alert("Failed: Document Not Found")
        }
    }

    async getReport(type) {
        let { overtimeData } = this.state
        let response = await fetch(process.env.REACT_APP_HCIS_BE_API + 'report/po/overtime/' + overtimeData.overtimeID, {
            headers: {
                'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiJ9.5BG9SEVOGo_xRhtT8IkyoSy60kPg8HM9Vpvb0TdNew4'
            }
        })
        response = await response.blob()
        if (response.size > 0) {
            response = URL.createObjectURL(response)
            if (type === "download") return window.open(response)
            else
                this.setState({
                    reportUrl: response,
                    reportType: "pdf",
                    formReportVisible: !this.state.formReportVisible
                });
        } else {
            alert("Failed: Report Not Found")
        }
    }

    columns = [
        "Document",
        {
            name: "Action",
            options: {
                customBodyRender: () => {
                    return (
                        <div>
                            <button
                                type="button"
                                className="btnAct"
                                onClick={() => this.getDocument()}
                            >
                                <i className="fas fa-lw fa-print" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }} />
                            </button>
                        </div>
                    );
                }
            }
        }
    ]

    data = []

    renderDocument = (type) => {
        return (
            <div className="app-popup app-popup-show">
                <div className="padding-top-20px" />
                <div className= {type === "doc" ? "popup-content-small background-white border-radius" : "popup-content background-white border-radius"}>
                    <div className="popup-panel grid grid-2x">
                        <div className="col-1">
                            <div className="popup-title">
                                {type === "doc" ? "Document Viewer" : "Report Viewer"}
                            </div>
                        </div>
                        {type === "report" ?
                            <div className="col-2 content-right">
                                <button className="btn btn-circle btn-grey" style={{ backgroundColor: "transparent" }} type="button" onClick={() => this.getReport("download")}>
                                    <i className="fa fa-lg fa-download" />
                                </button>
                            </div> : <div className="col-2 content-right">
                                <button
                                    className="btn btn-circle btn-grey"
                                    onClick={type === "doc" ? this.openDocument.bind(this, "doc") : this.openDocument.bind(this, "report")}
                                >
                                    <i className="fa fa-lg fa-times" />
                                </button>
                            </div>}
                    </div>
                    <div style={{ textAlign: "center", height: this.state.fileType === 'xlsx' ? '1000px' : null }}>
                        {this.state.fileType === "jpg" ||
                            this.state.fileType === "png" ||
                            this.state.fileType === "jpeg" ? (
                                <img src={this.state.docUrl} width={"50%"} alt="" />
                            ) : (
                                <FileViewer
                                    fileType={type === "doc" ? this.state.fileType : this.state.reportType}
                                    filePath={type === "doc" ? this.state.docUrl : this.state.reportUrl} />
                            )}
                    </div>
                    <div className="padding-15px background-grey">
                        <div className="grid margin-top-15px">
                            <div className="content-right">
                                <button
                                    style={{ marginLeft: "15px" }}
                                    className="btn btn-primary"
                                    type="button"
                                    onClick={type === "doc" ? this.openDocument.bind(this, "doc") : this.openDocument.bind(this, "report")}
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
        let { overtimeData } = this.state
        let dataTable = []
        dataTable.push([overtimeData.overtimeDocumentURL && overtimeData.overtimeDocumentURL.split("document/document_overtime/")])
        return (
            <div className="a-s-p-place active">
                <div className="a-s-p-top">
                    <div className="grid grid-2x">
                        <div className="col-1">
                            <div className="display-flex-normal margin-top-10px">
                                <i className="fa fa-1x fa-user-clock"></i>
                                <span className="txt-site txt-11 txt-main margin-left-10px">
                                    Overtime Detail
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
                <div className="a-s-p-mid a-s-p-pad border-top">
                    <div className="display-flex-normals margin-bottom-10px">
                        <div className="padding-top-15px padding-bottom-15px">
                            <div className="col-2 content-right">
                                <button className="btnAct" type="button" onClick={() => this.getReport("view")}>
                                    <i className="fa fa-lg fa-print" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }} />
                                </button>
                            </div>
                            <div className="margin-bottom-20px">
                                <div className="margin-5px">
                                    <div className="txt-site txt-11 txt-main txt-bold">
                                        <h4> Current Date & Time </h4>
                                    </div>
                                </div>
                                <CalendarPicker disabled date={overtimeData ? overtimeData.overtimeDate : "DD-MM-YYYY"} />
                            </div>
                            <div className="margin-bottom-20px">
                                <div className="margin-5px">
                                    <div className="txt-site txt-11 txt-main txt-bold">
                                        <h4> {"Start Time"} </h4>
                                    </div>
                                </div>
                                <TimePicker disabled time={overtimeData ? M(overtimeData.overtimeStartDate, "DD-MM-YYYY HH:mm:ss").format("HH:mm") : ""} />
                            </div>
                            <div className="margin-bottom-20px">
                                <div className="margin-5px">
                                    <div className="txt-site txt-11 txt-main txt-bold">
                                        <h4> {"End Time"} </h4>
                                    </div>
                                </div>
                                <TimePicker disabled time={overtimeData ? M(overtimeData.overtimeEndDate, "DD-MM-YYYY HH:mm:ss").format("HH:mm") : ""} />
                            </div>
                            <div className="margin-bottom-20px">
                                <div className="margin-5px">
                                    <div className="txt-site txt-11 txt-main txt-bold">
                                        <h4> {"Employee Name"} </h4>
                                    </div>
                                </div>
                                <input
                                    type="text"
                                    readOnly
                                    style={{ backgroundColor: "#E6E6E6" }}
                                    className="txt txt-sekunder-color"
                                    value={overtimeData && overtimeData.employee ? overtimeData.employee.employeeName : ""}
                                />
                            </div>
                            <div className="margin-bottom-20px">
                                <div className="margin-5px">
                                    <div className="txt-site txt-11 txt-main txt-bold">
                                        <h4> {"NIK"} </h4>
                                    </div>
                                </div>
                                <input
                                    type="text"
                                    readOnly
                                    style={{ backgroundColor: "#E6E6E6" }}
                                    className="txt txt-sekunder-color"
                                    value={overtimeData && overtimeData.employee ? overtimeData.employee.employeeID : ""}
                                />
                            </div>
                            <div className="margin-bottom-20px">
                                <div className="margin-5px">
                                    <div className="txt-site txt-11 txt-main txt-bold">
                                        <h4> {"Head Employee Name"} </h4>
                                    </div>
                                </div>
                                <input
                                    type="text"
                                    readOnly
                                    style={{ backgroundColor: "#E6E6E6" }}
                                    className="txt txt-sekunder-color"
                                    value={overtimeData && overtimeData.approvalManagers && overtimeData.approvalManagers.length > 0 ? overtimeData.approvalManagers[0].employeeName : ""}
                                />
                            </div>
                            <div className="margin-bottom-20px">
                                <div className="margin-5px">
                                    <div className="txt-site txt-11 txt-main txt-bold">
                                        <h4> {"Overtime Type"} </h4>
                                    </div>
                                </div>
                                <DropDown title={overtimeData && overtimeData.overtimeType ? overtimeData.overtimeType.corporateOvertimeName : "-"} bizValue={overtimeData && overtimeData.overtimeType ? overtimeData.overtimeType.corporateOvertimeName : "-"} disabled />
                            </div>
                            <div className="margin-bottom-20px">
                                <div className="margin-5px">
                                    <div className="txt-site txt-11 txt-main txt-bold">
                                        <h4> {"Reason"} </h4>
                                    </div>
                                </div>
                                <textarea
                                    className="txt txt-sekunder-color"
                                    rows={5}
                                    style={{ backgroundColor: "#E6E6E6" }}
                                    value={overtimeData ? overtimeData.overtimeNotes : ""}
                                    readOnly>
                                </textarea>
                            </div>
                            <div className="margin-bottom-20px">
                                <div className="margin-5px">
                                    <MuiThemeProvider theme={getMuiTheme()}>
                                        <MUIDataTable
                                            title='Document'
                                            subtitle={"lorem ipsum dolor"}
                                            data={overtimeData.overtimeDocumentURL === "" ? this.data : dataTable}
                                            columns={this.columns}
                                            options={options}
                                        />
                                    </MuiThemeProvider>
                                </div>
                            </div>

                            <div className="border-top padding-top-20px">
                                <div className="grid grid-2x">
                                    <div className="col-1" />
                                    <div className="col-2 content-right">
                                        <button style={{ marginLeft: "15px" }} className="btn btn-primary" type="button" onClick={this.props.closeSlide}>
                                            <span>CLOSE</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div >

                <ReactTooltip />

                {this.state.formDocVisible ? this.renderDocument("doc") : null}
                {this.state.formReportVisible ? this.renderDocument("report") : null}

            </div >
        )
    }
}

export default FormOvertimeGeneral
