import React, { Component } from "react"
import PopUp from "../../../components/pages/PopUpAlert"
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles"
import MUIDataTable from "mui-datatables-bitozen"
import Api from "../../../Services/Api"
import M from 'moment'
import * as R from 'ramda'
import FormCorpBankCreate from "./formCorporateBankCreate"
import { getBizpar } from "../../../Services/Utils"

var ct = require("../../../modules/custom/customTable");
const getMuiTheme = () => createMuiTheme(ct.customTable());
const options = ct.customOptions4();

class FormCorporateBank extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: this.props.data,
            savePopUpVisible: false,
            updatePopUpVisible: false,
            createVisible: false,
            updateVisible: false,
            viewVisible: false,
            deletePopUpVisible: false,
            dataTable: [],
            esId: this.props.esId,
            bizparCurrency:[]
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.data) {
            if (this.props.data !== prevProps.data) {
                this.setState({
                    data: this.props.data,
                })
                this.getData()
            }
        }
    }

    componentDidMount() {
        console.log(this.props.esId)
        this.getData()
        this.getBizparType()
    }   

    

    getBizparType = async () => {
        let bizparCurrency = await getBizpar("CURRENCY");
        this.setState({
            bizparCurrency,
        });
    };

    async getData() {
        let response = await Api.create("ES").getBankCorporateById(this.state.esId)
        console.log(response)
        if (response.data.status === 'S') {
            let dataTable = response.data.data.map((value, index) => {
                if (value === null) return []
                const { corporateBankAccountID, bankAccountNumber, bank, companyCode } = value
                return [
                    index += 1,
                    corporateBankAccountID,
                    bankAccountNumber,
                    bank === null ? "" : bank.bankName,
                    bank === null ? "" : bank.bicode,
                    companyCode
                ]
            })
            this.setState({ rawData: response.data.data, dataTable }, console.log(this.state.dataTable))
        } else {
            this.setState({
                dataTable: []
            })
        }
    }

    submitData(data) {
        Api.create('ES').postBankCorporate(data).then((res => {
            console.log(res)
            this.setState({
                createVisible: false
            })
        }))
        this.getData()
    }

    openForm = (type, index) => {
        let savePopUpVisible;
        switch (type) {
            case "create":
                savePopUpVisible = this.state.savePopUpVisible ? !this.state.savePopUpVisible : false
                this.setState({ createVisible: !this.state.createVisible, savePopUpVisible })
                break
            case "edit":
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

    openPopUp = (type, index) => {
        console.log(index)
        switch (type) {
            case "save":
                this.setState({ savePopUpVisible: !this.state.savePopUpVisible, createVisible: false })
                break
            case "edit":
                this.setState({ updatePopUpVisible: !this.state.updatePopUpVisible, createVisible: false })
                break
            case "delete":
                this.setState({ deletePopUpVisible: !this.state.deletePopUpVisible, selectedIndex: index })
                break
            default:
                break
        }
    }

    handleDelete() {
        Api.create('ES').deleteBankCorp(this.state.esId + '/' + this.state.selectedIndex.corporateBankAccountID).then(res => {
            console.log(res)
            this.setState({
                deletePopUpVisible: false
            })
            this.getData()
        })
    }

    handleUpdate(data) {
        console.log(data)
        let body = {
            bank: data.bank,
            bankAccountNumber: data.bankAccountNumber,
            branchCode: data.branchCode,
            companyCode: data.companyCode,
            corporateBankAccountID: data.corporateBankAccountID,
            currency: data.currency,
            description: data.description,
            esID: this.state.esId
        }
        Api.create('ES').updateBankAccount(body).then(res => {
            console.log(res)
            this.setState({
                updatePopUpVisible: false
            })
        })
    }

    columns = [
        "No",
        "Corporate Bank ID",
        "Corporate Bank Account Number ",
        "Bank Name",
        "BI Code",
        "Company Code",
        {
            name: "Action",
            options: {
                customHeadRender: (columnMeta) => (
                    <th key={columnMeta.index}
                        style={{ cursor: 'pointer', borderBottom: "1px rgba(0,0,0,0.1) solid", fontSize: 13, fontWeight: 1, textAlign: "right", paddingRight: "20px", top: 0, position: "sticky", backgroundColor: "#fff", zIndex: 100 }} scope="col">
                        {columnMeta.name}
                    </th>
                ),
                customBodyRender: (val, tableMeta) => {
                    return (
                        <div className='display-flex-normal' style={{ justifyContent: 'flex-end' }}>
                            <button
                                type='button'
                                onClick={() => this.openForm("edit", this.state.rawData[tableMeta.rowIndex])}
                                className="btnAct margin-right-10px">
                                <i className="fa fa-pencil-alt" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }} />
                            </button>
                            <button

                                type='button'
                                onClick={() => this.openPopUp('delete', this.state.rawData[tableMeta.rowIndex])}
                                className="btnAct margin-right-10px">
                                <i className="fa fa-trash-alt" style={{ backgroundColor: 'transparent', color: 'red', fontSize: 20 }} />
                            </button>
                            <button
                                type='button'
                                onClick={() => this.openForm("view", this.state.rawData[tableMeta.rowIndex])}
                                className="btnAct">
                                <i className="fa fa-ellipsis-v" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }} />
                            </button>
                        </div>
                    )
                }
            }
        }
    ]

    data = [
        ["1", "CB-001", "22122223", "BCA", "001002003", "12345"],
        ["2", "CB-002", "22321414", "PERMATA", "009008003", "212414"],
        ["3", "CB-003", "23515212", "Bank ARTHA GRAHA", "003003005", "38743"],
    ]

    render() {
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
                            title='Corporate Bank Account'
                            subtitle={"lorem ipsum dolor"}
                            data={this.state.dataTable}
                            columns={this.columns}
                            options={options}
                        />
                    </MuiThemeProvider>
                    {this.state.createVisible && (
                        <FormCorpBankCreate
                            type={"create"}
                            esId={this.props.esId}
                            // bizparCorporateLevel={this.state.bizparCorporateLevel}
                            // bizparCorporateGrade={this.state.bizparCorporateGrade}
                            // bizparCorporatePosition={this.state.bizparCorporatePosition}
                            // masterIndex={0}
                            onClickSave={this.submitData.bind(this)}
                            onClickClose={() => this.openForm("create")}
                        />
                    )}
                    {this.state.updateVisible && (
                        <FormCorpBankCreate
                            type={"edit"}
                            // esid={this.state.data.esid}
                            // bizparCorporateLevel={this.state.bizparCorporateLevel}
                            // bizparCorporateGrade={this.state.bizparCorporateGrade}
                            // bizparCorporatePosition={this.state.bizparCorporatePosition}
                            // masterIndex={0}
                            bizparCurrency={this.state.bizparCurrency}
                            rawData={this.state.selectedIndex}
                            onClickUpdate={this.handleUpdate.bind(this)}
                            onClickClose={() => this.openForm("edit")}
                        />
                    )}
                    {this.state.viewVisible && (
                        <FormCorpBankCreate
                            type={"view"}
                            // esid={this.state.data.esid}
                            // bizparCorporateLevel={this.state.bizparCorporateLevel}
                            // bizparCorporateGrade={this.state.bizparCorporateGrade}
                            // bizparCorporatePosition={this.state.bizparCorporatePosition}
                            // masterIndex={0}
                            bizparCurrency={this.state.bizparCurrency}
                            rawData={this.state.selectedIndex}
                            onClickSave={this.openForm.bind(this)}
                            onClickClose={() => this.openForm("view")}
                        />
                    )}

                    {this.state.updatePopUpVisible && (
                        <PopUp
                            type={"save"}
                            class={"app-popup app-popup-show"}
                            onClick={() => this.handleUpdate.bind(this)}
                        />
                    )}

                    {this.state.deletePopUpVisible && (
                        <PopUp
                            type={"delete"}
                            class={"app-popup app-popup-show"}
                            onClick={() => this.openPopUp("delete")}
                            onClickDelete={() => this.handleDelete()}
                        />
                    )}
                </div>
            </div>
        )
    }
}

export default FormCorporateBank;