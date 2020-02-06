import React, { Component } from 'react'
import FormSalaryChangeDetail from './formSalaryChangeDetail'
import FormSalaryChangeHistory from './formSalaryChangeHistory'

class FormSalaryChange extends Component {
    constructor(props) {
        super(props)
        this.state = {
            formDetailVisible: true,
            formHistoryVisible: false,
            activeTab: "Detail",
            tabMenu: ["Detail", "History"]
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
            formDetailVisible: false,
            formHistoryVisible: false,
            activeTab: title
        }

        switch (title) {
            case "Detail":
                allStateVisibleFalse = {
                    ...allStateVisibleFalse,
                    formDetailVisible: true
                }
                break;
            case "History":
                allStateVisibleFalse = {
                    ...allStateVisibleFalse,
                    formHistoryVisible: true
                }
                break;
            default:
                break;
        }
        this.setState(allStateVisibleFalse)
    }

    render() {
        let { formDetailVisible, formHistoryVisible } = this.state
        return (
            <div className="app-popup app-popup-show">
                <div className="padding-top-20px"></div>
                <div className="popup-content background-white border-radius">

                    <div className="padding-15px background-blue border-bottom grid grid-2x">
                        <div className="col-1">
                            <div className="txt-site txt-12 txt-bold post-center">
                                SALARY CHANGE
                            </div>
                        </div>
                        <div className="col-2 content-right">
                            <button
                                className="btn btn-circle background-blue"
                                onClick={this.props.onClickClose}
                            >
                                <i className="fa fa-lg fa-times" />
                            </button>
                        </div>
                    </div>

                    <div className="popup-content-grid">
                        <div className="popup-scroll popup-col-1">
                            <ul className="vertical-tab">
                                {this.state.tabMenu.map((data, index) => { return this.opNavigator(data) })}
                            </ul>
                        </div>
                        <div className="popup-scroll popup-col-2">
                            <div className="padding-15px">
                                {formDetailVisible && (
                                    <FormSalaryChangeDetail />
                                )}

                                {formHistoryVisible && (
                                    <FormSalaryChangeHistory />
                                )}
                            </div>
                            <div className="padding-15px">
                                <div className="grid grid-2x">
                                    <div className="col-1"></div>
                                    <div className="col-2 content-right">
                                        <button
                                            style={{ marginLeft: "15px" }}
                                            className="btn btn-primary"
                                            type="button"
                                            onClick={this.props.onClickClose}>
                                            <span>CLOSE</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default FormSalaryChange