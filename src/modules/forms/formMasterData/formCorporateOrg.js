import React, { Component } from 'react'
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles"
import MUIDataTable from "mui-datatables-bitozen"
import FormCorporateOrgCreate from './formCorporateOrgCreate'
import PopUp from '../../../components/pages/PopUpAlert'
import API from '../../../Services/Api'
import { getBizpar } from '../../../Services/Utils'
import M from 'moment'
import * as R from 'ramda'

var ct = require("../../../modules/custom/customTable")
const getMuiTheme = () => createMuiTheme(ct.customTable())
const options = ct.customOptions5()

class FormCorporateOrg extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: this.props.data,
            esData: [],
            dataTable: [],
            createVisible: false,
            updateVisible: false,
            viewVisible: false,
            savePopUpVisible: false,
            deletePopUpVisible: false
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.data) {
            if (this.props.data !== prevProps.data) {
                this.setState({
                    data: this.props.data
                })
                // this.getES()
            }
        }
    }

    async getOrgStructDetail() {
        let esid = this.state.data.esid
        let res = await API.create('ES').getCorporateOrgStructDetail(esid)
        console.log('Get detail', res)
        if (res.data.code === '201' && res.data.status === 'S') {
            this.setState({ rawDataTableDetail: res.data.data })
        }
    }

    async getReference() {
        let payload = {
            "limit": 10,
            "offset": 0
        }
        let res = await API.create('CFG').getAllOrgTpl(payload)
        console.log(res)
        if (res.data && res.data.status === 'S') {
            this.setState({
                dataReference: res.data.data
            })
        }
    }

    componentDidMount() {
        this.getAllBizpar()
        this.getOrgStructDetail()
        this.getReference()
        // this.getES()
    }

    getAllBizpar = async () => {
        let bizparCorporateLevel = await getBizpar('CORPORATE_LEVEL')
        let bizparCorporatePosition = await getBizpar('CORPORATE_POSITION')
        let bizparCorporateGrade = await getBizpar('CORPORATE_GRADE')

        this.setState({
            bizparCorporateLevel,
            bizparCorporatePosition,
            bizparCorporateGrade
        })
    }

    async handleSubmit(data) {
        let dataCompany = this.state.data
        let orgStructureTPL = Object.assign([], dataCompany.orgStructureTPL)
        orgStructureTPL = orgStructureTPL.map((value) => {
            return {
                "isOrgStructureDefault": value.isOrgStructureDefault,
                "orgStructureEndDate": value.orgStructureEndDate,
                "orgStructureSKNumber": value.orgStructureSKNumber,
                "orgStructureStartDate": value.orgStructureStartDate,
                "orgStructureTPLID": value.orgStructureTPLID,
                "orgStructureTPLName": value.orgStructureTPLName,
                "orgStructureTPLStatus": 'ACTIVE',
                "orgStructureTag": value.orgStructureTag,
                // "payload": {},
                "referenceOrgStructureTPLID": value.referenceOrgStructureTPLID !== null ? value.referenceOrgStructureTPLID.orgStructureTPLId : ''
            }
        })
        let parsePayload = Object.assign([], data.payload)
        let children = []
        parsePayload = parsePayload.map((value) => {
            if (!R.isEmpty(value.ouchildren)) {
                children = value.ouchildren.map((value) => {
                    if (!R.isEmpty(value.ouchildren)) {
                        children = value.ouchildren.map((value) => {
                            if (!R.isEmpty(value.ouchildren)) {
                                children = value.ouchildren.map((value) => {
                                    if (!R.isEmpty(value.ouchildren)) {
                                        children = value.ouchildren.map((value) => {
                                            return {
                                                "ousalaryStartFrom": value.salaryStartFrom,
                                                "ousalaryStartTo": value.salaryStartTo,
                                                "outaxTPLID": value.ouTaxTPLID.taxTPLID,
                                                "oujobDescription": value.oujobDescription,
                                                "ouhashChild": value.ouhashChild,
                                                "ouchildren": children,
                                                "oupayrollTPLID": value.oupayrollTaxTPLID.payrollTPLID,
                                                "ougrade": value.ougrade.bizparKey,
                                                "oulevel": value.oulevel.bizparKey,
                                                "ouposition": value.ouposition.bizparKey,
                                                "ouid": value.ouid,
                                                "ouparentID": value.ouparentID
                                            }

                                        })
                                        return {
                                            "ousalaryStartFrom": value.salaryStartFrom,
                                            "ousalaryStartTo": value.salaryStartTo,
                                            "outaxTPLID": value.ouTaxTPLID.taxTPLID,
                                            "oujobDescription": value.oujobDescription,
                                            "ouhashChild": value.ouhashChild,
                                            "ouchildren": children,
                                            "oupayrollTPLID": value.oupayrollTaxTPLID.payrollTPLID,
                                            "ougrade": value.ougrade.bizparKey,
                                            "oulevel": value.oulevel.bizparKey,
                                            "ouposition": value.ouposition.bizparKey,
                                            "ouid": value.ouid,
                                            "ouparentID": value.ouparentID
                                        }
                                    }
                                    return {
                                        "ousalaryStartFrom": value.salaryStartFrom,
                                        "ousalaryStartTo": value.salaryStartTo,
                                        "outaxTPLID": value.ouTaxTPLID.taxTPLID,
                                        "oujobDescription": value.oujobDescription,
                                        "ouhashChild": value.ouhashChild,
                                        "ouchildren": children,
                                        "oupayrollTPLID": value.oupayrollTaxTPLID.payrollTPLID,
                                        "ougrade": value.ougrade.bizparKey,
                                        "oulevel": value.oulevel.bizparKey,
                                        "ouposition": value.ouposition.bizparKey,
                                        "ouid": value.ouid,
                                        "ouparentID": value.ouparentID
                                    }
                                })
                            }
                            return {
                                "ousalaryStartFrom": value.salaryStartFrom,
                                "ousalaryStartTo": value.salaryStartTo,
                                "outaxTPLID": value.ouTaxTPLID.taxTPLID,
                                "oujobDescription": value.oujobDescription,
                                "ouhashChild": value.ouhashChild,
                                "ouchildren": children,
                                "oupayrollTPLID": value.oupayrollTaxTPLID.payrollTPLID,
                                "ougrade": value.ougrade.bizparKey,
                                "oulevel": value.oulevel.bizparKey,
                                "ouposition": value.ouposition.bizparKey,
                                "ouid": value.ouid,
                                "ouparentID": value.ouparentID
                            }
                        })
                        return {
                            "ousalaryStartFrom": value.salaryStartFrom,
                            "ousalaryStartTo": value.salaryStartTo,
                            "outaxTPLID": value.ouTaxTPLID.taxTPLID,
                            "oujobDescription": value.oujobDescription,
                            "ouhashChild": value.ouhashChild,
                            "ouchildren": children,
                            "oupayrollTPLID": value.oupayrollTaxTPLID.payrollTPLID,
                            "ougrade": value.ougrade.bizparKey,
                            "oulevel": value.oulevel.bizparKey,
                            "ouposition": value.ouposition.bizparKey,
                            "ouid": value.ouid,
                            "ouparentID": value.ouparentID
                        }
                    } return {
                        "ousalaryStartFrom": value.salaryStartFrom,
                        "ousalaryStartTo": value.salaryStartTo,
                        "outaxTPLID": value.ouTaxTPLID.taxTPLID,
                        "oujobDescription": value.oujobDescription,
                        "ouhashChild": value.ouhashChild,
                        "ouchildren": children,
                        "oupayrollTPLID": value.oupayrollTaxTPLID.payrollTPLID,
                        "ougrade": value.ougrade.bizparKey,
                        "oulevel": value.oulevel.bizparKey,
                        "ouposition": value.ouposition.bizparKey,
                        "ouid": value.ouid,
                        "ouparentID": value.ouparentID
                    }
                })
            }
            return {
                "ousalaryStartFrom": value.salaryStartFrom,
                "ousalaryStartTo": value.salaryStartTo,
                "outaxTPLID": value.ouTaxTPLID.taxTPLID,
                "oujobDescription": value.oujobDescription,
                "ouhashChild": value.ouhashChild,
                "ouchildren": children,
                "oupayrollTPLID": value.oupayrollTaxTPLID.payrollTPLID,
                "ougrade": value.ougrade.bizparKey,
                "oulevel": value.oulevel.bizparKey,
                "ouposition": value.ouposition.bizparKey,
                "ouid": value.ouid,
                "ouparentID": value.ouparentID
            }
        })
        data = {
            ...data,
            orgStructureStartDate: data.orgStructureStartDate === 'Invalid date' || R.isEmpty(data.orgStructureStartDate) ? '' : M(data.orgStructureStartDate, 'YYYY-MM-DD').format('DD-MM-YYYY'),
            orgStructureEndDate: data.orgStructureEndDate === 'Invalid date' || R.isEmpty(data.orgStructureEndDate) ? '' : M(data.orgStructureEndDate, 'YYYY-MM-DD').format('DD-MM-YYYY'),
            payload: parsePayload[0],
            orgStructureTPLStatus: 'ACTIVE',
            referenceOrgStructureTPLID: data.referenceOrgStructureTPLID.orgStructureTPLId
        }
        orgStructureTPL.push(data)
        dataCompany = {
            ...dataCompany,
            parent: dataCompany.parent !== null ? dataCompany.parent.esid : '',
            pic: dataCompany.pic !== null ? dataCompany.pic.employeeID : '',
            estype: dataCompany.estype.bizparKey,
            orgStructureTPL: orgStructureTPL
        }
        let payload = dataCompany
        console.log(JSON.stringify(payload))
        let res = await API.create('ES').updateCompGeneral(payload)
        console.log('update company', res)
        if (res.data.code === '201' && res.data.status === 'S') {
            this.setState({ createVisible: false })
            this.props.backToPage()
        }
    }

    async handleUpdate(data) {
        let { detail, detail2, detail3, detail4, detail5, dataOrg, dataCompany, index } = ''
        let dataPayload = Object.assign([], data.referenceOrgStructureTPLID.orgStructureTPLDetails)
        dataPayload = dataPayload.map((value) => {
            detail = Object.assign([], value.ouchildren)
            detail = detail.map((value) => {
                detail2 = Object.assign([], value.ouchildren)
                detail2 = detail2.map((value) => {
                    detail3 = Object.assign([], value.ouchildren)
                    detail3 = detail3.map((value) => {
                        detail4 = Object.assign([], value.ouchildren)
                        detail4 = detail4.map((value) => {
                            detail5 = Object.assign([], value.ouchildren)
                            detail5 = detail5.map((value) => {
                                return {
                                    "children": [],
                                    "hasChild": value.ouhashChild,
                                    "ougrade": value.ougrade.bizparKey,
                                    "ouid": value.ouid,
                                    "oujobDesc": value.oujobDescription,
                                    "oulevel": value.oulevel.bizparKey,
                                    "ouparentID": value.ouparentID,
                                    "oupayrollTPLID": value.oupayrollTaxTPLID === undefined ? '' : value.oupayrollTaxTPLID === null ? '' : value.oupayrollTaxTPLID.payrollTPLID,
                                    "ouposition": value.ouposition.bizparKey,
                                    "ousalaryStartFrom": value.salaryStartFrom,
                                    "ousalaryStartTo": value.salaryStartTo,
                                    "outaxTPLID": value.ouTaxTPLID === undefined ? '' : value.ouTaxTPLID === null ? '' : value.ouTaxTPLID.taxTPLID
                                }
                            })
                            return {
                                "children": detail5,
                                "hasChild": value.ouhashChild,
                                "ougrade": value.ougrade.bizparKey,
                                "ouid": value.ouid,
                                "oujobDesc": value.oujobDescription,
                                "oulevel": value.oulevel.bizparKey,
                                "ouparentID": value.ouparentID,
                                "oupayrollTPLID": value.oupayrollTaxTPLID === undefined ? '' : value.oupayrollTaxTPLID === null ? '' : value.oupayrollTaxTPLID.payrollTPLID,
                                "ouposition": value.ouposition.bizparKey,
                                "ousalaryStartFrom": value.salaryStartFrom,
                                "ousalaryStartTo": value.salaryStartTo,
                                "outaxTPLID": value.ouTaxTPLID === undefined ? '' : value.ouTaxTPLID === null ? '' : value.ouTaxTPLID.taxTPLID
                            }
                        })
                        return {
                            "children": detail4,
                            "hasChild": value.ouhashChild,
                            "ougrade": value.ougrade.bizparKey,
                            "ouid": value.ouid,
                            "oujobDesc": value.oujobDescription,
                            "oulevel": value.oulevel.bizparKey,
                            "ouparentID": value.ouparentID,
                            "oupayrollTPLID": value.oupayrollTaxTPLID === undefined ? '' : value.oupayrollTaxTPLID === null ? '' : value.oupayrollTaxTPLID.payrollTPLID,
                            "ouposition": value.ouposition.bizparKey,
                            "ousalaryStartFrom": value.salaryStartFrom,
                            "ousalaryStartTo": value.salaryStartTo,
                            "outaxTPLID": value.ouTaxTPLID === undefined ? '' : value.ouTaxTPLID === null ? '' : value.ouTaxTPLID.taxTPLID
                        }
                    })
                    return {
                        "children": detail3,
                        "hasChild": value.ouhashChild,
                        "ougrade": value.ougrade.bizparKey,
                        "ouid": value.ouid,
                        "oujobDesc": value.oujobDescription,
                        "oulevel": value.oulevel.bizparKey,
                        "ouparentID": value.ouparentID,
                        "oupayrollTPLID": value.oupayrollTaxTPLID === undefined ? '' : value.oupayrollTaxTPLID === null ? '' : value.oupayrollTaxTPLID.payrollTPLID,
                        "ouposition": value.ouposition.bizparKey,
                        "ousalaryStartFrom": value.salaryStartFrom,
                        "ousalaryStartTo": value.salaryStartTo,
                        "outaxTPLID": value.ouTaxTPLID === undefined ? '' : value.ouTaxTPLID === null ? '' : value.ouTaxTPLID.taxTPLID
                    }
                })
                return {
                    "children": detail2,
                    "hasChild": value.ouhashChild,
                    "ougrade": value.ougrade.bizparKey,
                    "ouid": value.ouid,
                    "oujobDesc": value.oujobDescription,
                    "oulevel": value.oulevel.bizparKey,
                    "ouparentID": value.ouparentID,
                    "oupayrollTPLID": value.oupayrollTaxTPLID === undefined ? '' : value.oupayrollTaxTPLID === null ? '' : value.oupayrollTaxTPLID.payrollTPLID,
                    "ouposition": value.ouposition.bizparKey,
                    "ousalaryStartFrom": value.salaryStartFrom,
                    "ousalaryStartTo": value.salaryStartTo,
                    "outaxTPLID": value.ouTaxTPLID === undefined ? '' : value.ouTaxTPLID === null ? '' : value.ouTaxTPLID.taxTPLID
                }
            })
            return {
                "children": detail,
                "hasChild": value.ouhashChild,
                "ougrade": value.ougrade.bizparKey,
                "ouid": value.ouid,
                "oujobDesc": value.oujobDescription,
                "oulevel": value.oulevel.bizparKey,
                "ouparentID": value.ouparentID,
                "oupayrollTPLID": value.oupayrollTaxTPLID === undefined ? '' : value.oupayrollTaxTPLID === null ? '' : value.oupayrollTaxTPLID.payrollTPLID,
                "ouposition": value.ouposition.bizparKey,
                "ousalaryStartFrom": value.salaryStartFrom,
                "ousalaryStartTo": value.salaryStartTo,
                "outaxTPLID": value.ouTaxTPLID === undefined ? '' : value.ouTaxTPLID === null ? '' : value.ouTaxTPLID.taxTPLID
            }
        })

        console.log(JSON.stringify(dataPayload))
        dataCompany = this.state.data
        dataOrg = {
            ...data,
            orgStructureStartDate: R.isNil(data.orgStructureStartDate) || R.isEmpty(data.orgStructureStartDate) ? '' : M(data.orgStructureStartDate, 'YYYY-MM-DD').format('DD-MM-YYYY'),
            orgStructureEndDate: R.isNil(data.orgStructureEndDate) || R.isEmpty(data.orgStructureEndDate) ? '' : M(data.orgStructureEndDate, 'YYYY-MM-DD').format('DD-MM-YYYY'),
        }

        let existingData = Object.assign([], dataCompany.orgStructureTPL)
        existingData = existingData.map((value) => {
            return {
                "isOrgStructureDefault": value.isOrgStructureDefault,
                "orgStructureEndDate": value.orgStructureEndDate,
                "orgStructureSKNumber": value.orgStructureSKNumber,
                "orgStructureStartDate": value.orgStructureStartDate,
                "orgStructureTPLID": value.orgStructureTPLID,
                "orgStructureTPLName": value.orgStructureTPLName,
                "orgStructureTPLStatus": 'ACTIVE',
                "orgStructureTag": value.orgStructureTag,
                // "payload": {},
                "referenceOrgStructureTPLID": value.referenceOrgStructureTPLID !== null ? value.referenceOrgStructureTPLID.orgStructureTPLId : ''
            }
        })
        console.log(JSON.stringify(existingData))
        index = R.findIndex(R.propEq('orgStructureTPLID', dataOrg.orgStructureTPLID))(existingData)
        if (index >= 0) {
            console.log('index found', index)
            existingData[index] = {
                ...existingData[index],
                orgStructureEndDate: dataOrg.orgStructureEndDate,
                orgStructureSKNumber: dataOrg.orgStructureSKNumber,
                orgStructureStartDate: dataOrg.orgStructureStartDate,
                orgStructureTPLName: dataOrg.orgStructureTPLName,
                payload: dataPayload[0],
                referenceOrgStructureTPLID: data.referenceOrgStructureTPLID.orgStructureTPLId
            }
            if (existingData[index].referenceOrgStructureTPLID.orgStructureTPLId) {
                console.log('ada update')
            }
        }
        dataCompany = {
            ...dataCompany,
            parent: dataCompany.parent !== null ? dataCompany.parent.esid : '',
            pic: dataCompany.pic !== null ? dataCompany.pic.employeeID : '',
            estype: dataCompany.estype.bizparKey,
            orgStructureTPL: existingData,

        }
        console.log('dataorg', JSON.stringify(dataCompany))
        let res = await API.create('ES').updateCompGeneral(dataCompany)
        console.log('update company', res)
        if (res.data.code === '201' && res.data.status === 'S') {
            this.setState({ updateVisible: false })
            this.props.backToPage()
        }
    }
    async handleDelete(data) {
        let dataCompany = ''
        dataCompany = this.state.data
        let existingData = Object.assign([], dataCompany.orgStructureTPL)
        console.log(existingData)
        existingData = existingData.map((value) => {
            return {
                "isOrgStructureDefault": value.isOrgStructureDefault,
                "orgStructureEndDate": value.orgStructureEndDate,
                "orgStructureSKNumber": value.orgStructureSKNumber,
                "orgStructureStartDate": value.orgStructureStartDate,
                "orgStructureTPLID": value.orgStructureTPLID,
                "orgStructureTPLName": value.orgStructureTPLName,
                "orgStructureTPLStatus": 'ACTIVE',
                "orgStructureTag": value.orgStructureTag,
                "payload": {},
                "referenceOrgStructureTPLID": value.referenceOrgStructureTPLID !== null ? value.referenceOrgStructureTPLID.orgStructureTPLId : ''
            }
        })

        existingData.splice(this.state.selectedIndex, 1)
        dataCompany = {
            ...dataCompany,
            parent: dataCompany.parent !== null ? dataCompany.parent.esid : '',
            pic: dataCompany.pic !== null ? dataCompany.pic.employeeID : '',
            estype: dataCompany.estype.bizparKey,
            orgStructureTPL: existingData
        }
        console.log('dataorg', JSON.stringify(dataCompany))
        let res = await API.create('ES').updateCompGeneral(dataCompany)
        console.log('update company', res)
        if (res.data.code === '201' && res.data.status === 'S') {
            this.setState({
                deletePopUpVisible: false,
            })
            this.props.backToPage()
        }
    }

    openForm = (type, index) => {
        let savePopUpVisible;
        switch (type) {
            case "create":
                savePopUpVisible = this.state.savePopUpVisible ? !this.state.savePopUpVisible : false
                this.setState({ createVisible: !this.state.createVisible, savePopUpVisible })
                break
            case "update":
                savePopUpVisible = this.state.savePopUpVisible ? !this.state.savePopUpVisible : false
                this.setState({ updateVisible: !this.state.updateVisible, savePopUpVisible, selectedIndex: index })
                break
            case "view":
                savePopUpVisible = this.state.savePopUpVisible ? !this.state.savePopUpVisible : false
                this.setState({ viewVisible: !this.state.viewVisible, savePopUpVisible, selectedIndex: index })
                break
            default:
                break
        }
    }

    openDeletePopup = (index) => {
        this.setState({ deletePopUpVisible: !this.state.deletePopUpVisible, selectedIndex: index })
    }

    columns = [
        "No", "Template ID", "Template Name", "SK Number", "Start Date", "End Date",
        {
            name: "Activation",
            options: {
                customBodyRender: (val) => (
                    <div>
                         <i
                                className="fa fa-lw fa-circle"
                                style={{
                                    color: val === "YES" ? "green" : "brown",
                                    marginRight: 10
                                }}
                        />
                        {val}
                    </div>
                )
            }
        },
        {
            name: "Action",
            options: {
                customBodyRender: (val, tableMeta) => (
                    <div>
                        {this.props.type !== 'detail' ?
                            <button
                                type="button"
                                className="btnAct"
                                style={{ marginRight: 15 }}
                                onClick={() => this.openForm("update", tableMeta.rowIndex)}>
                                <i className="fa fa-lw fa-pencil-alt" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }}/>
                            </button>
                            : null}
                        {this.props.type !== 'detail' ?
                            <button type="button" className="btnAct"
                                style={{ marginRight: 15 }}
                                onClick={() => this.openDeletePopup(tableMeta.rowIndex)}>
                                <i className="fa fa-lw fa-trash-alt" style={{ backgroundColor: 'transparent', color: 'red', fontSize: 20 }}/>
                            </button>
                            : null}
                        <button type="button" className="btnAct"
                            onClick={() => this.openForm('view', tableMeta.rowIndex)}>
                            <i className="fa fa-lw fa-ellipsis-v" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }}/>
                        </button>

                    </div>
                )
            }
        }
    ]

    async getES() {
        console.log('masuk')
        let res = await API.create('CFG').getCorporateOrgStructureTplById(this.state.data.orgStructureTPL[0].orgStructureTPLID)
        if (res.data && res.data.status === "S") {
            console.log(res.data.data)
            this.setState({ esData: res.data.data && res.data.data.orgStructureTPLDetails ? res.data.data.orgStructureTPLDetails[0] : [] })
        } else {
            alert(res.data && res.data.message ? res.data.message : res.problem)
        }
    }

    cardMain = (name, about, job, report) => {
        if (report === '') {
            var bot = ''
        } else {
            bot = (
                <div className="co-bot">
                    <div className="txt-site txt-9 txt-primary">{report}</div>
                </div>
            )
        }
        return (
            <div className="card-org">
                <div className="co-top co-grid">
                    <div className="co-col-1">
                        <div className="image image-45px image-center image-circle background-dark-grey"></div>
                        <div className="margin-top-5px">
                            <div className="txt-site txt-center txt-9 txt-bold color-post">{job}</div>
                        </div>
                    </div>
                    <div className="co-col-2">
                        <div className="margin-top-5px">
                            <div className="txt-site txt-11 txt-bold txt-main">{name}</div>
                        </div>
                        <div className="margin-bottom-5px">
                            <div className="txt-site txt-10 txt-primary">{about}</div>
                        </div>
                    </div>
                </div>
                {bot}
            </div>
        )
    }

    cardSpace = (title, report) => {
        if (report === '') {
            var bot = ''
        } else {
            bot = (
                <div className="co-bot">
                    <div className="txt-site txt-9 txt-primary">{report}</div>
                </div>
            )
        }
        return (
            <div className="card-org">
                <div className="co-top">
                    <div className="txt-site txt-11 txt-thin txt-main">{title}</div>
                </div>
                {bot}
            </div>
        )
    }

    renderChildren = (data) => {
        return (
            <ul>
                {data.ouchildren.map((data, index) => {
                    return (
                        <li>
                            <label for={'child-' + data.ouid}>
                                {this.cardSpace(data.ouposition.bizparValue, '')}
                            </label>
                            <input
                                checked={true}
                                id={'child-' + data.ouid}
                                className="tree-button"
                                type="checkbox" />
                            {data.ouchildren.length > 0 && this.renderChildren(data)}
                        </li>
                    )
                })}
            </ul>
        )
    }

    renderOrgChart = () => {
        let { esData } = this.state
        if (esData && esData.ouposition) {
            return (
                <div className="tree hidden background-dark-grey" style={{ whiteSpace: 'nowrap', width: 0 }}>
                    <ul>
                        <li>
                            <label for='parent'>
                                {this.cardSpace(esData.ouposition.bizparValue, '')}
                            </label>
                            <input
                                id='parent'
                                checked={true}
                                className="tree-button"
                                type="checkbox" />
                            {esData.ouchildren.length > 0 && this.renderChildren(esData)}
                        </li>
                    </ul>
                </div>
            )
        }
    }

    render() {
        let { createVisible, updateVisible, savePopUpVisible, deletePopUpVisible, viewVisible } = this.state
        let org = this.state.data.orgStructureTPL
        let dataTable = org ? org.map((value, index) => {
            const { orgStructureTPLID, orgStructureTPLName, orgStructureSKNumber, orgStructureStartDate, orgStructureEndDate, orgStructureTPLStatus } = value
            let status = orgStructureTPLStatus === 'ACTIVE' ? 'YES' : 'NO'
            return [
                index += 1,
                orgStructureTPLID,
                orgStructureTPLName,
                orgStructureSKNumber,
                orgStructureStartDate,
                orgStructureEndDate,
                status
            ]
        }) : []
        return (
            <div className="vertical-tab-content active">
                <div className="padding-15px grid-mobile-none gap-20px">
                    <div className="col-1 content-right margin-bottom-10px">
                        {this.props.type !== 'detail' ?
                            <button
                                type="button"
                                className="btn btn-circle background-blue"
                                onClick={() => this.openForm("create")}
                            >
                                <i className="fa fa-1x fa-plus" />
                            </button>
                            : null}
                    </div>
                    <MuiThemeProvider theme={getMuiTheme()}>
                        <MUIDataTable
                            title="Organization Structure"
                            subtitle={"lorem ipsum dolor"}
                            data={dataTable}
                            columns={this.columns}
                            options={options}
                        />
                    </MuiThemeProvider>
                    {this.renderOrgChart()}
                    {createVisible && (
                        <FormCorporateOrgCreate
                            type={"create"}
                            esid={this.state.data.esid}
                            bizparCorporateLevel={this.state.bizparCorporateLevel}
                            bizparCorporateGrade={this.state.bizparCorporateGrade}
                            bizparCorporatePosition={this.state.bizparCorporatePosition}
                            masterIndex={0}
                            onClickSave={this.handleSubmit.bind(this)}
                            onClickClose={() => this.openForm("create")}
                        />
                    )}

                    {updateVisible && (
                        <FormCorporateOrgCreate
                            type={"update"}
                            esid={this.state.data.esid}
                            rawDataTableDetail={this.state.rawDataTableDetail}
                            bizparCorporateLevel={this.state.bizparCorporateLevel}
                            bizparCorporateGrade={this.state.bizparCorporateGrade}
                            bizparCorporatePosition={this.state.bizparCorporatePosition}
                            data={org[this.state.selectedIndex]}
                            masterIndex={this.state.selectedIndex}
                            onClickSave={this.handleUpdate.bind(this)}
                            onClickDelete={this.openDeletePopup.bind(this)}
                            onClickClose={() => this.openForm("update")}
                        />
                    )}

                    {viewVisible && (
                        <FormCorporateOrgCreate
                            type={"view"}
                            esid={this.state.data.esid}
                            rawDataTableDetail={this.state.rawDataTableDetail}
                            bizparCorporateLevel={this.state.bizparCorporateLevel}
                            bizparCorporateGrade={this.state.bizparCorporateGrade}
                            bizparCorporatePosition={this.state.bizparCorporatePosition}
                            data={org[this.state.selectedIndex]}
                            masterIndex={this.state.selectedIndex}
                            onClickSave={this.handleUpdate.bind(this)}
                            onClickDelete={this.openDeletePopup.bind(this)}
                            onClickClose={() => this.openForm("view")}
                        />
                    )}

                    {savePopUpVisible && (
                        <PopUp
                            type={"save"}
                            class={"app-popup app-popup-show"}
                            onClick={createVisible ? () => this.openForm("create") : () => this.openForm("update")} />
                    )}

                    {deletePopUpVisible && (
                        <PopUp
                            type={"delete"}
                            class={"app-popup app-popup-show"}
                            onClick={this.openDeletePopup.bind(this)}
                            onClickDelete={this.handleDelete.bind(this)}
                        />
                    )}
                </div>
            </div>
        )
    }
}

export default FormCorporateOrg