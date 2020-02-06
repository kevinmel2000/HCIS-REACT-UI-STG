import React, { Component } from "react";
import CardNewStatistic from "../../cards/news/Statistic";
import LoadingBar from "react-top-loading-bar";
import Api from '../../Services/Api'
import * as R from 'ramda'


export default class dashboardPerformance extends Component {
  constructor(){
    super()
    this.state = {

    }
  }

  componentDidMount(){
    this.getAveragePerformance()
    this.startFetch()
  }

  startFetch = () => {
    this.LoadingBar.continousStart();
  };

  onFinishFetch = () => {
    if (typeof this.LoadingBar === "object") this.LoadingBar.complete();
  };

  async getAveragePerformance() {
    let body = {
        "limit": 100,
        "offset": 0
    }
    let average25 = 0
    let average50 = 0
    let average75 = 0
    let average100 = 0
    let responseDashboard = await Api.create("DASHBOARD").getAveragePerformance(body)
    if (responseDashboard.data && responseDashboard.data.status === "S") {
        console.log(responseDashboard.data.data)
        responseDashboard.data.data.map((item, index) => {
            if(item.averagePerformance === "0-25"){
                average25 = average25 + item.totalEmployee
            } else if(item.averagePerformance === "25-50"){
                average50 = average50 + item.totalEmployee
            } else if(item.averagePerformance === "50-75"){
              average75 = average75 + item.totalEmployee
          } else if(item.averagePerformance === "75-100"){
            average100 = average100 + item.totalEmployee
        }
        })
        this.setState({ average25, average50, average75, average100})
        this.onFinishFetch()
    } else if (R.isNil(responseDashboard.data)) return alert("Failed: " + responseDashboard.problem)
    else return alert("Failed: " + responseDashboard.data.message)
  }

  render() {
    return (
      <div className="main-content background-white">
        <LoadingBar onRef={ref => (this.LoadingBar = ref)} />
        <div className="display-flex-normal">
          <CardNewStatistic
            title="Number of Employee With Average Performance 0-25%"
            subtitle="PT TIGA DAYA DIGITAL INDONESIA"
            icon="color-blue fas fa-user-tie fa-10x margin-right-10px"
            data={[{ value: String(this.state.average25), label: "Total Employee" }]}
          />
          <CardNewStatistic
            title="Number of Employee With Average Performance 25%-50%"
            subtitle="PT TIGA DAYA DIGITAL INDONESIA"
            icon="color-blue fas fa-user-tie fa-10x margin-right-10px"
            data={[{ value: String(this.state.average50), label: "Total Employee" }]}
          />
          <CardNewStatistic
            title="Number of Employee With Average Performance 50%-75%"
            subtitle="PT TIGA DAYA DIGITAL INDONESIA"
            icon="color-blue fas fa-user-tie fa-10x margin-right-10px"
            data={[{ value: String(this.state.average75), label: "Total Employee" }]}
          />
          <CardNewStatistic
            title="Number of Employee With Average Performance 75%-100%"
            subtitle="PT TIGA DAYA DIGITAL INDONESIA"
            icon="color-blue fas fa-user-tie fa-10x margin-right-10px"
            data={[{ value: String(this.state.average100), label: "Total Employee" }]}
          />
        </div>
      </div>
    );
  }
}