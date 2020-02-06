import React, { Component } from "react";
import M from "moment";
import DropDown from "../../../../../../modules/popup/DropDown";
import PopUp from "../../../../../pages/PopUpAlert";

import TableIppSigPicEdit from "../../../tables/confPerformance/tableIppSigPicEdit";
import FormIppPICDetail from "./formIppPICDetail";

const dataCreate = {
  signageItemID: '',
  category: '',
  items: []
}


class formIppSigSectionDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      createPICDet: false,
      savePopUpVisible: false,
      data: props.rawData ? props.rawData : { ...dataCreate, signageItemID: 'COMP-SIGN-PIC-' + M() }
    };
  }

  componentDidMount() {
    this.getDataTable()
  }

  getDataTable() {
    let { items } = this.state.data
    let dataTable = !items ? [] : items.map((value, index) => {
      const { signageSubItemID, signageSubItemComponent } = value
      return [
        index += 1,
        signageSubItemID,
        signageSubItemComponent ? signageSubItemComponent.bizparValue : 'Category Name'
      ]
    })
    this.setState({ dataTable, rawData: items })
  }


  opPopupPage = type => {
    let savePopUpVisible;
    this.setState({
      editPICDet: false,
      classAppSlidePage: "app-side-page"
    });
    switch (type) {
      case "popup-PICDet":
        savePopUpVisible = this.state.savePopUpVisible
          ? !this.state.savePopUpVisible
          : false;
        this.setState({
          createPICDet: !this.state.createPICDet,
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
            id="navmenu-isdpc"
          />
          <div className="grid grid-2x margin-bottom-10px">
            <div className="col-1">
              <div className="display-flex-normal margin-top-10px">
                <i className="fas fa-chart-line margin-right-5px"></i>
                <span className="txt-site txt-11 txt-main">PIC Component</span>
              </div>
            </div>
            <div className="col-2 content-right">
              <label htmlFor="navmenu-isdpc">
                <div className="app-open-close-icon"></div>
              </label>
              <button
                type="button"
                className="btn btn-small-circle btn-sekunder margin-left-5px"
                onClick={() => this.opPopupPage("popup-PICDet")}
              >
                <i className="fa fa-lw fa-plus" />
              </button>
            </div>
          </div>
          {this.state.createPICDet && (
            <FormIppPICDetail
              type={"create"}
              bizparSignType={this.props.bizparSignType}
              bizparSignPersonType={this.props.bizparSignPersonType}
              bizparSignPersonTypeItem={this.props.bizparSignPersonTypeItem}
              onClickSave={this.props.onClickSave.bind(this)}
              onClickClose={() => this.opPopupPage("popup-PICDet")}
            />
          )}
          <div className="app-open-close-content">
            <TableIppSigPicEdit
              dataTable={this.state.dataTable}
              rawData={this.state.rawData}
              bizparSignType={this.props.bizparSignType}
              bizparSignPersonType={this.props.bizparSignPersonType}
              bizparSignPersonTypeItem={this.props.bizparSignPersonTypeItem}
              onClick={this.props.onDeletePopup}
              onClickSave={this.props.onClickSave.bind(this)}
              onClickClose={() => this.opPopupPage("popup-PICDet")}
            />
          </div>
        </div>
      </div>
    );
  };

  render() {
    let { type, bizparSignPersonType } = this.props;
    let { data } = this.state
    return (
      <div className="app-popup app-popup-show">
        <div className="padding-top-20px" />
        <div className="popup-content-small background-white border-radius">
          <div className="popup-panel grid grid-2x">
            <div className="col-1">
              <div className="popup-title">
                Signage PICs -{" "}
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
                  id="navmenu-isdsp"
                />
                <div className="grid grid-2x margin-bottom-10px">
                  <div className="col-1">
                    <div className="display-flex-normal margin-top-10px">
                      <i className="fas fa-chart-line margin-right-5px"></i>
                      <span className="txt-site txt-11 txt-main">
                        PIC Detail
                      </span>
                    </div>
                  </div>
                  <div className="col-2 content-right">
                    <label htmlFor="navmenu-isdsp">
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
                        value={data.signageItemID}
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
                            PIC Type
                            <span style={{ color: "red" }}>*</span>
                          </h4>
                        </div>
                      </div>
                      <DropDown
                        title="-- please select component --"
                        type="bizpar"
                        data={bizparSignPersonType}
                        required
                        value={data.category ? data.category.bizparKey : ''}
                        onChange={e => this.setState({ data: { ...data, category: e } })}
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
            {type === "update" ? this.renderFormEdit() : null}
          </form>
        </div>
        {this.state.savePopUpVisible && (
          <PopUp
            type={"save"}
            class={"app-popup app-popup-show"}
            onClick={() => this.opPopupPage("popup-PICDet")}
          />
        )}
      </div>
    );
  }
}

export default formIppSigSectionDetail;
