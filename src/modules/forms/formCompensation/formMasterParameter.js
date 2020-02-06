import React, { Component } from 'react'
import FormMasterParameterSingle from './formMasterParameterSingle'
import FormMasterParameterMediate from './formMasterParameterMediate'

class FormMasterParameter extends Component {
    constructor(props) {
        super(props)
        this.state = {
            formSingleVisible: true,
            formMediateVisible: false,
            activeTab: "Single Value",
            tabMenu: ["Single Value", "Mediate Value"]
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
            formSingleVisible: false,
            formMediateVisible: false,
            activeTab: title
        }

        switch (title) {
            case "Single Value":
                allStateVisibleFalse = {
                    ...allStateVisibleFalse,
                    formSingleVisible: true
                }
                break;
            case "Mediate Value":
                allStateVisibleFalse = {
                    ...allStateVisibleFalse,
                    formMediateVisible: true
                }
                break;
            default:
                break;
        }
        this.setState(allStateVisibleFalse)
    }

    render() {
        let { formSingleVisible, formMediateVisible } = this.state
        return (
            <div>
                <div className="c-n-mid">
                    <div className="c-n-col-1" style={{width: "70%"}}>
                        <ul className="vertical-tab">
                            {this.state.tabMenu.map((data, index) => { return this.opNavigator(data) })}
                        </ul>
                    </div>
                    <div className="c-n-col-2" style={{marginLeft: -40}}>
                        {formSingleVisible && (
                            <FormMasterParameterSingle />
                        )}
                        
                        {formMediateVisible && (
                            <FormMasterParameterMediate />
                        )}
                    </div>
                </div>
            </div>
        )
    }
}

export default FormMasterParameter