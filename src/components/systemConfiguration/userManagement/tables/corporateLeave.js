import React, { Component } from 'react'
import PopUp from '../../../pages/PopUpAlert'
import TableLeaveType from '../tables/confCorporateLeave/tableLeaveType'
import TableLeavePlafon from './confCorporateLeave/tableLeavePlafon'
import FormEditCorporateLeaveTypes from '../forms/edit/corporateLeave/formEditCorporateLeaveTypes'
import FormEditCorporateLeaveCategory from '../forms/edit/corporateLeave/formEditCorporateLeaveCategory'
import FormCreateCorporateLeaveTypes from '../forms/create/corporateLeave/formCreateCorporateLeaveTypes'
import FormCreateCorporateLeaveCategory from '../forms/create/corporateLeave/formCreateCorporateLeaveCategory'

const clSlidePage = 'a-s-p-main'

class ConfCorporateLeave extends Component {
    constructor(props) {
        super(props)
        this.state = {
            classAppSlidePage: 'app-side-page',
            classAppSlidePageMain: clSlidePage,
            savePopUpVisible: false,
            deletePopUpVisible: false,
            createLeave1: false,
            createLeave2: false,
            editLeave: false,
            editLeave2: false
        }
    }

    opSidePage = (menu) => (e) => {
        this.setState({
            classAppSlidePage: 'app-side-page op-app-side',
            editLeave: false,
            editLeave2: false
        })
        switch (menu) {
            case 'slide-Leave':
                this.setState({
                    editLeave: true
                })
                break;
            case 'slide-Leave-2':
                this.setState({
                    editLeave2: true
                })
                break;
            default:
                break
        }

    }

    clSidePage = () => {
        this.setState({ classAppSlidePage: 'app-side-page' })
    }

    openSavePopUp = () => {
        this.setState({
            savePopUpVisible: !this.state.savePopUpVisible,
            editLeave: false,
            editLeave2: false,
            classAppSlidePage: 'app-side-page'
        })
    }

    openDeletePopUp = (rawData, index, type) => {
        this.setState({
            deletePopUpVisible: !this.state.deletePopUpVisible, selectedIndex: index, rawData: rawData, formType: type,
            editLeave: false,
            editLeave2: false,
            classAppSlidePage: 'app-side-page'
        })
    }

    opPopupPage = (type) => {
        let savePopUpVisible;
        this.setState({
            editLeave: false,
            editLeave2: false,
            classAppSlidePage: 'app-side-page'
        })
        switch (type) {
            case "popup-leave-1":
                savePopUpVisible = this.state.savePopUpVisible ? !this.state.savePopUpVisible : false
                this.setState({ createLeave1: !this.state.createLeave1, savePopUpVisible })
                break;
            case "popup-leave-2":
                savePopUpVisible = this.state.savePopUpVisible ? !this.state.savePopUpVisible : false
                this.setState({ createLeave2: !this.state.createLeave2, savePopUpVisible })
                break;
            default:
                break;
        }
    }

    handleSubmit() {
        this.setState({
            createLeave1: false,
            createLeave2: false,
            editLeave: false,
            editLeave2: false,
            savePopUpVisible: false
        })
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
                                            <i className="color-blue fa fa-1x fa-sign-out-alt margin-right-10px"></i>
                                        </div>
                                        <div>
                                            <div className="txt-site txt-12 txt-bold txt-main">
                                                Corporate Leave
                                            </div>
                                            <div className="txt-site txt-10 txt-thin txt-primary">
                                                Corporate Leave
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
                                                <i className="fa fa-1x fa-sign-out-alt margin-right-5px"></i>
                                                <span className="txt-site txt-11 txt-main">Leave Types</span>
                                            </div>
                                        </div>
                                        <div className="col-2 content-right">
                                            <label htmlFor="navmenu-ch">
                                                <div className="app-open-close-icon"></div>
                                            </label>
                                            <button
                                                onClick={() => this.opPopupPage('popup-leave-1')}
                                                className="btn btn-small-circle btn-sekunder margin-left-5px">
                                                <i className="fa fa-lw fa-plus" />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="app-open-close-content">
                                        <TableLeaveType
                                            openSlide={this.opSidePage('slide-Leave')}
                                            onDeletePopup={this.openDeletePopUp.bind(this)}
                                        />
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
                                                <i className="fa fa-1x fa-sign-out-alt margin-right-5px"></i>
                                                <span className="txt-site txt-11 txt-main">Leave Plafon</span>
                                            </div>
                                        </div>
                                        <div className="col-2 content-right">
                                            <label htmlFor="navmenu-coh">
                                                <div className="app-open-close-icon"></div>
                                            </label>
                                            <button
                                                onClick={() => this.opPopupPage('popup-leave-2')}
                                                className="btn btn-small-circle btn-sekunder margin-left-5px">
                                                <i className="fa fa-lw fa-plus" />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="app-open-close-content">
                                        <TableLeavePlafon
                                            openSlide={this.opSidePage('slide-Leave-2')}
                                            onDeletePopup={this.openDeletePopUp.bind(this)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="a-s-p-side">
                    {/* edit */}
                    {(this.state.editLeave)
                        ? (<FormEditCorporateLeaveTypes
                            rawData={this.state.rawData}
                            closeSlide={this.clSidePage}
                            onClickSave={this.openSavePopUp.bind(this)} />)
                        : null}
                    {(this.state.editLeave2)
                        ? (<FormEditCorporateLeaveCategory
                            rawData={this.state.rawData}
                            closeSlide={this.clSidePage}
                            onClickSave={this.openSavePopUp.bind(this)} />)
                        : null}
                </div>

                {/* create */}
                {(this.state.createLeave1)
                    ? (<FormCreateCorporateLeaveTypes
                        onClickClose={() => this.opPopupPage("popup-leave-1")}
                        onClickSave={this.openSavePopUp.bind(this)}
                    />)
                    : null}
                {(this.state.createLeave2)
                    ? (<FormCreateCorporateLeaveCategory
                        onClickClose={() => this.opPopupPage("popup-leave-2")}
                        onClickSave={this.openSavePopUp.bind(this)}
                    />)
                    : null}

                {/* notification */}
                {this.state.savePopUpVisible && (
                    <PopUp
                        type={"save"}
                        class={"app-popup app-popup-show"}
                        onClick={this.handleSubmit.bind(this)}
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


export default ConfCorporateLeave
