import React, { Component } from 'react'
import FormTransactionManual from '../../modules/forms/formCompensation/formTransactionManual'
import FormTransactionImpor from '../../modules/forms/formCompensation/formTransactionImpor'
import FormTransactionImporMultiple from '../../modules/forms/formCompensation/formTransactionImporMultiple'

class CnbTransaction extends Component {
    constructor(props) {
        super(props)
        this.state = {
            formManual: true,
            formImpor: false,
            formImporMultiple: false,
            activeTab: "Manual",
            tabMenu: ["Manual", "Impor", "Impor Multiple"]
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
            formManual: false,
            formImpor: false,
            formImporMultiple: false,
            activeTab: title
        }

        switch (title) {
            case "Manual":
                allStateVisibleFalse = {
                    ...allStateVisibleFalse,
                    formManual: true
                }
                break;
            case "Impor":
                allStateVisibleFalse = {
                    ...allStateVisibleFalse,
                    formImpor: true
                }
                break;
            case "Impor Multiple":
                allStateVisibleFalse = {
                    ...allStateVisibleFalse,
                    formImporMultiple: true
                }
                break;
            default:
                break;
        }
        this.setState(allStateVisibleFalse)
    }

    render() {
        let { formManual, formImpor, formImporMultiple } = this.state
        return (
            <div className="main-content">
                <div className="card-navigator">
                    <div className="c-n-top">
                        <div className="txt-site txt-18 txt-bold txt-main padding-top-5px">
                            Transaction
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
                                {formManual && (
                                    <FormTransactionManual />
                                )}

                                {formImpor && (
                                    <FormTransactionImpor />
                                )}

                                {formImporMultiple && (
                                    <FormTransactionImporMultiple />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default CnbTransaction