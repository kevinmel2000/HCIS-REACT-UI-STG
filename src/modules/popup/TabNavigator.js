import React, { Component } from 'react'

class Pages extends Component {

	constructor () {
    super()
    this.state = {}
  }
  opNavigator = (id, target, title, status = false) => {
	  var cl;
  	if (status) {
  		cl = 'c-n-link active'
  	} else {
  		cl = 'c-n-link'
  	}
  	return (
		  <li 
		  	className={cl}
		  	id={id} 
		  	onClick={this.opContent(target)}>
		  	{title}
		  </li>
		)
  }

  opContent = target => e => {
  	e.preventDefault()

  	var i, tabcontent, tablinks

  	tabcontent = document.getElementsByClassName('c-n-content')
	  for (i = 0; i < tabcontent.length; i++) {
	    tabcontent[i].style.display = 'none'
	  }

	  tablinks = document.getElementsByClassName('c-n-link')
	  for (i = 0; i < tablinks.length; i++) {
	    tablinks[i].className = 'c-n-link'
	  }

  	document.getElementById(target).style.display = 'block'
  	e.currentTarget.className = 'c-n-link active'
  	console.log(e.currentTarget)
  }

	render () {
    return (
    	<div className="main-content">

	    	<div className="card-navigator">
	    		<div className="c-n-top">
	    			<h3 className="c-n-title">
	    				Requirement Request Detail
	    			</h3>
	    		</div>
	    		<div className="c-n-mid">
	    			<div className="c-n-col-1">
	    				<ul className="vertical-tab">
	    					{ this.opNavigator('nav-1', 'content-nav-1', 'General', true) }
	    					{ this.opNavigator('nav-2', 'content-nav-2', 'Qualification') }
	    					{ this.opNavigator('nav-3', 'content-nav-3', 'Position') }
	    					{ this.opNavigator('nav-4', 'content-nav-4', 'Document') }
	    					{ this.opNavigator('nav-5', 'content-nav-5', 'Selection') }
	    					{ this.opNavigator('nav-6', 'content-nav-6', 'Others') }
	    					{ this.opNavigator('nav-7', 'content-nav-7', 'History') }
	    				</ul>
	    			</div>
	    			<div className="c-n-col-2">

	    				<div className="c-n-content active" id="content-nav-1">
	    					<div className="grid grid-2x gap-10px">
	    						<div className="col-1">
		    						<div className="card-form margin-bottom-15px">
		                  <div className="cf-body">
		                    <div className="cf-field">
		                      <label className="cf-label">Title label</label><label className="cf-important">*</label>
		                      <input type="text" className="cf-input txt txt-sekunder" required />
		                      <label className="cf-message">Message label</label>
		                    </div>
		                    <div className="cf-field">
		                      <label className="cf-label">Title label</label><label className="cf-important">*</label>
		                      <input type="text" className="cf-input txt txt-sekunder" required />
		                      <label className="cf-message">Message label</label>
		                    </div>
		                  </div>
		                </div>
		    					</div>
		    					<div className="col-2">
		    						<div className="card-form margin-bottom-10px">
		                  <div className="cf-body">
		                    <div className="cf-field">
		                      <label className="cf-label">Title label</label><label className="cf-important">*</label>
		                      <input type="text" className="cf-input txt txt-sekunder" required />
		                      <label className="cf-message">Message label</label>
		                    </div>
		                    <div className="cf-field">
		                      <label className="cf-label">Title label</label><label className="cf-important">*</label>
		                      <input type="text" className="cf-input txt txt-sekunder" required />
		                      <label className="cf-message">Message label</label>
		                    </div>
		                  </div>
		                </div>
		    					</div>
		    				</div>
		    				<div className="grid">
		    					<div className="content-right">
		    						<button className="btn btn-blue">
		    							Close
		    						</button>
		    					</div>
		    				</div>
	    				</div>

	    				<div className="c-n-content" id="content-nav-2">Tab-2</div>
	    				<div className="c-n-content" id="content-nav-3">Tab-3</div>
	    				<div className="c-n-content" id="content-nav-4">Tab-4</div>
	    				<div className="c-n-content" id="content-nav-5">Tab-5</div>
	    				<div className="c-n-content" id="content-nav-6">Tab-6</div>
	    				<div className="c-n-content" id="content-nav-7">Tab-7</div>

	    			</div>
	    		</div>
	    	</div>

    	</div>
    )
  }

}

export default Pages

