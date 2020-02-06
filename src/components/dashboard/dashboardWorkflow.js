import React, { Component } from "react";
import CardNewStatistic from "../../cards/news/Statistic";
import LoadingBar from "react-top-loading-bar";
import Api from '../../Services/Api'
import * as R from 'ramda'

export default class dashboardWorkflow extends Component {
    constructor() {
      super()
      this.state = {

      }
    }
    startFetch = () => {
        this.LoadingBar.continousStart();
    };

    onFinishFetch = () => {
        if (typeof this.LoadingBar === "object") this.LoadingBar.complete();
    };

    componentDidMount(){
      this.getAverageTime()
      this.getMaxTime()
      this.getEmployeeWorkflow()
      this.startFetch()
  }

  async getAverageTime() {
    let body = {
        "limit": 100,
        "offset": 0
    }
    let averageTime=0
    let response = await Api.create("DASHBOARD").getAverageTimeDuration(body)
    console.log(response.data)
    if (response.data.status === "S") {
      response.data.data.map((item, index) => {
            averageTime = averageTime + item.averageTime
        })
        this.setState({ averageTime })
        this.onFinishFetch()
    } else if (R.isNil(response.data)) return alert("Failed: " + response.problem)
    else return alert("Failed: " + response.data.message)
}

  async getMaxTime(){
    let body ={
      "limit": 100,
      "offset": 0
    }
    let maximumTime = 0
    let response = await Api.create("DASHBOARD").getMaxTime(body)
    console.log(response.data)
    if (response.data.status === "S") {
      response.data.data.map((item, index) => {
        maximumTime = maximumTime + item.maximumTime
        })
        this.setState({ maximumTime })
        this.onFinishFetch()
    } else if (R.isNil(response.data)) return alert("Failed: " + response.problem)
    else return alert("Failed: " + response.data.message)
  }

  async getEmployeeWorkflow(){
    let body ={
      "limit": 100,
      "offset": 0
    }
    let totalEmployee = 0
    let response = await Api.create("DASHBOARD").getEmployeeWorkflow(body)
    console.log(response.data)
    if (response.data.status === "S") {
      response.data.data.map((item, index) => {
        totalEmployee = totalEmployee + item.totalEmployee
        })
        this.setState({ totalEmployee })
        this.onFinishFetch()
    } else if (R.isNil(response.data)) return alert("Failed: " + response.problem)
    else return alert("Failed: " + response.data.message)
  }


  render() {
    return (
      <div className="main-content background-white">
        <LoadingBar onRef={ref => (this.LoadingBar = ref)} />
        <div className="display-flex-normal">
          <CardNewStatistic
            title="Average Time Duration Execution Task per Employee"
            subtitle="PT TIGA DAYA DIGITAL INDONESIA"
            icon=" color-orange far fa-clock fa-10x margin-right-10px"
            data={[{ value: String(this.state.averageTime), label: "Average Minutes per Task" }]}
          />
          <CardNewStatistic
            title="Maximum Time Duration Execution Task per Employee"
            subtitle="PT TIGA DAYA DIGITAL INDONESIA"
            icon="color-red far fa-clock fa-10x margin-right-10px"
            data={[{ value: String(this.state.maximumTime), label: "Minutes per Task" }]}
          />
          <CardNewStatistic
            title="Number of Employee Involved Within Corporate Workflow"
            subtitle="PT TIGA DAYA DIGITAL INDONESIA"
            icon="color-orange fas fa-user-tie fa-10x margin-right-10px"
            data={[{ value: String(this.state.totalEmployee), label: "Average Minutes per Task" }]}
          />
        </div>
      </div>
    );
  }
}
