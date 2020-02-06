import React, { Component } from "react";
import PopUp from "../../../pages/PopUpAlert";
import ResizeSlider from "../../../../modules/resize/Slider";
// import API from "../../../../Services/Api";
// import M from "moment";
// import * as R from "ramda";
import { connect } from "react-redux";

import TableTalent from "../tables/tableTalent";
import FormTalent from "./create/talent/createTalent";
import FormEditTalent from "./edit/talent/formEditTalent";

const clSlidePage = "a-s-p-main";

class ConfTalent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      auth: props.auth,
      classAppSlidePage: "app-side-page",
      classAppSlidePageMain: clSlidePage,
      savePopUpVisible: false,
      createTalent: false,
      deletePopUpVisible: false,
      editTalent: false,
      // important for resize pane
      allowResize: false,
      defaultSize: 0,
      minSize: 0,
      maxSize: 0,
      rawData: []
    };
  }

  dataTableTalent = [
    ["1", "ID-9291", "Talent TEMPLATE 2018", "YES"],
    ["2", "ID-9292", "Talent TEMPLATE 2018", "YES"]
  ];

  opResizePane = () => {
    this.setState({
      allowResize: true,
      defaultSize: 370,
      minSize: 370,
      maxSize: 850
    });
  };

  clResizePane = () => {
    this.setState({
      editTalent: false,
      allowResize: false,
      defaultSize: 0,
      minSize: 0,
      maxSize: 0
    });
  };

  opSidePage = (menu, index) => e => {
    this.setState({
      classAppSlidePage: "app-side-page op-app-side",
      editTalent: false
    });

    this.opResizePane();

    switch (menu) {
      case "slide-talent":
        this.setState({
          editTalent: true
        });
        break;
      default:
        break;
    }
  };

  clSidePage = () => {
    this.setState({ classAppSlidePage: "app-side-page" });
  };

  // openCreateForm = (type = "create") => {
  //   this.clResizePane();
  //   this.setState({ createVisible: !this.state.createVisible, type });
  // };

  opPopupPage = menu => e => {
    e.preventDefault();

    this.setState({
      createTalent: false
    });

    this.clResizePane();
    switch (menu) {
      case "create-talent":
        this.setState({
          createTalent: true,
          editTalent: false,
          sub: "talent",
          classAppSlidePage: "app-side-page"
        });
        break;
      default:
        break;
    }
  };

  clPopupPage = () => {
    let savePopUpVisible = this.state.savePopUpVisible
      ? !this.state.savePopUpVisible
      : false;
    this.setState({
      createTalent: false,
      editTalent: false,
      savePopUpVisible
    });
  };

  openSavePopUp = () => {
    this.clResizePane();
    this.setState({
      savePopUpVisible: !this.state.savePopUpVisible,
      createTalent: false,
      editTalent: false,
      classAppSlidePage: "app-side-page"
    });
  };

  openDeletePopUp = (index, type) => {
    this.setState({
      deletePopUpVisible: !this.state.deletePopUpVisible,
      selectedIndex: index
    });
    if (type !== "delete-detail") return this.clResizePane();
  };

  async handleSubmit() {
    this.openSavePopUp();
  }

  async handleUpdate() {
    this.openSavePopUp();
  }

  async handleDelete() {
    this.setState({ deletePopUpVisible: !this.state.deletePopUpVisible });
  }

  render() {
    return (
      <div>
        <ResizeSlider
          allowResize={this.state.allowResize}
          defaultSize={this.state.defaultSize}
          minSize={this.state.minSize}
          maxSize={this.state.maxSize}
          main={
            <div>
              <div className="a-s-p-place a-s-p-content active">
                <div className="a-s-p-top">
                  <div className="grid grid-2x">
                    <div className="col-1">
                      <div className="margin-left-15px margin-top-10px margin-bottom-10px display-flex-normal">
                        <div>
                          <i className="color-blue fas fa-star margin-right-10px"></i>
                        </div>
                        <div>
                          <div className="txt-site txt-12 txt-bold txt-main">
                            Talent
                          </div>
                          <div className="txt-site txt-10 txt-thin txt-primary">
                            Talent
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="a-s-p-mid border-top">
                  <div className="padding-10px">
                    <div className="app-open-close margin-bottom-20px">
                      <input
                        type="checkbox"
                        name="navmenu"
                        className="app-open-close-input"
                        id="navmenu-tl"
                      />
                      <div className="grid grid-2x margin-bottom-10px">
                        <div className="col-1"></div>
                        <div className="col-2 content-right">
                          <label htmlFor="navmenu-tl">
                            <div className="app-open-close-icon"></div>
                          </label>
                          <button
                            className="btn btn-small-circle btn-sekunder margin-left-5px"
                            onClick={this.opPopupPage("create-talent")}
                          >
                            <i className="fa fa-lw fa-plus" />
                          </button>
                        </div>
                        {this.state.createTalent && (
                          <FormTalent
                            type="create"
                            onClickSave={this.handleSubmit.bind(this)}
                            onClickClose={this.clPopupPage.bind(this)}
                          />
                        )}
                      </div>
                      <div className="app-open-close-content">
                        <TableTalent
                          dataTable={this.dataTableTalent}
                          openSlide={this.opSidePage.bind(this)}
                          onDeletePopup={this.openDeletePopUp.bind(this)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          }
          side={
            <div className="a-s-p-side">
              {/* edit */}
              {this.state.editTalent ? (
                <FormEditTalent
                  closeSlide={this.clResizePane}
                  onDeletePopUp={this.openDeletePopUp.bind(this)}
                  onClickSave={this.handleUpdate.bind(this)}
                />
              ) : null}
            </div>
          }
        ></ResizeSlider>

        {this.state.savePopUpVisible && (
          <PopUp
            type={"save"}
            class={"app-popup app-popup-show"}
            onClick={this.openSavePopUp}
          />
        )}

        {this.state.deletePopUpVisible && (
          <PopUp
            type={"delete"}
            class={"app-popup app-popup-show"}
            onClick={this.openDeletePopUp}
            onClickDelete={
              this.state.editTalent
                ? () =>
                    this.handleUpdate(this.state.selectedIndex, "delete-detail")
                : this.handleDelete.bind(this)
            }
          />
        )}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    auth: state.auth
  };
};

export default connect(mapStateToProps, null)(ConfTalent);
