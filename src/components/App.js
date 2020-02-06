import React, { Component } from 'react'
import { BrowserRouter as Router, Route, NavLink, HashRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import AccessControl from './access/AccessControl'
// modules
// import ChatPopup from '../modules/popup/Chat'
// import CreatePopup from '../modules/popup/Create'
import NotifPopup from '../modules/popup/Notif'
import SearchPopup from '../modules/popup/Search'
import ProfilePopup from '../modules/popup/Profile'
import TabNavigator from '../modules/popup/TabNavigator'
import ComplexMenu from '../modules/popup/ComplexMenu'

// auth
import Login from './auth/Index'

// home
import Dashboard from './dashboard/Index'
import DashboardPersonel from './dashboard/dashboardPersonel'
import DashboardRecruitment from './dashboard/dashboardRecruitment'
import DashboardWorkflow from './dashboard/dashboardWorkflow'
import DashboardCnb from './dashboard/dashboardCnb'
import DashboardLoan from './dashboard/dashboardLoan'
import DashboardTraining from './dashboard/dashboardTraining'
import DashboardTalent from './dashboard/dashboardTalent'
import DashboardPerformance from './dashboard/dashboardPerformance'
import DashboardEss from './dashboard/dashboardEss'

// home
import Blankpage from './common/index'
import BlankRed from './common/blank'

//masterdata
import NES from './masterData/nes'
import Institute from './masterData/institute'
import BusinessParam from './masterData/businessParam'
import Education from './masterData/education'
import Corporate from './masterData/corporate'
import VendorOutsourcing from './masterData/masterVendor'
import BankAccount from './masterData/bankAccount'

// pages
import SweetAlert from './pages/SweetAlert'
import Table from './pages/Table'
import FormBuilder from './pages/FormBuilder'
import ProgressImage from './pages/ProgressImage'
import Thumbnail from './pages/Thumbnail'
import ContohTabel from './pages/ContohTabel'
import OrganizationChart from './pages/OrganizationChart'

// recruitment
import MPP from './recruitment/mpp/mpp'
import Recmonitoring from './recruitment/Request/monitoring'
import Applicant from './recruitment/applicant/applicant'
import Candidate from './recruitment/candidate/candidate'
import JobVacancy from './recruitment/job/jobVacancy'

//personel
import Attendance from './personnelAdministration/timeAttendance/attendance'
import Leave from './personnelAdministration/leaveAdministration/leaveAdministration'
import Overtime from './personnelAdministration/overtimeAdministration/overtimeAdministration'
import Sppd from './personnelAdministration/travelExpense/sppd'
import Employee from './personnelAdministration/employeeManagement/employeeManagement'
import Termination from './personnelAdministration/employeeTermination/employeeTermination'
import Blacklist from './personnelAdministration/blacklistManagement/blacklist'
import MovementManagement from './personnelAdministration/movementManagement/movementManagement'

// INBOX
import inbox from './inbox/inbox'

// LOAN
import Loan from './loan/loan'

// ESS
import Biodata from './ess/Biodata'
import Training from './ess/training'
import OvertimeESS from './ess/overtime'
import PphEss from './ess/pph'
import Absence from './ess/absence'
import ChangePass from './ess/changePassword'
import TravelEx from './ess/travelExpense'
import LeaveEss from './ess/LeaveEss'
import Payslip from './ess/Payslip'
import cnbESS from './ess/cnbESS'

// System Configuration
import UserManagement from './systemConfiguration/userManagement/userManagement'
import RoleManagement from './systemConfiguration/userManagement/roleManagement'
import Configuration from './systemConfiguration/userManagement/configuration'

// CNB
import CnbPayroll from './compensation/compensation'
import CnbClaim from './compensation/claim'

// Training
import TrainingBudgetRequest from './training/trainingBudgetRequest'
import TrainingPlan from './training/trainingPlan'

//Report
import Bpjs from './report/bpjs'
import EmployeeReport from './report/employeeReport'
import PphReport from './report/pphReport'
import PayslipReport from './report/payslipReport'
import AbsenceReport from './report/absenceReport'
import TermReport from './report/terminationReport'
import MoveReport from './report/movementReport'

//Analytics
import Performance from './analytics/Performance'

//Outsource
import OutsourceAssignment from './outsource/employeeOutsource'

// icon
var angle = 'fa fa-lg fa-angle-right'
var close = 'fa fa-lg fa-times'

// sub menu
var opSubMenu = 'app-menu app-submenu-themes app-submenu'
var clSubMenu = 'app-menu app-submenu-themes'

var opMenu = 'list'
var clMenu = 'list active'


class App extends Component {

  constructor() {

    super()
    this.state = {
      appClass: 'app', //app-side-big-icon
      appButtonClass: 'fa fa-lg fa-times',
      travelClass: opMenu,
      travelSubmenu: opSubMenu,
      travelMoreIcon: angle,
      timeClass: opMenu,
      timeSubmenu: opSubMenu,
      timeMoreIcon: angle,
      leaveClass: opMenu,
      leaveSubmenu: opSubMenu,
      leaveMoreIcon: angle,
      overtimeClass: opMenu,
      overtimeSubmenu: opSubMenu,
      overtimeMoreIcon: angle,
      employeeClass: opMenu,
      employeeSubmenu: opSubMenu,
      employeeMoreIcon: angle,
    }

  }

  opEmployeeSubmenu = () => {
    if (this.state.employeeClass === opMenu) {
      this.setState({ employeeSubmenu: clSubMenu })
      this.setState({ employeeClass: clMenu })
      this.setState({ employeeMoreIcon: close })
    } else {
      this.setState({ employeeSubmenu: opSubMenu })
      this.setState({ employeeClass: opMenu })
      this.setState({ employeeMoreIcon: angle })
    }
  }

  opTravelSubmenu = () => {
    if (this.state.travelClass === opMenu) {
      this.setState({ travelSubmenu: clSubMenu })
      this.setState({ travelClass: clMenu })
      this.setState({ travelMoreIcon: close })
    } else {
      this.setState({ travelSubmenu: opSubMenu })
      this.setState({ travelClass: opMenu })
      this.setState({ travelMoreIcon: angle })
    }
  }

  opTimeSubmenu = () => {
    if (this.state.timeClass === opMenu) {
      this.setState({ timeSubmenu: clSubMenu })
      this.setState({ timeClass: clMenu })
      this.setState({ timeMoreIcon: close })
    } else {
      this.setState({ timeSubmenu: opSubMenu })
      this.setState({ timeClass: opMenu })
      this.setState({ timeMoreIcon: angle })
    }
  }

  opLeaveSubmenu = () => {
    if (this.state.leaveClass === opMenu) {
      this.setState({ leaveSubmenu: clSubMenu })
      this.setState({ leaveClass: clMenu })
      this.setState({ leaveMoreIcon: close })
    } else {
      this.setState({ leaveSubmenu: opSubMenu })
      this.setState({ leaveClass: opMenu })
      this.setState({ leaveMoreIcon: angle })
    }
  }

  opOvertimeSubmenu = () => {
    if (this.state.overtimeClass === opMenu) {
      this.setState({ overtimeSubmenu: clSubMenu })
      this.setState({ overtimeClass: clMenu })
      this.setState({ overtimeMoreIcon: close })
    } else {
      this.setState({ overtimeSubmenu: opSubMenu })
      this.setState({ overtimeClass: opMenu })
      this.setState({ overtimeMoreIcon: angle })
    }
  }

  opSlide = () => {
    if (this.state.appClass === 'app') {
      this.setState({ appClass: 'app app-side-big-icon' })
      this.setState({ appButtonClass: 'fa fa-lg fa-bars' })
    } else {
      this.setState({ appClass: 'app' })
      this.setState({ appButtonClass: 'fa fa-lg fa-times' })
    }
  }

  createList = () => {
    let dt = []

    for (let i = 0; i < 10; i++) {
      dt.push(
        <NavLink to={'/components/' + i}>
          <li className="content">
            <div className="list">
              <div className="icn">
                <i className="fa fa-lg fa-th"></i>
              </div>
              <div className="ttl">
                Components {i}
              </div>
            </div>
          </li>
        </NavLink>
      )
    }

    return dt
  }

  createSubMenu = (val, link, icon) => {
    return <NavLink to={link}>
      <div className="content">
        <div className="list">
          <div className="icn">
            <i className={icon}></i>
          </div>
          <div className="ttl">
            {val}
          </div>
          <div className="icn icn-right txt-site txt-right txt-12"></div>
        </div>
      </div>
    </NavLink>
  }

  render() {
    let role = this.props.auth.user !== null && (this.props.auth.user.roles) !== undefined ? this.props.auth.user.roles : []
    let privilege = this.props.auth.user !== null && (this.props.auth.user.privileges) !== undefined ? this.props.auth.user.privileges : []
    return (
      <HashRouter history={Router.browserHistory}>
        <div>
          {/* Multiple Page */}
          <div className={this.state.appClass}>

            <div className="app-slide">
              <div className="slide-content background-blue">

                <div className="app-title">
                  <div className="col-1">
                    <h1 className="txt-site txt-white txt-upp txt-18 txt-bold post-center margin-left-10px">
                      EKSADPRO2019
	                  </h1>
                  </div>
                  <div className="col-2">
                    <button
                      className="btn btn-blue btn-circle"
                      onClick={this.opSlide}>
                      <i className={this.state.appButtonClass} />
                    </button>
                  </div>
                </div>
                <div className="slide-list change-scrollbar">
                  <AccessControl
                    userPermissions={role}
                    allowedPermissions={["R_WEB_DASHBOARD"]}
                  >
                    <div className="app-space">
                      <input type="checkbox" name="mainmenu" id="mainmenu-dashboard" />
                      <label htmlFor="mainmenu-dashboard" className="list">
                        <span className="app-space-icon">
                          <img src={require("../assets/img/icons/dashboard.png")} alt='' />
                        </span>
                        <span className="app-space-text">
                          DASHBOARD
                        </span>
                        <span className="app-space-sign"></span>
                      </label>
                      <div className="app-space-content">
                        <div className="app-menu">
                          <AccessControl userPermissions={privilege} allowedPermissions={["P_WEB_DASHBOARD"]}>
                            {this.createSubMenu('Dashboard', '/home', 'fa fa-lg fa-home')}
                          </AccessControl>
                          <AccessControl userPermissions={privilege} allowedPermissions={["P_WEB_DASHBOARD"]}>
                            {this.createSubMenu('Personnel Management', '/dashboard-personel', 'fa fa-lg fa-home')}
                          </AccessControl>
                          <AccessControl userPermissions={privilege} allowedPermissions={["P_WEB_DASHBOARD"]}>
                            {this.createSubMenu('Recruitment', '/dashboard-recruitment', 'fa fa-lg fa-home')}
                          </AccessControl>
                          <AccessControl userPermissions={privilege} allowedPermissions={["P_WEB_DASHBOARD"]}>
                            {this.createSubMenu('Workflow', '/dashboard-workflow', 'fa fa-lg fa-home')}
                          </AccessControl>
                          <AccessControl userPermissions={privilege} allowedPermissions={["P_WEB_DASHBOARD"]}>
                            {this.createSubMenu('C&B', '/dashboard-cnb', 'fa fa-lg fa-home')}
                          </AccessControl>
                          <AccessControl userPermissions={privilege} allowedPermissions={["P_WEB_DASHBOARD"]}>
                            {this.createSubMenu('Loan', '/dashboard-loan', 'fa fa-lg fa-home')}
                          </AccessControl>
                          <AccessControl userPermissions={privilege} allowedPermissions={["P_WEB_DASHBOARD"]}>
                            {this.createSubMenu('Training', '/dashboard-training', 'fa fa-lg fa-home')}
                          </AccessControl>
                          <AccessControl userPermissions={privilege} allowedPermissions={["P_WEB_DASHBOARD"]}>
                            {this.createSubMenu('Talent', '/dashboard-talent', 'fa fa-lg fa-home')}
                          </AccessControl>
                          <AccessControl userPermissions={privilege} allowedPermissions={["P_WEB_DASHBOARD"]}>
                            {this.createSubMenu('Performance', '/dashboard-performance', 'fa fa-lg fa-home')}
                          </AccessControl>
                          <AccessControl userPermissions={privilege} allowedPermissions={["P_WEB_DASHBOARD"]}>
                            {this.createSubMenu('ESS', '/dashboard-ess', 'fa fa-lg fa-home')}
                          </AccessControl>
                        </div>
                      </div>
                    </div>
                  </AccessControl>
                  <AccessControl
                    userPermissions={role}
                    allowedPermissions={["R_WEB_COMPLEX"]}
                  >
                    <div className="app-space">
                      <input type="checkbox" name="mainmenu" id="mainmenu-complex-menu" />
                      <label htmlFor="mainmenu-complex-menu" className="list">
                        <span className="app-space-icon">
                          <img src={require("../assets/img/icons/menu.png")} alt='' />
                        </span>
                        <span className="app-space-text">
                          COMPLEX MENU
                      </span>
                        <span className="app-space-sign"></span>
                      </label>
                      <div className="app-space-content">
                        <div className="app-menu">
                          <ComplexMenu
                            title="Configurations"
                            icon="fa fa-lg fa-cogs"
                            tabMenu={[
                              {
                                id: 'tabmenu-1',
                                status: 'active',
                                title: 'Recruitment',
                                subtitle: 'click for more details',
                                icon: 'fa fa-lw fa-cogs'
                              },
                              {
                                id: 'tabmenu-2',
                                status: '',
                                title: 'Personel',
                                subtitle: 'click for more details',
                                icon: 'fa fa-lw fa-users'
                              },
                              {
                                id: 'tabmenu-3',
                                status: '',
                                title: 'Compensation',
                                subtitle: 'click for more details',
                                icon: 'fa fa-lw fa-database'
                              },
                              {
                                id: 'tabmenu-4',
                                status: '',
                                title: 'Corporate Time',
                                subtitle: 'click for more details',
                                icon: 'fa fa-lw fa-calendar'
                              },
                            ]}
                            tabSubMenu={[
                              // tab menu 1
                              {
                                id: 'tabsubmenu-1-1',
                                target: 'tabmenu-1',
                                link: '',
                                title: 'Configurations',
                                icon: 'fa fa-lw fa-cogs'
                              },
                              {
                                id: 'tabsubmenu-1-2',
                                target: 'tabmenu-1',
                                link: '',
                                title: 'Groups',
                                icon: 'fa fa-lw fa-users'
                              },
                              {
                                id: 'tabsubmenu-1-3',
                                target: 'tabmenu-1',
                                link: '',
                                title: 'Pay Slip',
                                icon: 'fa fa-lw fa-database'
                              },

                              // tab menu 2
                              {
                                id: 'tabsubmenu-2-1',
                                target: 'tabmenu-2',
                                link: '',
                                title: 'CORS',
                                icon: 'fa fa-lw fa-cogs'
                              },
                              {
                                id: 'tabsubmenu-2-2',
                                target: 'tabmenu-2',
                                link: '',
                                title: 'Database',
                                icon: 'fa fa-lw fa-database'
                              },

                              // tab menu 2
                              {
                                id: 'tabsubmenu-3-1',
                                target: 'tabmenu-3',
                                link: '/home',
                                title: 'Home',
                                icon: 'fa fa-lw fa-home'
                              },
                            ]} />
                        </div>
                      </div>
                    </div>
                  </AccessControl>

                  <AccessControl
                    userPermissions={role}
                    allowedPermissions={["R_WEB_INBOX"]}
                  >
                    <div className="app-space">
                      <input type="checkbox" name="mainmenu" id="mainmenu-inbox" />
                      <label htmlFor="mainmenu-inbox" className="list">
                        <span className="app-space-icon">
                          <img src={require("../assets/img/icons/inbox.png")} alt='' />
                        </span>
                        <span className="app-space-text">
                          INBOX
                        </span>
                        <span className="app-space-sign"></span>
                      </label>
                      <div className="app-space-content">
                        <div className="app-menu">
                          <AccessControl userPermissions={privilege} allowedPermissions={["P_WEB_INBOX"]}>
                            {this.createSubMenu('Inbox', '/inbox', 'fa fa-lg fa-envelope')}
                          </AccessControl>
                        </div>
                      </div>
                    </div>
                  </AccessControl>

                  <AccessControl
                    userPermissions={role}
                    allowedPermissions={["R_WEB_CONFIGURATION"]}
                  >
                    <div className="app-space">
                      <input type="checkbox" name="mainmenu" id="mainmenu-system-configuration" />
                      <label htmlFor="mainmenu-system-configuration" className="list">
                        <span className="app-space-icon">
                          <img src={require("../assets/img/icons/configuration.png")} alt='' />
                        </span>
                        <span className="app-space-text">
                          CONFIGURATION
                        </span>
                        <span className="app-space-sign"></span>
                      </label>
                      <div className="app-space-content">
                        <div className="app-menu">
                          <AccessControl userPermissions={privilege} allowedPermissions={["P_WEB_CONFIGURATION"]}>
                            {this.createSubMenu('Configurations', '/user-configuration', 'fa fa-lg fa-cogs')}
                          </AccessControl>
                        </div>
                        <div className="app-menu">
                          <li className="content">
                            <div className="submenu">
                              <input type="checkbox" name="submenu" id="submenu-6" />
                              <label htmlFor="submenu-6" className="list">
                                <div className="icn">
                                  <i className="fas fa-lg fa-user-cog"></i>
                                </div>
                                <div className="ttl">
                                  User & Security
                                </div>
                                <div className="submenu-sign"></div>
                              </label>
                              <div className="submenu-content">
                                <AccessControl userPermissions={privilege} allowedPermissions={["P_WEB_USER_MGT_USER"]}>
                                  {this.createSubMenu('User Explorer', '/user-management', 'fa fa-lg fa-users')}
                                </AccessControl>
                                <AccessControl userPermissions={privilege} allowedPermissions={["P_WEB_USER_MGT_ROLE"]}>
                                  {this.createSubMenu('Role Explorer', '/role-management', 'fa fa-lg fa-users')}
                                </AccessControl>
                              </div>
                            </div>
                          </li>
                        </div>
                      </div>
                    </div>
                  </AccessControl>

                  <AccessControl
                    userPermissions={role}
                    allowedPermissions={["R_WEB_MASTERDATA"]}
                  >
                    <div className="app-space">
                      <input type="checkbox" name="mainmenu" id="mainmenu-master-data" />
                      <label htmlFor="mainmenu-master-data" className="list">
                        <span className="app-space-icon">
                          <img src={require("../assets/img/icons/master-data.png")} alt='' />
                        </span>
                        <span className="app-space-text">
                          MASTERDATA
                        </span>
                        <span className="app-space-sign"></span>
                      </label>
                      <div className="app-space-content">
                        <div className="app-menu">
                          <AccessControl userPermissions={privilege} allowedPermissions={["P_WEB_MASTERDATA_BIZPAR"]}>
                            {this.createSubMenu('Business Parameter', '/business-param', 'fas fa-lg fa-industry')}
                          </AccessControl>
                          <AccessControl userPermissions={privilege} allowedPermissions={["P_WEB_MASTERDATA_NES"]}>
                            {this.createSubMenu('National Enterprise Structure', '/nes', 'fa fa-lg fa-table')}
                          </AccessControl>
                          <AccessControl userPermissions={privilege} allowedPermissions={["P_WEB_MASTERDATA_INSTITUTE"]}>
                            {this.createSubMenu('Institute', '/institute', 'fas fa-lg fa-university')}
                          </AccessControl>
                          <AccessControl userPermissions={privilege} allowedPermissions={["P_WEB_MASTERDATA_EDUCATION"]}>
                            {this.createSubMenu('Education', '/education', 'fas fa-lg fa-graduation-cap')}
                          </AccessControl>
                          <AccessControl userPermissions={privilege} allowedPermissions={["P_WEB_MASTERDATA_CORPORATE"]}>
                            {this.createSubMenu('Corporate', '/corporate', 'fas fa-lg fa-building')}
                          </AccessControl>
                          <AccessControl userPermissions={privilege} allowedPermissions={["P_WEB_MASTERDATA_CORPORATE"]}>
                            {this.createSubMenu('Vendor Outsourcing', '/vendor-outsourcing', 'fa fa-lg fa-table')}
                          </AccessControl>
                          {this.createSubMenu('Bank Account', '/bank-account', 'fa fa-lg fa-dollar-sign')}
                        </div>
                      </div>
                    </div>
                  </AccessControl>

                  <AccessControl
                    userPermissions={role}
                    allowedPermissions={["R_WEB_RECRUITMENT"]}
                  >
                    <div className="app-space">
                      <input type="checkbox" name="mainmenu" id="mainmenu-recruitment" />
                      <label htmlFor="mainmenu-recruitment" className="list">
                        <span className="app-space-icon">
                          <img src={require("../assets/img/icons/recruitment.png")} alt='' />
                        </span>
                        <span className="app-space-text">
                          RECRUITMENT
                        </span>
                        <span className="app-space-sign"></span>
                      </label>
                      <div className="app-space-content">
                        <div className="app-menu">
                          <AccessControl userPermissions={privilege} allowedPermissions={["P_WEB_RECRUITMENT_PLANNING"]}>
                            {this.createSubMenu('Planning', '/mpp', 'fas fa-lg fa-bed')}
                          </AccessControl>
                          <AccessControl userPermissions={privilege} allowedPermissions={["P_WEB_RECRUITMENT_JOB_VACANCY"]}>
                            {this.createSubMenu('Job Vacancy', '/job-vacancy', 'fas fa-lg fa-id-card')}
                          </AccessControl>
                          <AccessControl userPermissions={privilege} allowedPermissions={["P_WEB_RECRUITMENT_APPLICANT"]}>
                            {this.createSubMenu('Applicant', '/applicant', 'fas fa-lg fa-id-card')}
                          </AccessControl>
                          <AccessControl userPermissions={privilege} allowedPermissions={["P_WEB_RECRUITMENT_CANDIDATE"]}>
                            {this.createSubMenu('Candidate', '/candidate', 'fas fa-lg fa-id-card')}
                          </AccessControl>
                          <AccessControl userPermissions={privilege} allowedPermissions={["P_WEB_RECRUITMENT_EXPLORER"]}>
                            {this.createSubMenu('Explorer', '/recruitment-monitoring', 'fas fa-lg fa-desktop')}
                          </AccessControl>
                        </div>
                      </div>
                    </div>
                  </AccessControl>

                  <AccessControl
                    userPermissions={role}
                    allowedPermissions={["R_WEB_PERSONNEL"]}
                  >
                    <div className="app-space">
                      <input type="checkbox" name="mainmenu" id="mainmenu-personnel-adminstration" />
                      <label htmlFor="mainmenu-personnel-adminstration" className="list">
                        <span className="app-space-icon">
                          <img src={require("../assets/img/icons/personel.png")} alt='' />
                        </span>
                        <span className="app-space-text">
                          PERSONNEL
                        </span>
                        <span className="app-space-sign"></span>
                      </label>
                      <div className="app-space-content">
                        <div className="app-menu">
                          <li className="content">
                            <div className="submenu">
                              <input type="checkbox" name="submenu" id="submenu-1" />
                              <label htmlFor="submenu-1" className="list">
                                <div className="icn">
                                  <i className="fa fa-lg fa-user-cog"></i>
                                </div>
                                <div className="ttl">
                                  Employee
                                </div>
                                <div className="submenu-sign"></div>
                              </label>
                              <div className="submenu-content">
                                <AccessControl userPermissions={privilege} allowedPermissions={["P_WEB_PERSONNEL_EMPLOYEE"]}>
                                  {this.createSubMenu('Explorer', '/employee', 'fas fa-lg fa-desktop')}
                                </AccessControl>
                              </div>
                            </div>
                          </li>
                        </div>

                        <div className="app-menu">
                          <li className="content">
                            <div className="submenu">
                              <input type="checkbox" name="submenu" id="submenu-2" />
                              <label htmlFor="submenu-2" className="list">
                                <div className="icn">
                                  <i className="fa fa-lg fa-user-clock"></i>
                                </div>
                                <div className="ttl">
                                  Attendance
                                </div>
                                <div className="submenu-sign"></div>
                              </label>
                              <div className="submenu-content">
                                <AccessControl userPermissions={privilege} allowedPermissions={["P_WEB_PERSONNEL_ATTENDANCE"]}>
                                  {this.createSubMenu('Explorer', '/attendance', 'fas fa-lg fa-desktop')}
                                </AccessControl>
                              </div>
                            </div>
                          </li>
                        </div>

                        <div className="app-menu">
                          <li className="content">
                            <div className="submenu">
                              <input type="checkbox" name="submenu" id="submenu-3" />
                              <label htmlFor="submenu-3" className="list">
                                <div className="icn">
                                  <i className="fa fa-lg fa-user-clock"></i>
                                </div>
                                <div className="ttl">
                                  Leave
                                </div>
                                <div className="submenu-sign"></div>
                              </label>
                              <div className="submenu-content">
                                <AccessControl userPermissions={privilege} allowedPermissions={["P_WEB_PERSONNEL_LEAVE"]}>
                                  {this.createSubMenu('Explorer', '/leave', 'fas fa-lg fa-desktop')}
                                </AccessControl>
                              </div>
                            </div>
                          </li>
                        </div>

                        <div className="app-menu">
                          <li className="content">
                            <div className="submenu">
                              <input type="checkbox" name="submenu" id="submenu-4" />
                              <label htmlFor="submenu-4" className="list">
                                <div className="icn">
                                  <i className="fa fa-lg fa-user-clock"></i>
                                </div>
                                <div className="ttl">
                                  Overtime
                                </div>
                                <div className="submenu-sign"></div>
                              </label>
                              <div className="submenu-content">
                                <AccessControl userPermissions={privilege} allowedPermissions={["P_WEB_PERSONNEL_OVERTIME"]}>
                                  {this.createSubMenu('Explorer', '/overtime', 'fas fa-lg fa-desktop')}
                                </AccessControl>
                              </div>
                            </div>
                          </li>
                        </div>

                        <div className="app-menu">
                          <li className="content">
                            <div className="submenu">
                              <input type="checkbox" name="submenu" id="submenu-5" />
                              <label htmlFor="submenu-5" className="list">
                                <div className="icn">
                                  <i className="fa fa-lg fa-suitcase-rolling"></i>
                                </div>
                                <div className="ttl">
                                  Expense
                                </div>
                                <div className="submenu-sign"></div>
                              </label>
                              <div className="submenu-content">
                                <AccessControl userPermissions={privilege} allowedPermissions={["P_WEB_PERSONNEL_EXPENSE"]}>
                                  {this.createSubMenu('Explorer', '/sppd', 'fas fa-lg fa-desktop')}
                                </AccessControl>
                              </div>
                            </div>
                          </li>
                        </div>

                        <div className="app-menu">
                          <li className="content">
                            <div className="submenu">
                              <input type="checkbox" name="submenu" id="submenu-movement" />
                              <label htmlFor="submenu-movement" className="list">
                                <div className="icn">
                                  <i className="fa fa-lg fa-suitcase-rolling"></i>
                                </div>
                                <div className="ttl">
                                  Movement
                                </div>
                                <div className="submenu-sign"></div>
                              </label>
                              <div className="submenu-content">
                                <AccessControl userPermissions={privilege} allowedPermissions={["P_WEB_PERSONNEL_MOVEMENT"]}>
                                  {this.createSubMenu('Explorer', '/movement-management', 'fas fa-lg fa-desktop')}
                                </AccessControl>
                              </div>
                            </div>
                          </li>
                        </div>

                        <div className="app-menu">
                          <li className="content">
                            <div className="submenu">
                              <input type="checkbox" name="submenu" id="submenu-7" />
                              <label htmlFor="submenu-7" className="list">
                                <div className="icn">
                                  <i className="fa fa-lg fa-user-times"></i>
                                </div>
                                <div className="ttl">
                                  Termination
                                </div>
                                <div className="submenu-sign"></div>
                              </label>
                              <div className="submenu-content">
                                <AccessControl userPermissions={privilege} allowedPermissions={["P_WEB_PERSONNEL_TERMINATION"]}>
                                  {this.createSubMenu('Explorer', '/employee-termination', 'fas fa-lg fa-desktop')}
                                </AccessControl>
                              </div>
                            </div>
                          </li>
                        </div>

                        <div className="app-menu">
                          <li className="content">
                            <div className="submenu">
                              <input type="checkbox" name="submenu" id="submenu-bl" />
                              <label htmlFor="submenu-bl" className="list">
                                <div className="icn">
                                  <i className="fa fa-lg fa-user-times"></i>
                                </div>
                                <div className="ttl">
                                  Blacklist
                                </div>
                                <div className="submenu-sign"></div>
                              </label>
                              <div className="submenu-content">
                                <AccessControl userPermissions={privilege} allowedPermissions={["P_WEB_PERSONNEL_BLACKLIST"]}>
                                  {this.createSubMenu('Explorer', '/blacklist', 'fas fa-lg fa-desktop')}
                                </AccessControl>
                              </div>
                            </div>
                          </li>
                        </div>
                      </div>
                    </div>
                  </AccessControl>

                  <AccessControl
                    userPermissions={role}
                    allowedPermissions={["R_WEB_COMPENSATION"]}
                  >
                    <div className="app-space">
                      <input type="checkbox" name="mainmenu" id="mainmenu-cnb" />
                      <label htmlFor="mainmenu-cnb" className="list">
                        <span className="app-space-icon">
                          <img src={require("../assets/img/icons/compensation.png")} alt='' />
                        </span>
                        <span className="app-space-text">
                          C & B
                        </span>
                        <span className="app-space-sign"></span>
                      </label>
                      <div className="app-space-content">
                        <div className="app-menu">
                          <AccessControl userPermissions={privilege} allowedPermissions={["P_WEB_COMPENSATION_EXPLORER"]}>
                            {this.createSubMenu('Payroll', '/cnb-payroll', 'fas fa-lg fa-desktop')}
                          </AccessControl>
                          <AccessControl userPermissions={privilege} allowedPermissions={["P_WEB_COMPENSATION_EXPLORER"]}>
                            {this.createSubMenu('C & B', '/cnb-claim', 'fas fa-lg fa-desktop')}
                          </AccessControl>
                        </div>
                      </div>
                    </div>
                  </AccessControl>

                  <AccessControl
                    userPermissions={role}
                    allowedPermissions={["R_WEB_LOAN"]}
                  >
                    <div className="app-space">
                      <input type="checkbox" name="mainmenu" id="mainmenu-loan" />
                      <label htmlFor="mainmenu-loan" className="list">
                        <span className="app-space-icon">
                          <img src={require("../assets/img/icons/loan.png")} alt='' />
                        </span>
                        <span className="app-space-text">
                          LOAN
                        </span>
                        <span className="app-space-sign"></span>
                      </label>
                      <div className="app-space-content">
                        <div className="app-menu">
                          <AccessControl userPermissions={privilege} allowedPermissions={["P_WEB_LOAN_EXPLORER"]}>
                            {this.createSubMenu('Explorer', '/loan', 'fa fa-lg fa-circle')}
                          </AccessControl>
                        </div>
                      </div>
                    </div>
                  </AccessControl>

                  <AccessControl
                    userPermissions={role}
                    allowedPermissions={["R_WEB_HOLDING"]}
                  >
                    <div className="app-space">
                      <input type="checkbox" name="mainmenu" id="mainmenu-holding" />
                      <label htmlFor="mainmenu-holding" className="list">
                        <span className="app-space-icon">
                          <i className="fa fa-1x fa-hand-holding" />
                        </span>
                        <span className="app-space-text">
                          HOLDING
                        </span>
                        <span className="app-space-sign"></span>
                      </label>
                      <div className="app-space-content">
                        <div className="app-menu">
                          {this.createSubMenu('Subcompany', '/blank-red', 'fa fa-lg fa-circle')}
                          {this.createSubMenu('Explorer', '/blank-red', 'fa fa-lg fa-circle')}
                        </div>
                      </div>
                    </div>
                  </AccessControl>

                  <AccessControl
                    userPermissions={role}
                    allowedPermissions={["R_WEB_REPORT"]}
                  >
                    <div className="app-space">
                      <input type="checkbox" name="mainmenu" id="mainmenu-report" />
                      <label htmlFor="mainmenu-report" className="list">
                        <span className="app-space-icon">
                          <img src={require("../assets/img/icons/report.png")} alt='' />
                        </span>
                        <span className="app-space-text">
                          REPORT
                        </span>
                        <span className="app-space-sign"></span>
                      </label>
                      <div className="app-space-content">
                        <div className="app-menu">
                          <AccessControl userPermissions={privilege} allowedPermissions={["P_WEB_RPT_BPJS_KS"]}>
                            {this.createSubMenu('BPJS Info', '/report-bpjs', 'fa fa-lg fa-circle')}
                          </AccessControl>
                          <AccessControl userPermissions={privilege} allowedPermissions={["P_WEB_RPT_DATA_KARYAWAN"]}>
                            {this.createSubMenu('Employee Info', '/report-employee', 'fa fa-lg fa-circle')}
                          </AccessControl>
                          <AccessControl userPermissions={privilege} allowedPermissions={["P_WEB_RPT_TERMINASI_KARYAWAN"]}>
                            {this.createSubMenu('Termination', '/report-termination', 'fa fa-lg fa-circle')}
                          </AccessControl>
                          <AccessControl userPermissions={privilege} allowedPermissions={["P_WEB_RPT_MOVEMENT_KARYAWAN"]}>
                            {this.createSubMenu('Movement', '/report-movement', 'fa fa-lg fa-circle')}
                          </AccessControl>
                          <AccessControl userPermissions={privilege} allowedPermissions={["P_WEB_PO_PAYSLIP"]}>
                            {this.createSubMenu('Payslip', '/report-payslip', 'fa fa-lg fa-circle')}
                          </AccessControl>
                          <AccessControl userPermissions={privilege} allowedPermissions={["P_WEB_RPT_PPH21"]}>
                            {this.createSubMenu('PPH21', '/report-pph', 'fa fa-lg fa-circle')}
                          </AccessControl>
                          <AccessControl userPermissions={privilege} allowedPermissions={["P_WEB_PO_SURAT_PERINTAH_LEMBUR"]}>
                            {this.createSubMenu('Overtime', '/blank', 'fa fa-lg fa-circle')}
                          </AccessControl>
                          <AccessControl userPermissions={privilege} allowedPermissions={["P_WEB_PO_FORMULIR_PERMOHONAN_CUTI"]}>
                            {this.createSubMenu('Leave', '/blank', 'fa fa-lg fa-circle')}
                          </AccessControl>
                          <AccessControl userPermissions={privilege} allowedPermissions={["P_WEB_PO_SPPD"]}>
                            {this.createSubMenu('Travel Expense', '/blank', 'fa fa-lg fa-circle')}
                          </AccessControl>
                          <AccessControl userPermissions={privilege} allowedPermissions={["P_WEB_RPT_REPORT_ATTENDANCE"]}>
                            {this.createSubMenu('Absence', '/report-absence', 'fa fa-lg fa-circle')}
                          </AccessControl>
                          <AccessControl userPermissions={privilege} allowedPermissions={["P_WEB_PO_SURAT_PERJANJIAN_KERJA"]}>
                            {this.createSubMenu('Employee Contract', '/blank', 'fa fa-lg fa-circle')}
                          </AccessControl>
                        </div>
                      </div>
                    </div>
                  </AccessControl>

                  <AccessControl
                    userPermissions={role}
                    allowedPermissions={["R_WEB_ESS"]}
                  >
                    <div className="app-space">
                      <input type="checkbox" name="mainmenu" id="mainmenu-ess" />
                      <label htmlFor="mainmenu-ess" className="list">
                        <span className="app-space-icon">
                          <img src={require("../assets/img/icons/ess.png")} alt='' />
                        </span>
                        <span className="app-space-text">
                          ESS
                        </span>
                        <span className="app-space-sign"></span>
                      </label>
                      <div className="app-space-content">
                        <div className="app-menu">
                          <AccessControl userPermissions={privilege} allowedPermissions={["P_WEB_ESS_BIODATA"]}>
                            {this.createSubMenu('Biodata', '/ess-biodata', 'fa fa-lg fa-user')}
                          </AccessControl>
                          <AccessControl userPermissions={privilege} allowedPermissions={["P_WEB_ESS_TRAINING"]}>
                            {this.createSubMenu('Training', '/ess-training', 'fa fa-lg fa-circle')}
                          </AccessControl>
                          <AccessControl userPermissions={privilege} allowedPermissions={["P_WEB_ESS_PAYSLIP"]}>
                            {this.createSubMenu('Payslip', '/ess-payslip', 'fa fa-lg fa-circle')}
                          </AccessControl>
                          <AccessControl userPermissions={privilege} allowedPermissions={["P_WEB_ESS_PPH1721A1"]}>
                            {this.createSubMenu('PPH 1721A1', '/ess-pph', 'fa fa-lg fa-circle')}
                          </AccessControl>
                          <AccessControl userPermissions={privilege} allowedPermissions={["P_WEB_ESS_PPH1721A1"]}>
                            {this.createSubMenu('C&B', '/ess-cnb', 'fa fa-lg fa-circle')}
                          </AccessControl>
                          <AccessControl userPermissions={privilege} allowedPermissions={["P_WEB_ESS_TIMESHEET"]}>
                            {this.createSubMenu('Timesheet', '/ess-absence', 'fa fa-lg fa-circle')}
                          </AccessControl>
                          <AccessControl userPermissions={privilege} allowedPermissions={["P_WEB_ESS_LEAVE"]}>
                            {this.createSubMenu('Leave', '/ess-leave', 'fa fa-lg fa-circle')}
                          </AccessControl>
                          <AccessControl userPermissions={privilege} allowedPermissions={["P_WEB_ESS_OVERTIME"]}>
                            {this.createSubMenu('Overtime', '/ess-overtime', 'fa fa-lg fa-circle')}
                          </AccessControl>
                          <AccessControl userPermissions={privilege} allowedPermissions={["P_WEB_ESS_BUSINESS_TRIP"]}>
                            {this.createSubMenu('Business Trip', '/ess-travel', 'fa fa-lg fa-circle')}
                          </AccessControl>
                          <AccessControl userPermissions={privilege} allowedPermissions={["P_WEB_ESS_CHANGE_PASSWORD"]}>
                            {this.createSubMenu('Change Password', '/ess-password', 'fa fa-lg fa-circle')}
                          </AccessControl>
                        </div>
                      </div>
                    </div>
                  </AccessControl>

                  <AccessControl
                    userPermissions={role}
                    allowedPermissions={["R_WEB_ANALYTICS"]}
                  >
                    <div className="app-space">
                      <input type="checkbox" name="mainmenu" id="mainmenu-analytics" />
                      <label htmlFor="mainmenu-analytics" className="list">
                        <span className="app-space-icon">
                          <i className="fa fa-1x fa-chart-area" />
                        </span>
                        <span className="app-space-text">
                          ANALYTICS
                        </span>
                        <span className="app-space-sign"></span>
                      </label>
                      <div className="app-space-content">
                        <div className="app-menu">
                          {this.createSubMenu('Performance', '/performance', 'fa fa-lg fa-circle')}
                          {this.createSubMenu('Statistics', '/blank-red', 'fa fa-lg fa-circle')}
                        </div>
                      </div>
                    </div>
                  </AccessControl>

                  <AccessControl
                    userPermissions={role}
                    allowedPermissions={["R_WEB_INTEGRATION"]}
                  >
                    <div className="app-space">
                      <input type="checkbox" name="mainmenu" id="mainmenu-global-configuration" />
                      <label htmlFor="mainmenu-global-configuration" className="list">
                        <span className="app-space-icon">
                          <i className="fa fa-1x fa-cogs" />
                        </span>
                        <span className="app-space-text">
                          INTEGRATION
                        </span>
                        <span className="app-space-sign"></span>
                      </label>
                      <div className="app-space-content">
                        <div className="app-menu">
                          {this.createSubMenu('Integration', '/blank-red', 'fa fa-lg fa-circle')}
                          {this.createSubMenu('System', '/blank-red', 'fa fa-lg fa-circle')}
                        </div>
                      </div>
                    </div>
                  </AccessControl>

                  <AccessControl
                    userPermissions={role}
                    allowedPermissions={["R_WEB_TRAINING"]}
                  >
                    <div className="app-space">
                      <input type="checkbox" name="mainmenu" id="mainmenu-training" />
                      <label htmlFor="mainmenu-training" className="list">
                        <span className="app-space-icon">
                          <img src={require("../assets/img/icons/training.png")} alt='' />
                        </span>
                        <span className="app-space-text">
                          TRAINING
                        </span>
                        <span className="app-space-sign"></span>
                      </label>
                      <div className="app-space-content">
                        <div className="app-menu">
                          <AccessControl userPermissions={privilege} allowedPermissions={["P_WEB_TRAINING_FACILITATOR_EVALUATION"]}>
                            {this.createSubMenu('Training Budget Request', '/training-budget-request', 'fa fa-lg fa-circle')}
                          </AccessControl>
                          <AccessControl userPermissions={privilege} allowedPermissions={["P_WEB_TRAINING_PLAN"]}>
                            {this.createSubMenu('Training Plan', '/training-plan', 'fa fa-lg fa-circle')}
                          </AccessControl>
                        </div>
                      </div>
                    </div>
                  </AccessControl>

                  <AccessControl
                    userPermissions={role}
                    allowedPermissions={["R_WEB_OUTSOURCE"]}
                  >
                    <div className="app-space">
                      <input type="checkbox" name="mainmenu" id="mainmenu-outsource" />
                      <label htmlFor="mainmenu-outsource" className="list">
                        <span className="app-space-icon">
                          <img src={require("../assets/img/icons/outsource.png")} alt='' />
                        </span>
                        <span className="app-space-text">
                          OUTSOURCE
                        </span>
                        <span className="app-space-sign"></span>
                      </label>
                      <div className="app-space-content">
                        <div className="app-menu">
                          <AccessControl userPermissions={privilege} allowedPermissions={["P_WEB_OUTSOURCE_USER_ASSESSMENT"]}>
                            {this.createSubMenu('Outsource Assignment', '/outsource-assignment', 'fas fa-lg fa-industry')}
                          </AccessControl>
                        </div>
                      </div>
                    </div>
                  </AccessControl>

                </div>
              </div>
            </div>

            <div className="app-main">

              <div className="app-panel">
                <div className="panel-content">

                  <div className="col-1">
                    <div>
                      <SearchPopup />
                    </div>
                  </div>

                  <div className="col-2 content-right">
                    {/* <div className="panel-button app-desktop">
	                    <CreatePopup />
	                  </div>
	                  <div className="panel-button app-desktop" style={{marginLeft: "10px"}}>
	                    <ChatPopup />
	                  </div> */}
                    <div className="panel-button app-desktop" style={{ marginLeft: "10px" }}>
                      <NotifPopup />
                    </div>
                    <div className="panel-button">
                      <ProfilePopup />
                    </div>
                  </div>

                </div>
              </div>

              <div className="app-place">

                <Route exact path="/home" component={Dashboard} />
                <Route exact path="/dashboard-personel" component={DashboardPersonel} />
                <Route exact path="/dashboard-recruitment" component={DashboardRecruitment} />
                <Route exact path="/dashboard-workflow" component={DashboardWorkflow} />
                <Route exact path="/dashboard-cnb" component={DashboardCnb} />
                <Route exact path="/dashboard-loan" component={DashboardLoan} />
                <Route exact path="/dashboard-training" component={DashboardTraining} />
                <Route exact path="/dashboard-talent" component={DashboardTalent} />
                <Route exact path="/dashboard-performance" component={DashboardPerformance} />
                <Route exact path="/dashboard-ess" component={DashboardEss} />
                <Route exact path="/blank" component={Blankpage} />
                <Route exact path="/blank-red" component={BlankRed} />
                <Route exact path="/sweet-alert" component={SweetAlert} />
                <Route exact path="/table" component={Table} />
                <Route exact path="/form-builder" component={FormBuilder} />
                <Route exact path="/progress-image" component={ProgressImage} />
                <Route exact path="/thumbnail" component={Thumbnail} />
                <Route exact path="/contoh-tabel" component={ContohTabel} />
                <Route exact path="/organization-chart" component={OrganizationChart} />

                {/* Inbox */}
                <Route exact path="/inbox" component={inbox} />

                {/* Configuration */}
                <Route exact path="/user-management" component={UserManagement} />
                <Route exact path="/role-management" component={RoleManagement} />
                <Route exact path="/user-configuration" component={Configuration} />

                {/* Masterdata */}
                <Route exact path="/business-param" component={BusinessParam} />
                <Route exact path="/education" component={Education} />
                <Route exact path="/institute" component={Institute} />
                <Route exact path="/nes" component={NES} />
                <Route exact path="/corporate" component={Corporate} />
                <Route exact path="/vendor-outsourcing" component={VendorOutsourcing} />
                <Route exact path="/bank-account" component={BankAccount} />

                {/* Recruitment */}
                <Route exact path="/candidate" component={Candidate} />
                <Route exact path="/job-vacancy" component={JobVacancy} />
                <Route exact path="/mpp" component={MPP} />
                <Route exact path="/applicant" component={Applicant} />
                <Route exact path="/recruitment-monitoring" component={Recmonitoring} />

                {/* Personel */}
                <Route exact path="/attendance" component={Attendance} />
                <Route exact path="/leave" component={Leave} />
                <Route exact path="/overtime" component={Overtime} />
                <Route exact path="/sppd" component={Sppd} />
                <Route exact path="/employee" component={Employee} />
                <Route exact path="/blacklist" component={Blacklist} />
                <Route exact path="/employee-termination" component={Termination} />
                <Route exact path="/movement-management" component={MovementManagement} />

                {/*Loan */}
                <Route exact path="/loan" component={Loan} />

                {/*Training */}
                <Route exact path="/training-plan" component={TrainingPlan} />
                <Route exact path="/training-budget-request" component={TrainingBudgetRequest} />

                {/*Report */}
                <Route exact path="/report-bpjs" component={Bpjs} />
                <Route exact path="/report-employee" component={EmployeeReport} />
                <Route exact path="/report-payslip" component={PayslipReport} />
                <Route exact path="/report-pph" component={PphReport} />
                <Route exact path="/report-absence" component={AbsenceReport} />
                <Route exact path="/report-movement" component={MoveReport} />
                <Route exact path="/report-termination" component={TermReport} />

                {/*Outsource */}
                <Route exact path="/outsource-assignment" component={OutsourceAssignment} />

                {/* ESS */}
                <Route exact path="/ess-biodata" component={Biodata} />
                <Route exact path="/ess-training" component={Training} />
                <Route exact path="/ess-overtime" component={OvertimeESS} />
                <Route exact path="/ess-pph" component={PphEss} />
                <Route exact path="/ess-password" component={ChangePass} />
                <Route exact path="/ess-absence" component={Absence} />
                <Route exact path="/ess-cnb" component={cnbESS} />
                <Route exact path="/ess-travel" component={TravelEx} />
                <Route exact path="/ess-leave" component={LeaveEss} />
                <Route exact path="/ess-payslip" component={Payslip} />

                {/* C&B */}
                <Route exact path="/cnb-payroll" component={CnbPayroll} />
                <Route exact path="/cnb-claim" component={CnbClaim} />

                {/* Performance */}
                <Route exact path="/performance" component={Performance} />

                {/* tab navigator */}
                <Route exact path="/tab-navigator" component={TabNavigator} />
              </div>
            </div>

          </div>

          {/* Single Page */}
          <div className="app">
            <Route exact path="/" component={Login} />
          </div>

        </div>
      </HashRouter>
    )

  }

}

const mapStateToProps = state => {
  return {
    auth: state.auth
  };
};

export default connect(mapStateToProps, null)(App)