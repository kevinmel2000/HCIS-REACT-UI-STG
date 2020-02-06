import M from 'moment'
import API from './Api'
import * as R from 'ramda'

import React from 'react'

export function parseApplicantData(payload) {
    let {
        applicantBirthDate,
        applicantGender,
        applicantNationality,
        applicantReligion,
        applicantMaritalStatus,
        applicantEducationLevel,
        applicantRecruitmentRequestDTO,
        applicantBloodType,
        applicantClothSize,
        applicantFamilies,
        applicantFormalEducations,
        applicantInformalEducations,
        applicantLanguageSkills,
        applicantSpecialAbilities,
        applicantWeaknesss,
        applicantReferences,
        applicantDocuments,
        applicantSocialMedias
    } = payload

    let dataLanguageSkill = Object.assign([], applicantLanguageSkills)
    dataLanguageSkill = dataLanguageSkill.map((value, index) => {
        return {
            ...value,
            conversationLanguageSkillCompetencyType: value.conversationLanguageSkillCompetencyType.bizparKey,
            languageSkill: value.languageSkill.bizparKey,
            listeningLanguageSkillCompetencyType: value.listeningLanguageSkillCompetencyType.bizparKey,
            readingLanguageSkillCompetencyType: value.readingLanguageSkillCompetencyType.bizparKey,
            writingLanguageSkillCompetencyType: value.writingLanguageSkillCompetencyType.bizparKey,
        }
    })

    let dataSocialMedia = Object.assign([], applicantSocialMedias)
    dataSocialMedia = dataSocialMedia.map((value, index) => {
        return {
            ...value,
            socialMediaType: value.socialMediaType.bizparKey
        }
    })

    let dataAbility = Object.assign([], applicantSpecialAbilities)
    dataAbility = dataAbility.map((value, index) => {
        return {
            ...value,
            specialAbilityCompetencyType: value.specialAbilityCompetencyType.bizparKey
        }
    })

    let dataDeficiency = Object.assign([], applicantWeaknesss)
    dataDeficiency = dataDeficiency.map((value, index) => {
        return {
            ...value,
            weaknessCategory: value.weaknessCategory.bizparKey,
            weaknessType: value.weaknessType.bizparKey
        }
    })

    let dataReference = Object.assign([], applicantReferences)
    dataReference = dataReference.map((value, index) => {
        return {
            ...value,
            referenceType: value.referenceType.bizparKey
        }
    })
    let dataDocument = Object.assign([], applicantDocuments)
    dataDocument = dataDocument.map((value, index) => {
        return {
            ...value,
            documentType: value.documentType.bizparKey
        }
    })
    let dataInformalEdu = Object.assign([], applicantInformalEducations)
    dataInformalEdu = dataInformalEdu.map((value, index) => {
        return {
            ...value,
            informalEducationTrainingType: value.informalEducationTrainingType.bizparKey,
            informalEducationCostSource: value.informalEducationCostSource.bizparKey
        }
    })
    let dataFormalEdu = Object.assign([], applicantFormalEducations)
    dataFormalEdu = dataFormalEdu.map((value, index) => {
        return {
            ...value,
            formalEducationDegree: value.formalEducationDegree.bizparKey,
            formalEducationDegreePosition: value.formalEducationDegreePosition.bizparKey,
            formalEducationDepartement: value.formalEducationDepartement.bizparKey,
            formalEducationInstitute: !R.isNil(value.formalEducationInstitute) ? value.formalEducationInstitute.instituteID : "",
            formalEducationType: value.formalEducationType.bizparKey,
            formalEducationLevel: value.formalEducationLevel.bizparKey
        }
    })

    let dataFamily = Object.assign([], applicantFamilies)
    dataFamily = dataFamily.map((value, index) => {
        return {
            ...value,
            familyEducationLevel: value.familyEducationLevel.bizparKey,
            familyGenderType: value.familyGenderType.bizparKey,
            familyMaritalStatus: value.familyMaritalStatus.bizparKey,
            familyNationalityType: value.familyNationalityType.bizparKey,
            familyRelationshipType: value.familyRelationshipType.bizparKey,
            familyReligionType: value.familyReligionType.bizparKey,
            familyType: value.familyType.bizparKey,
            applicantFamilyAddress: {
                address: value.applicantFamilyAddress.address.map((data, index) => {
                    return {
                        ...data,
                        country: data.country.countryID,
                        addressType: data.addressType.bizparKey,
                        province: data.province.provinceID,
                        kabkot: data.kabkot.kabkotID,
                        kelurahan: data.kelurahan.kelurahanID,
                        kecamatan: data.kecamatan.kecamatanID
                    }
                })
            }
        }
    })

    payload = {
        ...payload,
        "applicantBirthDate": applicantBirthDate === M(applicantBirthDate, "DD-MM-YYYY").format("DD-MM-YYYY") ? applicantBirthDate : M(applicantBirthDate, "YYYY-MM-DD").format("DD-MM-YYYY"),
        "applicantGender": applicantGender.bizparKey,
        "applicantNationality": applicantNationality.bizparKey,
        "applicantReligion": applicantReligion.bizparKey,
        "applicantMaritalStatus": applicantMaritalStatus.bizparKey,
        "applicantEducationLevel": applicantEducationLevel.bizparKey,
        "recruitmentRequestID": applicantRecruitmentRequestDTO.recruitmentRequestID,
        "applicantBloodType": applicantBloodType.bizparKey,
        "applicantClothSize": applicantClothSize.bizparKey,
        "applicantFamilies": dataFamily,
        "applicantFormalEducations": dataFormalEdu,
        "applicantInformalEducations": dataInformalEdu,
        "applicantLanguageSkills": dataLanguageSkill,
        "applicantSpecialAbilities": dataAbility,
        "applicantWeaknesss": dataDeficiency,
        "applicantReferences": dataReference,
        "applicantDocuments": dataDocument,
        "applicantSocialMedias": dataSocialMedia,
        "updatedBy": "SYSTEM",
        "updatedDate": M().format("DD-MM-YYYY HH:mm:ss")
    }

    delete payload.applicantRecruitmentRequestDTO
    delete payload.applicantCreatedAt
    delete payload.applicantModifiedAt
    delete payload.applicantModifiedBy
    return payload
}

export async function getBizpar(cat) {
    let payload = {
        params: {
            bizparCategory: cat
        },
        offset: 0,
        limit: 1000
    }

    let response = await API.create('BIZPAR').getBizparByCategory(payload)
    console.log('GET BIZPAR ' + cat + ' > ', response)
    if (response.data && response.data.status === "S") {
        return response.data.data
    } else {
        return []
    }
}

export function convertMonths(month) {
    let monthNames = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"]
    return monthNames[month - 1]
}

export function renderInputText(label, value, onChange, readonly = false) {
    return (
        <div className="margin-bottom-15px">
            <div className="margin-5px">
                <span className="txt-site txt-11 txt-main txt-bold">
                    {label}
                </span>
            </div>

            <input
                readOnly={readonly}
                style={{
                    backgroundColor: readonly ? "#E6E6E6" : "white"
                }}
                value={value}
                onChange={onChange}
                className="txt txt-sekunder-color"
                type="text"
                placeholder=""
            />
        </div>
    )
}

export function renderSelectBox(label, placeholder, value, bizpar, onChange) {
    return (
        <div className="margin-bottom-15px">
            <div className="margin-5px">
                {label && (
                    <span className="txt-site txt-11 txt-main txt-bold">
                        {label}<span style={{ color: "red" }}>*</span>
                    </span>
                )}
            </div>
            <select value={value} onChange={onChange} className="cf-select slc slc-sekunder">
                <option value=""> -- please select {placeholder} -- </option>
                {bizpar.map((data, index) => {
                    return (<option key={index} value={data.bizparKey}>{data.bizparValue}</option>)
                })}
            </select>
        </div>
    )
}

export function parseEmployeeData(data) {
    let {
        employeeBirthDate,
        employeeDateOfDeath,
        employeeRegistrationDate,
        employeeExitDate,
        employeePPHEndDate,
        employeeGender,
        employeeNationality,
        applicant,
        employeeReligion,
        employeeEducationLevel,
        employeeBloodType,
        employeeClothSize,
        employeeStatus,
        employeeType,
        employeeMaritalStatus,
        employeeFamilies,
        employeeFormalEducations,
        employeeInformalEducations,
        employeeLanguageSkills,
        employeeSpecialAbilities,
        employeeWeaknesses,
        employeeReferences,
        employeeDocuments,
        employeeLicenses,
        employeeSocialMedias,
        employeeAppreciations,
        employeeInsurances,
        employeeFacilities,
        employeeLegalDocuments,
        employeeTaxDocuments,
        employeePTKPType,
        employeePension,
        employeePaymentMethod,
        employeeShio,
        employeeElement,
        employeeUnsur,
        recordID,
        position,
        company
    } = data

    let dataLanguageSkill = Object.assign([], employeeLanguageSkills)
    dataLanguageSkill = dataLanguageSkill.map((value, index) => {
        return {
            ...value,
            conversationLanguageSkillCompetencyType: value.conversationLanguageSkillCompetencyType.bizparKey,
            languageSkill: value.languageSkill.bizparKey,
            listeningLanguageSkillCompetencyType: value.listeningLanguageSkillCompetencyType.bizparKey,
            readingLanguageSkillCompetencyType: value.readingLanguageSkillCompetencyType.bizparKey,
            writingLanguageSkillCompetencyType: value.writingLanguageSkillCompetencyType.bizparKey,
        }
    })

    let dataSocialMedia = Object.assign([], employeeSocialMedias)
    dataSocialMedia = dataSocialMedia.map((value, index) => {
        return {
            ...value,
            socialMediaType: value.socialMediaType.bizparKey
        }
    })

    let dataLicense = Object.assign([], employeeLicenses)
    dataLicense = dataLicense.map((value, index) => {
        return {
            ...value,
            employeeLicenseType: value.employeeLicenseType.bizparKey
        }
    })

    let dataAbility = Object.assign([], employeeSpecialAbilities)
    dataAbility = dataAbility.map((value, index) => {
        return {
            ...value,
            specialAbilityCompetencyType: value.specialAbilityCompetencyType.bizparKey
        }
    })

    let dataDeficiency = Object.assign([], employeeWeaknesses)
    dataDeficiency = dataDeficiency.map((value, index) => {
        return {
            ...value,
            weaknessCategory: value.weaknessCategory.bizparKey,
            weaknessType: value.weaknessType.bizparKey
        }
    })

    let dataReference = Object.assign([], employeeReferences)
    dataReference = dataReference.map((value, index) => {
        return {
            ...value,
            referenceType: value.referenceType.bizparKey
        }
    })
    let dataDocument = Object.assign([], employeeDocuments)
    dataDocument = dataDocument.map((value, index) => {
        return {
            ...value,
            documentType: value.documentType.bizparKey
        }
    })
    let dataInformalEdu = Object.assign([], employeeInformalEducations)
    dataInformalEdu = dataInformalEdu.map((value, index) => {
        return {
            ...value,
            informalEducationTrainingType: value.informalEducationTrainingType.bizparKey,
            informalEducationCostSource: value.informalEducationCostSource.bizparKey
        }
    })
    let dataFormalEdu = Object.assign([], employeeFormalEducations)
    dataFormalEdu = dataFormalEdu.map((value, index) => {
        return {
            ...value,
            formalEducationDegree: value.formalEducationDegree ? value.formalEducationDegree.bizparKey : "",
            formalEducationDegreePosition: value.formalEducationDegreePosition ? value.formalEducationDegreePosition.bizparKey : "",
            formalEducationDepartment: value.formalEducationDepartment ? value.formalEducationDepartment.bizparKey : "",
            formalEducationInstitute: value.formalEducationInstitute ? value.formalEducationInstitute.instituteID : "",
            formalEducationType: value.formalEducationType ? value.formalEducationType.bizparKey : "",
            formalEducationLevel: value.formalEducationLevel ? value.formalEducationLevel.bizparKey : "",
            formalEducationCostSource: value.formalEducationCostSource ? value.formalEducationCostSource.bizparKey : "",
        }
    })

    let dataFamily = Object.assign([], employeeFamilies)
    dataFamily = dataFamily.map((value, index) => {
        return {
            ...value,
            familyEducationLevel: value.familyEducationLevel.bizparKey,
            familyGenderType: value.familyGenderType && value.familyGenderType.bizparKey,
            familyMaritalStatus: value.familyMaritalStatus.bizparKey,
            familyNationalityType: value.familyNationalityType && value.familyNationalityType.bizparKey,
            familyRelationshipType: value.familyRelationshipType.bizparKey,
            familyReligionType: value.familyReligionType.bizparKey,
            familyType: value.familyType.bizparKey,
            familyFaskes: value.familyFaskes.bizparKey,
            familyFaskesClass: value.familyFaskesClass.bizparKey,
            employeeFamilyAddress: {
                address: value.employeeFamilyAddress.address.map((data, index) => {
                    return {
                        ...data,
                        country: data.country.countryID,
                        addressType: data.addressType.bizparKey,
                        province: data.province.provinceID,
                        kabkot: data.kabkot.kabkotID,
                        kelurahan: data.kelurahan.kelurahanID,
                        kecamatan: data.kecamatan.kecamatanID
                    }
                })
            }
        }
    })

    let dataAppreciation = Object.assign([], employeeAppreciations)
    dataAppreciation = dataAppreciation.map((value, index) => {
        return {
            ...value,
            appreciationType: value.appreciationType.bizparKey
        }
    })

    let dataInsurances = Object.assign([], employeeInsurances)
    dataInsurances = dataInsurances.map((value, index) => {
        return {
            ...value,
            insuranceCategory: value.insuranceCategory.bizparKey,
            insuranceType: value.insuranceType.bizparKey,
            insuranceFaskesClass: !R.isNil(value.insuranceFaskesClass) ? value.insuranceFaskesClass.bizparKey : value.insuranceFaskesClass,
            insuranceFaskesType: !R.isNil(value.insuranceFaskesType) ? value.insuranceFaskesType.bizparKey : value.insuranceFaskesType,
        }
    })

    let dataFacility = Object.assign([], employeeFacilities)
    dataFacility = dataFacility.map((value, index) => {
        return {
            ...value,
            facilityCategory: value.facilityCategory.bizparKey,
            facilityType: value.facilityType.bizparKey
        }
    })

    let dataLegalDoc = Object.assign([], employeeLegalDocuments)
    dataLegalDoc = dataLegalDoc.map((value, index) => {
        return {
            employeeLegalDocumentID: value.employeeLegalDocumentID,
            legalDocumentNo: value.legalDocumentNo,
            legalDocumentDate: value.legalDocumentDate,
            legalDocumentStartDate: value.legalDocumentStartDate,
            legalDocumentEndDate: value.legalDocumentEndDate,
            legalDocumentGrade: value.legalDocumentGrade,
            legalDocumentURL: value.legalDocumentURL,
            esid: value.companyID,
            ouid: value.positionID
        }
    })

    let dataTaxDoc = Object.assign([], employeeTaxDocuments)
    dataTaxDoc = dataTaxDoc.map((value, index) => {
        return {
            employeeTaxDocumentID: value.employeeTaxDocumentID,
            taxDocumentNo: value.taxDocumentNo,
            taxDocumentDate: value.taxDocumentDate,
            taxDocumentStartMonth: value.taxDocumentStartMonth,
            taxDocumentEndMonth: value.taxDocumentEndMonth,
            taxDocumentURL: value.taxDocumentURL,
            esid: value.companyID
        }
    })
    let dataApplicant = applicant && applicant.applicantNumber ? applicant.applicantNumber : ""
    let dataOuid = position.positionID
    let dataEsid = company.companyID

    data = {
        ...data,
        employeeRegistrationDate: employeeRegistrationDate === M(employeeRegistrationDate, "DD-MM-YYYY").format("DD-MM-YYYY") ? employeeRegistrationDate : M(employeeRegistrationDate, "YYYY-MM-DD").format("DD-MM-YYYY"),
        employeeBirthDate: employeeBirthDate === M(employeeBirthDate, "DD-MM-YYYY").format("DD-MM-YYYY") ? employeeBirthDate : M(employeeBirthDate, "YYYY-MM-DD").format("DD-MM-YYYY"),
        employeeDateOfDeath: employeeDateOfDeath === M(employeeDateOfDeath, "DD-MM-YYYY").format("DD-MM-YYYY") ? employeeDateOfDeath : employeeDateOfDeath === "Invalid date" || R.isEmpty(employeeDateOfDeath) ? "" : M(employeeDateOfDeath, "YYYY-MM-DD").format("DD-MM-YYYY"),
        employeePPHEndDate: employeePPHEndDate === M(employeePPHEndDate, "DD-MM-YYYY").format("DD-MM-YYYY") ? employeePPHEndDate : M(employeePPHEndDate, "YYYY-MM-DD").format("DD-MM-YYYY"),
        employeeExitDate: employeeExitDate === M(employeeExitDate, "DD-MM-YYYY").format("DD-MM-YYYY") ? employeeExitDate : M(employeeExitDate, "YYYY-MM-DD").format("DD-MM-YYYY"),
        employeeGender: employeeGender === null ? employeeGender : employeeGender.bizparKey,
        employeeNationality: employeeNationality === null ? employeeNationality : employeeNationality.bizparKey,
        applicantID: dataApplicant,
        employeeReligion: employeeReligion.bizparKey,
        employeeEducationLevel: employeeEducationLevel.bizparKey,
        employeeBloodType: employeeBloodType.bizparKey,
        employeeClothSize: employeeClothSize.bizparKey,
        employeeStatus: employeeStatus.bizparKey,
        employeeType: employeeType.bizparKey,
        employeeMaritalStatus: employeeMaritalStatus.bizparKey,
        employeeFamilies: dataFamily,
        employeeFormalEducations: dataFormalEdu,
        employeeInformalEducations: dataInformalEdu,
        employeeLanguageSkills: dataLanguageSkill,
        employeeSpecialAbilities: dataAbility,
        employeeWeaknesses: dataDeficiency,
        employeeReferences: dataReference,
        employeeSocialMedias: dataSocialMedia,
        employeeDocuments: dataDocument,
        employeeLicenses: dataLicense,
        employeeAppreciations: dataAppreciation,
        employeeInsurances: dataInsurances,
        employeeFacilities: dataFacility,
        employeeLegalDocuments: dataLegalDoc,
        employeeTaxDocuments: dataTaxDoc,
        employeePTKPType: !R.isNil(employeePTKPType) ? employeePTKPType.bizparKey : employeePTKPType,
        employeePension: {
            ...employeePension,
            employeePensionType: employeePension.employeePensionType ? employeePension.employeePensionType.bizparKey : ""
        },
        employeePaymentMethod: {
            ...employeePaymentMethod,
            employeePaymentMethod: employeePaymentMethod.employeePaymentMethod.bizparKey,
            employeePaymentBankID: employeePaymentMethod.employeePaymentBankID.bizparKey,
            employeePaymentCurrency: employeePaymentMethod.employeePaymentCurrency.bizparKey,
            employeeTHRBase: employeePaymentMethod.employeeTHRBase.bizparKey
        },
        employeeShio: !R.isNil(employeeShio) ? employeeShio.bizparKey : employeeShio,
        employeeElement: !R.isNil(employeeElement) ? employeeElement.bizparKey : employeeElement,
        employeeUnsur: !R.isNil(employeeUnsur) ? employeeUnsur.bizparKey : employeeUnsur,
        recordID: recordID,
        updatedBy: "SYSTEM",
        updatedDate: M().format("DD-MM-YYYY HH:mm:ss"),
        ouid: dataOuid,
        esid: dataEsid
    }

    delete data.applicant
    delete data.position
    delete data.company
    delete data.employeeAddresses
    delete data.employeeCreationalDTO

    return data
}
