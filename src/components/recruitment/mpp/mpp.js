import React, { Component } from 'react'
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles'
import MUIDataTable from "mui-datatables-bitozen"
import LoadingBar from 'react-top-loading-bar'
import FormMpp from '../../../modules/forms/formMpp/formMpp'
import PopUp from '../../pages/PopUpAlert'
import MasterdataAction from '../../../Redux/MasterdataRedux'
import { connect } from 'react-redux'
import API from '../../../Services/Api'
import * as R from 'ramda'
import M from 'moment'
import ResizeSlider from '../../../modules/resize/Slider'
import SplitPaneSecond from 'react-split-pane'
import { Redirect } from 'react-router-dom'
import AuthAction from '../../../Redux/AuthRedux'
import IdleTimer from 'react-idle-timer'

var ct = require("../../../modules/custom/customTable")
const getMuiTheme = () => createMuiTheme(ct.customTable())
const options = ct.customOptions()

class Mpp extends Component {

  constructor(props) {
    super(props)
    this.state = {
      file: null,
      uploadClass: 'app-popup',
      type: 'create',
      rawData: [],
      dataTable: [],
      selectedIndex: [],
      dataPosition: [],
      mppData: [],
      createVisible: false,
      editVisible: false,
      savePopup: false,
      deletePopup: false,
      value: '',
      fetching: false,
      refreshing: false,
      auth: props.auth,
      allowResize: false,
      defaultSize: 0,
      minSize: 0,
      maxSize: 0,
      timeout: 1000 * 100 * 9,
      isTimedOut: false,
      viewVisible: false,
      mppCount: 0,
      table_limit: 5,
      table_page: 0,
      table_query: "",
    }
    this.idleTimer = null
    this.handleChange = this.handleChange.bind(this)
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

  handleChange(event) {
    this.setState({
      file: URL.createObjectURL(event.target.files[0])
    })
  }

  removeChange = () => {
    this.setState({
      file: null
    })
  }

  openUpload = () => {
    if (this.state.uploadClass === 'app-popup app-popup-show') {
      this.setState({ uploadClass: 'app-popup' })
    } else {
      this.setState({ uploadClass: 'app-popup app-popup-show' })
    }
  }

  openCreate = () => {
    let savePopup = this.state.savePopup ? !this.state.savePopup : false;
    this.clResizePane()
    this.setState({ createVisible: !this.state.createVisible, savePopup })
  }

  openEdit = (selectedIndex) => {
    let savePopup = this.state.savePopup ? !this.state.savePopup : false;
    this.setState({ editVisible: !this.state.editVisible, selectedIndex, savePopup })
  }

  openView = (selectedIndex) => {
    this.setState({ viewVisible: !this.state.viewVisible, selectedIndex })
  }

  openDeletePopup(selectedIndex) {
    this.setState({ deletePopup: !this.state.deletePopup, selectedIndex })
  };

  opResizePane = () => {
    this.setState({
      allowResize: true,
      defaultSize: 370,
      minSize: 370,
      maxSize: 850
    })
  }

  clResizePane = () => {
    this.setState({
      allowResize: false,
      defaultSize: 0,
      minSize: 0,
      maxSize: 0,
      savePopup: false
    })
  }

  opSidePage = (menu, selectedIndex) => (e) => {
    this.setState({
      editVisible: false,
      selectedIndex
    })

    this.opResizePane()

    switch (menu) {
      case 'slide-mpp':
        this.setState({
          editVisible: true,
          selectedIndex,
          mppData: this.state.rawData[selectedIndex]
        })
        break
      case 'slide-mpp-view':
        this.setState({
          viewVisible: true,
          selectedIndex,
          mppData: this.state.rawData[selectedIndex]
        })
        break
      default:
        break
    }
  }

  getDataPosition() {
    API.create('ES').getTplJson(this.state.auth.user.companyID).then(
      (res) => {
        if (res.status === 200) {
          if (res.data.status === 'S') {
            this.setState({ dataPosition: res.data.data })
          }
        } else {
          this.onFinishFetch()
        }
      })
  }

  componentDidMount() {
    if (!R.isNil(this.props.auth.user)) {
      this.getData(this.state.table_page, this.state.table_limit)
      this.getDataPosition(); 
      this.startFetch();  
    }
  }

  getData = (page, limit) => {
      this.props.getMpp({
        "offset": page,
        "limit": limit
      });
    this.getCountPage()
  }

  getCountPage = async () => {
    let res = await API.create('CFG').getCountAllMpp()
    console.log(res.data.data)
    let countActive = res.data.data
    if (!R.isEmpty(this.state.table_query)) {
      let response = await API.create('CFG').getCountMppByPositionName(this.state.table_query)
      console.log(response.data.data)
      if (response.ok) {
        this.setState({ mppCount: response.data.data })
      }
      let body = {
        "limit": this.state.table_limit,
        "offset": this.state.table_page,
        "params": {
            "positionName" : this.state.table_query
        }
      }
      let res = await API.create('CFG').getMppByPositionName(body)
      console.log(res.data.data)
      if (res.ok) {
        if (res.data.data === null) {
          this.setState({ dataTable: [] })
        } else {
          let dataTable = res.data.data.map((value, index) => {
            if (value === null) return ["", "", "", "", "", "", "", "", "-"]
            const { period, position, budget, used, unused, outstanding, mppStatus } = value;
            return [
              index += 1,
              period ? period : "-",
              "OPERATION",
              position ? position.ouName : "-",
              budget,
              used,
              unused,
              outstanding,
              mppStatus.replace(/_/g, " "),
              mppStatus
            ]
          })
          this.setState({
            rawData: res.data.data,
            dataTable
          })
        }
      }
    } else {
      this.setState({ mppCount: countActive })
    }
  }

  componentWillReceiveProps(newProps) {
    if (!newProps.masterdata.fetching && !R.isNil(newProps.masterdata.mpp)) {
      this.onFinishFetch()
      let dataTable = newProps.masterdata.mpp.map((value, index) => {
        if (value === null) return ["", "", "", "", "", "", "", "", "-"]
        const { period, position, budget, used, unused, outstanding, mppStatus } = value;
        return [
          index += 1,
          period ? period : "-",
          "OPERATION",
          position ? position.ouName : "-",
          budget,
          used,
          unused,
          outstanding,
          mppStatus.replace(/_/g, " "),
          mppStatus
        ]
      })
      this.setState({
        rawData: newProps.masterdata.mpp,
        dataTable
      })
    }

    this.setState({
      fetching: newProps.masterdata.fetching,
      refreshing: newProps.masterdata.fetching
    });
  }

  postMPP(payload) {
    payload = {
      ...payload,
      mppID: "MPP-" + M(),
      mppName: "MPP-NAME",
      budget: Number(payload.budget),
      position: payload.position.ouID,
      esid: this.state.auth.user.companyID,
      mppStatus: "INITIATE",
      mppCreationalDTO: {
        createdBy: this.state.auth.user.userID,
        createdDate: M().format("DD-MM-YYYY HH:mm:ss"),
        modifiedBy: null,
        modifiedDate: null
      }
    }

    API.create('CFG').postMpp(payload).then(
      (res) => {
        if (res.status === 200) {
          if (res.data.status === 'S') {
            this.setState({ savePopup: !this.state.savePopup })
            this.props.getMpp({
              "offset": 0,
              "limit": 500
            })
          } else {
            alert('Failed: ', res.data.message)
          }
        }
      }
    )
  }

  submitMpp(payload) {
    payload = {
      "taskID": "",
      "senderUserID": this.state.auth.user.userID,
      "senderEmpID": this.state.auth.user.employeeID,
      "senderNotes": "",
      "senderBPMStatus": "INITIATE",
      "data": {
        "mppID": payload.mppID,
        "mppName": payload.mppName,
        "budget": Number(payload.budget),
        "period": payload.period,
        "position": payload.position.ouID,
        "esid": payload.es.esID,
        "mppStatus": payload.mppStatus,
        "mppCreationalDTO": payload.mppCreationalDTO
      }
    }
    alert(JSON.stringify(payload))
    API.create('BPM').submitMpp(payload).then(
      (res) => {
        if (res.status === 200) {
          if (res.data.status === 'S') {
            this.setState({ savePopup: !this.state.savePopup })
            this.props.getMpp({
              "offset": 0,
              "limit": 500
            })
          } else {
            alert('Failed: ', res.data.message)
          }
        }
      }
    )
  }

  updateMPP(payload) {
    payload = {
      mppID: payload.mppID,
      mppName: payload.mppName,
      budget: Number(payload.budget),
      period: payload.period,
      position: payload.position.ouID,
      esid: payload.es.esID,
      mppStatus: payload.mppStatus,
      mppCreationalDTO: {
        createdBy: this.state.auth.user.userID,
        createdDate: payload.mppCreationalDTO.createdDate,
        modifiedBy: this.state.auth.user.userID,
        modifiedDate: M().format("DD-MM-YYYY HH:mm:ss")
      }
    }
    alert(JSON.stringify(payload))
    API.create('CFG').updateMpp(payload).then(
      (res) => {
        if (res.status === 200) {
          if (res.data.status === 'S') {
            this.setState({ savePopup: !this.state.savePopup })
            this.props.getMpp({
              "offset": 0,
              "limit": 500
            })
          } else {
            alert('Failed: ', res.data.message)
          }
        }
      }
    )
  }

  deleteDataMPP() {
    let { rawData, selectedIndex } = this.state
    let payload = {
      referenceID: rawData[selectedIndex].mppID
    }
    API.create('CFG').deleteMpp(payload).then(
      (res) => {
        if (res.status === 200) {
          if (res.data.status === 'S') {
            this.setState({ deletePopup: !this.state.deletePopup })
            this.clResizePane()
            this.props.getMpp({
              "offset": 0,
              "limit": 500
            })
          } else {
            alert('Failed: ', res.data.message)
          }

        }
      }
    )
  }


  startFetch = () => {
    this.LoadingBar.continousStart()
  }

  onFinishFetch = () => {
    if (typeof this.LoadingBar === "object") this.LoadingBar.complete()
  }

  columns = [
    "No",
    "Periode",
    "Department",
    "Position",
    "Budget",
    "Used",
    "Unused",
    "Outstanding",
    {
      name: "Status",
      options: {
        customBodyRender: val => {
          return (
            <div>
              <i
                className="fa fa-lw fa-circle"
                style={{
                  color:
                    val === "APPROVE" ? "brown" : val === "INITIATE" ? "orange" : val === "REJECT" ? "#424242" : "grey",
                  marginRight: 10,
                  padding: "5px"
                }}
              />
              {val}
            </div>
          );
        }
      }
    },
    {
      name: "Action",
      options: {
        customBodyRender: (val, tableMeta) => {
          return (
            <div className="grid grid-3x">
              <div className="column-1">
                {val === "INITIATE" ?
                  <button
                    className="btnAct"
                    onClick={this.opSidePage("slide-mpp", tableMeta.rowIndex)}>
                    <i className="fa fa-pencil-alt" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }} />
                  </button> : null}
              </div>
              <div className="column-2">
                {val === "INITIATE" ?
                  <button
                    className="btnAct"
                    onClick={() => this.openDeletePopup(tableMeta.rowIndex)}>
                    <i className="fa fa-trash-alt" style={{ backgroundColor: 'transparent', color: 'red', fontSize: 20 }} />
                  </button> : null}
              </div>
              <div className={val === "INITIATE" ? "column-3" : "column-1"}>
                <button
                  className="btnAct"
                  onClick={this.opSidePage("slide-mpp-view", tableMeta.rowIndex)}>
                  <i className="fa fa-ellipsis-v" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }} />
                </button>
              </div>
            </div>
          )
        }
      }
    }
  ]

  render() {
    if (R.isNil(this.props.auth.user)) return <Redirect to={{ pathname: "/" }} ></Redirect>
    let { dataPosition, dataTable, mppCount, table_query } = this.state 
    let tableOptions = {
      ...options,
      serverSide: true,
      count: mppCount,
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
                <div className='a-s-p-mid no-header'>
                  <LoadingBar onRef={ref => (this.LoadingBar = ref)} />
                  <div>
                    {this.state.createVisible && (
                      <FormMpp
                        type={"create"}
                        dataPosition={dataPosition}
                        onClickSave={this.postMPP.bind(this)}
                        onClickClose={this.openCreate}
                      />
                    )}
                    <div className="padding-10px">
                      <div className="margin-bottom-10px grid grid-2x">
                        <div className="col-1">
                          <div className="txt-site txt-18 txt-bold txt-main padding-top-5px"></div>
                        </div>
                        <div className="col-2 content-right">
                          <button type="button"
                            className="btn btn-circle background-blue"
                            style={{ marginRight: 5 }}
                            onClick={this.openCreate}>
                            <i className='fa fa-1x fa-plus'></i>
                          </button>
                          <button type="button"
                            className="btn btn-circle background-blue"
                            onClick={this.openUpload}>
                            <i className='fa fa-1x fa-upload'></i>
                          </button>
                        </div>
                      </div>
                      <div>
                        <MuiThemeProvider theme={getMuiTheme()}>
                          <MUIDataTable
                            key={mppCount}
                            title='Man Power Planning'
                            subtitle={'lorem ipsum dolor'}
                            data={dataTable}
                            columns={this.columns}
                            options={tableOptions}
                          />
                        </MuiThemeProvider>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              side={(
                <div className="a-s-p-side">
                  {this.state.editVisible && (
                    <FormMpp
                      type={"update"}
                      mppData={this.state.mppData}
                      dataPosition={dataPosition}
                      onClickSave={this.updateMPP.bind(this)}
                      onClickProcess={this.submitMpp.bind(this)}
                      onClickClose={this.clResizePane}
                    />
                  )}
                  {this.state.viewVisible && (
                    <FormMpp
                      type={"view"}
                      mppData={this.state.mppData}
                      dataPosition={dataPosition}
                      onClickClose={this.clResizePane}
                    />
                  )}
                </div>
              )}
            />

            {this.state.savePopup && (
              <PopUp type={'save'} class={"app-popup app-popup-show"} onClick={this.state.createVisible ? this.openCreate.bind(this) : this.clResizePane.bind(this)} />
            )}

            {this.state.deletePopup && (
              <PopUp type={'delete'} class={"app-popup app-popup-show"} onClick={this.openDeletePopup.bind(this)} onClickDelete={this.deleteDataMPP.bind(this)} />
            )}

            <PopUp type={'upload'} class={this.state.uploadClass} onClick={this.openUpload} file={this.state.file} title={'Man Power Planning - Upload Form'} onChange={this.handleChange} removeChange={this.removeChange} />
          </div>
        </div>
      </SplitPaneSecond>
    )
  }

}

const mapStateToProps = state => {
  return {
    auth: state.auth,
    masterdata: state.masterdata
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getMpp: obj => dispatch(MasterdataAction.getMpp(obj)),
    authLogout: () => dispatch(AuthAction.authLogout())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Mpp)