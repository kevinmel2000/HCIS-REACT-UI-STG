import React, { Component } from 'react'

var ddComponent = ''

class Tree {
	
	constructor(root) {
		this._root = root || null
	}

	_traverse(callback) {
	    const self = this
	    function goThrough(node) {
	    	callback(node)
	    	node.children.forEach((child) => {
	    		goThrough(child);
	    	})
	    }
	    // goThrough(this._root, dash)
	    goThrough(this._root)
  	}

	_addNode(value, parentValue) {
		const newNode = {
			value,
			children: []
		}

		if (this._root === null) {
			this._root = newNode
			return
		}

		this._traverse((node) => {
			if (node.value === parentValue) {
				node.children.push(newNode)
			}
		})
	}

	_removeNode(value) {
		this._traverse((node) => {
			node.children.forEach((childNode, index) => {
				if (childNode.value === value) {
					node.children.splice(index, 1)
				}
			})
		})
	}

	_search(value) {
		let returnNode = 'Not Found'
		this._traverse((node) => {
			if (node.value === value) {
				returnNode = node
			}
		})

		return returnNode
	}

	_displayLeafs(parentValue) {
		const parentNode = typeof parentValue === 'string' ? this._search(parentValue) : parentValue
		let leafsRet = []
		if (parentValue.children && !parentValue.children.length) {
			return parentValue
		}

		parentNode.children.forEach((child) => {
			leafsRet.push(this._displayLeafs(child))
		})

		return leafsRet.flat()
	}


}

class Node {
	constructor(value, children) {
		this.value = value
		this.children = children
	}
}

class DDL extends Component {
	constructor(props) {
	    super(props)
	    this.state = {
	    	ddComponent: '',
	    	ddState: 'drop-down-list',
	    	ddTitle: (this.props.title) ? this.props.title : 'Select one menu',
	    	ddData: this.props.data ? this.props.data : [],
	    	ddTree: this.makeArray(this.props.data ? this.props.data : [])
	    }
	}

	componentDidMount() {
		// this.makeArray()
	}

	dataTest(child, type) {
		ddComponent += "<ul>"
		child.forEach((dt, index) => {
			ddComponent += '<li>\
			<div class="ddl-tree-menu">\
				<div class="txt-site txt-11 txt-bold txt-main">'+dt.value+'</div>\
				<div class="txt-site txt-10 txt-normal txt-primary">'+dt.children.length+' sub-menus</div>\
			</div>'
			if (dt.children.length > 0) {
				this.dataTest(dt.children)
			}
			ddComponent += '</li>'
		})
		ddComponent += "</ul>"
	}

	getArray(child) {
		ddComponent = ''
		this.dataTest(child)
		this.setState({ddComponent: ddComponent})
		console.log('tree', ddComponent)
	}

	// setArray(arr) {
	// 	console.log('tree', arr)

	// 	this.setState({ddTree: arr})
	// 	console.log('data', this.state.ddData)
	// 	console.log('set tree', this.state.ddTree)
	// }

	// updateArray() {
	// 	const data = this.state.ddData
	// 	if (data.length > 0) {
	// 		const tree = new Tree()

	// 		data && data.map((dt, index) => {
	// 			tree._addNode(dt.value, dt.parent)
	// 		})
	// 		this.setArray(tree._root)
	// 	}
	// }

	makeArray(data) {
		if (data.length > 0) {
			const tree = new Tree()

			data && data.map((dt, index) => {
				tree._addNode(dt.value, dt.parent)
			})

			return(JSON.parse(JSON.stringify(tree._root)))
		} else {
			return([])
		}
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

	clDropDown = () => () => {
		this.setState({ ddState: 'drop-down-list' })
	}

	opDropDown = () => {
		var element = document.getElementById('app-drop-down-list')
		this.setState({ ddState: 'drop-down-list active' })
		this.handleClickOutside(element)
		this.getArray(this.state.ddTree.children)
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
			let value = this.state.ddData[iIndex].value

			this.state.ddData[iIndex].subMenu && this.state.ddData[iIndex].subMenu.map((data, index) => {
				payloadSubmenu.push({
		        	id: data.id,
		        	title: data.title,
		        	value: data.value,
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

			this.props.onChange(value)
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
		    let value = this.state.ddData[iIndex].subMenu[jIndex].value

		    this.state.ddData[iIndex].subMenu && this.state.ddData[iIndex].subMenu.map((data, index) => {
		      let stt
		      (jIndex === index) ? stt = 'active' : stt = ''
		      payloadSubmenu.push({
		        id: data.id,
		        title: data.title,
		        value: data.value,
		        status: stt
		      })
		    })

		    this.state.ddData && this.state.ddData.map((data, index) => {
		    	var stt
		    	var sub
		    	
		    	{/*(iIndex == index) ? stt = 'active' : stt = ''*/}

		    	{(iIndex == index) ? sub = payloadSubmenu : sub = data.subMenu}

		    	payloadMenu.push({
		    		id: data.id,
			        title: data.title,
			        value: data.value,
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

		    this.props.onChange(value)
		    this.setState(newData)
		    this.clDropDown()

		    // console.log('new data', this.state.ddData)
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

			        {(this.state.ddTree) 
			        ? <div className="ddl-place">

			        		<div dangerouslySetInnerHTML={{__html: this.state.ddComponent}} />

			        		{/* this.state.ddTree && this.state.ddTree.children.map((data, index) => {
			        			return(
			        				<div>
			        					<li>
			        						<div className="txt-site txt-11 txt-bold txt-main">
			        							{ data.value }
			        						</div>
			        						<div className="txt-site txt-10 txt-normal txt-primary">
			        							{ data.children.length } sub-menus
			        						</div>
			        					</li>
			        				</div>
			        			)
			        		}) */}
			        		{/*this.state.ddData && this.state.ddData.map((data, iIndex) => {
			        			return (
			        				<div>
			        					<input 
			        						type="radio" 
			        						name="select-ddl"
			        						id={data.id} />
			        					<label htmlFor={data.id}>
					        				<li
					        					key={data.id}
					        					onClick={this.opDropMenu(iIndex)}
					        					className={(data.status === 'active') ? 'selected' : ''}>
					        					<div className="txt-site txt-11 txt-bold txt-main">
					        						{data.title}
					        					</div>
					        					<div className="txt-site txt-10 txt-normal txt-primary">
					        						{data.subMenu.length} sub-menus
					        					</div>
					        				</li>
					        			</label>
					        			{(data.subMenu && data.subMenu.length) ?
					        				<div className="ddl-submenu">
						        				<ul>
						        				{data.subMenu && data.subMenu.map((sub, jIndex) => {
						        					return (
							        					<li id={sub.id}
							        						className={(sub.status === 'active') ? 'selected' : ''}
							        						onClick={this.opDropSubMenu(iIndex, jIndex)}>
							        						<span className="ddl-sign-submenu" />
							        						{ sub.title }
							        					</li>
						        					)
						        				})}
						        				</ul>
						        			</div>
					        			: null}
				        			</div>
			                  	)
			                })*/}
			        	
			        </div>
			        : null
			        }
	    		</div>
	    	</div>
	    )
	}
}

export default DDL