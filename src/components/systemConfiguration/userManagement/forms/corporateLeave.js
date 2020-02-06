import React, { Component } from 'react'
import PopUp from '../../../pages/PopUpAlert'
import TableLeaveType from '../tables/confCorporateLeave/tableLeaveType'
import TableLeavePlafon from '../tables/confCorporateLeave/tableLeavePlafon'
import FormEditCorporateLeaveTypes from '../forms/edit/corporateLeave/formEditCorporateLeaveTypes'
import FormEditCorporateLeavePlafon from './edit/corporateLeave/formEditCorporateLeavePlafon'
import FormCreateCorporateLeaveTypes from '../forms/create/corporateLeave/formCreateCorporateLeaveTypes'
import FormCreateCorporateLeavePlafon from './create/corporateLeave/formCreateCorporateLeavePlafon'

import ResizeSlider from '../../../../modules/resize/Slider'
import Api from '../../../../Services/Api'
import { connect } from 'react-redux'
import { getBizpar } from '../../../../Services/Utils'
import M from 'moment'

class ConfCorporateLeave extends Component {
    constructor(props) {
        super(props)
        this.state = {
            companyID: this.props.auth.user.companyID,
            savePopUpVisible: false,
            deletePopUpVisible: false,
            createLeaveType: false,
            createLeavePlafon: false,
            editLeaveType: false,
            editLeavePlafon: false,
            allowResize: false,
            defaultSize: 0,
            minSize: 0,
            maxSize: 0,
            auth: props.auth,
            rawDataType: [],
            rawDataPlafon: [],
            bizparLeaveType: [],
            bizparLeaveCategory: [],
            bizparGender: [],
            bizparReligion: [],
            bizparCorporateLevel: [],
            bizparCorporatePosition: [],
            dataTableType: [],
            dataTablePlafon: []
        }
    }

    componentDidMount() {
        this.getDataLeaveType()
        this.getDataLeavePlafon()
        this.getEsTpljson()
        this.getBizpar()
    }

    async getDataLeaveType() {
        this.refs.child.getData(0, 5);
        // let payload = {
        //     "limit": 100,
        //     "offset": 0,
        //     "params": {
        //         "esID": this.state.auth.user.companyID
        //     }
        // }
        // let response = await Api.create('CFG').getCorporateLeaveTypeByEsid(payload)
        // if (response.ok && response.data.status === 'S') {
        //     if(response.data.code === "201") {
        //         let dataTableType = response.data.data.map((value, index) => {
        //             const { leaveType, leaveCategory, leaveDuration, isAllGender, isAllReligion } = value
        //             return [
        //                 leaveType ? leaveType.bizparValue : "",
        //                 leaveCategory ? leaveCategory.bizparValue : "",
        //                 leaveDuration,
        //                 isAllGender,
        //                 isAllReligion
        //             ]
        //         })
        //         this.setState({ rawDataType: response.data.data, dataTableType })
        //     }
        // } else {
        //     alert("Failed: "+response.data.message)
        // }
    }

    async getDataLeavePlafon() {
        this.refs.child2.getData(0, 5);
        // let payload = {
        //     "limit": 100,
        //     "offset": 0,
        //     "params": {
        //         "esID": this.state.auth.user.companyID
        //     }
        // }
        // let response = await Api.create('CFG').getCorporateLeavePlafonByEsid(payload)
        // if (response.ok && response.data.status === 'S') {
        //     if (response.data.code === '201') {
        //         let dataTablePlafon = response.data.data.map((value, index) => {
        //             const { position, leavePlafon, corporateLeavePlafonStatus } = value
        //             return [
        //                 position && position.oulevel ? position.oulevel.bizparValue : "",
        //                 (position && position.ouposition ? position.ouposition.bizparKey : "") + "|" + (position && position.ouposition ? position.ouposition.bizparValue : ""),
        //                 leavePlafon,
        //                 corporateLeavePlafonStatus
        //             ]
        //         })
        //         this.setState({ rawDataPlafon: response.data.data, dataTablePlafon })
        //     }
        // } else {
        //     alert("Failed: "+response.data.message)
        // }
    }

    async getEsTpljson() {
        let response = await Api.create('ES').getTplJson(this.state.auth.user.companyID)
        if (response.ok && response.data.status === 'S') {
            let bizparCorporatePosition = response.data.data.map((value, index) => {
                const { ouid, ouposition } = value
                return {
                    bizparKey: ouid,
                    bizparValue: ouposition && ouposition.bizparValue
                }
            })
            const dataPosition = [...new Map(bizparCorporatePosition.map(o => [o.bizparKey, o])).values()]
            this.setState({
                bizparCorporatePosition: dataPosition
            })
        }
    }

    async getEsByLevel(level) {
        let payload = {
            "limit": 100,
            "offset": 0,
            "params": {
                "eSID": this.state.auth.user.companyID,
                "level": level
            }
        }

        let response = await Api.create('ES').getEsByLevel(payload)
        if (response.ok && response.data.status === 'S') {
            let bizparCorporatePosition = response.data.data.map((value, index) => {
                return {
                    bizparKey: value.ouid,
                    bizparValue: value.ouposition && value.ouposition.bizparValue
                }
            })

            this.setState({
                bizparCorporatePosition
            })
        } else alert("Failed: " + response.data.message)
    }

    async getBizpar() {
        let bizparLeaveType = await getBizpar('LEAVE_TYPE')
        let bizparLeaveCategory = await getBizpar('LEAVE_CATEGORY')
        let bizparGender = await getBizpar('GENDER_TYPE')
        let bizparReligion = await getBizpar('RELIGION_TYPE')
        let bizparCorporateLevel = await getBizpar('CORPORATE_LEVEL')
        // let bizparCorporatePosition = await getBizpar('CORPORATE_POSITION')

        this.setState({
            bizparLeaveType,
            bizparLeaveCategory,
            bizparGender,
            bizparReligion,
            bizparCorporateLevel,
            // bizparCorporatePosition
        })
    }

    async handleSubmit(payload, type) {
        console.log("sumbit", type, payload)
        switch (type) {
            case "leave-type":
                let response = await Api.create('CFG').postCorporateLeaveType(payload)
                if (response.ok && response.data.status === 'S') {
                    this.openSavePopUp()
                    this.getDataLeaveType()
                } else alert("Failed: " + response.data.message)
                break;
            case "leave-plafon":
                let res = await Api.create('CFG').postCorporateLeavePlafon(payload)
                if (res.ok && res.data.status === 'S') {
                    this.openSavePopUp()
                    this.getDataLeavePlafon()
                } else alert("Failed: " + response.data.message)
                break;
            default:
                break;
        }
    }

    async handleUpdate(payload, type) {
        console.log("update", type)
        switch (type) {
            case "update-type":
                let response = await Api.create('CFG').updateCorporateLeaveType(payload)
                if (response.ok && response.data.status === 'S') {
                    this.openSavePopUp()
                    this.getDataLeaveType()
                } else alert("Failed: " + response.data.message)
                break
            case "update-plafon":
                let res = await Api.create('CFG').updateCorporateLeavePlafon(payload)
                if (res.ok && res.data.status === 'S') {
                    this.openSavePopUp()
                    this.getDataLeavePlafon()
                } else alert("Failed: " + response.data.message)
                break
            default:
                break
        }
    }

    async handleDelete(index, type) {
        index = this.state.selectedIndex
        type = this.state.formType
        switch (type) {
            case "delete-type":
                let payload = this.state.rawDataType
                payload = {
                    "referenceID": payload.corporateLeaveID,
                    "requestBy": "SYSTEM",
                    "requestDate": M().format("DD-MM-YYYY HH:mm:ss")
                }
                let response = await Api.create('CFG').deleteCorporateLeaveType(payload)
                if (response.ok && response.data.status === 'S') {
                    this.setState({ deletePopUpVisible: false })
                    this.getDataLeaveType()
                } else alert("Failed: " + response.data.message)
                break
            case "delete-plafon":
                let payloadPlafon = this.state.rawDataPlafon
                payloadPlafon = {
                    "referenceID": payloadPlafon.corporateLeavePlafonID,
                    "requestBy": "SYSTEM",
                    "requestDate": M().format("DD-MM-YYYY HH:mm:ss")
                }
                let res = await Api.create('CFG').deleteCorporateLeavePlafon(payloadPlafon)
                if (res.ok && res.data.status === 'S') {
                    this.setState({ deletePopUpVisible: false })
                    this.getDataLeavePlafon()
                } else alert("Failed: " + response.data.message)
                break
            default:
                break
        }
    }

    opResizePane = () => {
        this.setState({
            allowResize: true,
            defaultSize: 370,
            minSize: 370,
            maxSize: 850
        })
    }

    clResizePane = () => {
        this.setState({
            allowResize: false,
            defaultSize: 0,
            minSize: 0,
            maxSize: 0
        })
    }

    opSidePage = (menu, selectedIndex) => (e) => {
        this.setState({
            editLeaveType: false,
            editLeavePlafon: false,
            selectedIndex,
        })
        console.log(selectedIndex)

        this.opResizePane()

        switch (menu) {
            case 'slide-leave-type':
                this.setState({
                    editLeaveType: true,
                    selectedIndex,
                    rawDataType: selectedIndex
                })
                break;
            case 'slide-leave-plafon':
                this.setState({
                    editLeavePlafon: true,
                    selectedIndex,
                    rawDataPlafon: selectedIndex
                })
                break;
            default:
                break
        }

    }

    openSavePopUp = () => {
        this.clResizePane()
        this.setState({
            savePopUpVisible: !this.state.savePopUpVisible,
            editLeaveType: false,
            editLeavePlafon: false
        })
    }

    openDeletePopUp = (index, type) => {
        this.clResizePane()
        this.setState({
            deletePopUpVisible: !this.state.deletePopUpVisible, selectedIndex: index, formType: type, rawDataPlafon: index, rawDataType: index,
            editLeaveType: false,
            editLeavePlafon: false
        })
    }

    opPopupPage = (type) => {
        let savePopUpVisible;
        this.setState({
            editLeaveType: false,
            editLeavePlafon: false
        })
        this.clResizePane()
        switch (type) {
            case "popup-leave-type":
                savePopUpVisible = this.state.savePopUpVisible ? !this.state.savePopUpVisible : false
                this.setState({ createLeaveType: !this.state.createLeaveType, savePopUpVisible })
                break;
            case "popup-leave-plafon":
                savePopUpVisible = this.state.savePopUpVisible ? !this.state.savePopUpVisible : false
                this.setState({ createLeavePlafon: !this.state.createLeavePlafon, savePopUpVisible })
                if (!this.state.createLeavePlafon) this.getEsTpljson()
                break;
            default:
                break;
        }
    }

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
                                                        onClick={() => this.opPopupPage('popup-leave-type')}
                                                        className="btn btn-small-circle btn-sekunder margin-left-5px">
                                                        <i className="fa fa-lw fa-plus" />
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="app-open-close-content">
                                                <TableLeaveType
                                                    ref="child"
                                                    companyID={this.state.companyID}
                                                    dataTableType={this.state.dataTableType}
                                                    openSlide={this.opSidePage.bind(this)}
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
                                                        onClick={() => this.opPopupPage('popup-leave-plafon')}
                                                        className="btn btn-small-circle btn-sekunder margin-left-5px">
                                                        <i className="fa fa-lw fa-plus" />
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="app-open-close-content">
                                                <TableLeavePlafon
                                                    ref="child2"
                                                    companyID={this.state.companyID}
                                                    dataTablePlafon={this.state.dataTablePlafon}
                                                    openSlide={this.opSidePage.bind(this)}
                                                    onDeletePopup={this.openDeletePopUp.bind(this)}
                                                />
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
                            {(this.state.editLeaveType)
                                ? (<FormEditCorporateLeaveTypes
                                    bizparLeaveType={this.state.bizparLeaveType}
                                    bizparLeaveCategory={this.state.bizparLeaveCategory}
                                    bizparGender={this.state.bizparGender}
                                    bizparReligion={this.state.bizparReligion}
                                    leaveType={this.state.rawDataType}
                                    closeSlide={this.clResizePane}
                                    onClickUpdate={this.handleUpdate.bind(this)} />)
                                : null}
                            {(this.state.editLeavePlafon)
                                ? (<FormEditCorporateLeavePlafon
                                    bizparCorporateLevel={this.state.bizparCorporateLevel}
                                    bizparCorporatePosition={this.state.bizparCorporatePosition}
                                    leavePlafon={this.state.rawDataPlafon}
                                    leavePlafonPosition={this.state.rawDataPlafon.position && this.state.rawDataPlafon.position.ouposition ? this.state.rawDataPlafon.position.ouposition.bizparValue : ""}
                                    handleChange={this.getEsByLevel.bind(this)}
                                    closeSlide={this.clResizePane}
                                    onClickUpdate={this.handleUpdate.bind(this)} />)
                                : null}
                        </div>
                    )}>

                </ResizeSlider>

                {/* create */}
                {(this.state.createLeaveType)
                    && (<FormCreateCorporateLeaveTypes
                        bizparLeaveType={this.state.bizparLeaveType}
                        bizparLeaveCategory={this.state.bizparLeaveCategory}
                        bizparGender={this.state.bizparGender}
                        bizparReligion={this.state.bizparReligion}
                        onClickClose={() => this.opPopupPage("popup-leave-type")}
                        onClickSave={this.handleSubmit.bind(this)}
                    />)}
                {(this.state.createLeavePlafon)
                    && (<FormCreateCorporateLeavePlafon
                        bizparCorporateLevel={this.state.bizparCorporateLevel}
                        bizparCorporatePosition={this.state.bizparCorporatePosition}
                        handleChange={this.getEsByLevel.bind(this)}
                        onClickClose={() => this.opPopupPage("popup-leave-plafon")}
                        onClickSave={this.handleSubmit.bind(this)}
                    />)}

                {/* notification */}
                {this.state.savePopUpVisible && (
                    <PopUp
                        type={"save"}
                        class={"app-popup app-popup-show"}
                        onClick={() => this.state.createLeaveType ? this.opPopupPage("popup-leave-type") : this.state.createLeavePlafon ? this.opPopupPage("popup-leave-plafon") : this.setState({ savePopUpVisible: false })}
                    />
                )}

                {this.state.deletePopUpVisible && (
                    <PopUp
                        type={"delete"}
                        class={"app-popup app-popup-show"}
                        onClick={this.openDeletePopUp.bind(this)}
                        onClickDelete={this.handleDelete.bind(this)}
                    />
                )}
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        auth: state.auth
    };
};

export default connect(mapStateToProps, null)(ConfCorporateLeave)
