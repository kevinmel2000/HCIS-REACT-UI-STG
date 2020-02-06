import React, { Component } from 'react'
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables-bitozen";
import PopUp from "../../../components/pages/PopUpAlert"
import * as R from 'ramda'
import DropDown from '../../../modules/popup/DropDown'
import FormPaymentCreate from './formPaymentMethodCreate';


var ct = require("../../../modules/custom/customTable");
const getMuiTheme = () => createMuiTheme(ct.customTable());
const options = ct.customOptions();

class formPaymentMethod extends Component {
    constructor(props) {
        super(props)
        let { employeeData } = this.props
        this.state = {
            savePopUp: false,
            closepage: false,
            createVisible: false,
            createPopUpVisible: false,
            deletePopUpVisible: false,
            createVisible: false,
            editVisible: false,
            viewVisible: false,
            savePopUpVisible: false,
            notifVisible: false,
            employeeData: employeeData,
            dataTable: [
                ["1", "PAY-001", "BANK ARTHA GRAHA", "1000001", "MUHAMMAD AMMAR RIYADI", "IDR", "PERCENTAGE", "COMPUTE"],
                ["2", "PAY-002", "BANK ARTHA GRAHA", "1000002", "MUHAMMAD AMMAR RIYADI", "IDR", "PERCENTAGE", "COMPUTE"],
            ]
        }
    }

    openCloseCreate(type, selectedIndex = null) {
        let { createVisible, editVisible, viewVisible, openDeletePopup } = this.state
        let createPopUpVisible = this.state.createPopUpVisible ? !this.state.createPopUpVisible : false;
        switch (type) {
            case "create":
                this.setState({ createVisible: !createVisible, createPopUpVisible })
                break;
            case "edit":
                this.setState({ editVisible: !editVisible, createPopUpVisible, selectedIndex })
                break;
            case "view":
                this.setState({ viewVisible: !viewVisible, selectedIndex })
                break;
            case "delete":
                this.setState({ openDeletePopup: !openDeletePopup, selectedIndex })
                break;
            default:
                break;
        }
    }

    openCloseEdit(selectedIndex) {
        let savePopUpVisible = this.state.savePopUpVisible ? !this.state.savePopUpVisible : false;
        this.setState({
            editVisible: !this.state.editVisible, selectedIndex,
            savePopUpVisible
        });
    }

    openCloseView(selectedIndex) {
        this.setState({ viewVisible: !this.state.viewVisible, selectedIndex });
    }

    openDeletePopup(index) {
        this.setState({ deletePopUpVisible: !this.state.deletePopUpVisible, selectedIndex: index })
    };

    closeNotif() {
        this.setState({ notifVisible: false })
    }

    openSavePopup() {
        this.setState({ savePopUpVisible: !this.state.savePopUpVisible })
    };

    columns = [
        "No",
        "Payment ID",
        "Bank Name",
        "Account Number",
        "Account Name",
        "Currency",
        "Share Method",
        "Type",
        {
            name: "Action",
            options: {
                customBodyRender: (val, tableMeta) => {
                    return (
                        this.props.type !== 'view' ?
                            <div className='grid grid-3x'>
                                <div className='column-1'>
                                    <button
                                        type="button"
                                        className="btnAct"
                                        style={{ marginRight: 15 }}
                                        onClick={() => this.openCloseEdit(tableMeta.rowIndex)}
                                    >
                                        <i className="fa fa-lw fa-pencil-alt" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }} />
                                    </button>
                                </div>
                                <div className='column-2'>
                                    <button
                                        type="button"
                                        className="btnAct"
                                        style={{ marginRight: 15 }}
                                        onClick={() => this.openDeletePopup(tableMeta.rowIndex)}
                                    >
                                        <i className="fa fa-lw fa-trash-alt" style={{ backgroundColor: 'transparent', color: 'red', fontSize: 20 }} />
                                    </button>
                                </div>
                                <div className='column-3'>
                                    <button
                                        type="button"
                                        className="btnAct"
                                        onClick={() => this.openCloseView(tableMeta.rowIndex)}
                                    >
                                        <i className="fa fa-lw fa-ellipsis-v" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }} />
                                    </button>
                                </div>
                            </div> :
                            <button
                                type="button"
                                className="btnAct"
                                onClick={() => this.openCloseView(tableMeta.rowIndex)}
                            >
                                <i className="fa fa-lw fa-ellipsis-v" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }} />
                            </button>
                    );
                }
            }

        }
    ];

    render() {
        return (
            <div className="vertical-tab-content-active" id="content-nav-5">
                <form action="#">
                    <div className="padding-10px  grid-mobile-none gap-20px">
                        <div className="col-1 content-right">
                            {this.props.type !== 'view' ?
                                <button
                                    type="button"
                                    className="btn btn-circle background-blue"
                                    onClick={() => this.openCloseCreate("create")}
                                >
                                    <i className="fa fa-1x fa-plus" />
                                </button>
                                : null}
                        </div>
                        <div className="padding-5px" />
                        <MuiThemeProvider theme={getMuiTheme()}>
                            <MUIDataTable
                                title={"Payment Method"}
                                subtitle={"lorem ipsum dolor"}
                                data={this.state.dataTable}
                                columns={this.columns}
                                options={options}
                            />
                        </MuiThemeProvider>
                    </div>
                </form>
                {this.state.createVisible && (
                    <FormPaymentCreate
                        type={"create"}
                        onClickClose={() => this.openCloseCreate("create")}
                    />
                )}
                {this.state.editVisible && (
                    <FormPaymentCreate
                        type={"update"}
                        onClickClose={() => this.openCloseCreate("edit")}
                    />
                )}

                {this.state.viewVisible && (
                    <FormPaymentCreate
                        type={"view"}
                        onClickClose={() => this.openCloseCreate("view")}
                    />
                )}

                {/* 
                {this.state.viewVisible && (
                    <FormInsurance
                        type={"view"}
                        insuranceData={this.state.employeeData.employeeInsurances[this.state.selectedIndex]}
                        bizparInsuranceCategory={this.state.bizparInsuranceCategory}
                        bizparInsuranceType={this.state.bizparInsuranceType}
                        bizparFamilyFaskes={this.state.bizparFamilyFaskes}
                        bizparFamilyFaskesClass={this.state.bizparFamilyFaskesClass}
                        backToPage={this.openEmployeeDetailUpdate}
                        onClickClose={this.openCloseView.bind(this)}

                    />
                )} */}

                {this.state.createPopUpVisible && (
                    <PopUp
                        type={"save"}
                        class={"app-popup app-popup-show"}
                        onClick={() => {
                            this.setState({
                                createVisible: false,
                                editVisible: false,
                                createPopUpVisible: false
                            })
                            this.props.backToPage()
                        }}
                    />
                )}
                {this.state.deletePopUpVisible && (
                    <PopUp
                        type={"delete"}
                        class={"app-popup app-popup-show"}
                        onClick={this.openDeletePopup.bind(this)}
                        onClickDelete={(value) => this.handleSubmit(value, "delete")}
                    />
                )}
            </div>
        )
        // let { employeeData } = this.state
        // let { bizparPaymentMethod, bizparCurrency, bizparBank, bizparThrBase } = this.props
        // return (
        //     <div className="vertical-tab-content-active">
        //         <div className="padding-10px grid-mobile-none gap-20px">
        //             <div className="col-1">
        //                 PAYMENT METHOD
        //                 </div>
        //             <form action="#"
        //                 onSubmit={(e) => {
        //                     e.preventDefault()
        //                     if (R.isEmpty(this.state.employeeData.employeePaymentMethod.employeeTHRBase) || R.isEmpty(this.state.employeeData.employeePaymentMethod.employeeTHRBase.bizparKey) || R.isNil(this.state.employeeData.employeePaymentMethod.employeeTHRBase) || R.isNil(this.state.employeeData.employeePaymentMethod.employeeTHRBase.bizparKey)) return alert('THR Base is Required.')
        //                     if(isNaN(this.state.employeeData.employeePaymentMethod.employeeAccountNumber) === true) return alert("Account Number Must Be Numeric")
        //                     else this.props.onClickSave(this.state.employeeData)
        //                 }}
        //             >
        //                 <div className="border-bottom padding-15px grid grid-2x grid-mobile-none gap-15px">
        //                     <div className="coloumn-1">
        //                         <div className="margin-bottom-20px">
        //                             <div className="margin-5px">
        //                                 <div className="txt-site txt-11 txt-main txt-bold">
        //                                     <h4>Payment Type</h4>
        //                                 </div>
        //                             </div>
        //                             <DropDown
        //                                 title="-- please select payment type --"
        //                                 onChange={(e) => this.setState({
        //                                     employeeData: {
        //                                         ...this.state.employeeData,
        //                                         employeePaymentMethod: {
        //                                             ...this.state.employeeData.employeePaymentMethod,
        //                                             employeePaymentMethod: {
        //                                                 ...this.state.employeeData.employeePaymentMethod.employeePaymentMethod,
        //                                                 bizparKey: e
        //                                             }
        //                                         }
        //                                     }
        //                                 })}
        //                                 type="bizpar"
        //                                 disabled={this.props.type === "view" ? true : false}
        //                                 data={bizparPaymentMethod}
        //                                 value={employeeData.employeePaymentMethod && employeeData.employeePaymentMethod.employeePaymentMethod ? employeeData.employeePaymentMethod.employeePaymentMethod.bizparKey : ""} />
        //                         </div>
        //                         <div className="margin-bottom-20px">
        //                             <div className="margin-5px">
        //                                 <div className="txt-site txt-11 txt-main txt-bold">
        //                                     <h4>Bank Name</h4>
        //                                 </div>
        //                             </div>
        //                             <DropDown
        //                                 title="-- please select bank name --"
        //                                 onChange={(e) => this.setState({
        //                                     employeeData: {
        //                                         ...this.state.employeeData,
        //                                         employeePaymentMethod: {
        //                                             ...this.state.employeeData.employeePaymentMethod,
        //                                             employeePaymentBankID: {
        //                                                 ...this.state.employeeData.employeePaymentMethod.employeePaymentBankID,
        //                                                 bizparKey: e
        //                                             }
        //                                         }
        //                                     }
        //                                 })}
        //                                 type="bizpar"
        //                                 disabled={this.props.type === "view" ? true : false}
        //                                 data={bizparBank}
        //                                 value={employeeData.employeePaymentMethod && employeeData.employeePaymentMethod.employeePaymentBankID ? employeeData.employeePaymentMethod.employeePaymentBankID.bizparKey : ""} />
        //                         </div>
        //                         <div className="margin-bottom-20px">
        //                             <div className="margin-5px">
        //                                 <div className="txt-site txt-11 txt-main txt-bold">
        //                                     <h4>Account Number <span style={{ color: "red" }}>*</span></h4>
        //                                 </div>
        //                             </div>
        //                             <input
        //                                 readOnly={this.props.type === "view" ? true : false}
        //                                 style={this.props.type === "view" ? { backgroundColor: "#E6E6E6" } : null}
        //                                 type="text"
        //                                 className="txt txt-sekunder-color"
        //                                 placeholder=""
        //                                 required
        //                                 value={employeeData.employeePaymentMethod && employeeData.employeePaymentMethod.employeeAccountNumber ? employeeData.employeePaymentMethod.employeeAccountNumber : ""}
        //                                 onChange={(e) => {
        //                                     if (isNaN(e.target.value)) return true
        //                                     this.setState({
        //                                     employeeData: {
        //                                         ...this.state.employeeData,
        //                                         employeePaymentMethod: {
        //                                             ...this.state.employeeData.employeePaymentMethod,
        //                                             employeeAccountNumber: e.target.value
        //                                         }
        //                                     }
        //                                 })}}
        //                             />
        //                         </div>
        //                         <div className="margin-bottom-20px">
        //                             <div className="margin-5px">
        //                                 <div className="txt-site txt-11 txt-main txt-bold">
        //                                     <h4>Account Name <span style={{ color: "red" }}>*</span></h4>
        //                                 </div>
        //                             </div>
        //                             <input
        //                                 readOnly={this.props.type === "view" ? true : false}
        //                                 style={this.props.type === "view" ? { backgroundColor: "#E6E6E6" } : null}
        //                                 type="text"
        //                                 className="txt txt-sekunder-color"
        //                                 placeholder=""
        //                                 required
        //                                 value={employeeData.employeePaymentMethod ? employeeData.employeePaymentMethod.employeeAccountName : ""}
        //                                 onChange={(e) => this.setState({
        //                                     employeeData: {
        //                                         ...this.state.employeeData,
        //                                         employeePaymentMethod: {
        //                                             ...this.state.employeeData.employeePaymentMethod,
        //                                             employeeAccountName: e.target.value
        //                                         }
        //                                     }
        //                                 })}
        //                             />
        //                         </div>
        //                     </div>
        //                     <div className="coloumn-1">
        //                         <div className="margin-bottom-20px">
        //                             <div className="margin-5px">
        //                                 <div className="txt-site txt-11 txt-main txt-bold">
        //                                     <h4>Currency</h4>
        //                                 </div>
        //                             </div>
        //                             <DropDown
        //                                 title="-- please select currency --"
        //                                 onChange={(e) => this.setState({
        //                                     employeeData: {
        //                                         ...this.state.employeeData,
        //                                         employeePaymentMethod: {
        //                                             ...this.state.employeeData.employeePaymentMethod,
        //                                             employeePaymentCurrency: {
        //                                                 ...this.state.employeeData.employeePaymentMethod.employeePaymentCurrency,
        //                                                 bizparKey: e
        //                                             }
        //                                         }
        //                                     }
        //                                 })}
        //                                 type="bizpar"
        //                                 disabled={this.props.type === "view" ? true : false}
        //                                 data={bizparCurrency}
        //                                 value={employeeData.employeePaymentMethod && employeeData.employeePaymentMethod.employeePaymentCurrency ? employeeData.employeePaymentMethod.employeePaymentCurrency.bizparKey : ""} />
        //                         </div>
        //                         <div className="margin-bottom-20px">
        //                             <div className="margin-5px">
        //                                 <div className="txt-site txt-11 txt-main txt-bold">
        //                                     <h4>THR Base<span style={{ color: "red" }}>*</span></h4>
        //                                 </div>
        //                             </div>
        //                             <DropDown
        //                                 title="-- please select THR base --"
        //                                 onChange={(e) => this.setState({
        //                                     employeeData: {
        //                                         ...this.state.employeeData,
        //                                         employeePaymentMethod: {
        //                                             ...this.state.employeeData.employeePaymentMethod,
        //                                             employeeTHRBase: {
        //                                                 ...this.state.employeeData.employeePaymentMethod.employeeTHRBase,
        //                                                 bizparKey: e
        //                                             }
        //                                         }
        //                                     }
        //                                 })}
        //                                 type="bizpar"
        //                                 disabled={this.props.type === "view" ? true : false}
        //                                 data={bizparThrBase}
        //                                 value={employeeData.employeePaymentMethod && employeeData.employeePaymentMethod.employeeTHRBase ? employeeData.employeePaymentMethod.employeeTHRBase.bizparKey : ""} />
        //                         </div>
        //                         <div className="margin-bottom-20px">
        //                             <div className="margin-5px">
        //                                 <div className="txt-site txt-11 txt-main txt-bold">
        //                                     <h4>Hold</h4>
        //                                 </div>
        //                             </div>
        //                             <div className="margin-15px">
        //                                 <label className="radio">
        //                                     <input type="checkbox"
        //                                      onChange={(e) => this.setState({
        //                                         employeeData: {
        //                                             ...this.state.employeeData,
        //                                             employeePaymentMethod: {
        //                                                 ...this.state.employeeData.employeePaymentMethod,
        //                                                 isEmployeeAccountHold: e.target.checked
        //                                             }
        //                                         }
        //                                     })}
        //                                     disabled={this.props.type === "view"}
        //                                     checked={employeeData.employeePaymentMethod.isEmployeeAccountHold} />
        //                                     <span className="checkmark" />
        //                                     <div className="txt-site txt-11 txt-bold txt-main">
        //                                         <h4>Active</h4>
        //                                     </div>
        //                                 </label>
        //                             </div>
        //                         </div>
        //                     </div>
        //                 </div>

        //                 <div className="padding-15px">
        //                     <div className="grid grid-2x">
        //                         <div className="col-1" />
        //                         <div className="col-2 content-right">
        //                             {this.props.type !== 'view' ?
        //                                 <button
        //                                     style={{ marginLeft: "15px" }}
        //                                     className="btn btn-blue"
        //                                     type="submit"
        //                                 // onClick={() => this.props.onClickSave(employeeData)}
        //                                 >
        //                                     <span>SAVE</span>
        //                                 </button>
        //                                 : null}
        //                         </div>
        //                     </div>
        //                 </div>
        //             </form>
        //         </div>
        //         {this.state.savePopUp && (
        //             <PopUp
        //                 type={"save"}
        //                 class={"app-popup app-popup-show"}
        //                 onClick={this.props.backToPage}
        //             />
        //         )}
        //     </div>

        // )
    }
}

export default formPaymentMethod;