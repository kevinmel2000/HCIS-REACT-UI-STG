import React, { Component } from 'react'
import ReactTooltip from 'react-tooltip'
import PopUp from '../../../../../pages/PopUpAlert'
import { PDFReader } from 'reactjs-pdf-reader';
import { getBizpar } from '../../../../../../Services/Utils'
import * as R from 'ramda'
import API from '../../../../../../Services/Api'
import TablePayrollDetail from './tablePayrollDetail';
import FormCreatePayroll from '../../create/payroll/formCreatePayroll';
import Loader from 'react-loader-spinner'


class EditPayroll extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: { ...this.props.rawData, payrollTPLStatus: this.props.rawData.payrollTPLStatus === 'ACTIVE' ? true : false },
            createPayroll: false,
            savePopUpVisible: false,
            reportVisible: false,
            loading: false
        }
        this.handleChange = this.handleChange.bind(this);
    }

    opPopupPage = (type) => {
        let savePopUpVisible;
        this.setState({
            editTravel: false,
            classAppSlidePage: 'app-side-page'
        })
        switch (type) {
            case "popup-payroll":
                savePopUpVisible = this.state.savePopUpVisible ? !this.state.savePopUpVisible : false
                this.setState({ createPayroll: !this.state.createPayroll, savePopUpVisible })
                break;
            default:
                break;
        }
    }

    openReport = () => {
        this.setState({ reportVisible: !this.state.reportVisible })
    }

    async handleChange(event) {
        let { data } = this.state
        const formData = new FormData();

        formData.append('file', event.target.files[0])
        // console.log('data.payrollTPLID', data.payrollTPLID)
        formData.append('payrollTPLID', data.payrollTPLID)
        let response = await API.create('CFG').postPhotoPayroll(formData)
        if (!response.ok) alert(typeof response.data === "string" ? response.data : JSON.stringify(response.data))
        switch (response.data.status) {
            case "S":
                let res = await API.create('CFG').getPayrollByID(data.payrollTPLID)
                data = {
                    ...data,
                    payrollTPLPhotoURL: res.data.data.payrollTPLPhotoURL
                }
                console.log('res img', response.data)
                this.setState({ imageUrl: "", data }, () => {
                    this.getImage()
                })
                break;
            default:
                break;
        }
    }

    async getImage() {
        this.setState({ loading: true, imageUrl: '' })
        let { rawData } = this.props
        let response = await fetch(process.env.REACT_APP_HCIS_BE_API + 'cfg/api/corporate.payroll.tpl.photo.get/' + rawData.payrollTPLID, {
            headers: {
                'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiJ9.5BG9SEVOGo_xRhtT8IkyoSy60kPg8HM9Vpvb0TdNew4'
            }
        })
        if (response.ok) {
            response = await response.blob()
            if (response.size > 0) {
                setTimeout(() => {
                    response = URL.createObjectURL(response);
                    this.setState({ imageUrl: response, loading: false })
                }, 500)
            } else {
                setTimeout(() => {
                    this.setState({ data: { ...this.state.data, payrollTPLPhotoURL: "" }, loading: false })
                }, 500)
            }
        }
    }

    async getReport() {
        let { rawData } = this.props
        let response = await fetch(process.env.REACT_APP_HCIS_BE_API + 'report/po/payslip.by.payroll.id/' + rawData.payrollTPLID, {
            headers: {
                'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiJ9.5BG9SEVOGo_xRhtT8IkyoSy60kPg8HM9Vpvb0TdNew4',
                'Content-Type': 'application/pdf',
            }
        })

        console.log(response)
        response = await response.blob()
        console.log(response)
        if (response.size > 0) {
            response = URL.createObjectURL(response);
            this.setState({ reportURL: response })
        }
    }

    componentDidMount() {
        this.getAllBizpar()
        this.getCOA()
        this.getImage()
        this.getReport()
    }

    componentDidUpdate(prevProps) {
        if (this.props.rawData !== prevProps.rawData) {
            let data = { ...this.props.rawData, payrollTPLStatus: this.props.rawData.payrollTPLStatus === 'ACTIVE' ? true : false }
            // this.props.rawData
            this.setState({
                data
            })
            this.getImage()
        }

    }

    async getCOA() {
        let payload = {
            "params": {},
            "offset": 0,
            "limit": 5
        }
        let res = await API.create('CFG').getAllCoaCategory(payload)
        if (res.data && res.data.status === 'S') {
            console.log('res', res)
            let coaCategory = res.data.data
            this.setState({
                coaCategory
            })
        }

    }

    getAllBizpar = async () => {
        let bizparTaxType = await getBizpar('TAX_TYPE')
        let bizparTax1721A1Type = await getBizpar('TAX_1721A1_TYPE')
        let bizparPayrollTplComponent = await getBizpar('PAYROLL_TPL_COMPONENT')
        let bizparPayrollTplComponentType = await getBizpar('PAYROLL_TPL_COMPONENT_TYPE')
        let bizparPayrollTplSegment = await getBizpar('PAYROLL_TPL_SEGMENT')

        this.setState({
            bizparTaxType,
            bizparTax1721A1Type,
            bizparPayrollTplSegment,
            bizparPayrollTplComponent,
            bizparPayrollTplComponentType
        })
    }

    renderReportView = () => {
        return (
            <div className="app-popup app-popup-show">
                <div className="padding-top-20px" />
                <div className="popup-content background-white border-radius">

                    <div className="popup-panel grid grid-2x">
                        <div className="col-1">
                            <div className="popup-title">
                                Payroll Template Visualization: {this.state.data.payrollTPLID}
                            </div>
                        </div>
                        <div className="col-2 content-right">
                            <button
                                type="button"
                                className="btn btn-circle btn-grey"
                                onClick={this.openReport.bind(this)}>
                                <i className="fa fa-lg fa-times" />
                            </button>
                        </div>
                    </div>
                    <div className="display-flex-normal" style={{ justifyContent: "center" }}>
                        {this.state.reportURL ?
                            <div>
                                <PDFReader url={this.state.reportURL} />

                            </div> : <div style={{ padding: "15px", margin: "15px" }}> Visualization Not Found </div>}
                    </div>
                    <div className="padding-15px content-right">
                        <button
                            className="btn btn-primary"
                            type="button"
                            onClick={this.openReport.bind(this)}
                        >
                            <span>CLOSE</span>
                        </button>
                    </div>
                    <div className="margin-bottom-15px"></div>
                </div>
            </div>
        )
    }

    render() {
        let { payrollTPLID, payrollTPLName, payrollTPLStatus, payrollTPLPhotoURL } = this.state.data
        return (
            <div className="a-s-p-place active">
                <div className="a-s-p-top">
                    <div className="grid grid-2x">
                        <div className="col-1">
                            <div className="display-flex-normal margin-top-10px">
                                <i className="fa fa-1x fa-receipt"></i>
                                <span className="txt-site txt-11 txt-main margin-left-10px">
                                    Payroll Template
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
                <div className="a-s-p-mid a-s-p-pad border-bottom">
                    <div>
                        <div className="app-open-close margin-bottom-20px">
                            <input
                                type="checkbox"
                                name="navmenu"
                                className="app-open-close-input"
                                id="navmenu-cah" />
                            <div className="grid grid-2x margin-bottom-10px">
                                <div className="col-1">
                                    <div className="display-flex-normal margin-top-10px">
                                        <i className="fa fa-1x fa-receipt margin-right-5px"></i>
                                        <span className="txt-site txt-11 txt-main">Payroll Template Header</span>
                                    </div>
                                </div>
                                <div className="col-2 content-right">
                                    <label htmlFor="navmenu-cah">
                                        <div className="app-open-close-icon"></div>
                                    </label>
                                </div>
                            </div>
                            <div className="app-open-close-content">
                                <div>
                                    <form action="#">
                                        <div>
                                            <div>
                                                <div className="margin-30px">
                                                    <div className="image image-100px image-circle background-white border-all" style={{ margin: 'auto' }}>
                                                        {this.state.loading && (
                                                            <Loader
                                                                type="ThreeDots"
                                                                style={{ display: 'flex', justifyContent: 'center', marginTop: 45 }}
                                                                color={"#somecolor"}
                                                                height={30}
                                                                width={30}
                                                                loading={this.state.loading} />
                                                        )}
                                                        {!R.isNil(payrollTPLPhotoURL) && !R.isEmpty(payrollTPLPhotoURL) ? (
                                                            <img width="100%" height="100%" src={this.state.imageUrl} alt="" />
                                                        ) : this.state.loading === true ? <i /> : <i className="icn fa fa-2x fa-image"></i>
                                                        }
                                                    </div>
                                                </div>

                                                <div className="txt-site txt-13 txt-bold txt-main content-center">
                                                    <input
                                                        type="file"
                                                        id="pick-image"
                                                        style={{ display: "none" }}
                                                        onChange={this.handleChange} />
                                                    <label htmlFor="pick-image">
                                                        <div className="btn btn-div btn-grey-dark">
                                                            <i className="fa fa-1x fa-upload margin-right-10px"></i>
                                                            Pick Image
                                                         </div>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="margin-15px">
                                            <div className="margin-bottom-20px">
                                                <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                                                    <h4>Template ID: {payrollTPLID}</h4>
                                                </div>
                                                <div className="margin-5px">
                                                    <p className="txt-site txt-11 txt-primary">
                                                        The Payroll template menu is to be used to create detail salary calculation template.
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="margin-bottom-20px">
                                                <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                                                    <h4>Template Name <span style={{ color: 'red' }}>*</span></h4>
                                                </div>
                                                <div className="margin-5px">
                                                    <div className="card-date-picker">
                                                        <div className="double">
                                                            <input
                                                                required
                                                                type="text"
                                                                className="txt txt-sekunder-color"
                                                                placeholder=""
                                                                value={payrollTPLName}
                                                                onChange={(e) => this.setState({
                                                                    data: {
                                                                        ...this.state.data,
                                                                        payrollTPLName: e.target.value
                                                                    }
                                                                })}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="margin-bottom-20px">
                                                <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                                                    <h4>Activation</h4>
                                                </div>
                                                <div className="margin-15px">
                                                    <label className="radio">
                                                        <input type="checkbox" name="all-day" checked={payrollTPLStatus} disabled
                                                            onChange={(e) => this.setState({
                                                                data: {
                                                                    ...this.state.data,
                                                                    payrollTPLStatus: e.target.checked
                                                                }
                                                            })}
                                                        />
                                                        <span className="checkmark" />
                                                        <span className="txt-site txt-11 txt-bold txt-main">
                                                            Activate Now
                                                        </span>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>

                                    </form>
                                </div >
                                {/* <FormPayroll
                                    data={this.props.rawData}
                                    onClickSave={this.props.onClickSave}
                                /> */}
                            </div>
                        </div>

                        <div className="app-open-close margin-bottom-20px">
                            <input
                                type="checkbox"
                                name="navmenu"
                                className="app-open-close-input"
                                id="navmenu-cih" />
                            <div className="grid grid-2x margin-bottom-10px">
                                <div className="col-1">
                                    <div className="display-flex-normal margin-top-10px">
                                        <i className="fa fa-1x fa-receipt margin-right-5px"></i>
                                        <span className="txt-site txt-11 txt-main"> Payroll Template Detail</span>
                                    </div>
                                </div>
                                <div className="col-2 content-right">
                                    <label htmlFor="navmenu-cih">
                                        <div className="app-open-close-icon"></div>
                                    </label>
                                    <button
                                        className="btn btn-small-circle btn-sekunder margin-left-5px"
                                        onClick={() => this.opPopupPage("popup-payroll")}>
                                        <i className="fa fa-lw fa-plus" />
                                    </button>
                                </div>
                            </div>
                            {this.state.createPayroll &&
                                <FormCreatePayroll
                                    bizparPayrollTplComponent={this.state.bizparPayrollTplComponent}
                                    bizparPayrollTplComponentType={this.state.bizparPayrollTplComponentType}
                                    bizparPayrollTplSegment={this.state.bizparPayrollTplSegment}
                                    bizparTax1721A1Type={this.state.bizparTax1721A1Type}
                                    bizparTaxType={this.state.bizparTaxType}
                                    coaCategory={this.state.coaCategory}
                                    rawData={this.props.rawData}
                                    onClickSave={this.props.onClickSave.bind(this)}
                                    onClickClose={() => this.opPopupPage("popup-payroll")}
                                />
                            }
                            <div className="app-open-close-content">
                                <TablePayrollDetail
                                    bizparPayrollTplComponent={this.state.bizparPayrollTplComponent}
                                    bizparPayrollTplComponentType={this.state.bizparPayrollTplComponentType}
                                    bizparPayrollTplSegment={this.state.bizparPayrollTplSegment}
                                    bizparTax1721A1Type={this.state.bizparTax1721A1Type}
                                    bizparTaxType={this.state.bizparTaxType}
                                    coaCategory={this.state.coaCategory}
                                    onClickSave={this.props.onClickSave.bind(this)}
                                    onClickClose={() => this.opPopupPage("popup-payroll")}
                                    data={this.props.rawData} />
                            </div>
                            {this.state.reportVisible && this.renderReportView()}
                        </div>

                        <div className="app-open-close margin-bottom-20px">
                            <input
                                type="checkbox"
                                name="navmenu"
                                className="app-open-close-input"
                                id="navmenu-cuh" />
                            <div className="grid grid-2x margin-bottom-10px">
                                <div className="col-1" style={{ width: "120%" }}>
                                    <div className="display-flex-normal margin-top-10px">
                                        <i className="fa fa-1x fa-receipt margin-right-5px"></i>
                                        <span className="txt-site txt-11 txt-main"> Payroll Template Visualization </span>
                                    </div>
                                </div>
                                <div className="col-2 content-right">
                                    <button
                                        type="button"
                                        onClick={this.openReport.bind(this)}
                                        className="btn btn-small-circle btn-sekunder margin-left-5px">
                                        <i className="fa fa-lw fa-expand-arrows-alt" />
                                    </button>
                                </div>
                            </div>
                            <div className="app-open-close-content">
                                <div style={{ width: '10%' }}>
                                    {this.state.reportURL && (
                                        <PDFReader width={500} url={this.state.reportURL} />
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="display-flex-normals margin-bottom-15px">
                        <div className="border-top padding-top-20px">
                            <div className="grid grid-2x">
                                <div className="col-1 content-left">

                                </div>
                                <div className="col-2 content-right">
                                    <button
                                        type="button"
                                        className="btn btn-blue"
                                        onClick={() => {
                                            if (R.isEmpty(this.state.data.payrollTPLName)) return alert('Payroll Template Name is Required')
                                            this.props.onClickSave(this.state.data, 'payroll')
                                        }}>
                                        SAVE
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {this.state.savePopUpVisible && (
                    <PopUp
                        type={"save"}
                        class={"app-popup app-popup-show"}
                        onClick={() => this.opPopupPage("popup-payroll")}
                    />
                )}
                <ReactTooltip />
            </div >
        )
    }
}


export default EditPayroll