import React, { Component } from 'react'
import NumberFormat from 'react-number-format'
import { PDFReader } from 'reactjs-pdf-reader';

class FormReport extends Component {
    constructor(props) {
        super(props)
        this.state = {
            report: "",
            types: props.url.type
        }
    }
    renderHeader = () => (
        <div className="popup-panel grid grid-2x">
            <div className="col-1" style={{ width: "140%" }}>
                <div className="popup-title">
                    {this.props.taskName === 'CLAIM APPROVAL' || this.props.taskName === 'CLAIM RESUBMIT' ? 'C & B Form - ' : 'Report - '} {this.props.id}
                </div>
            </div>
            <div className="col-2 content-right">
                <button
                    className="btn btn-circle btn-grey"
                    onClick={() => this.props.type === 'RecRequest' ? this.downloadReportR(this.props.id) : this.props.taskName === 'CLAIM APPROVAL' || this.props.taskName === 'CLAIM RESUBMIT' ? this.reportClaim() : this.downloadReport(this.props.id)}
                >
                    <i className={this.props.taskName === 'CLAIM APPROVAL' || this.props.taskName === 'CLAIM RESUBMIT' ? "fa fa-lg fa-print" : "fa fa-lg fa-download"} style={{ color: "#000" }} />
                </button>
            </div>
        </div>
    )

    async downloadReportR(value) {
        let url = process.env.REACT_APP_HCIS_BE_API + 'report/po/recruitment.request.by.recruitment.id/'
        let res = await fetch(url + value, {
            headers: {
                'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiJ9.5BG9SEVOGo_xRhtT8IkyoSy60kPg8HM9Vpvb0TdNew4',
                'Content-Type': 'application/pdf',
            }
        })
        res = await res.blob()
        console.log(res)
        if (res.size > 0 && res.type === 'application/pdf') {
            res = URL.createObjectURL(res);
            window.open(res)
        }
    }

    async downloadReport(value) {
        let type = this.props.taskName
        let url = (
            type === 'MPP APPROVAL' ? process.env.REACT_APP_HCIS_BE_API + 'report/po/mpp/' :
                type === 'REQUEST APPROVAL' || type === 'SELECTION RECRUITMENT APPROVAL' ? process.env.REACT_APP_HCIS_BE_API + 'report/po/recruitment.request.by.recruitment.id/' :
                    type === 'PSIKOTEST' || type === 'APPLICANT COLLECTION' || type === 'VALID APPLICANT DATA' || type === 'USER INTERVIEW' || type === 'CANDIDATE' ? process.env.REACT_APP_HCIS_BE_API + 'report/po/curriculum.vitae/' :
                        type === 'KSE CHECKLIST' ? process.env.REACT_APP_HCIS_BE_API + 'report/po/daftar.riwayat.hidup/' :
                            type === 'TERMINATION APPROVAL' || type === 'TERMINATION RESUBMIT' || type === 'TERMINATION CHECKLIST' ? process.env.REACT_APP_HCIS_BE_API + 'report/po/terminasi.by.termination.id/' :
                                type === 'MOVEMENT APPROVAL' || type === 'MOVEMENT RESUBMIT' ? process.env.REACT_APP_HCIS_BE_API + 'report/po/movement.pengangkatan.karyawan/' :
                                    type === 'BUSINESS TRIP APPROVAL' || type === 'BUSINESS TRIP RESUBMIT' ? process.env.REACT_APP_HCIS_BE_API + 'report/po/sppd/' :
                                        type === 'OVERTIME APPROVAL' || type === 'OVERTIME RESUBMIT' ? process.env.REACT_APP_HCIS_BE_API + 'report/po/overtime/' :
                                            type === 'LEAVE APPROVAL' || type === 'LEAVE RESUBMIT' ? process.env.REACT_APP_HCIS_BE_API + 'report/po/cuti.by.leave.id/' :
                                                type === 'TRAINING REQUEST APPROVAL' || type === 'TRAINING REQUEST RESUBMIT' ? process.env.REACT_APP_HCIS_BE_API + 'report/po/training.request/' :
                                                    type === 'MANUAL ABSENCE APPROVAL' || type === 'MANUAL ABSENCE RESUBMIT' ? process.env.REACT_APP_HCIS_BE_API + 'report/po/manual.absence.request/' :
                                                        type === 'BLACKLIST APPROVAL' || type === 'BLACKLIST RESUBMIT' ? process.env.REACT_APP_HCIS_BE_API + 'report/po/blacklist/' :
                                                            type === 'CLAIM APPROVAL' || type === 'CLAIM RESUBMIT' ? process.env.REACT_APP_HCIS_BE_API + 'cnbcmd/api/claim.document.get/' : ''
        )
        let res = await fetch(url + value, {
            headers: {
                'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiJ9.5BG9SEVOGo_xRhtT8IkyoSy60kPg8HM9Vpvb0TdNew4',
                'Content-Type': 'application/pdf',
            }
        })

        res = await res.blob()
        console.log(res)
        if (res.size > 0 && res.type === 'application/pdf') {
            res = URL.createObjectURL(res);
            window.open(res)
        }
    }

    async reportClaim() {
        let url = process.env.REACT_APP_HCIS_BE_API + 'cnbcmd/api/claim.document.get/'
        let res = await fetch(url + this.props.url.claimID, {
            headers: {
                'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiJ9.5BG9SEVOGo_xRhtT8IkyoSy60kPg8HM9Vpvb0TdNew4',
                'Content-Type': 'application/pdf',
            }
        })
        res = await res.blob()
        console.log(res)
        if (res.size > 0 && res.type === 'application/pdf') {
            res = URL.createObjectURL(res);
            this.setState({ report: res, types: "report" })
        } else {
            alert("Report Not Found")
        }
    }

    renderReportClaim() {
        if (this.state.types === "form") {
            return (
                <div>
                    <form action="#">
                        <div className="border-bottom padding-15px">
                            <div className="margin-bottom-20px">
                                <div className="margin-5px">
                                    <div className="txt-site txt-11 txt-main txt-bold">
                                        <h4>Journal ID</h4>
                                    </div>
                                </div>
                                <input
                                    style={{ backgroundColor: "#E6E6E6" }}
                                    className="txt txt-sekunder-color"
                                    type="text"
                                    readOnly
                                    placeholder="Journal ID"
                                    value={this.props.url.claimID}
                                />
                            </div>
                            <div className="margin-bottom-20px">
                                <div className="margin-5px">
                                    <div className="txt-site txt-11 txt-main txt-bold">
                                        <h4>Employee Name</h4>
                                    </div>
                                </div>
                                <input
                                    style={{ backgroundColor: "#E6E6E6" }}
                                    className="txt txt-sekunder-color"
                                    type="text"
                                    readOnly
                                    placeholder="Employee Name"
                                    value={this.props.url.employeeName}
                                />
                            </div>

                            <div className="margin-bottom-20px">
                                <div className="margin-5px">
                                    <div className="txt-site txt-11 txt-main txt-bold">
                                        <h4>
                                            Description <span style={{ color: "red" }}>*</span>{" "}
                                        </h4>
                                    </div>
                                </div>
                                <input
                                    type="text"
                                    style={{ backgroundColor: "#E6E6E6" }}
                                    className="txt txt-sekunder-color"
                                    placeholder="Description"
                                    disabled
                                    value={this.props.url.claimDescription}
                                />
                            </div>

                            <div className="margin-bottom-20px">
                                <div className="margin-5px">
                                    <div className="txt-site txt-11 txt-main txt-bold">
                                        <h4>
                                            Rupiah <span style={{ color: "red" }}>*</span>
                                        </h4>
                                    </div>
                                </div>
                                <div className="txt txt-sekunder-color" style={{ backgroundColor: '#E6E6E6' }}>
                                    <NumberFormat
                                        displayType={"text"}
                                        thousandSeparator={true}
                                        prefix={"Rp "}
                                        value={this.props.url.claimValue}
                                        renderText={value => value + ",00 "}
                                    />
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            )
        } else {
            return (
                <div className='app-popup app-popup-show'>
                    <div className="padding-top-20px" />
                    <div className={"popup-content background-white border-radius"}>
                        <div className="popup-panel grid grid-2x">
                            <div className="col-1">
                                <div className="popup-title">
                                    {'Report - '} {this.props.id}
                                </div>
                            </div>
                            <div className="col-2 content-right">
                                <button
                                    className="btn btn-circle btn-grey"
                                    onClick={() => this.downloadReport(this.props.id)}
                                >
                                    <i className={"fa fa-lg fa-download"} style={{ color: "#000" }} />
                                </button>
                            </div>
                        </div>
                        {/* {'DOC'} */}
                        <PDFReader url={this.state.report} />
                        <div className="padding-10px content-right">
                            <button
                                style={{ marginLeft: "15px" }}
                                className="btn btn-primary"
                                type="button"
                                onClick={this.props.onClickClose}
                            >
                                <span>CLOSE</span>
                            </button>
                        </div>
                    </div>
                    <div className="padding-bottom-20px" />
                </div>
            )
        }
    }

    render() {
        return (
            <div className='app-popup app-popup-show'>
                <div className="padding-top-20px" />
                <div className={this.props.taskName === "CLAIM APPROVAL" || this.props.taskName === "CLAIM RESUBMIT" ? "popup-content-mikro background-white border-radius" : "popup-content background-white border-radius"}>
                    {this.renderHeader()}
                    {/* {'DOC'} */}
                    {this.props.taskName === "CLAIM APPROVAL" || this.props.taskName === "CLAIM RESUBMIT" ? this.renderReportClaim() : <PDFReader url={this.props.url} />}
                    <div className="padding-10px content-right">
                        <button
                            style={{ marginLeft: "15px" }}
                            className="btn btn-primary"
                            type="button"
                            onClick={this.props.onClickClose}
                        >
                            <span>CLOSE</span>
                        </button>
                    </div>
                </div>
                <div className="padding-bottom-20px" />
            </div>
        )
    }
}
export default FormReport