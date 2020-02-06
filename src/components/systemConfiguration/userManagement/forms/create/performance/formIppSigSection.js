import React, { Component } from "react";
import M from "moment";
import DropDown from "../../../../../../modules/popup/DropDown";
import PopUp from "../../../../../pages/PopUpAlert";

import TableIppSigSectionEdit from "../../../tables/confPerformance/tableIppSigSectionEdit";
import FormIppSigSectionDetail from "./formIppSigSectionDetail";

const dataCreate = {
  signageID: '',
  signType: '',
  signPics: []
}

class FormIppSig extends Component {
  constructor(props) {
    super(props);
    this.state = {
      createPIC: false,
      savePopUpVisible: false,
      data: props.rawData ? props.rawData : { ...dataCreate, signageID: 'COMP-SIGN-' + M() },
      dataTable: []
    };
  }

  componentDidMount() {
    this.getDataTable()
  }

  getDataTable() {
    let { signPics } = this.state.data
    let dataTable = !signPics ? [] : signPics.map((value, index) => {
      const { signageItemID, category } = value
      return [
        index += 1,
        signageItemID,
        category ? category.bizparValue : 'Category Name'
      ]
    })
    this.setState({ dataTable, rawData: signPics })
  }

  opPopupPage = type => {
    let savePopUpVisible;
    this.setState({
      editPIC: false,
      classAppSlidePage: "app-side-page"
    });
    switch (type) {
      case "popup-sigPIC":
        savePopUpVisible = this.state.savePopUpVisible
          ? !this.state.savePopUpVisible
          : false;
        this.setState({
          createPIC: !this.state.createPIC,
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
            id="navmenu-issd"
          />
          <div className="grid grid-2x margin-bottom-10px">
            <div className="col-1">
              <div className="display-flex-normal margin-top-10px">
                <i className="fas fa-chart-line margin-right-5px"></i>
                <span className="txt-site txt-11 txt-main">Signage PICs</span>
              </div>
            </div>
            <div className="col-2 content-right">
              <label htmlFor="navmenu-issd">
                <div className="app-open-close-icon"></div>
              </label>
              <button
                type="button"
                className="btn btn-small-circle btn-sekunder margin-left-5px"
                onClick={() => this.opPopupPage("popup-sigPIC")}
              >
                <i className="fa fa-lw fa-plus" />
              </button>
            </div>
          </div>
          {this.state.createPIC && (
            <FormIppSigSectionDetail
              type={"create"}
              bizparSignType={this.props.bizparSignType}
              bizparSignPersonType={this.props.bizparSignPersonType}
              bizparSignPersonTypeItem={this.props.bizparSignPersonTypeItem}
              onClickSave={this.props.onClickSave.bind(this)}
              onClickClose={() => this.opPopupPage("popup-sigPIC")}
            />
          )}
          <div className="app-open-close-content">
            <TableIppSigSectionEdit
              bizparSignType={this.props.bizparSignType}
              bizparSignPersonType={this.props.bizparSignPersonType}
              bizparSignPersonTypeItem={this.props.bizparSignPersonTypeItem}
              dataTable={this.state.dataTable}
              rawData={this.state.rawData}
              onClick={this.props.onDeletePopup}
              onClickSave={this.props.onClickSave.bind(this)}
              onClickClose={() => this.opPopupPage("popup-sigPIC")}
            />
          </div>
        </div>
      </div>
    );
  };

  render() {
    let { type, bizparSignType } = this.props;
    let { data } = this.state
    return (
      <div className="app-popup app-popup-show">
        <div className="padding-top-20px" />
        <div className="popup-content-small background-white border-radius">
          <div className="popup-panel grid grid-2x">
            <div className="col-1">
              <div className="popup-title">
                Signage Section -{" "}
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
                  id="navmenu-iss"
                />
                <div className="grid grid-2x margin-bottom-10px">
                  <div className="col-1">
                    <div className="display-flex-normal margin-top-10px">
                      <i className="fas fa-chart-line margin-right-5px"></i>
                      <span className="txt-site txt-11 txt-main">
                        Signage Section Detail
                      </span>
                    </div>
                  </div>
                  <div className="col-2 content-right">
                    <label htmlFor="navmenu-iss">
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
                        value={data.signageID}
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
                        data={bizparSignType}
                        required
                        value={data.signType ? data.signType.bizparKey : ''}
                        onChange={e => this.setState({ data: { ...data, signType: e } })}
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
                      onClick={() => this.props.onClickSave(type, data)}
                    >
                      SAVE
                    </button>
                  </div>
                </div>
              </div>
            </div>
            {type === "update" ? this.renderFormEdit() : null}
          </form>
        </div>
        {this.state.savePopUpVisible && (
          <PopUp
            type={"save"}
            class={"app-popup app-popup-show"}
            onClick={() => this.opPopupPage("popup-sigPIC")}
          />
        )}
      </div>
    );
  }
}

export default FormIppSig;
