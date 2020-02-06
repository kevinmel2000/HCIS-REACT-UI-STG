import React, { Component } from 'react'

class FormCalculationSalaryDetail extends Component {
    constructor(props) {
        super(props)
        this.state = {
            formLeft: ["NIK", "Employee Name", "Join Date", "End Date", "Gender", "Employee Type", "PTKP Status", "Position", "Level", "Location", "Branch", "Main Directorate", "Directorate", "Division", "Department", "Unit", "Sub Unit", "Allowance Total", "Deduction Total", "Take Home Pay Total", "Allocation Allowance", "Attendance Allowance", "Basic Salary", "Bonus", "Cop Allowance", "Subsidion Cop", "Correction Rapel", "Frame", "Gasoline Allowance", "Glass", "Housing Allowance", "HP Allowance"],
            formRight: ["Leave Allowance", "Incentive Ls", "Meal Allowance", "Medical Insurance", "Other Allowance", "Overtime", "Position Allowance", "Incentive SA", "Shift Allowance", "THR", "Transport Allowance", "Company JHT Allowance", "Company JKK Allowance", "Company JKM Allowance", "Company JP Allowance", "Company KES Allowance", "PPH Allowance", "Loan Cop", "Other Deduction", "Parking", "Employee JHT Deduction", "Company JHT Deduction", "Company JKK Deduction", "Company JKM Deduction", "Employee JP Deduction", "Company JP Deduction", "Employee KES Deduction", "Company KES Deduction", "PPH Deduction", "Soft Loan", "SPD Deduction"]
        }
    }

    renderForm() {
        let formLeft = this.state.formLeft.map((value, index) => {
            return (
                <div className="margin-bottom-15px">
                    <div className="margin-5px">
                        <span className="txt-site txt-11 txt-main txt-bold">
                            {value}
                        </span>
                        <input
                            type="text"
                            readOnly
                            style={{ backgroundColor: '#E6E6E6' }}
                            className="txt txt-sekunder-color"
                            placeholder=""
                        ></input>
                    </div>
                </div>
            )
        })

        let formRight = this.state.formRight.map((value, index) => {
            return (
                <div className="margin-bottom-15px">
                    <div className="margin-5px">
                        <span className="txt-site txt-11 txt-main txt-bold">
                            {value}
                        </span>
                        <input
                            type="text"
                            readOnly
                            style={{ backgroundColor: '#E6E6E6' }}
                            className="txt txt-sekunder-color"
                            placeholder=""
                        ></input>
                    </div>
                </div>
            )
        })

        return (
            <div className="padding-15px grid grid-2x grid-mobile-none gap-20px">
                <div className="col-1">
                    {formLeft}
                </div>
                <div className="col-2">
                    {formRight}
                </div>
            </div>
        )
    }

    render() {
        let { type, title} = this.props
        if(type === "salary") title = "SALARY"
        if(type === "prorate") title = "PRORATE SALARY"
        if(type === "hold") title = "HOLD"

        return (
            <div className="app-popup app-popup-show">
                <div className="padding-top-20px"></div>
                <div className="popup-content background-white border-radius">
                    <div className="padding-15px background-blue grid grid-2x">
                        <div className="col-1">
                            <div className="txt-site txt-12 txt-bold post-center">
                                CALCULATION - {title}
                            </div>
                        </div>
                        <div className="col-2 content-right">
                            <button className="btn btn-circle background-blue">
                                <i className="fa fa-lg fa-print"></i>
                            </button>
                        </div>
                    </div>

                    <form action="#">
                        {this.renderForm()}
                    </form>

                    <div className="padding-15px">
                        <div className="grid grid-2x">
                            <div className="col-1"></div>
                            <div className="col-2 content-right">
                                <button
                                    style={{ marginLeft: "15px" }}
                                    className="btn btn-blue"
                                    type="button"
                                    onClick={this.props.onClickClose}>
                                    <span>CLOSE</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="padding-bottom-20px"></div>
            </div>
        )
    }
}

export default FormCalculationSalaryDetail