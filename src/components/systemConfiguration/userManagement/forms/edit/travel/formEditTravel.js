import React, { Component } from 'react'
import ReactTooltip from 'react-tooltip'
import FormTravelExp from './formTravelExp'
import TableTravelExpenseEdit from '../../../tables/confTravel/tableTravelExpEdit'
import FormTravelExpCreate from '../../create/travel/formTravelExpCreate'
import PopUp from '../../../../../pages/PopUpAlert'

class FormEditTravel extends Component {
    constructor(props) {
        super(props)
        this.state = {
            createTravel: false,
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
            case "popup-travel":
                savePopUpVisible = this.state.savePopUpVisible ? !this.state.savePopUpVisible : false
                this.setState({ createTravel: !this.state.createTravel, savePopUpVisible })
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
                                <i className="fa fa-1x fa-luggage-cart"></i>
                                <span className="txt-site txt-11 txt-main margin-left-10px">
                                    Travel Expense
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
                    <div className="padding-10px">
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
                                            <i className="fa fa-1x fa-luggage-cart margin-right-5px"></i>
                                            <span className="txt-site txt-11 txt-main">Travel Expense Header</span>
                                        </div>
                                    </div>
                                    <div className="col-2 content-right">
                                        <label htmlFor="navmenu-cah">
                                            <div className="app-open-close-icon"></div>
                                        </label>
                                    </div>
                                </div>
                                <div className="app-open-close-content">
                                    <FormTravelExp
                                        type={"update"}
                                        travelData={this.props.travelData}
                                        travelDataPosition={this.props.travelDataPosition}
                                        bizparCorporateLevel={this.props.bizparCorporateLevel}
                                        bizparCorporatePosition={this.props.bizparCorporatePosition}
                                        bizparSppdCostClass={this.props.bizparSppdCostClass}
                                        bizparSppdTripType={this.props.bizparSppdTripType}
                                        bizparSppdType={this.props.bizparSppdType}
                                        bizparSppdCostCategory={this.props.bizparSppdCostCategory}
                                        handleChange={this.props.handleChange.bind(this)}
                                        onClickSave={this.props.onClickSave.bind(this)}
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
                                            <span className="txt-site txt-11 txt-main">Travel Expense Detail</span>
                                        </div>
                                    </div>
                                    <div className="col-2 content-right">
                                        <label htmlFor="navmenu-cih">
                                            <div className="app-open-close-icon"></div>
                                        </label>
                                        <button
                                            className="btn btn-small-circle btn-sekunder margin-left-5px"
                                            onClick={() => this.opPopupPage("popup-travel")}>
                                            <i className="fa fa-lw fa-plus" />
                                        </button>
                                    </div>
                                </div>
                                {this.state.createTravel &&
                                    <FormTravelExpCreate
                                        type={"create"}
                                        bizparSppdCostType={this.props.bizparSppdCostType}
                                        bizparSppdTripType={this.props.bizparSppdTripType}
                                        bizparSppdCostCategory={this.props.bizparSppdCostCategory}
                                        bizparSppdCostClass={this.props.bizparSppdCostClass}
                                        bizparCurrency={this.props.bizparCurrency}
                                        onClickSave={this.props.onClickSave.bind(this)}
                                        onClickClose={() => this.opPopupPage("popup-travel")}
                                    />}
                                <div className="app-open-close-content">
                                    <TableTravelExpenseEdit
                                        bizparSppdCostType={this.props.bizparSppdCostType}
                                        bizparSppdTripType={this.props.bizparSppdTripType}
                                        bizparSppdCostCategory={this.props.bizparSppdCostCategory}
                                        bizparSppdCostClass={this.props.bizparSppdCostClass}
                                        bizparCurrency={this.props.bizparCurrency}
                                        rawData={this.props.travelData}
                                        onDeletePopUp={this.props.onDeletePopUp.bind(this)}
                                        onClickSave={this.props.onClickSave.bind(this)}
                                        onClickClose={() => this.opPopupPage("popup-travel")}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="display-flex-normals margin-bottom-15px"></div>
                    </div>
                </div>
                {this.state.savePopUpVisible && (
                    <PopUp
                        type={"save"}
                        class={"app-popup app-popup-show"}
                        onClick={() => this.opPopupPage("popup-travel")}
                    />
                )}
                <ReactTooltip />
            </div >
        )
    }
}

export default FormEditTravel