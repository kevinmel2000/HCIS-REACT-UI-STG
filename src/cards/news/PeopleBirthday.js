import React, { Component } from 'react'
import Api from '../../Services/Api'
import * as R from 'ramda'
class Statistic extends Component {
    constructor(props) {
        super(props)
        this.state = {
            title: this.props.title,
            subtitle: this.props.subtitle,
            colorStatus: this.props.colorStatus,
            employee: [],
            empLength: 0,
            isVisible: false

        }
    }

    componentDidMount() {
        this.getEmp()
    }

    componentDidUpdate(prevProps) {
        if (this.props.employee !== prevProps.employee) this.setState({ employee: this.props.employee })
      }

    async getEmp() {
        let body = {
            "limit": 100,
            "offset": 0
        }
        let employee = []
        let response = await Api.create("DASHBOARD").getAllEmployeeOnBirthday(body)
        if (response.data && response.data.status === "S") {
            response.data.data.map((item, index) => {
                employee.push(item.employees)
            })
            this.setState({ employee: employee[0], empLength: employee[0].length })
        } else if (R.isNil(response.data)) return alert("Failed: " + response.problem)
        else return alert("Failed: " + response.data.message)
    }

    render() {
        return (
            <div className="card">
                <div className="padding-10px display-flex-normal">
                    <div className="width width-full">
                        <div className="txt-site txt-bold text-main txt-12">
                            {this.state.title}
                        </div>
                        <div className="txt-site txt-thin text-primary txt-10 margin-top-5px">
                            {this.state.subtitle}
                        </div>
                    </div>
                    <div className="width width-110px" style={{ height: '25px', borderRadius: '25px', backgroundColor: this.state.colorStatus }}>
                        <div class="txt-site txt-9 txt-thin txt-white txt-center txt-top">{this.state.empLength} Employees</div>
                    </div>
                </div>

                <div className="display-flex-normal">
                    {this.state.employee.map((item) => {
                        return (
                            <div className="padding-15px txt-site txt-center">
                                <div className="txt-site txt-center txt-main txt-bold txt-18 margin-bottom-15px">
                                    {item.employeeName}
                                </div>
                                <div
                                    className="image image-circle image-60px"
                                    style={{
                                        margin: 'auto',
                                        backgroundImage: 'url("https://upload.wikimedia.org/wikipedia/commons/9/9d/Thomas_Edison2.jpg")'
                                    }}>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        )
    }
}

export default Statistic