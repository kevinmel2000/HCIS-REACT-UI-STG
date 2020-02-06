import React, { Component } from "react";
import CardBiaxialChart from "../../cards/BiaxialChart";
import CardNewStatistic from "../../cards/news/Statistic";
import CardTable from "../../cards/news/Tablechart";
import LoadingBar from "react-top-loading-bar";
import TableTabs from '../../cards/news/TableTabs'
import CardNotif from '../../cards/news/Notification'

import Api from "../../Services/Api";
import * as R from "ramda";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import AuthAction from "../../Redux/AuthRedux";
import IdleTimer from "react-idle-timer";

class dashboardEss extends Component {
  constructor() {
    super();
    this.state = {
      dataEksadStrategy: [],
      timeout: 1000 * 100 * 9,
      isTimedOut: false,
      datab: [],
      newData: [],
      dataTrain: [],
      newDataTrain: []
    };
    this.idleTimer = null;
  }

  componentDidMount() {
    if (!R.isNil(this.props.auth.user)) {
      this.getLineChart();
      this.getListTask()
      this.getAvaTraining()
      this.getRemain()
      this.startFetch()
    }
  }
  startFetch = () => {
    this.LoadingBar.continousStart();
  };

  onFinishFetch = () => {
    if (typeof this.LoadingBar === "object") this.LoadingBar.complete();
  };

  logout() {
    this.props.authLogout();
    return <Redirect to={{ pathname: "/" }}></Redirect>;
  }

  onAction() {
    this.setState({ isTimedOut: false });
  }

  onActive() {
    this.setState({ isTimedOut: false });
  }

  onIdle() {
    const isTimedOut = this.state.isTimedOut;
    if (isTimedOut) {
      alert("Your session has timed out. Please log in again");
      this.logout();
    } else {
      this.idleTimer.reset();
      this.setState({ isTimedOut: true });
    }
  }

  async getListTask() {
    let body = {
      "limit": 100,
      "offset": 0
    }
    let response = await Api.create("DASHBOARD").getListTask(body)
    let datab = []
    let newData = []
    if (response.data.status === "S") {
      response.data.data.map((item) => {
        datab.push(item.taskList)
      })
      this.setState({ datab: datab[0] }, () => {
        this.state.datab.map((value, index) => {
          newData.push([(index += 1), value])
        })
        this.setState({ newData }, () => console.log(this.state.newData))
      })
      this.onFinishFetch()
    } else if (R.isNil(response.data)) return alert("Failed: " + response.problem)
    else return alert("Failed: " + response.data.message)
  }

  async getAvaTraining() {
    let body = {
      "limit": 100,
      "offset": 0
    }
    let response = await Api.create("DASHBOARD").getAvailableTraining(body)
    let dataTrain = []
    let newDataTrain = []
    if (response.data.status === "S") {
      response.data.data.map((item) => {
        dataTrain.push(item.trainings)
      })
      this.setState({ dataTrain: dataTrain[0] }, () => {
        this.state.dataTrain.map((value, index) => {
          newDataTrain.push([(index += 1), value])
        })
        this.setState({ newDataTrain }, () => console.log(this.state.newDataTrain))
      })
      this.onFinishFetch()
    } else if (R.isNil(response.data)) return alert("Failed: " + response.problem)
    else return alert("Failed: " + response.data.message)
  }

  async getRemain() {
    let body = {
      "limit": 100,
      "offset": 0
    }
    let responseAverage = await Api.create("DASHBOARD").getRemainingDays(body)
    let remainingDays = 0
    console.log(responseAverage.data)
    if (responseAverage.data.status === "S") {
      responseAverage.data.data.map((item, index) => {
        remainingDays = remainingDays + item.remainingDays
      })
      this.onFinishFetch()
      this.setState({ remainingDays })
    }
  }

  async getLineChart() {
    let body = {
      "limit": 100,
      "offset": 0
    }
    let responseAttendance = await Api.create("DASHBOARD").getTotalAttendance(body);
    if (responseAttendance.data && responseAttendance.data.status === "S") {
      this.setState({ dataAttendance: responseAttendance.data.data });
      this.onFinishFetch()
    } else if (R.isNil(responseAttendance.data))
      return alert("Failed: " + responseAttendance.problem);
    else return alert("Failed: " + responseAttendance.data.message);
  }


render() {
  if (R.isNil(this.props.auth.user))
    return <Redirect to={{ pathname: "/" }}></Redirect>;
  let { dataAttendance } = this.state;
  return (
    <div className="main-content background-white">
      <LoadingBar onRef={ref => (this.LoadingBar = ref)} />
      <IdleTimer
        ref={ref => {
          this.idleTimer = ref;
        }}
        element={document}
        onActive={this.onActive.bind(this)}
        onIdle={this.onIdle.bind(this)}
        onAction={this.onAction.bind(this)}
        debounce={250}
        timeout={this.state.timeout}
      />
      <div className="display-flex-normal">
        <CardBiaxialChart
          data={dataAttendance}
          dataKey={[
            { key: "totalAttendance", color: "#ff7300" }
          ]}
          title="Total Attendance per Month"
          subtitle={"PT TIGA DAYA DIGITAL"}
        />
        <TableTabs
          style={{ position: "relative", width: "calc(100% - 470px)" }}
          title={"List Personal Task per Type"}
          subtitle={"PT TIGA DAYA DIGITAL"}
          columns={["No.", "Task List"]}
        />
      </div>
      <div className="display-flex-normal">
        <CardNewStatistic
          title="Remaining Days Off"
          subtitle="PT TIGA DAYA DIGITAL INDONESIA"
          icon="color-red fa fa-calendar fa-10x margin-right-10px"
          data={[{ value: String(this.state.remainingDays), label: "Days" }]}
        />
        <CardNotif
          colorStatus="#FF8042"
          title="List Notification"
          subtitle="PT TIGA DAYA DIGITAL INDONESIA"
        />
        <CardTable
          title={"Available Training"}
          icon="color-red fas fa-user-tie fa-2x margin-right-10px"
          subtitle={"PT TIGA DAYA DIGITAL"}
          data={this.state.newDataTrain}
          columns={["No.", "Training Name"]}
        />
      </div>
    </div>
  );
}
}

const mapStateToProps = state => {
  return {
    auth: state.auth
  };
};

const mapDispatchToProps = dispatch => {
  return {
    authLogout: () => dispatch(AuthAction.authLogout())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(dashboardEss);
