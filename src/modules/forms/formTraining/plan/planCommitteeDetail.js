import React, { Component } from "react";
import LoadingBar from "react-top-loading-bar";
import PopUp from "../../../../components/pages/PopUpAlert";
import FormSearchEmployee from "../../formEmployee/formSearchEmployee";
import DropDown from '../../../../modules/popup/DropDown';

class formComDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      deletePopUpVisible: false,
      savePopUpVisible: false,
      formSearchEmpVisible: false
    };
  }

  startFetch = () => {
    this.LoadingBar.continousStart();
  };

  onFinishFetch = () => {
    if (typeof this.LoadingBar === "object") this.LoadingBar.complete();
  };

  openSearch() {
    this.setState({ formSearchEmpVisible: !this.state.formSearchEmpVisible });
  }

  openSavePopUp = () => {
    this.setState({ savePopUpVisible: !this.state.savePopUpVisible });
  };

  openDeletePopup = index => {
    this.setState({
      deletePopUpVisible: !this.state.deletePopUpVisible,
      selectedIndex: index
    });
  };

  render() {
    return (
      <div className={"app-popup app-popup-show"}>
        <LoadingBar onRef={ref => (this.LoadingBar = ref)} />
        <div className="padding-top-20px" />
        <div className="popup-content-small background-white border-radius">
          <div className="popup-panel grid grid-2x">
            <div className="col-1">
              <div className="popup-title">
                {this.props.type === "create"
                  ? "Training Plan - Committee - Create Form"
                  : "Training Plan - Committee - Edit Form"}
              </div>
            </div>
            <div className="col-2 content-right">
              <button
                    style={{ marginLeft: "15px" }}
                    className="btn btn-grey btn-circle"
                    type="button"
                    onClick={this.props.onClickClose}
                  >
                    <i className="fa fa-lg fa-times"></i>
              </button>
            </div>
          </div>

          <form action="#">
            <div className="border-bottom padding-15px">
              <div className="card-date-picker margin-bottom-20px">
                <div className="margin-5px">
                  <div className="txt-site txt-11 txt-main txt-bold">
                    <h4>Committee Name <span style={{ color: "red" }}>*</span></h4>
                  </div>
                </div>
                <div className="double">
                <input
                  style={{ backgroundColor: "#E6E6E6" }}
                  readOnly
                  className='input'
                  type="text"
                  placeholder=""
                />
                <button
                  disabled={this.props.type === "edit"}
                  className="btn btn-grey border-left btn-no-radius"
                  type="button"
                  onClick={() => this.openSearch()}
                >
                  <i className="fa fa-lg fa-search"/>
                </button>
                </div>
              </div>

              <div className="margin-bottom-20px">
                <div className="margin-5px">
                  <div className="txt-site txt-11 txt-main txt-bold">
                    <h4>Total Days <span style={{ color: "red" }}>*</span></h4>
                  </div>
                </div>
                <input
                  type="text"
                  className="txt txt-sekunder-color"
                  placeholder=""
                  required
                />
              </div>

              <div className="margin-bottom-20px">
                <div className="margin-5px">
                  <div className="txt-site txt-11 txt-main txt-bold">
                    <h4>Day Type <span style={{ color: "red" }}>*</span></h4>
                  </div>
                </div>
                <DropDown
                    title="-- please select day type --"
                    onChange={(dt) => console.log(dt)}
                    // type="bizpar"
                    // disabled={this.props.type === "edit" ? true : false}
                    data={[
                      {id: '1', title: 'internal', value: 'internal'}, 
                      {id: '1', title: 'eksternal', value: 'eksternal'}]} />
              </div>

              <div className="margin-bottom-20px">
                <div className="margin-5px">
                  <div className="txt-site txt-11 txt-main txt-bold">
                    <h4>Location Type <span style={{ color: "red" }}>*</span></h4>
                  </div>
                </div>
                <DropDown
                    title="-- please select location type --"
                    onChange={(dt) => console.log(dt)}
                    // type="bizpar"
                    // disabled={this.props.type === "edit" ? true : false}
                    data={[
                      {id: '1', title: 'internal', value: 'internal'}, 
                      {id: '1', title: 'eksternal', value: 'eksternal'}]} />
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
                    onClick={() => this.props.onClickSave()}
                  >
                    <span>SAVE</span>
                  </button>
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

            {this.state.savePopUpVisible && (
              <PopUp
                type={"save"}
                class={"app-popup app-popup-show"}
                onClick={this.openSavePopUp.bind(this)}
              />
            )}

            {this.state.deletePopUpVisible && (
              <PopUp
                type={"delete"}
                class={"app-popup app-popup-show"}
                onClick={this.openDeletePopup}
              />
            )}

            {this.state.formSearchEmpVisible && (
              <FormSearchEmployee
                onClickClose={this.openSearch.bind(this)}
                // onClickEmp={this.addEmployeeHandler.bind(this)}
              />
            )}
          </form>
        </div>
        <div className="padding-bottom-20px" />
      </div>
    );
  }
}

export default formComDetail;
