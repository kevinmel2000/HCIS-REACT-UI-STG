import React, { Component } from "react";
import PopUp from "../../../pages/PopUpAlert";
import ResizeSlider from "../../../../modules/resize/Slider";
import { getBizpar } from '../../../../Services/Utils'
// import M from "moment";
import * as R from "ramda";
import { connect } from "react-redux";
// IPP
import FormPerformance from "./edit/performance/formPerformance";
import TablePerformance from "../tables/tablePerformance";
import FormEditPerformance from "./edit/performance/formEditPerformance";
// CNC
import FormCNC from "./edit/cnc/formCNC";
import TableCNC from "../tables/tableCNC";
import FormEditCNC from "./edit/cnc/formEditCNC";
import Api from "../../../../Services/Api";

class ConfPerformance extends Component {
  constructor(props) {
    super(props);
    this.state = {
      auth: props.auth,
      savePopUpVisible: false,
      createPerformance: false,
      createCNC: false,
      deletePopUpVisible: false,
      editPerformance: false,
      editCNC: false,
      allowResize: false,
      defaultSize: 0,
      minSize: 0,
      maxSize: 0,
      rawData: [],
      rawDataCnc: [],
      dataTableCNC: [],
      bizparActivityPlanCategory: [],
      bizparActivityPlanSection: [],
      bizparAppraisalType: [],
      bizparAchievement: [],
      bizparAppaItemComponent: [],
      bizparPerformancePlanComponent: [],
      bizparHeaderComponent: [],
      bizparCriteriaCategory: [],
      bizparPerformaceType: [],
      bizparPerformaceValue: [],
      bizparComputeType: [],
      bizparCorporateGrade: [],
      bizparSignType: [],
      bizparSignPersonType: [],
      bizparSignPersonTypeItem: [],
    };
  }

  componentDidMount() {
    this.getDataPerformaceByID('TPL-0001')
    this.getDataCnc()
    this.getDataBizpar()
  }

  getDataCnc = async () => {
    let response = await Api.create("CFG").getCncById("CNC-001")
    if (response.data) {
      if (response.data.status === "S") {
        console.log("res", response.data.data)
        const { cncTPLID, cncTPLName, cncTPLStatus } = response.data.data
        let activation = cncTPLStatus === "ACTIVE" ? "YES" : "NO"
        let dataTableCNC = [[cncTPLID, cncTPLName, activation]]
        this.setState({ dataTableCNC, rawDataCnc: response.data.data })
      } else alert("Failed: " + response.data.message)
    } else alert("Failed, Please Try Again.")
  }

  async getDataBizpar() {
    let bizparActivityPlanCategory = await getBizpar('IPP_CATEGORY')
    let bizparActivityPlanSection = await getBizpar('IPP_SECTION')
    let bizparAppraisalType = await getBizpar('IPP_PERFORMANCE_APPRAISAL')
    let bizparAchievement = await getBizpar('IPP_PERFORMANCE_APPRAISAL_ACHIEVEMENT')
    let bizparAppaItemComponent = await getBizpar('IPP_PERFORMANCE_APPRAISAL_ACHIEVEMENT_VALUE')
    let bizparPerformancePlanComponent = await getBizpar('IPP_PERFORMANCE_PLAN')
    let bizparHeaderComponent = await getBizpar('IPP_HEADER_COMPONENT')
    let bizparCriteriaCategory = await getBizpar('IPP_PROCESS_CRITERIA_CATEGORY')
    let bizparPerformaceType = await getBizpar('IPP_PROCESS_PERFORMANCE_VALUE')
    let bizparPerformaceValue = await getBizpar('IPP_PERFORMANCE_APPRAISAL_ACHIEVEMENT_VALUE')
    let bizparComputeType = await getBizpar('IPP_PERFORMANCE_APPRAISAL_COMPUTE_TYPE')
    let bizparCorporateGrade = await getBizpar('CORPORATE_GRADE')
    let bizparSignType = await getBizpar('IPP_SIGN_TYPE')
    let bizparSignPersonType = await getBizpar('IPP_SIGN_PERSON_TYPE')
    let bizparSignPersonTypeItem = await getBizpar('IPP_SIGN_PERSON_TYPE_ITEM')

    this.setState({
      bizparSignType,
      bizparSignPersonType,
      bizparSignPersonTypeItem,
      bizparComputeType,
      bizparCorporateGrade,
      bizparPerformaceValue,
      bizparPerformaceType,
      bizparCriteriaCategory,
      bizparHeaderComponent,
      bizparActivityPlanCategory,
      bizparActivityPlanSection,
      bizparAppraisalType,
      bizparAchievement,
      bizparAppaItemComponent,
      bizparPerformancePlanComponent
    })
  }

  async getDataPerformaceByID(value) {
    let res = await Api.create('CFG').getIppTplById(value)
    if (res.data) {
      if (res.data.status === 'S') {
        let rawData = []
        rawData.push(res.data.data)
        let dataTable = rawData.map((value, index) => {
          const { ippTPLID, ippTPLName, ippTPLStatus } = value
          let status = ippTPLStatus === 'ACTIVE' ? 'YES' : 'NO'
          return [
            index = +1,
            ippTPLID,
            ippTPLName,
            status
          ]
        })

        this.setState({ dataTable, rawData })
      }
    } else return alert('')
  }

  dataTable = [
    ["1", "ID-9291", "IPP TEMPLATE 2018", "YES"],
    ["2", "ID-9292", "IPP TEMPLATE 2018", "YES"]
  ];
  dataTableCNC = [
    ["1", "ID-9291", "CNN TEMPLATE 2018", "YES"],
    ["2", "ID-9292", "CNN TEMPLATE 2018", "YES"]
  ];


  clResizePane = () => {
    this.setState({
      editPerformance: false,
      allowResize: false,
      defaultSize: 0,
      minSize: 0,
      maxSize: 0
    })
  }

  opSidePage = (menu, index) => e => {
    this.setState({
      editPerformance: false,
      editCNC: false,
      allowResize: true,
      defaultSize: 370,
      minSize: 370,
      maxSize: 850
    })

    switch (menu) {
      case "slide-performance":
        this.setState({
          editPerformance: true,
          selectedIndex: index
        });
        break;
      case "slide-cnc":
        this.setState({
          editCNC: true
        });
        break;
      default:
        break;
    }
  };

  opPopupPage = menu => e => {
    e.preventDefault();

    this.setState({
      createCNC: false,
      createPerformance: false
    });

    this.clResizePane();
    switch (menu) {
      case "create-ipp":
        this.setState({
          createPerformance: true,
          createCNC: false,
          editPerformance: false,
          editCNC: false,
          sub: "ipp",
        });
        break;
      case "create-cnc":
        this.setState({
          createCNC: true,
          createPerformance: false,
          editCNC: false,
          editPerformance: false,
          sub: "cnc",
        });
        break;
      default:
        break;
    }
  };

  clPopupPage = () => {
    let savePopUpVisible = this.state.savePopUpVisible
      ? !this.state.savePopUpVisible
      : false;
    this.setState({
      createCNC: false,
      createPerformance: false,
      editCNC: false,
      editPerformance: false,
      savePopUpVisible
    });
  };

  openSavePopUp = () => {
    this.clResizePane();
    this.getDataPerformaceByID('TPL-0001')
    this.setState({
      savePopUpVisible: !this.state.savePopUpVisible,
      createCNC: false,
      editCNC: false,
      createPerformance: false,
      editPerformance: false,
    });
  };

  openDeletePopUp = (index, type) => {
    this.setState({
      deletePopUpVisible: !this.state.deletePopUpVisible,
      selectedIndex: index
    });
    if (type !== "delete-detail") return this.clResizePane();
  };

  handleSubmit = () => this.openSavePopUp()

  handleUpdate = () => this.openSavePopUp()

  handleDelete = () => this.setState({ deletePopUpVisible: !this.state.deletePopUpVisible })

  render() {
    return (
      <div>
        <ResizeSlider
          allowResize={this.state.allowResize}
          defaultSize={this.state.defaultSize}
          minSize={this.state.minSize}
          maxSize={this.state.maxSize}
          main={
            <div>
              <div className="a-s-p-place a-s-p-content active">
                <div className="a-s-p-top">
                  <div className="grid grid-2x">
                    <div className="col-1">
                      <div className="margin-left-15px margin-top-10px margin-bottom-10px display-flex-normal">
                        <div>
                          <i className="color-blue fas fa-chart-line margin-right-10px"></i>
                        </div>
                        <div>
                          <div className="txt-site txt-12 txt-bold txt-main">
                            Performance
                          </div>
                          <div className="txt-site txt-10 txt-thin txt-primary">
                            Performance
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="a-s-p-mid border-top">
                  <div className="padding-10px">
                    <div className="app-open-close margin-bottom-20px">
                      <input
                        type="checkbox"
                        name="navmenu"
                        className="app-open-close-input"
                        id="navmenu-ch"
                      />
                      <div className="grid grid-2x margin-bottom-10px">
                        <div className="col-1"></div>
                        <div className="col-2 content-right">
                          <label htmlFor="navmenu-ch">
                            <div className="app-open-close-icon"></div>
                          </label>
                          <button
                            className="btn btn-small-circle btn-sekunder margin-left-5px"
                            onClick={this.opPopupPage("create-ipp")}>
                            <i className="fa fa-lw fa-plus" />
                          </button>
                        </div>
                        {this.state.createPerformance && (
                          <FormPerformance
                            type={"create"}
                            onClickSave={this.handleSubmit.bind(this)}
                            onClickClose={this.clPopupPage.bind(this)}
                          />
                        )}
                      </div>
                      <div className="app-open-close-content">
                        <TablePerformance
                          dataTable={this.state.dataTable}
                          openSlide={this.opSidePage.bind(this)}
                          onDeletePopup={this.openDeletePopUp.bind(this)}
                        />
                      </div>
                    </div>
                    <div className="app-open-close margin-bottom-20px">
                      <input
                        type="checkbox"
                        name="navmenu"
                        className="app-open-close-input"
                        id="navmenu-cn"
                      />
                      <div className="grid grid-2x margin-bottom-10px">
                        <div className="col-1"></div>
                        <div className="col-2 content-right">
                          <label htmlFor="navmenu-cn">
                            <div className="app-open-close-icon"></div>
                          </label>
                          <button
                            className="btn btn-small-circle btn-sekunder margin-left-5px"
                            onClick={this.opPopupPage("create-cnc")}>
                            <i className="fa fa-lw fa-plus" />
                          </button>
                        </div>
                        {this.state.createCNC && (
                          <FormCNC
                            type="create"
                            onClickSave={this.handleSubmit.bind(this)}
                            onClickClose={this.clPopupPage.bind(this)}
                          />
                        )}
                      </div>
                      <div className="app-open-close-content">
                        <TableCNC
                          dataTable={this.state.dataTableCNC}
                          openSlide={this.opSidePage.bind(this)}
                          onDeletePopup={this.openDeletePopUp.bind(this)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          }
          side={
            <div className="a-s-p-side">
              {/* edit */}
              {this.state.editPerformance ? (
                <FormEditPerformance
                  bizparSignType={this.state.bizparSignType}
                  bizparSignPersonType={this.state.bizparSignPersonType}
                  bizparSignPersonTypeItem={this.state.bizparSignPersonTypeItem}
                  bizparComputeType={this.state.bizparComputeType}
                  bizparCorporateGrade={this.state.bizparCorporateGrade}
                  bizparCriteriaCategory={this.state.bizparCriteriaCategory}
                  bizparPerformaceValue={this.state.bizparPerformaceValue}
                  bizparPerformaceType={this.state.bizparPerformaceType}
                  bizparHeaderComponent={this.state.bizparHeaderComponent}
                  bizparPerformancePlanComponent={this.state.bizparPerformancePlanComponent}
                  bizparAppaItemComponent={this.state.bizparAppaItemComponent}
                  bizparAchievement={this.state.bizparAchievement}
                  bizparAppraisalType={this.state.bizparAppraisalType}
                  bizparActivityPlanSection={this.state.bizparActivityPlanSection}
                  bizparActivityPlanCategory={this.state.bizparActivityPlanCategory}
                  rawData={this.state.rawData[this.state.selectedIndex]}
                  closeSlide={this.clResizePane}
                  onDeletePopUp={this.openDeletePopUp.bind(this)}
                  onClickSave={this.handleUpdate.bind(this)}
                />
              ) : null}

              {this.state.editCNC ? (
                <FormEditCNC
                  data={this.state.rawDataCnc}
                  closeSlide={this.clResizePane}
                  onDeletePopUp={this.openDeletePopUp.bind(this)}
                  onClickSave={this.handleUpdate.bind(this)}
                />
              ) : null}
            </div>
          }
        ></ResizeSlider>

        {this.state.savePopUpVisible && <PopUp type={"save"} class={"app-popup app-popup-show"} onClick={this.openSavePopUp.bind(this)} />}

        {this.state.deletePopUpVisible && (
          <PopUp
            type={"delete"}
            class={"app-popup app-popup-show"}
            onClick={this.openDeletePopUp}
            onClickDelete={
              this.state.editPerformance
                ? () =>
                  this.handleUpdate(this.state.selectedIndex, "delete-detail")
                : this.handleDelete.bind(this)
            }
          />
        )}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    auth: state.auth
  };
};

export default connect(mapStateToProps, null)(ConfPerformance);
