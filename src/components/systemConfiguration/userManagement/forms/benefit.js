import React, { Component } from 'react'
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles'
import MUIDataTable from "mui-datatables-bitozen"

import BenefitEditSatu from './edit/benefit/benefitEditSatu'
import BenefitEditDua from './edit/benefit/benefitEditDua'


import PopUp from '../../../pages/PopUpAlert'
import BenefitSatuCreate from './create/benefit/benefitSatuCreate'
import BenefitDuaCreate from './create/benefit/benefitDuaCreate'
import documentBenefit from '../../../../assets/img/benefit.PNG'

import ResizeSlider from '../../../../modules/resize/Slider'


var ct = require("../../../../modules/custom/customTable")
const getMuiTheme = () => createMuiTheme(ct.customTable());
const options = ct.customOptions()

const opSlidePage = 'a-s-p-main op-a-s-p-main'
const clSlidePage = 'a-s-p-main'

class ConfBenefit extends Component {
    constructor(props) {
        super(props)
        this.state = {
            classAppSlidePage: 'app-side-page',
            classAppSlidePageMain: clSlidePage,
            formSatuCreate: false,
            formDuaCreate: false,
            formSatuEdit: false,
            editPopUpVisible: false,
            savePopUpVisible: false,
            deletePopUpVisible: false,
            // important for resize pane
            allowResize: false,
            defaultSize: 0,
            minSize: 0,
            maxSize: 0
        }
    }

    opResizePane = () => {
        console.log('open', this.state.defaultSize)
        this.setState({
            allowResize: true,
            defaultSize: 370,
            minSize: 370,
            maxSize: 850
        })
    }

    clResizePane = () => {
        console.log('close', this.state.defaultSize)
        this.setState({
            allowResize: false,
            defaultSize: 0,
            minSize: 0,
            maxSize: 0
        })
    }

    opSidePage = (menu) => (e) => {
        this.setState({
          classAppSlidePage: 'app-side-page op-app-side',
          editBenefitSatu: false,
          editBenefitDua: false
        })

        this.opResizePane()

        switch (menu) {
          case 'slide-benefit-1':
            this.setState({
              editBenefitSatu: true,
            //   rawData
            })
            break;
          case 'slide-benefit-2':
            this.setState({
              editBenefitDua: true,
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
    };
    
    openDeletePopUp = (rawData, index, type) => {
        this.setState({
          deletePopUpVisible: !this.state.deletePopUpVisible, selectedIndex: index, rawData: rawData, formType: type,
          editBenefitSatu: false,
          editBenefitDua: false,
          classAppSlidePage: 'app-side-page'
        })
    };

    opPopupPage = (type) => {
        let savePopUpVisible;
        switch (type) {
            case "formSatu":
                savePopUpVisible = this.state.savePopUpVisible ? !this.state.savePopUpVisible : false
                this.setState({ formSatuCreate: !this.state.formSatuCreate, savePopUpVisible })
                break;
            case "formDua":
                savePopUpVisible = this.state.savePopUpVisible ? !this.state.savePopUpVisible : false
                this.setState({ formDuaCreate: !this.state.formDuaCreate, savePopUpVisible })
                break;
            default:
                break;
        }
    }

    openDeletePopUp = () => {
        this.setState({ deletePopUpVisible: !this.state.deletePopUpVisible })
    }

    openSavePopUp = () => {
        this.setState({ savePopUpVisible: !this.state.savePopUpVisible })
    }

    openEditPopUp = () => {
        this.setState({ editPopUpVisible: !this.state.editPopUpVisible })
    }

    columns = [
        "TID", "Default", "Name", "Segment", "Component", "Tax Type", "Spec Calc", "Activation",
        {
            name: "Action",
            options: {
                customBodyRender: () => (
                    <div>
                        <button
                            onClick={this.opSidePage("slide-benefit-1")}
                            className="btn btn-blue btn-small-circle margin-right-5px"
                        >
                            <i className="fa fa-lw fa-pencil-alt" />
                        </button>
                        <button
                            className="btn btn-red btn-small-circle"
                            onClick={this.openDeletePopUp}>
                            <i className="fa fa-lw fa-trash-alt" />
                        </button>
                    </div>
                )
            }
        }
    ]

    columnsDua = [
        "TID", "Type", "Default", "Name", "Parent", "Periode", "Activation",
        {
            name: "Action",
            options: {
                customBodyRender: () => (
                    <div>
                        <button
                            onClick={this.opSidePage("slide-benefit-2")}
                            className="btn btn-blue btn-small-circle margin-right-5px"
                        >
                            <i className="fa fa-lw fa-pencil-alt" />
                        </button>
                        <button
                            className="btn btn-red btn-small-circle margin-right-5px"
                            onClick={this.openDeletePopUp}>
                            <i className="fa fa-lw fa-trash-alt" />
                        </button>
                        <button
                            className="btn btn-blue btn-small-circle"
                        >
                            <i className="fa fa-lw fa-eye" />
                        </button>
                    </div>
                )
            }
        }
    ]

    data = [["0001", "YES", "NPWP Pemotong", "A", "ID-WP", "GROSSUP", "YES", "YES"]]
    dataDua = [["0001", "HOLDING", "YES", "HO-Payslip-Tpl", "0001", "22-08-19/22-08-24", "YES"]]

    render() {
        return (
        <div>
            <ResizeSlider 
                allowResize={this.state.allowResize}
                defaultSize={this.state.defaultSize}
                minSize={this.state.minSize}
                maxSize={this.state.maxSize}
                main={(
                    <div>
                        <div className="a-s-p-place a-s-p-content active">
                            <div className="a-s-p-top">
                                <div className="grid grid-2x">
                                    <div className="col-1">
                                        <div className="margin-left-15px margin-top-10px margin-bottom-10px display-flex-normal">
                                            <div>
                                                <i className="color-blue fa fa-1x fa-database margin-right-10px"></i>
                                            </div>
                                            <div>
                                                <div className="txt-site txt-12 txt-bold txt-main">
                                                    Benefit
                                                </div>
                                                <div className="txt-site txt-10 txt-thin txt-primary">
                                                    Benefit
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
                                                    <i className="fa fa-1x fa-envelope margin-right-5px"></i>
                                                    <span className="txt-site txt-11 txt-main">Benefit Template Header</span>
                                                </div>
                                            </div>
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
                                                    <i className="fa fa-1x fa-clock margin-right-5px"></i>
                                                    <span className="txt-site txt-11 txt-main">Benefit Template Detail</span>
                                                </div>
                                            </div>
                                            <div className="col-2 content-right">
                                                <button
                                                    // onClick={this.opPopupPage('popup-menu-3')}
                                                    className="btn btn-small-circle btn-sekunder margin-right-5px">
                                                    <i className="fa fa-lw fa-eye" />
                                                </button>
                                                <label htmlFor="navmenu-coh">
                                                    <div className="app-open-close-icon"></div>
                                                </label>
                                                <button
                                                    onClick={() => this.opPopupPage('formSatu')}
                                                    className="btn btn-small-circle btn-sekunder margin-left-5px">
                                                    <i className="fa fa-lw fa-plus" />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="app-open-close-content">
                                            <MuiThemeProvider theme={getMuiTheme()}>
                                                <MUIDataTable
                                                    title="Benefit Template Detail"
                                                    data={this.data}
                                                    columns={this.columns}
                                                    options={options} />
                                            </MuiThemeProvider>
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
                                                    <i className="fa fa-1x fa-people-carry margin-right-5px"></i>
                                                    <span className="txt-site txt-11 txt-main">Benefit Template Detail</span>
                                                </div>
                                            </div>
                                            <div className="col-2 content-right">
                                                <button
                                                    className="btn btn-small-circle btn-sekunder margin-right-5px">
                                                    <i className="fa fa-lw fa-eye" />
                                                </button>
                                                <label htmlFor="navmenu-poh">
                                                    <div className="app-open-close-icon"></div>
                                                </label>
                                            </div>
                                        </div>
                                        <div className="app-open-close-content">
                                            <img src={documentBenefit} alt="" />
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
                                                    <i className="fa fa-1x fa-building margin-right-5px"></i>
                                                    <span className="txt-site txt-11 txt-main">Benefit Template Header</span>
                                                </div>
                                            </div>
                                            <div className="col-2 content-right">
                                                <label htmlFor="navmenu-osh">
                                                    <div className="app-open-close-icon"></div>
                                                </label>
                                                <button
                                                    onClick={() => this.opPopupPage('formDua')}
                                                    className="btn btn-small-circle btn-sekunder margin-left-5px">
                                                    <i className="fa fa-lw fa-plus" />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="app-open-close-content">
                                            <MuiThemeProvider theme={getMuiTheme()}>
                                                <MUIDataTable
                                                    title="Benefit Template Header"
                                                    data={this.dataDua}
                                                    columns={this.columnsDua}
                                                    options={options} />
                                            </MuiThemeProvider>
                                        </div>

                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                )}
                side={(
                    <div className="a-s-p-side">
                        {/* edit */}
                        {this.state.editBenefitSatu && (
                            <BenefitEditSatu 
                            target="tabcontent-3"
                            closeSlide={this.clResizePane} 
                            onClickSave={this.openEditPopUp.bind(this)} />
                        )}
                            
                        {this.state.editBenefitDua && (
                            <BenefitEditDua 
                            target="tabcontent-3"
                            closeSlide={this.clResizePane} 
                            onClickSave={this.openEditPopUp.bind(this)} />
                        )}
                    </div>
                )}></ResizeSlider>
            
                {/* create */}
                {this.state.formSatuCreate && (
                    <BenefitSatuCreate 
                        onClickClose={() => this.opPopupPage("formSatu")} 
                        onClickSave={this.openSavePopUp.bind(this)} />
                )}
                {this.state.formDuaCreate && (
                    <BenefitDuaCreate 
                        onClickClose={() => this.opPopupPage("formDua")} 
                        onClickSave={this.openSavePopUp.bind(this)} />
                )}
                
                {this.state.editPopUpVisible && (
                    <PopUp
                        type={"save"}
                        class={"app-popup app-popup-show"}
                        onClick={() => this.clResizePane()}
                    />
                )}
                
                {this.state.savePopUpVisible && (
                    <PopUp
                        type={"save"}
                        class={"app-popup app-popup-show"}
                        onClick={this.state.formSatuCreate ? () => this.opPopupPage("formSatu") : () => this.opPopupPage("formDua") }
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

export default ConfBenefit