import React, { Component } from 'react'

class DDL extends Component {
	constructor(props) {
	    super(props)
	    this.state = {
	    	ddState: 'drop-down-list',
	    	ddTitle: (this.props.title) ? this.props.title : '--- Please Select Position ---',
	    	ddData: this.props.data
	    }
	}

	componentWillMount() {
		// console.log('data', this.state.ddData)
	}

	componentDidUpdate(prevProps) {
		if (this.props.data !== prevProps.data) return this.setState({ ddData: this.props.data })
	}

	handleClickOutside(element) {
		const outsideclickListener = event => {
			if (!element.contains(event.target)) {
				this.setState({ ddState: 'drop-down-list' })
				removeClickListener()
			}
		}

		const removeClickListener = () => {
			// this.setState({smallProfileClass: clActivePopup})
			document.removeEventListener('click', outsideclickListener)
		}

		document.addEventListener('click', outsideclickListener)
	}

	changeTitle = (title, ou) => () => {
		let newData = {
		    ddTitle: title
		}
		this.setState(newData)
		this.props.onChange(ou)
	}

	clDropDown = () => () => {
		this.setState({ ddState: 'drop-down-list' })
	}

	opDropDown = () => {
		var element = document.getElementById('app-drop-down-list')
		this.setState({ ddState: 'drop-down-list active' })
		this.handleClickOutside(element)
	}

	opSubMenu = (e) => {
		e.preventDefault()
		console.log('you click me')
	}

	opDropMenu = (iIndex) => (e) => {
		// e.preventDefault()

		if (iIndex !== null) {
			let payloadMenu = []
			let payloadSubmenu = []
			let title = this.state.ddData[iIndex].title
			// let value = this.state.ddData[iIndex].value
			let ou = this.state.ddData[iIndex].ou

			this.state.ddData[iIndex].subMenu && this.state.ddData[iIndex].subMenu.map((data, index) => {
				payloadSubmenu.push({
		        	id: data.id,
		        	title: data.title,
					value: data.value,
					ou: data.ou,
		        	status: ''
		      	})
		    })

		    this.state.ddData && this.state.ddData.map((data, index) => {
		    	var sub

		    	{(iIndex == index) ? sub = payloadSubmenu : sub = data.subMenu}

		    	payloadMenu.push({
		    		id: data.id,
			        title: data.title,
					value: data.value,
					ou: data.ou,
			        status: '',
			        subMenu: sub
		    	})
		    })

		    let newData = {
		    	ddData: [
		    		...payloadMenu
		    	],
		    	ddTitle: title
		    }

			this.props.onChange(ou)
			this.setState(newData)
			// console.log('new data', newData)
		}
	}

	opDropSubMenu = (iIndex, jIndex) => (e) => {
	    e.preventDefault()

	    // console.log('old data', this.state.ddData)

	    if (iIndex !== null) {

	    	let payloadMenu = []
		    let payloadSubmenu = []
		    let title = this.state.ddData[iIndex].subMenu[jIndex].title
			// let value = this.state.ddData[iIndex].subMenu[jIndex].value
			let ou = this.state.ddData[iIndex].subMenu[jIndex].ou

		    this.state.ddData[iIndex].subMenu && this.state.ddData[iIndex].subMenu.map((data, index) => {
		      let stt
		      (jIndex === index) ? stt = 'active' : stt = ''
		      payloadSubmenu.push({
		        id: data.id,
		        title: data.title,
				value: data.value,
				ou: data.ou,
		        status: stt
		      })
		    })

		    this.state.ddData && this.state.ddData.map((data, index) => {
		    	// var stt
		    	var sub
		    	
		    	{/*(iIndex == index) ? stt = 'active' : stt = ''*/}

		    	{(iIndex == index) ? sub = payloadSubmenu : sub = data.subMenu}

		    	payloadMenu.push({
		    		id: data.id,
			        title: data.title,
					value: data.value,
					ou: data.ou,
			        status: '',
			        subMenu: sub
		    	})
		    })

		    let newData = {
		      ddData: [
		      	...payloadMenu
		      ],
		      ddTitle: title
		    }

		    this.props.onChange(ou)
		    this.setState(newData)
		    this.clDropDown()

		    // console.log('new data', this.state.ddData)
		}
  
  }

  renderDDLChildren = (data, subid) => {
    return(
      <ul>
        {data && data.map((sub, index) => {
          return(
            <li>
              <input type="radio" name={"sumenu-" + subid} id={sub.id} />
							<label 
								htmlFor={sub.id}
								onClick={this.changeTitle(sub.title, sub.ou)}>
								<div className="title">{ sub.title }</div>
								<div className="subtitle">
                  { (sub.subMenu) 
									? (sub.subMenu.length + ' sub-menus')
									: ('0 sub-menus') }
								</div>
							</label>
              { sub.subMenu && this.renderDDLChildren(sub.subMenu, sub.id) }
            </li>
          )
        })}
      </ul>
    )
  }

  renderDDLMenu = () => {
    let data = this.state.ddData 
    if (data) {
      return (
        <ul>
          { data && data.map((dt, index) => {
            return(
              <li>
                <input type="radio" name="menu" id={dt.id} />
                <label htmlFor={dt.id} onClick={this.changeTitle(dt.title, dt.ou)}>
				        	<div className="title">{ dt.title }</div>
				        	<div className="subtitle">
				        		{ (dt.subMenu && dt.subMenu.length > 0) 
                      ? (dt.subMenu.length + ' sub-menus')
                      : ('0 sub-menus') }
                  </div>
				        </label>
                { (dt.subMenu && dt.subMenu.length > 0) 
                ? this.renderDDLChildren(dt.subMenu, dt.id)
                : null }
              </li>
            )
          })}
        </ul>
      )
    }
  }

	render() {
	    return (
	    	<div 
	    		className={this.state.ddState}
	    		id="app-drop-down-list">
	    		<div className="ddl-border">
	    			<div 
	    				className="ddl-selected" 
	    				style={{ backgroundColor: this.props.disabled ? "#E6E6E6" : null }} 
	    				onClick={this.props.disabled ? null : this.opDropDown}>
			            <div className="ddl-title">
			              <span className="title">{this.state.ddTitle}</span>
			            </div>
			            <div className="ddl-icon">
			              <span className="icon"></span>
			            </div>
			        </div>
              <div className="ddl-menu">
                { this.renderDDLMenu() }
              </div>
	    		</div>
	    	</div>
	    )
	}
}

export default DDL