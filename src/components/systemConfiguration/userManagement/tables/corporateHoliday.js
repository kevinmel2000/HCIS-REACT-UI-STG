import React, { Component } from 'react'
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles'
import MUIDataTable from "mui-datatables-bitozen"
import Api from '../../../../Services/Api';
import M from 'moment'
import * as R from 'ramda'

var ct = require("../../../../modules/custom/customTable")

const getMuiTheme = () => createMuiTheme(ct.customTable());

const options = ct.customOptions()

class CorporateHoliday extends Component {
	constructor(props) {
		super(props)
		this.state = {
			data: [],
			rawData: [],
			holidayCount: 0,
			table_limit: 5,
			table_page: 0,
			table_query: "",
		}
		// console.log('datatabel ', this.props.data)
		// console.log('rawdata ', this.props.rawData)
	}
	componentDidMount() {
		this.getHoliday(this.state.table_page, this.state.table_limit)
	}

	componentDidUpdate(prevProps) {
		if (this.props.data !== prevProps.data) this.setState({ data: this.props.data })
	}

	getHoliday(page, limit) {
		let status = {
			"limit": limit,
			"offset": page,
			"params": {
				"holidayStatus": "ACTIVE"
			}
		}
		let name = {
			limit: limit,
			offset: page,
			params: {
				holidayName: this.state.table_query
			}
		}
		if (!R.isEmpty(this.state.table_query)) {
			Api.create("CFG").getCountHolidayByName(this.state.table_query).then(response => {
				this.setState({
					holidayCount: response.data.data
				})
			})
			Api.create("CFG").getHolidayByName(name).then(res => {
				if (res.status === 200) {
					if (res.data.status === "S") {
						let dataHoliday = res.data.data.map((value) => {
							const { holidayDate, holidayStartDate, holidayEndDate, isAllDay, holidayType, holidayName, holidayStatus } = value
							let allDay = ''
							let activation = ''
							if (isAllDay === true) {
								allDay = 'YES'
							} else { allDay = 'NO' }
							if (holidayStatus === 'ACTIVE') {
								activation = 'YES'
							}
							else { activation = 'NO' }
							return [
								holidayDate,
								holidayType !== null ? holidayType.bizparValue : '',
								allDay,
								M(holidayStartDate, 'DD-MM-YYYY HH:mm:ss').format('HH:mm:ss') + "-" + M(holidayEndDate, 'DD-MM-YYYY HH:mm:ss').format('HH:mm:ss'),
								holidayName,
								activation

							]
						})
						this.setState({
							data: dataHoliday,
							rawData: res.data.data
						})
					}
				}
			})
		} else {
			Api.create("CFG").getCountHolidayByStatus("ACTIVE").then(response => {
				this.setState({
					holidayCount: response.data.data
				})
			})
			Api.create("CFG").getCorporateHolidayByStatus(status).then(res => {
				console.log('res ', res)
				if (res.status === 200) {
					if (res.data.status === "S") {
						let dataHoliday = res.data.data.map((value) => {
							const { holidayDate, holidayStartDate, holidayEndDate, isAllDay, holidayType, holidayName, holidayStatus } = value
							let allDay = ''
							let activation = ''
							if (isAllDay === true) {
								allDay = 'YES'
							} else { allDay = 'NO' }
							if (holidayStatus === 'ACTIVE') {
								activation = 'YES'
							}
							else { activation = 'NO' }
							return [
								holidayDate,
								holidayType !== null ? holidayType.bizparValue : '',
								allDay,
								M(holidayStartDate, 'DD-MM-YYYY HH:mm:ss').format('HH:mm:ss') + "-" + M(holidayEndDate, 'DD-MM-YYYY HH:mm:ss').format('HH:mm:ss'),
								holidayName,
								activation

							]
						})
						this.setState({
							data: dataHoliday,
							rawData: res.data.data
						})
					}
				}
			})
		}
	}

	contentList = (length) => {
		var data = []
		for (var i = 0; i < length; ++i) {
			data.push(
				<div
					className="card-item app-pointer border-bottom"
					key={i}
					onClick={this.opSidePage}>
					<div className="c-i-col-1">
						<div className="image image-40px background-green"></div>
					</div>
					<div className="c-i-col-2">
						<div className="txt-site txt-11 txt-bold txt-main margin-bottom-5px">
							Name of Item
						</div>
						<div className="txt-site txt-11 txt-bold txt-thin color-orange">
							Rp. 25.000.000
            			</div>
					</div>
					<div className="c-i-col-3">
						<button className="btn btn-circle btn-grey">
							<i className="fa fa-lg fa-arrow-alt-circle-up color-green" />
						</button>
						<button className="btn btn-circle btn-grey">
							<i className="fa fa-lg fa-arrow-alt-circle-down color-red" />
						</button>
						<button className="btn btn-circle btn-grey">
							<i className="fa fa-lg fa-ellipsis-h" />
						</button>
					</div>
				</div>)
		}
		return data
	}

	opNavigator = (data) => {
		let cl = data.id === this.state.activeTab ? 'c-n-icon active' : 'c-n-icon'
		return (
			<li key={data.id}
				className={cl}
				onClick={this.opContent(data.id)}>
				<div className="col-1 color-green">
					<i className={data.icon} />
				</div>
				<div className="col-2">
					{data.title}
				</div>
			</li>
		);
	};

	opContent = (title) => (e) => {
		e.preventDefault()
		this.setState({
			activeTab: title
		})
	}

	opEditAble = () => {
		if (this.state.editAble === false) {
			this.setState({
				clEditAble: 'edit-able',
				editAble: true,
			})
		} else {
			this.setState({
				clEditAble: '',
				editAble: false,
			})
		}
	}

	opDeleteAble = () => {
		alert('delete');
	}

	columns = [
		"Date",
		"Holiday Type",
		"All Day",
		"Period",
		"Name",
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
								onClick={
									this.props.openSlide('slide-menu-1', this.state.rawData[tableMeta.rowIndex])}
							>
								<i className="fa fa-lw fa-pencil-alt" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }} />
							</button>
							<button
								className="btnAct"
								onClick={() => this.props.onClickDelete(this.state.rawData, tableMeta.rowIndex, 'corporateHoliday', false)}
							>
								<i className="fa fa-lw fa-trash-alt" style={{ backgroundColor: 'transparent', color: 'red', fontSize: 20 }} />
							</button>
						</div>
					)
				}
			}
		}
	]

	render() {
		let { holidayCount, table_query } = this.state
		let tableOptions = {
			...options,
			serverSide: true,
			count: holidayCount,
			searchText: table_query,
			onTableChange: (action, tableState) => {
				switch (action) {
					case 'changePage':
						this.setState({ table_page: tableState.page })
						this.getHoliday(tableState.page, tableState.rowsPerPage);
						break;
					case 'changeRowsPerPage':
						this.setState({ table_limit: tableState.rowsPerPage })
						this.getHoliday(tableState.page, tableState.rowsPerPage);
						break;
					case 'search':
						let searchText = tableState.searchText ? tableState.searchText : ""
						this.setState({ table_query: searchText }, () => {
							this.getHoliday(tableState.page, tableState.rowsPerPage)
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
						key={holidayCount}
						title={"Corporate Holiday"}
						subtitle={"lorem ipsum dolor"}
						data={this.state.data}
						columns={this.columns}
						options={tableOptions} />
				</MuiThemeProvider>
			</div>
		)
	}

}

export default CorporateHoliday