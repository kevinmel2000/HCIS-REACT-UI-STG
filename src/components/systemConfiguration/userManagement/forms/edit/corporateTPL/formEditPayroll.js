import React, { Component } from 'react'
import ReactTooltip from 'react-tooltip'
import PopUp from '../../../../../pages/PopUpAlert'
import PayrollTemplateDetail from '../../../tables/confPayroll/payrollTemplateDetail'
import FormPayroll from './formPayroll'
import FormCreatePayroll1 from '../../create/payroll/formCreatePayroll1'

class FormEditPayroll extends Component {
    constructor(props) {
        super(props)
        this.state = {
            createPayroll: false,
            savePopUpVisible: false
        }
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

    openSavePopUp = () => {
        this.setState({
            savePopUpVisible: !this.state.savePopUpVisible
        })
    }

    render() {
        return (
            <div className="a-s-p-place active">
                <div className="a-s-p-top">
                    <div className="grid grid-2x">
                        <div className="col-1">
                            <div className="display-flex-normal margin-top-10px">
                                <i className="fa fa-1x fa-calendar"></i>
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
                    <div className="padding-10px">
                        <div className="app-open-close margin-bottom-20px">
                            <input
                                type="checkbox"
                                name="navmenu"
                                className="app-open-close-input"
                                id="navmenu-cah" />
                            <div className="grid grid-2x margin-bottom-10px">
                                <div className="col-1">
                                    <div className="display-flex-normal margin-top-10px">
                                        <i className="fa fa-1x fa-luggage-cart margin-right-5px"></i>
                                        <span className="txt-site txt-11 txt-main">Payroll TPL Header</span>
                                    </div>
                                </div>
                                <div className="col-2 content-right">
                                    <label htmlFor="navmenu-cah">
                                        <div className="app-open-close-icon"></div>
                                    </label>
                                </div>
                            </div>
                            <div className="app-open-close-content">
                                <FormPayroll 
                                    onClickSave={this.props.onClickSave}
                                />
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
                                        <i className="fa fa-1x fa-luggage-cart margin-right-5px"></i>
                                        <span className="txt-site txt-11 txt-main"> Payroll TPL Detail</span>
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
                                <FormCreatePayroll1
                                    onClickSave={this.openSavePopUp.bind(this)}
                                    onClickClose={() => this.opPopupPage("popup-payroll")}
                                />
                            }
                            <div className="app-open-close-content">
                                <PayrollTemplateDetail />
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
                                        <i className="fa fa-1x fa-luggage-cart margin-right-5px"></i>
                                        <span className="txt-site txt-11 txt-main"> Payroll TPL Visualization</span>
                                    </div>
                                </div>
                                <div className="col-2 content-right">
                                    <label htmlFor="navmenu-cuh">
                                        <div className="app-open-close-icon"></div>
                                    </label>
                                </div>
                            </div>
                            <div className="app-open-close-content">
                                -- DOCUMENT --
                            </div>
                        </div>
                    </div>
                    <div className="display-flex-normals margin-bottom-15px">
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

export default FormEditPayroll