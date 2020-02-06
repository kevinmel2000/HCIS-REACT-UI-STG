import React, { Component } from 'react'

class ButtonAction extends Component {

  constructor (props) {
    super(props)
    this.state = {
      clBtn: this.props.now.btnColor,
    	clIcn: this.props.now.btnIcon,
    	clTxt: this.props.now.btnText,
    	clStatus: false
    }
  }

  opBtn = () => {
  	if (this.state.clStatus === false) { 
  		this.setState({
  			clStatus: true,
  			clBtn: this.props.then.btnColor,
	    	clIcn: this.props.then.btnIcon,
	    	clTxt: this.props.then.btnText,
  		})
  	} else {
  		this.setState({
  			clStatus: false,
  			clBtn: this.props.now.btnColor,
	    	clIcn: this.props.now.btnIcon,
	    	clTxt: this.props.now.btnText,
  		})
  	}
  }

  render () {
  	return (
  		<span onClick={this.props.return}>
	  		<button 
	  			onClick={this.opBtn}
					className={this.state.clBtn} >
					<i className={this.state.clIcn} /> {this.state.clTxt}
				</button>
			</span>
  	)
  }

}

export default ButtonAction