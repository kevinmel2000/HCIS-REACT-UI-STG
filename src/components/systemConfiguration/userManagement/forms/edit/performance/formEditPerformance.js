import React, { Component } from "react";
import ReactTooltip from "react-tooltip";
import FormPerformance from "./formPerformance";
import * as R from 'ramda'
import Api from "../../../../../../Services/Api";

//formChild
import FormIPPCompHeader from "../../create/performance/formIppCompHead";
import FormIPPComSection from "../../create/performance/formIppComSection";
import FormIPPSigSection from "../../create/performance/formIppSigSection";
import FormOutCriteria from "../../create/performance/formOutCriteria";
import FormProCriteria from "../../create/performance/formProCriteria";

//table
import TableIppCompHead from "../../../tables/confPerformance/tableIppCompHeader";
import TableIppComSection from "../../../tables/confPerformance/tableIppComSection";
import TableIppSegSection from "../../../tables/confPerformance/tableIppSigSection";
import TableOutputCri from "../../../tables/confPerformance/tblOutputCri";
import TableProcessCri from "../../../tables/confPerformance/tblProcessCri";

import PopUp from "../../../../../pages/PopUpAlert";

class FormEditPerformance extends Component {
  constructor(props) {
    super(props);
    this.state = {
      createCompHead: false,
      createComSection: false,
      createSigSection: false,
      createOutCriteria: false,
      createProCriteria: false,
      savePopUpVisible: false,
      rawData: props.rawData
    };
  }

  handleDelete(type) {
    switch (type) {
      case 'header':
        this.handleSaveHeader('delete')
        break;
      case 'compute':
        this.handleSaveCompute('delete')
        break;
      case 'outputCriteria':
        this.handleSaveOutputCriteria('delete')
        break;
      case 'processCriteria':
        this.handleSaveProcessCriteria('delete')
        break;
      case 'signAge':
        this.handleSaveSignAge('delete')
        break;
      default: break;
    }
  }

  async handleSaveOutputCriteria(type, value) {
    let payload, index, res = ''
    let { ippTPLID } = this.state.rawData
    let { mainContentID, outputCriteria } = this.state.rawData.ippTPLData.contentSection
    let { ippOutputCriteriaProcessValuationID, ippOCVItems, totalWeight } = outputCriteria

    switch (type) {
      case 'create':
        ippOCVItems.push(value)
        break
      case 'update':
        index = R.findIndex(R.propEq('outputCriteriaValuationID', value.outputCriteriaValuationID))(ippOCVItems)
        if (index >= 0) {
          ippOCVItems[index] = value
        } else return alert('Data not found.')
        break
      case 'delete':
        ippOCVItems.splice(this.state.selectedIndex, 1)
        break
      default: break;
    }

    ippOCVItems = !ippOCVItems ? [] : ippOCVItems.map((value) => {
      const { outputCriteriaValuationID, activityPlanSection, activityPlanWeightPerformance, activityPlanCategory, activityPlanDescription, activityPlanWeight,
        activityPlanUOM, activityPlanPerformanceByTime, activityPlanPerformanceAppraisalByTime, totalValue } = value
      let detail = !activityPlanPerformanceByTime ? [] : activityPlanPerformanceByTime.map((byTime) => {
        const { performancePlanID, performancePlanComponent, performancePlanValue } = byTime
        return {
          performancePlanID: performancePlanID,
          performancePlanComponent: performancePlanComponent ? performancePlanComponent.bizparKey ? performancePlanComponent.bizparKey : performancePlanComponent : '',
          performancePlanValue: performancePlanValue
        }
      })
      let detailAppraisal = !activityPlanPerformanceAppraisalByTime ? [] : activityPlanPerformanceAppraisalByTime.map((appraisal) => {
        const { activityPlanPerformanceAppraisalID, appraisalType, achievement, achievementValue, performanceValue } = appraisal
        let detailsPerfValue = !performanceValue ? [] : performanceValue.map((perfValue) => {
          const { appaItemID, appaItemComponent, appaItemValue } = perfValue
          return {
            appaItemComponent: appaItemComponent ? appaItemComponent.bizparKey ? appaItemComponent.bizparKey : appaItemComponent : '',
            appaItemID: appaItemID,
            appaItemValue: appaItemValue
          }
        })
        return {
          activityPlanPerformanceAppraisalID: activityPlanPerformanceAppraisalID,
          appraisalType: appraisalType ? appraisalType.bizparKey ? appraisalType.bizparKey : appraisalType : '',
          achievement: achievement ? achievement.bizparKey ? achievement.bizparKey : achievement : '',
          achievementValue: achievementValue,
          performanceValue: detailsPerfValue
        }
      })
      return {
        outputCriteriaValuationID: outputCriteriaValuationID,
        activityPlanSection: activityPlanSection ? activityPlanSection.bizparKey ? activityPlanSection.bizparKey : activityPlanSection : '',
        activityPlanCategory: activityPlanCategory ? activityPlanCategory.bizparKey ? activityPlanCategory.bizparKey : activityPlanCategory : '',
        activityPlanWeightPerformance: activityPlanWeightPerformance,
        activityPlanDescription: activityPlanDescription,
        activityPlanWeight: activityPlanWeight,
        activityPlanUOM: activityPlanUOM,
        totalValue: totalValue,
        activityPlanPerformanceByTime: detail,
        activityPlanPerformanceAppraisalByTime: detailAppraisal
      }
    })

    payload = {
      ippTPLID: ippTPLID,
      mainContentID: mainContentID,
      outputCriteria: {
        ippOutputCriteriaProcessValuationID: ippOutputCriteriaProcessValuationID,
        ippOCVItems: ippOCVItems,
        totalWeight: totalWeight
      }
    }

    res = await Api.create('CFG').putIppTplOutputCriteria(payload)
    if (res.data.status === 'S') {
      this.props.onClickSave()
    }
    else { return alert(res.data.message) }
  }

  async handleSaveSignAge(type, value) {
    let payload, index, res = ''
    let { ippTPLID } = this.state.rawData
    let { ippSignageSectionID, signs } = this.state.rawData.ippTPLData.signageSections[0]

    switch (type) {
      case 'create':
        signs.push(value)
        break;
      case 'update':
        index = R.findIndex(R.propEq('signageID', value.signageID))(signs)
        if (index >= 0) {
          signs[index] = value
        } else return alert('Data not found.')
        break;
      case 'delete':
        signs.splice(this.state.selectedIndex, 1)
        break
    }

    signs = !signs ? [] : signs.map((value) => {
      const { signageID, signType, signPics } = value
      let detailsSignPics = !signPics ? [] : signPics.map((values) => {
        const { signageItemID, category, items } = values
        let detailsItem = !items ? [] : items.map((valuess) => {
          const { signageSubItemID, signageSubItemComponent, signageSubItemValue } = valuess
          return {
            signageSubItemID: signageSubItemID,
            signageSubItemComponent: signageSubItemComponent ? signageSubItemComponent.bizparKey ? signageSubItemComponent.bizparKey : signageSubItemComponent : '',
            signageSubItemValue: signageSubItemValue
          }
        })
        return {
          signageItemID: signageItemID,
          category: category ? category.bizparKey ? category.bizparKey : category : '',
          items: detailsItem
        }
      })
      return {
        signageID: signageID,
        signType: signType ? signType.bizparKey ? signType.bizparKey : signType : '',
        signPics: detailsSignPics
      }
    })
    payload = {
      ippTPLID: ippTPLID,
      signageSections: {
        ippSignageSectionID: ippSignageSectionID,
        ippTPLID: ippTPLID,
        signs: signs
      }
    }

    res = await Api.create('CFG').putIppTplSignageSection(payload)
    if (res.data.status === 'S') {
      this.props.onClickSave()
    }
    else { return alert(res.data.message) }
  }

  async handleSaveProcessCriteria(type, value) {
    let payload, index, res = ''
    let { ippTPLID } = this.state.rawData
    let { mainContentID, processCriteria } = this.state.rawData.ippTPLData.contentSection
    let { ippOutputCriteriaProcessValuationID, ippOCVItems, totalWeight } = processCriteria
    ippOCVItems = !ippOCVItems ? [] : ippOCVItems.map((value) => {
      const { outputCriteriaProcessValuationID, activityPlanSection, activityPlanWeightPerformance, subCriteria, ocpvAppraisalByTime } = value
      let parseSubCriteria = {
        outputCriteriaProcessValuationSubcriteriaID: subCriteria.outputCriteriaProcessValuationSubcriteriaID,
        criteriaExplanation: subCriteria.criteriaExplanation,
        criteriaCategory: subCriteria.criteriaCategory ? subCriteria.criteriaCategory.bizparKey ? subCriteria.criteriaCategory.bizparKey : subCriteria.criteriaCategory : '',
      }
      let detailsOcpvAppraisalByTime = !ocpvAppraisalByTime ? [] : ocpvAppraisalByTime.map((valueDetailSub) => {
        const { outputCriteriaProcessValuationAppraisalID, performanceWeight, performanceType, performanceValue } = valueDetailSub
        let detailsPerformanceValue = !performanceValue ? [] : performanceValue.map((valueDetailPerf) => {
          const { ocpvaItemID, ocpvaItemComponent, ocpvaItemValue } = valueDetailPerf
          return {
            ocpvaItemID: ocpvaItemID,
            ocpvaItemValue: ocpvaItemValue,
            ocpvaItemComponent: ocpvaItemComponent ? ocpvaItemComponent.bizparKey ? ocpvaItemComponent.bizparKey : ocpvaItemComponent : '',
          }
        })
        return {
          outputCriteriaProcessValuationAppraisalID: outputCriteriaProcessValuationAppraisalID,
          performanceWeight: performanceWeight,
          performanceType: performanceType ? performanceType.bizparKey ? performanceType.bizparKey : performanceType : '',
          performanceValue: detailsPerformanceValue
        }
      })
      return {
        outputCriteriaProcessValuationID: outputCriteriaProcessValuationID,
        activityPlanSection: activityPlanSection ? activityPlanSection.bizparKey ? activityPlanSection.bizparKey : activityPlanSection : '',
        activityPlanWeightPerformance: activityPlanWeightPerformance,
        subCriteria: parseSubCriteria,
        ocpvAppraisalByTime: detailsOcpvAppraisalByTime
      }
    })

    switch (type) {
      case 'create':
        ippOCVItems.push(value)
        break;
      case 'update':
        let data = {
          ...value,
          activityPlanSection: value.activityPlanSection ? value.activityPlanSection.bizparKey ? value.activityPlanSection.bizparKey : value.activityPlanSection : '',
          subCriteria: {
            ...value.subCriteria,
            criteriaCategory: value.subCriteria.criteriaCategory ? value.subCriteria.criteriaCategory.bizparKey ? value.subCriteria.criteriaCategory.bizparKey : value.subCriteria.criteriaCategory : '',
          },
          ocpvAppraisalByTime: !value.ocpvAppraisalByTime ? [] : value.ocpvAppraisalByTime.map((valueDetailSub) => {
            const { outputCriteriaProcessValuationAppraisalID, performanceWeight, performanceType, performanceValue } = valueDetailSub
            let detailsPerformanceValue = !performanceValue ? [] : performanceValue.map((valueDetailPerf) => {
              const { ocpvaItemID, ocpvaItemComponent, ocpvaItemValue } = valueDetailPerf
              return {
                ocpvaItemID: ocpvaItemID,
                ocpvaItemValue: ocpvaItemValue,
                ocpvaItemComponent: ocpvaItemComponent ? ocpvaItemComponent.bizparKey ? ocpvaItemComponent.bizparKey : ocpvaItemComponent : '',
              }
            })
            return {
              outputCriteriaProcessValuationAppraisalID: outputCriteriaProcessValuationAppraisalID,
              performanceWeight: performanceWeight,
              performanceType: performanceType ? performanceType.bizparKey ? performanceType.bizparKey : performanceType : '',
              performanceValue: detailsPerformanceValue
            }
          })
        }
        index = R.findIndex(R.propEq('outputCriteriaProcessValuationID', value.outputCriteriaProcessValuationID))(ippOCVItems)
        if (index >= 0) {
          ippOCVItems[index] = data
        } else return alert('Data not found.')
        break;
      case 'delete':
        ippOCVItems.splice(this.state.selectedIndex, 1)
        break;
      case 'weightProcess':
        totalWeight = value.totalWeight
        break;
      default: break;
    }

    payload = {
      ippTPLID: ippTPLID,
      mainContentID: mainContentID,
      processCriteria: {
        ippOutputCriteriaProcessValuationID: ippOutputCriteriaProcessValuationID,
        ippOCVItems: ippOCVItems,
        totalWeight: totalWeight
      }
    }
    res = await Api.create('CFG').putIppTplProcessCriteria(payload)
    if (res.data.status === 'S') {
      this.props.onClickSave()
    }
    else { return alert(res.data.message) }
  }

  async handleSaveCompute(type, inputValue) {
    let payload, index, res = ''
    let { ippTPLID } = this.state.rawData
    let { ippComputeSectionID, computeItems } = this.state.rawData.ippTPLData.computeSection
    computeItems = !computeItems ? [] : computeItems.map((data) => {
      const { computeCriterias, computeID, computeType, gradePerformance, paYear } = data
      let details = !computeCriterias ? [] : computeCriterias.map((dataCrit) => {
        const { computeItemID, criteria, weight, value, totalValue } = dataCrit
        return {
          computeItemID: computeItemID,
          criteria: criteria ? criteria.bizparKey ? criteria.bizparKey : criteria : '',
          weight: weight,
          value: value,
          totalValue: totalValue
        }
      })
      return {
        computeID: computeID,
        computeType: computeType ? computeType.bizparKey ? computeType.bizparKey : computeType : '',
        gradePerformance: gradePerformance ? gradePerformance.bizparKey ? gradePerformance.bizparKey : gradePerformance : '',
        computeCriterias: details,
        paYear: paYear
      }
    })
    switch (type) {
      case 'create':
        computeItems = []
        computeItems.push(inputValue)
        break;
      case 'update':
        {
          let data = {
            ...inputValue,
            computeType: inputValue.computeType ? inputValue.computeType.bizparKey ? inputValue.computeType.bizparKey : inputValue.computeType : '',
            gradePerformance: inputValue.gradePerformance ? inputValue.gradePerformance.bizparKey ? inputValue.gradePerformance.bizparKey : inputValue.gradePerformance : '',
          }
          index = R.findIndex(R.propEq('computeID', data.computeID))(computeItems)
          if (index >= 0) {
            computeItems[index] = data
          } else return alert('Data not found.')
        }
        break;
      case 'delete':
        let { selectedIndex } = this.state
        index = R.findIndex(R.propEq('computeID', computeItems[selectedIndex].computeID))(computeItems)
        if (index >= 0) {
          computeItems.splice(index, 1)
        } else return alert('Data not found.')
        break;
      default: break;
    }
    payload = {
      computeItems: computeItems,
      ippComputeSectionID: ippComputeSectionID,
      ippTPLID: ippTPLID
    }
    if (type === 'create') {
      res = await Api.create('CFG').postIppTplComputeSection(payload)
    } else { res = await Api.create('CFG').putIppTplComputeSection(payload) }
    if (res.data.status === 'S') {
      this.props.onClickSave()
    }
    else { return alert(res.data.message) }
  }

  async handleSaveHeader(type, value) {
    let payload, index, res = ''
    let { headerID, headerComponents } = this.state.rawData.ippTPLData.header
    let { ippTPLID } = this.state.rawData
    headerComponents = !headerComponents ? [] : headerComponents.map((data) => {
      const { headerDetailID, headerDetailComponent, headerDetailValue } = data
      return {
        headerDetailID: headerDetailID,
        headerDetailComponent: headerDetailComponent ? headerDetailComponent.bizparKey ? headerDetailComponent.bizparKey : headerDetailComponent : '',
        headerDetailValue: headerDetailValue
      }
    })
    switch (type) {
      case 'create':
        headerComponents = []
        headerComponents.push(value)
        break;
      case 'update':
        {
          let data = {
            ...value,
            headerDetailComponent: value.headerDetailComponent ? value.headerDetailComponent.bizparKey ? value.headerDetailComponent.bizparKey : value.headerDetailComponent : ''
          }
          index = R.findIndex(R.propEq('headerDetailID', data.headerDetailID))(headerComponents)
          if (index >= 0) {
            headerComponents[index] = data
          } else return alert('Data not found.')
        }
        break;
      case 'delete':
        let { selectedIndex } = this.state
        index = R.findIndex(R.propEq('headerDetailID', headerComponents[selectedIndex].headerDetailID))(headerComponents)
        if (index >= 0) {
          headerComponents.splice(index, 1)
        } else return alert('Data not found.')
        break;
      default: break;
    }
    payload = {
      headerComponents: headerComponents,
      headerID: headerID,
      ippTPLID: ippTPLID
    }
    if (type === 'create') {
      res = await Api.create('CFG').postIppTplComponentHeader(payload)
    } else { res = await Api.create('CFG').putIppTplComponentHeader(payload) }
    if (res.data.status === 'S') {
      this.props.onClickSave()
    }
    else { return alert(res.data.message) }
  }

  componentDidUpdate(prevProps) {
    let { rawData } = this.props
    if (rawData !== prevProps.rawData)
      this.setState({ rawData })
  }

  opPopupPage = type => {
    let savePopUpVisible;
    this.setState({
      editCompHead: false,
      editComSection: false,
      editSigSection: false,
      editOutCriteria: false,
      classAppSlidePage: "app-side-page"
    });
    switch (type) {
      case "popup-compHead":
        savePopUpVisible = this.state.savePopUpVisible
          ? !this.state.savePopUpVisible
          : false;
        this.setState({
          createCompHead: !this.state.createCompHead,
          savePopUpVisible
        });
        break;
      case "popup-comSection":
        savePopUpVisible = this.state.savePopUpVisible
          ? !this.state.savePopUpVisible
          : false;
        this.setState({
          createComSection: !this.state.createComSection,
          savePopUpVisible
        });
        break;
      case "popup-sigSection":
        savePopUpVisible = this.state.savePopUpVisible
          ? !this.state.savePopUpVisible
          : false;
        this.setState({
          createSigSection: !this.state.createSigSection,
          savePopUpVisible
        });
        break;
      case "popup-OutCri":
        savePopUpVisible = this.state.savePopUpVisible
          ? !this.state.savePopUpVisible
          : false;
        this.setState({
          createOutCriteria: !this.state.createOutCriteria,
          savePopUpVisible
        });
        break;
      case "popup-ProCri":
        savePopUpVisible = this.state.savePopUpVisible
          ? !this.state.savePopUpVisible
          : false;
        this.setState({
          createProCriteria: !this.state.createProCriteria,
          savePopUpVisible
        });
        break;
      default:
        break;
    }
  };

  openSavePopUp = () => {
    this.setState({
      savePopUpVisible: !this.state.savePopUpVisible
    });
  };

  openDeletePopUp = (index, type) => {
    this.setState({
      deletePopUpVisible: !this.state.deletePopUpVisible,
      selectedIndex: index,
      deleteType: type
    });
  };

  render() {
    return (
      <div className="a-s-p-place active">
        <div className="a-s-p-top">
          <div className="grid grid-2x">
            <div className="col-1">
              <div className="display-flex-normal margin-top-10px">
                <i className="fas fa-chart-line"></i>
                <span className="txt-site txt-11 txt-main margin-left-10px">
                  IPP Template
                </span>
              </div>
            </div>
            <div className="col-2 content-right">
              <button
                onClick={this.props.closeSlide}
                className="btn btn-circle btn-grey"
              >
                <i className="fa fa-lg fa-arrow-right" />
              </button>
            </div>
          </div>
        </div>
        <div className="a-s-p-mid a-s-p-pad border-top">
          <div className="padding-10px">
            <div>
              <div className="app-open-close margin-bottom-20px">
                <input
                  type="checkbox"
                  name="navmenu"
                  className="app-open-close-input"
                  id="navmenu-cah"
                />
                <div className="grid grid-2x margin-bottom-10px">
                  <div className="col-1">
                    <div className="display-flex-normal margin-top-10px">
                      <i className="fas fa-chart-line margin-right-5px"></i>
                      <span className="txt-site txt-11 txt-main">
                        IPP Template Header
                      </span>
                    </div>
                  </div>
                  <div className="col-2 content-right">
                    <label htmlFor="navmenu-cah">
                      <div className="app-open-close-icon"></div>
                    </label>
                  </div>
                </div>
                <div className="app-open-close-content">
                  <FormPerformance
                    rawData={this.state.rawData}
                    type={"update"}
                    onClickSave={this.props.onClickSave.bind(this)}
                  />
                </div>
              </div>

              <div className="app-open-close margin-bottom-20px">
                <input
                  type="checkbox"
                  name="navmenu"
                  className="app-open-close-input"
                  id="navmenu-cih"
                />
                <div className="grid grid-2x margin-bottom-10px">
                  <div className="col-1">
                    <div className="display-flex-normal margin-top-10px">
                      <i className="fas fa-chart-line margin-right-5px"></i>
                      <span className="txt-site txt-11 txt-main">
                        IPP Component Header
                      </span>
                    </div>
                  </div>
                  <div className="col-2 content-right">
                    <label htmlFor="navmenu-cih">
                      <div className="app-open-close-icon"></div>
                    </label>
                    <button
                      className="btn btn-small-circle btn-sekunder margin-left-5px"
                      onClick={() => this.opPopupPage("popup-compHead")}
                    >
                      <i className="fa fa-lw fa-plus" />
                    </button>
                  </div>
                </div>

                {this.state.createCompHead && (
                  <FormIPPCompHeader
                    type={"create"}
                    bizparHeaderComponent={this.props.bizparHeaderComponent}
                    onClickSave={this.handleSaveHeader.bind(this)}
                    onClickClose={() => this.opPopupPage("popup-compHead")}
                    onClick={this.props.onDeletePopUp}
                  />
                )}
                <div className="app-open-close-content">
                  <TableIppCompHead
                    bizparHeaderComponent={this.props.bizparHeaderComponent}
                    rawData={this.state.rawData.ippTPLData.header}
                    onDeletePopUp={this.props.onDeletePopUp.bind(this)}
                    onClickSave={this.handleSaveHeader.bind(this)}
                    onClickClose={() => this.opPopupPage("popup-compHead")}
                    onClick={this.props.onDeletePopUp}
                    openDeletePopUp={this.openDeletePopUp.bind(this)}
                  />
                </div>
              </div>
              <div className="app-open-close margin-bottom-20px">
                <input
                  type="checkbox"
                  name="navmenu"
                  className="app-open-close-input"
                  id="navmenu-ipm"
                />
                <div className="grid grid-2x margin-bottom-10px">
                  <div className="col-1">
                    <div className="display-flex-normal margin-top-10px">
                      <i className="fas fa-chart-line margin-right-5px"></i>
                      <span className="txt-site txt-11 txt-main">
                        IPP Main Section
                      </span>
                    </div>
                  </div>
                  <div className="col-2 content-right">
                    <label htmlFor="navmenu-ipm">
                      <div className="app-open-close-icon"></div>
                    </label>
                  </div>
                </div>
                {/* child */}
                <div className="app-open-close-content">
                  <div className="app-open-close margin-bottom-20px padding-10px">
                    <input
                      type="checkbox"
                      name="navmenu"
                      className="app-open-close-input"
                      id="navmenu-oc"
                    />
                    <div className="grid grid-2x margin-bottom-10px">
                      <div className="col-1">
                        <div className="display-flex-normal margin-top-10px">
                          <i className="fas fa-chart-line margin-right-5px"></i>
                          <span className="txt-site txt-11 txt-main">
                            Output Criteria
                          </span>
                        </div>
                      </div>
                      <div className="col-2 content-right">
                        <label htmlFor="navmenu-oc">
                          <div className="app-open-close-icon"></div>
                        </label>
                        <button
                          className="btn btn-small-circle btn-sekunder margin-left-5px"
                          onClick={() => this.opPopupPage("popup-OutCri")}
                        >
                          <i className="fa fa-lw fa-plus" />
                        </button>
                      </div>
                    </div>
                    {this.state.createOutCriteria && (
                      <FormOutCriteria
                        type={"create"}
                        bizparPerformancePlanComponent={this.props.bizparPerformancePlanComponent}
                        bizparAppaItemComponent={this.props.bizparAppaItemComponent}
                        bizparAppraisalType={this.props.bizparAppraisalType}
                        bizparAchievement={this.props.bizparAchievement}
                        bizparActivityPlanSection={this.props.bizparActivityPlanSection}
                        bizparActivityPlanCategory={this.props.bizparActivityPlanCategory}
                        onClickSave={this.handleSaveOutputCriteria.bind(this)}
                        onClickClose={() => this.opPopupPage("popup-OutCri")}
                      />
                    )}
                    <div className="app-open-close-content">
                      <TableOutputCri
                        bizparPerformancePlanComponent={this.props.bizparPerformancePlanComponent}
                        bizparAppaItemComponent={this.props.bizparAppaItemComponent}
                        bizparAchievement={this.props.bizparAchievement}
                        bizparAppraisalType={this.props.bizparAppraisalType}
                        bizparActivityPlanSection={this.props.bizparActivityPlanSection}
                        bizparActivityPlanCategory={this.props.bizparActivityPlanCategory}
                        rawData={this.state.rawData.ippTPLData.contentSection.outputCriteria}
                        onDeletePopUp={this.props.onDeletePopUp.bind(this)}
                        onClickSave={this.handleSaveOutputCriteria.bind(this)}
                        openDeletePopUp={this.openDeletePopUp.bind(this)}
                        onClickClose={() => this.opPopupPage("popup-OutCri")}
                      />
                    </div>
                  </div>

                  <div className="app-open-close margin-bottom-20px padding-10px">
                    <input
                      type="checkbox"
                      name="navmenu"
                      className="app-open-close-input"
                      id="navmenu-pc"
                    />
                    <div className="grid grid-2x margin-bottom-10px">
                      <div className="col-1">
                        <div className="display-flex-normal margin-top-10px">
                          <i className="fas fa-chart-line margin-right-5px"></i>
                          <span className="txt-site txt-11 txt-main">
                            Process Criteria
                          </span>
                        </div>
                      </div>
                      <div className="col-2 content-right">
                        <label htmlFor="navmenu-pc">
                          <div className="app-open-close-icon"></div>
                        </label>
                        <button
                          className="btn btn-small-circle btn-sekunder margin-left-5px"
                          onClick={() => this.opPopupPage("popup-ProCri")}
                        >
                          <i className="fa fa-lw fa-plus" />
                        </button>
                      </div>
                    </div>
                    {this.state.createProCriteria && (
                      <FormProCriteria
                        type={"create"}
                        bizparActivityPlanSection={this.props.bizparActivityPlanSection}
                        bizparCriteriaCategory={this.props.bizparCriteriaCategory}
                        bizparPerformaceValue={this.props.bizparPerformaceValue}
                        bizparPerformaceType={this.props.bizparPerformaceType}
                        onClickSave={this.handleSaveProcessCriteria.bind(this)}
                        onClickClose={() => this.opPopupPage("popup-ProCri")}
                        onClick={this.props.onDeletePopUp}
                      />
                    )}
                    <div className="app-open-close-content">
                      <TableProcessCri
                        bizparActivityPlanSection={this.props.bizparActivityPlanSection}
                        rawData={this.state.rawData.ippTPLData.contentSection.processCriteria}
                        bizparCriteriaCategory={this.props.bizparCriteriaCategory}
                        bizparPerformaceValue={this.props.bizparPerformaceValue}
                        bizparPerformaceType={this.props.bizparPerformaceType}
                        openDeletePopUp={this.openDeletePopUp.bind(this)}
                        onClickSave={this.handleSaveProcessCriteria.bind(this)}
                        onClickClose={() => this.opPopupPage("popup-ProCri")}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="app-open-close margin-bottom-20px">
                <input
                  type="checkbox"
                  name="navmenu"
                  className="app-open-close-input"
                  id="navmenu-ipc"
                />
                <div className="grid grid-2x margin-bottom-10px">
                  <div className="col-1">
                    <div className="display-flex-normal margin-top-10px">
                      <i className="fas fa-chart-line margin-right-5px"></i>
                      <span className="txt-site txt-11 txt-main">
                        IPP Compute Section
                      </span>
                    </div>
                  </div>
                  <div className="col-2 content-right">
                    <label htmlFor="navmenu-ipc">
                      <div className="app-open-close-icon"></div>
                    </label>
                    <button
                      className="btn btn-small-circle btn-sekunder margin-left-5px"
                      onClick={() => this.opPopupPage("popup-comSection")}
                    >
                      <i className="fa fa-lw fa-plus" />
                    </button>
                  </div>
                </div>
                {this.state.createComSection && (
                  <FormIPPComSection
                    type={"create"}
                    bizparActivityPlanSection={this.props.bizparActivityPlanSection}
                    bizparComputeType={this.props.bizparComputeType}
                    bizparCorporateGrade={this.props.bizparCorporateGrade}
                    onClickSave={this.handleSaveCompute.bind(this)}
                    onClickClose={() => this.opPopupPage("popup-comSection")}
                    onClick={this.props.onDeletePopUp}
                  />
                )}
                <div className="app-open-close-content">
                  <TableIppComSection
                    rawData={this.state.rawData.ippTPLData.computeSection}
                    bizparActivityPlanSection={this.props.bizparActivityPlanSection}
                    bizparComputeType={this.props.bizparComputeType}
                    bizparCorporateGrade={this.props.bizparCorporateGrade}
                    onDeletePopUp={this.props.onDeletePopUp.bind(this)}
                    onClickSave={this.handleSaveCompute.bind(this)}
                    openDeletePopUp={this.openDeletePopUp.bind(this)}
                    onClickClose={() => this.opPopupPage("popup-comSection")}
                  />
                </div>
              </div>

              <div className="app-open-close margin-bottom-20px">
                <input
                  type="checkbox"
                  name="navmenu"
                  className="app-open-close-input"
                  id="navmenu-isc"
                />
                <div className="grid grid-2x margin-bottom-10px">
                  <div className="col-1">
                    <div className="display-flex-normal margin-top-10px">
                      <i className="fas fa-chart-line margin-right-5px"></i>
                      <span className="txt-site txt-11 txt-main">
                        IPP Signage Section
                      </span>
                    </div>
                  </div>
                  <div className="col-2 content-right">
                    <label htmlFor="navmenu-isc">
                      <div className="app-open-close-icon"></div>
                    </label>
                    <button
                      className="btn btn-small-circle btn-sekunder margin-left-5px"
                      onClick={() => this.opPopupPage("popup-sigSection")}
                    >
                      <i className="fa fa-lw fa-plus" />
                    </button>
                  </div>
                </div>
                {this.state.createSigSection && (
                  <FormIPPSigSection
                    type={"create"}
                    bizparSignType={this.props.bizparSignType}
                    bizparSignPersonType={this.props.bizparSignPersonType}
                    bizparSignPersonTypeItem={this.props.bizparSignPersonTypeItem}
                    onClickSave={this.handleSaveSignAge.bind(this)}
                    onClickClose={() => this.opPopupPage("popup-sigSection")}
                    onClick={this.props.onDeletePopUp}
                  />
                )}
                <div className="app-open-close-content">
                  <TableIppSegSection
                    rawData={this.state.rawData.ippTPLData.signageSections}
                    bizparSignType={this.props.bizparSignType}
                    bizparSignPersonType={this.props.bizparSignPersonType}
                    bizparSignPersonTypeItem={this.props.bizparSignPersonTypeItem}
                    onDeletePopUp={this.props.onDeletePopUp.bind(this)}
                    onClickSave={this.handleSaveSignAge.bind(this)}
                    onClickClose={() => this.opPopupPage("popup-sigSection")}
                  />
                </div>
              </div>
            </div>
            <div className="display-flex-normals margin-bottom-15px"></div>
          </div>
        </div>
        {this.state.deletePopUpVisible &&
          <PopUp
            type={"delete"}
            class={"app-popup app-popup-show"}
            onClick={() => this.openDeletePopUp(null)}
            onClickDelete={
              () => this.handleDelete(this.state.deleteType)
            }
          />
        }
        {this.state.savePopUpVisible && (
          <PopUp
            type={"save"}
            class={"app-popup app-popup-show"}
            onClick={() => this.opPopupPage("popup-compHead")}
          />
        )}
        <ReactTooltip />
      </div>
    );
  }
}

export default FormEditPerformance;
