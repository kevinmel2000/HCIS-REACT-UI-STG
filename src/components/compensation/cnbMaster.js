import React, { Component } from "react";
import FormMasterComponent from "../../modules/forms/formCompensation/formMasterComponent";
import FormMasterPercentageP from "../../modules/forms/formCompensation/formMasterPercentageP";
import FormMasterPercentagePMax from "../../modules/forms/formCompensation/formMasterPercentagePMax";
import FormMasterCoa from "../../modules/forms/formCompensation/formMasterCoa";
import FormParameterBase from "../../modules/forms/formCompensation/formParamaterBase";
import FormMasterThrDate from "../../modules/forms/formCompensation/formMasterThr";
import FormMasterWorking from "../../modules/forms/formCompensation/formMasterWorking";
import FormMasterJournal from "../../modules/forms/formCompensation/formMasterJournal";
import FormMasterId from "../../modules/forms/formCompensation/formMasterId";
import FormMasterParameter from "../../modules/forms/formCompensation/formMasterParameter";

class CnbMaster extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formComponent: true,
      formParameter: false,
      formPercentageParameter: false,
      formPercentageParameterMax: false,
      formCoa: false,
      formIdProcess: false,
      formWorkingType: false,
      formJournal: false,
      formThrDate: false,
      formParameterBase: false,
      activeTab: "Component",
      tabMenu: [
        "Component",
        "Parameter",
        "Percentage Parameter",
        "Percentage Parameter Max",
        "COA",
        "ID Process",
        "Working Type",
        "Journal",
        "THR Date",
        "Parameter Base Detail"
      ]
    };
  }

  opNavigator = title => {
    let cl = title === this.state.activeTab ? "c-n-link active" : "c-n-link";
    return (
      <li key={title} className={cl} onClick={this.opContent(title)}>
        {title}
      </li>
    );
  };

  opContent = title => e => {
    let allStateVisibleFalse = {
      ...this.state,
      formComponent: false,
      formParameter: false,
      formPercentageParameter: false,
      formPercentageParameterMax: false,
      formCoa: false,
      formIdProcess: false,
      formWorkingType: false,
      formJournal: false,
      formThrDate: false,
      formParameterBase: false,
      activeTab: title
    };

    switch (title) {
      case "Component":
        allStateVisibleFalse = {
          ...allStateVisibleFalse,
          formComponent: true
        };
        break;
      case "Parameter":
        allStateVisibleFalse = {
          ...allStateVisibleFalse,
          formParameter: true
        };
        break;
      case "Percentage Parameter":
        allStateVisibleFalse = {
          ...allStateVisibleFalse,
          formPercentageParameter: true
        };
        break;
      case "Percentage Parameter Max":
        allStateVisibleFalse = {
          ...allStateVisibleFalse,
          formPercentageParameterMax: true
        };
        break;
      case "COA":
        allStateVisibleFalse = {
          ...allStateVisibleFalse,
          formCoa: true
        };
        break;
      case "ID Process":
        allStateVisibleFalse = {
          ...allStateVisibleFalse,
          formIdProcess: true
        };
        break;
      case "Working Type":
        allStateVisibleFalse = {
          ...allStateVisibleFalse,
          formWorkingType: true
        };
        break;
      case "Journal":
        allStateVisibleFalse = {
          ...allStateVisibleFalse,
          formJournal: true
        };
        break;
      case "THR Date":
        allStateVisibleFalse = {
          ...allStateVisibleFalse,
          formThrDate: true
        };
        break;
      case "Parameter Base Detail":
        allStateVisibleFalse = {
          ...allStateVisibleFalse,
          formParameterBase: true
        };
        break;
      default:
        break;
    }
    this.setState(allStateVisibleFalse);
  };

  render() {
    let {
      formComponent,
      formParameter,
      formPercentageParameter,
      formPercentageParameterMax,
      formCoa,
      formIdProcess,
      formWorkingType,
      formJournal,
      formParameterBase,
      formThrDate
    } = this.state;
    return (
      <div className="main-content">
        <div className="card-navigator">
          <div className="c-n-top">
            <div className="txt-site txt-18 txt-bold txt-main padding-top-5px">
              Master
            </div>
          </div>

          <div className="c-n-mid">
            <div className="c-n-col-1" style={{ width: "70%" }}>
              <ul className="vertical-tab">
                {this.state.tabMenu.map((data, index) => {
                  return this.opNavigator(data);
                })}
              </ul>
            </div>
            <div className="c-n-col-2" style={{ marginLeft: -50 }}>
              {formComponent && <FormMasterComponent />}

              {formParameter && <FormMasterParameter />}

              {formPercentageParameter && <FormMasterPercentageP />}

              {formPercentageParameterMax && <FormMasterPercentagePMax />}

              {formCoa && <FormMasterCoa />}

              {formIdProcess && <FormMasterId />}

              {formJournal && <FormMasterJournal />}

              {formThrDate && <FormMasterThrDate />}

              {formWorkingType && <FormMasterWorking />}

              {formParameterBase && <FormParameterBase />}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default CnbMaster;
