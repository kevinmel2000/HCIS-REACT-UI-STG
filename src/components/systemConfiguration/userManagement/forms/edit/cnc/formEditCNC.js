import React, { Component } from "react";
import ReactTooltip from "react-tooltip";
import FormCNC from "./formCNC";

//formChild
import FormCncCompHeader from "../../create/cnc/formCncCompHead";
import FormFeedback from "../../create/cnc/formFeedback";
import FormChallenge from "../../create/cnc/formChallenge";
import FormAspiration from "../../create/cnc/formAspiration";
import FormImprove from "../../create/cnc/formImprove";
import FormArea from "../../create/cnc/formArea";
import FormCNCSigSection from "../../create/cnc/formCncSigSection";

//table
import TableCncCompHead from "../../../tables/confCNC/tableCncCompHeader";
import TableFeedbackItem from "../../../tables/confCNC/tablefeedbackItem";
import TableChallengeItem from "../../../tables/confCNC/tableChallengeItem";
import TableAspirationItem from "../../../tables/confCNC/tableAspirationItem";
import TableImproveItem from "../../../tables/confCNC/tableImproveTargetItem";
import TableCncArea from "../../../tables/confCNC/tableCncArea";
import TableCncSegSection from "../../../tables/confCNC/tableCncSigSection";

import PopUp from "../../../../../pages/PopUpAlert";

class FormEditCNC extends Component {
  constructor(props) {
    super(props);
    this.state = {
      createCompHead: false,
      createFeedback: false,
      createChallenge: false,
      createAspiration: false,
      createImprove: false,
      createArea: false,
      createSigSection: false,
      savePopUpVisible: false,
      dataCnc: props.data
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.data !== prevProps.data) return this.setState({ dataCnc: this.props.data })
  }

  opPopupPage = type => {
    let savePopUpVisible;
    this.setState({
      editCompHead: false,
      editFeedback: false,
      editAspiration: false,
      editImprove: false,
      editArea: false,
      editSigSection: false,
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
      case "popup-feedback":
        savePopUpVisible = this.state.savePopUpVisible
          ? !this.state.savePopUpVisible
          : false;
        this.setState({
          createFeedback: !this.state.createFeedback,
          savePopUpVisible
        });
        break;
      case "popup-challenge":
        savePopUpVisible = this.state.savePopUpVisible
          ? !this.state.savePopUpVisible
          : false;
        this.setState({
          createChallenge: !this.state.createChallenge,
          savePopUpVisible
        });
        break;
      case "popup-aspiration":
        savePopUpVisible = this.state.savePopUpVisible
          ? !this.state.savePopUpVisible
          : false;
        this.setState({
          createAspiration: !this.state.createAspiration,
          savePopUpVisible
        });
        break;
      case "popup-improve":
        savePopUpVisible = this.state.savePopUpVisible
          ? !this.state.savePopUpVisible
          : false;
        this.setState({
          createImprove: !this.state.createImprove,
          savePopUpVisible
        });
        break;
      case "popup-area":
        savePopUpVisible = this.state.savePopUpVisible
          ? !this.state.savePopUpVisible
          : false;
        this.setState({
          createArea: !this.state.createArea,
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
      selectedIndex: index
    });
  };

  render() {
    return (
      <div className="a-s-p-place active">
        <div className="a-s-p-top">
          <div className="grid grid-2x">
            <div className="col-1">
              <div className="display-flex-normal margin-top-10px">
                <i className="fas fa-certificate"></i>
                <span className="txt-site txt-11 txt-main margin-left-10px">
                  CNC Template
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
                  id="navmenu-cnc"
                />
                <div className="grid grid-2x margin-bottom-10px">
                  <div className="col-1">
                    <div className="display-flex-normal margin-top-10px">
                      <i className="fas fa-certificate margin-right-5px"></i>
                      <span className="txt-site txt-11 txt-main">
                        CNC Template Header
                      </span>
                    </div>
                  </div>
                  <div className="col-2 content-right">
                    <label htmlFor="navmenu-cnc">
                      <div className="app-open-close-icon"></div>
                    </label>
                  </div>
                </div>
                <div className="app-open-close-content">
                  <FormCNC
                    type={"update"}
                    dataCnc={this.state.dataCnc}
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
                      <i className="fas fa-certificate margin-right-5px"></i>
                      <span className="txt-site txt-11 txt-main">
                        CNC Component Header
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
                  <FormCncCompHeader
                    type={"create"}
                    onClickSave={this.props.onClickSave.bind(this)}
                    onClickClose={() => this.opPopupPage("popup-compHead")}
                    onClick={this.props.onDeletePopUp}
                  />
                )}
                <div className="app-open-close-content">
                  <TableCncCompHead
                    dataCnc={this.state.dataCnc}
                    onDeletePopUp={this.props.onDeletePopUp.bind(this)}
                    onClickSave={this.props.onClickSave.bind(this)}
                    onClickClose={() => this.opPopupPage("popup-compHead")}
                    onClick={this.props.onDeletePopUp}
                  />
                </div>
              </div>

              {/* CNC Main Section */}
              <div className="app-open-close margin-bottom-20px">
                <input
                  type="checkbox"
                  name="navmenu"
                  className="app-open-close-input"
                  id="navmenu-cmc"
                />
                <div className="grid grid-2x margin-bottom-10px">
                  <div className="col-1">
                    <div className="display-flex-normal margin-top-10px">
                      <i className="fas fa-certificate margin-right-5px"></i>
                      <span className="txt-site txt-11 txt-main">
                        CNC Main Section
                      </span>
                    </div>
                  </div>
                  <div className="col-2 content-right">
                    <label htmlFor="navmenu-cmc">
                      <div className="app-open-close-icon"></div>
                    </label>
                  </div>
                </div>
                <div className="app-open-close-content">
                  <div className="app-open-close margin-bottom-20px padding-5px">
                    <input
                      type="checkbox"
                      name="navmenu"
                      className="app-open-close-input"
                      id="navmenu-cf"
                    />
                    {/* FeedBack */}
                    <div className="grid grid-2x margin-bottom-10px">
                      <div className="col-1">
                        <div className="display-flex-normal margin-top-10px">
                          <i className="fas fa-certificate margin-right-5px"></i>
                          <span className="txt-site txt-11 txt-main">
                            Feedback
                          </span>
                        </div>
                      </div>
                      <div className="col-2 content-right">
                        <label htmlFor="navmenu-cf">
                          <div className="app-open-close-icon"></div>
                        </label>
                      </div>
                    </div>
                    {/* child */}
                    <div className="app-open-close-content">
                      <div className="app-open-close margin-bottom-20px padding-5px">
                        <input
                          type="checkbox"
                          name="navmenu"
                          className="app-open-close-input"
                          id="navmenu-fi"
                        />
                        <div className="grid grid-2x margin-bottom-10px">
                          <div className="col-1">
                            <div className="display-flex-normal margin-top-10px">
                              <i className="fas fa-certificate margin-right-5px"></i>
                              <span className="txt-site txt-11 txt-main">
                                FeedBack Item
                              </span>
                            </div>
                          </div>
                          <div className="col-2 content-right">
                            <label htmlFor="navmenu-fi">
                              <div className="app-open-close-icon"></div>
                            </label>
                            <button
                              className="btn btn-small-circle btn-sekunder margin-left-5px"
                              onClick={() => this.opPopupPage("popup-feedback")}
                            >
                              <i className="fa fa-lw fa-plus" />
                            </button>
                          </div>
                        </div>
                        {this.state.createFeedback && (
                          <FormFeedback
                            type={"create"}
                            onClickSave={this.props.onClickSave.bind(this)}
                            onClickClose={() => this.opPopupPage("popup-feedback")}
                          />
                        )}
                        <div className="app-open-close-content">
                          <TableFeedbackItem
                            dataCnc={this.state.dataCnc}
                            onDeletePopUp={this.props.onDeletePopUp.bind(this)}
                            onClickSave={this.props.onClickSave.bind(this)}
                            onClickClose={() => this.opPopupPage("popup-feedback")}
                          />
                        </div>
                      </div>

                      <div className="app-open-close margin-bottom-20px padding-5px">
                        <input
                          type="checkbox"
                          name="navmenu"
                          className="app-open-close-input"
                          id="navmenu-ci"
                        />
                        <div className="grid grid-2x margin-bottom-10px">
                          <div className="col-1">
                            <div className="display-flex-normal margin-top-10px">
                              <i className="fas fa-certificate margin-right-5px"></i>
                              <span className="txt-site txt-11 txt-main">
                                Challenge Item
                              </span>
                            </div>
                          </div>
                          <div className="col-2 content-right">
                            <label htmlFor="navmenu-ci">
                              <div className="app-open-close-icon"></div>
                            </label>
                            <button
                              className="btn btn-small-circle btn-sekunder margin-left-5px"
                              onClick={() => this.opPopupPage("popup-challenge")}
                            >
                              <i className="fa fa-lw fa-plus" />
                            </button>
                          </div>
                        </div>
                        {this.state.createChallenge && (
                          <FormChallenge
                            type={"create"}
                            onClickSave={this.props.onClickSave.bind(this)}
                            onClickClose={() => this.opPopupPage("popup-challenge")}
                          />
                        )}
                        <div className="app-open-close-content">
                          <TableChallengeItem
                            dataCnc={this.state.dataCnc}
                            onDeletePopUp={this.props.onDeletePopUp.bind(this)}
                            onClickSave={this.props.onClickSave.bind(this)}
                            onClickClose={() => this.opPopupPage("popup-challenge")}
                          />
                        </div>
                      </div>
                      <div className="app-open-close margin-bottom-20px padding-5px">
                        <input
                          type="checkbox"
                          name="navmenu"
                          className="app-open-close-input"
                          id="navmenu-api"
                        />
                        <div className="grid grid-2x margin-bottom-10px">
                          <div className="col-1">
                            <div className="display-flex-normal margin-top-10px">
                              <i className="fas fa-certificate margin-right-5px"></i>
                              <span className="txt-site txt-11 txt-main">
                                Aspiration Item
                              </span>
                            </div>
                          </div>
                          <div className="col-2 content-right">
                            <label htmlFor="navmenu-api">
                              <div className="app-open-close-icon"></div>
                            </label>
                            <button
                              className="btn btn-small-circle btn-sekunder margin-left-5px"
                              onClick={() => this.opPopupPage("popup-aspiration")}
                            >
                              <i className="fa fa-lw fa-plus" />
                            </button>
                          </div>
                        </div>
                        {this.state.createAspiration && (
                          <FormAspiration
                            type={"create"}
                            onClickSave={this.props.onClickSave.bind(this)}
                            onClickClose={() => this.opPopupPage("popup-aspiration")}
                          />
                        )}
                        <div className="app-open-close-content">
                          <TableAspirationItem
                            dataCnc={this.state.dataCnc}
                            onDeletePopUp={this.props.onDeletePopUp.bind(this)}
                            onClickSave={this.props.onClickSave.bind(this)}
                            onClickClose={() => this.opPopupPage("popup-aspiration")}
                          />
                        </div>
                      </div>
                      <div className="app-open-close margin-bottom-20px padding-5px">
                        <input
                          type="checkbox"
                          name="navmenu"
                          className="app-open-close-input"
                          id="navmenu-imt"
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
                            <label htmlFor="navmenu-imt">
                              <div className="app-open-close-icon"></div>
                            </label>
                            <button
                              className="btn btn-small-circle btn-sekunder margin-left-5px"
                              onClick={() => this.opPopupPage("popup-improve")}
                            >
                              <i className="fa fa-lw fa-plus" />
                            </button>
                          </div>
                        </div>
                        {this.state.createImprove && (
                          <FormImprove
                            type={"create"}
                            onClickSave={this.props.onClickSave.bind(this)}
                            onClickClose={() => this.opPopupPage("popup-improve")}
                          />
                        )}
                        <div className="app-open-close-content">
                          <TableImproveItem
                            dataCnc={this.state.dataCnc}
                            onDeletePopUp={this.props.onDeletePopUp.bind(this)}
                            onClickSave={this.props.onClickSave.bind(this)}
                            onClickClose={() => this.opPopupPage("popup-improve")}
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
                      id="navmenu-are"
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
                        <label htmlFor="navmenu-are">
                          <div className="app-open-close-icon"></div>
                        </label>
                        <button
                          className="btn btn-small-circle btn-sekunder margin-left-5px"
                          onClick={() => this.opPopupPage("popup-area")}
                        >
                          <i className="fa fa-lw fa-plus" />
                        </button>
                      </div>
                    </div>
                    {this.state.createArea && (
                      <FormArea
                        type={"create"}
                        onClickSave={this.props.onClickSave.bind(this)}
                        onClickClose={() => this.opPopupPage("popup-area")}
                        onClick={this.props.onDeletePopUp}
                      />
                    )}
                    <div className="app-open-close-content">
                      <TableCncArea
                        dataCnc={this.state.dataCnc}
                        onDeletePopUp={this.props.onDeletePopUp.bind(this)}
                        onClickSave={this.props.onClickSave.bind(this)}
                        onClickClose={() => this.opPopupPage("popup-area")}
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
                  id="navmenu-csc"
                />
                <div className="grid grid-2x margin-bottom-10px">
                  <div className="col-1">
                    <div className="display-flex-normal margin-top-10px">
                      <i className="fas fa-certificate margin-right-5px"></i>
                      <span className="txt-site txt-11 txt-main">
                        CNC Signage Section
                      </span>
                    </div>
                  </div>
                  <div className="col-2 content-right">
                    <label htmlFor="navmenu-csc">
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
                  <FormCNCSigSection
                    type={"create"}
                    onClickSave={this.props.onClickSave.bind(this)}
                    onClickClose={() => this.opPopupPage("popup-sigSection")}
                    onClick={this.props.onDeletePopUp}
                  />
                )}
                <div className="app-open-close-content">
                  <TableCncSegSection
                    dataCnc={this.state.dataCnc}
                    onDeletePopUp={this.props.onDeletePopUp.bind(this)}
                    onClickSave={this.props.onClickSave.bind(this)}
                    onClickClose={() => this.opPopupPage("popup-sigSection")}
                  />
                </div>
              </div>
            </div>
            <div className="display-flex-normals margin-bottom-15px"></div>
          </div>
        </div>
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

export default FormEditCNC;
