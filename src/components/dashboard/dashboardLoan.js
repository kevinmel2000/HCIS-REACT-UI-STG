import React, { Component } from "react";
import CardTable from "../../cards/news/Tablechart";
import CardNewStatistic from "../../cards/news/Statistic";
import LoadingBar from "react-top-loading-bar";
import Api from '../../Services/Api'
import * as R from 'ramda'

export default class dashboardLoan extends Component {
  constructor() {
    super()
    this.state = {
      dataTableLoanFinished:[],
      timeout: 1000 * 100 * 9,
      isTimedOut: false,
      dataTableLoanCommited: []
    }
    this.idleTimer = null
  }

  componentDidMount(){
    this.getFinishedLoad()
    this.getAverageLoan()
    this.getCommitedLoad()
    this.startFetch()
  }

  startFetch = () => {
    this.LoadingBar.continousStart();
  };

  onFinishFetch = () => {
    if (typeof this.LoadingBar === "object") this.LoadingBar.complete();
  };

  async getFinishedLoad() {
    let body = {
        "limit": 100,
        "offset": 0
    }
    let response = await Api.create("DASHBOARD").getLoanFinished(body)
    console.log(response.data)
    if (response.data.status === "S") {
      let dataTableLoanFinished = response.data.data.map((body, index) => {
        const {
          loanType,
          numberOfEmployee
        } = body;
        return [
          (index += 1),
          loanType,
          numberOfEmployee
        ];
      });
        this.setState({ dataTableLoanFinished })
        this.onFinishFetch()
    } else if (R.isNil(response.data)) return alert("Failed: " + response.problem)
    else return alert("Failed: " + response.data.message)
  }

  async getCommitedLoad() {
    let body = {
        "limit": 100,
        "offset": 0
    }
    let response = await Api.create("DASHBOARD").getCommitedLoan(body)
    console.log(response.data)
    if (response.data.status === "S") {
      let dataTableLoanCommited = response.data.data.map((body, index) => {
        const {
          month,
          numberOfEmployee
        } = body;
        return [
          (index += 1),
          month,
          numberOfEmployee
        ];
      });
        this.setState({ dataTableLoanCommited })
        this.onFinishFetch()
    } else if (R.isNil(response.data)) return alert("Failed: " + response.problem)
    else return alert("Failed: " + response.data.message)
  }

  async getAverageLoan() {
    let body = {
        "limit": 100,
        "offset": 0
    } 
    let responseAverage = await Api.create("DASHBOARD").getAverageLoan(body)
    let averageCost = 0
    console.log(responseAverage.data)
    if (responseAverage.data.status === "S") {
        responseAverage.data.data.map((item, index) => {
            averageCost = averageCost + item.averageCost
        })
        this.setState({ averageCost })
        this.onFinishFetch()
    } 
}
  render() {
    return (
      <div className="main-content background-white">
        <LoadingBar onRef={ref => (this.LoadingBar = ref)} />
        <div className="display-flex-normal">
          <CardTable
            title={"Number of Employee Finished Loan Type"}
            icon="color-orange fas fa-dollar-sign fa-2x margin-right-10px"
            subtitle={"PT TIGA DAYA DIGITAL"}
            data={this.state.dataTableLoanFinished}
            columns={["No.", "Loan Type", "Number of Employee"]}
          />
          <CardTable
            title={"Number of Employee Commited Loan Type"}
            icon="color-orange fas fa-dollar-sign fa-2x margin-right-10px"
            subtitle={"PT TIGA DAYA DIGITAL"}
            columns={["No.", "Loan Type", "Number of Employee"]}
            data={this.state.dataTableLoanCommited}
          />
          <CardNewStatistic
            title="Average Corporate Loan"
            subtitle="PT TIGA DAYA DIGITAL INDONESIA"
            icon="color-orange fas fa-hand-holding-usd fa-10x margin-right-10px"
            data={[{ value: String(this.state.averageCost), label: "Total Average Cost" }]}
          />
        </div>
      </div>
    );
  }
}
