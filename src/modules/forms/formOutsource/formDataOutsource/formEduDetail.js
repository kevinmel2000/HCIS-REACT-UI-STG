import React, { Component } from "react";
import LoadingBar from "react-top-loading-bar";
import DropDown from '../../../../modules/popup/DropDown';
import CalendarPicker from '../../../../modules/popup/Calendar';

class FormEduDetail extends Component {
  constructor() {
    super();
    this.state = {
      selectedIndex: null,
      rawData: [],
      dataTableFamily: [],

      createVisible: false,
      deletePopUpVisible: false,
      savePopUpVisible: false,
      createClass: "app-popup"
    };
  }

  componentDidMount() {
    this.onFinishFetch();
  }

  startFetch = () => {
    this.LoadingBar.continousStart();
  };

  onFinishFetch = () => {
    if (typeof this.LoadingBar === "object") this.LoadingBar.complete();
  };

  openCreate = () => {
    if (this.state.createClass === "app-popup app-popup-show") {
      this.setState({ createClass: "app-popup" });
    } else {
      this.setState({
        createClass: "app-popup app-popup-show",
        applicantData: this.defaultApplicant,
        dataRecruitment: "",
        record: ""
      });
    }
  };

  openDeletePopup = index => {
    this.setState({
      deletePopUpVisible: !this.state.deletePopUpVisible,
      selectedIndex: index
    });
  };

  openSavePopUp = () => {
    this.setState({ savePopUpVisible: !this.state.savePopUpVisible });
  };

  handleUpdate = () => {
    this.openSavePopUp();
  };

  render() {
    return (
      <div className={"app-popup app-popup-show"}>
        <LoadingBar onRef={ref => (this.LoadingBar = ref)} />
        <div className="padding-top-20px" />
        <div className="popup-content background-white border-radius">
        <div className="popup-panel grid grid-2x">
            <div className="col-1">
              <div className="popup-title">
                {this.props.type === "create"
                  ? "Outsource - Formal Education - Create Form"
                  : this.props.type === "edit"
                  ? "Outsource - Formal Education - Edit Form"
                  : "Outsource - Formal Education - View Form"}
              </div>
            </div>
          </div>
          <form action="#">
            <div className="border-bottom padding-15px grid grid-2x grid-mobile-none gap-20px">
              <div className="column-1">
                <div className="margin-bottom-20px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>Date</h4>
                    </div>
                  </div>
                  <div className="display-flex-normal width width-full">
                    <CalendarPicker
                      // disabled={this.props.type === 'view' ? true : false}
                      // date={this.state.employeeDataWorkExp.workExperienceStartDate}
                      onChange={(e) => {
                        console.log(e)
                      }} />
                    <div className="txt-site txt-11 txt-primary txt-center margin-10px margin-left-10px margin-right-10px">
                      To
										</div>
                    <CalendarPicker
                      // disabled={this.props.type === 'view' ? true : false}
                      // date={this.state.employeeDataWorkExp.workExperienceEndDate}
                      onChange={(e) => {
                        console.log(e)
                      }} />
                  </div>
                  {/* <div className="grid grid-3x grid-mobile-none gap-20px">
                    <div className="column-1">
                      <input
                        type="date"
                        className="txt txt-sekunder-color"
                        style={
                          this.props.type === "view"
                            ? { backgroundColor: "#E6E6E6" }
                            : null
                        }
                        disabled={this.props.type === "view" ? true : false}
                      />
                    </div>
                    <div className="column-2">
                      <p align="center" className="padding-5px">
                        -
                      </p>
                    </div>
                    <div className="column-3">
                      <input
                        type="date"
                        className="txt txt-sekunder-color"
                        style={
                          this.props.type === "view"
                            ? { backgroundColor: "#E6E6E6" }
                            : null
                        }
                        disabled={this.props.type === "view" ? true : false}
                      />
                    </div>
                  </div> */}
                </div>

                <div className="margin-bottom-20px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>Education Type</h4>
                    </div>
                  </div>
                  <DropDown
                    title="-- please select education type --"
                    onChange={(dt) => console.log(dt)}
                    // type="bizpar"
                    disabled={this.props.type === "view" ? true : false}
                    data={[{id: '1', title: 'COP', value: 'bs-1'}]} />
                  {/*<select
                    style={
                      this.props.type === "view"
                        ? { backgroundColor: "#E6E6E6" }
                        : null
                    }
                    disabled={this.props.type === "view" ? true : false}
                    className="cf-select slc slc-sekunder"
                  >
                    <option value="1">-- please select type --</option>
                    <option value="1">COP</option>
                  </select>*/}
                </div>
                <div className="margin-bottom-20px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>Level of Education</h4>
                    </div>
                  </div>
                  <DropDown
                    title="-- please select level of education --"
                    onChange={(dt) => console.log(dt)}
                    // type="bizpar"
                    disabled={this.props.type === "view" ? true : false}
                    data={[{id: '1', title: 'COP', value: 'bs-1'}]} />
                  {/*<select
                    className="cf-select slc slc-sekunder"
                    style={
                      this.props.type === "view"
                        ? { backgroundColor: "#E6E6E6" }
                        : null
                    }
                    disabled={this.props.type === "view" ? true : false}
                  >
                    <option value="1">-- please select type --</option>
                    <option value="1">COP</option>
                  </select>*/}
                </div>
                <div className="margin-bottom-20px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>Institution</h4>
                    </div>
                  </div>
                  <DropDown
                    title="-- please select institution --"
                    onChange={(dt) => console.log(dt)}
                    // type="bizpar"
                    disabled={this.props.type === "view" ? true : false}
                    data={[{id: '1', title: 'COP', value: 'bs-1'}]} />
                  {/*<select
                    className="cf-select slc slc-sekunder"
                    style={
                      this.props.type === "view"
                        ? { backgroundColor: "#E6E6E6" }
                        : null
                    }
                    disabled={this.props.type === "view" ? true : false}
                  >
                    <option value="1">-- please select type --</option>
                    <option value="1">COP</option>
                  </select>*/}
                </div>
                <div className="margin-bottom-20px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>Department</h4>
                    </div>
                  </div>
                  <DropDown
                    title="-- please select department --"
                    onChange={(dt) => console.log(dt)}
                    // type="bizpar"
                    disabled={this.props.type === "view" ? true : false}
                    data={[{id: '1', title: 'COP', value: 'bs-1'}]} />
                  {/*<select
                    className="cf-select slc slc-sekunder"
                    style={
                      this.props.type === "view"
                        ? { backgroundColor: "#E6E6E6" }
                        : null
                    }
                    disabled={this.props.type === "view" ? true : false}
                  >
                    <option value="1">-- please select type --</option>
                    <option value="1">COP</option>
                  </select>*/}
                </div>
                <div className="margin-bottom-20px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>Degree</h4>
                    </div>
                  </div>
                  <DropDown
                    title="-- please select degre --"
                    onChange={(dt) => console.log(dt)}
                    // type="bizpar"
                    disabled={this.props.type === "view" ? true : false}
                    data={[{id: '1', title: 'COP', value: 'bs-1'}]} />
                  {/*<select
                    className="cf-select slc slc-sekunder"
                    style={
                      this.props.type === "view"
                        ? { backgroundColor: "#E6E6E6" }
                        : null
                    }
                    disabled={this.props.type === "view" ? true : false}
                  >
                    <option value="1">-- please select type --</option>
                    <option value="1">COP</option>
                  </select>*/}
                </div>
                <div className="margin-bottom-20px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>Position Degree</h4>
                    </div>
                  </div>
                  <DropDown
                    title="-- please select position degre --"
                    onChange={(dt) => console.log(dt)}
                    // type="bizpar"
                    disabled={this.props.type === "view" ? true : false}
                    data={[{id: '1', title: 'COP', value: 'bs-1'}]} />
                  {/*<select
                    className="cf-select slc slc-sekunder"
                    style={
                      this.props.type === "view"
                        ? { backgroundColor: "#E6E6E6" }
                        : null
                    }
                    disabled={this.props.type === "view" ? true : false}
                  >
                    <option value="1">-- please select type --</option>
                    <option value="1">COP</option>
                  </select>*/}
                </div>
              </div>
              <div className="column-2">
                <div className="margin-bottom-20px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>Ijazah ID</h4>
                    </div>
                  </div>
                  <CalendarPicker
                      // disabled={this.props.type === 'view' ? true : false}
                      // date={this.state.employeeDataWorkExp.workExperienceStartDate}
                      onChange={(e) => {
                        console.log(e)
                      }} />
                  {/* <input
                    type="text"
                    style={
                      this.props.type === "view"
                        ? { backgroundColor: "#E6E6E6" }
                        : null
                    }
                    disabled={this.props.type === "view" ? true : false}
                    required
                    className="txt txt-sekunder-color"
                    placeholder=""
                  /> */}
                </div>
                <div className="margin-bottom-20px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>Ijazah Date</h4>
                    </div>
                  </div>
                  <input
                    type="date"
                    style={
                      this.props.type === "view"
                        ? { backgroundColor: "#E6E6E6" }
                        : null
                    }
                    disabled={this.props.type === "view" ? true : false}
                    className="txt txt-sekunder-color"
                    required
                  />
                </div>
                <div className="margin-bottom-20px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>GPA</h4>
                    </div>
                  </div>
                  <input
                    type="text"
                    style={
                      this.props.type === "view"
                        ? { backgroundColor: "#E6E6E6" }
                        : null
                    }
                    disabled={this.props.type === "view" ? true : false}
                    required
                    className="txt txt-sekunder-color"
                    placeholder=""
                  />
                </div>
                <div className="margin-bottom-20px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>Education Cost</h4>
                    </div>
                  </div>
                  <input
                    type="text"
                    style={
                      this.props.type === "view"
                        ? { backgroundColor: "#E6E6E6" }
                        : null
                    }
                    disabled={this.props.type === "view" ? true : false}
                    required
                    className="txt txt-sekunder-color"
                    placeholder=""
                  />
                </div>
                <div className="margin-bottom-20px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>City</h4>
                    </div>
                  </div>
                  <input
                    type="text"
                    style={
                      this.props.type === "view"
                        ? { backgroundColor: "#E6E6E6" }
                        : null
                    }
                    disabled={this.props.type === "view" ? true : false}
                    required
                    className="txt txt-sekunder-color"
                    placeholder=""
                  />
                </div>

                <div className="margin-bottom-20px">
                  <div className="margin-5px">
                    <div className="txt-site txt-11 txt-main txt-bold">
                      <h4>Description</h4>
                    </div>
                  </div>
                  <div class="input-border form-group">
                    <textarea
                      class="form-control rounded-0"
                      type="text"
                      style={
                        this.props.type === "view"
                          ? { backgroundColor: "#E6E6E6" }
                          : null
                      }
                      disabled={this.props.type === "view" ? true : false}
                      required
                      placeholder=""
                      cols="80"
                      rows="5"
                    />
                  </div>
                </div>
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
                      onClick={() => this.props.onClickSave()}
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

        <div className="padding-top-20px" />
      </div>
    );
  }
}

export default FormEduDetail;
