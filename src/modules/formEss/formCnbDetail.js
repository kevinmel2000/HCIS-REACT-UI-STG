import React, { Component } from "react";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables-bitozen";
import M from "moment";
import API from "../../Services/Api";
import PopUp from "../../components/pages/PopUpAlert";
import * as R from "ramda";
import LoadingBar from "react-top-loading-bar";
import UploadFile from "../upload/upload";
import { connect } from "react-redux";
import NumberFormat from "react-number-format";

var ct = require("../../modules/custom/customTable");
const getMuiTheme = () => createMuiTheme(ct.customTable());
const options = ct.customOptions();

class ClaimDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      savePopUpVisible: false,
      payloadCNB: {
        ...props.data,
        claimID: "CL-" + M(),
        claimURL: "",
        claimDescription: "",
        claimCNBRemainingBudget: ""
      },
      payloadCNBView: props.dataView,
      file: "",
      rawData: [],
      auth: props.auth,

      uploadStatus: "idle",
      result: "",
      files: [],
      percentage: "0"
    };
  }

  componentDidMount() {
    this.props.type === "view"
      ? this.getCNBDetail()
      : this.LoadingBar.complete();
  }

  getCNBDetail() {
    let year = Number(M().format("YYYY"));
    let payload = {
      params: {
        employeeID: this.state.auth.user.employeeID,
        claimType: this.state.payloadCNBView.claimCNBType.bizparKey,
        claimYear: year
      },
      limit: 100,
      offset: 0
    };
    API.create("CNB_QUERY")
      .getClaimByEmpIdTypeYear(payload)
      .then(res => {
        if (res.status === 200) {
          if (res.data.status === "S" && res.data.code === "201") {
            this.onFinishFetch();
            this.setState({
              rawData: res.data.data
            });
          } else {
            this.onFinishFetch();
            alert("No Data Found");
          }
        } else {
          alert("Failed: " + res.message);
          this.onFinishFetch();
        }
      });
  }

  startFetch = () => {
    this.LoadingBar.continousStart();
  };

  onFinishFetch = () => {
    if (typeof this.LoadingBar === "object") this.LoadingBar.complete();
  };

  handleFile(event) {
    let { payloadCNB } = this.state;
    var url = event;
    var number = payloadCNB.claimID;

    const formData = new FormData();
    formData.append("claimID", number);
    formData.append("file", url);

    this.setState({ formData, url });
  }

  async uploadDocument(formData) {
    if (!R.isNil(this.state.url) || !R.isEmpty(this.state.url)) {
      this.setState({ uploadStatus: "upload" });
      if (this.state.url.type === "application/pdf") {
        let response = await API.create("CNB").postClaimDocument(formData, {
          onUploadProgress: progress => {
            if (progress.lengthComputable) {
              if (progress.total >= 1000000) {
                this.setState({
                  result: "error",
                  percentage: "0",
                  uploadStatus: "idle"
                });
              } else {
                var percentCompleted = Math.round(
                  (progress.loaded * 100) / progress.total
                );
                this.setState({ percentage: percentCompleted });
                if (progress.loaded === progress.total) {
                  this.setState({ result: "success" });
                }
              }
            }
          }
        });
        if (!response.ok && response.status === 413) {
          alert("Your Document Too Large, Please Select Another Document");
          this.setState({ result: "error", percentage: "0" });
        }
        if (!response.ok && response.status === 500) {
          alert("Please Select Document");
          this.setState({ result: "error" });
        }
        if (!response.ok && R.isNil(response.status)) {
          alert(response.problem);
          this.setState({ result: "error" });
        }

        if (!R.isNil(response.data)) {
          switch (response.data.status) {
            case "S":
              if (response.data.code === "201") {
                this.setState({
                  payloadCNB: {
                    ...this.state.payloadCNB,
                    claimURL: this.state.url.name
                  },
                  result: "success"
                });
                this.openSavePopUp();
              } else alert("Failed: " + response.data.message);
              break;
            default:
              break;
          }
        }
      } else {
        alert("Unsupported File Type");
      }
    }
  }

  openSavePopUp = () => {
    this.setState({ savePopUpVisible: !this.state.savePopUpVisible });
  };

  columns = [
    "No",
    "Date & Time",
    "Rupiah",
    "Description",
    {
      name: "Status",
      options: {
        customBodyRender: val => {
          return (
            <div>
              <i
                className="fa fa-lw fa-circle"
                style={{
                  color:
                    val === "INITIATE"
                      ? "orange"
                      : val === "APPROVED"
                      ? "brown"
                      : val === "" || val === null
                      ? null
                      : val === "REJECTED"
                      ? "#424242"
                      : "gray",
                  marginRight: 10,
                  padding: "5px"
                }}
              />
              {val}
            </div>
          );
        }
      }
    },
  ];

  renderViewCNB = () => {
    let dataTable = this.state.rawData.map((value, index) => {
      if (value === null) return []
      const { claimDate, claimValue, claimDescription, claimStatus } = value;
      return [
        (index += 1),
        claimDate,
        new Intl.NumberFormat("ID", {
          style: "currency",
          currency: "IDR"
        }).format(claimValue),
        claimDescription,
        claimStatus.replace(/_/g, " ")
      ];
    });
    return (
      <div className={"app-popup app-popup-show"}>
        <div className="padding-top-20px" />
        <div
          className="popup-content background-white border-radius"
          style={{ marginBottom: 10 }}
        >
          <div className="popup-panel grid grid-2x">
            <div className="col-1">
              <div className="popup-title">C&B - Detail Form</div>
            </div>
            <div className="col-2 content-right">
              <button
                className="btn btn-circle btn-grey"
                onClick={this.props.onClickClose}
              >
                <i className="fa fa-lg fa-times" />
              </button>
            </div>
          </div>

          <form action="#">
            <div className="border-bottom padding-15px">
              <LoadingBar onRef={ref => (this.LoadingBar = ref)} />
              <MuiThemeProvider theme={getMuiTheme()}>
                <MUIDataTable
                  data={dataTable}
                  columns={this.columns}
                  options={options}
                />
              </MuiThemeProvider>
            </div>

            <div className="padding-15px">
              <div className="grid grid-2x">
                <div className="col-1" />
                <div className="col-2 content-right">
                  <button
                    style={{ marginLeft: "10px" }}
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
                onClick={this.openSavePopUp}
              />
            )}
          </form>
        </div>
        <div className="padding-bottom-20px" />
      </div>
    );
  };

  render() {
    let { payloadCNB } = this.state;
    return this.props.type !== "create" ? (
      this.renderViewCNB()
    ) : (
      <div className={"app-popup app-popup-show"}>
        <div className="padding-top-20px" />
        <div
          className="popup-content-mikro background-white border-radius"
          style={{ marginBottom: 10 }}
        >
          <div className="popup-panel grid grid-2x">
            <div className="col-1">
              <div className="popup-title">C&B - Create Form</div>
            </div>
            <div className="col-2 content-right">
              <button
                className="btn btn-circle btn-grey"
                onClick={this.props.onClickClose}
              >
                <i className="fa fa-lg fa-times" />
              </button>
            </div>
          </div>

          <form
            action="#"
            onSubmit={e => {
              e.preventDefault();
              if (
                R.isEmpty(this.state.payloadCNB.claimURL) &&
                this.state.payloadCNB.claimURL === ""
              )
                return alert("Upload Invoice is Required.");
              this.props.onClickProcess(this.state.payloadCNB);
            }}
          >
            <div className="border-bottom padding-15px">
              <LoadingBar onRef={ref => (this.LoadingBar = ref)} />
              <div className="margin-bottom-20px">
                <div className="margin-5px">
                  <div className="txt-site txt-11 txt-main txt-bold">
                    <h4>Journal ID</h4>
                  </div>
                </div>
                <input
                  style={{ backgroundColor: "#E6E6E6" }}
                  className="txt txt-sekunder-color"
                  type="text"
                  readOnly
                  placeholder=""
                  value={payloadCNB.claimID}
                  required
                />
              </div>

              <div className="margin-bottom-20px">
                <div className="margin-5px">
                  <div className="txt-site txt-11 txt-main txt-bold">
                    <h4>
                      Description <span style={{ color: "red" }}>*</span>
                    </h4>
                  </div>
                </div>
                <input
                  value={payloadCNB.claimDescription}
                  onChange={e => {
                    this.setState({
                      payloadCNB: {
                        ...this.state.payloadCNB,
                        claimDescription: e.target.value
                      }
                    });
                  }}
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
                      Rupiah <span style={{ color: "red" }}>*</span>
                    </h4>
                  </div>
                </div>
                <NumberFormat
                  className="txt txt-sekunder-color"
                  thousandSeparator={true}
                  value={payloadCNB.claimCNBRemainingBudget}
                  onValueChange={e => {
                    this.setState({
                      payloadCNB: {
                        ...this.state.payloadCNB,
                        claimCNBRemainingBudget: e.formattedValue
                      }
                    });
                  }}
                  required
                />
              </div>

              <div className="margin-bottom-20px">
                <div className="padding-5px">
                  <span className="txt-site txt-11 txt-main txt-bold">
                    <h4>
                      Upload Invoice
                      <span style={{ color: "red" }}> *(Format File: PDF)</span>
                    </h4>
                  </span>
                </div>

                <UploadFile
                  type={this.state.uploadStatus}
                  percentage={this.state.percentage}
                  result={this.state.result}
                  acceptedFiles={["pdf"]}
                  onHandle={dt => {
                    this.handleFile(dt);
                  }}
                  onUpload={() => {
                    this.uploadDocument(this.state.formData);
                  }}
                />
              </div>
            </div>

            <div className="padding-15px">
              <div className="grid grid-2x">
                <div className="col-1" />
                <div className="col-2 content-right">
                  <button className="btn btn-blue" type="submit">
                    <span>SAVE & SUBMIT</span>
                  </button>
                  <button
                    style={{ marginLeft: "10px" }}
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
                onClick={this.openSavePopUp}
              />
            )}
          </form>
        </div>
        <div className="padding-bottom-20px" />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    auth: state.auth
  };
};

export default connect(mapStateToProps)(ClaimDetail);
