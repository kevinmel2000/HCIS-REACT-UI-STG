import React, { Component } from 'react'
// import SocketIOClient from 'socket.io-client'

class WebsocketNotif extends Component {
    constructor(props) {
        super(props)
        this.state = {
            type: props.type,
            message: props.message
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.type !== prevProps.type) return this.setState({ type: this.props.type })
    }

    render() {
        let { type, message } = this.state
        return (
            type === "stack" ?
                <div style={{zIndex: 600}}>
                    <div style={{ padding: "20px", backgroundColor: "#00C853", color: "white", opacity: 0.8, margin: "10px", borderRadius: "5px" }}>
                        <div className="grid grid-2x">
                            <div className="col-1">
                                <div className="display-flex-normal">
                                    <div className="margin-right-10px">
                                        <i className="fas fa-check"></i>
                                    </div>
                                    <div>
                                        {/* <div className="txt-site txt-12 txt-bold txt-white"> Success </div> */}
                                        <div className="txt-site txt-10 txt-thin txt-white"> {message} </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-2">
                                <span style={{ marginLeft: "15px", color: "white", fontWeight: "bold", float: "right", fontSize: "22px", lineHeight: "20px", cursor: "pointer", transition: "0.3s" }}>&times;</span>
                            </div>
                        </div>
                    </div>
                </div> :
                <div style={{zIndex: 600}}>
                    <div className={"app-popup app-popup-websocket"} style={{ backgroundColor: "transparent" }}>
                        <div className="popup-alert" style={{ top: "85%", left: "87%" }}>
                            <div style={{ padding: "20px", backgroundColor: "#00C853", color: "white", opacity: 0.95, margin: "10px", borderRadius: "5px" }}>
                                <div className="grid grid-2x">
                                    <div className="col-1" style={{ width: "150%" }}>
                                        <div className="display-flex-normal">
                                            <div className="margin-right-10px">
                                                <i className="fas fa-check"></i>
                                            </div>
                                            <div>
                                                {/* <div className="txt-site txt-12 txt-bold txt-white"> Success </div> */}
                                                <div className="txt-site txt-10 txt-thin txt-white"> {message} </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-2">
                                        <span style={{ marginLeft: "15px", color: "white", fontWeight: "bold", float: "right", fontSize: "22px", lineHeight: "20px", cursor: "pointer", transition: "0.3s" }} onClick={this.props.onClickClose.bind(this)}>&times;</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
        )
    }
}

export default WebsocketNotif