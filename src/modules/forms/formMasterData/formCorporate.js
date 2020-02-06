import React, { Component } from 'react'
import FormCorporateGeneral from './formCorporateGeneral'
import FormCorporateAddress from './formCorporateAddress'
import FormCorporateDocument from './formCorporateDocument'
import FormCorporateOrg from './formCorporateOrg'
import PopUp from '../../../components/pages/PopUpAlert'
import M from 'moment'
import API from '../../../Services/Api'
import FormCorporateBank from './formCorporateBank'

const dateNow = M().format('DD-MM-YYYY HH:mm:ss')

class FormCorporate extends Component {
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
            activeTab: "General",
            tabMenu: ["General", "Address", "Document", "Organization Structure", "Bank Account"]
        }
    }

    componentDidMount() {
        this.getAddressByEsIDP(this.state.data.esid)
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
                "modifiedBy": "SYSTEM",
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

    opNavigator = title => {
        let cl = title === this.state.activeTab ? "c-n-link active" : "c-n-link";
        return (
            <li key={title} className={cl} onClick={this.opContent(title)}>
                {title}
            </li>
        );
    };

    opContent = title => e => {
        e.preventDefault();

        let allStateVisibleFalse = {
            ...this.state,
            formCorporateGeneralVisible: false,
            formCorporateAddressVisible: false,
            formCorporateDocumentVisible: false,
            formCorporateOrgVisible: false,
            formBankAccountVisible: false,
            activeTab: title
        };

        switch (title) {
            case "General":
                allStateVisibleFalse = {
                    ...allStateVisibleFalse,
                    formCorporateGeneralVisible: true
                };
                break;
            case "Address":
                allStateVisibleFalse = {
                    ...allStateVisibleFalse,
                    formCorporateAddressVisible: true
                };
                break;
            case "Document":
                allStateVisibleFalse = {
                    ...allStateVisibleFalse,
                    formCorporateDocumentVisible: true
                };
                break;
            case "Organization Structure":
                allStateVisibleFalse = {
                    ...allStateVisibleFalse,
                    formCorporateOrgVisible: true
                };
                break;
            case "Bank Account":
                allStateVisibleFalse = {
                    ...allStateVisibleFalse,
                    formBankAccountVisible: true
                };
                break;
            default:
                break;
        }
        this.setState(allStateVisibleFalse);
    };

    render() {
        let { type, title } = this.props
        if (type === "update") title = "Edit Form"
        if (type === "detail") title = "View Form"
        return (
            <div className={"app-popup app-popup-show"}>
                <div className="padding-top-20px" />
                <div className="popup-content background-white border-radius">
                    <div className="popup-panel grid grid-2x">
                        <div className="col-1">
                            <div className="popup-title">
                                Corporate - {title}
                            </div>
                        </div>
                        <div className="col-2 content-right">
                            <button
                                className="btn btn-circle btn-grey"
                                onClick={this.props.onClickClose}
                            >
                                <i className="fa fa-lg fa-times" />
                            </button>
                        </div>
                    </div>

                    <div className="popup-content-grid">
                        <div className="popup-scroll popup-col-1">
                            <ul className="vertical-tab">
                                {this.state.tabMenu.map((data, index) => {
                                    return this.opNavigator(data);
                                })}
                            </ul>
                        </div>

                        <div className="popup-scroll popup-col-2">
                            {/* General */}
                            {this.state.formCorporateGeneralVisible && (
                                <FormCorporateGeneral
                                    type={type}
                                    bizparCorporateType={this.state.bizparCorporateType}
                                    data={this.state.data}
                                    onClickClose={this.props.onClickClose}
                                    onClickSave={this.handleUpdateGeneral.bind(this)}
                                />
                            )}

                            {this.state.formCorporateAddressVisible && (
                                <FormCorporateAddress
                                    type={type}
                                    data={this.state.address}
                                    rawData={this.state.data}
                                    onClickClose={this.props.onClickClose}
                                    backToPage={() => this.props.backToPage()}
                                />
                            )}

                            {this.state.formCorporateDocumentVisible && (
                                <FormCorporateDocument
                                    type={type}
                                    data={this.state.data}
                                    onClickClose={this.props.onClickClose}
                                    backToPage={() => this.props.backToPage()}
                                // onClickSave={() => this.setState({ savePopUpVisible: !this.state.savePopUpVisible })}
                                />
                            )}

                            {this.state.formCorporateOrgVisible && (
                                <FormCorporateOrg
                                    type={type}
                                    data={this.state.data}
                                    onClickClose={this.props.onClickClose}
                                    backToPage={() => this.props.backToPage()}
                                />
                            )}

                            {this.state.formBankAccountVisible && (
                                <FormCorporateBank
                                    type={type}
                                    data={this.state.data}
                                    onClickClose={this.props.onClickClose}
                                    backToPage={() => this.props.backToPage()}
                                    esId={this.state.data.esId}
                                />
                            )}
                        </div>
                    </div>
                    {this.state.savePopUpVisible && (
                        <PopUp
                            type={"save"}
                            class={"app-popup app-popup-show"}
                            onClick={() => this.props.backToPage()}
                        />
                    )}
                </div>
                <div className="padding-bottom-20px" />
            </div>
        )
    }
}

export default FormCorporate