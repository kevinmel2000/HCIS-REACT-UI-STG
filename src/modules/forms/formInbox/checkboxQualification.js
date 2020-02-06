import React, { Component } from "react";

class pages extends Component {
  render() {
    return this.props.checkboxType === "Gender" ? (
      <div className="grid grid-2x grid-mobile-none gap-5px">
        <div className="column-1">
          <div className="grid grid-2x grid-mobile-none gap-5px">
            <div className="col-1">
              <input
                readOnly={this.props.type === "view" ? true : false}
                style={
                  this.props.type === "view"
                    ? {
                        backgroundColor: "#E6E6E6",
                        textAlign: "left"
                      }
                    : { textAlign: "left" }
                }
                type="checkbox"
              />
              &nbsp;Female
            </div>
            <div className="col-2">
              <input
                readOnly={this.props.type === "view" ? true : false}
                style={
                  this.props.type === "view"
                    ? { backgroundColor: "#E6E6E6" }
                    : null
                }
                type="checkbox"
              />
              &nbsp;Male
            </div>
          </div>
        </div>
        <div className="column-2"> </div>
      </div>
    ) : this.props.checkboxType === "Education" ? (
      <div className="grid grid-2x grid-mobile-none gap-5px">
        <div className="column-1">
          <div className="grid grid-3x grid-mobile-none gap-5px">
            <div className="col-1">
              <br />
              <input
                readOnly={this.props.type === "view" ? true : false}
                style={
                  this.props.type === "view"
                    ? {
                        backgroundColor: "#E6E6E6",
                        textAlign: "left"
                      }
                    : { textAlign: "left" }
                }
                type="checkbox"
              />
              &nbsp;SMP/MTS
              <br />
              <input
                readOnly={this.props.type === "view" ? true : false}
                style={
                  this.props.type === "view"
                    ? {
                        backgroundColor: "#E6E6E6",
                        textAlign: "left"
                      }
                    : { textAlign: "left" }
                }
                type="checkbox"
              />
              &nbsp;SMA/MA
              <br />
              <input
                readOnly={this.props.type === "view" ? true : false}
                style={
                  this.props.type === "view"
                    ? {
                        backgroundColor: "#E6E6E6",
                        textAlign: "left"
                      }
                    : { textAlign: "left" }
                }
                type="checkbox"
              />
              &nbsp;SMK/STM
            </div>
            <div className="col-2">
              <input
                readOnly={this.props.type === "view" ? true : false}
                style={
                  this.props.type === "view"
                    ? { backgroundColor: "#E6E6E6" }
                    : null
                }
                type="checkbox"
              />
              &nbsp;D1
              <br />
              <input
                readOnly={this.props.type === "view" ? true : false}
                style={
                  this.props.type === "view"
                    ? {
                        backgroundColor: "#E6E6E6",
                        textAlign: "left"
                      }
                    : { textAlign: "left" }
                }
                type="checkbox"
              />
              &nbsp;D2
              <br />
              <input
                readOnly={this.props.type === "view" ? true : false}
                style={
                  this.props.type === "view"
                    ? {
                        backgroundColor: "#E6E6E6",
                        textAlign: "left"
                      }
                    : { textAlign: "left" }
                }
                type="checkbox"
              />
              &nbsp;D3
              <br />
              <input
                readOnly={this.props.type === "view" ? true : false}
                style={
                  this.props.type === "view"
                    ? {
                        backgroundColor: "#E6E6E6",
                        textAlign: "left"
                      }
                    : { textAlign: "left" }
                }
                type="checkbox"
              />
              &nbsp;D4
            </div>
            <div className="col-3">
              <input
                readOnly={this.props.type === "view" ? true : false}
                style={
                  this.props.type === "view"
                    ? {
                        backgroundColor: "#E6E6E6",
                        textAlign: "left"
                      }
                    : { textAlign: "left" }
                }
                type="checkbox"
              />
              &nbsp;PROFESSION
              <br />
              <input
                readOnly={this.props.type === "view" ? true : false}
                style={
                  this.props.type === "view"
                    ? {
                        backgroundColor: "#E6E6E6",
                        textAlign: "left"
                      }
                    : { textAlign: "left" }
                }
                type="checkbox"
              />
              &nbsp;S1
              <br />
              <input
                readOnly={this.props.type === "view" ? true : false}
                style={
                  this.props.type === "view"
                    ? {
                        backgroundColor: "#E6E6E6",
                        textAlign: "left"
                      }
                    : { textAlign: "left" }
                }
                type="checkbox"
              />
              &nbsp;S2
              <br />
              <input
                readOnly={this.props.type === "view" ? true : false}
                style={
                  this.props.type === "view"
                    ? {
                        backgroundColor: "#E6E6E6",
                        textAlign: "left"
                      }
                    : { textAlign: "left" }
                }
                type="checkbox"
              />
              &nbsp;S3
              <br />
            </div>
          </div>
        </div>
        <div className="column-2"> </div>
      </div>
    ) : this.props.checkboxType === "Age" ? (
      <div className="grid grid-2x grid-mobile-none gap-5px">
        <div className="column-1">
          <div className="grid grid-2x grid-mobile-none">
            <div className="col-1 gap-10px">
              <select
                className="cf-select slc slc-sekunder"
                style={{ width: "100px" }}
              >
                <option value="">--age--</option>
                <option value="1">20</option>
                <option value="1">30</option>
                <option value="1">40</option>
              </select>
              &nbsp;
              <span>-</span>
              &nbsp;
              <select
                className="cf-select slc slc-sekunder"
                style={{ width: "100px" }}
              >
                <option value="">--age--</option>
                <option value="1">20</option>
                <option value="1">30</option>
                <option value="1">40</option>
              </select>
              &nbsp;Year
            </div>
            <div className="col-2" />
          </div>
        </div>
        <div className="column-2"> </div>
      </div>
    ) : this.props.checkboxType === "Work Experience" ? (
      <div className="grid grid-2x grid-mobile-none gap-5px">
        <div className="column-1">
          <div className="grid grid-2x grid-mobile-none gap-5px">
            <div className="col-1 padding-top-10px">
              <input
                readOnly={this.props.type === "view" ? true : false}
                style={
                  this.props.type === "view"
                    ? {
                        backgroundColor: "#E6E6E6",
                        textAlign: "left"
                      }
                    : { textAlign: "left" }
                }
                type="checkbox"
              />
              &nbsp;Fresh Graduated
            </div>
            <div className="col-2">
              Min. &nbsp;
              <input
                readOnly={this.props.type === "view" ? true : false}
                style={
                  this.props.type === "view"
                    ? {
                        backgroundColor: "#E6E6E6",
                        textAlign: "left",
                        width: "50px"
                      }
                    : { textAlign: "left", width: "50px" }
                }
                className="txt txt-sekunder-color"
                type="text"
              />
            </div>
          </div>
        </div>
        <div className="column-2"> </div>
      </div>
    ) : this.props.checkboxType === "Language" ? (
      <div className="grid grid-2x grid-mobile-none gap-5px">
        <div className="column-1">
          <div className="grid grid-2x grid-mobile-none gap-5px">
            <div className="col-1">
              <input
                readOnly={this.props.type === "view" ? true : false}
                style={
                  this.props.type === "view"
                    ? {
                        backgroundColor: "#E6E6E6",
                        textAlign: "left"
                      }
                    : { textAlign: "left" }
                }
                type="checkbox"
              />
              &nbsp;Inggris
              <br />
              <input
                readOnly={this.props.type === "view" ? true : false}
                style={
                  this.props.type === "view"
                    ? {
                        backgroundColor: "#E6E6E6",
                        textAlign: "left"
                      }
                    : { textAlign: "left" }
                }
                type="checkbox"
              />
              &nbsp;Jepang
              <br />
              <input
                readOnly={this.props.type === "view" ? true : false}
                style={
                  this.props.type === "view"
                    ? {
                        backgroundColor: "#E6E6E6",
                        textAlign: "left"
                      }
                    : { textAlign: "left" }
                }
                type="checkbox"
              />
              &nbsp;Korea
              <br />
              <input
                readOnly={this.props.type === "view" ? true : false}
                style={
                  this.props.type === "view"
                    ? {
                        backgroundColor: "#E6E6E6",
                        textAlign: "left"
                      }
                    : { textAlign: "left" }
                }
                type="checkbox"
              />
              &nbsp;Perancis
            </div>
            <div className="col-2">
              <input
                readOnly={this.props.type === "view" ? true : false}
                style={
                  this.props.type === "view"
                    ? {
                        backgroundColor: "#E6E6E6",
                        textAlign: "left"
                      }
                    : { textAlign: "left" }
                }
                type="checkbox"
              />
              &nbsp;Mandarin
              <br />
              <input
                readOnly={this.props.type === "view" ? true : false}
                style={
                  this.props.type === "view"
                    ? {
                        backgroundColor: "#E6E6E6",
                        textAlign: "left"
                      }
                    : { textAlign: "left" }
                }
                type="checkbox"
              />
              &nbsp;Jerman
              <br />
              <input
                readOnly={this.props.type === "view" ? true : false}
                style={
                  this.props.type === "view"
                    ? {
                        backgroundColor: "#E6E6E6",
                        textAlign: "left"
                      }
                    : { textAlign: "left" }
                }
                type="checkbox"
              />
              &nbsp;Belanda
            </div>
          </div>
        </div>
        <div className="column-2"> </div>
      </div>
    ) : this.props.checkboxType === "Toefl" ? (
      <div className="grid grid-2x grid-mobile-none gap-5px">
        <div className="column-1">
          <div className="grid grid-2x grid-mobile-none">
            <div className="col-1 gap-10px">
              Min. &nbsp;
              <input
                readOnly={this.props.type === "view" ? true : false}
                style={
                  this.props.type === "view"
                    ? {
                        backgroundColor: "#E6E6E6",
                        textAlign: "left",
                        width: "60px"
                      }
                    : { textAlign: "left", width: "60px" }
                }
                type="text"
                className="txt txt-sekunder-color"
              />
            </div>
            <div className="col-2" />
          </div>
        </div>
        <div className="column-2"> </div>
      </div>
    ) : this.props.checkboxType === "Nationality" ? (
      <div className="grid grid-2x grid-mobile-none gap-5px">
        <div className="column-1">
          <div className="grid grid-2x grid-mobile-none gap-5px">
            <div className="col-1">
              <input
                readOnly={this.props.type === "view" ? true : false}
                style={
                  this.props.type === "view"
                    ? {
                        backgroundColor: "#E6E6E6",
                        textAlign: "left"
                      }
                    : { textAlign: "left" }
                }
                type="checkbox"
              />
              &nbsp;WNI
            </div>
            <div className="col-2">
              <input
                readOnly={this.props.type === "view" ? true : false}
                style={
                  this.props.type === "view"
                    ? {
                        backgroundColor: "#E6E6E6",
                        textAlign: "left"
                      }
                    : { textAlign: "left" }
                }
                type="checkbox"
              />
              &nbsp;WNA
            </div>
          </div>
        </div>
        <div className="column-2"> </div>
      </div>
    ) : this.props.checkboxType === "Score/GPA" ? (
      <div className="grid grid-2x grid-mobile-none gap-5px">
        <div className="column-1">
          <div className="grid grid-2x grid-mobile-none">
            <div className="col-1 gap-10px">
              Min. &nbsp;
              <input
                readOnly={this.props.type === "view" ? true : false}
                style={
                  this.props.type === "view"
                    ? {
                        backgroundColor: "#E6E6E6",
                        textAlign: "left",
                        width: "60px"
                      }
                    : { textAlign: "left", width: "60px" }
                }
                type="text"
                className="txt txt-sekunder-color"
              />
            </div>
            <div className="col-2" />
          </div>
        </div>
        <div className="column-2"> </div>
      </div>
    ) : this.props.checkboxType === "Collage Accreditation" ? (
      <div className="grid grid-2x grid-mobile-none gap-5px">
        <div className="column-1">
          <div className="grid grid-3x grid-mobile-none gap-5px">
            <div className="col-1">
              <input
                readOnly={this.props.type === "view" ? true : false}
                style={
                  this.props.type === "view"
                    ? {
                        backgroundColor: "#E6E6E6",
                        textAlign: "left"
                      }
                    : { textAlign: "left" }
                }
                type="checkbox"
              />
              &nbsp;A
            </div>
            <div className="col-2">
              <input
                readOnly={this.props.type === "view" ? true : false}
                style={
                  this.props.type === "view"
                    ? {
                        backgroundColor: "#E6E6E6",
                        textAlign: "left"
                      }
                    : { textAlign: "left" }
                }
                type="checkbox"
              />
              &nbsp;B
            </div>
            <div className="col-3">
              <input
                readOnly={this.props.type === "view" ? true : false}
                style={
                  this.props.type === "view"
                    ? {
                        backgroundColor: "#E6E6E6",
                        textAlign: "left"
                      }
                    : { textAlign: "left" }
                }
                type="checkbox"
              />
              &nbsp;C
              <br />
            </div>
          </div>
        </div>
        <div className="column-2"> </div>
      </div>
    ) : (
      <div className="grid grid-2x grid-mobile-none gap-5px">
        <div className="column-1">
          <div className="grid grid-3x grid-mobile-none gap-5px">
            <div className="col-1">
              <input
                readOnly={this.props.type === "view" ? true : false}
                style={
                  this.props.type === "view"
                    ? {
                        backgroundColor: "#E6E6E6",
                        textAlign: "left"
                      }
                    : { textAlign: "left" }
                }
                type="checkbox"
              />
              &nbsp;A
            </div>
            <div className="col-2">
              <input
                readOnly={this.props.type === "view" ? true : false}
                style={
                  this.props.type === "view"
                    ? {
                        backgroundColor: "#E6E6E6",
                        textAlign: "left"
                      }
                    : { textAlign: "left" }
                }
                type="checkbox"
              />
              &nbsp;B
            </div>
            <div className="col-3">
              <input
                readOnly={this.props.type === "view" ? true : false}
                style={
                  this.props.type === "view"
                    ? {
                        backgroundColor: "#E6E6E6",
                        textAlign: "left"
                      }
                    : { textAlign: "left" }
                }
                type="checkbox"
              />
              &nbsp;C
              <br />
            </div>
          </div>
        </div>
        <div className="column-2"> </div>
      </div>
    );
  }
}
export default pages;
