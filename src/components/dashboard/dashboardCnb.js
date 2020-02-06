import React, { Component } from "react";
import CardTable from "../../cards/news/Tablechart";
import LoadingBar from "react-top-loading-bar";
import Api from '../../Services/Api'
import * as R from 'ramda'

export default class dashboardCnb extends Component {
  constructor(props) {
    super(props)
    this.state = {
      dataAveragePayroll:[],
      dataExecutedPayroll:[],
      dataAverageTax:[],
      dataExecutedTax:[],
      dataAverageCom:[],
      dataExecutedCom:[],
      dataAverageBenefit:[],
      dataExecutedBenefit:[]
    }
  }

  componentDidMount(){
    this.getAveragePayroll()
    this.getExecutedPayroll()
    this.getAverageTax()
    this.getExecutedTax()
    this.getAverageCompensation()
    this.getExecutedCom()
    this.getAverageBenefit()
    this.getExecutedBenefit()
    this.startFetch()
}
  startFetch = () => {
    this.LoadingBar.continousStart();
  };

  onFinishFetch = () => {
    if (typeof this.LoadingBar === "object") this.LoadingBar.complete();
  };

async getAveragePayroll() {
  let body = {
      "limit": 100,
      "offset": 0
  }
  let response = await Api.create("DASHBOARD").getAveragePayroll(body)
  console.log(response.data)
  if (response.data.status === "S") {
    let dataAveragePayroll = response.data.data.map((body, index) => {
      const {
        month,
        averagePayroll
      } = body;
      return [
        (index += 1),
        month,
        averagePayroll
      ];
    });
      this.setState({ dataAveragePayroll })
      this.onFinishFetch()
  } else if (R.isNil(response.data)) return alert("Failed: " + response.problem)
  else return alert("Failed: " + response.data.message)
}

async getExecutedPayroll() {
  let body = {
      "limit": 100,
      "offset": 0
  }
  let response = await Api.create("DASHBOARD").getExecutedPayroll(body)
  console.log(response.data)
  if (response.data.status === "S") {
    let dataExecutedPayroll = response.data.data.map((body, index) => {
      const {
        batchPayroll,
        month,
        totalPayroll
      } = body;
      return [
        (index += 1),
        batchPayroll,
        month,
        totalPayroll
      ];
    });
      this.setState({ dataExecutedPayroll })
      this.onFinishFetch()
  } else if (R.isNil(response.data)) return alert("Failed: " + response.problem)
  else return alert("Failed: " + response.data.message)
}

async getAverageTax() {
  let body = {
      "limit": 100,
      "offset": 0
  }
  let response = await Api.create("DASHBOARD").getAverageTax(body)
  console.log(response.data)
  if (response.data.status === "S") {
    let dataAverageTax = response.data.data.map((body, index) => {
      const {
        month,
        averageTax
      } = body;
      return [
        (index += 1),
        month,
        averageTax
      ];
    });
      this.setState({ dataAverageTax })
      this.onFinishFetch()
  } else if (R.isNil(response.data)) return alert("Failed: " + response.problem)
  else return alert("Failed: " + response.data.message)
}

async getExecutedTax() {
  let body = {
      "limit": 100,
      "offset": 0
  }
  let response = await Api.create("DASHBOARD").getExecutedTax(body)
  console.log(response.data)
  if (response.data.status === "S") {
    let dataExecutedTax = response.data.data.map((body, index) => {
      const {
        batch,
        month,
        amount
      } = body;
      return [
        (index += 1),
        batch,
        month,
        amount
      ];
    });
      this.setState({ dataExecutedTax })
      this.onFinishFetch()
  } else if (R.isNil(response.data)) return alert("Failed: " + response.problem)
  else return alert("Failed: " + response.data.message)
}

async getAverageCompensation() {
  let body = {
      "limit": 100,
      "offset": 0
  }
  let response = await Api.create("DASHBOARD").getAverageCom(body)
  console.log(response.data)
  if (response.data.status === "S") {
    let dataAverageCom = response.data.data.map((body, index) => {
      const {
        month,
        averageCompensation
      } = body;
      return [
        (index += 1),
        month,
        averageCompensation
      ];
    });
      this.setState({ dataAverageCom })
      this.onFinishFetch()
  } else if (R.isNil(response.data)) return alert("Failed: " + response.problem)
  else return alert("Failed: " + response.data.message)
}

async getExecutedCom() {
  let body = {
      "limit": 100,
      "offset": 0
  }
  let response = await Api.create("DASHBOARD").getExecutedCom(body)
  console.log(response.data)
  if (response.data.status === "S") {
    let dataExecutedCom = response.data.data.map((body, index) => {
      const {
        batch,
        month,
        amount
      } = body;
      return [
        (index += 1),
        batch,
        month,
        amount
      ];
    });
      this.setState({ dataExecutedCom })
      this.onFinishFetch()
  } else if (R.isNil(response.data)) return alert("Failed: " + response.problem)
  else return alert("Failed: " + response.data.message)
}

async getAverageBenefit() {
  let body = {
      "limit": 100,
      "offset": 0
  }
  let response = await Api.create("DASHBOARD").getAverageBenefit(body)
  console.log(response.data)
  if (response.data.status === "S") {
    let dataAverageBenefit = response.data.data.map((body, index) => {
      const {
        month,
        averageBenefit
      } = body;
      return [
        (index += 1),
        month,
        averageBenefit
      ];
    });
      this.setState({ dataAverageBenefit })
      this.onFinishFetch()
  } else if (R.isNil(response.data)) return alert("Failed: " + response.problem)
  else return alert("Failed: " + response.data.message)
}

async getExecutedBenefit() {
  let body = {
      "limit": 100,
      "offset": 0
  }
  let response = await Api.create("DASHBOARD").getExecutedBenefit(body)
  console.log(response.data)
  if (response.data.status === "S") {
    let dataExecutedBenefit = response.data.data.map((body, index) => {
      const {
        batch,
        month,
        amount
      } = body;
      return [
        (index += 1),
        batch,
        month,
        amount
      ];
    });
      this.setState({ dataExecutedBenefit })
      this.onFinishFetch()
  } else if (R.isNil(response.data)) return alert("Failed: " + response.problem)
  else return alert("Failed: " + response.data.message)
}

columns = [
  "No",
  "Month",
  "Average"
]
  render() {
    return (
      <div className="main-content background-white">
        <LoadingBar onRef={ref => (this.LoadingBar = ref)} />
        {/* Payroll */}
        <div className="display-flex-normal">
          <CardTable
            style={{ position: "relative", width: "calc(100% - 470px)" }}
            title={"Average Payroll per Month of The Year"}
            icon="color-orange fas fa-dollar-sign fa-2x margin-right-10px"
            subtitle={"PT TIGA DAYA DIGITAL"}
            data={this.state.dataAveragePayroll}
            columns={this.columns}
          />
          <CardTable
            style={{ position: "relative", width: "calc(100% - 470px)" }}
            title={"Number of Executed Payroll"}
            icon="color-orange fas fa-dollar-sign fa-2x margin-right-10px"
            subtitle={"PT TIGA DAYA DIGITAL"}
            columns={["No.", "Batch", "Month", "Amount"]}
            data={this.state.dataExecutedPayroll}
          />
        </div>

        {/* TAX */}
        <div className="display-flex-normal">
          <CardTable
            style={{ position: "relative", width: "calc(100% - 470px)" }}
            title={"Average Tax per Month of The Year"}
            icon="color-orange fas fa-dollar-sign fa-2x margin-right-10px"
            subtitle={"PT TIGA DAYA DIGITAL"}
            data={this.state.dataAverageTax}
            columns={["No.", "Month", "Average"]}
          />
          <CardTable
            style={{ position: "relative", width: "calc(100% - 470px)" }}
            title={"Number of Executed Tax"}
            icon="color-orange fas fa-dollar-sign fa-2x margin-right-10px"
            subtitle={"PT TIGA DAYA DIGITAL"}
            columns={["No.", "Batch", "Month", "Amount"]}
            data={this.state.dataExecutedTax}
          />
        </div>

        {/* Compensation */}
        <div className="display-flex-normal">
          <CardTable
            style={{ position: "relative", width: "calc(100% - 470px)" }}
            title={"Average Compensation per Month of The Year"}
            icon="color-orange fas fa-dollar-sign fa-2x margin-right-10px"
            subtitle={"PT TIGA DAYA DIGITAL"}
            data={this.state.dataAverageCom}
            columns={["No.", "Month", "Average"]}
          />
          <CardTable
            style={{ position: "relative", width: "calc(100% - 470px)" }}
            title={"Number of Executed Compensation"}
            icon="color-orange fas fa-dollar-sign fa-2x margin-right-10px"
            subtitle={"PT TIGA DAYA DIGITAL"}
            columns={["No.", "Batch", "Month", "Amount"]}
            data={this.state.dataExecutedCom}
          />
        </div>
        {/* Benefit */}
        <div className="display-flex-normal">
          <CardTable
            style={{ position: "relative", width: "calc(100% - 470px)" }}
            title={"Average Benefit per Month of The Year"}
            icon="color-orange fas fa-dollar-sign fa-2x margin-right-10px"
            subtitle={"PT TIGA DAYA DIGITAL"}
            data={this.state.dataAverageBenefit}
            columns={["No.", "Month", "Average"]}
          />
          <CardTable
            style={{ position: "relative", width: "calc(100% - 470px)" }}
            title={"Number of Executed Benefit"}
            icon="color-orange fas fa-dollar-sign fa-2x margin-right-10px"
            subtitle={"PT TIGA DAYA DIGITAL"}
            columns={["No.", "Batch", "Month", "Amount"]}
            data={this.state.dataExecutedBenefit}
          />
        </div>
      </div>
    );
  }
}
