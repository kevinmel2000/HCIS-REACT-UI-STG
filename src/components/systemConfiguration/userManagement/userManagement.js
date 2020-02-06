import React, { Component } from 'react'
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles'
import MUIDataTable from "mui-datatables-bitozen"
import LoadingBar from 'react-top-loading-bar'
import PopUp from '../../pages/PopUpAlert'
import FormUser from '../../../modules/forms/formUserManagement'
import uuid from "uuid";
import IdpAction from '../../../Redux/IdpRedux'
import { connect } from 'react-redux';
import API from '../../../Services/Api'
import * as R from 'ramda';
import M from 'moment'
import FlexView from 'react-flexview'
import SplitPaneSecond from 'react-split-pane'
import ResizeSlider from '../../../modules/resize/Slider'
import { Redirect } from 'react-router-dom'
import AuthAction from '../../../Redux/AuthRedux'
import IdleTimer from 'react-idle-timer'

var ct = require("../../../modules/custom/customTable")
const clSlidePage = 'a-s-p-main'

class userManagement extends Component {
  constructor() {
    super()
    this.state = {
      file: null,
      searchClass: 'app-popup',
      saveClass: 'app-popup',
      deleteClass: 'app-popup',
      type: 'create',
      searchType: 'employee',
      uploadClass: 'app-popup',
      selectedIndex: null,
      rawData: [],
      dataTable: [],
      dataTableEmp: [],
      dataTableRole: [],
      dataTableUser: [],
      changePassword: this.defaultChangePassword,
      dataRole: [],
      fetching: false,
      refreshing: false,
      dtRole: [],

      createVisible: false,
      updateVisible: false,
      detailVisible: false,
      changeVisible: false,

      allowResize: false,
      defaultSize: 0,
      minSize: 0,
      maxSize: 0,
      userCount: 0,
      table_limit: 5,
      table_page: 0,
      table_query: "",
      classAppSlidePage: 'app-side-page',
      classAppSlidePageMain: clSlidePage,
      slideUserManagement: false,
      main: false,
      timeout: 1000 * 100 * 9,
      isTimedOut: false
    }
    this.idleTimer = null
    this.handleChange = this.handleChange.bind(this)
    this.handleDelete = this.handleDelete.bind(this)
    this.handleChangePassword = this.handleChangePassword.bind(this)
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

  clSidePage = () => {
    this.setState({ classAppSlidePage: 'app-side-page' })
  }

  opSidePage = (menu, data) => (e) => {
    e.preventDefault()
    let selectedIndex = data
    console.log(selectedIndex)
    this.setState({
      classAppSlidePage: 'app-side-page op-app-side',
      slideUserManagement: false,

    })

    this.opResizePane()

    switch (menu) {
      case 'slide-menu-1':
        this.setState({
          slideUserManagement: true,
          selectedIndex,
          type: 'update'
        })
        break
      case 'slide-menu-detail':
        this.setState({
          slideUserManagement: true,
          selectedIndex,
          type: 'detail'
        })
        break
      default:
        break
    }

  }

  opResizePane = () => {
    console.log('open', this.state.defaultSize)
    this.setState({
      allowResize: true,
      defaultSize: 370,
      minSize: 370,
      maxSize: 850
    })
  }

  clResizePane = () => {
    console.log('close', this.state.defaultSize)
    this.setState({
      slideUserManagement: false,
      allowResize: false,
      defaultSize: 0,
      minSize: 0,
      maxSize: 0
    })
  }

  defaultChangePassword = {
    oldPassword: "",
    confirmNewPassword: "",
    newPassword: "",
    modifiedAt: "",
    modifiedBy: ""
  }

  getData = (page, limit) => {
    this.props.getUserName({
      "params": {
        "userName": this.state.table_query
      },
      "offset": page,
      "limit": limit
    });
    this.getCountPage()
  }

  getCountPage = async () => {
    if (!R.isEmpty(this.state.table_query)) {
      let response = await API.create('IDP').getCountUser(this.state.table_query)
      if (response.ok) {
        this.setState({ userCount: response.data.data })
      }
    } else {
      let res = await API.create('IDP').getCountAllUser()
      this.setState({ userCount: res.data.data })
    }
  }

  componentDidMount() {
    if (!R.isNil(this.props.auth.user)) {
      this.startFetch();
      this.getData(this.state.table_page, this.state.table_limit)
      this.getDataEmployee();
      this.getDataRole();
    }
  }

  async componentWillReceiveProps(newProps) {
    if (!newProps.idp.fetching && !R.isNil(newProps.idp.userName)) {
      this.onFinishFetch()
      let imageUser = []
      let dataTable = newProps.idp.userName.map((value) => {
        const { employee, userName, userDesc, userStatus } = value;
        let empName = employee ? employee.employeeName : ""
        let emailCompany = ""
        let empEmail = employee && !R.isNil(employee.employeeEmails) ? employee.employeeEmails : ""
        let indexCompany = R.findIndex(R.propEq('employeeEmailType', "COMPANY"))(empEmail)
        if (indexCompany >= 0) emailCompany = " | " + empEmail[indexCompany].employeeEmail
        let empRegistrationDate = employee ? employee.employeeRegistrationDate : ""
        return [
          empName + emailCompany,
          userName,
          userDesc ? userDesc : "-",
          empRegistrationDate,
          userStatus
        ]
      })

      for (let i = 0; i < newProps.idp.userName.length; i++) {
        let { employee } = newProps.idp.userName[i]
        let img = await this.getImage(employee && employee.employeeID)
        if (img) imageUser[employee.employeeID] = img
      }

      this.setState({
        dataTable,
        rawData: newProps.idp.userName,
        imageUser
      })
    }

    this.setState({
      fetching: newProps.idp.fetching,
      refreshing: newProps.idp.fetching
    });
  }

  async getDataEmployee() {
    let payload = {
      offset: 0,
      limit: 150
    }
    let res = await API.create('EMPLOYEE_QUERY').getAllEmployee(payload)
    if (res.status === 200) {
      if (res.data.status === 'S') {
        console.log('employee: ', res.data);
        let dataTableEmp = res.data.data.map((value, index) => {
          const { employeeName, employeeEmail, company, position } = value;
          return [
            employeeName,
            employeeEmail,
            company ? company.companyName : '',
            position ? position.positionName : ''
          ]
        })
        let imageUserSearch = []
        for (let i = 0; i < res.data.data.length; i++) {
          let { employeeID } = res.data.data[i]
          let img = await this.getImage(employeeID && employeeID)
          if (img) [employeeID] = img
        }

        this.setState({
          dataTableEmp,
          rawDataEmp: res.data.data,
          imageUserSearch
        })
      } else {
        alert("Failed: " + res.data.message)
      }
    }
  }

  getDataRole() {
    let payload = {
      "params": {
        "roleStatus": "ACTIVE"
      },
      "offset": 0,
      "limit": 100
    }
    API.create('IDP').getRoleByStatus(payload).then(
      (res) => {
        if (res.status === 200) {
          if (res.data.status === 'S') {
            console.log('Role :', res.data);
            let dataTableRole = res.data.data.map((value) => {
              const { roleName } = value;
              return [
                roleName
              ]
            })
            this.setState({
              dataTableRole,
              rawDataRole: res.data.data
            })
          }
        }
      })
  }

  async saveDataUser(payload) {
    let response = await API.create('IDP').postUser(payload)
    if (response.ok && response.data.status === 'S') {
      this.openSavePopUp();
    } else {
      if (response.data && response.data.message) alert(response.data.message)
    }
  }

  async updateDataUser(payload) {
    payload = {
      ...payload,
      userStatus: 'ACTIVE'
    }
    let response = await API.create('IDP').updateUser(payload)
    if (response.ok && response.data.status === 'S') {
      this.openSavePopUp();
    } else {
      if (response.data && response.data.message) alert(response.data.message)
    }
  }

  async postUserRole(payload) {
    let data = Object.assign([], this.state.rawData[this.state.selectedIndex].listUserRole)
    let isExist = R.findIndex(R.propEq('roleID', payload.userRoleDTO.roleID))(data)
    if (isExist < 0) {
      let response = await API.create('IDP').postUserRole(payload)
      if (response.ok && response.data.status === 'S') {
        let dtRole = Object.assign([], this.state.rawData[this.state.selectedIndex].listUserRole)
        dtRole.push({
          ...payload.userRoleDTO
        })
        this.openSavePopUp();
        this.getTableRole(dtRole)
      } else {
        if (response.data && response.data.message) alert(response.data.message)
      }
    } else {
      alert("Failed: Role is Exist")
    }
  }

  getTableRole(dtRole) {
    dtRole = dtRole.map((value, index) => {
      let indexRole = R.findIndex(R.propEq('roleID', value.roleID))(this.state.rawDataRole)
      if (indexRole >= 0) return [this.state.rawDataRole[indexRole].roleName]
      else return ""
    })
    this.setState({ dtRole })
  }

  changePasswordDataUser(payloadChangePassword) {
    API.create('IDP').updateUserPassword(payloadChangePassword).then(
      (res) => {
        if (res.status === 200) {
          if (res.data.status === 'S') {
            this.openSavePopUp()
          } else {
            alert("Failed: " + res.data.message)
          }
        }
      })
  }

  deleteDataUser() {
    let payload = {
      referenceID: this.state.rawData[this.state.selectedIndex].userID,
      requestBy: "ADMIN",
      requestDate: M().format("DD-MM-YYYY HH:mm:ss")
    }
    API.create('IDP').deleteUser(payload).then(
      (res) => {
        if (res.status === 200) {
          if (res.data.status === 'S') {
            this.setState({ deleteClass: 'app-popup' })
            if (!R.isEmpty(this.state.table_query)) return this.getData(0, 5)
            else return this.getData(this.state.table_page, this.state.table_limit)
          } else alert("Failed: " + res.data.message)
        } else {
          alert("Failed: " + res.data.message)
        }
      })
  }

  deleteDataUserRole(payload, value) {
    API.create('IDP').deleteUserRole(payload).then(
      (res) => {
        if (res.status === 200) {
          if (res.data.status === 'S') {
            this.setState({ deleteClass: 'app-popup' })
            let dtRole = Object.assign([], this.state.rawData[this.state.selectedIndex].listUserRole)
            dtRole.splice(value, 1)
            this.getTableRole(dtRole)
            if (!R.isEmpty(this.state.table_query)) return this.getData(0, 5)
            else return this.getData(this.state.table_page, this.state.table_limit)
          } else alert("Failed: " + res.data.message)
        } else {
          alert("Failed: " + res.data.message)
        }
      })
  }

  openCreateForm = (selectedIndex) => {
    this.clResizePane()
    selectedIndex = !this.state.createVisible ? null : this.state.selectedIndex
    let dataRole = !this.state.createVisible ? [] : this.state.dataRole
    this.setState({ createVisible: !this.state.createVisible, selectedIndex, type: "create", dataRole })
  }

  openUpdateForm = (selectedIndex) => {
    this.setState({ updateVisible: !this.state.updateVisible, selectedIndex, type: "update" })
  }

  openDetailForm = (selectedIndex) => {
    this.clResizePane()
    this.getImageCreate(this.state.rawData[selectedIndex].employee.employeeID)
    this.setState({ detailVisible: !this.state.detailVisible, selectedIndex, type: "detail" })
  }

  closeDetailForm = () => {
    this.clResizePane()
    this.setState({ detailVisible: false, type: "detail" })
  }

  openSearchForm = (searchType = 'employee') => {
    if (this.state.searchClass === 'app-popup app-popup-show') {
      this.setState({ searchClass: 'app-popup', searchType })
    } else {
      this.setState({ searchClass: 'app-popup app-popup-show', searchType })
    }
  }

  openChangeForm = () => {
    this.setState({ changeVisible: !this.state.changeVisible })
  }

  openSavePopUp = () => {
    if (this.state.saveClass === 'app-popup app-popup-show') {
      if (this.state.changeVisible) {
        this.setState({ saveClass: 'app-popup', changeVisible: false, updateVisible: false })
        if (!R.isEmpty(this.state.table_query)) return this.getData(0, 5)
        else return this.getData(this.state.table_page, this.state.table_limit)
      } else if (this.state.createVisible) {
        console.log("create")
        this.setState({ saveClass: 'app-popup', createVisible: false })
        if (!R.isEmpty(this.state.table_query)) return this.getData(0, 5)
        else return this.getData(this.state.table_page, this.state.table_limit)
      } else if (this.state.searchClass === 'app-popup app-popup-show' && this.state.slideUserManagement) {
        console.log("ganti role")
        this.setState({ saveClass: 'app-popup', searchClass: 'app-popup' })
        if (!R.isEmpty(this.state.table_query)) return this.getData(0, 5)
        else return this.getData(this.state.table_page, this.state.table_limit)
      } else if (this.state.slideUserManagement) {
        console.log("update")
        this.setState({ saveClass: 'app-popup', updateVisible: false })
        if (!R.isEmpty(this.state.table_query)) {
          this.getData(0, 5)
        } else {
          this.getData(this.state.table_page, this.state.table_limit)
        }
        this.clResizePane()
      } else {
        console.log("lains")
        this.setState({ saveClass: 'app-popup' })
        if (!R.isEmpty(this.state.table_query)) return this.getData(0, 5)
        else return this.getData(this.state.table_page, this.state.table_limit)
      }
    } else {
      this.setState({ saveClass: 'app-popup app-popup-show' })
    }
  }

  openDeletePopup = (index, main) => {
    if (main) {
      this.clResizePane()
      this.setState({ main: false })
    }
    if (this.state.deleteClass === 'app-popup app-popup-show') {
      this.setState({ deleteClass: 'app-popup', selectedIndex: null })
    } else {
      if (this.state.slideUserManagement) {
        this.setState({ deleteClass: 'app-popup app-popup-show', value: index })
      } else {
        this.setState({ deleteClass: 'app-popup app-popup-show', selectedIndex: index })
      }
    }
  }

  openUploadPopUp = () => {
    if (this.state.uploadClass === 'app-popup app-popup-show') {
      this.setState({ uploadClass: 'app-popup' })
    } else {
      this.setState({ uploadClass: 'app-popup app-popup-show' })
    }
  }

  handleChange(event) {
    this.setState({
      file: URL.createObjectURL(event.target.files[0])
    })
  }

  handleSubmit(value) {
    let payload = Object.assign({}, value);
    payload.listUserRole = this.state.dataRole
    if (this.state.type === "create") this.saveDataUser(payload)
    if (this.state.type === "update") {
      value = {
        userID: value.userID,
        employee: value.employeeID,
        userName: value.username,
        password: value.password,
        userDesc: value.usertype,
        userStatus: value.userstatus,
        userCreationalDTO: {
          createdBy: "SYSTEM",
          createdDate: M().format("DD-MM-YYYY HH:mm:ss"),
          modifiedBy: null,
          modifiedDate: null
        },
        listUserRole: value.listuserrole
      }
      this.updateDataUser(value)
    }
  }

  handleUpdate(value, type = "") {
    let { rawDataRole, rawData, selectedIndex } = this.state
    let selectedRole = rawDataRole[value]
    let tableRole = this.state.dtRole.map((value) => {
      return {
        "roleName": value[0]
      }
    })
    let indexRole = R.findIndex(R.propEq('roleName', selectedRole.roleName))(tableRole)
    delete selectedRole.privileges
    let payload = Object.assign({}, rawData[selectedIndex]);
    let dataRole = Object.assign([], rawData[selectedIndex].listUserRole)

    if (type === "updateRole") {
      if (indexRole < 0) {
        payload = {
          userID: payload.userID,
          userRoleDTO: {
            userRoleID: uuid.v1(),
            userRoleStatus: "ACTIVE",
            roleID: selectedRole.roleID,
            userRoleCreationalDTO: {
              createdBy: "SYSTEM",
              createdDate: M().format("DD-MM-YYYY HH:mm:ss"),
              modifiedBy: null,
              modifiedDate: null
            }
          }
        }
        this.postUserRole(payload)
      } else {
        alert("Role is Exist")
      }
    } else {
      payload = {
        referenceID: dataRole[value].userRoleID
      }
      this.deleteDataUserRole(payload, value)
    }
  }

  handleChangePassword(value) {
    let payloadChangePassword = Object.assign({}, value);
    this.changePasswordDataUser(payloadChangePassword);
  }

  handleDelete() {
    this.deleteDataUser()
  }

  removeChange = () => {
    this.setState({
      file: null
    })
  }

  startFetch = () => {
    this.LoadingBar.continousStart()
  }

  onFinishFetch = () => {
    if (typeof this.LoadingBar === "object") this.LoadingBar.complete()
  }

  async getImage(employeeID) {
    let response = await fetch(
      process.env.REACT_APP_HCIS_BE_API + "emcmd/api/employee.photo.get/" +
      employeeID,
      {
        headers: {
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiJ9.5BG9SEVOGo_xRhtT8IkyoSy60kPg8HM9Vpvb0TdNew4"
        }
      }
    );
    response = await response.blob();
    if (response.size > 0) {
      response = URL.createObjectURL(response);
      return response
    } else {
      return null
    }
  }

  async getImageCreate(value) {
    let response = await fetch(process.env.REACT_APP_HCIS_BE_API + 'emcmd/api/employee.photo.get/' + value, {
      headers: {
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbiJ9.5BG9SEVOGo_xRhtT8IkyoSy60kPg8HM9Vpvb0TdNew4'
      }
    })
    response = await response.blob()
    if (response.size > 0) {
      response = URL.createObjectURL(response);
      this.setState({ response })
    } else { this.setState({ response: null }) }
  }

  getMuiTheme = () => createMuiTheme(ct.customTable());

  options = ct.customOptions()

  columns = [
    {
      name: "User",
      options: {
        customBodyRender: (val, tableMeta) => {
          let { rawData, imageUser } = this.state
          let photo = null
          let empId = rawData[tableMeta.rowIndex].employee && rawData[tableMeta.rowIndex].employee.employeeID
          if (empId) {
            photo = imageUser[empId]
          }
          return (
            <div>
              <FlexView vAlignContent="center">
                {photo ? <img style={{ verticalAlign: "middle", borderRadius: "50%", width: "50px", height: "50px", marginRight: 25 }} src={photo} alt="img" /> :
                  (<div>
                    <div className="image image-50px image-circle background-white border-all" style={{ marginRight: 25 }}>
                      <i className="icn fa fa-1x fa-user" style={{ textAlign: 'center' }} />
                    </div>
                  </div>)}
                {val}
              </FlexView>
            </div>
          )
        }
      }
    },
    "User Name",
    "User Type",
    "Registration Date",
    {
      name: "Status",
      options: {
        customBodyRender: (val) => {
          return (
            <div>
              {val === "ACTIVE" ? (
                <div>
                  <i className="fa fa-lw fa-circle" style={{ color: 'green', marginRight: 10 }} />
                  {val}
                </div>
              ) : <div>
                  <i className="fa fa-lw fa-circle" style={{ color: 'red', marginRight: 10 }} />
                  {val}
                </div>}
            </div>
          )
        }
      }
    },
    {
      name: "Action",
      options: {
        customBodyRender: (val, tableMeta) => {
          return (
            <div>
              {/* <div className="col-1"> */}
              <button
                className="btnAct"
                style={{ marginRight: 15, backgroundColor: 'transparent' }}
                onClick={this.opSidePage('slide-menu-1', tableMeta.rowIndex)}>
                <i className="fa fa-lw fa-pencil-alt" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }} />
              </button>
              {/* </div>
              <div className="col-2"> */}
              <button
                className="btnAct"
                style={{ marginRight: 15, backgroundColor: 'transparent' }}
                onClick={() => this.openDeletePopup(tableMeta.rowIndex, true)}>
                <i className="fa fa-lw fa-trash-alt" style={{ backgroundColor: 'transparent', color: 'red', fontSize: 20 }} />
              </button>
              {/* </div>
              <div className="col-3"> */}
              <button
                className="btnAct"
                style={{ marginRight: 15, backgroundColor: 'transparent' }}
                onClick={this.opSidePage('slide-menu-detail', tableMeta.rowIndex)}>
                <i className="fa fa-lw fa-ellipsis-v" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }} />
              </button>
              {/* </div> */}
            </div>
          )
        }
      }
    }
  ]

  columnsEmployee = [
    {
      name: "Employee",
      options: {
        customBodyRender: (val, tableMeta) => {
          let { rawDataEmp, imageUser } = this.state
          let photo = null
          let empId = rawDataEmp[tableMeta.rowIndex] && rawDataEmp[tableMeta.rowIndex].employeeID
          if (empId) {
            photo = imageUser[empId]
          }
          return (
            <FlexView vAlignContent="center">
              <FlexView>
                {photo ? (
                  <img width="100%" height="100%" src={photo} alt="img" style={{ verticalAlign: "middle", borderRadius: "50%", width: "50px", height: "50px", marginRight: 25 }} />
                ) : <i className="far fa-lw fa-user-circle" style={{ color: 'blue', marginRight: 10, fontSize: 44 }} />}
              </FlexView>
              <div style={{ fontWeight: 'bold', fontSize: 15 }}>
                {val}
              </div>
            </FlexView>
          )
        }
      }
    },
    {
      name: "Email",
      options: {
        display: "excluded"
      }
    },
    "Branch",
    "Position",
    {
      name: "Action",
      options: {
        customBodyRender: (val, tableMeta) => {
          return (
            <div>
              <button className="btn btn-blue btn-small-circle" onClick={() => this.addEmployeeHandler(tableMeta.rowIndex)}>
                <i className="fa fa-lw fa-plus" />
              </button>
            </div>
          )
        }
      }
    }
  ]

  async addEmployeeHandler(value) {
    this.openSearchForm('employee')
    this.getImageCreate(this.state.rawDataEmp[value].employeeID)
    this.setState({ selectedIndex: value })
  }

  addRoleHandler(value) {
    let { rawDataRole } = this.state
    let selectedRole = rawDataRole[value]
    let indexRole = R.findIndex(R.propEq('roleID', selectedRole.roleID))(this.state.dataRole)
    if (indexRole < 0) {
      let dataRole = Object.assign([], this.state.dataRole)
      delete selectedRole.privileges
      dataRole.push(
        {
          "userRoleID": uuid.v1(),
          "userRoleStatus": "ACTIVE",
          "userRoleCreationalDTO": {
            "createdBy": "SYSTEM",
            "createdDate": M().format("DD-MM-YYYY HH:mm:ss"),
            "modifiedBy": null,
            "modifiedDate": null
          },
          "roleID": selectedRole.roleID
        });
      this.setState({ dataRole })
      this.openSearchForm('role')
    } else {
      alert("Role is exist")
    }
  }

  deleteRole(value) {
    let dataRole = Object.assign([], this.state.dataRole)
    dataRole.splice(value, 1)
    this.setState({ dataRole })
  }

  render() {
    if (R.isNil(this.props.auth.user)) return <Redirect to={{ pathname: "/" }} ></Redirect>
    let dtRole = []
    if (this.state.type === "create") {
      dtRole = this.state.dataRole.map((data, index) => {
        let indexRole = R.findIndex(R.propEq('roleID', data.roleID))(this.state.rawDataRole)
        if (indexRole >= 0) return [this.state.rawDataRole[indexRole].roleName]
        else return ""
      })
    } else if (this.state.type === "update") {
      dtRole = this.state.rawData[this.state.selectedIndex] && this.state.rawData[this.state.selectedIndex].listUserRole.map((data, index) => {
        let indexRole = R.findIndex(R.propEq('roleID', data.roleID))(this.state.rawDataRole)
        if (indexRole >= 0) return [this.state.rawDataRole[indexRole].roleName]
        else return ""
      })
    } else if (this.state.type === "detail") {
      dtRole = this.state.rawData[this.state.selectedIndex] && this.state.rawData[this.state.selectedIndex].listUserRole.map((data, index) => {
        let indexRole = R.findIndex(R.propEq('roleID', data.roleID))(this.state.rawDataRole)
        if (indexRole >= 0) return [this.state.rawDataRole[indexRole].roleName]
        else return ""
      })
    }
    let { userCount, table_query } = this.state
    let tableOptions = {
      ...this.options,
      serverSide: true,
      count: userCount,
      searchText: table_query,
      onTableChange: (action, tableState) => {
        switch (action) {
          case 'changePage':
            this.setState({ table_page: tableState.page })
            this.getData(tableState.page, tableState.rowsPerPage);
            break;
          case 'changeRowsPerPage':
            this.setState({ table_limit: tableState.rowsPerPage })
            this.getData(tableState.page, tableState.rowsPerPage);
            break;
          case 'search':
            let searchText = tableState.searchText ? tableState.searchText : ""
            this.setState({ table_query: searchText }, () => {
              this.getData(tableState.page, tableState.rowsPerPage)
            })
            break;
          default:
            break;
        }
      }
    }
    return (
      <SplitPaneSecond
        split="vertical"
        defaultSize={0}
        minSize={0}
        maxSize={0}
        primary="first"
        className="main-slider"
        style={{ height: 'calc(100vh - 50px)' }}>
        <div className='col-1'></div>
        <div className='col-2'>
          <IdleTimer
            ref={ref => { this.idleTimer = ref }}
            element={document}
            onActive={this.onActive.bind(this)}
            onIdle={this.onIdle.bind(this)}
            onAction={this.onAction.bind(this)}
            debounce={250}
            timeout={this.state.timeout} />
          <div>
            <ResizeSlider
              allowResize={this.state.allowResize}
              defaultSize={this.state.defaultSize}
              minSize={this.state.minSize}
              maxSize={this.state.maxSize}
              main={(
                <div className='a-s-p-place a-s-p-content active'>
                  <div className="a-s-p-mid no-header">
                    <LoadingBar onRef={ref => (this.LoadingBar = ref)} />
                    <div className="padding-5px grid grid-2x">
                      <div className="col-1">
                        <div className="txt-site txt-18 txt-bold txt-main padding-top-5px">
                          {/* USER MANAGEMENT */}
                        </div>
                      </div>
                      <div className="col-2 content-right">
                        <button type="button" className="btn btn-circle background-blue" style={{ marginRight: 5 }} onClick={() => this.openCreateForm()}>
                          <i className='fa fa-1x fa-plus'></i>
                        </button>
                        <button type="button" className="btn btn-circle background-blue" style={{ marginRight: 5 }} onClick={this.openUploadPopUp}>
                          <i className='fa fa-1x fa-upload'></i>
                        </button>
                        <button type="button" className="btn btn-circle background-blue">
                          <i className='fa fa-1x fa-download'></i>
                        </button>
                      </div>
                    </div>

                    <div className="padding-5px">
                      <MuiThemeProvider theme={this.getMuiTheme()}>
                        <MUIDataTable
                          key={userCount}
                          title={'User Management'}
                          subtitle={"lorem ipsum dolor"}
                          data={this.state.dataTable}
                          columns={this.columns}
                          options={tableOptions}
                        />
                      </MuiThemeProvider>
                    </div>

                  </div>
                </div>
              )}
              side={(
                <div className="a-s-p-side">
                  {/* edit */}
                  {this.state.slideUserManagement && (
                    <FormUser
                      type={this.state.type}
                      getTableRole={this.getTableRole.bind(this)}
                      className={"app-popup app-popup-show"}
                      dataRole={this.state.dtRole[0] === "" ? [] : this.state.dtRole}
                      selectedDataUser={this.state.rawData ? this.state.rawData[this.state.selectedIndex] : ""}
                      dataEmp={this.state.rawDataEmp ? this.state.rawDataEmp[this.state.selectedIndex] : ""}
                      formType={'userEdit'}
                      onClick={this.openUpdateForm.bind(this)}
                      onClickRole={() => this.openSearchForm('role')}
                      onClickSearch={() => this.openSearchForm('employee')}
                      onClickButton={() => this.openChangeForm('change')}
                      onClickUpdate={this.handleSubmit.bind(this)}
                      roleButton={this.openDeletePopup.bind(this)}
                      closeSlide={this.clResizePane}
                      user={this.props.auth.user}
                    />
                  )}
                </div>
              )}
            >

            </ResizeSlider>

            {this.state.createVisible && (
              <FormUser
                type={"create"}
                className={"app-popup app-popup-show"}
                dataRole={dtRole}
                dataEmp={!this.state.createVisible ? "" : this.state.rawDataEmp && this.state.rawDataEmp[this.state.selectedIndex]}
                formType={'user'}
                img={!this.state.createVisible ? "" : this.state.response && this.state.response}
                roleButton={this.deleteRole.bind(this)}
                onClick={this.openCreateForm.bind(this)}
                onClickRole={() => this.openSearchForm('role')}
                onClickSearch={() => this.openSearchForm('employee')}
                onClickButton={this.handleSubmit.bind(this)}
                user={this.props.auth.user}
              />
            )}

            {/* {this.state.updateVisible && (
              <FormUser
                type={"update"}
                getTableRole={this.getTableRole.bind(this)}
                className={"app-popup app-popup-show"}
                dataRole={this.state.dtRole[0] === "" ? [] : this.state.dtRole}
                selectedDataUser={this.state.rawData ? this.state.rawData[this.state.selectedIndex] : ""}
                dataEmp={this.state.rawDataEmp ? this.state.rawDataEmp[this.state.selectedIndex] : ""}
                formType={'user'}
                onClick={this.openUpdateForm.bind(this)}
                onClickRole={() => this.openSearchForm('role')}
                onClickSearch={() => this.openSearchForm('employee')}
                onClickButton={() => this.openChangeForm('change')}
                onClickUpdate={this.handleSubmit.bind(this)}
                roleButton={this.openDeletePopup.bind(this)}
              />
            )} */}

            {this.state.detailVisible && (
              <FormUser
                type={"detail"}
                getTableRole={this.getTableRole.bind(this)}
                className={"app-popup app-popup-show"}
                dataRole={this.state.dtRole[0] === "" ? [] : this.state.dtRole}
                selectedDataUser={this.state.rawData ? this.state.rawData[this.state.selectedIndex] : ""}
                dataEmp={this.state.rawDataEmp ? this.state.rawDataEmp[this.state.selectedIndex] : ""}
                formType={'user'}
                img={this.state.response && this.state.response}
                onClick={this.closeDetailForm.bind(this)}
                user={this.props.auth.user}
              />
            )}

            {this.state.changeVisible && (
              <FormUser
                formType={'change'}
                dataUser={this.state.changeVisible ? this.state.rawData && this.state.rawData[this.state.selectedIndex] : ""}
                classNameChange={"app-popup app-popup-show"}
                onClickChange={this.openChangeForm.bind(this)}
                onClickSave={this.handleChangePassword}
                user={this.props.auth.user} />
            )}

            <FormUser
              formType={'search'}
              classNameSearch={this.state.searchClass}
              onClickSearch={this.openSearchForm}
              onClickSave={this.openSavePopUp}
              searchType={this.state.searchType}
              dataEmployee={this.state.dataTableEmp}
              dataUser={this.state.dataTableRole}
              columnsEmployee={this.columnsEmployee}
              columnsUser={this.columnsUser}
              roleUpdateButton={this.state.type === "create" ? this.addRoleHandler.bind(this) : this.handleUpdate.bind(this)}
              user={this.props.auth.user}
            />

            <PopUp type={'save'} class={this.state.saveClass} onClick={this.openSavePopUp} />
            <PopUp type={'delete'} class={this.state.deleteClass} onClick={() => this.setState({ deleteClass: 'app-popup' })} onClickDelete={this.state.slideUserManagement ? () => this.handleUpdate(this.state.value) : () => this.handleDelete()} />
            <PopUp type={'upload'} class={this.state.uploadClass} onClick={this.openUploadPopUp} file={this.state.file} title={'User - Upload Form'} onChange={this.handleChange} removeChange={this.removeChange} />

          </div>

        </div>
      </SplitPaneSecond>
    )
  }
}

const mapStateToProps = state => {
  return {
    idp: state.idp,
    auth: state.auth
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getUser: obj => dispatch(IdpAction.getUser(obj)),
    getUserName: obj => dispatch(IdpAction.getUserName(obj)),
    authLogout: () => dispatch(AuthAction.authLogout())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(userManagement)