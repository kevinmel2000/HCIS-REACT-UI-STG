import React, { Component } from 'react'
import { BrowserRouter as Router, NavLink, HashRouter } from "react-router-dom"

class Pages extends Component {
    constructor (props) {
        super(props)
        this.state = {
        	complexMenu: 'complex-menu',
        	complexList: false,
        	complexContent: false,
        	lengthContent: 0,
        	placeSubMenu: '',
        	tabMenu: this.props.tabMenu ? this.props.tabMenu : [],
		    tabSubMenu: this.props.tabSubMenu ? this.props.tabSubMenu : []
        }
    }

    opComplexMenu = () => {
    	if (this.state.complexMenu === 'complex-menu') { 
    		this.setState({
	    		complexMenu: 'complex-menu active',
	    		complexList: true
	    	})
    	} else {
    		this.setState({
	    		complexMenu: 'complex-menu',
	    		complexList: false,
	    		complexContent: false
	    	})
    	}
    }

    clComplexMenu = () => {
    	this.setState({
    		complexList: false
    	})
    }

    opComplexContent = () => {
    	this.setState({
    		complexContent: true
    	})
    }

    clComplexContent = () => {
    	this.setState({
    		complexContent: false
    	})
    }

    contentComponent = (idTarget) => (e) => {
    	e.preventDefault()

    	var data = this.state.tabSubMenu
    	var component = []

    	for (var i = 0; i < data.length; ++i) {
    		if (data[i].target === idTarget) { 
    			component.push(
	    			<NavLink 
		    			to={data[i].link}
		    			key={data[i].id} 
		    			onClick={this.clComplexMenu}>
		    			<div 
		    				className='complex-menu'>
				        	<div className="complex-icon">
				        		<i className={ data[i].icon } />
				        	</div>
				        	<div className="complex-title">
				        		{ data[i].title }
				        	</div>
				        	<div className="complex-sign"></div>
				        </div>
				    </NavLink>
	    		)
    		}
    	}

    	this.setState({
    		placeSubMenu: component
    	})

    	this.opComplexContent()

    	// console.log(component)
    }

    contentList = (id, icon, title, subtitle) => {
	   return (
	   		<div 
	    		onClick={this.contentComponent(id)}
	    		style={{cursor: 'pointer'}}
	    		className="card-notif" 
	    		key={id}>
	    		<div className="c-n-col-1">
	    			<div className="image image-circle image-40px background-dark-grey">
	    				<div className="icn txt-site txt-12 txt-center color-blue">
		    				<i className={icon} />
		    			</div>
	    			</div>
	    		</div>
	    		<div className="c-n-col-2">
	    			<div className="txt-site txt-11">
		    			<div className="txt-site txt-bold txt-main">
		    				{ title }
		    			</div>
			        </div>
			        <div className="txt-site txt-9 txt-thin txt-primary">
			        	{ subtitle }
			        </div>
				</div>
			</div>
		)
	}

    render () {
        return (
        <HashRouter history={ Router.browserHistory }>
            <div className="complex">
                <div 
                	className={this.state.complexMenu}
                	onClick={this.opComplexMenu}>
                	<div className="complex-icon">
                	{ (this.props.icon) 
                		? <i className={this.props.icon} />
                		: <i className="fa fa-lg fa-bars" />
                	}
                	</div>
                	<div className="complex-title">
                	{ (this.props.title) 
                		? this.props.title
                		: 'Complex Menu'
                	}
                	</div>
                	<div className="complex-sign"></div>
                </div>

                { (this.state.complexContent) 
                	? <div className="complex-content">
                		{ this.state.placeSubMenu }
                	</div>
                	: null 
                }

                { (this.state.complexList) 
                	? <div className="complex-list">
                		{this.state.tabMenu.map((data, index) => {
                			return(
                				this.contentList(data.id, data.icon, data.title, data.subtitle)
                			)
                		})}
                	</div>
                	: null 
                }

            </div>
        </HashRouter>
        )
    }

}

export default Pages