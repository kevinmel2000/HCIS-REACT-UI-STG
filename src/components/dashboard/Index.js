import React, { Component } from 'react'

// new
import CardNewPiechart from '../../cards/news/Piechart'
import CardNewBarchart from '../../cards/news/Barchart'
import CardNewStatistic from '../../cards/news/Statistic'
import CardPeople from '../../cards/news/People'
import CardEmployee from '../../cards/news/Employee'
import CardTable from '../../cards/news/Tablechart'

// old
import CardSimpleBarchart from '../../cards/SimpleBarchart'
import CardPiechart from '../../cards/Piechart'
import CardLinechart from '../../cards/Linechart'
import CardBarchart from '../../cards/Barchart'
import CardLineBarAreaChart from '../../cards/LineBarAreaChart'
import CardPositiveNegativeBarchart from '../../cards/PositiveNegativeBarchart'
import CardTinnyBarchart from '../../cards/TinnyBarchart'
import CardAverage from '../../cards/Average'
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
    let { 
      dataAvgLeaveBalance, dataStaffPerformance, dataTotalCost, dataTotalEmployee, dataStatusEmployee, dataEmployeeScore, dataAgeLeaveDays, dataEksadStrategy, dataTotalNumber, dataEksadAvg, dataDashboard ,
      dataAgeDemographic, dataOpenPosition, dataIncome,} = this.state
    return (
      <div className="main-content" style={{backgroundColor:'#ffffff'}}>
        <IdleTimer
          ref={ref => { this.idleTimer = ref }}
          element={document}
          onActive={this.onActive.bind(this)}
          onIdle={this.onIdle.bind(this)}
          onAction={this.onAction.bind(this)}
          debounce={250}
          timeout={this.state.timeout} />
        
        {/* 1 */}
        <div className='display-flex-normal'>
          <CardNewBarchart
              style={{position: 'relative', width: 'calc(100% - 470px)'}}
              data={dataIncome}
              dataKey={[
                { key: 'salary', color: '#E5E5FF' },
                // { key: 'bonus', color: '#82ca9d' },
                // { key: 'overtime', color: '#ffc658' }
              ]}
              title="Statistic Employee by Month"
              subtitle="PT TIGA DAYA DIGITAL INDONESIA" />
            <div style={{position: 'relative', width: 'calc(100%)'}}>
              <CardNewStatistic
                title="Total Employee"
                subtitle="PT TIGA DAYA DIGITAL INDONESIA"
                data={[
                  {value:"744", label:"Total Employee"}
                ]}
              />
              <div className="padding-top-5px"></div>
              <CardNewStatistic
                title="Total Employee by Gender"
                subtitle="PT TIGA DAYA DIGITAL INDONESIA"
                data={[
                  {value:"519", label:"Male"},
                  {value:"225", label:"Female"}
                ]}
              />
            </div>
        </div>

        {/* 2 */}
        <div className='display-flex-normal'>
        <CardSimpleBarchart
            data={dataAgeDemographic}
            dataKey={[
              { key: 'it', color: '#8884d8' },
              { key: 'finance', color: '#82ca9d' },
              // { key: 'hr', color: '#FFBB28' },
              // { key: 'strategy', color: '#FF8042' }
            ]}
            title="Total Employee by Gender per Division"
            subtitle="PT TIGA DAYA DIGITAL INDONESIA" />
           <CardNewPiechart
              data={dataOpenPosition}
              colors={
                ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']
              }
              title="Number of Employee by Status Employee"
              subtitle="PT TIGA DAYA DIGITAL INDONESIA" />
        </div>

        {/* 3 */}
        <div className='display-flex-normal'>
        <CardSimpleBarchart
            data={dataAgeDemographic}
            dataKey={[
              { key: 'it', color: '#8884d8' },
              { key: 'finance', color: '#82ca9d' },
              { key: 'hr', color: '#FFBB28' },
              { key: 'strategy', color: '#FF8042' }
            ]}
            title="Total Employee by Gender per Division"
            subtitle="PT TIGA DAYA DIGITAL INDONESIA" />
        <CardEmployee 
              colorStatus="#FF8042"
              title="Employee on Birthday" 
              subtitle="PT TIGA DAYA DIGITAL INDONESIA" />
        </div>

        {/* 4 */}
        <div className='display-flex-normal'>
        <CardPeople 
              colorStatus="#0088FE"
              title="Number of Employee Not Present by Type" 
              subtitle="PT TIGA DAYA DIGITAL INDONESIA"
              />
          <CardTinnyBarchart
              data={dataEmployeeScore}
              colors={
                ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']
              }
              title="Who is Late Employee Per Division" 
              subtitle="PT TIGA DAYA DIGITAL INDONESIA"/>
            <div style={{position: 'relative', width: 'calc(100%)'}}>
              <CardNewStatistic
                title="Total Employee"
                subtitle="Number of Employee Attendance per Today"
                data={[
                  {value:"800", label:"Total Employee"}
                ]}
              />
              <div className="padding-top-5px"></div>
              <CardNewStatistic
                title="Total Corporate Employee on a Business Trip"
                subtitle="PT TIGA DAYA DIGITAL INDONESIA"
                data={[
                  {value:"15", label:"Total Employee"}
                ]}
              />
            </div>
        </div>

        {/* 5 */}
        <div className='display-flex-normal'>
        <CardNewBarchart
              style={{position: 'relative', width: 'calc(100% - 470px)'}}
              data={dataIncome}
              dataKey={[
                { key: 'salary', color: '#6495ED' },
                // { key: 'bonus', color: '#82ca9d' },
                // { key: 'overtime', color: '#ffc658' }
              ]}
              title="Total Corporate Employee on Leave per Division"
              subtitle="PT TIGA DAYA DIGITAL INDONESIA" />
        <CardNewStatistic
                title="Total Average Amount of Business Trip Cost per Employee"
                subtitle="PT TIGA DAYA DIGITAL INDONESIA"
                icon = 'color-orange fas fa-dollar-sign fa-10x margin-right-10px'
                data={[
                  {value:"Rp 32.000.000", label:"Per Employee"}
                ]}
            />
        </div>

        {/* 6 notes */}
        <div className='display-flex-normal'>
        <CardSimpleBarchart
            data={dataAgeDemographic}
            dataKey={[
              { key: 'it', color: '#8884d8' },
              { key: 'finance', color: '#82ca9d' },
              { key: 'hr', color: '#FFBB28' },
              { key: 'strategy', color: '#FF8042' }
            ]}
            title="Total Average Amount of biztrip"
            subtitle="PT TIGA DAYA DIGITAL INDONESIA" />
        <CardNewPiechart
              data={dataOpenPosition}
              colors={
                ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']
              }
              title="Total List Employee on Movement by Type"
              subtitle="PT TIGA DAYA DIGITAL INDONESIA" />
        </div>
        
        {/* 7 */}
        <div className='display-flex-normal'>
        <CardSimpleBarchart
            data={dataAgeDemographic}
            dataKey={[
              { key: 'it', color: '#8884d8' },
              { key: 'finance', color: '#82ca9d' },
              { key: 'hr', color: '#FFBB28' },
              { key: 'strategy', color: '#FF8042' }
            ]}
            title="Total List Employee on Movement by Type per Division"
            subtitle="PT TIGA DAYA DIGITAL INDONESIA" />      
        <CardNewPiechart
              data={dataOpenPosition}
              colors={
                ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']
              }
              title="Total List Employee on Movement by Type"
              subtitle="PT TIGA DAYA DIGITAL INDONESIA" />
        </div>

        {/* 8 */}
        <div className='display-flex-normal'>
        <CardSimpleBarchart
            data={dataAgeDemographic}
            dataKey={[
              { key: 'it', color: '#8884d8' },
              { key: 'finance', color: '#82ca9d' }
            ]}
            title="Total List Employee on Termination by Type per Division"
            subtitle="PT TIGA DAYA DIGITAL INDONESIA" />      
        <CardNewPiechart
              data={dataOpenPosition}
              colors={
                ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']
              }
              title="Total List Employee on Termination by Type"
              subtitle="PT TIGA DAYA DIGITAL INDONESIA" />     
        </div>

        {/* 9 */}
        <div className='display-flex-normal'>
        <CardSimpleBarchart
            data={dataAgeDemographic}
            dataKey={[
              { key: 'it', color: '#6495ED' },
              { key: 'finance', color: 'orange' },
              { key: 'hr', color: 'red' },
            ]}
            title="Total List Employee on Blacklist by Type per Division"
            subtitle="PT TIGA DAYA DIGITAL INDONESIA" />      
        <CardNewPiechart
              data={dataOpenPosition}
              colors={
                ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']
              }
              title="Total List Employee on Blacklist by Type"
              subtitle="PT TIGA DAYA DIGITAL INDONESIA" />        
        </div>
        
        {/* 10 */}
        <div className='display-flex-normal'>
          <CardNewBarchart
              style={{position: 'relative', width: 'calc(100% - 470px)'}}
              data={dataIncome}
              dataKey={[
                { key: 'salary', color: 'orange' },
                // { key: 'bonus', color: '#82ca9d' },
                // { key: 'overtime', color: '#ffc658' }
              ]}
              title="Number of Applicant per Division"
              subtitle="PT TIGA DAYA DIGITAL INDONESIA" />
            <CardNewStatistic
                title="Number of Budget Planning of the Year"
                subtitle="PT TIGA DAYA DIGITAL INDONESIA"
                icon = 'color-red fas fa-user-tie fa-10x margin-right-10px'
                data={[
                  {value:"100", label:"Total Budget Planning"}
                ]}
            />
        </div>

        {/* 11 */}
        <div className='display-flex-normal'>
        <CardNewBarchart
              style={{position: 'relative', width: 'calc(100% - 470px)'}}
              data={dataIncome}
              dataKey={[
                { key: 'salary', color: 'red' },
                // { key: 'bonus', color: '#82ca9d' },
                // { key: 'overtime', color: '#ffc658' }
              ]}
              title="Number of Candidate per Division"
              subtitle="PT TIGA DAYA DIGITAL INDONESIA" />
            <CardNewStatistic
                title="Average Cost per Hire"
                subtitle="PT TIGA DAYA DIGITAL INDONESIA"
                icon = 'color-orange fas fa-dollar-sign fa-10x margin-right-10px'
                data={[
                  {value:"RP. 87.000.000", label:"Total Average Cost"}
                ]}
            />
        </div>

        {/* 12 */}
        <div className='display-flex-normal'>
        <CardNewBarchart
              style={{position: 'relative', width: 'calc(100% - 470px)'}}
              data={dataIncome}
              dataKey={[
                { key: 'salary', color: 'green' },
                // { key: 'bonus', color: '#82ca9d' },
                // { key: 'overtime', color: '#ffc658' }
              ]}
              title="Number of Processing Applicant per Division"
              subtitle="PT TIGA DAYA DIGITAL INDONESIA" />
       <CardNewBarchart
              style={{position: 'relative', width: 'calc(100% - 470px)'}}
              data={dataIncome}
              dataKey={[
                { key: 'salary', color: '#E5E5FF' },
                // { key: 'bonus', color: '#82ca9d' },
                // { key: 'overtime', color: '#ffc658' }
              ]}
              title="Number of open Position by Departement"
              subtitle="PT TIGA DAYA DIGITAL INDONESIA" />
        </div>

        {/* 13 */}
        <div className='display-flex-normal'>
          <CardNewStatistic
                title="Average Time Duration Execution Task per Employee"
                subtitle="PT TIGA DAYA DIGITAL INDONESIA"
                icon = ' color-orange far fa-clock fa-10x margin-right-10px'
                data={[
                  {value:"360", label:"Average Minutes per Task"}
                ]}
          />
          <CardNewStatistic
                title="Maximum Time Duration Execution Task per Employee"
                subtitle="PT TIGA DAYA DIGITAL INDONESIA"
                icon = 'color-red far fa-clock fa-10x margin-right-10px'
                data={[
                  {value:"430", label:"Minutes per Task"}
                ]}
          />
          <CardNewStatistic
                title="Number of Employee Involved Within Corporate Workflow"
                subtitle="PT TIGA DAYA DIGITAL INDONESIA"
                icon = 'color-orange fas fa-user-tie fa-10x margin-right-10px'
                data={[
                  {value:"360", label:"Average Minutes per Task"}
                ]}
          />
        </div>

        {/* 14 */}
        <div className='display-flex-normal'>
          <CardTable
            style={{position: 'relative', width: 'calc(100% - 470px)'}}
            title={'Average Payroll per Month of The Year'}
            icon = 'color-orange fas fa-dollar-sign fa-2x margin-right-10px'
            subtitle={'PT TIGA DAYA DIGITAL'}
            data={[['1','Januari','Rp, 1.000'],['2','Februari','Rp, 1.000'],['3','Maret','Rp, 1.000'],['4','April','Rp, 1.000'],['5','Mei','Rp, 1.000'],['6','Juni','Rp, 1.000'],['7','Juli','Rp, 1.000']]}
            columns={['No.','Month','Average']}
          />
           <CardTable
            style={{position: 'relative', width: 'calc(100% - 470px)'}}
            title={'Number of Executed Payroll'}
            icon = 'color-orange fas fa-dollar-sign fa-2x margin-right-10px'
            subtitle={'PT TIGA DAYA DIGITAL'}
            columns={['No.','Batch','Mount','Amount']}
            data={[['1','Payroll Staf', 'Januari 2010','Rp. 10.000'],['2','Payroll Staf', 'februari 2010','Rp. 10.000']]}
          />
        </div>

            {/* 15 */}
            <div className='display-flex-normal'>
          <CardTable
            style={{position: 'relative', width: 'calc(100% - 470px)'}}
            title={'Average Tax per Month of The Year'}
            icon = 'color-orange fas fa-dollar-sign fa-2x margin-right-10px'
            subtitle={'PT TIGA DAYA DIGITAL'}
            data={[['1','Januari','Rp, 1.000'],['2','Februari','Rp, 1.000'],['3','Maret','Rp, 1.000'],['4','April','Rp, 1.000'],['5','Mei','Rp, 1.000'],['6','Juni','Rp, 1.000'],['7','Juli','Rp, 1.000']]}
            columns={['No.','Month','Average']}
          />
           <CardTable
            style={{position: 'relative', width: 'calc(100% - 470px)'}}
            title={'Number of Executed Tax'}
            icon = 'color-orange fas fa-dollar-sign fa-2x margin-right-10px'
            subtitle={'PT TIGA DAYA DIGITAL'}
            columns={['No.','Batch','Mount','Amount']}
            data={[['1','Payroll Staf', 'Januari 2010','Rp. 10.000'],['2','Payroll Staf', 'februari 2010','Rp. 10.000']]}
          />
        </div>

            {/* 16 */}
            <div className='display-flex-normal'>
          <CardTable
            style={{position: 'relative', width: 'calc(100% - 470px)'}}
            title={'Average Compensation per Month of The Year'}
            icon = 'color-orange fas fa-dollar-sign fa-2x margin-right-10px'
            subtitle={'PT TIGA DAYA DIGITAL'}
            data={[['1','Januari','Rp, 1.000'],['2','Februari','Rp, 1.000'],['3','Maret','Rp, 1.000'],['4','April','Rp, 1.000'],['5','Mei','Rp, 1.000'],['6','Juni','Rp, 1.000'],['7','Juli','Rp, 1.000']]}
            columns={['No.','Month','Average']}
          />
           <CardTable
            style={{position: 'relative', width: 'calc(100% - 470px)'}}
            title={'Number of Executed Compensation'}
            icon = 'color-orange fas fa-dollar-sign fa-2x margin-right-10px'
            subtitle={'PT TIGA DAYA DIGITAL'}
            columns={['No.','Batch','Mount','Amount']}
            data={[['1','Payroll Staf', 'Januari 2010','Rp. 10.000'],['2','Payroll Staf', 'februari 2010','Rp. 10.000']]}
          />
        </div>
            {/* 17 */}
            <div className='display-flex-normal'>
          <CardTable
            style={{position: 'relative', width: 'calc(100% - 470px)'}}
            title={'Average Benefit per Month of The Year'}
            icon = 'color-orange fas fa-dollar-sign fa-2x margin-right-10px'
            subtitle={'PT TIGA DAYA DIGITAL'}
            data={[['1','Januari','Rp, 1.000'],['2','Februari','Rp, 1.000'],['3','Maret','Rp, 1.000'],['4','April','Rp, 1.000'],['5','Mei','Rp, 1.000'],['6','Juni','Rp, 1.000'],['7','Juli','Rp, 1.000']]}
            columns={['No.','Month','Average']}
          />
           <CardTable
            style={{position: 'relative', width: 'calc(100% - 470px)'}}
            title={'Number of Executed Benefit'}
            icon = 'color-orange fas fa-dollar-sign fa-2x margin-right-10px'
            subtitle={'PT TIGA DAYA DIGITAL'}
            columns={['No.','Batch','Mount','Amount']}
            data={[['1','Payroll Staf', 'Januari 2010','Rp. 10.000'],['2','Payroll Staf', 'februari 2010','Rp. 10.000']]}
          />
        </div>

        <div className="display-flex-normal">
          <CardNewBarchart
            style={{position: 'relative', width: 'calc(100% - 470px)'}}
            data={dataIncome}
            dataKey={[
              { key: 'salary', color: '#8884d8' },
              // { key: 'bonus', color: '#82ca9d' },
              // { key: 'overtime', color: '#ffc658' }
            ]}
            title="Total Employee on Business Trip"
            subtitle="PT. Bozz Online Solusindo" />
          <div style={{position: 'relative', width: 'calc(100%)'}}>
            <CardNewStatistic
              title="Total Employee"
              subtitle="PT. Bozz Online Solusindo"
              data={[
                {value:"744", label:"Total Employees"}
              ]}
             />
            <div className="padding-top-5px"></div>
            <CardNewStatistic
              title="Total Employee by Gender"
              subtitle="PT. Bozz Online Solusindo"
              data={[
                {value:"519", label:"Male"},
                {value:"225", label:"Female"}
              ]}
             />
          </div>

        </div>

        <div className="display-flex-normal">
            <CardEmployee 
              colorStatus="#0088FE"
              title="Employee on Leave" 
              subtitle="Here is list of PT. Bozz Online Solusindo employess who on the leave today" />
            <CardNewPiechart
              data={dataOpenPosition}
              colors={
                ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']
              }
              title="Total Employee by Age"
              subtitle="PT. Bozz Online Solusindo" />
            <CardNewPiechart
              data={dataOpenPosition}
              colors={
                ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']
              }
              title="Attendance Summary"
              subtitle="PT. Bozz Online Solusindo" />
        </div>

        <div className="display-flex-normal">
            <CardPeople 
              colorStatus="#0088FE"
              title="Employee on Birthday" 
              subtitle="PT. Bozz Online Solusindo" />
            <CardEmployee 
              colorStatus="#FF8042"
              title="Who is Late" 
              subtitle="Here is list of PT. Bozz Online Solusindo employess who come late today" />
            <CardEmployee 
              colorStatus="#FF8042"
              title="Not Present Employee" 
              subtitle="Here is list of PT. Bozz Online Solusindo employess who not present today" />
        </div>

        
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