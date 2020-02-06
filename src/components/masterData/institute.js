import React, { Component } from "react";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables-bitozen";
import LoadingBar from "react-top-loading-bar";
import FormInstitute from "../../modules/forms/formMasterData/formInstitute";
import PopUp from "../pages/PopUpAlert";
import API from "../../Services/Api";
import MasterdataAction from '../../Redux/MasterdataRedux';
import { connect } from 'react-redux';
import M from 'moment';
import ResizeSlider from '../../modules/resize/Slider'
import SlideInstitute from "../../modules/forms/formMasterData/slideInstitute";
import SplitPaneSecond from 'react-split-pane'
import { Redirect } from 'react-router-dom'
import * as R from 'ramda'
import AuthAction from '../../Redux/AuthRedux'
import IdleTimer from 'react-idle-timer'

var ct = require("../../modules/custom/customTable");
const clSlidePage = 'a-s-p-main'
const getMuiTheme = () => createMuiTheme(ct.customTable());

const options = ct.customOptions();

class Institute extends Component {
  constructor() {
    super();
    this.state = {
      file: null,
      createVisible: false,
      editVisible: false,
      detailVisible: false,
      savePopUpVisible: false,
      rawData: [],
      dataTableIns: [],
      selectedIndex: [],
      fetching: false,
      refreshing: false,
      value: '',
      classAppSlidePage: 'app-side-page',
      classAppSlidePageMain: clSlidePage,
      slideIns: false,
      // important for resize pane
      allowResize: false,
      defaultSize: 0,
      minSize: 0,
      maxSize: 0,
      timeout: 1000 * 100 * 9,
      isTimedOut: false,
      instituteCount: 0,
      table_limit: 5,
      table_page: 0,
      table_query: "",
    };
    this.idleTimer = null
    this.handleDelete = this.handleDelete.bind(this);
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
      slideIns: false,

    })

    this.opResizePane()

    switch (menu) {
      case 'slide-menu-1':
        this.setState({
          slideIns: true,
          selectedIndex,
          slideType: 'update'
        })
        break
      case 'slide-menu-view':
        this.setState({
          slideIns: true,
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
      slideIns: false,
      allowResize: false,
      defaultSize: 0,
      minSize: 0,
      maxSize: 0
    })
  }

  handleSubmit = async (data) => {
    let payload = {
      ...data,
      instituteCreationalDTO: {
        ...data.instituteCreationalDTO,
        createdDate: M().format("DD-MM-YYYY HH:mm:ss")
      }
    }
    console.log(JSON.stringify(payload))

    let response = await API.create('MASTERDATA').postInstitute(payload)
    if (response.ok && response.data.status === 'S') {
      this.openSavePopUp()
    } else {
      if (response.data && response.data.message) alert(response.data.message)
    }
  }

  handleUpdate = async (data) => {
    let payload = {
      ...data,
      instituteCreationalDTO: {
        ...data.instituteCreationalDTO,
        createdDate: M().format("DD-MM-YYYY HH:mm:ss")
      }
    }
    let response = await API.create('MASTERDATA').updateInstitute(payload)
    if (response.ok && response.data.status === 'S') {
      this.openSavePopUp()
    } else {
      if (response.data && response.data.message) alert(response.data.message)
    }
  }

  handlePopUp = () => {
    this.getDataInstitute()
    this.setState({
      savePopUpVisible: false,
      createVisible: false,
      editVisible: false
    })
  }

  getDataInstitute() {
    this.props.getInstitute({
      "params": {
        "instituteStatus": "ACTIVE"
      },
      "offset": this.state.table_page,
      "limit": this.state.table_limit
    });
    this.getCountPage()
  }

  handleDelete = async () => {
    let payload = {
      referenceID: this.state.rawData[this.state.selectedIndex].instituteID,
      requestBy: "DELETE-TEST",
      requestDate: M().format("DD-MM-YYYY HH:mm:ss")
    }
    let response = await API.create('MASTERDATA').deleteInstitute(payload)
    if (response.ok && response.data.status === 'S') {
      this.setState({ deletePopUpVisible: false })
      this.props.getInstitute({
        "params": {
          "instituteStatus": "ACTIVE"
        },
        "offset": 0,
        "limit": 5
      });
    } else {
      if (response.data && response.data.message) alert(response.data.message)
    }
  }

  openCreateForm = () => {
    this.clResizePane()
    this.setState({ createVisible: !this.state.createVisible })
  };

  openEditForm = (index = null) => {
    this.setState({ editVisible: !this.state.editVisible, selectedIndex: index })
  };

  openDetailForm = (index) => {
    this.clResizePane()
    this.setState({ detailVisible: !this.state.detailVisible, selectedIndex: index })
  };

  openSavePopUp = () => {
    this.clResizePane()
    this.setState({ savePopUpVisible: !this.state.savePopUpVisible })
  };

  openDeletePopup = (index) => {
    this.clResizePane()
    this.setState({ deletePopUpVisible: !this.state.deletePopUpVisible, selectedIndex: index })
  };

  componentDidMount() {
    if (!R.isNil(this.props.auth.user)) {
      this.startFetch();
      this.props.getInstitute({
        "params": {
          "instituteStatus": "ACTIVE"
        },
        "offset": this.state.table_page,
        "limit": this.state.table_limit
      });
    }
    this.getCountPage()
  }

  getCountPage = async () => {
    let res = await API.create('MASTERDATA').getCountInstituteByStatus('ACTIVE')
    let countActive = res.data.data
    if (!R.isEmpty(this.state.table_query)) {
      let response = await API.create('MASTERDATA').getCountInstituteByName(this.state.table_query)
      if (response.ok) {
        this.setState({ instituteCount: response.data.data })
      }
      console.log(response)
      let body = {
        "limit": this.state.table_limit,
        "offset": this.state.table_page,
        "params": {
            "instituteName" : this.state.table_query
        }
      }
      let res = await API.create('MASTERDATA').getInstituteByName(body)
      if (res.ok) {
        if (res.data.data === null) {
          this.setState({ dataTableIns: [] })
        } else {
          let dataTableIns = res.data.data.map((value) => {
            const { instituteID, instituteName, instituteAddress, instituteStatus } = value;
            return [
              instituteID,
              instituteName,
              instituteAddress,
              instituteStatus
            ]
          })
          this.setState({
            dataTableIns,
            rawData: res.data.data
          })
        }
      }
    } else {
      this.setState({ instituteCount: countActive })
    }
  }

  componentWillReceiveProps(newProps) {
    let { institute, fetching } = newProps.masterdata

    if (!fetching) {
      this.onFinishFetch()
      institute = institute ? institute : []
      let dataTableIns = institute.map((value) => {
        const { instituteID, instituteName, instituteAddress, instituteStatus } = value;
        return [
          instituteID,
          instituteName,
          instituteAddress,
          instituteStatus
        ]
      })
      this.setState({
        dataTableIns,
        rawData: institute
      })
    }
  }

  startFetch = () => {
    this.LoadingBar.continousStart();
  };

  onFinishFetch = () => {
    if (typeof this.LoadingBar === "object") this.LoadingBar.complete();
  };


  columns = [
    "Institute ID",
    "Institute Name",
    {
      name: "Address",
      options: {
        customBodyRender: val => {
          return (
            <div style={{ width: '300px' }}>
              {val}
            </div>
          )
        }
      }
    },
    {
      name: "Institute Status",
      options: {
        customBodyRender: val => {
          return (
            <div>
              {val === "ACTIVE" ? (
                <div>
                  <i
                    className="fa fa-lw fa-circle"
                    style={{ color: "green", marginRight: 10 }}
                  />
                  {val}
                </div>
              ) : (
                  <div>
                    <i
                      className="fa fa-lw fa-circle"
                      style={{ color: "red", marginRight: 10 }}
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
                onClick={this.opSidePage('slide-menu-1', tableMeta.rowIndex)}>
                <i className="fa fa-lw fa-pencil-alt" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }} />
              </button>
              <button
                className="btnAct"
                style={{ marginRight: 15, backgroundColor: 'transparent' }}
                onClick={() => this.openDeletePopup(tableMeta.rowIndex)}>
                <i className="fa fa-lw fa-trash-alt" style={{ backgroundColor: 'transparent', color: 'red', fontSize: 20 }} />
              </button>
              <button
                className="btnAct"
                style={{ marginRight: 15, backgroundColor: 'transparent' }}
                onClick={this.opSidePage('slide-menu-view', tableMeta.rowIndex)}>
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
    let { instituteCount, table_query } = this.state
    let tableOptions = {
      ...options,
      serverSide: true,
      count: instituteCount,
      searchText: table_query,
      onTableChange: (action, tableState) => {
        switch (action) {
          case 'changePage':
            this.setState({ table_page: tableState.page })
            this.getDataInstitute(tableState.page, tableState.rowsPerPage);
            break;
          case 'changeRowsPerPage':
            this.setState({ table_limit: tableState.rowsPerPage })
            this.getDataInstitute(tableState.page, tableState.rowsPerPage);
            break;
          case 'search':
            let searchText = tableState.searchText ? tableState.searchText : ""
            this.setState({ table_query: searchText }, () => {
              this.getDataInstitute(tableState.page, tableState.rowsPerPage)
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
                  <div>
                    <LoadingBar onRef={ref => (this.LoadingBar = ref)} />
                    <div className="padding-10px">
                      <div className="margin-bottom-10px grid grid-2x">
                        <div className="col-1">
                          <div className="txt-site txt-18 txt-bold txt-main padding-top-5px">
                            {/* Institute */}
                          </div>
                        </div>
                        <div className="col-2 content-right">
                          <button
                            type="button"
                            className="btn btn-circle background-blue"
                            style={{ marginRight: 5 }}
                            onClick={this.openCreateForm.bind(this)}
                          >
                            <i className="fa fa-1x fa-plus" />
                          </button>
                        </div>
                      </div>
                      <MuiThemeProvider theme={getMuiTheme()}>
                        <MUIDataTable
                          key={instituteCount}
                          title={'Institute'}
                          subtitle={"lorem ipsum dolor"}
                          data={this.state.dataTableIns}
                          columns={this.columns}
                          options={tableOptions}
                        />
                      </MuiThemeProvider>
                    </div>

                    {this.state.savePopUpVisible && (
                      <PopUp
                        type={"save"}
                        class={"app-popup app-popup-show"}
                        onClick={this.handlePopUp.bind(this)}
                      />
                    )}

                    {this.state.deletePopUpVisible && (
                      <PopUp
                        type={"delete"}
                        class={"app-popup app-popup-show"}
                        onClickDelete={this.handleDelete}
                        onClick={this.openDeletePopup}
                      />
                    )}
                  </div>

                </div>
              )}
              side={(
                <div className="a-s-p-side">
                  {/* edit */}
                  {this.state.slideIns && (
                    <SlideInstitute
                      user={this.props.auth.user}
                      type={this.state.slideType}
                      data={this.state.rawData[this.state.selectedIndex]}
                      closeSlide={this.clResizePane}
                      onClickSave={this.handleUpdate.bind(this)}
                    />

                  )}
                </div>
              )}

            >
            </ResizeSlider>
            {this.state.createVisible && (
              <FormInstitute
                type={"create"}
                onClickClose={this.openCreateForm}
                onClickSave={this.handleSubmit.bind(this)}
                user={this.props.auth.user}
              />
            )}

            {this.state.editVisible && (
              <FormInstitute
                type={"update"}
                data={this.state.rawData[this.state.selectedIndex]}
                onClickClose={this.openEditForm.bind(this)}
                onClickSave={this.handleUpdate.bind(this)}
              />
            )}

            {this.state.detailVisible && (
              <FormInstitute
                type={"view"}
                data={this.state.rawData[this.state.selectedIndex]}
                onClickClose={this.openDetailForm}
              />
            )}

            {this.state.savePopUpVisible && (
              <PopUp
                type={"save"}
                class={"app-popup app-popup-show"}
                onClick={this.handlePopUp.bind(this)}
              />
            )}

            {this.state.deletePopUpVisible && (
              <PopUp
                type={"delete"}
                class={"app-popup app-popup-show"}
                onClickDelete={this.handleDelete}
                onClick={this.openDeletePopup}
              />
            )}
          </div>

        </div>
      </SplitPaneSecond>

      // <div className="main-content">
      //   <LoadingBar onRef={ref => (this.LoadingBar = ref)} />
      //   <div className="padding-5px grid grid-2x">
      //     <div className="col-1">
      //       <div className="txt-site txt-18 txt-bold txt-main padding-top-5px">
      //         {/* Institute */}
      //       </div>
      //     </div>
      //     <div className="col-2 content-right">
      //       <button
      //         type="button"
      //         className="btn btn-circle background-blue"
      //         style={{ marginRight: 5 }}
      //         onClick={this.openCreateForm.bind(this)}
      //       >
      //         <i className="fa fa-1x fa-plus" />
      //       </button>
      //     </div>
      //   </div>

      //   <div className="padding-5px">
      //     <MuiThemeProvider theme={this.getMuiTheme()}>
      //       <MUIDataTable
      //         title={'Institute'}
      //         data={this.state.dataTableIns}
      //         columns={this.columns}
      //         options={this.options}
      //       />
      //     </MuiThemeProvider>
      //   </div>

      // {this.state.createVisible && (
      //   <FormInstitute
      //     type={"create"}
      //     onClickClose={this.openCreateForm}
      //     onClickSave={this.handleSubmit.bind(this)}
      //   />
      // )}

      // {this.state.editVisible && (
      //   <FormInstitute
      //     type={"update"}
      //     data={this.state.rawData[this.state.selectedIndex]}
      //     onClickClose={this.openEditForm.bind(this)}
      //     onClickSave={this.handleUpdate.bind(this)}
      //   />
      // )}

      // {this.state.detailVisible && (
      //   <FormInstitute
      //     type={"view"}
      //     data={this.state.rawData[this.state.selectedIndex]}
      //     onClickClose={this.openDetailForm}
      //   />
      // )}

      // {this.state.savePopUpVisible && (
      //   <PopUp
      //     type={"save"}
      //     class={"app-popup app-popup-show"}
      //     onClick={this.handlePopUp.bind(this)}
      //   />
      // )}

      // {this.state.deletePopUpVisible && (
      //   <PopUp
      //     type={"delete"}
      //     class={"app-popup app-popup-show"}
      //     onClickDelete={this.handleDelete}
      //     onClick={this.openDeletePopup}
      //   />
      // )}
      // </div>

    );
  }
}

const mapStateToProps = state => {
  return {
    masterdata: state.masterdata,
    auth: state.auth
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getInstitute: obj => dispatch(MasterdataAction.getInstitute(obj)),
    authLogout: () => dispatch(AuthAction.authLogout())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Institute);
