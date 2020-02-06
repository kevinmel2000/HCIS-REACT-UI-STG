import React, { Component } from 'react'
import ReactTooltip from 'react-tooltip'
import FormCorporateGeneral from './formCorporateGeneral'
import FormCorporateAddress from './formCorporateAddress'
import FormCorporateDocument from './formCorporateDocument'
import FormCorporateOrg from './formCorporateOrg'
import PopUp from '../../../components/pages/PopUpAlert'
import M from 'moment'
import API from '../../../Services/Api'
import FormCorporateBank from './formCorporateBank'

const dateNow = M().format('DD-MM-YYYY HH:mm:ss')

class SlideCorporate extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: this.props.data,
            bizparCorporateType: this.props.bizparCorporateType,
            formCorporateGeneralVisible: true,
            formCorporateAddressVisible: false,
            formCorporateDocumentVisible: false,
            formCorporateOrgVisible: false,
            formBankAccountVisible: false,
            formSearchEmpVisible: false,
            formSearchHoldingVisible: false,
            esData: this.props.data.branchRelationshipDTO,
            chartVisible: false
        }
    }

    componentDidMount() {
        this.getAddressByEsIDP(this.state.data.esid)
        this.getBankCorp()
    }

    async handleUpdateGeneral(data) {
        // return console.log(data)
        let { dataCompany } = ''
        dataCompany = this.state.data
        delete dataCompany.address
        // dataOrg = dataCompany.orgStructureTPL

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
                // "payload": {},
                "referenceOrgStructureTPLID": value.referenceOrgStructureTPLID !== null ? value.referenceOrgStructureTPLID.orgStructureTPLId : ''
            }
        })
        let payload = {
            ...data,
            "estype": !data.estype ? '' : data.estype.bizparKey ? data.estype.bizparKey : data.estype,
            "esCreational": {
                "createdBy": data.esCreational.createdBy,
                "createdDate": data.esCreational.createdDate,
                "modifiedBy": this.props.user.employeeID,
                "modifiedDate": dateNow
            },
            "esStatus": 'ACTIVE',
            "orgStructureTPL": existingData,
        }

        console.log('payload', payload)
        let res = await API.create('ES').updateCompGeneral(payload)
        console.log('update company', res)
        if (res.data.code === '201' && res.data.status === 'S') {
            this.props.backToPage()
        }
    }

    async getAddressByEsIDP(value) {
        let payload = {
            "params": {
                "refObjectID": value
            },
            "offset": 0,
            "limit": 10
        }
        let res = await API.create('MASTERDATA').getAddressByRefObjectID(payload)
        console.log('Loadind Address...')
        if (res.data.code === '201' && res.data.status === 'S') {
            console.log('Success', res)
            this.setState({ address: res.data.data })
        } else {
            console.log('failed', res)
            this.setState({ address: [] })
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.data) {
            if (this.props.data !== prevProps.data) {
                this.setState({
                    data: this.props.data,
                    esData: this.props.data.branchRelationshipDTO

                })
                this.getAddressByEsIDP(this.props.data.esid)
            }
        }
    }

    getBankCorp() {
        API.create('ES').getBankCorporateById(this.props.esId).then((res) => {
            console.log(res)
        })
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
            <ul style={{ whiteSpace: 'nowrap' }}>
                {data.branch.map((data, index) => {
                    return (
                        <li>
                            <label for={'child-' + data.esname} style={{ flexWrap: 'wrap' }}>
                                {this.cardSpace(data.esname, '')}
                            </label>
                            <input
                                checked={true}
                                id={'child-' + data.esname}
                                className="tree-button"
                                type="checkbox" />
                            {data.branch.length > 0 && this.renderChildren(data)}
                        </li>
                    )
                })}
            </ul>
        )
    }

    renderOrgChart = () => {
        let esData = this.props.data.branchRelationshipDTO
        if (esData && esData.branch) {
            return (
                <div className="tree hidden background-dark-grey"  style={{ whiteSpace: 'nowrap', width: 0 }}>
                    <ul>
                        <li>
                            <label for='parent'>
                                {this.cardSpace(esData.esname, '')}
                            </label>
                            <input
                                id='parent'
                                checked={true}
                                className="tree-button"
                                type="checkbox" />
                            {esData.branch.length > 0 && this.renderChildren(esData)}
                        </li>
                    </ul>
                </div>
            )
        }
        else return (
            <div className="tree hidden background-dark-grey" style={{ whiteSpace: 'nowrap', width: 0 }}>
                <ul>
                    <li>
                        <label for='parent'>
                            {this.cardSpace(this.state.data.esname, '')}
                        </label>
                        <input
                            id='parent'
                            checked={true}
                            className="tree-button"
                            type="checkbox" />
                    </li>
                </ul>
            </div>
        )
    }

    openChart = () => {
        this.setState({ chartVisible: !this.state.chartVisible })
    }


    render() {
        let { type, title } = this.props
        if (type === "update") title = "Edit Form"
        if (type === "detail") title = "Detail Form"
        return (
            <div>
                <div className="a-s-p-place active">
                    <div className="a-s-p-top">
                        <div className="grid grid-2x">
                            <div className="col-1">
                                <div className="display-flex-normal margin-top-10px">
                                    <i className="fa fa-1x fa-building"></i>
                                    <span className="txt-site txt-11 txt-main margin-left-10px">
                                        Corporate - {title}
                                    </span>
                                </div>
                            </div>
                            <div className="col-2 content-right">
                                <button
                                    onClick={this.props.onClickClose}
                                    className="btn btn-circle btn-grey">
                                    <i className="fa fa-lg fa-arrow-right" />
                                </button>
                            </div>
                        </div>
                    </div>
                    <form action="#">
                        <div className="a-s-p-mid a-s-p-pad border-top">
                            <div className="padding-5px">
                                <div className="app-open-close margin-bottom-20px">
                                    <input
                                        type="checkbox"
                                        name="navmenu"
                                        className="app-open-close-input"
                                        id="navmenu-ch" />
                                    <div className="grid grid-2x margin-bottom-10px">
                                        <div className="col-1">
                                            <div className="display-flex-normal margin-top-10px">
                                                <i className="fa fa-1x fa-building margin-right-5px"></i>
                                                <span className="txt-site txt-11 txt-main">Corporate General</span>
                                            </div>
                                        </div>
                                        <div className="col-2 content-right">
                                            <label htmlFor="navmenu-ch">
                                                <div className="app-open-close-icon"></div>
                                            </label>
                                        </div>
                                    </div>
                                    <div className="app-open-close-content">
                                        <FormCorporateGeneral
                                            type={type}
                                            bizparCorporateType={this.state.bizparCorporateType}
                                            data={this.state.data}
                                            onClickClose={this.props.onClickClose}
                                            onClickSave={this.handleUpdateGeneral.bind(this)}
                                        />
                                    </div>
                                </div>
                                <div className="app-open-close margin-bottom-20px">
                                    <input
                                        type="checkbox"
                                        name="navmenu"
                                        className="app-open-close-input"
                                        id="navmenu-c" />
                                    <div className="grid grid-2x margin-bottom-10px">
                                        <div className="col-1">
                                            <div className="display-flex-normal margin-top-10px">
                                                <i className="fa fa-1x fa-building margin-right-5px"></i>
                                                <span className="txt-site txt-11 txt-main">Corporate Address</span>
                                            </div>
                                        </div>
                                        <div className="col-2 content-right">
                                            <label htmlFor="navmenu-c">
                                                <div className="app-open-close-icon"></div>
                                            </label>
                                        </div>
                                    </div>
                                    <div className="app-open-close-content">
                                        <FormCorporateAddress
                                            type={type}
                                            data={this.state.address}
                                            rawData={this.props.data}
                                            onClickClose={this.props.onClickClose}
                                            backToPage={() => this.props.backToPage()}
                                        />
                                    </div>
                                </div>
                                <div className="app-open-close margin-bottom-20px">
                                    <input
                                        type="checkbox"
                                        name="navmenu"
                                        className="app-open-close-input"
                                        id="navmenu-11" />
                                    <div className="grid grid-2x margin-bottom-10px">
                                        <div className="col-1">
                                            <div className="display-flex-normal margin-top-10px">
                                                <i className="fa fa-1x fa-building margin-right-5px"></i>
                                                <span className="txt-site txt-11 txt-main">Corporate Document</span>
                                            </div>
                                        </div>
                                        <div className="col-2 content-right">
                                            <label htmlFor="navmenu-11">
                                                <div className="app-open-close-icon"></div>
                                            </label>
                                        </div>
                                    </div>
                                    <div className="app-open-close-content">
                                        <FormCorporateDocument
                                            user={this.props.user}
                                            type={type}
                                            data={this.state.data}
                                            onClickClose={this.props.onClickClose}
                                            backToPage={() => this.props.backToPage()}
                                            getCompanyAll={() => this.props.getCompanyAll()}
                                        // onClickSave={() => this.setState({ savePopUpVisible: !this.state.savePopUpVisible })}
                                        />
                                    </div>
                                </div>
                                <div className="app-open-close margin-bottom-20px">
                                    <input
                                        type="checkbox"
                                        name="navmenu"
                                        className="app-open-close-input"
                                        id="navmenu-" />
                                    <div className="grid grid-2x margin-bottom-10px">
                                        <div className="col-1">
                                            <div className="display-flex-normal margin-top-10px">
                                                <i className="fa fa-1x fa-building margin-right-5px"></i>
                                                <span className="txt-site txt-11 txt-main">Corporate Organization</span>
                                            </div>
                                        </div>
                                        <div className="col-2 content-right">
                                            <label htmlFor="navmenu-">
                                                <div className="app-open-close-icon"></div>
                                            </label>
                                        </div>
                                    </div>
                                    <div className="app-open-close-content">
                                        <FormCorporateOrg
                                            type={type}
                                            data={this.state.data}
                                            onClickClose={this.props.onClickClose}
                                            backToPage={() => this.props.backToPage()}
                                        />
                                    </div>
                                </div>
                                <div className="app-open-close margin-bottom-20px">
                                    <input
                                        type="checkbox"
                                        name="navmenu"
                                        className="app-open-close-input"
                                        id="navmenu-12" />
                                    <div className="grid grid-2x margin-bottom-10px">
                                        <div className="col-1">
                                            <div className="display-flex-normal margin-top-10px">
                                                <i className="fa fa-1x fa-building margin-right-5px"></i>
                                                <span className="txt-site txt-11 txt-main">Corporate Bank Account</span>
                                            </div>
                                        </div>
                                        <div className="col-2 content-right">
                                            <label htmlFor="navmenu-12">
                                                <div className="app-open-close-icon"></div>
                                            </label>
                                        </div>
                                    </div>
                                    <div className="app-open-close-content">
                                        <FormCorporateBank
                                            esId={this.props.esId}
                                            type={type}
                                            data={this.state.data}
                                            onClickClose={this.props.onClickClose}
                                            backToPage={() => this.props.backToPage()}
                                        />
                                    </div>
                                </div>
                                {type === 'detail' && (
                                    <div className="app-open-close margin-bottom-20px">
                                        <input
                                            type="checkbox"
                                            name="navmenu"
                                            className="app-open-close-input"
                                            id="navmenu-view" />
                                        <div className="grid grid-2x margin-bottom-10px">
                                            <div className="col-1">
                                                <div className="display-flex-normal margin-top-10px">
                                                    <i className="fa fa-1x fa-building margin-right-5px"></i>
                                                    <span className="txt-site txt-11 txt-main">HO - Branch Relationship</span>
                                                </div>
                                            </div>
                                            <div className="col-2 content-right">
                                                <label htmlFor="navmenu-view">
                                                    <button
                                                        type="button"
                                                        className="btn btn-small-circle btn-sekunder margin-left-5px"
                                                        onClick={this.state.data.estype.bizparKey === 'CORPTYP-002' ? this.openChart.bind(this) : null}>
                                                        <i className="fa fa-lg fa-expand-arrows-alt" />
                                                    </button>
                                                </label>
                                            </div>
                                        </div>
                                        <div className="app-open-close-content">
                                            {this.state.data.estype.bizparKey === 'CORPTYP-001' && (
                                                // <div style={{textAlign: "center"}}>You Don't Have Acces To View This Data</div>
                                                <div className="tree hidden background-dark-grey content-center" style={{ overflow: "auto" }}>
                                                    <div className="txt-site txt-11 txt-thin txt-main" style={{ padding: "30px" }}> You don't have access to view this data </div>
                                                </div>
                                            )}
                                            {this.state.data.estype.bizparKey === 'CORPTYP-002' && (
                                                <div className="display-flex-normal" style={{ justifyContent: "center" }}>
                                                    {this.state.data.branchRelationshipDTO ? this.renderOrgChart() : <div style={{ padding: "15px", margin: "15px" }}> Visualization Not Found </div>}
                                                </div>
                                            )}
                                            {this.state.chartVisible && (
                                                <div className="app-popup app-popup-show">
                                                    <div className="padding-top-20px" />
                                                    <div className="popup-content background-white border-radius">

                                                        <div className="popup-panel grid grid-2x">
                                                            <div className="col-1">
                                                                <div className="popup-title">
                                                                    HO - Branch Relationship: {this.state.data.esid}
                                                                </div>
                                                            </div>
                                                            <div className="col-2 content-right">
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-circle btn-grey"
                                                                    onClick={this.openChart.bind(this)}>
                                                                    <i className="fa fa-lg fa-times" />
                                                                </button>
                                                            </div>
                                                        </div>
                                                        <div className="display-flex-normal" style={{ justifyContent: "center" }}>
                                                            {this.state.data.branchRelationshipDTO ? this.renderOrgChart() : <div style={{ padding: "15px", margin: "15px" }}> Visualization Not Found </div>}
                                                        </div>
                                                        <div className="padding-10px content-right">
                                                            <button
                                                                style={{ marginLeft: "15px" }}
                                                                className="btn btn-primary"
                                                                type="button"
                                                                onClick={this.openChart.bind(this)}
                                                            >
                                                                <span>CLOSE</span>
                                                            </button>
                                                        </div>
                                                        <div className="margin-bottom-15px"></div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </form>
                    <ReactTooltip />
                </div>
                {this.state.savePopUpVisible && (
                    <PopUp
                        type={"save"}
                        class={"app-popup app-popup-show"}
                        onClick={this.handlePopUp.bind(this)}
                    />
                )}
                {this.state.deletePopUpVisible && (
                    <PopUp
                        type={"delete"}
                        class={"app-popup app-popup-show"}
                        onClickDelete={this.handleDelete}
                        onClick={this.openDeletePopup}
                    />
                )}
            </div>
        )
    }
}

export default SlideCorporate