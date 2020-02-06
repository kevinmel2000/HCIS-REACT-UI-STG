import React, { Component } from 'react'
import ImportData from '../../modules/forms/formCompensation/formImportData';
import Calculation from '../../modules/forms/formCompensation/formCalculation';

class CalculateInactiveEmployee extends Component {
    constructor(props) {
        super(props)
        this.state = {
            formImportData: true,
            formCalculation: false,
            formUploadVisible: false,
            formDetailVisible: false,
            activeTab: "Import Data",
            tabMenu: ["Import Data", "Calculation"]
        }
    }

    opNavigator = (title) => {
        let cl = title === this.state.activeTab ? 'c-n-link active' : 'c-n-link'
        return (
            <li key={title} className={cl} onClick={this.opContent(title)}>
                {title}
            </li>
        );
    };

    opContent = title => e => {
        let allStateVisibleFalse = {
            ...this.state,
            formImportData: false,
            formCalculation: false,
            activeTab: title
        }

        switch (title) {
            case "Import Data":
                allStateVisibleFalse = {
                    ...allStateVisibleFalse,
                    formImportData: true
                }
                break;
            case "Calculation":
                allStateVisibleFalse = {
                    ...allStateVisibleFalse,
                    formCalculation: true
                }
                break;
            default:
                break;
        }
        this.setState(allStateVisibleFalse)
    }

    openDetailForm = () => {
        this.setState({ formDetailVisible: !this.state.formDetailVisible })
    }

    render() {
        let { formImportData, formCalculation } = this.state
        return (
            <div className="main-content">
                <div className="card-navigator">
                    <div className="c-n-top">
                        <div className="txt-site txt-18 txt-bold txt-main padding-top-5px">
                            Calculate Inactive Employee
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
                                {formImportData && (
                                    <ImportData />
                                )}

                                {formCalculation && (
                                    <Calculation />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default CalculateInactiveEmployee