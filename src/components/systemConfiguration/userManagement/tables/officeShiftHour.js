import React, { Component } from 'react'
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles'
import MUIDataTable from "mui-datatables-bitozen"
import * as R from 'ramda'
import M from 'moment'
import Api from '../../../../Services/Api'

var ct = require("../../../../modules/custom/customTable")
const getMuiTheme = () => createMuiTheme(ct.customTable())
const options = ct.customOptions()

class OfficeOfficeHours extends Component {
	constructor(props) {
		super(props)
		this.state = {
			data: [],
			rawData: [],
			officeCount: 0,
			table_limit: 5,
			table_page: 0,
			table_query: "",
		}
	}

	componentDidMount() {
		this.getData(this.state.table_page, this.state.table_limit)
	}

	componentDidUpdate(prevProps) {
		if (this.props.data !== prevProps.data) this.setState({ data: this.props.data })
	}

	getData(page, limit) {
		let payload = {
			"limit": limit,
			"offset": page,
			"params": {
				"shiftStatus": "ACTIVE"
			}
		}

		let name = {
			limit: limit,
			offset: page,
			params: {
				shiftStatus: "ACTIVE",
				employeeName: this.state.table_query
			}
		}

		if (!R.isEmpty(this.state.table_query)) {
			Api.create("CFG").getCountShiftHourByStatusAndName(this.state.table_query).then(response => {
				this.setState({
					officeCount: response.data.data
				})
			})
			Api.create("CFG").getAllShiftHourByStatusAndName(name).then(res => {
				console.log('res ', res)
				if (res.status === 200) {
					if (res.data.status === "S") {
						let dataTableOfficeShiftHour = res.data.data.map((value) => {
							const { shiftCode, shiftLeader, shiftType, shiftStartDate, shiftEndDate, shiftStartTime, shiftEndTime, shiftStatus } = value
							let activation = ''
							if (shiftStatus === 'ACTIVE') {
								activation = 'YES'
							}
							else { activation = 'NO' }
							return [
								shiftCode,
								shiftType.bizparValue,
								M(shiftStartDate, 'DD-MM-YYYY HH:mm:ss').format('DD/MM/YYYY') + "-" + M(shiftEndDate, 'DD-MM-YYYY HH:mm:ss').format('DD/MM/YYYY'),
								M(shiftStartTime, 'DD-MM-YYYY HH:mm:ss').format('HH:mm:ss') + "-" + M(shiftEndTime, 'DD-MM-YYYY HH:mm:ss').format('HH:mm:ss'),
								shiftLeader && shiftLeader.employeeName,
								activation

							]
						})
						this.setState({
							data: dataTableOfficeShiftHour,
							rawData: res.data.data
						})
					}
				}
			})
		} else {
			Api.create("CFG").getCountShiftHourByStatus("ACTIVE").then(response => {
				this.setState({
					officeCount: response.data.data
				})
			})
			Api.create("CFG").getOfficeShiftHourByStatus(payload).then(res => {
				console.log('res ', res)
				if (res.status === 200) {
					if (res.data.status === "S") {
						let dataTableOfficeShiftHour = res.data.data.map((value) => {
							const { shiftCode, shiftLeader, shiftType, shiftStartDate, shiftEndDate, shiftStartTime, shiftEndTime, shiftStatus } = value
							let activation = ''
							if (shiftStatus === 'ACTIVE') {
								activation = 'YES'
							}
							else { activation = 'NO' }
							return [
								shiftCode,
								shiftType.bizparValue,
								M(shiftStartDate, 'DD-MM-YYYY HH:mm:ss').format('DD/MM/YYYY') + "-" + M(shiftEndDate, 'DD-MM-YYYY HH:mm:ss').format('DD/MM/YYYY'),
								M(shiftStartTime, 'DD-MM-YYYY HH:mm:ss').format('HH:mm:ss') + "-" + M(shiftEndTime, 'DD-MM-YYYY HH:mm:ss').format('HH:mm:ss'),
								shiftLeader && shiftLeader.employeeName,
								activation

							]
						})
						this.setState({
							data: dataTableOfficeShiftHour,
							rawData: res.data.data
						})
					}
				}
			})
		}
	}

	columns = [
		"Shift Code",
		"Shift Type",
		"Ops.Date",
		"Ops.Time",
		"Leader",
		{
			name: "Activation",
			options: {
				customBodyRender: val => {
					return (
						<div>
							<i
								className="fa fa-lw fa-circle"
								style={{
									color: val === "YES" ? "green" : "brown",
									marginRight: 10,
									padding: "5px"
								}}
							/>
							{val}
						</div>
					);
				}
			}
		},
		{
			name: "Action",
			options: {
				customBodyRender: (val, tableMeta) => {
					return (
						<div>
							<button
								className="btnAct"
								style={{ marginRight: 15 }}
								onClick={this.props.openSlide('slide-menu-4', this.state.rawData[tableMeta.rowIndex])}>
								<i className="fa fa-lw fa-pencil-alt" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }} />
							</button>
							<button
								className="btnAct"
								onClick={() => this.props.onClickDelete(this.state.rawData, tableMeta.rowIndex, 'officeShiftHour', false)} >
								<i className="fa fa-lw fa-trash-alt" style={{ backgroundColor: 'transparent', color: 'red', fontSize: 20 }} />
							</button>
						</div>
					)
				}
			}
		}
	]

	render() {
		let { officeCount, table_query } = this.state
		let tableOptions = {
			...options,
			serverSide: true,
			count: officeCount,
			searchText: table_query,
			onTableChange: (action, tableState) => {
				switch (action) {
					case 'changePage':
						this.setState({ table_page: tableState.page })
						this.getData(tableState.page, tableState.rowsPerPage);
						break;
					case 'changeRowsPerPage':
						this.setState({ table_limit: tableState.rowsPerPage })
						this.getData(tableState.page, tableState.rowsPerPage);
						break;
					case 'search':
						let searchText = tableState.searchText ? tableState.searchText : ""
						this.setState({ table_query: searchText }, () => {
							this.getData(tableState.page, tableState.rowsPerPage)
						})
						break;
					default:
						break;
				}
			}
		}
		return (
			<div>
				<MuiThemeProvider theme={getMuiTheme()}>
					<MUIDataTable
						key={officeCount}
						title={"Office Shift Hour"}
						subtitle={"lorem ipsum dolor"}
						data={this.state.data}
						columns={this.columns}
						options={tableOptions} />
				</MuiThemeProvider>
			</div>
		)
	}

}

export default OfficeOfficeHours