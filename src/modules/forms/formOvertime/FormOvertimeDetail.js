import React, { Component } from 'react'
import Form from '../../../components/pages/FieldForm'
import M from 'moment'


class FormOvertimeDetail extends Component {
    constructor(props) {
        super(props)
        this.state = {
            overtimeData: props.overtimeData
        }
    }

    render() {
        let { overtimeData } = this.state
        let startHours = M(overtimeData.overtimeStartDate, 'DD-MM-YYYY HH:mm:ss').format('HH')
        let endHours = M(overtimeData.overtimeEndDate, 'DD-MM-YYYY HH:mm:ss').format('HH')
        let startMinutes = M(overtimeData.overtimeStartDate, 'DD-MM-YYYY HH:mm:ss').format('mm')
        let endMinutes = M(overtimeData.overtimeEndDate, 'DD-MM-YYYY HH:mm:ss').format('mm')
        let hours = endHours - startHours
        let minutes = Math.abs(endMinutes - startMinutes)
        let totalTime = hours+'.'+minutes
        return (
            <div className="vertical-tab-content active">
                <div className="padding-10px col-2 content-right">
                    <button type="button" className="btn btn-circle background-blue margin-right-5px">
                        <i className='fa fa-1x fa-print'></i>
                    </button>
                </div>
                <form action="#">
                    <div className="border-bottom padding-15px grid grid-2x grid-mobile-none gap-20px">
                        <div className="column-1">
                            <div className="margin-bottom-15px">
                                <div className="margin-5px">
                                    <span className="txt-site txt-11 txt-main txt-bold">
                                        Date
                                    </span>
                                </div>
                                <input
                                    value={overtimeData ? M(overtimeData.overtimeDate, "DD/MM/YYYY").format("YYYY-MM-DD") : ''}
                                    type="date"
                                    readOnly
                                    style={{ backgroundColor: '#E6E6E6' }}
                                    className="txt txt-sekunder-color"
                                    placeholder="" />
                            </div>
                            <Form label={'Day'} field={'input'} style={{ backgroundColor: '#E6E6E6' }} readOnly={true} value={overtimeData ? M(overtimeData.overtimeDate, 'DD-MM-YYYY').format('dddd') : ''} />
                            <Form label={'Calendar Status'} field={'input'} style={{ backgroundColor: '#E6E6E6' }} readOnly={true} />
                            <Form label={'Shift'} field={'input'} style={{ backgroundColor: '#E6E6E6' }} readOnly={true} />
                            <div className="margin-bottom-15px">
                                <div className="margin-5px">
                                    <span className="txt-site txt-11 txt-main txt-bold">
                                        Standard Time
                                    </span>
                                </div>
                                <input
                                    value={"09:00"}
                                    type="text"
                                    readOnly
                                    style={{ backgroundColor: '#E6E6E6', width: '35%', marginRight: 10 }}
                                    className="txt txt-sekunder-color"
                                    placeholder="" />
                                to
                                <input
                                    value={"18:00"}
                                    type="text"
                                    readOnly
                                    style={{ backgroundColor: "#E6E6E6", width: '35%', marginLeft: 10 }}
                                    className="txt txt-sekunder-color"
                                    placeholder="" />
                            </div>
                            <div className="margin-bottom-15px">
                                <div className="margin-5px">
                                    <span className="txt-site txt-11 txt-main txt-bold">
                                        Time of Attendance
                                    </span>
                                </div>
                                <input
                                    type="text"
                                    readOnly
                                    style={{ backgroundColor: '#E6E6E6', width: '35%', marginRight: 10 }}
                                    className="txt txt-sekunder-color"
                                    placeholder="" />
                                to
                                <input
                                    type="text"
                                    readOnly
                                    style={{ backgroundColor: "#E6E6E6", width: '35%', marginLeft: 10 }}
                                    className="txt txt-sekunder-color"
                                    placeholder="" />
                            </div>
                        </div>
                        <div className="column-2">
                            <div className="margin-bottom-15px">
                                <div className="margin-5px">
                                    <span className="txt-site txt-11 txt-main txt-bold">
                                        Time of Monitoring
                                    </span>
                                </div>
                                <input
                                    type="text"
                                    readOnly
                                    style={{ backgroundColor: '#E6E6E6', width: '35%', marginRight: 10 }}
                                    className="txt txt-sekunder-color"
                                    placeholder="" />
                                to
                                <input
                                    type="text"
                                    readOnly
                                    style={{ backgroundColor: "#E6E6E6", width: '35%', marginLeft: 10 }}
                                    className="txt txt-sekunder-color"
                                    placeholder="" />
                            </div>
                            <div className="margin-bottom-15px">
                                <div className="margin-5px">
                                    <span className="txt-site txt-11 txt-main txt-bold">
                                        Overtime Hours In
                                </span>
                                </div>
                                <select
                                    type="text"
                                    disabled
                                    style={{ backgroundColor: '#E6E6E6', width: '45%', marginRight: 10 }}
                                    className="txt txt-sekunder-color"
                                    placeholder="">
                                    <option>{overtimeData ? M(overtimeData.overtimeStartDate, 'DD-MM-YYYY HH:mm:ss').format('HH') : ''}</option>
                                </select>
                                to
                                <input
                                    value={overtimeData ? M(overtimeData.overtimeStartDate, 'DD-MM-YYYY HH:mm:ss').format('mm') : ''}
                                    type="text"
                                    readOnly
                                    style={{ backgroundColor: "#E6E6E6", width: '35%', marginLeft: 10 }}
                                    className="txt txt-sekunder-color"
                                    placeholder="" />
                            </div>
                            <div className="margin-bottom-15px">
                                <div className="margin-5px">
                                    <span className="txt-site txt-11 txt-main txt-bold">
                                        Overtime Hours Out
                                </span>
                                </div>
                                <select
                                    type="text"
                                    readOnly
                                    style={{ backgroundColor: '#E6E6E6', width: '45%', marginRight: 10 }}
                                    className="txt txt-sekunder-color"
                                    placeholder="">
                                    <option>{overtimeData ? M(overtimeData.overtimeEndDate, 'DD-MM-YYYY HH:mm:ss').format('HH') : ''}</option>
                                </select>
                                to
                                <input
                                    value={overtimeData ? M(overtimeData.overtimeEndDate, "DD/MM/YYYY HH:mm:ss").format("mm") : ''}
                                    type="text"
                                    readOnly
                                    style={{ backgroundColor: "#E6E6E6", width: '35%', marginLeft: 10 }}
                                    className="txt txt-sekunder-color"
                                    placeholder="" />
                            </div>
                            <Form label={'Overtime Total'} field={'input'} style={{ backgroundColor: '#E6E6E6' }} readOnly={true} value={totalTime} />
                            <Form label={'Overtime (Multiple)'} field={'input'} style={{ backgroundColor: '#E6E6E6' }} readOnly={true} />
                            <Form label={'Description'} field={'textarea'} style={{ backgroundColor: '#E6E6E6', height: 95 }} readOnly={true} value={overtimeData ? overtimeData.overtimeNotes : ''} />
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
                                    onClick={this.props.onClickClose}
                                >
                                    <span>CLOSE</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        )
    }
}

export default FormOvertimeDetail