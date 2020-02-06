import React, { Component } from "react";

class FormSignPersonal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      formIdentityVisible: false,
      formAddressVisible: false,
      formFamilyVisible: false,
      formFormalEducationVisible: false,
      formInformalEducationVisible: false,
      formWorkExperienceVisible: false,
      formLanguageSkillVisible: false,
      formOrgExperienceVisible: false,
      formAbilityVisible: false,
      formDeficiencyVisible: false,
      formReferenceVisible: false,
      formEmergencyContactVisible: false,
      formDocumentVisible: false,
      formSocialMediaVisible: false,
      activeTab: "",
      tabMenu: [
        'Identity',
        'Address',
        'Family',
        'Formal Education',
        'Informal Education',
        'Work Experience',
        'Language Skill',
        'Organization Experience',
        'Ability',
        'Deficiency',
        'Reference',
        'Emergency Contact',
        'Document',
        'Social Media',
      ]
    }
  }


  opNavigator = (title) => {
    let cl = title === this.state.activeTab ? 'c-n-link active' : 'c-n-link'
    return (
      <li key={title} className={cl} onClick={this.opContent(title)}>
        {title}
      </li>
    );
  };

  opContent = title => e => {
    e.preventDefault();

    let allStateVisibleFalse = {
      ...this.state,
      formIdentityVisible: false,
      formAddressVisible: false,
      formFamilyVisible: false,
      formFormalEducationVisible: false,
      formInformalEducationVisible: false,
      formWorkExperienceVisible: false,
      formLanguageSkillVisible: false,
      formOrgExperienceVisible: false,
      formAbilityVisible: false,
      formDeficiencyVisible: false,
      formReferenceVisible: false,
      formEmergencyContactVisible: false,
      formDocumentVisible: false,
      formSocialMediaVisible: false,
      activeTab: title
    }

    switch (title) {
      case "Identity":
        allStateVisibleFalse = {
          ...allStateVisibleFalse,
          formIdentityVisible: true
        }
        break;
      case "Address":
        allStateVisibleFalse = {
          ...allStateVisibleFalse,
          formAddressVisible: true
        }
        break;
      case "Family":
        allStateVisibleFalse = {
          ...allStateVisibleFalse,
          formFamilyVisible: true
        }
        break;
      case "Formal Education":
        allStateVisibleFalse = {
          ...allStateVisibleFalse,
          formFormalEducationVisible: true
        }
        break;
      case "Informal Education":
        allStateVisibleFalse = {
          ...allStateVisibleFalse,
          formInformalEducationVisible: true
        }
        break;
      case "Work Experience":
        allStateVisibleFalse = {
          ...allStateVisibleFalse,
          formWorkExperienceVisible: true
        }
        break;
      case "Language Skill":
        allStateVisibleFalse = {
          ...allStateVisibleFalse,
          formLanguageSkillVisible: true
        }
        break;
      case "Organization Experience":
        allStateVisibleFalse = {
          ...allStateVisibleFalse,
          formOrgExperienceVisible: true
        }
        break;
      case "Ability":
        allStateVisibleFalse = {
          ...allStateVisibleFalse,
          formAbilityVisible: true
        }
        break;
      case "Deficiency":
        allStateVisibleFalse = {
          ...allStateVisibleFalse,
          formDeficiencyVisible: true
        }
        break;
      case "Reference":
        allStateVisibleFalse = {
          ...allStateVisibleFalse,
          formReferenceVisible: true
        }
        break;
      case "Emergency Contact":
        allStateVisibleFalse = {
          ...allStateVisibleFalse,
          formEmergencyContactVisible: true
        }
        break;
      case "Document":
        allStateVisibleFalse = {
          ...allStateVisibleFalse,
          formDocumentVisible: true
        }
        break;
      case "Social Media":
        allStateVisibleFalse = {
          ...allStateVisibleFalse,
          formSocialMediaVisible: true
        }
        break;
      default:
        break;
    }
    this.setState(allStateVisibleFalse);
  };
  render() {
    return (
      <div className="vertical-tab-content active">

        <form action="#">
          <div className="padding-15px grid grid-2x grid-mobile-none gap-10px">
            <div className="popup-scroll popup-col-1">
              <ul className="vertical-tab">
                {this.state.tabMenu.map((data, index) => { return this.opNavigator(data) })}
              </ul>
            </div>
            <div className="column-2">
              <div className="margin-bottom-15px">
                REQUESTOR
                </div>
            </div>
          </div>

          <div className="padding-15px">
            <div className="grid grid-2x">
              <div className="col-1" />
              <div className="col-2 content-right">
                  <button
                    style={{ marginLeft: "15px" }}
                    className="btn btn-blue"
                    type="button"
                    onClick={this.props.onSave}
                  >
                    <span>SAVE</span>
                  </button>
                <button
                  style={{ marginLeft: "15px" }}
                  onClick={this.props.onClickClose}
                  className="btn btn-blue"
                  type="button">
                  <span>CLOSE</span>
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    )
  }
}

export default FormSignPersonal;