import React, { Component } from 'react'
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles'
import MUIDataTable from "mui-datatables-bitozen"
import PopUp from '../../../pages/PopUpAlert'
import ResizeSlider from '../../../../modules/resize/Slider'
import FormFacilityCreate from './create/facility/formFacilityCreate'
import FormEditFacility from './edit/facility/formEditFacility'
import Api from '../../../../Services/Api'
import * as R from 'ramda'
import M from 'moment'
import { getBizpar } from '../../../../Services/Utils'
import { connect } from 'react-redux'
import AuthAction from '../../../../Redux/AuthRedux'

var ct = require("../../../../modules/custom/customTable")
const getMuiTheme = () => createMuiTheme(ct.customTable())
const options = ct.customOptions()

const clSlidePage = 'a-s-p-main'

class confFacility extends Component {
    constructor(props) {
        super(props)
        this.state = {
            classAppSlidePage: 'app-side-page',
            classAppSlidePageMain: clSlidePage,
            formCreate: false,
            editPopUpVisible: false,
            savePopUpVisible: false,
            deletePopUpVisible: false,
            editFacility: false,
            dataTable: [],
            rawData: [],
            payloadFacility: [],
            bizparFacilityType: [],
            bizparFacilityCategory: [],
            // important for resize pane
            allowResize: false,
            defaultSize: 0,
            minSize: 0,
            maxSize: 0,
            facilityCount: 0,
            table_limit: 5,
            table_page: 0,
            table_query: "",
            user: this.props.auth.user,
        }
    }

    componentDidMount() {
        // this.getDataFacility()
        this.getBizpar()
        this.getData(this.state.table_page, this.state.table_limit)
    }

    async getData(page, limit) {
        let payload = {
            "limit": limit,
            "offset": page,
            "params": {
                "facilityStatus": "ACTIVE"
            }
          }

        let body = {
            "limit": limit,
            "offset": page,
            "params": {
                "esID": this.props.auth.user.companyID,
                "facilityName": this.state.table_query
            }
        }

        let { companyID } = this.state.user
        if (!R.isEmpty(this.state.table_query)) {
            let res = await Api.create('CFG').getCountFacilityByIdAndName(companyID + '/' + this.state.table_query)
            if (res.ok) {
                this.setState({ facilityCount: res.data.data })
            }

            let response = await Api.create('CFG').getFacilityByIdAndName(body)
            if (response.data && response.data.status === "S") {
                let dataTable = response.data.data.map((value) => {
                    const { facilityID, facilityName, facilityStatus } = value
                    return [
                        facilityID,
                        facilityName,
                        facilityStatus === "ACTIVE" ? "YES" : "NO"
                    ]
                })
                this.setState({ dataTable, rawData: response.data.data }, () => console.log(this.state.dataTable))
            } else if (R.isNil(response.data)) return alert("Failed: " + response.problem)
            else return alert("Failed: " + response.data.message)
        } else {
            // let res = await Api.create('CFG').getCountFacilityByIdAndName(companyID + '/' + "F")
            // if (res.ok) {
            //     this.setState({ facilityCount: res.data.data })
            // }
            
            // console.log('tes',res)

            let res = await Api.create("CFG").getCountFacilityByStatus("ACTIVE")
            this.setState({ facilityCount: res.data.data })

            let response = await Api.create("CFG").getFacilityByStatus(payload)
            if (response.data && response.data.status === "S") {
                let dataTable = response.data.data.map((value) => {
                    const { facilityID, facilityName, facilityStatus } = value
                    return [
                        facilityID,
                        facilityName,
                        facilityStatus === "ACTIVE" ? "YES" : "NO"
                    ]
                })
                this.setState({ dataTable, rawData: response.data.data }, () => console.log(this.state.dataTable))
            } else if (R.isNil(response.data)) return alert("Failed: " + response.problem)
            else return alert("Failed: " + response.data.message)
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
            editFacility: false,
            allowResize: false,
            defaultSize: 0,
            minSize: 0,
            maxSize: 0
        })
    }

    opSidePage = (menu, index) => (e) => {
        this.setState({
            classAppSlidePage: 'app-side-page op-app-side',
            editFacility: false,
            selectedIndex: index
        })

        this.opResizePane()

        switch (menu) {
            case 'slide-facility':
                this.setState({
                    editFacility: true,
                    payloadFacility: this.state.rawData[index]
                })
                break
            default:
                break
        }
    }

    clSidePage = () => {
        let savePopUpVisible
        savePopUpVisible = this.state.savePopUpVisible ? !this.state.savePopUpVisible : false
        this.setState({ classAppSlidePage: 'app-side-page', savePopUpVisible })
    }

    openCreateForm = () => {
        let savePopUpVisible = this.state.savePopUpVisible ? !this.state.savePopUpVisible : false
        this.clResizePane()
        this.setState({ formCreate: !this.state.formCreate, savePopUpVisible })
    }

    openDeletePopUp = (index, type) => {
        this.setState({ deletePopUpVisible: !this.state.deletePopUpVisible, selectedIndex: index })
        if (type !== "delete-detail") return this.clResizePane()
    }

    openSavePopUp = () => {
        this.clResizePane()
        this.setState({ savePopUpVisible: !this.state.savePopUpVisible, editFacility: false })
    }

    async getDataFacility() {
        let payload = {
            "limit": 50,
            "offset": 0,
            "params": {
                "esID": this.props.auth.user.companyID
            }
        }
        let response = await Api.create("CFG").getCorporateFacilityTplByEsId(payload)
        if (response.data && response.data.status === "S") {
            let dataTable = response.data.data.map((value) => {
                const { facilityID, facilityName, facilityStatus } = value
                return [
                    facilityID,
                    facilityName,
                    facilityStatus === "ACTIVE" ? "YES" : "NO"
                ]
            })
            this.setState({ dataTable, rawData: response.data.data }, () => console.log(this.state.dataTable))
        } else if (R.isNil(response.data)) return alert("Failed: " + response.problem)
        else return alert("Failed: " + response.data.message)
    }

    async getBizpar() {
        let bizparFacilityType = await getBizpar('FACILITY_TYPE')

        this.setState({
            bizparFacilityType
        })
    }

    async handleSubmit(payload) {
        payload = {
            ...payload,
            company: this.props.auth.user.companyID
        }
        console.log(payload)
        let response = await Api.create("CFG").postCorporateFacilityTpl(payload)
        if (response.data && response.data.status === "S") {
            this.openSavePopUp()
            this.getData(0, 5)
        } else {
            alert("Failed: " + response.data.message)
        }
    }

    async handleUpdate(payload, type) {
        let { payloadFacility } = this.state
        let dataDetail = Object.assign([], payloadFacility.facilities)
        dataDetail = dataDetail.map((value, index) => {
            return {
                "facilityDetailID": value.facilityDetailID,
                "facilityCategory": value.facilitycategory.bizparKey,
                "facilityDetailNotes": value.facilityDetailNotes,
                "facilityDetailQty": value.facilityDetailQty,
                "facilityType": value.facilityType.bizparKey,
            }
        })
        console.log('tipe', type)
        switch (type) {
            case "create-detail":
                dataDetail.push(payload)
                payload = {
                    "facilityID": payloadFacility.facilityID,
                    "facilityName": payloadFacility.facilityName,
                    "facilityPhotoURL": payloadFacility.facilityPhotoURL,
                    "company": payloadFacility.company.esID,
                    "facilityStatus": payloadFacility.facilityStatus,
                    "facilities": dataDetail,
                    "facilityCreationalDTO": {
                        ...payloadFacility.facilityCreationalDTO,
                        "modifiedBy": "SYSTEM",
                        "modifiedDate": M().format("DD-MM-YYYY HH:mm:ss")
                    },
                    "facilityNotes": payloadFacility.facilityNotes
                }
                break;
            case "update-detail":
                let isSame = R.findIndex(R.propEq('facilityDetailID', payload.facilityDetailID))(dataDetail)
                if (isSame >= 0) {
                    dataDetail[isSame] = payload
                }
                payload = {
                    "facilityID": payloadFacility.facilityID,
                    "facilityName": payloadFacility.facilityName,
                    "facilityPhotoURL": payloadFacility.facilityPhotoURL,
                    "company": payloadFacility.company.esID,
                    "facilityStatus": payloadFacility.facilityStatus,
                    "facilities": dataDetail,
                    "facilityCreationalDTO": {
                        ...payloadFacility.facilityCreationalDTO,
                        "modifiedBy": "SYSTEM",
                        "modifiedDate": M().format("DD-MM-YYYY HH:mm:ss")
                    },
                    "facilityNotes": payloadFacility.facilityNotes
                }
                break;
            case "delete-detail":
                dataDetail.splice(payload, 1)
                payload = {
                    "facilityID": payloadFacility.facilityID,
                    "facilityName": payloadFacility.facilityName,
                    "facilityPhotoURL": payloadFacility.facilityPhotoURL,
                    "company": payloadFacility.company.esID,
                    "facilityStatus": payloadFacility.facilityStatus,
                    "facilities": dataDetail,
                    "facilityCreationalDTO": {
                        ...payloadFacility.facilityCreationalDTO,
                        "modifiedBy": "SYSTEM",
                        "modifiedDate": M().format("DD-MM-YYYY HH:mm:ss")
                    },
                    "facilityNotes": payloadFacility.facilityNotes
                }
                this.setState({
                    deletePopUpVisible: false
                })
                break;
            default:
                payload = {
                    ...payload,
                    facilities: dataDetail,
                    facilityStatus: payload.facilityStatus === true ? "ACTIVE" : "INACTIVE",
                    company: payload.company.esID
                }
                break;
        }

        console.log("after", payload)

        let response = await Api.create("CFG").updateCorporateFacilityTpl(payload)
        if (response.ok && response.data.status === 'S') {
            this.openSavePopUp()
            this.getData(0, 5)
        } else {
            alert("Failed: " + response.data.message)
        }
    }

    async handleDelete() {
        let { rawData, selectedIndex } = this.state
        let payload = {
            "referenceID": rawData[selectedIndex].facilityID,
            "requestBy": "SYSTEM",
            "requestDate": M().format("DD-MM-YYYY HH:mm:ss")
        }

        let response = await Api.create("CFG").deleteCorporateFacilityTpl(payload)
        if (response.ok && response.data.status === 'S') {
            this.setState({ deletePopUpVisible: !this.state.deletePopUpVisible })
            this.getData(0, 5)
        } else {
            alert("Failed: " + response.data.message)
        }
    }


    columns = [
        "Facility Template ID", "Facility Template Name",
        {
            name: "Activation",
            options: {
                customBodyRender: val => {
                    return (
                        <div>
                            <i
                                className="fa fa-lw fa-circle"
                                style={{
                                    color: val === "YES" ? "green" : "brown",
                                    marginRight: 10,
                                    padding: "5px"
                                }}
                            />
                            {val}
                        </div>
                    );
                }
            }
        },
        {
            name: "Action",
            options: {
                customBodyRender: (val, tableMeta) => (
                    <div>
                        <button
                            className="btnAct"
                            style={{ marginRight: 15, backgroundColor: 'transparent' }}
                            onClick={this.opSidePage("slide-facility", tableMeta.rowIndex)}
                        >
                            <i className="fa fa-lw fa-pencil-alt" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }} />
                        </button>
                        <button
                            className="btnAct"
                            style={{ marginRight: 15, backgroundColor: 'transparent' }}
                            onClick={() => this.openDeletePopUp(tableMeta.rowIndex)}>
                            <i className="fa fa-lw fa-trash-alt" style={{ backgroundColor: 'transparent', color: 'red', fontSize: 20 }} />
                        </button>
                    </div>
                )
            }
        }
    ]

    data = [["FC-1032193131", "Facility Template C-LEVEL", "YES"]]

    render() {
        let { facilityCount, table_query } = this.state
        let tableOptions = {
            ...options,
            serverSide: true,
            count: facilityCount,
            searchText: table_query,
            onTableChange: (action, tableState) => {
                switch (action) {
                    case 'changePage':
                        this.setState({ table_page: tableState.page })
                        this.getData(tableState.page, tableState.rowsPerPage);
                        break;
                    case 'changeRowsPerPage':
                        this.setState({ table_limit: tableState.rowsPerPage })
                        this.getData(tableState.page, tableState.rowsPerPage);
                        break;
                    case 'search':
                        let searchText = tableState.searchText ? tableState.searchText : ""
                        this.setState({ table_query: searchText }, () => {
                            this.getData(tableState.page, tableState.rowsPerPage)
                        })
                        break;
                    default:
                        break;
                }
            }
        }
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
                                                    <i className="color-blue fa fa-1x fa-laptop margin-right-10px"></i>
                                                </div>
                                                <div>
                                                    <div className="txt-site txt-12 txt-bold txt-main">
                                                        Facility Template
                                                    </div>
                                                    <div className="txt-site txt-10 txt-thin txt-primary">
                                                        Facility Template
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
                                                id="navmenu-coh" />
                                            <div className="grid grid-2x margin-bottom-10px">
                                                <div className="col-1"></div>
                                                <div className="col-2 content-right">
                                                    <label htmlFor="navmenu-coh">
                                                        <div className="app-open-close-icon"></div>
                                                    </label>
                                                    <button
                                                        onClick={() => this.openCreateForm()}
                                                        className="btn btn-small-circle btn-sekunder margin-left-5px">
                                                        <i className="fa fa-lw fa-plus" />
                                                    </button>
                                                </div>
                                                {this.state.formCreate &&
                                                    <FormFacilityCreate
                                                        type="create"
                                                        onClickSave={this.handleSubmit.bind(this)}
                                                        onClickClose={this.openCreateForm.bind(this)}
                                                    />}
                                            </div>
                                            <div className="app-open-close-content">
                                                <MuiThemeProvider theme={getMuiTheme()}>
                                                    <MUIDataTable
                                                        key={facilityCount}
                                                        title={"Facility Template"}
                                                        subtitle={"lorem ipsum dolor"}
                                                        data={this.state.dataTable}
                                                        columns={this.columns}
                                                        options={tableOptions} />
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
                            {this.state.editFacility && (
                                <FormEditFacility
                                    payloadFacility={this.state.payloadFacility}
                                    bizparFacilityType={this.state.bizparFacilityType}
                                    onDeletePopUp={this.openDeletePopUp.bind(this)}
                                    closeSlide={this.clResizePane}
                                    onClickSave={this.handleUpdate.bind(this)} />
                            )}
                        </div>
                    )}
                />

                {this.state.savePopUpVisible && (
                    <PopUp
                        type={"save"}
                        class={"app-popup app-popup-show"}
                        onClick={this.state.formCreate ? this.openCreateForm.bind(this) : this.openSavePopUp.bind(this)}
                    />
                )}

                {this.state.deletePopUpVisible && (
                    <PopUp
                        type={"delete"}
                        class={"app-popup app-popup-show"}
                        onClick={this.openDeletePopUp}
                        onClickDelete={this.state.editFacility ? () => this.handleUpdate(this.state.selectedIndex, "delete-detail") : this.handleDelete.bind(this)}
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

const mapDispatchToProps = dispatch => {
    return {
        authLogout: () => dispatch(AuthAction.authLogout())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(confFacility)