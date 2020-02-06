import React, { Component } from 'react'
import PopUp from '../../../pages/PopUpAlert'
import ResizeSlider from '../../../../modules/resize/Slider'
import API from '../../../../Services/Api'
import M from 'moment'
import TablePresence from '../tables/tablePresence'
import FormPresence from './edit/presence/formPresence'
import { connect } from 'react-redux'

const clSlidePage = 'a-s-p-main'

class confPresence extends Component {
    constructor(props) {
        super(props)
        this.state = {
            createVisible: false,
            editPresence: false,
            classAppSlidePage: 'app-side-page',
            classAppSlidePageMain: clSlidePage,
            savePopUpVisible: false,
            saveOk: false,
            deletePopUpVisible: false,
            mapsVisible: false,
            // important for resize pane
            allowResize: false,
            defaultSize: 0,
            minSize: 0,
            maxSize: 0,
            rawData: [],
            rawDataEs: [],
            dataTable: []
        }
    }

    componentDidMount() {
        this.getDataPresence()
        this.getEsByStatus()
    }

    async getDataPresence() {
        let payload = {
            "limit": 100,
            "offset": 0,
            "params": {
                "corporatePresencePointStatus": "ACTIVE"
            }
        }
        let response = await API.create("CFG").getCorporatePresenceByStatus(payload)
        if (response.data && response.data.status === "S") {
            let dataTable = response.data.data.map((value, index) => {
                const { es, corporatePresencePointStatus, isDefault, latitute, longitude } = value
                let isDefaults = isDefault ? "YES" : "NO"
                let isActive = corporatePresencePointStatus === "ACTIVE" ? "YES" : "NO"

                return [
                    es ? es.esname : "",
                    isActive,
                    isDefaults,
                    latitute,
                    longitude
                ]
            })
            this.setState({ rawData: response.data.data, dataTable })
        } else {
            alert("Failed: " + response.data.message)
        }
    }

    async getEsByStatus() {
        let payload = {
            "limit": 100,
            "offset": 0,
            "params": {
                "esStatus": "ACTIVE"
            }
        }

        let response = await API.create("ES").getEsByStatus(payload)
        if (response.data && response.data.status === "S") {
            this.setState({ rawDataEs: response.data.data })
        } else {
            alert("Failed: " + response.data.message)
        }
    }

    async handleSubmit(payload) {
        payload = {
            ...payload,
            corporatePresencePointID: 'CORPREPOINT-' + M(),
            latitute: Number(payload.latitute),
            longitude: Number(payload.longitude),
            radius: Number(payload.radius)
        }
        let response = await API.create("CFG").postCorporatePresence(payload)
        if (response.data && response.data.status === "S") {
            this.openSavePopUp()
            this.getDataPresence()
        } else {
            alert("Failed: " + response.data.message)
        }
    }

    async handleUpdate(payload) {
        let response = await API.create("CFG").updateCorporatePresence(payload)
        if (response.data && response.data.status === "S") {
            this.openSavePopUp()
            this.getDataPresence()
        } else {
            alert("Failed: " + response.data.message)
        }
    }

    async handleDelete() {
        let { rawData, selectedIndex } = this.state
        let payload = {
            "referenceID": rawData[selectedIndex].corporatePresencePointID,
            "requestBy": "SYSTEM",
            "requestDate": M().format("DD-MM-YYYY HH:mm:ss")
        }
        let response = await API.create("CFG").deleteCorporatePresence(payload)
        if (response.data && response.data.status === "S") {
            this.setState({ deletePopUpVisible: false })
            this.getDataPresence()
        } else {
            alert("Failed: " + response.data.message)
        }
    }


    opResizePane = () => {
        this.setState({
            allowResize: true,
            defaultSize: 370,
            minSize: 370,
            maxSize: 850
        })
    }

    clResizePane = () => {
        this.setState({
            editPresence: false,
            allowResize: false,
            defaultSize: 0,
            minSize: 0,
            maxSize: 0
        })
    }

    opSidePage = (menu, index) => (e) => {
        this.setState({
            classAppSlidePage: 'app-side-page op-app-side',
            editPresence: false
        })

        this.opResizePane()

        switch (menu) {
            case 'slide-presence':
                this.setState({
                    editPresence: true,
                    presenceData: this.state.rawData[index]
                })
                break;
            default:
                break
        }

    }

    clSidePage = () => {
        this.setState({ classAppSlidePage: 'app-side-page' })
    }

    openCreateForm = (type = "create", close = false) => {
        this.clResizePane()
        this.setState({ createVisible: !this.state.createVisible, type })
    }

    openMapsForm = (type = "maps", index) => {
        this.clResizePane()
        this.setState({ mapsVisible: !this.state.mapsVisible, type, presenceData: this.state.rawData[index], selectedIndex: index })
    }

    openSavePopUp = () => {
        this.clResizePane()
        this.setState({
            savePopUpVisible: !this.state.savePopUpVisible,
            createVisible: false,
            editPresence: false,
            saveOk: false,
            classAppSlidePage: 'app-side-page'
        })
    }

    openSaveOk = (payload) => {
        this.setState({ saveOk: !this.state.saveOk, payload })
    }

    openDeletePopUp = (index) => {
        this.clResizePane()
        this.setState({
            deletePopUpVisible: !this.state.deletePopUpVisible,
            selectedIndex: index,
        })
    }

    render() {
        return (
            <div>
                <ResizeSlider
                    allowResize={this.state.allowResize}
                    defaultSize={this.state.defaultSize}
                    minSize={this.state.minSize}
                    maxSize={this.state.maxSize}
                    main={(
                        <div>
                            <div className="a-s-p-place a-s-p-content active">
                                <div className="a-s-p-top">
                                    <div className="grid grid-2x">
                                        <div className="col-1">
                                            <div className="margin-left-15px margin-top-10px margin-bottom-10px display-flex-normal">
                                                <div>
                                                    <i className="color-blue fa fa-1x fa-clipboard-list margin-right-10px"></i>
                                                </div>
                                                <div>
                                                    <div className="txt-site txt-12 txt-bold txt-main">
                                                        Presence Point
                                                    </div>
                                                    <div className="txt-site txt-10 txt-thin txt-primary">
                                                        Presence Point
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
                                                id="navmenu-ch" />
                                            <div className="grid grid-2x margin-bottom-10px">
                                                <div className="col-1"></div>
                                                <div className="col-2 content-right">
                                                    <label htmlFor="navmenu-ch">
                                                        <div className="app-open-close-icon"></div>
                                                    </label>
                                                    <button
                                                        className="btn btn-small-circle btn-sekunder margin-left-5px"
                                                        onClick={() => this.openCreateForm("create", false)}>
                                                        <i className="fa fa-lw fa-plus" />
                                                    </button>
                                                </div>
                                                {this.state.createVisible &&
                                                    <FormPresence
                                                        type={"create"}
                                                        dataEs={this.state.rawDataEs}
                                                        onClickSave={this.openSaveOk.bind(this)}
                                                        onClickClose={this.openCreateForm.bind(this)}
                                                        user={this.props.auth.user}
                                                    />
                                                }
                                            </div>
                                            <div className="app-open-close-content">
                                                <TablePresence
                                                    dataTable={this.state.dataTable}
                                                    openSlide={this.opSidePage.bind(this)}
                                                    openMaps={this.openMapsForm.bind(this)}
                                                    onDeletePopup={this.openDeletePopUp.bind(this)}
                                                />
                                            </div>
                                            {this.state.mapsVisible &&
                                                <FormPresence
                                                    type={"maps"}
                                                    data={this.state.presenceData}
                                                    onClickClose={this.openMapsForm.bind(this)}
                                                    user={this.props.auth.user}
                                                />
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    side={(
                        <div className="a-s-p-side">
                            {/* edit */}
                            {(this.state.editPresence) ? (
                                <FormPresence
                                    type={"update"}
                                    data={this.state.presenceData}
                                    dataEs={this.state.rawDataEs}
                                    onClickSave={this.openSaveOk.bind(this)}
                                    closeSlide={this.clResizePane}
                                    user={this.props.auth.user}
                                />)
                                : null}
                        </div>
                    )}></ResizeSlider>

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
                        onClickDelete={this.handleDelete.bind(this)}
                    />
                )}

                {this.state.saveOk && (
                    <PopUp
                        type={"simpan"}
                        class={"app-popup app-popup-show"}
                        onClick={this.openSaveOk.bind(this)}
                        onClickSimpan={this.state.createVisible ? this.handleSubmit.bind(this, this.state.payload) : this.handleUpdate.bind(this, this.state.payload)}
                    />
                )}
            </div>

        )
    }
}

const mapStateToProps = state => {
    return {
        auth: state.auth
    };
};

export default connect(mapStateToProps, null)(confPresence)

// export default confPresence