import React, { Component } from 'react'

class InlineEditing extends Component {
	constructor (props) {
    super(props)
    this.state = {
    	sttEditAble: false,
    	clEditAble: 'inline-editing'
    }
  }

  opEditAble = () => {
  	this.setState({
  		sttEditAble: true,
  		clEditAble: 'inline-editing active'
  	})
  }

  clEditAble = () => {
  	this.setState({
  		sttEditAble: false,
  		clEditAble: 'inline-editing'
  	})
  }

  svEditAble = () => {
  	alert(this.props.api)
  	this.clEditAble()
  }

  render () {
  	return (
  		<div className={this.state.clEditAble}>
  			
  			<div 
  				onClick={this.opEditAble}
  				className="i-e-text" 
  				contentEditable={this.state.sttEditAble}>
  				{ this.props.text }
  			</div>
  			
  			<div className="i-e-tool">
  				<button 
  					onClick={this.svEditAble}
  					className="i-e-btn btn btn-small-circle background-green">
  					<i className="fa fa-lw fa-check" />
  				</button>
  				<button 
  					onClick={this.clEditAble}
  					className="i-e-btn btn btn-small-circle background-red">
  					<i className="fa fa-lw fa-times" />
  				</button>
  			</div>

  		</div>
  	)
  }

}

export default InlineEditing