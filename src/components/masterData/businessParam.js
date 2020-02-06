import React, { Component } from "react";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables-bitozen";
import LoadingBar from "react-top-loading-bar";
import FormBusinessParam from "../../modules/forms/formMasterData/formBusinessParam";
import PopUp from "../pages/PopUpAlert";
import API from "../../Services/Api"
import BizparAction from '../../Redux/BizparRedux';
import { connect } from 'react-redux';
import * as R from 'ramda';
import M from 'moment'
import ResizeSlider from '../../modules/resize/Slider'
import SlideBizpar from "../../modules/forms/formMasterData/slideBizpar";
import SplitPaneSecond from 'react-split-pane'
import { Redirect } from 'react-router-dom'
import AuthAction from '../../Redux/AuthRedux'
import IdleTimer from 'react-idle-timer'

var ct = require("../../modules/custom/customTable");
const getMuiTheme = () => createMuiTheme(ct.customTable());
const options = ct.customOptions();
const clSlidePage = 'a-s-p-main'

class Bizpar extends Component {
  constructor() {
    super();
    this.state = {
      file: null,
      uploadClass: "app-popup",
      rawData: [],
      dataTable: [],
      dataBizpar: [],
      selectedIndex: [],
      createVisible: false,
      editVisible: false,
      viewVisible: false,
      savePopup: false,
      deletePopup: false,
      fetching: false,
      refreshing: false,
      value: '',
      slideBizpar: false,
      bizparCount: 0,
      table_limit: 5,
      table_page: 0,
      table_query: "",
      // important for resize pane
      allowResize: false,
      defaultSize: 0,
      minSize: 0,
      maxSize: 0,
      classAppSlidePage: 'app-side-page',
      classAppSlidePageMain: clSlidePage,
      timeout: 1000 * 100 * 9,
      isTimedOut: false
    };
    this.idleTimer = null
    this.handleChange = this.handleChange.bind(this);
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
      slideBizpar: false,

    })

    this.opResizePane()

    switch (menu) {
      case 'slide-menu-1':
        this.setState({
          slideBizpar: true,
          selectedIndex,
          slideType: 'update'
        })
        break
      case 'slide-menu-view':
        this.setState({
          slideBizpar: true,
          selectedIndex,
          slideType: 'view'
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
      slideBizpar: false,
      allowResize: false,
      defaultSize: 0,
      minSize: 0,
      maxSize: 0
    })
  }


  openCloseCreate() {
    this.clResizePane()
    let savePopup = this.state.savePopup ? !this.state.savePopup : false;
    this.setState({ createVisible: !this.state.createVisible, savePopup })
  }

  openCloseEdit(selectedIndex) {
    let savePopup = this.state.savePopup ? !this.state.savePopup : false;
    this.setState({ editVisible: !this.state.editVisible, savePopup, selectedIndex })
  }

  openCloseView(selectedIndex) {
    this.clResizePane()
    this.setState({ viewVisible: !this.state.viewVisible, selectedIndex })
  }

  postBizpar(payload) {
    API.create('BIZPAR').postBizpar(payload).then(
      (res) => {
        if (res.status === 200) {
          if (res.data.status === 'S') {
            this.setState({ savePopup: !this.state.savePopup })
            this.getData(this.state.table_page, this.state.table_limit)
          } else {
            alert('Failed: ' + res.data.message)
          }
        }
      }
    )
  }

  updateBizpar(payload) {
    API.create('BIZPAR').updateBizpar(payload).then(
      (res) => {
        if (res.status === 200) {
          if (res.data.status === 'S') {
            this.setState({ dataTable: [], savePopup: !this.state.savePopup })
            this.clResizePane()
            this.getData(this.state.table_page, this.state.table_limit)
          } else {
            alert('Failed: ' + res.data.message)
          }
        }
      }
    )
  }

  deleteBizpar() {
    let payload = {
      "referenceID": this.state.rawData[this.state.selectedIndex].bizparKey,
      "requestBy": "SYSTEM",
      "requestDate": M().format("DD-MM-YYYY HH:mm:ss")
    }
    API.create('BIZPAR').deleteBizpar(payload).then(
      (res) => {
        if (res.status === 200) {
          if (res.data.status === 'S') {
            this.setState({ deletePopup: !this.state.deletePopup })
            this.getData(this.state.table_page, this.state.table_limit)
          } else {
            alert(res.data.message)
          }
        } else {
        }
      })
  }

  handleChange(event) {
    this.setState({
      file: URL.createObjectURL(event.target.files[0])
    });
  }

  removeChange = () => {
    this.setState({
      file: null
    });
  };

  openDeletePopup(selectedIndex) {
    this.clResizePane()
    this.setState({ deletePopup: !this.state.deletePopup, selectedIndex })
  };

  getBizparCat(){
    let array = []
    API.create('BIZPAR').getAllBizpar().then((res) => {
        if (res.data.code === "201") {
            res.data.data.map((item, index) => {
                array.push({
                    bizparKey: item,
                    bizparValue: item,
                    bizparStatus: 'ACTIVE'
                })
            })
            this.setState({ bizparDataCat : array })
        }
    })
}

  getData = (page, limit) => {
    this.props.getBizpar({
      "params": {
        "bizparValue": this.state.table_query
      },
      "offset": page,
      "limit": limit
    });
    this.getCountPage()
  }

  componentDidMount() {
    if (!R.isNil(this.props.auth.user)) {
      this.startFetch();
      this.getData(this.state.table_page, this.state.table_limit)
      this.getBizparCat()
    }
  }

  getCountPage = async () => {
    let res = await API.create('BIZPAR').getCountBizparByStatus('ACTIVE')
    let countActive = res.data.data
    if (!R.isEmpty(this.state.table_query)) {
      let response = await API.create('BIZPAR').getCountBizparByValue(this.state.table_query)
      if (response.ok) {
        this.setState({ bizparCount: response.data.data })
      }
    } else {
      this.setState({ bizparCount: countActive })
    }
    let payload = {
      "params": {
        "bizparStatus": "ACTIVE"
      },
      "offset": 0,
      "limit": countActive
    }
    let response = await API.create('BIZPAR').getBizparByStatus(payload)
    if (response.data && !R.isEmpty(response.data.data)) {
      let bizpar = response.data.data.map((value, index) => {
        const { bizparCategory } = value
        return {
          bizparKey: bizparCategory,
          bizparValue: bizparCategory.replace(/_/g, " ")
        }
      })

      const dataBizpar = [...new Map(bizpar.map(o => [o.bizparKey, o])).values()]

      this.setState({ dataBizpar })
    }
  }

  componentWillReceiveProps(newProps) {
    if (!newProps.bizpar.fetching && !R.isNil(newProps.bizpar.bizpar)) {
      this.onFinishFetch()
      let dataTable = newProps.bizpar.bizpar.map((value) => {
        const { bizparCategory, bizparKey, bizparValue, bizparStatus } = value;
        return [
          bizparCategory,
          bizparKey,
          bizparValue,
          bizparStatus
        ]
      })

      this.setState({
        rawData: newProps.bizpar.bizpar,
        dataTable
      })
    }
    this.setState({
      fetching: newProps.bizpar.fetching,
      refreshing: newProps.bizpar.fetching
    });
  }

  startFetch = () => {
    this.LoadingBar.continousStart();
  };

  onFinishFetch = () => {
    if (typeof this.LoadingBar === "object") this.LoadingBar.complete();
  };

  columns = [
    "Category",
    "Key",
    "Value",
    {
      name: "Status",
      options: {
        customBodyRender: val => {
          return (
            <div>
              {val === "ACTIVE" ? (
                <div>
                  <i
                    className="fa fa-lw fa-circle"
                    style={{ color: "green", marginRight: 10, padding: "5px" }}
                  />
                  {val}
                </div>
              ) : (
                  <div>
                    <i
                      className="fa fa-lw fa-circle"
                      style={{ color: "red", marginRight: 10, padding: "5px", }}
                    />
                    {val}
                  </div>
                )}
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
            <div style={{ width: '115px' }}>
              <button
                className="btnAct"
                style={{ marginRight: 15, backgroundColor: 'transparent' }}
                onClick={this.opSidePage('slide-menu-1', tableMeta.rowIndex)}
              >
                <i className="fa fa-lw fa-pencil-alt" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }} />
              </button>
              <button
                className="btnAct"
                style={{ marginRight: 15, backgroundColor: 'transparent' }}
                onClick={() => this.openDeletePopup(tableMeta.rowIndex)}
              >
                <i className="fa fa-lw fa-trash-alt" style={{ backgroundColor: 'transparent', color: 'red', fontSize: 20 }} />
              </button>
              <button
                className="btnAct"
                style={{ marginRight: 15, backgroundColor: 'transparent' }}
                onClick={this.opSidePage('slide-menu-view', tableMeta.rowIndex)}
              >
                <i className="fa fa-lw fa-ellipsis-v" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }} />
              </button>
            </div>
          );
        }
      }
    }
  ];

  render() {
    if (R.isNil(this.props.auth.user)) return <Redirect to={{ pathname: "/" }} ></Redirect>
    let { bizparCount, table_query } = this.state
    let tableOptions = {
      ...options,
      serverSide: true,
      count: bizparCount,
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
                <div className='a-s-p-mid no-header'>
                  <LoadingBar onRef={ref => (this.LoadingBar = ref)} />

                  <div className="padding-10px">
                    <div className="margin-bottom-10px grid grid-2x">
                      <div className="col-1">
                        <div className="txt-site txt-18 txt-bold txt-main padding-top-5px">
                          {/* Business Parameter */}
                        </div>
                      </div>
                      <div className="col-2 content-right">
                        <button
                          type="button"
                          className="btn btn-circle background-blue"
                          style={{ marginRight: 5 }}
                          onClick={this.openCloseCreate.bind(this)}
                        >
                          <i className="fa fa-1x fa-plus" />
                        </button>
                        <button
                          type="button"
                          className="btn btn-circle background-blue"
                          onClick={this.openUpload}
                        >
                          <i className="fa fa-1x fa-upload" />
                        </button>
                      </div>
                    </div>
                    <MuiThemeProvider theme={getMuiTheme()}>
                      <MUIDataTable
                        key={bizparCount}
                        title={' Business Parameter'}
                        subtitle={"lorem ipsum dolor"}
                        data={this.state.dataTable}
                        columns={this.columns}
                        options={tableOptions}
                      />
                    </MuiThemeProvider>
                  </div>

                  {this.state.createVisible && (
                    <FormBusinessParam
                      type={"create"}
                      dataBizpar={this.state.bizparDataCat}
                      bizpar={this.state.rawData}
                      onClickSave={(payload) => this.postBizpar(payload)}
                      onClickClose={this.openCloseCreate.bind(this)}
                      user={this.props.auth.user}
                    />
                  )}

                  {/* {this.state.editVisible && (
                <FormBusinessParam
                  type={"update"}
                  dataBizpar={this.state.dataBizpar}
                  bizpar={this.state.rawData}
                  bizparData={this.state.rawData[this.state.selectedIndex]}
                  onClickSave={(payload) => this.updateBizpar(payload)}
                  onClickClose={this.openCloseEdit.bind(this)}
                />
              )} */}

                  {this.state.viewVisible && (
                    <FormBusinessParam
                      type={"view"}
                      dataBizpar={this.state.bizparDataCat}
                      bizpar={this.state.rawData}
                      bizparData={this.state.rawData[this.state.selectedIndex]}
                      onClickClose={this.openCloseView.bind(this)}
                      user={this.props.auth.user}
                    />
                  )}

                  {this.state.savePopup && (
                    <PopUp
                      type={"save"}
                      class={"app-popup app-popup-show"}
                      onClick={this.state.createVisible ? this.openCloseCreate.bind(this) : () => this.setState({ savePopup: false })}
                    />
                  )}

                  {this.state.deletePopup && (
                    <PopUp
                      type={"delete"}
                      class={"app-popup app-popup-show"}
                      onClick={this.openDeletePopup.bind(this)}
                      onClickDelete={this.deleteBizpar.bind(this)}
                    />
                  )}

                  <PopUp
                    type={"upload"}
                    class={this.state.uploadClass}
                    onClick={this.openUpload}
                    file={this.state.file}
                    title={"Upload Form"}
                    onChange={this.handleChange}
                    removeChange={this.removeChange}
                  />
                </div>
              )}
              side={(
                <div className="a-s-p-side">
                  {/* edit */}
                  {this.state.slideBizpar && (
                    <SlideBizpar
                      type={this.state.slideType}
                      dataBizpar={this.state.bizparDataCat}
                      bizpar={this.state.rawData}
                      bizparData={this.state.rawData[this.state.selectedIndex]}
                      onClickSave={(payload) => this.updateBizpar(payload)}
                      closeSlide={this.clResizePane}
                      user={this.props.auth.user}
                    />

                  )}
                </div>
              )}
            >
            </ResizeSlider>
          </div>

        </div>
      </SplitPaneSecond>
    );
  }
}

// export default Pages;
const mapStateToProps = state => {
  return {
    bizpar: state.bizpar,
    auth: state.auth
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getBizpar: obj => dispatch(BizparAction.getBizpar(obj)),
    authLogout: () => dispatch(AuthAction.authLogout())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Bizpar);

