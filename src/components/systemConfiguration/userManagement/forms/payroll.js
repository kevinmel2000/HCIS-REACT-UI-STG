import React, { Component } from 'react'
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles'
import MUIDataTable from "mui-datatables-bitozen"
import PopUp from '../../../pages/PopUpAlert'
import PayrollTemplateHeader1 from '../tables/confPayroll/payrollTemplateHeader1'
import PayrollTemplateDetail from '../tables/confPayroll/payrollTemplateDetail'
import PayrollTemplateHeader2 from '../tables/confPayroll/payrollTemplateHeader2'
import PayrollTemplateDetail2 from '../tables/confPayroll/payrollTemplateDetail2'
import FormEditPayroll1 from './edit/payroll/formEditPayroll1'
import FormEditPayroll2 from './edit/payroll/formEditPayroll2'
import FromCreatePayroll1 from './create/payroll/formCreatePayroll1'
import FromCreatePayroll2 from './create/payroll/formCreatePayroll2'



var ct = require("../../../../modules/custom/customTable")
const getMuiTheme = () => createMuiTheme(ct.customTable());
const options = ct.customOptions()

const opSlidePage = 'a-s-p-main op-a-s-p-main'
const clSlidePage = 'a-s-p-main'

class ConfPayroll extends Component {
    constructor(props) {
        super(props)
        this.state = {
            classAppSlidePage: 'app-side-page',
            classAppSlidePageMain: clSlidePage,
            editPopUpVisible: false,
            savePopUpVisible: false,
            deletePopUpVisible: false,
            createPayroll1: false,
            createPayroll2: false,
            editPayroll1: false,
            editPayroll2: false
        }
    }

    opSidePage = (menu) => (e) => {
        // e.preventDefault()
        // let rawData = {}
        // rawData = data
        console.log(menu)
        this.setState({
          classAppSlidePage: 'app-side-page op-app-side',
          editPayroll1: false,
          editPayroll2: false
        })
        switch (menu) {
          case 'slide-payroll-1':
            this.setState({
              editPayroll1: true,
            //   rawData
            })
            break;
          case 'slide-payroll-2':
            this.setState({
              editPayroll2: true,
            //   rawData
            })
            break;
          default:
            break
        }
    
    }

    clSidePage = () => {
        let editPopUpVisible
        editPopUpVisible = this.state.editPopUpVisible ? !this.state.editPopUpVisible : false
        this.setState({ classAppSlidePage: 'app-side-page', editPopUpVisible })
    }

    openSavePopUp = () => {
        this.setState({
          savePopUpVisible: !this.state.savePopUpVisible,
          editBenefitSatu: false,
          editBenefitDua: false,
          classAppSlidePage: 'app-side-page'
        })
    }
    
    openDeletePopUp = (rawData, index, type) => {
        this.setState({
          deletePopUpVisible: !this.state.deletePopUpVisible, selectedIndex: index, rawData: rawData, formType: type,
          editBenefitSatu: false,
          editBenefitDua: false,
          classAppSlidePage: 'app-side-page'
        })
    }

    opPopupPage = (type) => {
        let savePopUpVisible;
        switch (type) {
            case "popup-payroll-1":
                savePopUpVisible = this.state.savePopUpVisible ? !this.state.savePopUpVisible : false
                this.setState({ createPayroll1: !this.state.createPayroll1, savePopUpVisible })
                break;
            case "popup-payroll-2":
                savePopUpVisible = this.state.savePopUpVisible ? !this.state.savePopUpVisible : false
                this.setState({ createPayroll2: !this.state.createPayroll2, savePopUpVisible })
                break;
            default:
                break;
        }
    }

    openEditPopUp = () => {
        this.setState({ editPopUpVisible: !this.state.editPopUpVisible })
    }

    handleSubmit(data) {
        console.log(data)
    }

    render() {
        return (
            <div className={this.state.classAppSlidePage}>
                <div className={this.state.classAppSlidePageMain}>
                    <div className="a-s-p-place a-s-p-content active" id={this.props.target}>
                        <div className="a-s-p-top">
                            <div className="grid grid-2x">
                                <div className="col-1">
                                    <div className="margin-left-15px margin-top-10px margin-bottom-10px display-flex-normal">
                                        <div>
                                            <i className="color-blue fa fa-1x fa-mail-bulk margin-right-10px"></i>
                                        </div>
                                        <div>
                                            <div className="txt-site txt-12 txt-bold txt-main">
                                                Payroll
                                            </div>
                                            <div className="txt-site txt-10 txt-thin txt-primary">
                                                Payroll
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="a-s-p-mid border-top">
                            <div className="padding-10px">
                                <div className="app-open-close margin-bottom-20px">
                                    <input
                                        type="checkbox"
                                        name="navmenu"
                                        className="app-open-close-input"
                                        id="navmenu-ch" />
                                    <div className="grid grid-2x margin-bottom-10px">
                                        <div className="col-1">
                                            <div className="display-flex-normal margin-top-10px">
                                                <i className="fa fa-1x fa-mail-bulk margin-right-5px"></i>
                                                <span className="txt-site txt-11 txt-main">Payroll Template Header</span>
                                            </div>
                                        </div>
                                        <div className="col-2 content-right">
                                            <label htmlFor="navmenu-ch">
                                                <div className="app-open-close-icon"></div>
                                            </label>
                                        </div>
                                    </div>
                                    <div className="app-open-close-content">
                                        < PayrollTemplateHeader1 />
                                        {/* <CorporateHoliday
                                            data={dataHoliday}
                                            rawData={rawDataHoliday}
                                            openSlide={this.opSidePage(this)}
                                            onClickDelete={this.openDeletePopUp.bind(this)}
                                        >
                                        </CorporateHoliday> */}
                                    </div>
                                </div>
                                <div className="app-open-close margin-top-20px">
                                    <input
                                        type="checkbox"
                                        name="navmenu"
                                        className="app-open-close-input"
                                        id="navmenu-coh" />
                                    <div className="grid grid-2x margin-bottom-10px">
                                        <div className="col-1">
                                            <div className="display-flex-normal margin-top-10px">
                                                <i className="fa fa-1x fa-mail-bulk margin-right-5px"></i>
                                                <span className="txt-site txt-11 txt-main">Payroll Template Detail</span>
                                            </div>
                                        </div>
                                        <div className="col-2 content-right">
                                            <label htmlFor="navmenu-coh">
                                                <div className="app-open-close-icon"></div>
                                            </label>
                                            <button
                                                onClick={() => this.opPopupPage('popup-payroll-1')}
                                                className="btn btn-small-circle btn-sekunder margin-left-5px">
                                                <i className="fa fa-lw fa-plus" />
                                            </button>
                                            <button
                                                className="btn btn-small-circle btn-sekunder margin-left-5px"
                                            >
                                                <i className="fa fa-lw fa-eye" />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="app-open-close-content">
                                        <PayrollTemplateDetail
                                            openSlide={this.opSidePage('slide-payroll-1')}
                                            onDeletePopup={this.props.openDeletePopUp.bind(this)}
                                        />
                                        {/* <CorporateOfficeHour
                                            data={dataTableCorporateOfficeHour}
                                            rawData={rawDataCorporateOfficeHour}
                                            openSlide={this.opSidePage(this)}
                                            onClickDelete={this.openDeletePopUp.bind(this)}></CorporateOfficeHour> */}
                                    </div>
                                </div>

                                <div className="app-open-close margin-top-20px">
                                    <input
                                        type="checkbox"
                                        name="navmenu"
                                        className="app-open-close-input"
                                        id="navmenu-poh" />
                                    <div className="grid grid-2x margin-bottom-10px">
                                        <div className="col-1">
                                            <div className="display-flex-normal margin-top-10px">
                                                <i className="fa fa-1x fa-mail-bulk margin-right-5px"></i>
                                                <span className="txt-site txt-11 txt-main">Payroll Template Detail</span>
                                            </div>
                                        </div>
                                        <div className="col-2 content-right">
                                            <label htmlFor="navmenu-poh">
                                                <div className="app-open-close-icon"></div>
                                            </label>
                                            <button
                                                className="btn btn-small-circle btn-sekunder margin-left-5px"
                                            >
                                                <i className="fa fa-lw fa-eye" />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="app-open-close-content">
                                        <PayrollTemplateDetail2 />
                                        {/* <PersonalOfficeHour
                                            data={dataTablePersonalOfficeHour}
                                            rawData={rawDataPersonalOfficeHour}
                                            openSlide={this.opSidePage(this)}
                                            onClickDelete={this.openDeletePopUp.bind(this)}
                                        >
                                        </PersonalOfficeHour> */}
                                    </div>
                                </div>

                                <div className="app-open-close margin-top-20px">
                                    <input
                                        type="checkbox"
                                        name="navmenu"
                                        className="app-open-close-input"
                                        id="navmenu-osh" />
                                    <div className="grid grid-2x margin-bottom-10px">
                                        <div className="col-1">
                                            <div className="display-flex-normal margin-top-10px">
                                                <i className="fa fa-1x fa-mail-bulk margin-right-5px"></i>
                                                <span className="txt-site txt-11 txt-main">Payroll Template Header</span>
                                            </div>
                                        </div>
                                        <div className="col-2 content-right">
                                            <label htmlFor="navmenu-osh">
                                                <div className="app-open-close-icon"></div>
                                            </label>
                                            <button
                                                type='button'
                                                onClick={() => this.opPopupPage('popup-payroll-2')}
                                                className="btn btn-small-circle btn-sekunder margin-left-5px">
                                                <i className="fa fa-lw fa-plus" />
                                            </button>
                                            <button
                                                className="btn btn-small-circle btn-sekunder margin-left-5px"
                                            >
                                                <i className="fa fa-lw fa-eye" />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="app-open-close-content">
                                        <PayrollTemplateHeader2
                                            openSlide={this.opSidePage('slide-payroll-2')}
                                            onDeletePopup={this.props.openDeletePopUp.bind(this)}
                                        />
                                        {/* <OfficeShiftHour
                                            data={dataTableOfficeShiftHour}
                                            rawData={rawDataOfficeShiftHour}
                                            openSlide={this.opSidePage(this)}
                                            onClickDelete={this.openDeletePopUp.bind(this)}></OfficeShiftHour>
                                    </div> */}
                                    </div>

                                    {/* <div className="padding-bottom-15px"></div> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="a-s-p-side">
                    {/* edit */}
                    {(this.state.editPayroll1)
                        ? (<FormEditPayroll1 
                            rawData={this.state.rawData} 
                            closeSlide={this.clSidePage} 
                            onClickSave={this.openEditPopUp.bind(this)} />)
                        : null}

                    {(this.state.editPayroll2)
                        ? (<FormEditPayroll2 
                            rawData={this.state.rawData} 
                            closeSlide={this.clSidePage} 
                            onClickSave={this.openEditPopUp.bind(this)} />)
                        : null}
                </div>

                {/* create */}
                {/* PAYROLL */}
                {(this.state.createPayroll1)
                    ? (<FromCreatePayroll1 
                        onClickClose={() => this.opPopupPage("popup-payroll-1")}
                        onClickSave={this.openSavePopUp.bind(this)}
                        />)
                    : null}
                {(this.state.createPayroll2)
                    ? (<FromCreatePayroll2 
                        onClickClose={() => this.opPopupPage("popup-payroll-2")}
                        onClickSave={this.openSavePopUp.bind(this)}
                        />)
                    : null}
                
                {/* notification */}
                {this.state.editPopUpVisible && (
                    <PopUp
                        type={"save"}
                        class={"app-popup app-popup-show"}
                        onClick={() => this.clSidePage()}
                    />
                )}

                {this.state.savePopUpVisible && (
                    <PopUp
                        type={"save"}
                        class={"app-popup app-popup-show"}
                        onClick={this.state.formSatuCreate ? () => this.opPopupPage("popup-payroll-1") : () => this.opPopupPage("popup-payroll-2") }
                    />
                )}

                {this.state.deletePopUpVisible && (
                    <PopUp
                        type={"delete"}
                        class={"app-popup app-popup-show"}
                        onClick={this.openDeletePopUp}
                        onClickDelete={this.openDeletePopUp.bind(this)}
                    />
                )}
            </div>
        )
    }
}


export default ConfPayroll
