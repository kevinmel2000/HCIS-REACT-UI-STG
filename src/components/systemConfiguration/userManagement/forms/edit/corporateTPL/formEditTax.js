import React, { Component } from 'react'
import ReactTooltip from 'react-tooltip'
import PopUp from '../../../../../pages/PopUpAlert'
import TableTaxDetail from '../../../tables/confCorporateTPL/tableTaxDetail'
import FormCreateTax from '../../create/tax/formCreateTax'
import { PDFReader } from 'reactjs-pdf-reader';
import { getBizpar } from '../../../../../../Services/Utils'
import * as R from 'ramda'
import API from '../../../../../../Services/Api'
import Loader from 'react-loader-spinner'
import DropDown from '../../../../../../modules/popup/DropDown'

class FormEditTax extends Component {
    constructor(props) {
        super(props)
        let { bizparTaxType } = this.props
        this.state = {
            data: { ...this.props.rawData, taxTPLStatus: this.props.rawData.taxTPLStatus === 'ACTIVE' ? true : false },
            createTax: false,
            savePopUpVisible: false,
            reportVisible: false,
            loading: false,
            bizparTaxType
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
            case "popup-tax":
                savePopUpVisible = this.state.savePopUpVisible ? !this.state.savePopUpVisible : false
                this.setState({ createTax: !this.state.createTax, savePopUpVisible })
                break;
            default:
                break;
        }
    }

    openSavePopUp = () => {
        this.setState({
            savePopUpVisible: !this.state.savePopUpVisible
        })
    }

    openReport = () => {
        this.setState({ reportVisible: !this.state.reportVisible })
    }

    getAllBizpar = async () => {
        let bizparTaxTplSegment = await getBizpar('TAX_TPL_SEGMENT')
        let bizparTaxTplComponentType = await getBizpar('TAX_TPL_COMPONENT_TYPE')
        let bizparTaxTplComponent = await getBizpar('TAX_TPL_COMPONENT')
        let bizparTaxTplComponentItem = await getBizpar('TAX_TPL_COMPONENT_ITEM')
        // let bizpar = await getBizpar('TAX_TYPE')

        this.setState({
            bizparTaxTplSegment,
            bizparTaxTplComponentType,
            bizparTaxTplComponentItem,
            bizparTaxTplComponent,
            // bizpar
        })
    }

    async handleChange(event) {
        let { data } = this.state
        const formData = new FormData();

        formData.append('file', event.target.files[0])
        // console.log(event.target.files)
        formData.append('taxTPLID', data.taxTPLID)
        let response = await API.create('CFG').postPhotoTax(formData)
        if (!response.ok) alert(typeof response.data === "string" ? response.data : JSON.stringify(response.data))
        switch (response.data.status) {
            case "S":
                let res = await API.create('CFG').getTaxByID(data.taxTPLID)
                data = {
                    ...data,
                    taxTPLPhotoURL: res.data.data.taxTPLPhotoURL
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
        console.log('dataID', this.props.rawData.taxTPLID)
        let response = await fetch(process.env.REACT_APP_HCIS_BE_API + 'cfg/api/corporate.tax.tpl.photo.get/' + rawData.taxTPLID, {
            headers: {
                'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiJ9.5BG9SEVOGo_xRhtT8IkyoSy60kPg8HM9Vpvb0TdNew4'
            }
        })
        // console.log('response ', response)
        response = await response.blob()
        if (response.size > 0) {
            setTimeout(() => {
                response = URL.createObjectURL(response);
                this.setState({ imageUrl: response, loading: false })
            }, 500)
        } else {
            setTimeout(() => {
                this.setState({ loading: false })
            }, 500)
        }
    }

    async getReport() {
        let { rawData } = this.props
        let response = await fetch(process.env.REACT_APP_HCIS_BE_API + 'report/po/pajak.pph21.by.tax.tpl.id/' + rawData.taxTPLID, {
            headers: {
                'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiJ9.5BG9SEVOGo_xRhtT8IkyoSy60kPg8HM9Vpvb0TdNew4',
                'Content-Type': 'application/pdf',
            }
        })

        console.log(response)
        if (response.ok) {
            response = await response.blob()
            console.log(response)
            if (response.size > 0) {
                response = URL.createObjectURL(response);
                this.setState({ reportURL: response })
            }
        } else {
            alert("Failed: Document Not Found")
        }
    }

    componentDidMount() {
        this.getAllBizpar()
        this.getImage()
        this.getReport()
    }

    componentDidUpdate(prevProps) {
        if (this.props.rawData !== prevProps.rawData) {
            let data = { ...this.props.rawData, taxTPLStatus: this.props.rawData.taxTPLStatus === 'ACTIVE' ? true : false }
            // this.props.rawData
            this.setState({ data })
            this.getImage()
        }
    }

    renderReportView = () => {
        return (
            <div className="app-popup app-popup-show">
                <div className="padding-top-20px" />
                <div className="popup-content background-white border-radius">

                    <div className="popup-panel grid grid-2x">
                        <div className="col-1">
                            <div className="popup-title">
                                Tax Template Visualization: {this.state.data.taxTPLID}
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

                            </div>
                            : <div style={{ padding: "15px", margin: "15px" }}> Visualization Not Found </div>}
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
        let { taxTPLID, taxTPLName, taxTPLStatus, taxTPLPhotoURL } = this.state.data
        let index = R.findIndex(R.propEq('bizparKey', this.state.data.taxTPLType && this.state.data.taxTPLType.bizparKey))(this.state.bizparTaxType)
        return (
            <div className="a-s-p-place active">
                <div className="a-s-p-top">
                    <div className="grid grid-2x">
                        <div className="col-1">
                            <div className="display-flex-normal margin-top-10px">
                                <i className="fa fa-1x fa-file-invoice-dollar"></i>
                                <span className="txt-site txt-11 txt-main margin-left-10px">
                                    Tax Template
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
                                        <i className="fa fa-1x fa-file-invoice-dollar margin-right-5px"></i>
                                        <span className="txt-site txt-11 txt-main">Tax Template Header</span>
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
                                        <div className="margin-15px">
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
                                                        {!R.isNil(taxTPLPhotoURL) && !R.isEmpty(taxTPLPhotoURL) ? (
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
                                                    <h4>Template ID: {taxTPLID}</h4>
                                                </div>
                                                <div className="margin-5px">
                                                    <p className="txt-site txt-11 txt-primary">
                                                        The Tax template menu is to be used to create detail Tax calculation template.
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
                                                                type="text"
                                                                className="txt txt-sekunder-color"
                                                                placeholder=""
                                                                required
                                                                value={taxTPLName}
                                                                onChange={(e) => this.setState({
                                                                    data: {
                                                                        ...this.state.data,
                                                                        taxTPLName: e.target.value
                                                                    }
                                                                })}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="margin-bottom-20px">
                                                <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                                                    <h4>Tax Template Type <span style={{ color: 'red' }}>*</span></h4>
                                                </div>
                                                <div className="margin-5px">
                                                    <DropDown
                                                        title="-- please select tax template type --"
                                                        onChange={(dt) => this.setState({
                                                            // data: {
                                                            //     ...this.state.data,
                                                            //     taxTPLType: dt
                                                            // }
                                                            data: {
                                                                ...this.state.data,
                                                                taxTPLType: {
                                                                    ...this.state.data.taxTPLType,
                                                                    bizparKey: dt
                                                                }
                                                            }
                                                        })}
                                                        taxType={this.state.data.taxTPLType && index >= 0 ? this.state.bizparTaxType[index].bizparValue : null}
                                                        value={this.state.data.taxTPLType ? this.state.data.taxTPLType.bizparKey : ''}
                                                        data={this.state.bizparTaxType}
                                                        type="bizpar"
                                                    />
                                                </div>
                                            </div>
                                            <div className="margin-bottom-20px">
                                                <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                                                    <h4>Activation</h4>
                                                </div>
                                                <div className="margin-15px">
                                                    <label className="radio">
                                                        <input type="checkbox" name="all-day" checked={taxTPLStatus}
                                                            onChange={(e) => this.setState({
                                                                data: {
                                                                    ...this.state.data,
                                                                    taxTPLStatus: e.target.checked
                                                                }
                                                            })}
                                                            disabled
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
                                        <i className="fa fa-1x fa-file-invoice-dollar margin-right-5px"></i>
                                        <span className="txt-site txt-11 txt-main"> Tax Template Detail</span>
                                    </div>
                                </div>
                                <div className="col-2 content-right">
                                    <label htmlFor="navmenu-cih">
                                        <div className="app-open-close-icon"></div>
                                    </label>
                                    <button
                                        className="btn btn-small-circle btn-sekunder margin-left-5px"
                                        onClick={() => this.opPopupPage("popup-tax")}>
                                        <i className="fa fa-lw fa-plus" />
                                    </button>
                                </div>
                            </div>
                            {this.state.createTax &&
                                <FormCreateTax
                                    bizparTaxTplComponent={this.state.bizparTaxTplComponent}
                                    bizparTaxTplComponentItem={this.state.bizparTaxTplComponentItem}
                                    bizparTaxTplComponentType={this.state.bizparTaxTplComponentType}
                                    bizparTaxTplSegment={this.state.bizparTaxTplSegment}
                                    bizparTaxType={this.state.bizparTaxType}
                                    rawData={this.props.rawData}
                                    onClickSave={this.props.onClickSave.bind(this)}
                                    onClickClose={() => this.opPopupPage("popup-tax")}
                                />
                            }
                            <div className="app-open-close-content">
                                <TableTaxDetail
                                    bizparTaxTplComponent={this.state.bizparTaxTplComponent}
                                    bizparTaxTplComponentItem={this.state.bizparTaxTplComponentItem}
                                    bizparTaxTplComponentType={this.state.bizparTaxTplComponentType}
                                    bizparTaxTplSegment={this.state.bizparTaxTplSegment}
                                    onClickSave={this.props.onClickSave.bind(this)}
                                    onClickClose={() => this.opPopupPage("popup-tax")}
                                    data={this.props.rawData} />
                            </div>
                        </div>

                        <div className="app-open-close margin-bottom-20px">
                            <input
                                type="checkbox"
                                name="navmenu"
                                className="app-open-close-input"
                                id="navmenu-cuh" />
                            <div className="grid grid-2x margin-bottom-10px">
                                <div className="col-1">
                                    <div className="display-flex-normal margin-top-10px">
                                        <i className="fa fa-1x fa-file-invoice-dollar margin-right-5px"></i>
                                        <span className="txt-site txt-11 txt-main"> Tax Template Visualization</span>
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
                            {this.state.reportVisible && this.renderReportView()}
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
                                            if (R.isEmpty(this.state.data.taxTPLName)) return alert('Tax Template Name is Required')
                                            if (R.isEmpty((this.state.data.taxTPLType)) || R.isNil(this.state.data.taxTPLType) || R.isEmpty(this.state.data.taxTPLType.bizparKey)) return alert('Tax Template Type is Required')
                                            this.props.onClickSave(this.state.data, 'tax')
                                        }}
                                    >
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
                        onClick={() => this.opPopupPage("popup-tax")}
                    />
                )}
                <ReactTooltip />
            </div >
        )
    }
}

export default FormEditTax