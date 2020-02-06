import React, { Component } from 'react'
import Form from '../../../components/pages/FieldForm'

class FormSppdGeneral extends Component {
    constructor(props) {
        super(props)
        this.state = {
            sppdData: props.sppdData
        }
    }

    render() {
        let { sppdData } = this.state
        return (
            <div className="vertical-tab-content active">
                <form action="#">
                    <div className="border-bottom padding-15px grid grid-2x grid-mobile-none gap-20px">
                        <div className="column-1">
                            <Form
                                label={"NIK"}
                                field={"input"}
                                value={sppdData ? sppdData.employee.employeeID : ""}
                                style={{ backgroundColor: "#E6E6E6" }}
                                readOnly={true}
                            />
                            <Form
                                label={"Employee Name"}
                                field={"input"}
                                value={sppdData ? sppdData.employee.employeeName : ""}
                                style={{ backgroundColor: "#E6E6E6" }}
                                readOnly={true}
                            />
                            <br />
                            <div>INSTRUCTED BY</div>
                            <Form
                                label={"NIK"}
                                field={"input"}
                                value={sppdData && sppdData.sppdRequestBy ? sppdData.sppdRequestBy.employeeID : ""}
                                style={{ backgroundColor: "#E6E6E6" }}
                                readOnly={true}
                            />
                            <Form
                                label={"Employee Name"}
                                field={"input"}
                                value={sppdData && sppdData.sppdRequestBy ? sppdData.sppdRequestBy.employeeName : ""}
                                style={{ backgroundColor: "#E6E6E6" }}
                                readOnly={true}
                            />
                        </div>
                        <div className="column-2">
                            <Form
                                label={"Division"}
                                field={"input"}
                                style={{ backgroundColor: "#E6E6E6" }}
                                readOnly={true}
                                value={sppdData && sppdData.employee.position ? sppdData.employee.position.ouid : ""}
                            />
                            <Form
                                label={"Position"}
                                field={"input"}
                                style={{ backgroundColor: "#E6E6E6" }}
                                readOnly={true}
                                value={sppdData && sppdData.employee.position? sppdData.employee.position.ouposition.bizparValue : ""}
                            />
                            <br />
                            <br />
                            <Form
                                label={"Division"}
                                field={"input"}
                                style={{ backgroundColor: "#E6E6E6" }}
                                readOnly={true}
                                value={sppdData && sppdData.sppdRequestBy.position ? sppdData.sppdRequestBy.position.ouid : ""}
                            />
                            <Form
                                label={"Position"}
                                field={"input"}
                                style={{ backgroundColor: "#E6E6E6" }}
                                value={sppdData && sppdData.sppdRequestBy.position ? sppdData.sppdRequestBy.position.ouposition.bizparValue : ""}
                                readOnly={true}
                            />
                        </div>
                    </div>
                    <div className="padding-15px">
                        <div className="grid grid-2x">
                            <div className="col-1" />
                            <div className="col-2 content-right">
                                <button
                                    style={{ marginLeft: "15px" }}
                                    className="btn btn-blue"
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
        )
    }
}

export default FormSppdGeneral