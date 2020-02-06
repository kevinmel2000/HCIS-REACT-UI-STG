import React, { Component } from 'react'
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles'
import MUIDataTable from "mui-datatables-bitozen"
import FormCnbCreate from './create/compensation/formCnbCreate'
import PopUp from '../../../pages/PopUpAlert'
import ResizeSlider from '../../../../modules/resize/Slider'
import FormEditCnb from './edit/compensation/formEditCnb'
import Api from '../../../../Services/Api'
import M from 'moment'
import { getBizpar } from '../../../../Services/Utils'
import * as R from 'ramda'
import { connect } from 'react-redux'
import AuthAction from '../../../../Redux/AuthRedux'

var ct = require("../../../../modules/custom/customTable")
const getMuiTheme = () => createMuiTheme(ct.customTable())
const options = ct.customOptions()

const clSlidePage = 'a-s-p-main'

class ConfCompensation extends Component {
    constructor(props) {
        super(props)
        this.state = {
            classAppSlidePage: 'app-side-page',
            classAppSlidePageMain: clSlidePage,
            formCreate: false,
            editPopUpVisible: false,
            savePopUpVisible: false,
            deletePopUpVisible: false,
            editCnb: false,
            selectedIndex: null,
            allowResize: false,
            defaultSize: 0,
            minSize: 0,
            maxSize: 0,
            dataTable: [],
            cnbCount: 0,
            table_limit: 5,
            table_page: 0,
            table_query: "",
            user: this.props.auth.user,
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
            editCnb: false,
            allowResize: false,
            defaultSize: 0,
            minSize: 0,
            maxSize: 0
        })
    }

    opSidePage = (menu, index) => (e) => {
        this.setState({
            classAppSlidePage: 'app-side-page op-app-side',
            editCnb: false
        })

        this.opResizePane()

        switch (menu) {
            case 'slide-cnb':
                this.setState({
                    editCnb: true,
                    payloadCnb: this.state.rawData[index]
                })
                break
            default:
                break
        }
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
        this.setState({ savePopUpVisible: !this.state.savePopUpVisible, editCnb: false })
    }

    componentDidMount() {
        // this.getDataCnb()
        this.getBizpar()
        this.getData(this.state.table_page, this.state.table_limit)
    }

    componentDidUpdate(prevProps) {
        if (this.props.dataTable !== prevProps.dataTable) this.setState({ dataTable: this.props.dataTable })
    }

    async getData(page, limit) {
        let payload = {
            "params": {
                "cNBStatus": "ACTIVE"
            },
            "offset": page,
            "limit": limit
        }

        let body = {
            "limit": limit,
            "offset": page,
            "params": {
                "esID": this.props.auth.user.companyID,
                "cNBTPLName": this.state.table_query
            }
        }

        let { companyID } = this.state.user
        if (!R.isEmpty(this.state.table_query)) {
            let res = await Api.create('CFG').getCountCNBbyIdAndName(companyID + '/' + this.state.table_query)
            if (res.ok) {
                this.setState({ cnbCount: res.data.data })
            }

            let response = await Api.create('CFG').getCNBByIdAndName(body)
            if (response.data && response.data.status === "S") {
                let dataTable = response.data.data.map((value) => {
                    const { cnbtplid, cnbtplname, cnbstatus } = value
                    return [
                        cnbtplid,
                        cnbtplname,
                        cnbstatus === "ACTIVE" ? "YES" : "NO"
                    ]
                })
                this.setState({ dataTable, rawData: response.data.data })
            } else if (R.isNil(response.data)) return alert("Failed: " + response.problem)
            else return alert("Failed: " + response.data.message)
        } else { 
            let res = await Api.create("CFG").getCountCNBByStatus("ACTIVE")

            let response = await Api.create("CFG").getCNBbyStatus(payload)
            if (response.data && response.data.status === "S") {
                let dataTable = response.data.data.map((value) => {
                    const { cnbtplid, cnbtplname, cnbstatus } = value
                    return [
                        cnbtplid,
                        cnbtplname,
                        cnbstatus === "ACTIVE" ? "YES" : "NO"
                    ]
                }) 
                this.setState({ dataTable, rawData: response.data.data, cnbCount: res.data.data }) 
            } else {
                alert("Failed: " + response.data.message)
            }
        }
    }

    async getDataCnb() {
        let payload = {
            "params": {
                "esID": this.props.auth.companyID
            },
            "offset": 0,
            "limit": 100
        }

        let response = await Api.create("CFG").getCorporateCnbTplByEsId(payload)
        if (response.data && response.data.status === "S") {
            let dataTable = response.data.data.map((value) => {
                const { cnbtplid, cnbtplname, cnbstatus } = value
                return [
                    cnbtplid,
                    cnbtplname,
                    cnbstatus === "ACTIVE" ? "YES" : "NO"
                ]
            })
            this.setState({ dataTable, rawData: response.data.data })
        } else {
            alert("Failed: " + response.data.message)
        }
    }

    async getBizpar() {
        let bizparCompensationType = await getBizpar('COMPENSATION_TYPE')
        let bizparPayrollTplComponentType = await getBizpar('PAYROLL_TPL_COMPONENT_TYPE')

        this.setState({
            bizparCompensationType,
            bizparPayrollTplComponentType
        })
    }

    async handleSubmit(payload) {
        payload = {
            ...payload,
            company: this.props.auth.user.companyID,
            cnbstatus: payload.cnbstatus === true ? "ACTIVE" : "INACTIVE"
        }

        let response = await Api.create("CFG").postCorporateCnbTpl(payload) 
        if (response.data && response.data.status === "S") {
            this.openSavePopUp()
            this.getData(0,5)
        } else {
            alert("Failed: " + response.data.message)
        }
    }

    async handleUpdate(payload, type) { 
        let { payloadCnb } = this.state
        let dataDetail = Object.assign([], payloadCnb.cnbdetails)
        dataDetail = dataDetail.map((value, index) => {
            return {
                "cnbdetaiID": value.cNBDetaiID,
                "cnbdetailNotes": value.cNBDetailNotes,
                "cnbtype": value.cNBType,
                "cnbvalue": value.cNBValue,
                "cnbcomponent": value.cNBComponent.bizparKey,
                "cnbvalueType": value.cNBValueType.bizparKey,
            }
        })
        console.log('tipe', type)
        switch (type) {
            case "create-detail":
                dataDetail.push(payload)
                payload = {
                    "cnbtplid": payloadCnb.cnbtplid,
                    "cnbtplname": payloadCnb.cnbtplname,
                    "cnbphotoURL": payloadCnb.cnbphotoURL,
                    "company": payloadCnb.company.esID,
                    "cnbstatus": payloadCnb.cnbstatus,
                    "cnbdetails": dataDetail,
                    "cnbcreational": {
                        "modifiedBy": "SYSTEM",
                        "modifiedDate": M().format("DD-MM-YYYY HH:mm:ss")
                    },
                    "cnbnotes": payloadCnb.cnbnotes
                }
                break;
            case "update-detail":
                let isSame = R.findIndex(R.propEq('cnbdetaiID', payload.cnbdetaiID))(dataDetail)
                if (isSame >= 0) {
                    dataDetail[isSame] = payload
                }
                payload = {
                    "cnbtplid": payloadCnb.cnbtplid,
                    "cnbtplname": payloadCnb.cnbtplname,
                    "cnbphotoURL": payloadCnb.cnbphotoURL,
                    "company": payloadCnb.company.esID,
                    "cnbstatus": payloadCnb.cnbstatus,
                    "cnbdetails": dataDetail,
                    "cnbcreational": {
                        "modifiedBy": "SYSTEM",
                        "modifiedDate": M().format("DD-MM-YYYY HH:mm:ss")
                    },
                    "cnbnotes": payloadCnb.cnbnotes
                }
                break;
            case "delete-detail":
                dataDetail.splice(payload, 1)
                payload = {
                    "cnbtplid": payloadCnb.cnbtplid,
                    "cnbtplname": payloadCnb.cnbtplname,
                    "cnbphotoURL": payloadCnb.cnbphotoURL,
                    "company": payloadCnb.company.esID,
                    "cnbstatus": payloadCnb.cnbstatus,
                    "cnbdetails": dataDetail,
                    "cnbcreational": {
                        "modifiedBy": "SYSTEM",
                        "modifiedDate": M().format("DD-MM-YYYY HH:mm:ss")
                    },
                    "cnbnotes": payloadCnb.cnbnotes
                }
                this.setState({
                    deletePopUpVisible: false
                })
                break;
            default:
                payload = {
                    ...payload,
                    cnbdetails: dataDetail,
                    cnbstatus: payload.cnbstatus === true ? "ACTIVE" : "INACTIVE",
                    company: payload.company === null ? this.props.auth.user.companyID : payload.company.esID
                }
                break;
        }

        console.log("after", payload)

        let response = await Api.create("CFG").updateCorporateCnbTpl(payload)
        if (response.ok && response.data.status === 'S') {
            this.openSavePopUp()
            this.getData(0,5)
        } else {
            alert("Failed: " + response.data.message)
        }
    }

    async handleDelete() {
        let { rawData, selectedIndex } = this.state
        let payload = {
            "referenceID": rawData[selectedIndex].cnbtplid,
            "requestBy": "SYSTEM",
            "requestDate": M().format("DD-MM-YYYY HH:mm:ss")
        }

        let response = await Api.create("CFG").deleteCorporateCnbTpl(payload)
        if (response.ok && response.data.status === 'S') {
            this.setState({ deletePopUpVisible: !this.state.deletePopUpVisible })
            this.getData(0,5)
        } else {
            alert("Failed: " + response.data.message)
        }
    }


    columns = [
        "CNB Template ID", "CNB Template Name",
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
                            style={{ marginRight: 15 }}
                            onClick={this.opSidePage("slide-cnb", tableMeta.rowIndex)}
                        >
                            <i className="fa fa-lw fa-pencil-alt" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }} />
                        </button>
                        <button
                            className="btnAct"
                            onClick={() => this.openDeletePopUp(tableMeta.rowIndex)}>
                            <i className="fa fa-lw fa-trash-alt" style={{ backgroundColor: 'transparent', color: 'red', fontSize: 20 }} />
                        </button>
                    </div>
                )
            }
        }
    ]

    render() {
        let { cnbCount, table_query } = this.state
        let tableOptions = {
            ...options,
            serverSide: true,
            count: cnbCount,
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
                                                    <i className="color-blue fa fa-1x fa-database margin-right-10px"></i>
                                                </div>
                                                <div>
                                                    <div className="txt-site txt-12 txt-bold txt-main">
                                                        Compensation & Benefit Template
                                                </div>
                                                    <div className="txt-site txt-10 txt-thin txt-primary">
                                                        Compensation & Benefit Template
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
                                                    <FormCnbCreate
                                                        type="create"
                                                        onClickSave={this.handleSubmit.bind(this)}
                                                        onClickClose={this.openCreateForm.bind(this)}
                                                    />}
                                            </div>
                                            <div className="app-open-close-content">
                                                <MuiThemeProvider theme={getMuiTheme()}>
                                                    <MUIDataTable
                                                        key={cnbCount}
                                                        title={"Compensation & Benefit Template"}
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
                            {this.state.editCnb && (
                                <FormEditCnb
                                    payloadCnb={this.state.payloadCnb}
                                    bizparCompensationType={this.state.bizparCompensationType}
                                    bizparPayrollTplComponentType={this.state.bizparPayrollTplComponentType}
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
                        onClickDelete={this.state.editCnb ? () => this.handleUpdate(this.state.selectedIndex, "delete-detail") : this.handleDelete.bind(this)}
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

export default connect(mapStateToProps, mapDispatchToProps)(ConfCompensation)