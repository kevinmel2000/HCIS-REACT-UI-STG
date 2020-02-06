import React, { Component } from 'react'

import Api from '../../Services/Api'
import * as R from 'ramda'
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import AuthAction from '../../Redux/AuthRedux'
import IdleTimer from 'react-idle-timer'
import LoadingBar from "react-top-loading-bar";

import CardNewBarchart from '../../cards/news/Barchart'
import CardNewStatistic from '../../cards/news/Statistic'
import CardNewPiechart from '../../cards/news/Piechart'
import CardPeople from '../../cards/news/People'
import PeopleBirthday from '../../cards/news/PeopleBirthday'
import CardSimpleBarchart from '../../cards/SimpleBarchart'
import CardTinnyBarchart from '../../cards/TinnyBarchart'
// import CardEmployee from '../../cards/news/Employee'
import CardTable from '../../cards/news/Tablechart'
import PeopleTabs from '../../cards/news/PeopleTab';

class dashboardPersonel extends Component {
    constructor() {
        super()
        this.state = {
            dataAvgLeaveBalance: 0,
            dataStaffPerformance: 0,
            dataTotalCost: 0,
            dataTotalEmployee: 0,
            getMonth: new Date().getMonth(),
            dataStatusEmployee: [],
            dataAgeDemographic: [],
            dataOpenPosition: [],
            dataEmployeeScore: [],
            dataAgeLeaveDays: [],
            dataIncome: [],
            dataEksadStrategy: [],
            dataTotalNumber: [],
            dataEksadAvg: [],
            dataDashboard: [],
            timeout: 1000 * 100 * 9,
            isTimedOut: false,
            employeeGenderMale: [],
            employeeGenderFemale: [],
            overtimeHR: [],
            overtimeIT: [],
            empBiztrip: [],
            averageAmount: 0,
            totalEmployee: 0,
            dataLate: [],
            dataAvgBiz: [],
            dataLeaveDiv: [],
            dataGender: [],
            employeeMale: [],
            dataStatus: [],
            dataMovement: [],
            dataTermination: [],
            dataBlacklist: [],
            datab: [],
            newData: [],
            dataAvgAmnt: [],
            dataAge: [],
            show: false
        }
        this.idleTimer = null
    }
    startFetch = () => {
        this.LoadingBar.continousStart();
    };

    onFinishFetch = () => {
        if (typeof this.LoadingBar === "object") this.LoadingBar.complete();
    };
    logout() {
        this.props.authLogout()
        return <Redirect to={{ pathname: "/" }} ></Redirect>
    }

    onAction() {
        this.setState({ isTimedOut: false })
    }

    onActive() {
        this.setState({ isTimedOut: false })
    }

    onIdle() {
        const isTimedOut = this.state.isTimedOut
        if (isTimedOut) {
            alert("Your session has timed out. Please log in again")
            this.logout()
        } else {
            this.idleTimer.reset();
            this.setState({ isTimedOut: true })
        }
    }

    componentDidMount() {
        if (!R.isNil(this.props.auth.user)) {

            this.getBarChart()
            this.getCardNewStatistic()
            this.getLateEmployee()
            this.getAverageBiztripPerDivision()
            this.getLeavePerDivision()
            this.getGenderPerDivision()
            this.getEmployeeStatus()
            this.getEmployeeMovement()
            this.getEmployeeTermination()
            this.getEmployeeBlacklist()
            this.getAvgAmount()
            this.getEmployeeAge()
            this.getNotPresent()
            this.startFetch()
        }
    }

    // data dummy table
    columns = ['No.', 'Month', 'Average']
    data = [['1', 'January', 'RP. 540.000', '2', 'February', 'RP. 540.000']]

    async getBarChart() {
        let responseAge = await Api.create("DASHBOARD").getAgeDemographicPerDepartment()
        if (responseAge.data && responseAge.data.status === "S") {
            this.setState({ dataAgeDemographic: responseAge.data.data })
            
        } else if (R.isNil(responseAge.data)) return alert("Failed: " + responseAge.problem)
        else return alert("Failed: " + responseAge.data.message)

        let responseIncome = await Api.create("DASHBOARD").getIncomeBreakdown()
        if (responseIncome.data && responseIncome.data.status === "S") {
            this.setState({ dataIncome: responseIncome.data.data })
            
        } else if (R.isNil(responseIncome.data)) return alert("Failed: " + responseIncome.problem)
        else return alert("Failed: " + responseIncome.data.message)

        let body = {
            "limit": 100,
            "offset": 0
        }
        let dataBar = await Api.create("DASHBOARD").getTotalEmployeeGenderPerDivision(body)
        let arrayDivFemale = []
        let arrayDivMale = []

        dataBar.data.data.map((item, index) => {
            if (item.employeeGender.bizparValue == 'FEMALE') {
                arrayDivFemale.push({
                    division: item.division,
                    FEMALE: item.totalEmployee,
                    MALE: ''
                })
            } else {
                arrayDivMale.push({
                    division: item.division,
                    FEMALE: '',
                    MALE: item.totalEmployee
                })
            }
        })

        var arrayDivFemaleCopy = arrayDivFemale.slice();

        arrayDivMale.map((item) => {
            if (item.division == 'IT Developer') {
                var index = arrayDivFemale.findIndex(item => item.division == "IT Developer")
                arrayDivFemaleCopy[index] = Object.assign({}, arrayDivFemaleCopy[index]);
                arrayDivFemaleCopy[index].MALE = item.MALE
            } else if (item.division == 'HR') {
                var index = arrayDivFemale.findIndex(item => item.division == "HR")
                arrayDivFemaleCopy[index] = Object.assign({}, arrayDivFemaleCopy[index]);
                arrayDivFemaleCopy[index].MALE = item.MALE
            } else if (item.division == 'Accounting') {
                var index = arrayDivFemale.findIndex(item => item.division == "Accounting")
                arrayDivFemaleCopy[index] = Object.assign({}, arrayDivFemaleCopy[index]);
                arrayDivFemaleCopy[index].MALE = item.MALE
            } else if (item.division == 'Infra') {
                var index = arrayDivFemale.findIndex(item => item.division == "Infra")
                arrayDivFemaleCopy[index] = Object.assign({}, arrayDivFemaleCopy[index]);
                arrayDivFemaleCopy[index].MALE = item.MALE
            } else if (item.division == 'Implementation') {
                var index = arrayDivFemale.findIndex(item => item.division == "Implementation")
                arrayDivFemaleCopy[index] = Object.assign({}, arrayDivFemaleCopy[index]);
                arrayDivFemaleCopy[index].MALE = item.MALE
            } else {
                var index = arrayDivFemale.findIndex(item => item.division == "Finance")
                arrayDivFemaleCopy[index] = Object.assign({}, arrayDivFemaleCopy[index]);
                arrayDivFemaleCopy[index].MALE = item.MALE
            }
        })

        setTimeout(() => {
            this.setState({ dataAgeDemographic: arrayDivFemaleCopy })
        }, 300)


        let bodys = {
            "limit": 100,
            "offset": 0
        }
        let dataBars = await Api.create("DASHBOARD").getEmployeeTerminationPerDivision(bodys)
        let arrayVoluntery = []
        let arrayNonVoluntery = []

        dataBars.data.data.map((item, index) => {
            if (item.terminationType.bizparValue == 'NON-VOLUNTERY RESIGN') {
                arrayNonVoluntery.push({
                    division: item.division,
                    NONVOLUNTERY: item.totalEmployee,
                    VOLUNTERY: ''
                })
            } else {
                arrayVoluntery.push({
                    division: item.division,
                    NONVOLUNTERY: '',
                    VOLUNTERY: item.totalEmployee
                })
            }
        })

        var arrayNonVolunteryCopy = arrayNonVoluntery.slice();

        arrayVoluntery.map((item) => {
            if (item.division == 'IT Developer') {
                var index = arrayNonVoluntery.findIndex(item => item.division == "IT Developer")
                arrayNonVolunteryCopy[index] = Object.assign({}, arrayNonVolunteryCopy[index]);
                arrayNonVolunteryCopy[index].VOLUNTERY = item.VOLUNTERY
            } else if (item.division == 'HR') {
                var index = arrayNonVoluntery.findIndex(item => item.division == "HR")
                arrayNonVolunteryCopy[index] = Object.assign({}, arrayNonVolunteryCopy[index]);
                arrayNonVolunteryCopy[index].VOLUNTERY = item.VOLUNTERY
            } else if (item.division == 'Accounting') {
                var index = arrayNonVoluntery.findIndex(item => item.division == "Accounting")
                arrayNonVolunteryCopy[index] = Object.assign({}, arrayNonVolunteryCopy[index]);
                arrayNonVolunteryCopy[index].VOLUNTERY = item.VOLUNTERY
            } else if (item.division == 'Infra') {
                var index = arrayNonVoluntery.findIndex(item => item.division == "Infra")
                arrayNonVolunteryCopy[index] = Object.assign({}, arrayNonVolunteryCopy[index]);
                arrayNonVolunteryCopy[index].VOLUNTERY = item.VOLUNTERY
            } else if (item.division == 'Implementation') {
                var index = arrayNonVoluntery.findIndex(item => item.division == "Implementation")
                arrayNonVolunteryCopy[index] = Object.assign({}, arrayNonVolunteryCopy[index]);
                arrayNonVolunteryCopy[index].VOLUNTERY = item.VOLUNTERY
            } else {
                var index = arrayNonVoluntery.findIndex(item => item.division == "Finance")
                arrayNonVolunteryCopy[index] = Object.assign({}, arrayNonVolunteryCopy[index]);
                arrayNonVolunteryCopy[index].VOLUNTERY = item.VOLUNTERY
            }
        })

        setTimeout(() => {
            this.setState({ arrayNonVolunteryCopy })
        }, 300)


        let bodyBlacklist = {
            "limit": 100,
            "offset": 0
        }
        let dataBl = await Api.create("DASHBOARD").getBlacklistPerDivision(bodyBlacklist)
        let arraySP1 = []
        let arraySP2 = []
        let arraySP3 = []

        dataBl.data.data.map((item, index) => {
            if (item.blacklistType.bizparValue == 'SP 1') {
                arraySP1.push({
                    division: item.division,
                    bizValue: item.blacklistType.bizparValue,
                    SP1: item.totalEmployee,
                    SP2: '',
                    SP3: ''
                })
            } else if (item.blacklistType.bizparValue == 'SP 2') {
                arraySP2.push({
                    division: item.division,
                    bizValue: item.blacklistType.bizparValue,
                    SP1: '',
                    SP2: item.totalEmployee,
                    SP3: ''
                })
            } else {
                arraySP3.push({
                    division: item.division,
                    bizValue: item.blacklistType.bizparValue,
                    SP1: '',
                    SP2: '',
                    SP3: item.totalEmployee
                })
            }
        })

        var arraySP1Copy = arraySP1.slice();

        arraySP2.map((item) => {
            if (item.division == 'IT Developer') {
                var index = arraySP1.findIndex(item => item.division == "IT Developer")
                arraySP1Copy[index] = Object.assign({}, arraySP1Copy[index]);
                arraySP1Copy[index].SP2 = item.SP2
            } else if (item.division == 'HR') {
                var index = arraySP1.findIndex(item => item.division == "HR")
                arraySP1Copy[index] = Object.assign({}, arraySP1Copy[index]);
                arraySP1Copy[index].SP2 = item.SP2
            } else if (item.division == 'Accounting') {
                var index = arraySP1.findIndex(item => item.division == "Accounting")
                arraySP1Copy[index] = Object.assign({}, arraySP1Copy[index]);
                arraySP1Copy[index].SP2 = item.SP2
            } else if (item.division == 'Infra') {
                var index = arraySP1.findIndex(item => item.division == "Infra")
                arraySP1Copy[index] = Object.assign({}, arraySP1Copy[index]);
                arraySP1Copy[index].SP2 = item.SP2
            } else if (item.division == 'Implementation') {
                var index = arraySP1.findIndex(item => item.division == "Implementation")
                arraySP1Copy[index] = Object.assign({}, arraySP1Copy[index]);
                arraySP1Copy[index].SP2 = item.SP2
            } else {
                var index = arraySP1.findIndex(item => item.division == "Finance")
                arraySP1Copy[index] = Object.assign({}, arraySP1Copy[index]);
                arraySP1Copy[index].SP2 = item.SP2
            }
        })

        setTimeout(() => {
            this.setState({ dataBlacklistSP: arraySP1Copy }, () => {
                arraySP3.map((item) => {
                    if (item.division == 'IT Developer') {
                        var index = arraySP1.findIndex(item => item.division == "IT Developer")
                        arraySP1Copy[index] = Object.assign({}, arraySP1Copy[index]);
                        arraySP1Copy[index].SP3 = item.SP3
                    } else if (item.division == 'HR') {
                        var index = arraySP1.findIndex(item => item.division == "HR")
                        arraySP1Copy[index] = Object.assign({}, arraySP1Copy[index]);
                        arraySP1Copy[index].SP3 = item.SP3
                    } else if (item.division == 'Accounting') {
                        var index = arraySP1.findIndex(item => item.division == "Accounting")
                        arraySP1Copy[index] = Object.assign({}, arraySP1Copy[index]);
                        arraySP1Copy[index].SP3 = item.SP3
                    } else if (item.division == 'Infra') {
                        var index = arraySP1.findIndex(item => item.division == "Infra")
                        arraySP1Copy[index] = Object.assign({}, arraySP1Copy[index]);
                        arraySP1Copy[index].SP3 = item.SP3
                    } else if (item.division == 'Implementation') {
                        var index = arraySP1.findIndex(item => item.division == "Implementation")
                        arraySP1Copy[index] = Object.assign({}, arraySP1Copy[index]);
                        arraySP1Copy[index].SP3 = item.SP3
                    } else {
                        var index = arraySP1.findIndex(item => item.division == "Finance")
                        arraySP1Copy[index] = Object.assign({}, arraySP1Copy[index]);
                        arraySP1Copy[index].SP3 = item.SP3
                    }
                })
                setTimeout(() => {
                    this.setState({ dataBlacklistSP: arraySP1Copy })
                    
                }, 300)
            })
        }, 300)

        let bodyAge = {
            "limit": 100,
            "offset": 0
        }
        let dataAge = await Api.create("DASHBOARD").getEmployeeByAge(bodyAge)
        let tahunSatu = []
        let tahunDua = []
        let tahunTiga = []
        let tahunEmpat = []
        let tahunLima = []

        dataAge.data.data.map((item, index) => {
            if (item.age == '< 20 tahun') {
                tahunSatu.push({
                    division: item.division,
                    tahun20: item.totalEmployee,
                    tahun30: '',
                    tahun40: '',
                    tahun50: '',
                    tahun60: ''
                })
            } else if (item.age == '21-30 tahun') {
                tahunDua.push({
                    division: item.division,
                    tahun20: '',
                    tahun30: item.totalEmployee,
                    tahun40: '',
                    tahun50: '',
                    tahun60: ''
                })
            } else if (item.age == '31-40 tahun') {
                tahunTiga.push({
                    division: item.division,
                    tahun20: '',
                    tahun30: '',
                    tahun40: item.totalEmployee,
                    tahun50: '',
                    tahun60: ''
                })
            } else if (item.age == '41-50 tahun') {
                tahunEmpat.push({
                    division: item.division,
                    tahun20: '',
                    tahun30: '',
                    tahun40: '',
                    tahun50: item.totalEmployee,
                    tahun60: ''
                })
            }
            else {
                tahunLima.push({
                    division: item.division,
                    tahun20: '',
                    tahun30: '',
                    tahun40: '',
                    tahun50: '',
                    tahun60: item.totalEmployee
                })
            }
        })

        var tahunSatuCopy = tahunSatu.slice();

        tahunDua.map((item) => {
            if (item.division == 'IT Developer') {
                var index = tahunDua.findIndex(item => item.division == "IT Developer")
                tahunSatuCopy[index] = Object.assign({}, tahunSatuCopy[index]);
                tahunSatuCopy[index].tahun30 = item.tahun30
            } else if (item.division == 'HR') {
                var index = tahunDua.findIndex(item => item.division == "HR")
                tahunSatuCopy[index] = Object.assign({}, tahunSatuCopy[index]);
                tahunSatuCopy[index].tahun30 = item.tahun30
            } else if (item.division == 'Accounting') {
                var index = tahunDua.findIndex(item => item.division == "Accounting")
                tahunSatuCopy[index] = Object.assign({}, tahunSatuCopy[index]);
                tahunSatuCopy[index].tahun30 = item.tahun30
            } else if (item.division == 'Infra') {
                var index = tahunDua.findIndex(item => item.division == "Infra")
                tahunSatuCopy[index] = Object.assign({}, tahunSatuCopy[index]);
                tahunSatuCopy[index].tahun30 = item.tahun30
            } else if (item.division == 'Implementation') {
                var index = tahunDua.findIndex(item => item.division == "Implementation")
                tahunSatuCopy[index] = Object.assign({}, tahunSatuCopy[index]);
                tahunSatuCopy[index].tahun30 = item.tahun30
            } else {
                var index = tahunDua.findIndex(item => item.division == "Finance")
                tahunSatuCopy[index] = Object.assign({}, tahunSatuCopy[index]);
                tahunSatuCopy[index].tahun30 = item.tahun30
            }
        })

        setTimeout(() => {
            this.setState({ dataAgeEmp: tahunSatuCopy }, () => {
                tahunTiga.map((item) => {
                    if (item.division == 'IT Developer') {
                        var index = tahunDua.findIndex(item => item.division == "IT Developer")
                        tahunSatuCopy[index] = Object.assign({}, tahunSatuCopy[index]);
                        tahunSatuCopy[index].tahun40 = item.tahun40
                    } else if (item.division == 'HR') {
                        var index = tahunDua.findIndex(item => item.division == "HR")
                        tahunSatuCopy[index] = Object.assign({}, tahunSatuCopy[index]);
                        tahunSatuCopy[index].tahun40 = item.tahun40
                    } else if (item.division == 'Accounting') {
                        var index = tahunDua.findIndex(item => item.division == "Accounting")
                        tahunSatuCopy[index] = Object.assign({}, tahunSatuCopy[index]);
                        tahunSatuCopy[index].tahun40 = item.tahun40
                    } else if (item.division == 'Infra') {
                        var index = tahunDua.findIndex(item => item.division == "Infra")
                        tahunSatuCopy[index] = Object.assign({}, tahunSatuCopy[index]);
                        tahunSatuCopy[index].tahun40 = item.tahun40
                    } else if (item.division == 'Implementation') {
                        var index = tahunDua.findIndex(item => item.division == "Implementation")
                        tahunSatuCopy[index] = Object.assign({}, tahunSatuCopy[index]);
                        tahunSatuCopy[index].tahun40 = item.tahun40
                    } else {
                        var index = tahunDua.findIndex(item => item.division == "Finance")
                        tahunSatuCopy[index] = Object.assign({}, tahunSatuCopy[index]);
                        tahunSatuCopy[index].tahun40 = item.tahun40
                    }
                })
                setTimeout(() => {
                    this.setState({ dataAgeEmp: tahunSatuCopy }, () => {
                        tahunEmpat.map((item) => {
                            if (item.division == 'IT Developer') {
                                var index = tahunDua.findIndex(item => item.division == "IT Developer")
                                tahunSatuCopy[index] = Object.assign({}, tahunSatuCopy[index]);
                                tahunSatuCopy[index].tahun50 = item.tahun50
                            } else if (item.division == 'HR') {
                                var index = tahunDua.findIndex(item => item.division == "HR")
                                tahunSatuCopy[index] = Object.assign({}, tahunSatuCopy[index]);
                                tahunSatuCopy[index].tahun50 = item.tahun50
                            } else if (item.division == 'Accounting') {
                                var index = tahunDua.findIndex(item => item.division == "Accounting")
                                tahunSatuCopy[index] = Object.assign({}, tahunSatuCopy[index]);
                                tahunSatuCopy[index].tahun50 = item.tahun50
                            } else if (item.division == 'Infra') {
                                var index = tahunDua.findIndex(item => item.division == "Infra")
                                tahunSatuCopy[index] = Object.assign({}, tahunSatuCopy[index]);
                                tahunSatuCopy[index].tahun50 = item.tahun50
                            } else if (item.division == 'Implementation') {
                                var index = tahunDua.findIndex(item => item.division == "Implementation")
                                tahunSatuCopy[index] = Object.assign({}, tahunSatuCopy[index]);
                                tahunSatuCopy[index].tahun50 = item.tahun50
                            } else {
                                var index = tahunDua.findIndex(item => item.division == "Finance")
                                tahunSatuCopy[index] = Object.assign({}, tahunSatuCopy[index]);
                                tahunSatuCopy[index].tahun50 = item.tahun50
                            }
                        })
                        setTimeout(() => {
                            this.setState({ dataAgeEmp: tahunSatuCopy }, () => {
                                tahunLima.map((item) => {
                                    if (item.division == 'IT Developer') {
                                        var index = tahunDua.findIndex(item => item.division == "IT Developer")
                                        tahunSatuCopy[index] = Object.assign({}, tahunSatuCopy[index]);
                                        tahunSatuCopy[index].tahun60 = item.tahun60
                                    } else if (item.division == 'HR') {
                                        var index = tahunDua.findIndex(item => item.division == "HR")
                                        tahunSatuCopy[index] = Object.assign({}, tahunSatuCopy[index]);
                                        tahunSatuCopy[index].tahun60 = item.tahun60
                                    } else if (item.division == 'Accounting') {
                                        var index = tahunDua.findIndex(item => item.division == "Accounting")
                                        tahunSatuCopy[index] = Object.assign({}, tahunSatuCopy[index]);
                                        tahunSatuCopy[index].tahun60 = item.tahun60
                                    } else if (item.division == 'Infra') {
                                        var index = tahunDua.findIndex(item => item.division == "Infra")
                                        tahunSatuCopy[index] = Object.assign({}, tahunSatuCopy[index]);
                                        tahunSatuCopy[index].tahun60 = item.tahun60
                                    } else if (item.division == 'Implementation') {
                                        var index = tahunDua.findIndex(item => item.division == "Implementation")
                                        tahunSatuCopy[index] = Object.assign({}, tahunSatuCopy[index]);
                                        tahunSatuCopy[index].tahun60 = item.tahun60
                                    } else {
                                        var index = tahunDua.findIndex(item => item.division == "Finance")
                                        tahunSatuCopy[index] = Object.assign({}, tahunSatuCopy[index]);
                                        tahunSatuCopy[index].tahun60 = item.tahun60
                                    }
                                })
                                setTimeout(() => {
                                    this.setState({ dataAgeEmp: tahunSatuCopy, show: true })
                                    this.onFinishFetch()
                                }, 300)
                            })
                        }, 300)
                    })
                }, 300)
            })
        }, 300)

        let bodyMovType = {
            "limit": 100,
            "offset": 0
        }
        let dataMv = await Api.create("DASHBOARD").getEmployeeMovementPerDivision(bodyMovType)
        let promosi = []
        let demosi = []
        let penggantian = []
        let penambahan = []

        dataMv.data.data.map((item, index) => {
            if (item.movementType.bizparValue == 'PROMOSI') {
                promosi.push({
                    division: item.division,
                    PROMOSI: item.totalEmployee,
                    DEMOSI: '',
                    PENGGANTIAN: '',
                    PENAMBAHAN: ''
                })
            } else if (item.movementType.bizparValue == 'DEMOSI') {
                demosi.push({
                    division: item.division,
                    PROMOSI: '',
                    DEMOSI: item.totalEmployee,
                    PENGGANTIAN: '',
                    PENAMBAHAN: ''
                })
            } else if (item.movementType.bizparValue == 'PENGGANTIAN') {
                penggantian.push({
                    division: item.division,
                    PROMOSI: '',
                    DEMOSI: '',
                    PENGGANTIAN: item.totalEmployee,
                    PENAMBAHAN: ''
                })
            }
            else {
                penambahan.push({
                    division: item.division,
                    PROMOSI: '',
                    DEMOSI: '',
                    PENGGANTIAN: '',
                    PENAMBAHAN: item.totalEmployee
                })
            }
        })

        var promosiCopy = promosi.slice();

        demosi.map((item) => {
            if (item.division == 'IT Developer') {
                var index = promosi.findIndex(item => item.division == "IT Developer")
                promosiCopy[index] = Object.assign({}, promosiCopy[index]);
                promosiCopy[index].DEMOSI = item.DEMOSI
            } else if (item.division == 'HR') {
                var index = promosi.findIndex(item => item.division == "HR")
                promosiCopy[index] = Object.assign({}, promosiCopy[index]);
                promosiCopy[index].DEMOSI = item.DEMOSI
            } else if (item.division == 'Accounting') {
                var index = promosi.findIndex(item => item.division == "Accounting")
                promosiCopy[index] = Object.assign({}, promosiCopy[index]);
                promosiCopy[index].DEMOSI = item.DEMOSI
            } else if (item.division == 'Infra') {
                var index = promosi.findIndex(item => item.division == "Infra")
                promosiCopy[index] = Object.assign({}, promosiCopy[index]);
                promosiCopy[index].DEMOSI = item.DEMOSI
            } else if (item.division == 'Implementation') {
                var index = promosi.findIndex(item => item.division == "Implementation")
                promosiCopy[index] = Object.assign({}, promosiCopy[index]);
                promosiCopy[index].DEMOSI = item.DEMOSI
            } else {
                var index = promosi.findIndex(item => item.division == "Finance")
                promosiCopy[index] = Object.assign({}, promosiCopy[index]);
                promosiCopy[index].DEMOSI = item.DEMOSI
            }
        })

        setTimeout(() => {
            this.setState({ dataMovType: promosiCopy }, () => {
                penggantian.map((item) => {
                    if (item.division == 'IT Developer') {
                        var index = promosi.findIndex(item => item.division == "IT Developer")
                        promosiCopy[index] = Object.assign({}, promosiCopy[index]);
                        promosiCopy[index].PENGGANTIAN = item.PENGGANTIAN
                    } else if (item.division == 'HR') {
                        var index = promosi.findIndex(item => item.division == "HR")
                        promosiCopy[index] = Object.assign({}, promosiCopy[index]);
                        promosiCopy[index].PENGGANTIAN = item.PENGGANTIAN
                    } else if (item.division == 'Accounting') {
                        var index = promosi.findIndex(item => item.division == "Accounting")
                        promosiCopy[index] = Object.assign({}, promosiCopy[index]);
                        promosiCopy[index].PENGGANTIAN = item.PENGGANTIAN
                    } else if (item.division == 'Infra') {
                        var index = promosi.findIndex(item => item.division == "Infra")
                        promosiCopy[index] = Object.assign({}, promosiCopy[index]);
                        promosiCopy[index].PENGGANTIAN = item.PENGGANTIAN
                    } else if (item.division == 'Implementation') {
                        var index = promosi.findIndex(item => item.division == "Implementation")
                        promosiCopy[index] = Object.assign({}, promosiCopy[index]);
                        promosiCopy[index].PENGGANTIAN = item.PENGGANTIAN
                    } else {
                        var index = promosi.findIndex(item => item.division == "Finance")
                        promosiCopy[index] = Object.assign({}, promosiCopy[index]);
                        promosiCopy[index].PENGGANTIAN = item.PENGGANTIAN
                    }
                })
                setTimeout(() => {
                    this.setState({ dataMovType: promosiCopy }, () => {
                        penambahan.map((item) => {
                            if (item.division == 'IT Developer') {
                                var index = promosi.findIndex(item => item.division == "IT Developer")
                                promosiCopy[index] = Object.assign({}, promosiCopy[index]);
                                promosiCopy[index].PENAMBAHAN = item.PENAMBAHAN
                            } else if (item.division == 'HR') {
                                var index = promosi.findIndex(item => item.division == "HR")
                                promosiCopy[index] = Object.assign({}, promosiCopy[index]);
                                promosiCopy[index].PENAMBAHAN = item.PENAMBAHAN
                            } else if (item.division == 'Accounting') {
                                var index = promosi.findIndex(item => item.division == "Accounting")
                                promosiCopy[index] = Object.assign({}, promosiCopy[index]);
                                promosiCopy[index].PENAMBAHAN = item.PENAMBAHAN
                            } else if (item.division == 'Infra') {
                                var index = promosi.findIndex(item => item.division == "Infra")
                                promosiCopy[index] = Object.assign({}, promosiCopy[index]);
                                promosiCopy[index].PENAMBAHAN = item.PENAMBAHAN
                            } else if (item.division == 'Implementation') {
                                var index = promosi.findIndex(item => item.division == "Implementation")
                                promosiCopy[index] = Object.assign({}, promosiCopy[index]);
                                promosiCopy[index].PENAMBAHAN = item.PENAMBAHAN
                            } else {
                                var index = promosi.findIndex(item => item.division == "Finance")
                                promosiCopy[index] = Object.assign({}, promosiCopy[index]);
                                promosiCopy[index].PENAMBAHAN = item.PENAMBAHAN
                            }
                        })
                        setTimeout(() => {
                            this.setState({ dataMovType: promosiCopy })
                            
                        }, 300)
                    })
                }, 300)
            })
        }, 300)
    }

    async getCardNewStatistic() {
        let body = {
            "limit": 100,
            "offset": 0
        }
        let employeeGenderMale = []
        let employeeGenderFemale = []
        let overtimeHR = []
        let overtimeIT = []
        let empBiztrip = []
        let averageAmount = 0
        let totalEmployee = 0

        let responseDashboard = await Api.create("DASHBOARD").getTotalEmployeeGender(body)
        if (responseDashboard.data && responseDashboard.data.status === "S") {
            responseDashboard.data.data.map((item, index) => {
                if (item.employeeGender.bizparValue === "MALE") {
                    employeeGenderMale.push(item)
                } else {
                    employeeGenderFemale.push(item)
                }
            })
            this.setState({ employeeGenderFemale, employeeGenderMale })
        } else if (R.isNil(responseDashboard.data)) return alert("Failed: " + responseDashboard.problem)
        else return alert("Failed: " + responseDashboard.data.message)

        let response = await Api.create("DASHBOARD").getEmployeeOvertimePerDivision(body)
        if (response.data && response.data.status === "S") {
            response.data.data.map((item, index) => {
                if (item.division === "HR") {
                    overtimeHR.push(item)
                } else {
                    overtimeIT.push(item)
                }
            })
            this.setState({ overtimeHR, overtimeIT })
            
        } else if (R.isNil(response.data)) return alert("Failed: " + response.problem)
        else return alert("Failed: " + response.data.message)

        let responseBiztrip = await Api.create("DASHBOARD").getEmployeeBusinessTrip(body)
        if (responseBiztrip.data && responseBiztrip.data.status === "S") {
            responseBiztrip.data.data.map((item, index) => {
                empBiztrip.push(item)
            })
            this.setState({ empBiztrip })
            
        } else if (R.isNil(responseBiztrip.data)) return alert("Failed: " + responseBiztrip.problem)
        else return alert("Failed: " + responseBiztrip.data.message)

        let responseAverageBiztrip = await Api.create("DASHBOARD").getAverageBiztripPerEmployee(body)
        if (responseAverageBiztrip.data && responseAverageBiztrip.data.status === "S") {
            responseAverageBiztrip.data.data.map((item, index) => {
                averageAmount = averageAmount + item.averageAmount
            })
            this.setState({ averageAmount })
            
        } else if (R.isNil(responseAverageBiztrip.data)) return alert("Failed: " + responseAverageBiztrip.problem)
        else return alert("Failed: " + responseAverageBiztrip.data.message)

        let responseEmp = await Api.create("DASHBOARD").getTotalEmployeeDashboard(body)
        if (responseEmp.data && responseEmp.data.status === "S") {
            responseEmp.data.data.map((item, index) => {
                if (item.month === this.state.getMonth + 1) {
                    totalEmployee = totalEmployee + item.totalEmployee
                }
            })
            this.setState({ totalEmployee })
            
        } else if (R.isNil(responseEmp.data)) return alert("Failed: " + responseEmp.problem)
        else return alert("Failed: " + responseEmp.data.message)
    }

    async getLateEmployee() {
        let body = {
            "limit": 100,
            "offset": 0
        }
        let response = await Api.create("DASHBOARD").getLateEmployee(body)
        if (response.data && response.data.status === "S") {
            this.setState({ dataLate: response.data.data })
            
        } else if (R.isNil(response.data)) return alert("Failed: " + response.problem)
        else return alert("Failed: " + response.data.message)
    }

    async getAverageBiztripPerDivision() {
        let body = {
            "limit": 100,
            "offset": 0
        }
        let response = await Api.create("DASHBOARD").getAverageBiztripPerDivision(body)
        console.log(response.data)
        if (response.data.status === "S") {
            let dataAvgBiz = response.data.data.map((body, index) => {
                const {
                    division,
                    averageAmount
                } = body;
                return [
                    (index += 1),
                    division,
                    averageAmount
                ];
            });
            this.setState({ dataAvgBiz })
            
        } else if (R.isNil(response.data)) return alert("Failed: " + response.problem)
        else return alert("Failed: " + response.data.message)
    }

    async getLeavePerDivision() {
        let body = {
            "limit": 100,
            "offset": 0
        }
        let response = await Api.create("DASHBOARD").getLeavePerDivision(body)
        if (response.data && response.data.status === "S") {
            this.setState({ dataLeaveDiv: response.data.data })
            
        } else if (R.isNil(response.data)) return alert("Failed: " + response.problem)
        else return alert("Failed: " + response.data.message)
    }

    async getGenderPerDivision() {
        let body = {
            "limit": 100,
            "offset": 0
        }
        let employeeMale = []
        let response = await Api.create("DASHBOARD").getGenderPerDivision(body)
        if (response.data && response.data.status === "S") {
            response.data.data.map((item, value) => {
                if (item.division === "IT Developer" && item.employeeGender.bizparValue === "MALE") {
                    employeeMale.push(value.division, value.totalEmployee)
                }
            })
            this.setState({ employeeMale })
            
            console.log(JSON.stringify(employeeMale))
        } else if (R.isNil(response.data)) return alert("Failed: " + response.problem)
        else return alert("Failed: " + response.data.message)
    }

    async getEmployeeStatus() {
        let body = {
            "limit": 100,
            "offset": 0
        }
        let datab = []
        let totalEmpSt = 0
        let response = await Api.create("DASHBOARD").getEmployeeStatus(body)
        if (response.data.status === "S") {
            this.setState({ dataStatus: response.data.data }, () => {

                var dataStatusCopy = this.state.dataStatus.slice();
                this.state.dataStatus.map((item, index) => {
                    dataStatusCopy[index] = Object.assign({}, dataStatusCopy[index]);
                    dataStatusCopy[index].totalEmployee = Number(dataStatusCopy[index].totalEmployee)
                })
                setTimeout(() => {
                    this.setState({ dataStatus: dataStatusCopy })
                    this.state.dataStatus.map((item) => {
                        totalEmpSt = totalEmpSt + item.totalEmployee
                        datab.push({
                            ...item,
                            bizValue: item.employeeType.bizparValue
                        })
                    })
                    setTimeout(() => {
                        this.setState({ dataStatus: datab, totalEmpSt })
                    }, 100)

                }, 100)
            })
            
        } else if (R.isNil(response.data)) return alert("Failed: " + response.problem)
        else return alert("Failed: " + response.data.message)
    }


    async getEmployeeMovement() {
        let body = {
            "limit": 100,
            "offset": 0
        }
        let response = await Api.create("DASHBOARD").getEmployeeMovement(body)
        let datab = []
        let totalEmp = 0
        if (response.data.status === "S") {
            response.data.data.map((item) => {
                totalEmp = totalEmp + item.totalEmployee
                datab.push({
                    ...item,
                    bizValue: item.movementType.bizparValue
                })
            })
            this.setState({ dataMovement: datab, totalEmp }, () => console.log(this.state.totalEmp))
            
        } else if (R.isNil(response.data)) return alert("Failed: " + response.problem)
        else return alert("Failed: " + response.data.message)
    }

    async getEmployeeTermination() {
        let body = {
            "limit": 100,
            "offset": 0
        }
        let response = await Api.create("DASHBOARD").getEmployeeTermination(body)
        let datab = []
        let totalEmpTr = 0
        if (response.data && response.data.status === "S") {
            response.data.data.map((item) => {
                totalEmpTr = totalEmpTr + item.totalEmployee
                datab.push({
                    ...item,
                    bizValue: item.terminationType.bizparValue
                })
            })
            this.setState({ dataTermination: datab, totalEmpTr })
            
        } else if (R.isNil(response.data)) return alert("Failed: " + response.problem)
        else return alert("Failed: " + response.data.message)
    }

    async getEmployeeBlacklist() {
        let body = {
            "limit": 100,
            "offset": 0
        }
        let response = await Api.create("DASHBOARD").getEmployeeBlacklist(body)
        let datab = []
        let totalEmpBl = 0
        if (response.data && response.data.status === "S") {
            response.data.data.map((item) => {
                totalEmpBl = totalEmpBl + item.totalEmployee
                datab.push({
                    ...item,
                    bizValue: item.blacklistType.bizparValue
                })
            })
            this.setState({ dataBlacklist: datab, totalEmpBl })
            
        } else if (R.isNil(response.data)) return alert("Failed: " + response.problem)
        else return alert("Failed: " + response.data.message)
    }

    async getEmployeeAge() {
        let body = {
            "limit": 100,
            "offset": 0
        }
        let response = await Api.create("DASHBOARD").getEmployeeByAge(body)
        if (response.data && response.data.status === "S") {
            this.setState({ dataAge: response.data.data })
            
        } else if (R.isNil(response.data)) return alert("Failed: " + response.problem)
        else return alert("Failed: " + response.data.message)
    }

    async getAvgAmount() {
        let body = {
            "limit": 100,
            "offset": 0
        }
        let response = await Api.create("DASHBOARD").getAvgAmount(body)
        console.log(response.data)
        if (response.data.status === "S") {
            let dataAvgAmnt = response.data.data.map((body, index) => {
                const {
                    division,
                    averageAmount
                } = body;
                return [
                    (index += 1),
                    division,
                    averageAmount
                ];
            });
            this.setState({ dataAvgAmnt })
            
        } else if (R.isNil(response.data)) return alert("Failed: " + response.problem)
        else return alert("Failed: " + response.data.message)
    }

    async getNotPresent() {
        let body = {
            "limit": 100,
            "offset": 0
        }
        let datab = []
        let newData = []
        let response = await Api.create("DASHBOARD").getEmployeeNotPresent(body)
        if (response.data && response.data.status === "S") {
            response.data.data.map((item) => {
                datab.push(item.employees)
            })
            this.setState({ datab: datab[0] }, () => {
                this.state.datab.map((value, index) => {
                    newData.push({
                        ...value,
                        employeeName: value.employeeName,
                        employeePhotoURL: value.employeePhotoURL,
                        positionName: value.positionName
                    })
                })
                this.setState({ dataNot: newData })
            })
            
        } else if (R.isNil(response.data)) return alert("Failed: " + response.problem)
        else return alert("Failed: " + response.data.message)
    }


    render() {
        if (R.isNil(this.props.auth.user)) return <Redirect to={{ pathname: "/" }} ></Redirect>
        let {
            dataLeaveDiv, dataAgeDemographic, dataIncome, dataStatus, dataMovement, dataTermination, dataBlacklist, dataAvgAmnt, totalEmp } = this.state
        return (
            <div className="main-content" style={{ backgroundColor: '#ffffff' }}>
                <LoadingBar onRef={ref => (this.LoadingBar = ref)} />
                {this.state.show && (
                    <div>
                        <IdleTimer
                            ref={ref => { this.idleTimer = ref }}
                            element={document}
                            onActive={this.onActive.bind(this)}
                            onIdle={this.onIdle.bind(this)}
                            onAction={this.onAction.bind(this)}
                            debounce={250}
                            timeout={this.state.timeout} />
                        <div className="display-flex-normal">
                            <CardSimpleBarchart
                                data={this.state.dataAgeEmp}
                                dataKey={[
                                    { key: 'tahun20', color: '#f54242', bizValue: '< 20 tahun' },
                                    { key: 'tahun30', color: '#036ffc', bizValue: '21-30 tahun' },
                                    { key: 'tahun40', color: '#f5a442', bizValue: '31-40 tahun' },
                                    { key: 'tahun50', color: '#47d61c', bizValue: '41-50 tahun' },
                                    { key: 'tahun60', color: '#a832a2', bizValue: '51-60 tahun' }
                                ]}
                                title="Total Employee by Age per Division"
                                subtitle="PT TIGA DAYA DIGITAL INDONESIA" />
                            <div style={{ position: 'relative', width: 'calc(100% - 570px)' }}>
                                <div className="padding-top-5px"></div>
                                <CardNewStatistic
                                    title="Total Employee by Gender"
                                    subtitle="PT TIGA DAYA DIGITAL INDONESIA"
                                    data={[
                                        { value: this.state.employeeGenderMale.length, label: "Male" },
                                        { value: this.state.employeeGenderFemale.length, label: "Female" }
                                    ]}
                                />
                                <PeopleBirthday
                                    colorStatus="#0088FE"
                                    title="Employee on Birthday"
                                    subtitle="PT. Bozz Online Solusindo" />

                                <CardNewStatistic
                                    title="Total Employee on Overtime per Division"
                                    subtitle="PT TIGA DAYA DIGITAL INDONESIA"
                                    data={[
                                        { value: this.state.overtimeIT.length, label: "IT Developer" },
                                        { value: this.state.overtimeHR.length, label: "HR" }
                                    ]}
                                />
                                <CardNewStatistic
                                    title="Total Employee on a Business Trip"
                                    subtitle="PT TIGA DAYA DIGITAL INDONESIA"
                                    data={[
                                        { value: this.state.empBiztrip.length, label: "Total Employee" }
                                    ]}
                                />
                            </div>
                        </div>

                        <div className="display-flex-normal">
                            <div style={{ position: 'relative', width: 'calc(100% - 570px)' }}>
                                <PeopleTabs
                                    colorStatus="#0088FE"
                                    title="Number of Employee Not Present by Type"
                                    subtitle="PT TIGA DAYA DIGITAL INDONESIA"
                                />
                                <CardNewStatistic
                                    title="Total Average Amount of Business Trip Cost per Employee"
                                    subtitle="PT TIGA DAYA DIGITAL INDONESIA"
                                    icon='color-orange fas fa-dollar-sign fa-10x margin-right-10px'
                                    data={[
                                        { value: "Rp." + this.state.averageAmount, label: "Per Employee" }
                                    ]}
                                />
                                <CardNewStatistic
                                    title="Total Employee"
                                    subtitle="Number of Employee Attendance per Today"
                                    data={[
                                        { value: this.state.totalEmployee, label: "Total Employee" }
                                    ]}
                                />
                            </div>
                            <CardSimpleBarchart
                                data={dataAgeDemographic}
                                dataKey={[
                                    { key: "MALE", color: '#f54242', bizValue: 'Male' },
                                    { key: "FEMALE", color: '#036ffc', bizValue: 'Female' },
                                ]}
                                title="Total Employee by Gender per Division"
                                subtitle="PT TIGA DAYA DIGITAL INDONESIA" />
                        </div>

                        <div className="display-flex-normal">
                            <div style={{ position: 'relative', width: 'calc(100% - 50%)' }}>
                                <CardNewPiechart
                                    data={dataStatus}
                                    total={String(this.state.totalEmpSt)}
                                    colors={
                                        ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']
                                    }
                                    title="Number of Employee by Status Employee"
                                    subtitle="PT TIGA DAYA DIGITAL INDONESIA" />
                            </div>
                            <div style={{ position: 'relative', width: 'calc(100% - 50%)' }}>
                                <CardNewPiechart
                                    //datab={datab ? datab : ""}
                                    data={dataMovement}
                                    total={String(totalEmp)}
                                    colors={
                                        ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']
                                    }
                                    title="Total List Employee on Movement by Type"
                                    subtitle="PT. Bozz Online Solusindo" />
                            </div>
                        </div>

                        <div className="display-flex-normal">

                        </div>

                        <div className="display-flex-normal">
                            <CardNewBarchart
                                style={{ position: 'relative', width: 'calc(100%)' }}
                                data={dataLeaveDiv}
                                dataKey={[
                                    { key: 'totalEmployee', color: '#6495ED' },
                                    // { key: 'bonus', color: '#82ca9d' },
                                    // { key: 'overtime', color: '#ffc658' }
                                ]}
                                title="Total Corporate Employee on Leave per Division"
                                subtitle="PT TIGA DAYA DIGITAL INDONESIA" />
                            <CardTinnyBarchart
                                data={this.state.dataLate}
                                colors={
                                    ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']
                                }
                                title="Who is Late Employee Per Division"
                                subtitle="PT TIGA DAYA DIGITAL INDONESIA" />
                        </div>
                        <div className='display-flex-normal'>
                            <CardSimpleBarchart
                                data={this.state.arrayNonVolunteryCopy}
                                dataKey={[
                                    { key: 'VOLUNTERY', color: '#8884d8', bizValue: 'Voluntery' },
                                    { key: 'NONVOLUNTERY', color: '#82ca9d', bizValue: 'Non-Voluntery' }
                                ]}
                                title="Total List Employee on Termination by Type per Division"
                                subtitle="PT TIGA DAYA DIGITAL INDONESIA" />
                            <CardNewPiechart
                                data={dataTermination}
                                total={String(this.state.totalEmpTr)}
                                colors={
                                    ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']
                                }
                                title="Total List Employee on Termination by Type"
                                subtitle="PT TIGA DAYA DIGITAL INDONESIA" />
                        </div>

                        <div className="display-flex-normal">
                            <CardNewBarchart
                                style={{ position: 'relative', width: 'calc(100% - 470px)' }}
                                data={dataIncome}
                                dataKey={[
                                    { key: 'salary', color: '#E5E5FF' },
                                    // { key: 'bonus', color: '#82ca9d' },
                                    // { key: 'overtime', color: '#ffc658' }
                                ]}
                                title="Statistic Employee by Month"
                                subtitle="PT TIGA DAYA DIGITAL INDONESIA" />
                            <CardTable
                                style={{ position: 'relative', width: 'calc(100% - 470px)' }}
                                title={'Total Average Amount of Business Trip Cost per Division'}
                                icon='color-orange fas fa-dollar-sign fa-2x margin-right-10px'
                                subtitle={'PT TIGA DAYA DIGITAL'}
                                data={dataAvgAmnt}
                                columns={['No.', 'Division', 'Total Average']} />
                            <CardSimpleBarchart
                                data={this.state.dataMovType}
                                dataKey={[
                                    { key: 'PROMOSI', color: '#8884d8', bizValue: 'Promosi' },
                                    { key: 'DEMOSI', color: '#82ca9d', bizValue: 'Demosi' },
                                    { key: 'PENGGANTIAN', color: '#FFBB28', bizValue: 'Penggantian' },
                                    { key: 'PENAMBAHAN', color: '#FF8042', bizValue: 'Penambahan' }
                                ]}
                                title="Total List Employee on Movement by Type per Division"
                                subtitle="PT TIGA DAYA DIGITAL INDONESIA" />
                        </div>
                        <div className='display-flex-normal'>
                            <CardSimpleBarchart
                                data={this.state.dataBlacklistSP}
                                dataKey={[
                                    { key: 'SP1', color: '#6495ED', bizValue: 'SP 1' },
                                    { key: 'SP2', color: 'orange', bizValue: 'SP 2' },
                                    { key: 'SP3', color: 'red', bizValue: 'SP 3' },
                                ]}
                                title="Total List Employee on Blacklist by Type per Division"
                                subtitle="PT TIGA DAYA DIGITAL INDONESIA" />
                            <CardNewPiechart
                                data={dataBlacklist}
                                total={String(this.state.totalEmpBl)}
                                colors={
                                    ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']
                                }
                                title="Total List Employee on Blacklist by Type"
                                subtitle="PT TIGA DAYA DIGITAL INDONESIA" />
                        </div>
                    </div>
                )}
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        auth: state.auth
    };
};

const mapDispatchToProps = dispatch => {
    return {
        authLogout: () => dispatch(AuthAction.authLogout())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(dashboardPersonel)