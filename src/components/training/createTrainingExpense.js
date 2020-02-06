import React, { Component } from "react";
import M from 'moment'
import DropDown from '../../modules/popup/DropDown';
import CalendarPicker from "../../modules/popup/Calendar";
import EmployeeSearchForm from '../../modules/forms/formInbox/employeeSearchForm.js'

const defaultData = {
    "trainingExpenseID": "",
    "trainingExpenseName": "",
    "trainingExpensePIC": "",
    "trainingExpenseReference": "",
    "trainingExpenseAmount": '',
    "trainingExpenseCOA": "",
    "trainingExpenseDate": "",
    "trainingExpenseDescription": "",
    "trainingExpenseTrainingID": "",
    "createdBy": "",
    "createdDate": "",
    "updatedBy": "",
    "updatedDate": "",
}

class createTrainingExpense extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: props.data ? props.data : { ...defaultData, trainingExpenseID: "TRNEXP-" + M() },
            formSearchVisible: false
        }
    }

    openSearchEmployee() {
        this.setState({ formSearchVisible: !this.state.formSearchVisible })
    }

    handleSearchPIC(value) {
        let employee = value
        this.setState({
            data: {
                ...this.state.data,
                trainingExpensePIC: employee.employeeID
            },
            formSearchVisible: false
        })
    }

    componentDidUpdate(prevProps) {
        if (this.props.data !== prevProps.data) {
            this.setState({
                data: this.props.data
            })
        }

    }

    render() {
        let { data, formSearchVisible } = this.state
        return (
            <div className="app-popup app-popup-show">
                <div className="padding-top-20px" />
                {formSearchVisible &&
                    <EmployeeSearchForm
                        onChoose={this.handleSearchPIC.bind(this)}
                        onClickClose={this.openSearchEmployee.bind(this)}
                    />}
                <div className="popup-content-mikro background-white border-radius">
                    <div className="popup-panel grid grid-2x">
                        <div className="col-1" style={{ width: '140%' }}>
                            <div className="popup-title">
                                {
                                    this.props.type === "create" ? "Training Expense - Create Detail" :
                                        this.props.type === "edit" ? "Training Expense - Edit Detail" : "Training Expense - View Detail"}
                            </div>
                        </div>
                        <div className="col-2 content-right">
                            <button
                                type="button"
                                className="btn btn-circle btn-grey"
                                onClick={this.props.onClickClose}
                            >
                                <i className="fa fa-lg fa-times" />
                            </button>
                        </div>
                    </div>
                    <form action="#"
                        onSubmit={(e) => {
                            e.preventDefault()
                            this.props.onClickSave(this.props.type, data)
                        }}>
                        <div className="border-bottom padding-15px grid grid-2x grid-mobile-none gap-15px">
                            <div className="column-1">
                                <div className="margin-bottom-20px">
                                    <div className="margin-5px">
                                        <div className="txt-site txt-11 txt-main txt-bold">
                                            <h4>Training Expanse ID</h4>
                                        </div>
                                    </div>
                                    <input
                                        readOnly
                                        style={{ backgroundColor: "#E6E6E6" }}
                                        type="text"
                                        className="txt txt-sekunder-color"
                                        placeholder=""
                                        value={data.trainingExpenseID}
                                    />
                                </div>

                                <div className="margin-bottom-20px">
                                    <div className="margin-5px">
                                        <div className="txt-site txt-11 txt-main txt-bold">
                                            <h4>Item Name <span style={{ color: "red" }}>*</span></h4>
                                        </div>
                                    </div>
                                    <input
                                        readOnly={this.props.type === "view" ? true : false}
                                        style={this.props.type === "view" ? { backgroundColor: "#E6E6E6" } : null}
                                        type="text"
                                        className="txt txt-sekunder-color"
                                        placeholder=""
                                        required
                                        value={data.trainingExpenseName}
                                        onChange={(e) => this.setState({
                                            data: { ...data, trainingExpenseName: e.target.value }
                                        })}
                                    />
                                </div>

                                <div className="margin-bottom-20px">
                                    <div className="margin-5px">
                                        <div className="txt-site txt-11 txt-main txt-bold">
                                            <h4>Amount</h4>
                                        </div>
                                    </div>
                                    <input
                                        readOnly={this.props.type === "view" ? true : false}
                                        style={this.props.type === "view" ? { backgroundColor: "#E6E6E6" } : null}
                                        type="text"
                                        className="txt txt-sekunder-color"
                                        placeholder=""
                                        value={data.trainingExpenseAmount}
                                        onChange={(e) => this.setState({
                                            data: { ...data, trainingExpenseAmount: e.target.value }
                                        })}
                                    />
                                </div>

                                <div className="margin-bottom-20px">
                                    <div className="margin-5px">
                                        <div className="txt-site txt-11 txt-main txt-bold">
                                            <h4>Coa</h4>
                                        </div>
                                    </div>
                                    <DropDown
                                        type='bizpar'
                                        title=' -- please select coa --'
                                        data={[
                                            { bizparKey: 'COA-001', bizparValue: 'COA-001' },
                                            { bizparKey: 'COA-002', bizparValue: 'COA-002' },
                                            { bizparKey: 'COA-003', bizparValue: 'COA-003' },
                                        ]}
                                        disabled={this.props.type === "view" ? true : false}
                                        value={data.trainingExpenseCOA}
                                    />
                                </div>

                                <div className="margin-bottom-20px">
                                    <div className="margin-5px">
                                        <div className="txt-site txt-11 txt-main txt-bold">
                                            <h4>
                                                Date <span style={{ color: "red" }}>*</span>
                                            </h4>
                                        </div>
                                    </div>
                                    <CalendarPicker
                                        disabled={this.props.type === "view" ? true : false}
                                        date={data.trainingExpenseDate && M(data.trainingExpenseDate, 'DD-MM-YYYY').format('YYYY-MM-DD')}
                                        onChange={e => this.setState({ data: { ...data, trainingExpenseDate: e } })}
                                    />
                                </div>
                            </div>

                            <div className="column-2">
                                <div className="margin-bottom-20px">
                                    <div className="margin-5px">
                                        <div className="txt-site txt-11 txt-main txt-bold">
                                            <h4>Reference</h4>
                                        </div>
                                    </div>
                                    <input
                                        readOnly={this.props.type === "view" ? true : false}
                                        style={this.props.type === "view" ? { backgroundColor: "#E6E6E6" } : null}
                                        type="text"
                                        className="txt txt-sekunder-color"
                                        placeholder=""
                                        value={data.trainingExpenseReference}
                                        onChange={(e) => this.setState({
                                            data: { ...data, trainingExpenseReference: e.target.value }
                                        })}
                                    />
                                </div>

                                <div className="margin-bottom-20px card-date-picker">
                                    <div className="margin-5px">
                                        <div className="txt-site txt-11 txt-main txt-bold">
                                            <h4>PIC</h4>
                                        </div>
                                    </div>
                                    <div className="double">
                                        <input
                                            style={{ backgroundColor: "#E6E6E6", padding: 15 }}
                                            value={data.trainingExpensePIC}
                                            className="input"
                                            name="search"
                                            disabled>
                                        </input>
                                        {this.props.type !== 'view' &&
                                            <button
                                                className="btn btn-grey border-left btn-no-radius"
                                                type="button"
                                                onClick={this.openSearchEmployee.bind(this)}
                                            >
                                                <i className="fa fa-lg fa-search"></i>
                                            </button>
                                        }
                                    </div>
                                </div>

                                <div className="padding-bottom-20px">
                                    <div className="margin-5px">
                                        <div className="txt-site txt-11 txt-main txt-bold">
                                            <h4>Description</h4>
                                        </div>
                                    </div>
                                    <textarea
                                        readOnly={this.props.type === "view" ? true : false}
                                        style={this.props.type === "view" ? { backgroundColor: "#E6E6E6" } : null}
                                        rows={6}
                                        className="txt txt-sekunder-color"
                                        type="text"
                                        value={data.trainingExpenseDescription}
                                        onChange={(e) => this.setState({
                                            data: { ...data, trainingExpenseDescription: e.target.value }
                                        })}
                                    ></textarea >
                                </div>

                            </div>
                        </div>

                        <div className="padding-15px">
                            <div className="grid grid-2x">
                                <div className="col-1" />
                                <div className="col-2 content-right">
                                    {this.props.type !== "view" ? (
                                        <button
                                            style={{ marginLeft: "15px" }}
                                            className="btn btn-blue"
                                            type="submit"
                                        >
                                            <span>SAVE</span>
                                        </button>
                                    ) : null}
                                    <button
                                        style={{ marginLeft: "15px" }}
                                        className="btn btn-primary"
                                        type="button"
                                        onClick={this.props.onClickClose}
                                    >
                                        <span>CLOSE</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
                <div className="padding-bottom-20px" />
            </div >
        );
    }
}
export default createTrainingExpense;
