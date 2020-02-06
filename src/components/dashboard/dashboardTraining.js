import React, { Component } from "react";
import CardTable from "../../cards/news/Tablechart";
import CardNewStatistic from "../../cards/news/Statistic";
import LoadingBar from "react-top-loading-bar";
import Api from '../../Services/Api'
import * as R from 'ramda'

export default class dashboardTraining extends Component {
  constructor() {
    super()
    this.state = {
      dataCurrentTraining: [],
      dataCanceledTraining: [],
      newDataTrain: []
    }
  }

  componentDidMount() {
    this.getCurrentTraining()
    this.getCanceledTraining()
    this.getAverageCorp()
    this.getEmployeeTraining()
    this.startFetch()
  }

  startFetch = () => {
    this.LoadingBar.continousStart();
  };

  onFinishFetch = () => {
    if (typeof this.LoadingBar === "object") this.LoadingBar.complete();
  };

  async getCurrentTraining() {
    let body = {
      "limit": 100,
      "offset": 0
    }
    let response = await Api.create("DASHBOARD").getCurrentTraining(body)
    let dataTrain = []
    let newDataTrain = []
    if (response.data.status === "S") {
      response.data.data.map((item) => {
        dataTrain.push(item.trainings)
      })
      this.setState({ dataTrain: dataTrain[0] }, () => {
        this.state.dataTrain.map((value, index) => {
          newDataTrain.push([(index+=1), value])
        })
        this.setState({ newDataTrain }, () => console.log(this.state.newDataTrain))
      })
      this.onFinishFetch()
    } else if (R.isNil(response.data)) return alert("Failed: " + response.problem)
    else return alert("Failed: " + response.data.message)
  }

  async getCanceledTraining() {
    let body = {
      "limit": 100,
      "offset": 0
    }
    let response = await Api.create("DASHBOARD").getCanceledTraining(body)
    console.log(response.data)
    if (response.data.status === "S") {
      let dataCanceledTraining = response.data.data.map((body, index) => {
        const {
          trainingName
        } = body;
        return [
          (index += 1),
          trainingName
        ];
      });
      this.setState({ dataCanceledTraining })
      this.onFinishFetch()
    } else if (R.isNil(response.data)) return alert("Failed: " + response.problem)
    else return alert("Failed: " + response.data.message)
  }

  async getAverageCorp() {
    let body = {
      "limit": 100,
      "offset": 0
    }
    let response = await Api.create("DASHBOARD").getAverageCorporate(body)
    let averageCost = 0
    console.log(response.data)
    if (response.data.status === "S") {
      response.data.data.map((item, index) => {
        averageCost = averageCost + item.averageCost
      })
      this.setState({ averageCost })
      this.onFinishFetch()
    }
  }

  async getEmployeeTraining() {
    let body = {
      "limit": 100,
      "offset": 0
    }
    let response = await Api.create("DASHBOARD").getEmployeeTraining(body)
    let totalEmployee = 0
    console.log(response.data)
    if (response.data.status === "S") {
      response.data.data.map((item, index) => {
        totalEmployee = totalEmployee + item.totalEmployee
      })
      this.setState({ totalEmployee })
      this.onFinishFetch()
    }
  }
  render() {
    return (
      <div className="main-content background-white">
        <LoadingBar onRef={ref => (this.LoadingBar = ref)} />
        <div className="display-flex-normal">
          <CardTable
            title={"Current Available Training"}
            icon="color-red fas fa-user-tie fa-2x margin-right-10px"
            subtitle={"PT TIGA DAYA DIGITAL"}
            data={this.state.newDataTrain}
            columns={["No.", "Training Name"]}
          />
          <CardTable
            title={"Number of Canceled Training"}
            icon="color-red fas fa-user-tie fa-2x margin-right-10px"
            subtitle={"PT TIGA DAYA DIGITAL"}
            columns={["No.", "Training Name"]}
            data={this.state.dataCanceledTraining}
          />
          <div style={{ position: "relative", width: "calc(100%)" }}>
            <CardNewStatistic
              title="Average Corporate per Training"
              icon={"color-orange fas fa-dollar-sign fa-2x margin-right-10px"}
              subtitle="PT TIGA DAYA DIGITAL INDONESIA"
              data={[{ value: String(this.state.averageCost), label: "Total Average Cost" }]}
            />
            <div className="padding-top-5px"></div>
            <CardNewStatistic
              title={"Current Employee Training"}
              icon="color-red fas fa-user-tie fa-2x margin-right-10px"
              subtitle="PT TIGA DAYA DIGITAL INDONESIA"
              data={[{ value: String(this.state.totalEmployee), label: "Total Average Cost" }]}
            />
          </div>
        </div>
      </div>
    );
  }
}
