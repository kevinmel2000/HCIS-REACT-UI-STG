import React, { Component } from "react";
import LoadingBar from 'react-top-loading-bar';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles'
import MUIDataTable from "mui-datatables-bitozen"
import FormRoleManagement from '../../../modules/forms/FormRoleManagement'
import PopUp from '../../pages/PopUpAlert'
import IdpAction from '../../../Redux/IdpRedux'
import { connect } from 'react-redux';
import API from '../../../Services/Api'
import * as R from 'ramda';
import ResizeSlider from '../../../modules/resize/Slider'
import SplitPaneSecond from 'react-split-pane'
import { Redirect } from 'react-router-dom'
import AuthAction from '../../../Redux/AuthRedux'
import IdleTimer from 'react-idle-timer'

var ct = require("../../../modules/custom/customTable")
const getMuiTheme = () => createMuiTheme(ct.customTable());
const options = ct.customOptions()
const currentDate = new Date().getDate();

class RoleManagement extends Component {
  constructor() {
    super()
    this.state = {
      dataTableRole: [],
      createVisible: false,
      createPopUpVisible: false,
      deletePopUpVisible: false,
      editVisible: false,
      refreshing: false,
      fetching: false,
      allowResize: false,
      defaultSize: 0,
      minSize: 0,
      maxSize: 0,
      timeout: 1000 * 100 * 9,
      isTimedOut: false,
      roleCount: 0,
      table_limit: 5,
      table_page: 0,
      table_query: "",
    }
    this.idleTimer = null
    this.handleDelete = this.handleDelete.bind(this)
  }

  columns = [
    "No",
    "Role Name",
    "Status",
    {
      name: "Action",
      options: {
        customBodyRender: (val, tableMeta) => {
          return (
            <div>
              <button
                className="btnAct"
                style={{ marginRight: 15, backgroundColor: 'transparent' }}
                onClick={this.opSidePage("slide-role", tableMeta.rowIndex)}>
                <i className="fa fa-lw fa-pencil-alt" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }} />
              </button>
              <button
                className="btnAct"
                style={{ marginRight: 15, backgroundColor: 'transparent' }}
                onClick={() => this.openDeletePopup(tableMeta.rowIndex)}>
                <i className="fa fa-lw fa-trash-alt" style={{ backgroundColor: 'transparent', color: 'red', fontSize: 20 }} />
              </button>
            </div>
          )
        }
      }
    }
  ]

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

  openCloseCreate() {
    this.clResizePane()
    let createPopUpVisible = this.state.createPopUpVisible ? !this.state.createPopUpVisible : false;
    this.setState({ createVisible: !this.state.createVisible, createPopUpVisible })
  }

  openCloseEdit(selectedIndex) {
    let createPopUpVisible = this.state.createPopUpVisible ? !this.state.createPopUpVisible : false;
    this.setState({ editVisible: !this.state.editVisible, selectedIndex, createPopUpVisible })
  }

  openDeletePopup(selectedIndex) {
    this.setState({ deletePopUpVisible: !this.state.deletePopUpVisible, selectedIndex })
  }

  opResizePane = () => {
    this.setState({
      allowResize: true,
      defaultSize: 370,
      minSize: 370,
      maxSize: 870
    })
  }

  opSidePage = (menu, index) => (e) => {
    e.preventDefault()
    this.setState({
      editVisible: false,
    })

    this.opResizePane()

    switch (menu) {
      case 'slide-role':
        this.setState({
          editVisible: true,
          selectedIndex: index
        })
        break
      default:
        break
    }
  }

  clResizePane = () => {
    this.setState({
      allowResize: false,
      defaultSize: 0,
      minSize: 0,
      maxSize: 0
    })
  }

  onFinishFetch = () => {
    if (typeof this.LoadingBar === "object") this.LoadingBar.complete()
  }

  handleSubmit(value) {
    let payload = Object.assign({}, value);
    this.saveDataRole(payload);
  }

  handleUpdate(value) {
    let payload = Object.assign({}, value);
    this.updateDataRole(payload);
  }

  handleDelete() {
    this.deleteDataRole();
  }

  startFetch = () => {
    this.LoadingBar.continousStart()
  }

  componentDidMount() {
    if (!R.isNil(this.props.auth.user)) {
      this.startFetch();
      this.props.getRole({
        "params": {
          "roleStatus": "ACTIVE"
        },
        "offset": this.state.table_page,
        "limit": this.state.table_limit
      });
    }
    this.getCountPage()
  }

  getCountPage = async () => {
    let body = {
      params: {
        roleName: this.state.table_query
      },
      offset: this.state.table_page,
      limit: this.state.table_limit
    }
    let res = await API.create('IDP').getCountRoleByStatus('ACTIVE')
    let countActive = res.data.data
    if (!R.isEmpty(this.state.table_query)) {
      let response = await API.create('IDP').getRoleByName(body)
      if (response.data.data === null) {
        this.setState({ dataTableRole: [] })
      } else {
        let dataTableRole = response.data.data.map((value, index) => {
          const { roleName, roleStatus } = value;
          return [
            index += 1,
            roleName,
            roleStatus
          ]
        })
        this.setState({
          dataTableRole,
          rawDataRole: response.data.data,
        })
      }
    } else {
      this.setState({ roleCount: countActive })
    }
  }

  getData() {
    this.props.getRole({
      "params": {
        "roleStatus": "ACTIVE"
      },
      "offset": this.state.table_page,
      "limit": this.state.table_limit
    });
    this.getCountPage()
  }

  componentWillReceiveProps(newProps) {
    if (!newProps.idp.fetching && !R.isNil(newProps.idp.role)) {
      this.onFinishFetch()
      let dataTableRole = newProps.idp.role.map((value, index) => {
        const { roleName, roleStatus } = value;
        return [
          index += 1,
          roleName,
          roleStatus
        ]
      })
      this.setState({
        dataTableRole,
        rawDataRole: newProps.idp.role,
      })
    }

    this.setState({
      fetching: newProps.idp.fetching,
      refreshing: newProps.idp.fetching
    });
  }

  async saveDataRole(payloadRole) {
    let isExist = R.findIndex(R.propEq('roleName', payloadRole.roleName))(this.state.rawDataRole)
    if (isExist < 0) {
      let response = await API.create('IDP').postRole(payloadRole)
      if (response.ok && response.data.status === 'S') {
        this.setState({ createPopUpVisible: true })
        this.clResizePane()
        this.props.getRole({
          "params": {
            "roleStatus": "ACTIVE"
          },
          "offset": 0,
          "limit": 5
        });
      } else {
        alert("Failed: " + response.data.message)
      }
    } else alert("Failed: Role Name Exist")
  }

  async updateDataRole(payloadRole) {
    let isExist = R.findIndex(R.propEq('roleName', payloadRole.roleName))(this.state.rawDataRole)
    if (isExist >= 0) {
      let isIdExist = R.findIndex(R.propEq('roleID', payloadRole.roleID))([this.state.rawDataRole[isExist]])
      if (isIdExist < 0) {
        alert("Failed: Role Name Exist")
      } else {
        let response = await API.create('IDP').updateRole(payloadRole)
        if (response.ok && response.data.status === 'S') {
          this.setState({ createPopUpVisible: true })
          this.clResizePane()
          this.props.getRole({
            "params": {
              "roleStatus": "ACTIVE"
            },
            "offset": 0,
            "limit": 5
          });
        } else {
          alert("Failed: " + response.data.message)
        }
      }
    } else {
      let response = await API.create('IDP').updateRole(payloadRole)
      if (response.ok) {
        this.setState({ createPopUpVisible: true })
        this.clResizePane()
        this.props.getRole({
          "params": {
            "roleStatus": "ACTIVE"
          },
          "offset": 0,
          "limit": 5
        });
      }
    }
  }

  deleteDataRole() {
    let payload = {
      referenceID: this.state.rawDataRole[this.state.selectedIndex].roleID,
      requestBy: "SYSTEM",
      requestDate: currentDate
    }
    API.create('IDP').deleteRole(payload).then(
      (res) => {
        if (res.status === 200) {
          if (res.data.status === 'S') {
            console.log('Role :', res.data);
            this.clResizePane()
            this.setState({ deletePopUpVisible: !this.state.deletePopUpVisible })
            this.props.getRole({
              "params": {
                "roleStatus": "ACTIVE"
              },
              "offset": 0,
              "limit": 5
            });
          }
        } else {
          console.log(res)
        }
      })
  }

  render() {
    if (R.isNil(this.props.auth.user)) return <Redirect to={{ pathname: "/" }} ></Redirect>
    let { roleCount, table_query } = this.state
    let tableOptions = {
      ...options,
      serverSide: true,
      count: roleCount,
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
    let { rawDataRole, selectedIndex } = this.state
    return (
      <SplitPaneSecond
        split="vertical"
        defaultSize={0}
        minSize={0}
        maxSize={0}
        primary="first"
        className="main-slider"
        style={{ height: 'calc(100vh - 50px)' }}>
        <div className="col-1 backgorund-white"></div>
        <div className="col-2 background-white">
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
                <div>
                  <LoadingBar onRef={ref => (this.LoadingBar = ref)} />
                  <div className="a-s-p-place a-s-p-content active">
                    <div className="a-s-p-top">
                      <div className="col-2 content-right">
                        <button
                          type="button"
                          className="btn btn-circle background-blue"
                          style={{ marginRight: 10 }}
                          onClick={this.openCloseCreate.bind(this)}
                        >
                          <i className="fa fa-1x fa-plus"></i>
                        </button>
                      </div>
                    </div>
                    <div className="a-s-p-mid">
                      <div className="padding-5px">
                        <MuiThemeProvider theme={getMuiTheme()}>
                          <MUIDataTable
                            key={roleCount}
                            title='Role Management'
                            subtitle={"lorem ipsum dolor"}
                            data={this.state.dataTableRole}
                            columns={this.columns}
                            options={tableOptions}
                          />
                        </MuiThemeProvider>
                      </div>
                      {this.state.createVisible && (
                        <FormRoleManagement
                          onSave={this.handleSubmit.bind(this)}
                          label="Role - Create Form"
                          onClose={this.openCloseCreate.bind(this)}
                          user={this.props.auth.user}
                        />
                      )}
                    </div>
                  </div>
                </div>
              )}
              side={(
                <div className="a-s-p-side">
                  {this.state.editVisible && (
                    <FormRoleManagement
                      onSave={this.handleUpdate.bind(this)}
                      type={"update"}
                      label="Role - Edit Form"
                      getDataRole={() => this.props.getRole({
                        "params": {
                          "roleStatus": "ACTIVE"
                        },
                        "offset": 0,
                        "limit": 100
                      })}
                      closeSlide={this.clResizePane.bind(this)}
                      payloadRole={rawDataRole[selectedIndex]}
                      user={this.props.auth.user}
                    />
                  )}
                </div>
              )}
            />
            {this.state.createPopUpVisible && (
              <PopUp type={'save'} class={"app-popup app-popup-show"} onClick={this.state.createVisible ? this.openCloseCreate.bind(this) : this.openCloseEdit.bind(this)} />
            )}

            {this.state.deletePopUpVisible && (
              <PopUp type={'delete'} class={"app-popup app-popup-show"} onClick={this.openDeletePopup.bind(this)} onClickDelete={this.handleDelete} />
            )}
          </div>
        </div>
      </SplitPaneSecond>
    );
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
    getRole: obj => dispatch(IdpAction.getRole(obj)),
    authLogout: () => dispatch(AuthAction.authLogout())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(RoleManagement) 