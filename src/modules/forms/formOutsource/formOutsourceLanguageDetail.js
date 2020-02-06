import React, { Component } from "react";
import M from "moment";
import DropDown from "../../../modules/popup/DropDown";
import CalendarPicker from "../../../modules/popup/Calendar";

const defaultPayload = {
  "langID": "LANG-" + M(),
  "langName": "",
  "langDesc": ""
};

class FormOutsourceLanguageDetail extends Component {
  constructor(props) {
    super(props);
    let {
      dataLang,
      bizparLanguSkill,
      bizparCompetencySkill
    } = this.props;

    this.state = {
      dataLang: dataLang ? dataLang : defaultPayload,
      bizparLanguSkill,
      bizparCompetencySkill
    };
  }

  render() {
    let { dataLang } = this.state
    return (
      <div className="app-popup app-popup-show">
        <div className="padding-top-20px" />
        <div className="popup-content-mikro background-white border-radius">
          <div className="popup-panel grid grid-2x">
            <div className="col-1" style={{ width: "140%" }}>
              <div className="popup-title">
                {this.props.type === "create"
                  ? "Mastery of Language - Create Form"
                  : this.props.type === "update"
                    ? "Mastery of Language - Edit Form"
                    : "Mastery of Language - View Form"}
              </div>
            </div>
            <div className="col-2 content-right">
              <button
                type="button"
                className="btn btn-circle btn-grey"
                onClick={this.props.onClickClose}
              >
                <i className="fa fa-lg fa-times" />
              </button>
            </div>
          </div>
          <form action="#">
            <div className="padding-15px">
              <div className="margin-bottom-20px">
                <div className="margin-5px">
                  <div className="txt-site txt-11 txt-main txt-bold">
                    <h4>Language ID</h4>
                  </div>
                </div>
                <input
                  readOnly
                  style={{ backgroundColor: "#E6E6E6" }}
                  type="text"
                  className="txt txt-sekunder-color"
                  placeholder=""
                  required
                  value={dataLang.langID}
                />
              </div>

              <div className="margin-bottom-20px">
                <div className="margin-5px">
                  <div className="txt-site txt-11 txt-main txt-bold">
                    <h4>
                      Status <span style={{ color: "red" }}>*</span>
                    </h4>
                  </div>
                </div>
                <DropDown
                  title="-- please select Status --"
                  disabled={this.props.type === "view"}
                  data={[
                    { bizparKey: 'AKTIF', bizparValue: 'AKTIF' }
                  ]}
                  type='bizpar'
                  onChange={e => console.log(e)}
                  value={this.props.type !== 'create' && 'AKTIF'}
                />
              </div>

              <div className="margin-bottom-20px">
                <div className="margin-5px">
                  <div className="txt-site txt-11 txt-main txt-bold">
                    <h4>
                      Language Name <span style={{ color: "red" }}>*</span>
                    </h4>
                  </div>
                </div>
                <input
                  readOnly={this.props.type === "view" ? true : false}
                  style={
                    this.props.type === "view"
                      ? { backgroundColor: "#E6E6E6" }
                      : null
                  }
                  type="text"
                  className="txt txt-sekunder-color"
                  placeholder=""
                  value={dataLang.langName}
                  onChange={(e) => this.setState({ dataLang: { ...dataLang, langName: e.target.value } })}
                />
              </div>
              <div className="margin-bottom-20px">
                <div className="margin-5px">
                  <div className="txt-site txt-11 txt-main txt-bold">
                    <h4>Description</h4>
                  </div>
                </div>
                <textarea
                  value={dataLang.langDesc}
                  onChange={(e) => this.setState({ dataLang: { ...dataLang, langDesc: e.target.value } })}
                  type="text"
                  className="txt txt-sekunder-color"
                  rows={4}
                  placeholder=""
                  readOnly={this.props.type === "view"}
                  style={
                    this.props.type === "view"
                      ? { backgroundColor: "#E6E6E6" }
                      : null
                  }
                />
              </div>
            </div>

            <div className="padding-15px">
              <div className="grid grid-2x">
                <div className="col-1" />
                <div className="col-2 content-right">
                  {this.props.type !== "view" ? (
                    <button
                      style={{ marginLeft: "15px" }}
                      className="btn btn-blue"
                      type="button"
                      onClick={() => this.props.onClickSave(this.props.type, dataLang)}
                    >
                      <span>SAVE</span>
                    </button>
                  ) : null}
                  <button
                    style={{ marginLeft: "15px" }}
                    className="btn btn-primary"
                    type="button"
                    onClick={this.props.onClickClose}
                  >
                    <span>CLOSE</span>
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
        <div className="padding-bottom-20px" />
      </div>
    );
  }
}

export default FormOutsourceLanguageDetail;
