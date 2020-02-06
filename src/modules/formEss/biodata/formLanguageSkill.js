import React, { Component } from "react";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables-bitozen";
import LoadingBar from "react-top-loading-bar";
var ct = require("../../custom/customTable");

class FormLanguageSkill extends Component {
    constructor(props) {
        super(props);
        let { biodata } = this.props;
        this.state = {
          detailVisible: false,
          selectedIndex: null,
          rawData: [],
          dataTableLanguage: [],
          biodata
        };
      }

    componentDidMount() {
        this.onFinishFetch()
    }

    startFetch = () => {
        this.LoadingBar.continousStart();
    };

    onFinishFetch = () => {
        if (typeof this.LoadingBar === "object") this.LoadingBar.complete();
    };

    getMuiTheme = () => createMuiTheme(ct.customTable());

    options = ct.customOptions();

    columns = [

        "Language",
        "Reading",
        "Writing",
        "Listening",
        "Conversation"
    ];

    dataLanguageSkill = [
        ["English", "Good", "Fair", "Good", "Good"]
    ]


    render() {
        let dataTableLanguage = this.state.biodata.map(value => {
            const {
              languageSkill,
              readingLanguageSkillCompetencyType,
              writingLanguageSkillCompetencyType,
              listeningLanguageSkillCompetencyType,
              conversationLanguageSkillCompetencyType
            } = value;
            return [
               languageSkill.bizparValue,
               readingLanguageSkillCompetencyType.bizparValue,
               writingLanguageSkillCompetencyType.bizparValue,
               listeningLanguageSkillCompetencyType.bizparValue,
               conversationLanguageSkillCompetencyType.bizparValue
            ];
          });
        return (
            <div className="main-content">
                <LoadingBar onRef={ref => (this.LoadingBar = ref)} />


                <div className="padding-5px">
                    <MuiThemeProvider theme={this.getMuiTheme()}>
                        <MUIDataTable
                            title={"Language Skill"}
                            data={dataTableLanguage}
                            columns={this.columns}
                            options={this.options}
                        />
                    </MuiThemeProvider>
                </div>
            </div>

        );
    }
}


export default FormLanguageSkill