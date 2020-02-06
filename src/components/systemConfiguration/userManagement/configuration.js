import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import SplitPaneSecond from 'react-split-pane'
import moment from 'moment'
import * as R from 'ramda'

import ConfCompensation from './forms/cnb'
// import Personal from './forms/personal'
import CorporateTime from './forms/corporateTime'

import PopUp from '../../pages/PopUpAlert'
import ConfCorporateTPL from './forms/corporateTPL'
import ConfCorporateLeave from './forms/corporateLeave'
import ConfTravelExpense from './forms/travelExpense'
// import ConfBenefit from './forms/benefit'
import ConfPresence from './forms/presence'
import ConfOvertime from './forms/overtime'
import ConfFacility from './forms/facility'
import LoanConfig from './forms/LoanConfig'
import ConfPerformance from './forms/performance'
import ConfTalent from './forms/talent'
import ConfAllowance from './forms/allowance'
import AuthAction from '../../../Redux/AuthRedux'
import IdleTimer from 'react-idle-timer'

const clSlidePage = 'a-s-p-main'

class Configturations extends Component {

  constructor() {
    super()
    this.state = {
      dataTable: [],
      dataTableCorporateOfficeHour: [],
      dataTablePersonalOfficeHour: [],
      dataTableOfficeShiftHour: [],
      bizparHolidayType: '',
      bizparOfficeHourType: '',
      bizparCalendarType: '',
      bizparDayType: '',
      classAppSlidePage: 'app-side-page',
      classAppSlidePageMain: clSlidePage,
      activeTab: 'Facility',
      clEditAble: '',
      editAble: false,
      titleForm: '',
      iconForm: '',
      compensationVisible: false,
      personalVisible: false, //ganti
      facilityVisible: true, //ganti
      corporateTimeVisible: false,
      payrollVisible: false,
      benefitVisible: false,
      taxVisible: false,
      leaveVisible: false,
      corporateTPLVisible: false,
      corporateLeaveVisible: false,
      travelExpenseVisible: false,
      presenceVisible: false,
      overtimeVisible: false,
      performanceVisible: false,
      loanVisible: false,
      talentVisible: false,
      allowanceVisible: false,
      savePopUpVisible: false,
      deletePopUpVisible: false,
      slideMenu: '',
      moment: moment(),
      tabMenu: [
        // { id: 'tabmenu-1', target: 'tabcontent-1', status: 'active', title: 'Component', icon: 'fa fa-lw fa-cogs' },
        { id: 'tabmenu-2', target: 'tabcontent-2', status: 'active', title: 'Facility', icon: 'fa fa-lw fa-laptop' },
        { id: 'tabmenu-3', target: 'tabcontent-3', status: '', title: 'Compensation', icon: 'fa fa-lw fa-database' },
        { id: 'tabmenu-4', target: 'tabcontent-4', status: '', title: 'Corporate Time', icon: 'fa fa-lw fa-calendar' },
        { id: 'tabmenu-5', target: 'tabcontent-5', status: '', title: 'Corporate Template', icon: 'fa fa-lw fa-file-archive' },
        { id: 'tabmenu-6', target: 'tabcontent-6', status: '', title: 'Corporate Leave', icon: 'fa fa-lw fa-sign-out-alt' },
        { id: 'tabmenu-7', target: 'tabcontent-7', status: '', title: 'Travel Expense', icon: 'fa fa-lw fa-luggage-cart' },
        // { id: 'tabmenu-8', target: 'tabcontent-8', status: '', title: 'Benefit', icon: 'fa fa-lw fa-plus' },
        { id: 'tabmenu-9', target: 'tabcontent-9', status: '', title: 'Presence', icon: 'fa fa-lw fa-clipboard-list' },
        { id: 'tabmenu-10', target: 'tabcontent-10', status: '', title: 'Overtime', icon: 'fa fa-lw fa-clock' },
        { id: 'tabmenu-11', target: 'tabcontent-11', status: '', title: 'Loan', icon: 'fas fa-lw fa-hand-holding-usd' },
        { id: 'tabmenu-12', target: 'tabcontent-12', status: '', title: 'Performance', icon: 'fas fa-chart-line' },
        { id: 'tabmenu-13', target: 'tabcontent-13', status: '', title: 'Talent', icon: 'fas fa-star' },
        { id: 'tabmenu-14', target: 'tabcontent-14', status: '', title: 'C&B Component Allowance', icon: 'fas fa-dollar-sign' },
      ],
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

  openSavePopUp = () => {
    this.setState({
      savePopUpVisible: !this.state.savePopUpVisible,
      slideCorporateHoliday: false,
      slideCorporateOfficeHour: false,
      slideOfficeShiftHour: false,
      slidePersonalOfficeHour: false,
      editCompensationSatu: false,
      editCompensationDua: false,
      slidePayroll1: false,
      slidePayroll2: false,
      editBenefitSatu: false,
      editBenefitDua: false,
      editTaxSatu: false,
      editTaxDua: false,
      editLeaveSatu: false,
      editLeaveDua: false,
      editPerformance: false,
      editTalent: false,
      editAllowance: false,
      classAppSlidePage: 'app-side-page'
    })
  };

  openDeletePopUp = (rawData, index, type) => {
    this.setState({
      deletePopUpVisible: !this.state.deletePopUpVisible, selectedIndex: index, rawData: rawData, formType: type,
      slideCorporateHoliday: false,
      slideCorporateOfficeHour: false,
      slideOfficeShiftHour: false,
      slidePersonalOfficeHour: false,
      slidePayroll1: false,
      slidePayroll2: false,
      editCompensationSatu: false,
      editCompensationDua: false,
      editBenefitSatu: false,
      editBenefitDua: false,
      editTaxSatu: false,
      editTaxDua: false,
      editLeaveSatu: false,
      editLeaveDua: false,
      editPerformance: false,
      editTalent: false,
      editAllowance: false,
      classAppSlidePage: 'app-side-page'
    })
  }

  opNavigator = (data) => {
    let cl = data.title === this.state.activeTab ? 'c-n-icon active' : 'c-n-icon'
    return (
      <li key={data.id}
        className={cl}
        onClick={this.opContent(data.title)}>
        <div className="col-1 color-blue">
          <i className={data.icon} />
        </div>
        <div className="col-2">
          {data.title}
        </div>
      </li>
    );
  };

  opContent = (title) => (e) => {
    let allStateVisibleFalse = {
      ...this.state,
      facilityVisible: false,
      personalVisible: false,
      compensationVisible: false,
      corporateTimeVisible: false,
      payrollVisible: false,
      benefitVisible: false,
      taxVisible: false,
      leaveVisible: false,
      corporateTPLVisible: false,
      corporateLeaveVisible: false,
      travelExpenseVisible: false,
      presenceVisible: false,
      overtimeVisible: false,
      loanVisible: false,
      performanceVisible: false,
      talentVisible: false,
      allowanceVisible: false,
      activeTab: title
    }

    switch (title) {
      case "Component":
        allStateVisibleFalse = {
          ...allStateVisibleFalse,
          personalVisible: true
        }
        break;
      case "Facility":
        allStateVisibleFalse = {
          ...allStateVisibleFalse,
          facilityVisible: true
        }
        break;
      case "Compensation":
        allStateVisibleFalse = {
          ...allStateVisibleFalse,
          compensationVisible: true
        }
        break;
      case "Corporate Time":
        allStateVisibleFalse = {
          ...allStateVisibleFalse,
          corporateTimeVisible: true
        }
        break;
      case "Payroll":
        allStateVisibleFalse = {
          ...allStateVisibleFalse,
          payrollVisible: true
        }
        break;
      // case "Benefit":
      //   allStateVisibleFalse = {
      //     ...allStateVisibleFalse,
      //     benefitVisible: true
      //   }
      //   break;
      case "Leave":
        allStateVisibleFalse = {
          ...allStateVisibleFalse,
          leaveVisible: true
        }
        break;
      case "Tax":
        allStateVisibleFalse = {
          ...allStateVisibleFalse,
          taxVisible: true
        }
        break;
      case "Corporate Template":
        allStateVisibleFalse = {
          ...allStateVisibleFalse,
          corporateTPLVisible: true
        }
        break;
      case "Corporate Leave":
        allStateVisibleFalse = {
          ...allStateVisibleFalse,
          corporateLeaveVisible: true
        }
        break;
      case "Travel Expense":
        allStateVisibleFalse = {
          ...allStateVisibleFalse,
          travelExpenseVisible: true
        }
        break;
      case "Presence":
        allStateVisibleFalse = {
          ...allStateVisibleFalse,
          presenceVisible: true
        }
        break;
      case "Overtime":
        allStateVisibleFalse = {
          ...allStateVisibleFalse,
          overtimeVisible: true
        }
        break;
      case "Loan":
        allStateVisibleFalse = {
          ...allStateVisibleFalse,
          loanVisible: true
        }
        break;
      case "Performance":
        allStateVisibleFalse = {
          ...allStateVisibleFalse,
          performanceVisible: true
        }
        break;
      case "Performance":
        allStateVisibleFalse = {
          ...allStateVisibleFalse,
          performanceVisible: true
        }
        break;
      case "Talent":
        allStateVisibleFalse = {
          ...allStateVisibleFalse,
          talentVisible: true
        }
        break;
      case "C&B Component Allowance":
        allStateVisibleFalse = {
          ...allStateVisibleFalse,
          allowanceVisible: true
        }
        break;
      default:
        break;
    }
    this.setState(allStateVisibleFalse)
  }

  handleChange = moment => {
    this.setState({ moment })
  }

  handleSave = () => {
    console.log('saved', this.state.moment.format('llll'))
  }


  render() {
    if (R.isNil(this.props.auth.user)) return <Redirect to={{ pathname: "/" }} ></Redirect>
    return (
      <SplitPaneSecond
        split="vertical"
        defaultSize={220}
        minSize={40}
        maxSize={300}
        primary="first"
        className="main-slider"
        style={{ height: 'calc(100vh - 50px)' }}>
        <div className="col-1 background-white" style={{ minWidth: '220px'}}>
          <ul className="vertical-tab" style={{ width: '300px' }}>
            {this.state.tabMenu.map((data, index) => {
              return this.opNavigator(data)
            })}
          </ul>
        </div>
        <div className="col-2 background-white">
          <IdleTimer
            ref={ref => { this.idleTimer = ref }}
            element={document}
            onActive={this.onActive.bind(this)}
            onIdle={this.onIdle.bind(this)}
            onAction={this.onAction.bind(this)}
            debounce={250}
            timeout={this.state.timeout} />
          {/* personal */}
          {/* {this.state.personalVisible && (
            <Personal target="tabcontent-1" />
          )} */}

          {/* facility */}
          {this.state.facilityVisible && (
            <ConfFacility target="tabcontent-2" auth={this.props.auth.user} />
          )}

          {/* compensation */}
          {this.state.compensationVisible && (
            <ConfCompensation
              auth={this.props.auth.user}
              target="tabcontent-3" />
          )}

          {/* corporate time */}
          {this.state.corporateTimeVisible && (
            <CorporateTime
              target="tabcontent-4"
            />
          )}

          {/* corporate tpl */}
          {this.state.corporateTPLVisible && (
            <ConfCorporateTPL
              target="tabcontent-5"
              openDeletePopUp={this.openDeletePopUp.bind(this)}
            />
          )}

          {/* corporate leave */}
          {this.state.corporateLeaveVisible && (
            <ConfCorporateLeave
              target="tabcontent-6"
              openDeletePopUp={this.openDeletePopUp.bind(this)}
            />
          )}

          {/* travel expense */}
          {this.state.travelExpenseVisible && (
            <ConfTravelExpense
              target="tabcontent-7"
              openDeletePopUp={this.openDeletePopUp.bind(this)}
            />
          )}

          {/* {this.state.benefitVisible && (
            <ConfBenefit
              target="tabcontent-8"
              openDeletePopUp={this.openDeletePopUp.bind(this)}
            />
          )} */}

          {this.state.presenceVisible && (
            <ConfPresence
              target="tabcontent-9"
            />
          )}

          {this.state.overtimeVisible && (
            <ConfOvertime
              auth={this.props.auth.user}
              target="tabcontent-10"
            />
          )}

          {this.state.loanVisible && (
            <LoanConfig
              auth={this.props.auth.user}
              target="tabcontent-11"
            />
          )}

          {this.state.performanceVisible && (
            <ConfPerformance
              auth={this.props.auth.user}
              target="tabcontent-12"
            />
          )}


          {this.state.talentVisible && (
            <ConfTalent
              auth={this.props.auth.user}
              target="tabcontent-13"
            />
          )}

          {this.state.allowanceVisible && (
            <ConfAllowance
              auth={this.props.auth.user}
              target="tabcontent-14"
            />
          )}

          {this.state.savePopUpVisible && (
            <PopUp type={'save'} class={"app-popup app-popup-show"} onClick={this.openSavePopUp.bind(this)} />
          )}

          {/* <PopUp type={'delete'} class={this.state.deleteClass} onClick={this.openDeletePopup} onClickDelete={this.state.updateVisible ? () => this.handleUpdate(this.state.value) : this.handleDelete} /> */}

        </div>
      </SplitPaneSecond>
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

export default connect(mapStateToProps, mapDispatchToProps)(Configturations)