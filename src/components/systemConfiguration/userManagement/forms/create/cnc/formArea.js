import React, { Component } from "react";
import M from "moment";
import DropDown from "../../../../../../modules/popup/DropDown";
import PopUp from "../../../../../pages/PopUpAlert";

import FormAreaDet from "../cnc/formAreaDet";
import TableAreaDet from "../../../tables/confCNC/tableCncAreaDet";

const defaultPayload = {
  "areaDevelopmentSectionItemID": "",
  "areaDevelopmentSectionItemCategory": "",
  "areaDevelopmentSectionItemDescription": "",
  "areaDevelopmentSectionItems": []
}

class FormArea extends Component {
  constructor(props) {
    super(props);
    this.state = {
      createAreaItem: false,
      savePopUpVisible: false,
      type: props.type,
      data: props.data ? props.data : { ...defaultPayload, areaDevelopmentSectionItemID: "CNCAD-" + M() }
    }
  }

  opPopupPage = type => {
    let savePopUpVisible;
    this.setState({
      editAreaItem: false,
      classAppSlidePage: "app-side-page"
    });
    switch (type) {
      case "popup-areaItem":
        savePopUpVisible = this.state.savePopUpVisible
          ? !this.state.savePopUpVisible
          : false;
        this.setState({
          createAreaItem: !this.state.createAreaItem,
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

  renderFormEdit = () => {
    return (
      <div className="padding-10px">
        <div className="app-open-close margin-bottom-20px">
          <input
            type="checkbox"
            name="navmenu"
            className="app-open-close-input"
            id="navmenu-ait"
          />
          <div className="grid grid-2x margin-bottom-10px">
            <div className="col-1">
              <div className="display-flex-normal margin-top-10px">
                <i className="fas fa-certificate margin-right-5px"></i>
                <span className="txt-site txt-11 txt-main">
                  Area Development Item
                </span>
              </div>
            </div>
            <div className="col-2 content-right">
              <label htmlFor="navmenu-ait">
                <div className="app-open-close-icon"></div>
              </label>
              <button
                type="button"
                className="btn btn-small-circle btn-sekunder margin-left-5px"
                onClick={() => this.opPopupPage("popup-areaItem")}
              >
                <i className="fa fa-lw fa-plus" />
              </button>
            </div>
          </div>
          {this.state.createAreaItem && (
            <FormAreaDet
              type={"create"}
              onClickSave={this.props.onClickSave.bind(this)}
              onClickClose={() => this.opPopupPage("popup-areaItem")}
            />
          )}
          <div className="app-open-close-content">
            <TableAreaDet
              data={this.state.data}
              onClick={this.props.onDeletePopup}
              onClickSave={this.props.onClickSave.bind(this)}
              onClickClose={() => this.opPopupPage("popup-areaItem")}
            />
          </div>
        </div>
      </div>
    );
  };

  render() {
    let { type, data } = this.state
    return (
      <div className="app-popup app-popup-show">
        <div className="padding-top-20px" />
        <div className="popup-content-small background-white border-radius">
          <div className="popup-panel grid grid-2x">
            <div className="col-1">
              <div className="popup-title">
                Area Development -{" "}
                {this.props.type === "create" ? "Create Form" : "Edit Form"}
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
            <div className="padding-10px">
              <div className="app-open-close margin-bottom-20px">
                <input
                  type="checkbox"
                  name="navmenu"
                  className="app-open-close-input"
                  id="navmenu-arc"
                />
                <div className="grid grid-2x margin-bottom-10px">
                  <div className="col-1">
                    <div className="display-flex-normal margin-top-10px">
                      <i className="fas fa-certificate margin-right-5px"></i>
                      <span className="txt-site txt-11 txt-main">
                        Area Development
                      </span>
                    </div>
                  </div>
                  <div className="col-2 content-right">
                    <label htmlFor="navmenu-arc">
                      <div className="app-open-close-icon"></div>
                    </label>
                  </div>
                </div>
                <div className="app-open-close-content">
                  <div className="padding-15px grid grid-2x grid-mobile-none gap-15px">
                    <div className="column-1">
                      <div className="margin-bottom-20px">
                        <div className="margin-5px">
                          <div className="txt-site txt-11 txt-main txt-bold">
                            <h4>Component ID</h4>
                          </div>
                        </div>
                        <input
                          readOnly
                          value={data.areaDevelopmentSectionItemID}
                          style={{ backgroundColor: "#E6E6E6" }}
                          type="text"
                          className="txt txt-sekunder-color"
                          placeholder=""
                          required
                        />
                      </div>
                      <div className="margin-bottom-20px">
                        <div className="margin-5px">
                          <div className="txt-site txt-11 txt-main txt-bold">
                            <h4>
                              Component Type{" "}
                              <span style={{ color: "red" }}>*</span>
                            </h4>
                          </div>
                        </div>
                        <DropDown
                          title="-- please select type --"
                          type="bizpar"
                          disabled={this.props.type === "view" ? true : false}
                          data={[]}
                        />
                      </div>
                    </div>
                    <div className="column-2">
                      <div className="margin-bottom-20px">
                        <div className="margin-5px">
                          <div className="txt-site txt-11 txt-main txt-bold">
                            <h4>
                              Description<span style={{ color: "red" }}>*</span>
                            </h4>
                          </div>
                        </div>
                        <textarea
                          type="text"
                          className="txt txt-sekunder-color"
                          rows={5}
                          placeholder={""}
                          value={data.areaDevelopmentSectionItemDescription}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="border-top padding-15px content-right">
                    <button
                      type="button"
                      onClick={this.props.onClickClose}
                      className="btn btn-primary margin-right-10px"
                    >
                      BACK
                    </button>
                    <button
                      className="btn btn-blue"
                      type="button"
                      onClick={this.props.onClickSave}
                    >
                      SAVE
                    </button>
                  </div>
                </div>
              </div>
            </div>
            {type === "edit" ? this.renderFormEdit() : null}
          </form>
        </div>
        {this.state.savePopUpVisible && (
          <PopUp
            type={"save"}
            class={"app-popup app-popup-show"}
            // onClick={() => this.opPopupPage("popup-criVal")}
          />
        )}
      </div>
    );
  }
}

export default FormArea;
