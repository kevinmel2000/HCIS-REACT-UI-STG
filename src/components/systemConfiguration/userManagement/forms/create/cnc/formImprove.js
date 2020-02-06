import React, { Component } from "react";
import M from "moment";
import DropDown from "../../../../../../modules/popup/DropDown";
import PopUp from "../../../../../pages/PopUpAlert";

import TableImproveDetail from "../../../tables/confCNC/tableImproveTargetItemDet";
import FormImproveDetail from "./formImproveDetail";

const defaultPayload = {
  "improveTargetItemID": "",
  "improveTargetItemCategory": "",
  "improveTargetItems": []
}

class FormImprove extends Component {
  constructor(props) {
    super(props);
    this.state = {
      createTargetSub: false,
      savePopUpVisible: false,
      type: props.type,
      data: props.data ? props.data : { ...defaultPayload, improveTargetItemID: "CNCI-" + M() }
    }
  }

  opPopupPage = type => {
    let savePopUpVisible;
    this.setState({
      editTargetSub: false,
      classAppSlidePage: "app-side-page"
    });
    switch (type) {
      case "popup-targetSub":
        savePopUpVisible = this.state.savePopUpVisible
          ? !this.state.savePopUpVisible
          : false;
        this.setState({
          createTargetSub: !this.state.createTargetSub,
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
            id="navmenu-itsi"
          />
          <div className="grid grid-2x margin-bottom-10px">
            <div className="col-1">
              <div className="display-flex-normal margin-top-10px">
                <i className="fas fa-certificate margin-right-5px"></i>
                <span className="txt-site txt-11 txt-main">
                  Improve Target Sub Item
                </span>
              </div>
            </div>
            <div className="col-2 content-right">
              <label htmlFor="navmenu-itsi">
                <div className="app-open-close-icon"></div>
              </label>
              <button
                type="button"
                className="btn btn-small-circle btn-sekunder margin-left-5px"
                onClick={() => this.opPopupPage("popup-targetSub")}
              >
                <i className="fa fa-lw fa-plus" />
              </button>
            </div>
          </div>
          {this.state.createTargetSub && (
            <FormImproveDetail
              type={"create"}
              onClickSave={this.props.onClickSave.bind(this)}
              onClickClose={() => this.opPopupPage("popup-targetSub")}
            />
          )}
          <div className="app-open-close-content">
            <TableImproveDetail
              data={this.state.data}
              onClick={this.props.onDeletePopup}
              onClickSave={this.props.onClickSave.bind(this)}
              onClickClose={() => this.opPopupPage("popup-targetSub")}
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
                Improve Target Item -{" "}
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
                  id="navmenu-iti"
                />
                <div className="grid grid-2x margin-bottom-10px">
                  <div className="col-1">
                    <div className="display-flex-normal margin-top-10px">
                      <i className="fas fa-certificate margin-right-5px"></i>
                      <span className="txt-site txt-11 txt-main">
                        Improve Target Item
                      </span>
                    </div>
                  </div>
                  <div className="col-2 content-right">
                    <label htmlFor="navmenu-iti">
                      <div className="app-open-close-icon"></div>
                    </label>
                  </div>
                </div>
                <div className="app-open-close-content">
                  <div className="padding-15px grid grid-2x grid-mobile-none gap-15px">
                    <div className="margin-bottom-20px">
                      <div className="margin-5px">
                        <div className="txt-site txt-11 txt-main txt-bold">
                          <h4>Component ID</h4>
                        </div>
                      </div>
                      <input
                        readOnly
                        value={data.improveTargetItemID}
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
                            Component Type
                            <span style={{ color: "red" }}>*</span>
                          </h4>
                        </div>
                      </div>
                      <DropDown
                        title="-- please select component --"
                        type="bizpar"
                        data={[]}
                        required
                      />
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
            onClick={() => this.opPopupPage("popup-targetSub")}
          />
        )}
      </div>
    );
  }
}

export default FormImprove;
