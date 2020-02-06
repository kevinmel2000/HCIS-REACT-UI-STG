import React, { Component } from "react";
import CardTable from "../../cards/news/Tablechart";
import LoadingBar from "react-top-loading-bar";
import Api from '../../Services/Api'
import * as R from 'ramda'

export default class dashboardTalent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      dataComply: [],
      datab:[],
      tab:[],
      newData: [],
      employeeName: [],
      newDataNot: [],
      newDataNot:[]
    }
  }

  componentDidMount() {
    this.getEmployeeComply()
    this.getEmployeeNotComply()
    this.startFetch()
  }

  startFetch = () => {
    this.LoadingBar.continousStart();
  };

  onFinishFetch = () => {
    if (typeof this.LoadingBar === "object") this.LoadingBar.complete();
  };

  async getEmployeeComply() {
    let body = {
      "limit": 100,
      "offset": 0
    }
    let response = await Api.create("DASHBOARD").getEmployeeComply(body) 
    let datab = [] 
    let newData = []
    if (response.data.status === "S") {
      response.data.data.map((item) => {
        datab.push(item.employees)
      })
      this.setState({ datab: datab[0] },()=> {
        this.state.datab.map((value, index) => {
          newData.push([(index+= 1), value.employeeName, value.positionName])
        })
        this.setState({ newData }, ()=> console.log(this.state.newData)) 
      })
      this.onFinishFetch()
    } else if (R.isNil(response.data)) return alert("Failed: " + response.problem)
    else return alert("Failed: " + response.data.message)
  }

  async getEmployeeNotComply() {
    let body = {
      "limit": 100,
      "offset": 0
    }
    let response = await Api.create("DASHBOARD").getEmployeeNotComply(body) 
    let dataNot = [] 
    let newDataNot = []
    if (response.data.status === "S") {
      response.data.data.map((item) => {
        dataNot.push(item.employees)
      })
      this.setState({ dataNot: dataNot[0] },()=> {
        this.state.dataNot.map((value, index) => {
          newDataNot.push([(index += 1), value.employeeName, value.positionName])
        })
        this.setState({ newDataNot }, ()=> console.log(this.state.newDataNot)) 
      })
      this.onFinishFetch()
    } else if (R.isNil(response.data)) return alert("Failed: " + response.problem)
    else return alert("Failed: " + response.data.message)
  }
  render() { 
    return (
      <div className="main-content background-white">
        <LoadingBar onRef={ref => (this.LoadingBar = ref)} />
        <div className="display-flex-normal">
          <CardTable
            style={{ position: "relative", width: "calc(100% - 470px)" }}
            title={"Number of Employee Comply With Criteria X"}
            icon="color-blue fa fa-male fa-2x margin-right-10px"
            subtitle={"PT TIGA DAYA DIGITAL"}
            data={this.state.newData}
            columns={["No.", "Employee", "Position"]}
          />
          <CardTable
            style={{ position: "relative", width: "calc(100% - 470px)" }}
            title={"Number of Employee Not Comply With Criteria X"}
            icon="color-blue fa fa-male fa-2x margin-right-10px"
            subtitle={"PT TIGA DAYA DIGITAL"}
            columns={["No.", "Employee", "Position"]}
            data={this.state.newDataNot}
          />
        </div>
      </div>
    );
  }
}
