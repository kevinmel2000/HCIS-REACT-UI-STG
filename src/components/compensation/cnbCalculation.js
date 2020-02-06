import React, { Component } from 'react'
import FormCnbCalculation from '../../modules/forms/formCompensation/formCnbCalculation'
import FormCalculationSalary from '../../modules/forms/formCompensation/formCalculationSalary'
import FormCalculationProrateSalary from '../../modules/forms/formCompensation/formCalculationProrateSalary'
import FormCalculationJournal from '../../modules/forms/formCompensation/formCalculationJournal'
import FormCalculationHold from '../../modules/forms/formCompensation/formCalculationHold'

class CnbCalculation extends Component {
    constructor(props) {
        super(props)
        this.state = {
            formCalculation: true,
            formSalary: false,
            formProrateSalary: false,
            formJournal: false,
            formHold: false,
            activeTab: "Calculation",
            tabMenu: ["Calculation", "Salary", "Prorate Salary", "Journal", "Hold"]
        }
    }

    opNavigator = (title) => {
        let cl = title === this.state.activeTab ? 'c-n-link active' : 'c-n-link'
        return (
            <li key={title} className={cl} onClick={this.opContent(title)}>
                {title}
            </li>
        )
    }

    opContent = title => e => {
        let allStateVisibleFalse = {
            ...this.state,
            formCalculation: false,
            formSalary: false,
            formProrateSalary: false,
            formJournal: false,
            formHold: false,
            activeTab: title
        }

        switch (title) {
            case "Calculation":
                allStateVisibleFalse = {
                    ...allStateVisibleFalse,
                    formCalculation: true
                }
                break;
            case "Salary":
                allStateVisibleFalse = {
                    ...allStateVisibleFalse,
                    formSalary: true
                }
                break;
            case "Prorate Salary":
                allStateVisibleFalse = {
                    ...allStateVisibleFalse,
                    formProrateSalary: true
                }
                break;
            case "Journal":
                allStateVisibleFalse = {
                    ...allStateVisibleFalse,
                    formJournal: true
                }
                break;
            case "Hold":
                allStateVisibleFalse = {
                    ...allStateVisibleFalse,
                    formHold: true
                }
                break;
            default:
                break;
        }
        this.setState(allStateVisibleFalse)
    }

    render() {
        let { formCalculation, formSalary, formProrateSalary, formJournal, formHold} = this.state
        return (
            <div className="main-content">
                <div className="card-navigator">
                    <div className="c-n-top">
                        <div className="txt-site txt-18 txt-bold txt-main padding-top-5px">
                            Calculation
                        </div>
                    </div>
                    
                    <div className="c-n-mid">
                        <div className="c-n-col-1">
                            <ul className="vertical-tab">
                                {this.state.tabMenu.map((data, index) => { return this.opNavigator(data) })}
                            </ul>
                        </div>
                        <div className="c-n-col-2">
                            <div className="padding-5px">
                               {formCalculation && (
                                   <FormCnbCalculation />
                               )}

                               {formSalary && (
                                   <FormCalculationSalary />
                               )}

                               {formProrateSalary && (
                                   <FormCalculationProrateSalary />
                               )}

                               {formJournal && (
                                   <FormCalculationJournal />
                               )}

                               {formHold && (
                                   <FormCalculationHold />
                               )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default CnbCalculation