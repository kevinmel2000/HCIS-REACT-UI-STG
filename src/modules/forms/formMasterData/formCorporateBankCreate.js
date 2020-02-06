import React, { Component } from "react";
import M from "moment";
import CalendarPicker from "../../../modules/popup/Calendar";
import DropDown from "../../../modules/popup/DropDown";
import FormSearchBank from './formSearchBank'
import { getBizpar } from "../../../Services/Utils";

const payload = {
    "bank": "",
    "bankAccountNumber": "",
    "branchCode": "",
    "companyCode": "",
    "corporateBankAccountID": "",
    "currency": "",
    "description": "",
    "esID": ""
}

class FormCorpBankCreate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {
                ...payload,
                corporateBankAccountID: 'CORPBANK-' + M(),
                esID: this.props.esId
            },
            dataEdit: this.props.rawData,
            bizparCurrency:this.props.bizparCurrency
        }
    }

    componentDidMount() { 
        if (this.props.type !== 'create') {
            this.setState({
                data: {
                    ...this.props.rawData,
                    bankName: this.props.rawData.bank.bankName,
                    bicode: this.props.rawData.bank.bicode,
                    bank: this.props.rawData.bank.bankID,
                    currency: this.props.rawData.currency.bizparKey
                }
            })
        }
        console.log(this.props.rawData)
    }

    openSearchBank() {
        this.setState({ formSearchBank: !this.state.formSearchBank })
    }

    getSearchBank(data) {
        console.log(data)
        this.setState({
            data: {
                ...this.state.data,
                bank: data.bankID,
                bicode: data.bicode,
                bankName: data.bankName
            },
            formSearchBank: false
        })
    }

    render() {
        return (
            <div>
                <div className="app-popup app-popup-show">
                    {this.state.formSearchBank && (
                        <FormSearchBank
                            onClickClose={this.openSearchBank.bind(this)}
                            onClick={this.getSearchBank.bind(this)}
                        />
                    )}
                    <div className="padding-top-20px" />
                    <div className="popup-content background-white border-radius">
                        <div className="popup-panel grid grid-2x">
                            <div className="col-1">
                                <div className="popup-title">
                                    {
                                        this.props.type === 'create' ? "Corporate Bank Account - Create Form" :
                                            this.props.type === 'view' ? "Corporate Bank Account - View Form" : "Corporate Bank Account - Edit Form"
                                    }
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
                        <form
                            action="#"
                            onSubmit={e => {
                                e.preventDefault();
                                this.props.type === 'edit' ? this.props.onClickUpdate(this.state.data) : this.props.onClickSave(this.state.data)
                            }}
                        >
                            <div className="border-bottom padding-15px grid grid-2x grid-mobile-none gap-15px">
                                <div className="column-1">
                                    <div className="margin-bottom-15px">
                                        <div className="margin-5px">
                                            <div className="txt-site txt-11 txt-main txt-bold">
                                                <h4>
                                                    Corporate Bank ID<span style={{ color: "red" }}>*</span>
                                                </h4>
                                            </div>
                                        </div>
                                        <input
                                            type="text"
                                            className="txt txt-sekunder-color"
                                            readOnly
                                            value={this.state.data.corporateBankAccountID}
                                            style={{ backgroundColor: "#E6E6E6" }}
                                            placeholder={"Bank ID"}
                                        />
                                    </div>
                                    <div className="margin-bottom-15px">
                                        <div className="margin-5px">
                                            <div className="txt-site txt-11 txt-main txt-bold">
                                                <h4>
                                                    Corporate Bank Account Number <span style={{ color: "red" }}>*</span>
                                                </h4>
                                            </div>
                                        </div>
                                        <input
                                            type="text"
                                            className="txt txt-sekunder-color"
                                            onChange={(e) => {
                                                this.setState({
                                                    data: {
                                                        ...this.state.data,
                                                        bankAccountNumber: e.target.value
                                                    }
                                                })
                                            }}
                                            value={this.state.data.bankAccountNumber}
                                            placeholder={"Corporate Bank Account Number"}
                                        />
                                    </div>
                                    <div className="card-date-picker margin-bottom-15px">
                                        <div className="margin-5px">
                                            <div className="txt-site txt-11 txt-main txt-bold">
                                                <h4>
                                                    Bank Name <span style={{ color: "red" }}>*</span>
                                                </h4>
                                            </div>
                                        </div>
                                        <div className="double">
                                            <input
                                                type="text"
                                                className="txt txt-sekunder-color"
                                                readOnly
                                                value={this.state.data.bankName}
                                                style={{ backgroundColor: "#E6E6E6" }}
                                                placeholder={"Bank Name"}
                                            />
                                            <button
                                                type="button"
                                                className="btn btn-grey border-left btn-no-radius"
                                                onClick={() => this.openSearchBank()}
                                            >
                                                <i className="fa fa-lg fa-search"></i>
                                            </button>
                                        </div>
                                    </div>
                                    <div className="margin-bottom-15px">
                                        <div className="margin-5px">
                                            <div className="txt-site txt-11 txt-main txt-bold">
                                                <h4>
                                                    BI Code <span style={{ color: "red" }}>*</span>
                                                </h4>
                                            </div>
                                        </div>
                                        <input
                                            type="text"
                                            className="txt txt-sekunder-color"
                                            readOnly
                                            value={this.state.data.bicode}
                                            style={{ backgroundColor: "#E6E6E6" }}
                                            placeholder={"BI Code"}
                                        />
                                    </div>
                                    <div className="margin-bottom-15px">
                                        <div className="margin-5px">
                                            <div className="txt-site txt-11 txt-main txt-bold">
                                                <h4>
                                                    Company Code <span style={{ color: "red" }}>*</span>
                                                </h4>
                                            </div>
                                        </div>
                                        <input
                                            type="text"
                                            className="txt txt-sekunder-color"
                                            onChange={(e) => {
                                                this.setState({
                                                    data: {
                                                        ...this.state.data,
                                                        companyCode: e.target.value
                                                    }
                                                })
                                            }}
                                            value={this.state.data.companyCode}
                                            placeholder={"Company Code"}
                                        />
                                    </div>
                                </div>
                                <div className="column-2">
                                    <div className="margin-bottom-15px">
                                        <div className="margin-5px">
                                            <div className="txt-site txt-11 txt-main txt-bold">
                                                <h4>
                                                    Currency<span style={{ color: "red" }}>*</span>
                                                </h4>
                                            </div>
                                        </div>
                                        <DropDown 
                                            title="-- please select currency --"
                                            // bizValue={dataEdit.vendorType}
                                            data={this.state.bizparCurrency}
                                            onChange={(e) => {
                                                this.setState({
                                                    data: {
                                                        ...this.state.data,
                                                        currency: e
                                                    }
                                                })
                                            }}
                                            value={this.props.rawData ? this.props.rawData.currency.bizparKey : this.state.data.currency}
                                            type='bizpar'
                                        />
                                    </div>
                                    <div className="margin-bottom-15px">
                                        <div className="margin-5px">
                                            <div className="txt-site txt-11 txt-main txt-bold">
                                                <h4>
                                                    Branch Code <span style={{ color: "red" }}>*</span>
                                                </h4>
                                            </div>
                                        </div>
                                        <input
                                            type="text"
                                            className="txt txt-sekunder-color"
                                            onChange={(e) => {
                                                    this.setState({
                                                        data: {
                                                            ...this.state.data,
                                                            branchCode: e.target.value
                                                        }
                                                    })
                                            }}
                                            value={this.state.data.branchCode}
                                            placeholder={"Branch Code"}
                                        />
                                    </div>
                                    <div className="margin-bottom-15px">
                                        <div className="margin-5px">
                                            <div className="txt-site txt-11 txt-main txt-bold">
                                                <h4>
                                                    Description<span style={{ color: "red" }}>*</span>
                                                </h4>
                                            </div>
                                        </div>
                                        <textarea
                                            type="text"
                                            className="txt txt-sekunder-color"
                                            rows={6}
                                            placeholder={"Description"}
                                            onChange={(e) => {
                                                    this.setState({
                                                        data: {
                                                            ...this.state.data,
                                                            description: e.target.value
                                                        }
                                                    })
                                            }}
                                            value={this.state.data.description}
                                        />
                                    </div>
                                    <div className="padding-15px">
                                        <div className="grid grid-2x">
                                            <div className="col-1"></div>
                                            <div className="col-2 content-right">
                                                <button className="btn btn-blue" type="submit">
                                                    <span>SAVE</span>
                                                </button>
                                                <button
                                                    style={{ marginLeft: "15px" }}
                                                    className="btn btn-primary"
                                                    type="button"
                                                    onClick={this.props.onClickClose.bind(this)}
                                                >
                                                    <span>CLOSE</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}

export default FormCorpBankCreate;