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

class TableTabs extends Component {
    constructor() {
        super();
        this.state = {
            tabIndex: 0,
            title: "List Personal Task per Type",
            subtitle: "PT TIGA DAYA DIGITAL",
            dataDone: [],
            dataOngoing: [],
            dataHold: [],
            columns: ["No.", "Task List"]
        };
    }

    componentDidUpdate(prevProps) {
        if (this.props.data !== prevProps.data) this.setState({ data: this.props.data })
    }

    componentDidMount() {
        this.getListTask()
    }

    async getListTask() {
        let body = {
            "limit": 100,
            "offset": 0
        }
        let response = await Api.create("DASHBOARD").getListTask(body)
        let dataDone = []
        let dataHold = []
        let dataOngoing = []
        let data1 = []
        let data2 = []
        let data3 = []
        if (response.data.status === "S") {
            response.data.data.map((item) => {
                if (item.taskType === "Done") {
                    data1.push(item.taskList)
                } else if (item.taskType === "Hold") {
                    data2.push(item.taskList)
                } else {
                    data3.push(item.taskList)
                }
            })
            if (data1.length > 0) {
                this.setState({ dataA: data1[0] }, () => {
                    this.state.dataA.map((value, index) => {
                        dataDone.push([(index += 1), value])
                    })
                    this.setState({ dataDone })
                })
            }
            if (data2.length > 0) {
                this.setState({ dataB: data2[0] }, () => {
                    this.state.dataB.map((value, index) => {
                        dataHold.push([(index += 1), value])
                    })
                    this.setState({ dataHold })
                })
            }
            if (data3.length > 0) {
            this.setState({ dataC: data3[0] }, () => {
                this.state.dataC.map((value, index) => {
                    dataOngoing.push([(index += 1), value])
                })
                this.setState({ dataOngoing})
            })
            }        
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
                            <Tab>Done</Tab>
                            <Tab>On Going</Tab>
                            <Tab>Hold</Tab>
                        </TabList>
                        <TabPanel>
                            <MuiThemeProvider theme={getMuiTheme()}>
                                <MUIDataTable
                                    data={this.state.dataDone}
                                    columns={this.state.columns}
                                    options={options}
                                />
                            </MuiThemeProvider>
                        </TabPanel>
                        <TabPanel>
                            <MuiThemeProvider theme={getMuiTheme()}>
                                <MUIDataTable
                                    data={this.state.dataOngoing}
                                    columns={this.state.columns}
                                    options={options}
                                />
                            </MuiThemeProvider>
                        </TabPanel>
                        <TabPanel>
                            <MuiThemeProvider theme={getMuiTheme()}>
                                <MUIDataTable
                                    data={this.state.dataHold}
                                    columns={this.state.columns}
                                    options={options}
                                />
                            </MuiThemeProvider>
                        </TabPanel>
                    </Tabs>
                </div>
            </div >
        );
    }
}

export default TableTabs