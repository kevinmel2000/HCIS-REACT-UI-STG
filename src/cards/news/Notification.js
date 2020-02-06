import React, { Component } from 'react'
import Api from '../../Services/Api'

class Statistic extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: [],
            title: this.props.title,
            subtitle: this.props.subtitle,
            colorStatus: this.props.colorStatus
        }
    }

    componentDidMount() {
        this.getNotif()
    }

    componentDidUpdate(prevProps) {
        if (this.props.data !== prevProps.data) this.setState({ data: this.props.data })
    }

    getNotif() {
        let body = {
            "limit": 100,
            "offset": 0
        }
        Api.create("DASHBOARD").getNotification(body).then((res) => {
            let data = []
            res.data.data.map((item) => {
                data.push(item.listNotification)
            })

            this.setState({ data }, () => console.log(this.state.data))
        })

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
                        <div class="txt-site txt-9 txt-thin txt-white txt-center txt-top">{this.state.data.length} Employees</div>
                    </div>
                </div>
                <div className="padding-15px" style={{ overflowY: 'scroll', maxHeight: 275 }}>
                    <div className="display-normal padding-10px">
                        {this.state.data.map((value, index) => {
                            return (
                                value.map((item, indexs) => {
                                    return (
                                        <div key={indexs} className="display-flex" style={{ justifyContent: 'left' }}>
                                            <img src={item.notification === "New Vacancies" ? require("../../assets/img/icons/profil.png") : require("../../assets/img/icons/group-44.png")} style={{ height: 35, width: 35}}/>
                                            <div style={{ marginBottom: 20, marginLeft: 20 }}>
                                                <h4>{item.notification}</h4>
                                                <h6>{item.notes}</h6>
                                            </div>
                                        </div>
                                    )

                                })
                            )


                        })}
                    </div>
                    {/* <div
                        className="image image-circle image-40px"
                        style={{ backgroundImage: 'url("https://images.startups.co.uk/wp-content/uploads/2017/06/Job-offer-new-employee.jpg")' }}>
                    </div> */}
                </div>
            </div>
        )
    }
}

export default Statistic