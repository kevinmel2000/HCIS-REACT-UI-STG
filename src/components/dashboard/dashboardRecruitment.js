import React, { Component } from 'react'
import CardNewBarchart from '../../cards/news/Barchart'
import CardNewStatistic from '../../cards/news/Statistic'
import LoadingBar from "react-top-loading-bar";
import Api from '../../Services/Api'
import * as R from 'ramda'

export default class dashboardRecruitment extends Component {
    constructor() {
        super()
        this.state = {
            dataAverage: [],
            dataBudget: [],
            averageCost: 0,
            dataApplicant: [],
            dataCandidate: [],
            dataProcess: [],
            dataPosition:[]
        }
    }

    startFetch = () => {
        this.LoadingBar.continousStart();
    };

    onFinishFetch = () => {
        if (typeof this.LoadingBar === "object") this.LoadingBar.complete();
    };

    componentDidMount(){
        this.getBudget()
        this.getAverage()
        this.getApplicantDivision()
        this.getCandidateDivision()
        this.getProcessingApplicant()
        this.getPosition()
        this.startFetch()
    }

    async getApplicantDivision() {
        let body ={
            "limit": 100,
            "offset": 0
        }
        let response = await Api.create("DASHBOARD").getApplicantDivision(body)
        if (response.data && response.data.status === "S") {
            this.setState({ dataApplicant: response.data.data })
            this.onFinishFetch()
        } else if (R.isNil(response.data)) return alert("Failed: " + response.problem)
        else return alert("Failed: " + response.data.message)
    }

    async getCandidateDivision() {
        let body ={
            "limit": 100,
            "offset": 0
        }
        let response = await Api.create("DASHBOARD").getCandidateDivision(body)
        if (response.data && response.data.status === "S") {
            this.setState({ dataCandidate: response.data.data })
            this.onFinishFetch()
        } else if (R.isNil(response.data)) return alert("Failed: " + response.problem)
        else return alert("Failed: " + response.data.message)
    }

    async getProcessingApplicant() {
        let body ={
            "limit": 100,
            "offset": 0
        }
        let response = await Api.create("DASHBOARD").getProcessingApplicant(body)
        if (response.data && response.data.status === "S") {
            this.setState({ dataProcess: response.data.data })
            this.onFinishFetch()
        } else if (R.isNil(response.data)) return alert("Failed: " + response.problem)
        else return alert("Failed: " + response.data.message)
    }

    async getPosition() {
        let body ={
            "limit": 100,
            "offset": 0
        }
        let response = await Api.create("DASHBOARD").getPosistionDepartment(body)
        if (response.data && response.data.status === "S") {
            this.setState({ dataPosition: response.data.data })
            this.onFinishFetch()
        } else if (R.isNil(response.data)) return alert("Failed: " + response.problem)
        else return alert("Failed: " + response.data.message)
    }

    async getBudget() {
        let body = {
            "limit": 100,
            "offset": 0
        }
        let totalBudget=0
        let responseBudget = await Api.create("DASHBOARD").getBudgetPlanning(body)
        console.log(responseBudget.data)
        if (responseBudget.data.status === "S") {
            responseBudget.data.data.map((item, index) => {
                totalBudget = totalBudget + item.totalBudget
            })
            this.setState({ totalBudget })
            this.onFinishFetch()
        } else if (R.isNil(responseBudget.data)) return alert("Failed: " + responseBudget.problem)
        else return alert("Failed: " + responseBudget.data.message)
    }

    async getAverage() {
        let body = {
            "limit": 100,
            "offset": 0
        } 
        let responseAverage = await Api.create("DASHBOARD").getAverageCostHire(body)
        let averageCost = 0
        console.log(responseAverage.data)
        if (responseAverage.data.status === "S") {
            responseAverage.data.data.map((item, index) => {
                averageCost = averageCost + item.averageCost
            })
            this.setState({ averageCost })
            this.onFinishFetch()
        } 
    }


    
    render() {
        return (
            <div className="main-content background-white" >
                <LoadingBar onRef={ref => (this.LoadingBar = ref)} />
                <div className="display-flex-normal">
                    <CardNewStatistic
                        style={{ position: 'relative', width: 'calc(100% - 470px)' }}
                        title="Average Cost per Hire"
                        subtitle="PT TIGA DAYA DIGITAL INDONESIA"
                        icon='color-orange fas fa-dollar-sign fa-10x margin-right-10px'
                        data={[
                            { value: "Rp." + String(this.state.averageCost), label: "Total Average Cost" }
                        ]}
                    />
                    <CardNewBarchart
                        style={{ position: 'relative', width: 'calc(100% - 470px)' }}
                        data={this.state.dataApplicant}
                        dataKey={[
                            { key: 'totalApplicant', color: 'orange' },
                            // { key: 'bonus', color: '#82ca9d' },
                            // { key: 'overtime', color: '#ffc658' }
                        ]}
                        title="Number of Applicant per Division"
                        subtitle="PT TIGA DAYA DIGITAL INDONESIA" />
                </div>
                <div className="display-flex-normal">
                    <CardNewBarchart
                        style={{ position: 'relative', width: 'calc(100% - 470px)' }}
                        data={this.state.dataCandidate}
                        dataKey={[
                            { key: 'totalCandidate', color: 'red' },
                            // { key: 'bonus', color: '#82ca9d' },
                            // { key: 'overtime', color: '#ffc658' }
                        ]}
                        title="Number of Candidate per Division"
                        subtitle="PT TIGA DAYA DIGITAL INDONESIA" />
                    <CardNewBarchart
                        style={{ position: 'relative', width: 'calc(100% - 470px)' }}
                        data={this.state.dataProcess}
                        dataKey={[
                            { key: 'totalProcessingApplicant', color: 'green' },
                            // { key: 'bonus', color: '#82ca9d' },
                            // { key: 'overtime', color: '#ffc658' }
                        ]}
                        title="Number of Processing Applicant per Division"
                        subtitle="PT TIGA DAYA DIGITAL INDONESIA" />
                </div>
                <div className="display-flex-normal">
                    <CardNewBarchart
                        department ="department"
                        style={{ position: 'relative', width: 'calc(100% - 470px)' }}
                        data={this.state.dataPosition}
                        dataKey={[
                            { key: 'totalOpenPosition', color: '#E5E5FF' },
                            // { key: 'bonus', color: '#82ca9d' },
                            // { key: 'overtime', color: '#ffc658' }
                        ]}
                        title="Number of open Position by Departement"
                        subtitle="PT TIGA DAYA DIGITAL INDONESIA" />
                    <CardNewStatistic
                        title="Number of Budget Planning of the Year"
                        subtitle="PT TIGA DAYA DIGITAL INDONESIA"
                        icon='color-red fas fa-user-tie fa-10x margin-right-10px'
                        data={[
                            { value: String(this.state.totalBudget), label: "Total Budget Planning" }
                        ]}
                    />
                </div >
            </div>
        )
    }
}
