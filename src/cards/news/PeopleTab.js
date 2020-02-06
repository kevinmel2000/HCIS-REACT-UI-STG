import React, { Component } from "react";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables-bitozen";
import Api from "../../Services/Api";
import * as R from "ramda";

var ct = require("../../modules/custom/customTable");
const getMuiTheme = () => createMuiTheme(ct.customTable());
const options = ct.customOptions6();

class PeopleTabs extends Component {
    constructor() {
        super();
        this.state = {
            tabIndex: 0,
            title: "Number of Employee Not Present by Type",
            subtitle: "PT TIGA DAYA DIGITAL",
            dataSick: [],
            dataAlpha: [],
            dataPermission: []
        };
    }

    componentDidUpdate(prevProps) {
        if (this.props.data !== prevProps.data) this.setState({ data: this.props.data })
    }

    componentDidMount() {
        this.getListSick()
    }

    async getListSick() {
        let body = {
            "limit": 100,
            "offset": 0
        }
        let response = await Api.create("DASHBOARD").getEmployeeNotPresent(body)
        let data1 = []
        let data2 = []
        let data3 = []
        if (response.data.status === "S") {
            response.data.data.map((item) => {
                if (item.absenceType === "SICK") {
                    data1.push(item.employees)
                } else if (item.absenceType === "PERMISSION") {
                    data2.push(item.employees)
                } else {
                    data3.push(item.employees)
                }
            })
            this.setState({ dataSick: data1, dataPermission: data2, dataAlpha: data3 }, () => console.log(data2))
        } else if (R.isNil(response.data)) return alert("Failed: " + response.problem)
        else return alert("Failed: " + response.data.message)
    }

    render() {
        return (
            <div className="card df-card">
                <div className="padding-10px background-white display-flex-normal">
                    <div className="width width-full">
                        <div className="txt-site txt-bold text-main txt-12">
                            {this.state.title}
                        </div>
                        <div className="txt-site txt-thin text-primary txt-10 margin-top-5px">
                            {this.state.subtitle}
                        </div>
                    </div>
                    <div className="width width-90px" style={{ height: '25px', borderRadius: '25px', backgroundColor: '#0088FE' }}>
                        <div class="txt-site txt-9 txt-thin txt-white txt-center txt-top">This Month</div>
                    </div>
                </div>
                <div>
                    <Tabs selectedIndex={this.state.tabIndex} onSelect={tabIndex => this.setState({ tabIndex })}>
                        <TabList>
                            <Tab>Sick</Tab>
                            <Tab>Permission</Tab>
                            <Tab>Alpha</Tab>
                        </TabList>
                        <TabPanel>
                            <div className="display-normal padding-10px">
                                {this.state.dataSick.map((value, index) => {
                                    return (
                                        value.map((item, indexs) => {
                                            return (
                                                <div key={indexs} className="display-flex" style={{ justifyContent: 'left' }}>
                                                    <div style={{ marginBottom: 20, marginLeft: 20 }}>
                                                        <h4>{item.employeeName}</h4>
                                                        <h6>{item.positionName}</h6>
                                                    </div>
                                                </div>
                                            )

                                        })
                                    )

                                })}
                            </div>
                        </TabPanel>
                        <TabPanel>
                            {this.state.dataPermission.map((value, index) => {
                                return (
                                    value.map((item, indexs) => {
                                        return (
                                            <div key={indexs} className="display-flex" style={{ justifyContent: 'left' }}>
                                                <div style={{ marginBottom: 20, marginLeft: 20 }}>
                                                    <h4>{item.employeeName}</h4>
                                                    <h6>{item.positionName}</h6>
                                                </div>
                                            </div>
                                        )

                                    })
                                )
                            })}
                        </TabPanel>
                        <TabPanel>
                            {this.state.dataAlpha.map((value, index) => {
                                return (
                                    value.map((item, indexs) => {
                                        return (
                                            <div key={indexs} className="display-flex" style={{ justifyContent: 'left' }}>
                                                <div style={{ marginBottom: 20, marginLeft: 20 }}>
                                                    <h4>{item.employeeName}</h4>
                                                    <h6>{item.positionName}</h6>
                                                </div>
                                            </div>
                                        )

                                    })
                                )


                            })}
                        </TabPanel>
                    </Tabs>
                </div>
            </div >
        );
    }
}

export default PeopleTabs