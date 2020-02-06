import React, { Component } from 'react'
import PopUp from '../../../pages/PopUpAlert'
import TableTravelExpense from '../tables/tableTravelExpense'
import FormEditTravel from './edit/travel/formEditTravel'
import ResizeSlider from '../../../../modules/resize/Slider'
import API from '../../../../Services/Api'
import M from 'moment'
import * as R from 'ramda'
import { getBizpar } from '../../../../Services/Utils'
import { connect } from 'react-redux'
import FormTravelExp from './edit/travel/formTravelExp'

const clSlidePage = 'a-s-p-main'

class ConfTravelExpense extends Component {
    constructor(props) {
        super(props)
        this.state = {
            auth: props.auth,
            classAppSlidePage: 'app-side-page',
            classAppSlidePageMain: clSlidePage,
            savePopUpVisible: false,
            deletePopUpVisible: false,
            editTravel: false,
            // important for resize pane
            allowResize: false,
            defaultSize: 0,
            minSize: 0,
            maxSize: 0,
            rawData: [],
            bizparCorporateLevel: [],
            bizparCorporatePosition: [],
            bizparSppdCostClass: [],
            bizparSppdTripType: [],
            bizparSppdType: [],
            bizparSppdCostCategory: [],
            bizparSppdCostType: [],
            bizparCurrency: [],
            dataTable: []
        }
    }

    componentDidMount() {
        this.getDataTravelExp()
        this.getBizpar()
        this.getEsTpljson()
    }

    async getDataTravelExp() {
        let payload = {
            "limit": 100,
            "offset": 0,
            "params": {}
        }

        let response = await API.create("CFG").getAllCorporateTravelExpense(payload)
        if (response.data && response.data.status === "S") {
            let dataTable = response.data.data.map((value, index) => {
                const { tripType, travelType, travelCategory, ouid, corporateTravelExpenseStatus } = value
                return [
                    ouid && ouid.oulevel ? ouid.oulevel.bizparValue : "",
                    ouid && ouid.ouposition ? ouid.ouposition.bizparValue : "",
                    tripType.bizparValue,
                    travelType.bizparValue,
                    travelCategory.bizparValue,
                    corporateTravelExpenseStatus
                ]
            })
            this.setState({ rawData: response.data.data, dataTable })
        } else {
            alert("Failed: " + response.data.message)
        }
    }

    async getBizpar() {
        let bizparCorporateLevel = await getBizpar('CORPORATE_LEVEL')
        let bizparSppdTripType = await getBizpar('SPPD_TRIP_TYPE')
        let bizparSppdType = await getBizpar('SPPD_TYPE')
        let bizparSppdCostClass = await getBizpar('SPPD_COST_CLASS')
        let bizparSppdCostCategory = await getBizpar('SPPD_COST_CATEGORY')
        let bizparSppdCostType = await getBizpar('SPPD_COST_TYPE')
        let bizparCurrency = await getBizpar('CURRENCY')

        this.setState({
            bizparCorporateLevel,
            bizparSppdTripType,
            bizparSppdType,
            bizparSppdCostClass,
            bizparSppdCostCategory,
            bizparSppdCostType,
            bizparCurrency
        })
    }


    async getEsTpljson() {
        let response = await API.create('ES').getTplJson(this.state.auth.user.companyID)
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

        let response = await API.create('ES').getEsByLevel(payload)
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

    handlePosition(level) {
        this.getEsByLevel(level)
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
        this.getEsTpljson()
        this.setState({
            editTravel: false,
            allowResize: false,
            defaultSize: 0,
            minSize: 0,
            maxSize: 0
        })
    }

    opSidePage = (menu, index) => (e) => {
        this.setState({
            classAppSlidePage: 'app-side-page op-app-side',
            editTravel: false
        })

        this.opResizePane()

        switch (menu) {
            case 'slide-travel':
                this.setState({
                    editTravel: true,
                    travelData: this.state.rawData[index],
                    travelDataPosition: this.state.rawData[index].ouid && this.state.rawData[index].ouid.ouposition ? this.state.rawData[index].ouid.ouposition.bizparValue : ""
                })
                break;
            default:
                break
        }

    }

    clSidePage = () => {
        this.setState({ classAppSlidePage: 'app-side-page' })
    }

    openCreateForm = (type = "create", close = false) => {
        this.clResizePane()
        this.setState({ createVisible: !this.state.createVisible, type })
        if (close === true) this.getEsTpljson()
    }

    openSavePopUp = () => {
        this.clResizePane()
        this.setState({
            savePopUpVisible: !this.state.savePopUpVisible,
            createVisible: false,
            editTravel: false,
            classAppSlidePage: 'app-side-page'
        })
    }

    openDeletePopUp = (index, type) => {
        this.setState({
            deletePopUpVisible: !this.state.deletePopUpVisible,
            selectedIndex: index,
        })
        if (type !== "delete-detail") return this.clResizePane()
    }

    async handleSubmit(payload) {
        let response = await API.create("CFG").postCorporateTravelExpense(payload)
        if (response.ok && response.data.status === 'S') {
            this.openSavePopUp()
            this.getDataTravelExp()
        } else {
            alert("Failed: " + response.data.message)
        }
    }

    async handleUpdate(payload, type) {
        let { travelData } = this.state
        let dataDetail = Object.assign([], travelData.corporateTravelExpenseDetails)
        dataDetail = dataDetail.map((value, index) => {
            return {
                ...value,
                "budgetCategory": value.budgetCategory.bizparKey,
                "budgetClass": value.budgetClass.bizparKey,
                "budgetCurrency": value.budgetCurrency.bizparKey,
                "budgetType": value.budgetType.bizparKey,
                "budgetValue": value.budgetValue
            }
        })
        console.log('tipe', type)
        switch (type) {
            case "create-detail":
                dataDetail.push(payload)
                payload = {
                    "corporateTravelExpenseID": travelData.corporateTravelExpenseID,
                    "travelType": travelData.travelType.bizparKey,
                    "travelCategory": travelData.travelCategory.bizparKey,
                    "tripType": travelData.tripType.bizparKey,
                    "corporateTravelExpenseDetails": dataDetail,
                    "corporateTravelExpenseStatus": travelData.corporateTravelExpenseStatus,
                    "corporateTravelExpenseCreational": {
                        ...travelData.corporateTravelExpenseCreational,
                        "modifiedBy": "SYSTEM",
                        "modifiedDate": M().format("DD-MM-YYYY HH:mm:ss")
                    },
                    "esid": travelData.esid.esid,
                    "ouid": travelData.ouid ? travelData.ouid.ouid : ""
                }
                break;
            case "update-detail":
                let isSame = R.findIndex(R.propEq('corporateTravelExpenseDetailID', payload.corporateTravelExpenseDetailID))(dataDetail)
                if (isSame >= 0) {
                    dataDetail[isSame] = payload
                }

                payload = {
                    "corporateTravelExpenseID": travelData.corporateTravelExpenseID,
                    "travelType": travelData.travelType.bizparKey,
                    "travelCategory": travelData.travelCategory.bizparKey,
                    "tripType": travelData.tripType.bizparKey,
                    "corporateTravelExpenseDetails": dataDetail,
                    "corporateTravelExpenseStatus": travelData.corporateTravelExpenseStatus,
                    "corporateTravelExpenseCreational": {
                        ...travelData.corporateTravelExpenseCreational,
                        "modifiedBy": "SYSTEM",
                        "modifiedDate": M().format("DD-MM-YYYY HH:mm:ss")
                    },
                    "esid": travelData.esid.esid,
                    "ouid": travelData.ouid ? travelData.ouid.ouid : ""
                }

                break;
            case "delete-detail":
                dataDetail.splice(payload, 1)
                payload = {
                    "corporateTravelExpenseID": travelData.corporateTravelExpenseID,
                    "travelType": travelData.travelType.bizparKey,
                    "travelCategory": travelData.travelCategory.bizparKey,
                    "tripType": travelData.tripType.bizparKey,
                    "corporateTravelExpenseDetails": dataDetail,
                    "corporateTravelExpenseStatus": travelData.corporateTravelExpenseStatus,
                    "corporateTravelExpenseCreational": {
                        ...travelData.corporateTravelExpenseCreational,
                        "modifiedBy": "SYSTEM",
                        "modifiedDate": M().format("DD-MM-YYYY HH:mm:ss")
                    },
                    "esid": travelData.esid.esid,
                    "ouid": travelData.ouid ? travelData.ouid.ouid : ""
                }
                this.setState({
                    deletePopUpVisible: false
                })
                break;
            default:
                payload = {
                    ...payload,
                    corporateTravelExpenseDetails: dataDetail
                }
                break;
        }

        let response = await API.create("CFG").updateCorporateTravelExpense(payload)
        if (response.ok && response.data.status === 'S') {
            this.openSavePopUp()
            this.getDataTravelExp()
        } else {
            alert("Failed: " + response.data.message)
        }
    }

    async handleDelete() {
        let { rawData, selectedIndex } = this.state
        let payload = {
            "referenceID": rawData[selectedIndex].corporateTravelExpenseID,
            "requestBy": "SYSTEM",
            "requestDate": M().format("DD-MM-YYYY HH:mm:ss")
        }

        let response = await API.create("CFG").deleteCorporateTravelExpense(payload)
        if (response.ok && response.data.status === 'S') {
            this.setState({ deletePopUpVisible: !this.state.deletePopUpVisible })
            this.getDataTravelExp()
        } else {
            alert("Failed: " + response.data.message)
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
                                                    <i className="color-blue fa fa-1x fa-luggage-cart margin-right-10px"></i>
                                                </div>
                                                <div>
                                                    <div className="txt-site txt-12 txt-bold txt-main">
                                                        Travel Expense
                                                </div>
                                                    <div className="txt-site txt-10 txt-thin txt-primary">
                                                        Travel Expense
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
                                                <div className="col-1"></div>
                                                <div className="col-2 content-right">
                                                    <label htmlFor="navmenu-ch">
                                                        <div className="app-open-close-icon"></div>
                                                    </label>
                                                    <button
                                                        className="btn btn-small-circle btn-sekunder margin-left-5px"
                                                        onClick={() => this.openCreateForm("create", false)}>
                                                        <i className="fa fa-lw fa-plus" />
                                                    </button>
                                                </div>
                                                {this.state.createVisible &&
                                                    <FormTravelExp
                                                        type="create"
                                                        bizparCorporateLevel={this.state.bizparCorporateLevel}
                                                        bizparSppdTripType={this.state.bizparSppdTripType}
                                                        bizparSppdType={this.state.bizparSppdType}
                                                        bizparSppdCostCategory={this.state.bizparSppdCostCategory}
                                                        bizparCorporatePosition={this.state.bizparCorporatePosition}
                                                        handleChange={this.handlePosition.bind(this)}
                                                        onClickSave={this.handleSubmit.bind(this)}
                                                        onClickClose={this.openCreateForm.bind(this)} />}
                                            </div>
                                            <div className="app-open-close-content">
                                                <TableTravelExpense
                                                    dataTable={this.state.dataTable}
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
                            {(this.state.editTravel)
                                ? (<FormEditTravel
                                    travelData={this.state.travelData}
                                    travelDataPosition={this.state.travelDataPosition}
                                    bizparCorporateLevel={this.state.bizparCorporateLevel}
                                    bizparSppdCostClass={this.state.bizparSppdCostClass}
                                    bizparSppdTripType={this.state.bizparSppdTripType}
                                    bizparSppdType={this.state.bizparSppdType}
                                    bizparSppdCostType={this.state.bizparSppdCostType}
                                    bizparSppdCostCategory={this.state.bizparSppdCostCategory}
                                    bizparCorporatePosition={this.state.bizparCorporatePosition}
                                    bizparCurrency={this.state.bizparCurrency}
                                    closeSlide={this.clResizePane}
                                    onDeletePopUp={this.openDeletePopUp.bind(this)}
                                    handleChange={this.handlePosition.bind(this)}
                                    onClickSave={this.handleUpdate.bind(this)} />)
                                : null}
                        </div>
                    )}></ResizeSlider>

                {this.state.savePopUpVisible && (
                    <PopUp
                        type={"save"}
                        class={"app-popup app-popup-show"}
                        onClick={this.openSavePopUp}
                    />
                )}

                {this.state.deletePopUpVisible && (
                    <PopUp
                        type={"delete"}
                        class={"app-popup app-popup-show"}
                        onClick={this.openDeletePopUp}
                        onClickDelete={this.state.editTravel ? () => this.handleUpdate(this.state.selectedIndex, "delete-detail") : this.handleDelete.bind(this)}
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

export default connect(mapStateToProps, null)(ConfTravelExpense)
