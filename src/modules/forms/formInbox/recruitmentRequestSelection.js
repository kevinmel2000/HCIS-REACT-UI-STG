import React, {Component} from 'react'
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles"
import MUIDataTable from "mui-datatables-bitozen"
import PopUp from "../../../components/pages/PopUpAlert"
import FormDoc from '../formInbox/recruitmentRequestFormDoc'
import FormSelection from '../formInbox/recruitmentRequestFormSelection'
import FormOther from '../formInbox/recruitmentRequestFormOther'

var ct = require("../../../modules/custom/customTable");

class FormRecruitRequestSelection extends Component {
  constructor() {
    super();
    this.state = {
      type: "create",
      file: null,
      deleteClass : 'app-popup',
      saveClass : 'app-popup',
      createClassSuratLamaran : 'app-popup',
      createClassSelection : 'app-popup',
      createClassOther : 'app-popup'
    };
  }

    getMuiTheme = () => createMuiTheme(ct.customTable());

    options = ct.customOptions();

    openSavePopUp = () => {
      if (this.state.saveClass === "app-popup app-popup-show") {
        this.setState({ saveClass: "app-popup" });
      } else {
        this.setState({ saveClass: "app-popup app-popup-show" });
      }
    };

    openCreateFormSuratLamaran = (type = "create", doctype) => {
      if (this.state.createClassSuratLamaran === "app-popup app-popup-show") {
        this.setState({ createClassSuratLamaran: "app-popup", type, doctype});
      } else {
        this.setState({ createClassSuratLamaran: "app-popup app-popup-show", type, doctype});
      }
    };

    openCreateFormSelection = (type = "create", selectype) => {
      if (this.state.createClassSelection === "app-popup app-popup-show") {
        this.setState({ createClassSelection: "app-popup", type, selectype});
      } else {
        this.setState({ createClassSelection: "app-popup app-popup-show", type, selectype});
      }
    };

    openCreateFormOther = (type = "create") => {
      if (this.state.createClassOther === "app-popup app-popup-show") {
        this.setState({ createClassOther: "app-popup", type });
      } else {
        this.setState({ createClassOther: "app-popup app-popup-show", type});
      }
    };

    //qualification
    columnsQualification = [
        "No",
        {
            name: "Choose",
            options: {
              customBodyRender: () => {
                return (
                  <div>
                     <input type="checkbox" />
                  </div>
                )
              }
            }
          },
        "Qualification Type",
        "Qualification",
        "Information",
        {
            name: "Mandatory",
            options: {
              customBodyRender: () => {
                return (
                  <div>
                     <input type="checkbox" />
                  </div>
                )
              }
            }
        },
        ""
    ];

    dataQualification = [
        ["1", "", "JENIS KELAMIN", "", "", "", ""], 
        ["2", "", "PENDIDIKAN", "", "", "", ""],
        ["3", "", "UMUR", "", "", "", ""],
        ["4", "", "BERPENGALAMAN", "", "", "", ""],
        ["5", "", "PENGUASAAN BAHASA", "", "", "", ""],
        ["6", "", "TOEFL", "", "", "", ""],
        ["7", "", "KEWARGANEGARAAN", "", "", "", ""],
        ["8", "", "NILAI/IPK", "", "", "", ""],
        ["9", "", "AKREDITASI PT", "", "", "", ""],
        ["10", "", "AKREDITASI PRODI/JURUSAN", "", "", "", ""]
    ];

    //position
    columnsPosition = [
      "No",
      "Job Type",
      "Position",
      "Province",
      "Branch",
      "Location",
      "Quota"
    ];

    dataPosition = [
        ["1", "SUPERVISOR", "WH COORDINATOR OUTBOND - KANTOR CABANG HALIM", "DKI JAKARTA", "JAKARTA SELATAN", "Staging Store Kapur Muara 1", "1"]
    ];

    //document/file
    columnsDocFile = [
      "No",
      {
          name: "Choose",
          options: {
            customBodyRender: () => {
              return (
                <div>
                   <input type="checkbox" />
                </div>
              )
            }
          }
      },
      {
        name: "Document Type",
        options: {
          customBodyRender: (val, tableMeta) => {
            return (
              <div
                style={{ cursor: "pointer" }}
                onClick={() => tableMeta.rowData[2] === 'SURAT LAMARAN' ? this.openCreateFormSuratLamaran("view", 'Surat') :
                    tableMeta.rowData[2] === 'FOTOCOPY CV' ? this.openCreateFormSuratLamaran("view", 'CV') :
                    tableMeta.rowData[2] === 'FOTOCOPY IJAZAH' ? this.openCreateFormSuratLamaran("view", 'Ijazah') :
                    tableMeta.rowData[2] === 'FOTOCOPY KTP' ? this.openCreateFormSuratLamaran("view", 'KTP') :
                    tableMeta.rowData[2] === 'FOTOCOPY TRANSKIP NILAI' ? this.openCreateFormSuratLamaran("view", 'Transkip') :
                    tableMeta.rowData[2] === 'PAS FOTO BERLATAR WARNA MERAH' ? this.openCreateFormSuratLamaran("view", 'Foto') :
                    tableMeta.rowData[2] === 'SKCK' ? this.openCreateFormSuratLamaran("view", 'SKCK') :
                    tableMeta.rowData[2] === 'SERTIFIKAT TOEFL' ? this.openCreateFormSuratLamaran("view", 'TOEFL') :
                    this.openCreateFormSuratLamaran('view', 'Pendukung Lainnya')}
              >
                {val}
              </div>
            );
          }
        }
      },
      {
        name: "Mandatory",
        options: {
          customBodyRender: () => {
            return (
              <div>
                 <input type="checkbox" />
              </div>
            )
          }
        }
      },
      "Sequence",
      "Information",
      {
        name: "Action",
        options: {
          customBodyRender: (val, tableMeta) => {
            return (
              <div>
                <button
                  type="button"
                  className="btn btn-red btn-small-circle"
                  style={{ marginRight: 5 }}
                  onClick={() => tableMeta.rowData[2] === 'SURAT LAMARAN' ? this.openCreateFormSuratLamaran("create", 'Surat') :
                    tableMeta.rowData[2] === 'FOTOCOPY CV' ? this.openCreateFormSuratLamaran("create", 'CV') :
                    tableMeta.rowData[2] === 'FOTOCOPY IJAZAH' ? this.openCreateFormSuratLamaran("create", 'Ijazah') :
                    tableMeta.rowData[2] === 'FOTOCOPY KTP' ? this.openCreateFormSuratLamaran("create", 'KTP') :
                    tableMeta.rowData[2] === 'FOTOCOPY TRANSKIP NILAI' ? this.openCreateFormSuratLamaran("create", 'Transkip') :
                    tableMeta.rowData[2] === 'PAS FOTO BERLATAR WARNA MERAH' ? this.openCreateFormSuratLamaran("create", 'Foto') :
                    tableMeta.rowData[2] === 'SKCK' ? this.openCreateFormSuratLamaran("create", 'SKCK') :
                    tableMeta.rowData[2] === 'SERTIFIKAT TOEFL' ? this.openCreateFormSuratLamaran("create", 'TOEFL') :
                    this.openCreateFormSuratLamaran('create', 'Pendukung Lainnya')}
                >
                  <i className="fa fa-lw fa-plus" />
                </button>
                <button
                  type="button"
                  className="btn btn-red btn-small-circle"
                  style={{ marginRight: 5 }}
                  onClick={() => tableMeta.rowData[2] === 'SURAT LAMARAN' ? this.openCreateFormSuratLamaran("update", 'Surat') :
                    tableMeta.rowData[2] === 'FOTOCOPY CV' ? this.openCreateFormSuratLamaran("update", 'CV') :
                    tableMeta.rowData[2] === 'FOTOCOPY IJAZAH' ? this.openCreateFormSuratLamaran("update", 'Ijazah') :
                    tableMeta.rowData[2] === 'FOTOCOPY KTP' ? this.openCreateFormSuratLamaran("update", 'KTP') :
                    tableMeta.rowData[2] === 'FOTOCOPY TRANSKIP NILAI' ? this.openCreateFormSuratLamaran("update", 'Transkip') :
                    tableMeta.rowData[2] === 'PAS FOTO BERLATAR WARNA MERAH' ? this.openCreateFormSuratLamaran("update", 'Foto') :
                    tableMeta.rowData[2] === 'SKCK' ? this.openCreateFormSuratLamaran("update", 'SKCK') :
                    tableMeta.rowData[2] === 'SERTIFIKAT TOEFL' ? this.openCreateFormSuratLamaran("update", 'TOEFL') :
                    this.openCreateFormSuratLamaran('update', 'Pendukung Lainnya')}
                >
                  <i className="fa fa-lw fa-pencil-alt" />
                </button>
                <button
                  type="button"
                  className="btn btn-red btn-small-circle"
                  onClick={this.props.onClickDelete}
                >
                  <i className="fa fa-lw fa-trash-alt" />
                </button>
              </div>
            );
          }
        }
      }
    ];

    dataDocFile = [
        ["1", "", "SURAT LAMARAN", "", "1", ""],
        ["2", "", "FOTOCOPY CV", "", "2", ""],
        ["3", "", "FOTOCOPY IJAZAH", "", "3", ""],
        ["4", "", "FOTOCOPY KTP", "", "", ""],
        ["5", "", "FOTOCOPY TRANSKIP NILAI", "", "", ""],
        ["6", "", "PAS FOTO BERLATAR WARNA MERAH", "", "", ""],
        ["7", "", "SKCK", "", "", ""],
        ["8", "", "SERTIFIKAT TOEFL", "", "", ""],
        ["9", "", "PENDUKUNG LAINNYA", "", "", ""]
    ];

    //selection
    columnsSelection = [
      "No",
      {
          name: "Choose",
          options: {
            customBodyRender: () => {
              return (
                <div>
                   <input type="checkbox" />
                </div>
              )
            }
          }
      },
      {
        name: "Selection Type",
        options: {
          customBodyRender: (val, tableMeta) => {
            return (
              <div
                style={{ cursor: "pointer" }}
                onClick={() => tableMeta.rowData[2] === 'TES TERTULIS' ? this.openCreateFormSelection("view", 'Tulis') :
                    tableMeta.rowData[2] === 'INTERVIEW AWAL' ? this.openCreateFormSelection("view", 'Awal') :
                    tableMeta.rowData[2] === 'ADMINISTRASI' ? this.openCreateFormSelection("view", 'Adm') :
                    tableMeta.rowData[2] === 'TES PSIKOTES' ? this.openCreateFormSelection("view", 'Psikotes') :
                    tableMeta.rowData[2] === 'INTERVIEW AKHIR' ? this.openCreateFormSelection("view", 'Akhir') :
                    this.openCreateFormSelection('view', 'Medical Check Up')}
              >
                {val}
              </div>
            );
          }
        }
      },
      {
        name: "Mandatory",
        options: {
          customBodyRender: () => {
            return (
              <div>
                 <input type="checkbox" />
              </div>
            )
          }
        }
      },
      "Sequence",
      "Information",
      {
        name: "Action",
        options: {
          customBodyRender: (val, tableMeta) => {
            return (
              <div>
                <button
                  type="button"
                  className="btn btn-red btn-small-circle"
                  style={{ marginRight: 5 }}
                  onClick={() => tableMeta.rowData[2] === 'TES TERTULIS' ? this.openCreateFormSelection("create", 'Tulis') :
                    tableMeta.rowData[2] === 'INTERVIEW AWAL' ? this.openCreateFormSelection("create", 'Awal') :
                    tableMeta.rowData[2] === 'ADMINISTRASI' ? this.openCreateFormSelection("create", 'Adm') :
                    tableMeta.rowData[2] === 'TES PSIKOTES' ? this.openCreateFormSelection("create", 'Psikotes') :
                    tableMeta.rowData[2] === 'INTERVIEW AKHIR' ? this.openCreateFormSelection("create", 'Akhir') :
                    this.openCreateFormSelection('create', 'Medical Check Up')}
                >
                  <i className="fa fa-lw fa-plus" />
                </button>
                <button
                  type="button"
                  className="btn btn-red btn-small-circle"
                  style={{ marginRight: 5 }}
                  onClick={() => tableMeta.rowData[2] === 'TES TERTULIS' ? this.openCreateFormSelection("update", 'Tulis') :
                    tableMeta.rowData[2] === 'INTERVIEW AWAL' ? this.openCreateFormSelection("update", 'Awal') :
                    tableMeta.rowData[2] === 'ADMINISTRASI' ? this.openCreateFormSelection("update", 'Adm') :
                    tableMeta.rowData[2] === 'TES PSIKOTES' ? this.openCreateFormSelection("update", 'Psikotes') :
                    tableMeta.rowData[2] === 'INTERVIEW AKHIR' ? this.openCreateFormSelection("update", 'Akhir') :
                    this.openCreateFormSelection('update', 'Medical Check Up')}
                >
                  <i className="fa fa-lw fa-pencil-alt" />
                </button>
                <button
                  type="button"
                  className="btn btn-red btn-small-circle"
                  onClick={this.props.onClickDelete}
                >
                  <i className="fa fa-lw fa-trash-alt" />
                </button>
              </div>
            );
          }
        }
      }
    ];

    dataSelection = [
        ["1", "", "TES TERTULIS", "", "2", ""],
        ["2", "", "INTERVIEW AWAL", "", "3", ""],
        ["3", "", "ADMINISTRASI", "", "4", ""],
        ["4", "", "TES PSIKOTES", "", "", ""],
        ["5", "", "INTERVIEW AKHIR", "", "", ""],
        ["6", "", "MEDICAL CHECK UP", "", "", ""]
    ];

    //other
    columnsOther = [
      "No",
      {
        name: "Other",
        options: {
          customBodyRender: val => {
            return (
              <div
                style={{ cursor: "pointer" }}
                onClick={() => this.openCreateFormOther("view")}
              >
                {val}
              </div>
            );
          }
        }
      },
      {
        name: "Action",
        options: {
          customBodyRender: () => {
            return (
              <div>
                <button
                  type="button"
                  className="btn btn-red btn-small-circle"
                  style={{ marginRight: 5 }}
                  onClick={() => this.openCreateFormOther("update")}
                >
                  <i className="fa fa-lw fa-pencil-alt" />
                </button>
                <button
                  type="button"
                  className="btn btn-red btn-small-circle"
                  onClick={this.props.onClickDelete}
                >
                  <i className="fa fa-lw fa-trash-alt" />
                </button>
              </div>
            );
          }
        }
      }
    ];

  dataOther = [
      ["1", "Belum Nikah", ""]
  ];

    // important
    // vertical tab function
    opNavigator = (id, target, title, status = false) => {
      var cl;
      if (status) {
        cl = "c-n-link active";
      } else {
        cl = "c-n-link";
      }
      return (
        <li className={cl} id={id} onClick={this.opContent(target)}>
          {title}
        </li>
      );
    };

    opContent = target => e => {
      e.preventDefault();
  
      var i, tabcontent, tablinks;
  
      tabcontent = document.getElementsByClassName("vertical-tab-content");
      for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
      }
  
      tablinks = document.getElementsByClassName("c-n-link");
      for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = "c-n-link";
      }
  
      document.getElementById(target).style.display = "block";
      e.currentTarget.className = "c-n-link active";
      console.log(e.currentTarget);
    };

    render() {
        return(
            <div className={this.props.className}>
              <div className="padding-top-20px"></div>
              <div className="popup-content background-white border-radius">
                  <div className="padding-15px background-blue grid grid-2x">
                      <div className="col-1">
                          <div className="txt-site txt-12 txt-bold post-center">
                            { this.props.type === 'create' ? 'Recruitment Request Selection - Create Form' : 'MPP - Update Form' }
                          </div>
                      </div>
                      <div className="col-2 content-right">
                          <button className="btn btn-circle background-blue" onClick={ this.props.onClickClose }>
                              <i className="fa fa-lg fa-times"></i>
                          </button>
                      </div>
                  </div>
                  <form action="#">
                    <div className="border-bottom padding-15px grid grid-2x grid-mobile-none gap-20px">
                      <div className="column-1">

                        <div className="margin-bottom-15px">
                          <div className="margin-5px">
                              <span className="txt-site txt-11 txt-main txt-bold">
                                Request Number
                              </span>
                          </div>
                          <input
                              style={{backgroundColor: '#E6E6E6'}}
                              className="txt txt-sekunder-color"
                              type="text" 
                              readOnly={this.props.type !== 'create'}
                              placeholder=""></input>
                        </div>

                        <div className="margin-bottom-15px">
                          <div className="margin-5px">
                              <span className="txt-site txt-11 txt-main txt-bold">
                                Employee Name
                              </span>
                          </div>
                          <input
                            style={{backgroundColor: '#E6E6E6', width: '80%', marginRight: 10}}
                            className="txt txt-sekunder-color"
                            type="text" 
                            readOnly={this.props.type !== 'create'}
                            placeholder="">                                
                          </input>
                          <button
                            className={"btn btn-circle background-primary"}
                            type="button">
                              <i className="fa fa-lg fa-search"></i>
                          </button>
                        </div>

                        <div className="margin-bottom-15px">
                          <div className="margin-5px">
                              <span className="txt-site txt-11 txt-main txt-bold">
                                T.M.K
                              </span>
                          </div>
                          <input
                              style={{backgroundColor: '#E6E6E6'}}
                              className="txt txt-sekunder-color"
                              type="text" 
                              readOnly={this.props.type !== 'create'}
                              placeholder=""></input>
                        </div>

                        <div className="margin-bottom-15px">
                          <div className="margin-5px">
                              <span className="txt-site txt-11 txt-main txt-bold">
                                Work Period
                              </span>
                          </div>
                          <input
                              style={{backgroundColor: '#E6E6E6'}}
                              className="txt txt-sekunder-color"
                              type="text" 
                              readOnly={this.props.type !== 'create'}
                              placeholder=""></input>
                        </div>

                        <div className="margin-bottom-15px">
                          <div className="margin-5px">
                              <span className="txt-site txt-11 txt-main txt-bold">
                                Recruitment Type <span style={{color:'red'}}>*</span>
                              </span>
                          </div>
                          <select className="cf-select slc slc-sekunder" style={{backgroundColor: '#E6E6E6'}}>
                            <option value="">-- please select recruitment type --</option>
                            <option value="1">1</option>
                            <option value="1">2</option>
                            <option value="1">3</option>
                          </select>
                        </div>

                      </div>
                      <div className="column-2">

                        <div className="margin-bottom-15px">
                          <div className="margin-5px">
                              <span className="txt-site txt-11 txt-main txt-bold">
                                Recruitment Category <span style={{color:'red'}}>*</span>
                              </span>
                          </div>
                          <select className="cf-select slc slc-sekunder" style={{backgroundColor: '#E6E6E6'}}>
                            <option value="">-- please select recruitment category --</option>
                            <option value="1">1</option>
                            <option value="1">2</option>
                            <option value="1">3</option>
                          </select>
                        </div>

                        <div className="margin-bottom-15px">
                          <div className="margin-5px">
                              <span className="txt-site txt-11 txt-main txt-bold">
                                Request Type <span style={{color:'red'}}>*</span>
                              </span>
                          </div>
                          <select className="cf-select slc slc-sekunder" style={{backgroundColor: '#E6E6E6'}}>
                            <option value="">-- please select request type --</option>
                            <option value="1">1</option>
                            <option value="1">2</option>
                            <option value="1">3</option>
                          </select>
                        </div>

                        <div className="margin-bottom-15px">
                          <div className="margin-5px">
                              <span className="txt-site txt-11 txt-main txt-bold">
                                Employee Status Type <span style={{color:'red'}}>*</span>
                              </span>
                          </div>
                          <select className="cf-select slc slc-sekunder" style={{backgroundColor: '#E6E6E6'}}>
                            <option value="">-- please select employee status type --</option>
                            <option value="1">1</option>
                            <option value="1">2</option>
                            <option value="1">3</option>
                          </select>
                        </div>

                        <div className="margin-bottom-15px">
                          <div className="margin-5px">
                              <span className="txt-site txt-11 txt-main txt-bold">
                                Employee Status Category <span style={{color:'red'}}>*</span>
                              </span>
                          </div>
                          <select className="cf-select slc slc-sekunder" style={{backgroundColor: '#E6E6E6'}}>
                            <option value="">-- please select employee status category --</option>
                            <option value="1">1</option>
                            <option value="1">2</option>
                            <option value="1">3</option>
                          </select>
                        </div>

                        <div className="margin-bottom-15px">
                            <div className="margin-5px">
                                <span className="txt-site txt-11 txt-main txt-bold">
                                    Publish Date <span style={{color: "red"}}>*</span>
                                </span>
                            </div>
                            <div className="grid grid-3x grid-mobile-none gap-20px">
                                <div className="column-1">
                                <input
                                    readOnly={this.props.type === "view" ? true : false}
                                    style={{backgroundColor: "#E6E6E6",width: "180px"}}
                                    type="date"
                                    className="txt txt-sekunder-color"
                                    placeholder=""
                                    required
                                />
                                </div>
                                <div className="column-2">
                                <p align="center" className="padding-5px">
                                    To
                                </p>
                                </div>
                                <div className="column-3">
                                <input
                                    readOnly={this.props.type === "view" ? true : false}
                                    style={{backgroundColor: "#E6E6E6",width: "180px"}}
                                    type="date"
                                    className="txt txt-sekunder-color"
                                    placeholder=""
                                    required
                                />
                                </div>
                            </div>
                        </div>
                      </div>
                    </div>

                    <div className="popup-content-grid">

                        <div className="popup-scroll popup-col-1">
                            <ul className="vertical-tab">
                            {this.opNavigator("nav-1", "content-nav-1-a", "Qualification", true)}
                            {this.opNavigator("nav-2", "content-nav-2-a", "Position")}
                            {this.opNavigator("nav-3", "content-nav-3", "Document / File")}
                            {this.opNavigator("nav-4", "content-nav-4", "Selection")}
                            {this.opNavigator("nav-5", "content-nav-5", "Other")}
                            </ul>
                        </div>

                        <div className="popup-scroll popup-col-2">
                            {/* qualification */}
                            <div className="vertical-tab-content active" id="content-nav-1-a" style={{marginLeft:5}}>
                                <MuiThemeProvider theme={this.getMuiTheme()}>
                                  <MUIDataTable
                                    data={this.dataQualification}
                                    columns={this.columnsQualification}
                                    options={this.options}
                                    />
                                </MuiThemeProvider>
                            </div>

                            {/* position */}
                            <div className="vertical-tab-content" id="content-nav-2-a" style={{marginLeft:5}}>
                              <MuiThemeProvider theme={this.getMuiTheme()}>
                                <MUIDataTable
                                  data={this.dataPosition}
                                  columns={this.columnsPosition}
                                  options={this.options}
                                />
                              </MuiThemeProvider>
                            </div>

                            {/* doc */}
                            <div className="vertical-tab-content" id="content-nav-3" style={{marginLeft:5}}>
                              <MuiThemeProvider theme={this.getMuiTheme()}>
                                <MUIDataTable
                                  data={this.dataDocFile}
                                  columns={this.columnsDocFile}
                                  options={this.options}
                                />
                              </MuiThemeProvider>

                              <FormDoc
                               className={this.state.createClassSuratLamaran}
                               type={this.state.type}
                               doctype={this.state.doctype}
                               onClickClose={this.openCreateFormSuratLamaran}
                               onClickSave={this.openSavePopUp} />
                            </div>

                            {/* selection */}
                            <div className="vertical-tab-content" id="content-nav-4" style={{marginLeft:5}}>
                              <MuiThemeProvider theme={this.getMuiTheme()}>
                                <MUIDataTable
                                  data={this.dataSelection}
                                  columns={this.columnsSelection}
                                  options={this.options}
                                />
                              </MuiThemeProvider>

                              <FormSelection
                               className={this.state.createClassSelection}
                               type={this.state.type}
                               selectype={this.state.selectype}
                               onClickClose={this.openCreateFormSelection}
                               onClickSave={this.openSavePopUp} />
                            </div>
                            
                            {/* other */}
                            <div className="vertical-tab-content" id="content-nav-5" style={{marginLeft:5}}>
                              <div className="border-bottom padding-10px  grid-mobile-none gap-20px">
                                <div className="col-1 content-right">
                                  <button
                                    type="button"
                                    className="btn btn-circle background-blue"
                                    style={{ marginRight: 5 }}
                                    onClick={() => this.openCreateFormOther("create")}
                                  >
                                    <i className="fa fa-1x fa-plus" />
                                  </button>
                                </div>
                                <div className="padding-5px" />
                                <MuiThemeProvider theme={this.getMuiTheme()}>
                                  <MUIDataTable
                                    data={this.dataOther}
                                    columns={this.columnsOther}
                                    options={this.options}
                                  />
                                </MuiThemeProvider>

                                <FormOther
                                  className={this.state.createClassOther}
                                  type={this.state.type}
                                  onClickClose={this.openCreateFormOther}
                                  onClickSave={this.openSavePopUp} />
                              </div>
                            </div>
                        </div>
                    </div>

                    <div className="padding-15px">
                      <div className="grid grid-2x">
                        <div className="col-1"></div>
                        <div className="col-2 content-right">
                        <button 
                            style={{marginLeft: "15px"}}
                            className="btn btn-blue" 
                            type="button"
                            onClick={this.props.type === 'create' ? this.props.onClickSave : this.onClick}>
                              <span>{this.props.type === 'create' ? 'SAVE' : 'UPDATE' }</span>
                          </button>
                          <button 
                            style={{marginLeft: "15px"}}
                            className="btn btn-blue" 
                            type="button">
                              <span>PROCESS</span>
                          </button>
                          <button 
                            style={{marginLeft: "15px"}}
                            className="btn btn-blue" 
                            type="button"
                            onClick={ this.props.onClickClose }>
                              <span>CLOSE</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
              </div>
              <div className="padding-bottom-20px"></div>
              <PopUp
                type={"save"}
                class={this.state.saveClass}
                onClick={this.openSavePopUp}
              />
              <PopUp
                type={"delete"}
                class={this.state.deleteClass}
                onClick={this.openDeletePopup}
              />
          </div>
        )
    }
}

export default FormRecruitRequestSelection