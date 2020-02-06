import React, { Component } from "react";
import Dropzone from "react-dropzone";
import DropDown from '../../../../modules/popup/DropDown';
import CalendarPicker from '../../../../modules/popup/Calendar';

class FormDetailDO extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentWillMount() {
    this.getImage();
  }

  async getImage() {}

  async onDrop(acceptedFiles) {}

  render() {
    return (
      <div className="vertical-tab-content active">
        <form action="#">
          <div className="border-bottom padding-15px grid grid-3x grid-mobile-none gap-15px">
            <div className="column-1">
              <div className="margin-bottom-20px">
                {this.state.imageUrl ? (
                  <img
                    width="100%"
                    height="100%"
                    src={this.state.imageUrl}
                    alt="img"
                  />
                ) : (
                  <div className="margin-5px">
                    <div
                      style={{
                        textAlign: "center",
                        width: "100%",
                        height: "140px",
                        marginLeft: "",
                        borderStyle: "solid",
                        borderWidth: "thin"
                      }}
                    >
                      <span
                        style={{
                          width: "90px",
                          height: "90px"
                        }}
                      >
                        <i
                          className="far fa-image fa-5x"
                          style={{ marginTop: "30px" }}
                        />
                      </span>
                    </div>
                  </div>
                )}
                {this.props.type === "update" ? (
                  <button
                    className="btn btn-red btn-width-all center-blok"
                    type="button"
                    align="center"
                  >
                    <Dropzone onDrop={this.onDrop.bind(this)}>
                      {({ getRootProps, getInputProps }) => (
                        <div {...getRootProps()}>
                          <input {...getInputProps()} />
                          Upload New Photo
                        </div>
                      )}
                    </Dropzone>
                  </button>
                ) : null}
              </div>
            </div>

            <div className="column-2">
              <div className="margin-bottom-20px">
                <div className="margin-5px">
                  <div className="txt-site txt-11 txt-main txt-bold">
                    <h4>NIK</h4>
                  </div>
                </div>
                <input
                  type="text"
                  readOnly
                  style={{ backgroundColor: "#E6E6E6" }}
                  className="txt txt-sekunder-color"
                  placeholder=""
                  required
                />
              </div>

              <div className="margin-bottom-20px">
                <div className="margin-5px">
                  <div className="txt-site txt-11 txt-main txt-bold">
                    <h4>Employee Name</h4>
                  </div>
                </div>
                <input
                  type="text"
                  className="txt txt-sekunder-color"
                  placeholder=""
                  required
                  readOnly={this.props.type === "view" ? true : false}
                  style={
                    this.props.type === "view"
                      ? { backgroundColor: "#E6E6E6" }
                      : null
                  }
                />
              </div>

              <div className="margin-bottom-20px">
                <div className="margin-5px">
                  <div className="txt-site txt-11 txt-main txt-bold">
                    <h4>Birth Place</h4>
                  </div>
                </div>
                <input
                  type="text"
                  className="txt txt-sekunder-color"
                  placeholder=""
                  required
                  readOnly={this.props.type === "view" ? true : false}
                  style={
                    this.props.type === "view"
                      ? { backgroundColor: "#E6E6E6" }
                      : null
                  }
                />
              </div>

              <div className="margin-bottom-20px">
                <div className="margin-5px">
                  <div className="txt-site txt-11 txt-main txt-bold">
                    <h4>Date of Birth</h4>
                  </div>
                </div>
                <CalendarPicker
                  // disabled={this.props.type === 'view' ? true : false}
                  // date={this.state.employeeDataWorkExp.workExperienceStartDate}
                  onChange={(e) => {
                    console.log(e)
                  }} />
                {/* <input
                  type="date"
                  className="txt txt-sekunder-color"
                  placeholder=""
                  required
                  readOnly={this.props.type === "view" ? true : false}
                  style={
                    this.props.type === "view"
                      ? { backgroundColor: "#E6E6E6" }
                      : null
                  }
                /> */}
              </div>

              <div className="margin-bottom-20px">
                <div className="margin-5px">
                  <div className="txt-site txt-11 txt-main txt-bold">
                    <h4>Gender</h4>
                  </div>
                </div>
                <DropDown
                    title="-- please select gender --"
                    onChange={(dt) => console.log(dt)}
                    // type="bizpar"
                    disabled={this.props.type === "view" ? true : false}
                    data={[
                      {id: '1', title: 'Male', value: 'male'}, 
                      {id: '2', title: 'Female', value: 'female'}
                    ]} />
                {/*<select
                  className="cf-select slc slc-sekunder"
                  required
                  disabled={this.props.type === "view" ? true : false}
                  style={
                    this.props.type === "view"
                      ? { backgroundColor: "#E6E6E6" }
                      : null
                  }
                >
                  <option value="1">-- please select gender --</option>
                  <option value="1">Male</option>
                  <option value="1">Female</option>
                </select>*/}
              </div>
            </div>

            <div className="column-3">
              <div className="margin-bottom-20px">
                <div className="margin-5px">
                  <div className="txt-site txt-11 txt-main txt-bold">
                    <h4>Join Date</h4>
                  </div>
                </div>
                <CalendarPicker
                  // disabled={this.props.type === 'view' ? true : false}
                  // date={this.state.employeeDataWorkExp.workExperienceStartDate}
                  onChange={(e) => {
                    console.log(e)
                  }} />
                {/* <input
                  type="date"
                  className="txt txt-sekunder-color"
                  placeholder=""
                  required
                  readOnly={this.props.type === "view" ? true : false}
                  style={
                    this.props.type === "view"
                      ? { backgroundColor: "#E6E6E6" }
                      : null
                  }
                /> */}
              </div>

              <div className="margin-bottom-20px">
                <div className="margin-5px">
                  <div className="txt-site txt-11 txt-main txt-bold">
                    <h4>ID Number</h4>
                  </div>
                </div>
                <input
                  type="text"
                  className="txt txt-sekunder-color"
                  placeholder=""
                  required
                  readOnly={this.props.type === "view" ? true : false}
                  style={
                    this.props.type === "view"
                      ? { backgroundColor: "#E6E6E6" }
                      : null
                  }
                />
              </div>

              <div className="margin-bottom-20px">
                <div className="margin-5px">
                  <div className="txt-site txt-11 txt-main txt-bold">
                    <h4>ID Vendor <span style={{ color: "red" }}>*</span></h4>
                  </div>
                </div>
                <input
                  type="text"
                  className="txt txt-sekunder-color"
                  placeholder=""
                  required
                  readOnly
                  style={{ backgroundColor: "#E6E6E6" }}
                />
              </div>

              <div className="margin-bottom-20px">
                <div className="margin-5px">
                  <div className="txt-site txt-11 txt-main txt-bold">
                    <h4>Vendor Name <span style={{ color: "red" }}>*</span></h4>
                  </div>
                </div>
                <div class="input-group input-grey input-border">
                  <input
                    class="txt txt-transparant text-no-radius text-no-shadow"
                    name="search"
                    readOnly
                    style={{ backgroundColor: "#E6E6E6" }}
                    disabled
                    placeholder=""
                  ></input>
                  <button
                    className="btn btn-blue fa fa-search"
                    type="button"
                    onClick={this.openSearch}
                  ></button>
                </div>
              </div>

              <div className="margin-bottom-20px">
                <div className="margin-5px">
                  <div className="txt-site txt-11 txt-main txt-bold">
                    <h4>Start Date & Finish Date <span style={{ color: "red" }}>*</span></h4>
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
                {/* <input
                  type="date"
                  style={
                    this.props.type === "view"
                      ? { width: "31%", backgroundColor: "#E6E6E6" }
                      : { width: "31%" }
                  }
                  readOnly={this.props.type === "view" ? true : false}
                  className="txt txt-sekunder-color"
                  placeholder=""
                />
                &nbsp; To &nbsp;
                <input
                  type="date"
                  style={
                    this.props.type === "view"
                      ? { width: "31%", backgroundColor: "#E6E6E6" }
                      : { width: "31%" }
                  }
                  readOnly={this.props.type === "view" ? true : false}
                  className="txt txt-sekunder-color"
                  placeholder=""
                /> */}
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
    );
  }
}

export default FormDetailDO;
