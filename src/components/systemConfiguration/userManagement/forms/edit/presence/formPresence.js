import React, { Component } from 'react'
import DropDown from '../../../../../../modules/popup/DropDown'
import M from 'moment'
import * as R from 'ramda'
import { Map, Marker, GoogleApiWrapper } from 'google-maps-react'

const defaultPayload = {
    "corporatePresencePointID": "",
    "latitute": "",
    "longitude": "",
    "radius": "",
    "isDefault": false,
    "es": "",
    "corporatePresencePointStatus": "ACTIVE",
    "corporatePresencePointCreationalDTO": {
        "createdBy": "SYSTEM",
        "createdDate": M().format("DD-MM-YYYY HH:mm:ss"),
        "modifiedBy": null,
        "modifiedDate": null
    }
}

class formPresence extends Component {
    constructor(props) {
        super(props)
        this.state = {
            presenceData: props.data ? { ...props.data, es: props.data.es ? props.data.es.esid : "" } :
                {
                    ...defaultPayload,
                    corporatePresencePointCreationalDTO: {
                        ...defaultPayload.corporatePresencePointCreationalDTO,
                        createdBy: this.props.user.employeeID,
                        modifiedBy: this.props.user.employeeID,
                    }
                }
        }
    }


    handleLat = (e) => {
        if (isNaN(e.target.value)) return true
        this.setState({
            presenceData: {
                ...this.state.presenceData,
                latitute: e.target.value
            }
        })
    }

    handleLong = (e) => {
        if (isNaN(e.target.value)) return true
        this.setState({
            presenceData: {
                ...this.state.presenceData,
                longitude: e.target.value
            }
        })
    }

    handleRadius = (e) => {
        if (isNaN(e.target.value)) return true
        this.setState({
            presenceData: {
                ...this.state.presenceData,
                radius: e.target.value
            }
        })
    }

    componentDidUpdate(prevProps) {
        if (this.props.data !== prevProps.data) this.setState({ presenceData: this.props.data })
    }

    renderFormCreate = () => {
        let { dataEs } = this.props
        let { presenceData } = this.state
        return (
            <div className="app-popup app-popup-show">
                <div className="padding-top-20px" />
                <div className="popup-content background-white border-radius">

                    <div className="popup-panel grid grid-2x">
                        <div className="col-1">
                            <div className="popup-title">
                                Presence Point - Create Form
                            </div>
                        </div>
                        <div className="col-2 content-right">
                            <button
                                type="button"
                                className="btn btn-circle btn-grey"
                                onClick={() => this.props.onClickClose("create", true)}>
                                <i className="fa fa-lg fa-times" />
                            </button>
                        </div>
                    </div>

                    <form action="#" onSubmit={(e) => {
                        e.preventDefault()
                        if (R.isEmpty(this.state.presenceData.es)) return alert('Presence Point Name is Required.')
                        this.props.onClickSave(this.state.presenceData)
                    }}>
                        <div className="display-flex-normal">
                            <div style={{ width: '50%' }}>
                                <div className="padding-15px">
                                    <div className="margin-bottom-20px">
                                        <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                                            <h4>Presence Point Name <span style={{ color: "red" }}>*</span></h4>
                                        </div>
                                        <div className="margin-5px">
                                            <DropDown
                                                title="-- please select presence point name --"
                                                onChange={(e) => this.setState({
                                                    presenceData: {
                                                        ...presenceData,
                                                        es: e
                                                    }
                                                })}
                                                data={dataEs}
                                                type="es" />
                                        </div>
                                    </div>
                                    <div className="margin-bottom-20px">
                                        <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                                            <h4>Latitude <span style={{ color: "red" }}>*</span></h4>
                                        </div>
                                        <div className="margin-5px">
                                            <div className="card-date-picker">
                                                <div className="double">
                                                    <input
                                                        type="text"
                                                        required
                                                        className="txt txt-sekunder-color"
                                                        value={presenceData.latitute}
                                                        onChange={this.handleLat.bind(this)}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="margin-bottom-20px">
                                        <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                                            <h4>Longitude <span style={{ color: "red" }}>*</span></h4>
                                        </div>
                                        <div className="margin-5px">
                                            <div className="card-date-picker">
                                                <div className="double">
                                                    <input
                                                        type="text"
                                                        required
                                                        className="txt txt-sekunder-color"
                                                        value={presenceData.longitude}
                                                        onChange={this.handleLong.bind(this)}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="margin-bottom-20px">
                                        <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                                            <h4>Radius (m) <span style={{ color: "red" }}>*</span></h4>
                                        </div>
                                        <div className="margin-5px">
                                            <div className="card-date-picker">
                                                <div className="double">
                                                    <input
                                                        type="text"
                                                        required
                                                        className="txt txt-sekunder-color"
                                                        value={presenceData.radius}
                                                        onChange={this.handleRadius.bind(this)}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="grid grid-2x">
                                        <div className="col-1 margin-bottom-30px">
                                            <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                                                <h4>Is Active</h4>
                                            </div>
                                            <div className="margin-5px">
                                                <label className="radio">
                                                    <input type="checkbox" name="all-day" disabled checked />
                                                    <span className="checkmark" />
                                                    <span className="txt-site txt-11 txt-bold txt-main">
                                                        Is Active
                                                </span>
                                                </label>
                                            </div>
                                        </div>

                                        <div className="col-2 margin-bottom-30px">
                                            <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                                                <h4>Is Default</h4>
                                            </div>
                                            <div className="margin-5px">
                                                <label className="radio">
                                                    <input type="checkbox" name="all-day"
                                                        onChange={(e) => this.setState({
                                                            presenceData: {
                                                                ...presenceData,
                                                                isDefault: e.target.checked
                                                            }
                                                        })} />
                                                    <span className="checkmark" />
                                                    <span className="txt-site txt-11 txt-bold txt-main">
                                                        Is Default
                                                </span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div style={{ width: '50%' }}>
                                <Map
                                    google={this.props.google}
                                    zoom={8}
                                    style={{ width: '50%', height: '100%' }}
                                    initialCenter={{ lat: -6.90389, lng: 107.61861 }}
                                >
                                    <Marker position={{ lat: presenceData.latitute, lng: presenceData.longitude }} />
                                </Map>
                            </div>
                        </div>

                        <div className="border-bottom padding-15px content-right">
                            <button
                                className="btn btn-primary margin-right-10px"
                                type='button'
                                onClick={() => this.props.onClickClose("create", true)}>
                                BACK
                            </button>
                            <button
                                className="btn btn-blue"
                                type='submit'>
                                SUBMIT
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        )
    }

    renderFormEdit = () => {
        let { dataEs, data } = this.props
        let { presenceData } = this.state
        return (
            <div className="a-s-p-place active">
                <div className="a-s-p-top">
                    <div className="grid grid-2x">
                        <div className="col-1">
                            <div className="display-flex-normal margin-top-10px">
                                <i className="fa fa-1x fa-clipboard-list"></i>
                                <span className="txt-site txt-11 txt-main margin-left-10px">
                                    Presence Point
								</span>
                            </div>
                        </div>
                        <div className="col-2 content-right">
                            <button
                                onClick={this.props.closeSlide}
                                className="btn btn-circle btn-grey">
                                <i className="fa fa-lg fa-arrow-right" />
                            </button>
                        </div>
                    </div>
                </div>
                <div className="a-s-p-mid a-s-p-pad border-top">
                    <form action="#" onSubmit={(e) => {
                        e.preventDefault()
                        if (R.isEmpty(this.state.presenceData.es)) return alert('Presence Point Name is Required.')
                        let payload = this.state.presenceData
                        payload = {
                            ...payload,
                            es: !R.isNil(payload.es) ? payload.es : "",
                            latitute: Number(payload.latitute),
                            longitude: Number(payload.longitude),
                            radius: Number(payload.radius),
                            corporatePresencePointCreationalDTO: {
                                ...payload.corporatePresencePointCreationalDTO,
                                modifiedBy: "SYSTEM",
                                modifiedDate: M().format("DD-MM-YYYY HH:mm:ss")
                            }
                        }
                        this.props.onClickSave(payload)
                    }}>
                        <div className="margin-15px">
                            <div className="margin-bottom-20px">
                                <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                                    <h4>Presence Point Name <span style={{ color: "red" }}>*</span></h4>
                                </div>
                                <div className="margin-5px">
                                    <DropDown
                                        disabled={true}
                                        title="-- please select presence point name --"
                                        onChange={(e) => this.setState({
                                            presenceData: {
                                                ...presenceData,
                                                es: e
                                            }
                                        })}
                                        value={presenceData.es}
                                        leaveType={data.es && data.es.esname}
                                        data={dataEs}
                                        type="es" />
                                </div>
                            </div>
                            <div className="margin-bottom-20px">
                                <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                                    <h4>Latitude <span style={{ color: "red" }}>*</span></h4>
                                </div>
                                <div className="margin-5px">
                                    <div className="card-date-picker">
                                        <div className="double">
                                            <input
                                                type="text"
                                                required
                                                className="txt txt-sekunder-color"
                                                value={presenceData.latitute}
                                                onChange={this.handleLat.bind(this)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="margin-bottom-20px">
                                <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                                    <h4>Longitude <span style={{ color: "red" }}>*</span></h4>
                                </div>
                                <div className="margin-5px">
                                    <div className="card-date-picker">
                                        <div className="double">
                                            <input
                                                type="text"
                                                required
                                                className="txt txt-sekunder-color"
                                                value={presenceData.longitude}
                                                onChange={this.handleLong.bind(this)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="margin-bottom-20px">
                                <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                                    <h4>Radius (m) <span style={{ color: "red" }}>*</span></h4>
                                </div>
                                <div className="margin-5px">
                                    <div className="card-date-picker">
                                        <div className="double">
                                            <input
                                                type="text"
                                                required
                                                className="txt txt-sekunder-color"
                                                value={presenceData.radius}
                                                onChange={this.handleRadius.bind(this)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="margin-bottom-20px">
                                <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                                    <h4>Is Active</h4>
                                </div>
                                <div className="margin-5px">
                                    <label className="radio">
                                        <input type="checkbox" name="all-day" disabled checked />
                                        <span className="checkmark" />
                                        <span className="txt-site txt-11 txt-bold txt-main">
                                            Is Active
                                        </span>
                                    </label>
                                </div>
                            </div>

                            <div className="margin-bottom-20px">
                                <div className="txt-site txt-11 txt-bold txt-main display-flex-normal">
                                    <h4>Is Default</h4>
                                </div>
                                <div className="margin-5px">
                                    <label className="radio">
                                        <input type="checkbox" name="all-day"
                                            onChange={(e) => this.setState({
                                                presenceData: {
                                                    ...presenceData,
                                                    isDefault: e.target.checked
                                                }
                                            })}
                                            value={presenceData.isDefault}
                                            checked={presenceData.isDefault}
                                        />
                                        <span className="checkmark" />
                                        <span className="txt-site txt-11 txt-bold txt-main">
                                            Is Default
                                        </span>
                                    </label>
                                </div>
                            </div>
                            <div className="border-bottom padding-15px content-right">
                                <button
                                    className="btn btn-blue"
                                    type='submit'>
                                    SUBMIT
                                </button>
                            </div>
                            <div className="margin-bottom-20px">
                                <Map
                                    google={this.props.google}
                                    zoom={8}
                                    style={{ width: '100%', height: '100%' }}
                                    initialCenter={{ lat: presenceData.latitute, lng: presenceData.longitude }}
                                >
                                    <Marker position={{ lat: presenceData.latitute, lng: presenceData.longitude }} />
                                </Map>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        )
    }

    renderViewMaps = () => {
        let { presenceData } = this.state
        return (
            <div className="app-popup app-popup-show">
                <div className="padding-top-20px" />
                <div className="popup-content-small background-white border-radius">

                    <div className="popup-panel grid grid-2x">
                        <div className="col-1" style={{ width: "140%" }}>
                            <div className="popup-title">
                                Presence Point - {presenceData.es}
                            </div>
                        </div>
                        <div className="col-2 content-right">
                            <button
                                type="button"
                                className="btn btn-circle btn-grey"
                                onClick={() => this.props.onClickClose("maps", true)}>
                                <i className="fa fa-lg fa-times" />
                            </button>
                        </div>
                    </div>

                    <div className="border-bottom grid-mobile-none gap-20px">
                        <Map
                            google={this.props.google}
                            zoom={8}
                            style={{ width: '100%', height: '700%' }}
                            initialCenter={{ lat: presenceData.latitute, lng: presenceData.longitude }}
                        >
                            <Marker position={{ lat: presenceData.latitute, lng: presenceData.longitude }} />
                        </Map>
                    </div>

                </div>
            </div>
        )
    }

    render() {
        let { type } = this.props
        return (
            <div>
                {type === "create" ? this.renderFormCreate() : type === "update" ? this.renderFormEdit() : this.renderViewMaps()}
            </div >
        )
    }
}

export default GoogleApiWrapper({ apiKey: 'AIzaSyBhN4u9ZWJ21KdIN7mS-2y-sj0WOZk3myA' })(formPresence)