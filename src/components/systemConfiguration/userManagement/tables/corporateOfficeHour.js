import React, { Component } from 'react'
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles'
import MUIDataTable from "mui-datatables-bitozen"
import * as R from 'ramda'
import M from 'moment'
import Api from '../../../../Services/Api'

var ct = require("../../../../modules/custom/customTable")

const getMuiTheme = () => createMuiTheme(ct.customTable());

const options = ct.customOptions()

class CorporateOfficeHours extends Component {
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
				"corporateOfficeHourStatus": "ACTIVE"
			}
		}
		let name = {
			limit: limit,
			offset: page,
			params: {
				corporateOfficeHourName: this.state.table_query
			}
		}
		if (!R.isEmpty(this.state.table_query)) {
			Api.create("CFG").getCountCorpOfficeHourByName(this.state.table_query).then(response => {
				this.setState({
					officeCount: response.data.data
				})
				console.log(response)
			})
			Api.create("CFG").getAllCorpOfficeHourByName(name).then(res => {
				if (res.status === 200) {
					if (res.data.status === "S") {
						console.log(res)
						if (res.data.data !== null) {
							let dataTableCorporateOfficeHour = res.data.data.map((value) => {
								const {
									dayType,
									corporateOfficeHourType,
									calendarType,
									corporateOfficeHourStartDate,
									corporateOfficeHourEndDate,
									corporateOfficeHourName,
									corporateOfficeHourStatus
								} = value
								let activation = ''
								if (corporateOfficeHourStatus === 'ACTIVE') {
									activation = 'YES'
								}
								else { activation = 'NO' }
								return [
									dayType.bizparValue,
									corporateOfficeHourType.bizparValue,
									calendarType.bizparValue,
									M(corporateOfficeHourStartDate, 'DD-MM-YYYY HH:mm:ss').format('HH:mm:ss') + "-" + M(corporateOfficeHourEndDate, 'DD-MM-YYYY HH:mm:ss').format('HH:mm:ss'),
									corporateOfficeHourName,
									activation

								]
							})
							this.setState({
								data: dataTableCorporateOfficeHour,
								rawData: res.data.data
							})
						} else {
							this.setState({
								data: [],
								rawData: []
							})
						}
					}
				}
			})
		} else {
			Api.create("CFG").getCountCorpOfficeHourByStatus("ACTIVE").then(response => {
				this.setState({
					officeCount: response.data.data
				})
			})
			Api.create("CFG").getCorporateOfficeHourByStatus(payload).then(res => {
				console.log('res ', res)
				if (res.status === 200) {
					if (res.data.status === "S") {
						let dataTableCorporateOfficeHour = res.data.data.map((value) => {
							const {
								dayType,
								corporateOfficeHourType,
								calendarType,
								corporateOfficeHourStartDate,
								corporateOfficeHourEndDate,
								corporateOfficeHourName,
								corporateOfficeHourStatus
							} = value
							let activation = ''
							if (corporateOfficeHourStatus === 'ACTIVE') {
								activation = 'YES'
							}
							else { activation = 'NO' }
							return [
								dayType.bizparValue,
								corporateOfficeHourType.bizparValue,
								calendarType.bizparValue,
								M(corporateOfficeHourStartDate, 'DD-MM-YYYY HH:mm:ss').format('HH:mm:ss') + "-" + M(corporateOfficeHourEndDate, 'DD-MM-YYYY HH:mm:ss').format('HH:mm:ss'),
								corporateOfficeHourName,
								activation

							]
						})
						this.setState({
							data: dataTableCorporateOfficeHour,
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
		"Days",
		"Type",
		"CalType",
		"Priode",
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
								onClick={this.props.openSlide('slide-menu-2', this.state.rawData[tableMeta.rowIndex])}>
								<i className="fa fa-lw fa-pencil-alt" style={{ backgroundColor: 'transparent', color: '#004c97', fontSize: 20 }} />
							</button>
							<button
								className="btnAct"
								onClick={() => this.props.onClickDelete(this.state.rawData, tableMeta.rowIndex, 'corporateOfficeHour', false)} >
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
						title={"Corporate Office Hour"}
						subtitle={"lorem ipsum dolor"}
						data={this.state.data}
						columns={this.columns}
						options={tableOptions} />
				</MuiThemeProvider>
			</div>
		)
	}

}

export default CorporateOfficeHours