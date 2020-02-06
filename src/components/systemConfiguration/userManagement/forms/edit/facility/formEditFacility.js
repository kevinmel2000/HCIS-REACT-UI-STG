import React, { Component } from 'react'
import ReactTooltip from 'react-tooltip'
import PopUp from '../../../../../pages/PopUpAlert'
import TableFacilityDetail from './tableFacilityDetail'
import FormFacilityDetail from '../../create/facility/formFacilityDetail'
import FormFacilityCreate from '../../create/facility/formFacilityCreate'

class formEditFacility extends Component {
    constructor(props) {
        super(props)
        this.state = {
            createDetail: false,
            savePopUpVisible: false
        }
    }

    openForm = () => {
        let savePopUpVisible = this.state.savePopUpVisible ? !this.state.savePopUpVisible : false
        this.setState({ createDetail: !this.state.createDetail, savePopUpVisible })
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
                                <i className="fa fa-1x fa-laptop"></i>
                                <span className="txt-site txt-11 txt-main margin-left-10px">
                                    Facility
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
                        <div className="app-open-close margin-bottom-20px">
                            <input
                                type="checkbox"
                                name="navmenu"
                                className="app-open-close-input"
                                id="navmenu-cah" />
                            <div className="grid grid-2x margin-bottom-10px">
                                <div className="col-1" style={{ marginLeft: "-10px" }}>
                                    <div className="display-flex-normal margin-top-10px">
                                        <i className="fa fa-1x fa-laptop margin-right-4px"></i>
                                        <span className="txt-site txt-11 txt-main" style={{ marginRight: "-10px" }}>Facility Template Header</span>
                                    </div>
                                </div>
                                <div className="col-2 content-right">
                                    <label htmlFor="navmenu-cah">
                                        <div className="app-open-close-icon"></div>
                                    </label>
                                </div>
                            </div>
                            <div className="app-open-close-content">
                                <FormFacilityCreate
                                    type={"update"}
                                    payloadFacility={this.props.payloadFacility}
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
                                        <i className="fa fa-1x fa-laptop margin-right-5px"></i>
                                        <span className="txt-site txt-11 txt-main">Facility Template Detail</span>
                                    </div>
                                </div>
                                <div className="col-2 content-right">
                                    <label htmlFor="navmenu-cih">
                                        <div className="app-open-close-icon"></div>
                                    </label>
                                    <button
                                        className="btn btn-small-circle btn-sekunder margin-left-5px"
                                        onClick={() => this.openForm()}>
                                        <i className="fa fa-lw fa-plus" />
                                    </button>
                                </div>
                            </div>
                            {this.state.createDetail &&
                                <FormFacilityDetail
                                    type={"create"}
                                    bizparFacilityType={this.props.bizparFacilityType}
                                    onClickSave={this.props.onClickSave.bind(this)}
                                    onClickClose={() => this.openForm()}
                                />}
                            <div className="app-open-close-content">
                                <TableFacilityDetail
                                    payloadFacility={this.props.payloadFacility}
                                    bizparFacilityType={this.props.bizparFacilityType}
                                    onDeletePopUp={this.props.onDeletePopUp.bind(this)}
                                    onClickSave={this.props.onClickSave.bind(this)}
                                    onClickClose={() => this.openForm()}
                                />
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
                        onClick={() => this.openForm()}
                    />
                )}
                <ReactTooltip />
            </div >
        )
    }
}

export default formEditFacility