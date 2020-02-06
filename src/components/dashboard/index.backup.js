import React, { Component } from 'react'
// import CardPercentage from '../../cards/Percentage'
import CardPiechart from '../../cards/Piechart'
// import CardPiechartGender from '../../cards/PiechartGender'
import CardLinechart from '../../cards/Linechart'
import CardBarchart from '../../cards/Barchart'
import CardLineBarAreaChart from '../../cards/LineBarAreaChart'
import CardSimpleBarchart from '../../cards/SimpleBarchart'
import CardPositiveNegativeBarchart from '../../cards/PositiveNegativeBarchart'
import CardTinnyBarchart from '../../cards/TinnyBarchart'
// import CardStatistic from '../../cards/Statistic'
import CardAverage from '../../cards/Average'
// import CardBubbleChart from '../../cards/BubbleChart'
import CardBiaxialChart from '../../cards/BiaxialChart'
import Api from '../../Services/Api'
import * as R from 'ramda'
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import AuthAction from '../../Redux/AuthRedux'
import IdleTimer from 'react-idle-timer'

class Home extends Component {

  constructor() {
    super()
    this.state = {
      dataAvgLeaveBalance: 0,
      dataStaffPerformance: 0,
      dataTotalCost: 0,
      dataTotalEmployee: 0,
      dataStatusEmployee: [],
      dataAgeDemographic: [],
      dataOpenPosition: [],
      dataEmployeeScore: [],
      dataAgeLeaveDays: [],
      dataIncome: [],
      dataEksadStrategy: [],
      dataTotalNumber: [],
      dataEksadAvg: [],
      dataDashboard: [],
      timeout: 1000 * 100 * 9,
      isTimedOut: false
    }
    this.idleTimer = null
  }
    
  logout() {
    this.props.authLogout()
    return <Redirect to={{ pathname: "/" }} ></Redirect>
  }

  onAction() {
    this.setState({ isTimedOut: false })
  }

  onActive() {
    this.setState({ isTimedOut: false })
  }

  onIdle() {
    const isTimedOut = this.state.isTimedOut
    if (isTimedOut) {
      alert("Your session has timed out. Please log in again")
      this.logout()
    } else {
      this.idleTimer.reset();
      this.setState({ isTimedOut: true })
    }
  }

  componentDidMount() {
    if (!R.isNil(this.props.auth.user)) {
      this.getDataCardAverage()
      this.getBarChart()
      this.getPieChart()
      this.getLineChart()
    }
  }

  async getDataCardAverage() {
    let response = await Api.create("DASHBOARD").getAverageLeaveBalance()
    if (response.data && response.data.status === "S") {
      this.setState({ dataAvgLeaveBalance: response.data.data })
    } else if (R.isNil(response.data)) return alert("Failed: " + response.problem)
    else return alert("Failed: " + response.data.message)

    let responseStaff = await Api.create("DASHBOARD").getStaffPerformance()
    if (responseStaff.data && responseStaff.data.status === "S") {
      this.setState({ dataStaffPerformance: responseStaff.data.data })
    } else if (R.isNil(responseStaff.data)) return alert("Failed: " + responseStaff.problem)
    else return alert("Failed: " + responseStaff.data.message)

    let responseTotalCost = await Api.create("DASHBOARD").getTotalCostPerHire()
    if (responseTotalCost.data && responseTotalCost.data.status === "S") {
      this.setState({ dataTotalCost: responseTotalCost.data.data })
    } else if (R.isNil(responseTotalCost.data)) return alert("Failed: " + responseTotalCost.problem)
    else return alert("Failed: " + responseTotalCost.data.message)

    let responseTotalEmployee = await Api.create("DASHBOARD").getTotalEmployeePerHire()
    if (responseTotalEmployee.data && responseTotalEmployee.data.status === "S") {
      this.setState({ dataTotalEmployee: responseTotalEmployee.data.data })
    } else if (R.isNil(responseTotalEmployee.data)) return alert("Failed: " + responseTotalEmployee.problem)
    else return alert("Failed: " + responseTotalEmployee.data.message)
  }

  async getBarChart() {
    let response = await Api.create("DASHBOARD").getStatusEmployee()
    if (response.data && response.data.status === "S") {
      this.setState({ dataStatusEmployee: response.data.data })
    } else if (R.isNil(response.data)) return alert("Failed: " + response.problem)
    else return alert("Failed: " + response.data.message)

    let responseAge = await Api.create("DASHBOARD").getAgeDemographicPerDepartment()
    if (responseAge.data && responseAge.data.status === "S") {
      this.setState({ dataAgeDemographic: responseAge.data.data })
    } else if (R.isNil(responseAge.data)) return alert("Failed: " + responseAge.problem)
    else return alert("Failed: " + responseAge.data.message)

    let responseEmployeeScore = await Api.create("DASHBOARD").getEmployeeScore()
    if (responseEmployeeScore.data && responseEmployeeScore.data.status === "S") {
      this.setState({ dataEmployeeScore: responseEmployeeScore.data.data })
    } else if (R.isNil(responseEmployeeScore.data)) return alert("Failed: " + responseEmployeeScore.problem)
    else return alert("Failed: " + responseEmployeeScore.data.message)

    let responseAgeLeaveDays = await Api.create("DASHBOARD").getAverageLeaveBalanceDays()
    if (responseAgeLeaveDays.data && responseAgeLeaveDays.data.status === "S") {
      this.setState({ dataAgeLeaveDays: responseAgeLeaveDays.data.data })
    } else if (R.isNil(responseAgeLeaveDays.data)) return alert("Failed: " + responseAgeLeaveDays.problem)
    else return alert("Failed: " + responseAgeLeaveDays.data.message)

    let responseIncome = await Api.create("DASHBOARD").getIncomeBreakdown()
    if (responseIncome.data && responseIncome.data.status === "S") {
      this.setState({ dataIncome: responseIncome.data.data })
    } else if (R.isNil(responseIncome.data)) return alert("Failed: " + responseIncome.problem)
    else return alert("Failed: " + responseIncome.data.message)

    let responseEksadAvg = await Api.create("DASHBOARD").getEksadAverageSpendPerHire()
    if (responseEksadAvg.data && responseEksadAvg.data.status === "S") {
      this.setState({ dataEksadAvg: responseEksadAvg.data.data })
    } else if (R.isNil(responseEksadAvg.data)) return alert("Failed: " + responseEksadAvg.problem)
    else return alert("Failed: " + responseEksadAvg.data.message)
  }

  async getPieChart() {
    let response = await Api.create("DASHBOARD").getOpenPositionByDepartment()
    if (response.data && response.data.status === "S") {
      this.setState({ dataOpenPosition: response.data.data })
    } else if (R.isNil(response.data)) return alert("Failed: " + response.problem)
    else return alert("Failed: " + response.data.message)
  }

  async getLineChart() {
    let response = await Api.create("DASHBOARD").getEksadStrategyMatrix()
    if (response.data && response.data.status === "S") {
      this.setState({ dataEksadStrategy: response.data.data })
    } else if (R.isNil(response.data)) return alert("Failed: " + response.problem)
    else return alert("Failed: " + response.data.message)

    let responseTotalNumber = await Api.create("DASHBOARD").getTotalEmployee()
    if (responseTotalNumber.data && responseTotalNumber.data.status === "S") {
      this.setState({ dataTotalNumber: responseTotalNumber.data.data })
    } else if (R.isNil(responseTotalNumber.data)) return alert("Failed: " + responseTotalNumber.problem)
    else return alert("Failed: " + responseTotalNumber.data.message)

    let responseDashboard = await Api.create("DASHBOARD").getDashboard()
    if (responseDashboard.data && responseDashboard.data.status === "S") {
      this.setState({ dataDashboard: responseDashboard.data.data })
    } else if (R.isNil(responseDashboard.data)) return alert("Failed: " + responseDashboard.problem)
    else return alert("Failed: " + responseDashboard.data.message)
  }

  render() {
    if (R.isNil(this.props.auth.user)) return <Redirect to={{ pathname: "/" }} ></Redirect>
    let { dataAvgLeaveBalance, dataStaffPerformance, dataTotalCost, dataTotalEmployee, dataStatusEmployee, dataAgeDemographic, dataOpenPosition, dataEmployeeScore, dataAgeLeaveDays, dataIncome, dataEksadStrategy, dataTotalNumber, dataEksadAvg, dataDashboard } = this.state
    return (
      <div className="main-content">
        <IdleTimer
          ref={ref => { this.idleTimer = ref }}
          element={document}
          onActive={this.onActive.bind(this)}
          onIdle={this.onIdle.bind(this)}
          onAction={this.onAction.bind(this)}
          debounce={250}
          timeout={this.state.timeout} />
        {/* data 1 */}
        <div className="display-flex-normal">
          <CardAverage
            title="Avg Leave Balance"
            icon="fa fa-lg fa-chart-line"
            color="#0088FE"
            value={dataAvgLeaveBalance} />

          <CardAverage
            title="Staff Performance"
            icon="fa fa-lg fa-user-clock"
            color="#00C49F"
            value={dataStaffPerformance} />

          <CardAverage
            title="Cost Per Hire"
            icon="fa fa-lg fa-dollar-sign"
            color="#FFBB28"
            value={`$ ${dataTotalCost}`} />

          <CardAverage
            title="Employee Per Hire"
            icon="fa fa-lg fa-user-check"
            color="#FF8042"
            value={dataTotalEmployee} />
        </div>

        {/* data 2 */}
        <div className="display-flex-normal">
          <CardPositiveNegativeBarchart
            data={dataStatusEmployee}
            dataKey={[
              { key: 'uv', color: '#8884d8' },
              { key: 'pv', color: '#82ca9d' }
            ]}
            title="Status Employee" />
          <CardSimpleBarchart
            data={dataAgeDemographic}
            dataKey={[
              { key: 'it', color: '#8884d8' },
              { key: 'finance', color: '#82ca9d' },
              { key: 'hr', color: '#FFBB28' },
              { key: 'strategy', color: '#FF8042' }
            ]}
            title="Age Demographics by Department" />
        </div>

        {/* data 3 */}
        <div className="display-flex-normal">
          <CardPiechart
            data={dataOpenPosition}
            colors={
              ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']
            }
            title="Open Position by Department" />
          <CardTinnyBarchart
            data={dataEmployeeScore}
            colors={
              ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']
            }
            title="Employee Score" />
          <CardTinnyBarchart
            data={dataAgeLeaveDays}
            colors={
              ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']
            }
            title="Avg Leave Balance Days" />
        </div>

        {/* data 3 */}
        <div className="display-flex-normal">
          <CardBarchart
            data={dataIncome}
            dataKey={[
              { key: 'salary', color: '#8884d8' },
              { key: 'bonus', color: '#82ca9d' },
              { key: 'overtime', color: '#ffc658' }
            ]}
            title="Income Breakdown" />
          <CardTinnyBarchart
            data={dataEksadAvg}
            colors={
              ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']
            }
            title="Eksad Average Spend Per Hire" />
          <CardLinechart
            data={dataDashboard}
            dataKey={[
              { key: 'it', color: '#8884d8' },
              { key: 'finance', color: '#82ca9d' },
              { key: 'hr', color: '#ffc658' },
              { key: 'Strategy', color: '#FF8042' },
            ]}
            title="Dashboard" />
        </div>

        {/* data 2 */}
        <div className="display-flex-normal">
          <CardBiaxialChart
            data={dataEksadStrategy}
            dataKey={[
              { key: 'consultan', color: '#ff7300' },
              { key: 'op', color: '#413ea0' },
              { key: 'pts', color: '#8884d8' },
            ]}
            title="Eksad Strategy Matrics" />
          <CardLineBarAreaChart
            data={dataTotalNumber}
            dataKey={[
              { key: 'consultan', color: '#ff7300' },
              { key: 'op', color: '#413ea0' },
              { key: 'pts', color: '#8884d8' },
            ]}
            title="Total Number" />
        </div>
      </div>
    )
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

export default connect(mapStateToProps, mapDispatchToProps)(Home)