import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  signInRes: any;
  signObj: any;
  baseURL: string = "http://34.231.177.197:3000";//http://34.231.177.197:4000/
  //baseURL: string = "http://34.231.177.197:4000";
  res: any;
  accessToken: string;
  id: string = "";
  pMedPersonID: string = "";
  previewImg: any;
  public isProfileUpdated: BehaviorSubject<string> = new BehaviorSubject('')

  constructor(private _http: HttpClient) {
  }

  //Admin SignUp
  adminRegister(data): any {
    return this._http.post(this.baseURL + "/api/hospital/register", data)
  }

  //Admin Login
  adminLogin(data): any {
    return this._http.post(this.baseURL + "/api/hospital/login", data);
  }

  //Forget Password
  forgotPassword(data): any {
    return this._http.post(this.baseURL + "/api/hospital/forgetpassword", data);
  }

  //Change Password
  changePassword(data): any {
    return this._http.post(this.baseURL + "/api/hospital/changepassword", data);
  }
  //Change Patient Password
  // /api/patient/generalinfo/changepassword
  changePatientPassword(data): any {
    return this._http.post(this.baseURL + "/api/patient/generalinfo/setpassword", data);
  }
  adminResetPassword(data): any {
    return this._http.post(this.baseURL + "/api/hospital/setpassword", data);
  }
  //medicalpersonnel/setpassword
  medicalPersonnelResetPassword(data): any {
    return this._http.post(this.baseURL + "/api/medicalpersonnel/setpassword", data);
  }
  adminAccoutVerification(data): any {
    return this._http.post(this.baseURL + "/api/hospital/admin/verify", data);
  }
  medicalPersonnelAccoutVerification(data): any {
    return this._http.post(this.baseURL + "/api/medicalpersonnel/verify", data);
  }
  //Get Admin adn Gen-User Data
  getAdminWithGenUserData(addAdminAndGenData, accessToken): any {
    return this._http.post(this.baseURL + "/api/hospital/getadmins", addAdminAndGenData, { headers: { 'x-access-token': accessToken } });
  }

  //Get Admin adn Gen-User Data
  getMedicalPersonnelData(fetchMedicalPersonnelData, accessToken): any {
    return this._http.post(this.baseURL + "/api/hospital/getmedicalpersonnels", fetchMedicalPersonnelData, { headers: { 'x-access-token': accessToken } });
  }


  //Add Hospital Departments Data
  addHospitalDepartmentsData(addHospitalDepartmentDataObj, accessToken): any {
    return this._http.post(this.baseURL + "/api/hospital/departments",
      addHospitalDepartmentDataObj, { headers: { 'x-access-token': accessToken } });
  }
  //Get Hospital Departments Data
  getHospitalDepartmentsData(fetchHospitalDepartmentDataObj, accessToken): any {
    return this._http.post(this.baseURL + "/api/hospital/departments/fetch",
      fetchHospitalDepartmentDataObj, { headers: { 'x-access-token': accessToken } });
  }
  //Add administrativeroles Data
  addAdministrativeRolesData(addAdministrativeRolesDataObj, accessToken): any {
    return this._http.post(this.baseURL + "/api/hospital/administrativeroles",
      addAdministrativeRolesDataObj, { headers: { 'x-access-token': accessToken } });
  }
  //Get administrativeroles Data
  getAdministrativeRolesData(fetchAdministrativeRolesDataObj, accessToken): any {
    return this._http.post(this.baseURL + "/api/hospital/administrativeroles/fetch",
      fetchAdministrativeRolesDataObj, { headers: { 'x-access-token': accessToken } });
  }
  //Add administrativeroles Data
  addMedicalRolesData(addMedicalRolesDataObj, accessToken): any {
    return this._http.post(this.baseURL + "/api/hospital/medicalroles",
      addMedicalRolesDataObj, { headers: { 'x-access-token': accessToken } });
  }
  //Get administrativeroles Data
  getMedicalRolesData(fetchMedicalRolesDataObj, accessToken): any {
    return this._http.post(this.baseURL + "/api/hospital/medicalroles/fetch",
      fetchMedicalRolesDataObj, { headers: { 'x-access-token': accessToken } });
  }
  //Add Services Data
  addServicesData(addServicesDataObj, accessToken): any {
    return this._http.post(this.baseURL + "/api/services",
      addServicesDataObj, { headers: { 'x-access-token': accessToken } });
  }
  //Get administrativeroles Data
  getServicesData(fetchServicesDataObj, accessToken): any {
    return this._http.post(this.baseURL + "/api/services/fetch",
      fetchServicesDataObj, { headers: { 'x-access-token': accessToken } });
  }
  //Delete ServicesFees Data
  deleteServicesData(deleteServicesDataObj, accessToken): any {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': accessToken
      }),
      body: {
        "adminUserID": deleteServicesDataObj.adminUserID,
        "hospital_reg_num": deleteServicesDataObj.hospital_reg_num,
        "serviceID": deleteServicesDataObj.serviceID,
      }
    }
    console.log("Delete service fees Data : ", options);
    return this._http.delete(this.baseURL + "/api/services", options);
  }

  //Get Medical-Personnel & Patient data
  getMedicalPatientData(mpData): any {
    let token: any = mpData.token;
    let header = new Headers().set("x-access-token", token)
    const options = {

      "userID": mpData.userID,
      "category": mpData.category,
      "hospital_reg_num": mpData.hospital_reg_num,
    }
    console.log("OPtions", options)
    return this._http.post(this.baseURL + "/api/hospital/getmedicalpersonnels", options, { headers: { 'x-access-token': token } });
  }

  //Get  Patients data
  getPatientData(data): any {
    let access_token: any = data.token;
    const options = {
      "byWhom": data.byWhom,
      "byWhomID": data.byWhomID,
      "category": data.category,
      "hospital_reg_num": data.hospital_reg_num
    }
    console.log("All Patient for logged-in user : ", options)
    return this._http.post(this.baseURL + "/api/hospital/getpatients", options, { headers: { 'x-access-token': access_token } });
  }

  //Get Patient data
  getPatientInfo(pInfo): any {
    let access_token: any = pInfo.token;
    const options = {
      "userID": pInfo.emailID,
      "searchWord": pInfo.patientID,
      "hospital_reg_num": pInfo.hospital_reg_num,
    }
    console.log("Options", options);
    return this._http.post(this.baseURL + "/api/hospital/getpatients", options, { headers: { 'x-access-token': access_token } });
  }

  //Get  Patient Family History data
  getPatientFamilyHistoryData(data): any {
    let access_token: any = data.token;
    const options = {
      "hospital_reg_num": data.hospital_reg_num,
      "byWhom": data.byWhom,
      "byWhomID": data.byWhomID,
      //"medical_personnel_id":data.medical_personnel_id,
      "patientID": data.patientID,
      "medical_record_id": data.medical_record_id
    }
    console.log("Fetch Patient Family History : ", options)
    return this._http.post(this.baseURL + "/api/patient/familyhistory/fetch",
      options, { headers: { 'x-access-token': access_token } });
  }

  //Add Patient Family History
  addPatientFamilyHistoryData(addPatientFamilyHistory, accessToken): any {
    console.log("the req data for add pat fam history from service : ", addPatientFamilyHistory);
    return this._http.post(this.baseURL + "/api/patient/familyhistory/multiple",
      addPatientFamilyHistory, { headers: { 'x-access-token': accessToken } });
  }

  //Add Patient Medication
  addPatientIllnessMedicationManualData(addPatientMedicationManualData, accessToken): any {
    console.log("the req data for add pat fam history from service : ", addPatientMedicationManualData);
    return this._http.post(this.baseURL + "/api/patient/medicalrecord/illness/medication/manually",
      addPatientMedicationManualData, { headers: { 'x-access-token': accessToken } });
  }
  //Add Patient Medication
  addHospitalWebSitesData(addWebSitesData, accessToken): any {
    console.log("the req data for add hospital web sites data from service : ", addWebSitesData);
    return this._http.post(this.baseURL + "/api/hospital/updatewebsites",
      addWebSitesData, { headers: { 'x-access-token': accessToken } });
  }

  // /api/patient/medicalrecord/illness/medication/fetchall

  //Update Patient Medication
  updatePatientIllnessMedicationManualData(updatePatientMedicationManualData, accessToken): any {
    console.log("the req data for update pat fam history from service : ", updatePatientMedicationManualData);
    return this._http.post(this.baseURL + "/api/patient/medicalrecord/illness/medication/manually",
      updatePatientMedicationManualData, { headers: { 'x-access-token': accessToken } });
  }

  //Delete Patient Family History
  deletePatientFamilyHistoryData(deletePatientFamilyHistory, accessToken): any {
    let access_token: any = accessToken;
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': access_token
      }),
      body: {
        "medical_record_id": deletePatientFamilyHistory.medical_record_id,
        "hospital_reg_num": deletePatientFamilyHistory.hospital_reg_num,
        "patientID": deletePatientFamilyHistory.patientID,
        "byWhom": deletePatientFamilyHistory.byWhom,
        "byWhomID": deletePatientFamilyHistory.byWhomID
      }
    }
    console.log("Delete Patien Data : ", options);
    return this._http.delete(this.baseURL + "/api/patient/familyhistory/all", options);
  }

  //Get  Patient Allergies data
  getPatientAllergiesData(data): any {
    let access_token: any = data.token;
    const options = {
      "hospital_reg_num": data.hospital_reg_num,
      "byWhom": data.byWhom,
      "byWhomID": data.byWhomID,
      //"medical_personnel_id":data.medical_personnel_id,
      "patientID": data.patientID,
      "medical_record_id": data.medical_record_id
    }
    console.log("Fetch Patient Allergies req data :", options)
    return this._http.post(this.baseURL + "/api/patient/allergies/fetch", options, { headers: { 'x-access-token': access_token } });
  }

  //Add Patient Allergies History
  addPatientAllergiesData(addPatientAllergies, accessToken): any {
    console.log("the req data for add patient allergies from service : ", addPatientAllergies);
    return this._http.post(this.baseURL + "/api/patient/allergies/multiple",
      addPatientAllergies, { headers: { 'x-access-token': accessToken } });
  }

  //Delete Patient Allergies History
  deletePatientAllergiesData(deletePatientAllergies, accessToken): any {
    let access_token: any = accessToken;
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': access_token
      }),
      body: {
        "medical_record_id": deletePatientAllergies.medical_record_id,
        "hospital_reg_num": deletePatientAllergies.hospital_reg_num,
        "patientID": deletePatientAllergies.patientID,
        "byWhom": deletePatientAllergies.byWhom,
        "byWhomID": deletePatientAllergies.byWhomID
      }
    }
    console.log("Delete Patien Allergies Data : ", options);
    return this._http.delete(this.baseURL + "/api/patient/allergies/all", options);
  }

  //Add Patient Physical Exam Records Manually 
  addPatientPhysicalExamRecordsManually(addPatPhyExamRecordsManullyData, accessToken): any {
    return this._http.post(this.baseURL + "/api/patient/physicalexamrecord",
      addPatPhyExamRecordsManullyData, { headers: { 'x-access-token': accessToken } });
  }

  //Add Patient Physical Exam Records Manually 
  addAdminPersonalSettings(addAdminPersonalSettingsData, accessToken): any {
    return this._http.post(this.baseURL + "/api/hospital/adminpersonalsettings",
      addAdminPersonalSettingsData, { headers: { 'x-access-token': accessToken } });
  }

  //Add Patient Immunization Records Manually 
  addPatientImmunizationData(addPatImmunizationData, accessToken): any {
    return this._http.post(this.baseURL + "/api/patient/immunization",
      addPatImmunizationData, { headers: { 'x-access-token': accessToken } });
  }

  //Add Patient Ill Diagnosis Data
  addPatientIllnessDiagnosisData(addPatIllDiagnosisData, accessToken): any {
    return this._http.post(this.baseURL + "/api/patient/medicalrecord/illness/diagnosisNotes/",
      addPatIllDiagnosisData, { headers: { 'x-access-token': accessToken } });
  }

  //Update Patient Ill Diagnosis Data
  editPatientIllnessDiagnosisData(editPatIllDiagnosisData, accessToken): any {
    return this._http.put(this.baseURL + "/api/patient/medicalrecord/illness/diagnosisNotes/",
      editPatIllDiagnosisData, { headers: { 'x-access-token': accessToken } });
  }

  //Add Patient Medical Record Illness
  addPatientMedicalRecordIllnessData(addPatMedicalRecordIllnessData, accessToken): any {
    return this._http.post(this.baseURL + "/api/patient/medicalrecord/illness",
      addPatMedicalRecordIllnessData, { headers: { 'x-access-token': accessToken } });
  }

  //Update Pat Immunization Data
  updatePatientImmunizationData(editImmunizationData, accessToken): any {
    return this._http.put(this.baseURL + "/api/patient/immunization",
      editImmunizationData, { headers: { 'x-access-token': accessToken } });
  }

  //Update Pat Illness Data
  updatePatientIllnessData(editedIllnessData, accessToken): any {
    return this._http.put(this.baseURL + "/api/patient/medicalrecord/illness",
      editedIllnessData, { headers: { 'x-access-token': accessToken } });
  }

  //Update Patient Physical Exam Records Manually 
  updatePatientPhysicalExamRecordsManually(updatePatPhyExamRecordsManullyData, accessToken): any {
    console.log("update phy exam manual data from service : ", updatePatPhyExamRecordsManullyData);

    return this._http.put(this.baseURL + "/api/patient/physicalexamrecord",
      updatePatPhyExamRecordsManullyData, { headers: { 'x-access-token': accessToken } });
  }

  //Fetch Patient PhysicalExamRecords 
  getPatientPhysicalExamRecordsData(fetchPatientPhysicalExamRecords, accessToken): any {
    console.log("the req data for fetch patient phy exam records from service : ", fetchPatientPhysicalExamRecords);
    return this._http.post(this.baseURL + "/api/patient/physicalexamrecord/fetch",
      fetchPatientPhysicalExamRecords, { headers: { 'x-access-token': accessToken } });
  }

  //Fetch Patient ImmunizationsRecords 
  getPatientImmunizationRecordsData(fetchPatientImmunizationRecords, accessToken): any {
    console.log("the req data for add patient phy exam records from service : ", fetchPatientImmunizationRecords);
    return this._http.post(this.baseURL + "/api/patient/immunization/fetch",
      fetchPatientImmunizationRecords, { headers: { 'x-access-token': accessToken } });
  }

  //Fetch Patient Medical Records Illness 
  getPatientMedicalRecordsIllnessData(fetchPatientMedicalRecordsIllness, accessToken): any {
    console.log("the req data for fetch fetchPatientMedicalRecordsIllness records from service : ", fetchPatientMedicalRecordsIllness);
    return this._http.post(this.baseURL + "/api/patient/medicalrecord/illness/fetchall",
      fetchPatientMedicalRecordsIllness, { headers: { 'x-access-token': accessToken } });
  }

  //Fetch Patient Medications 
  getPatientMedicationsData(fetchPatientMedicationsDataObj, accessToken): any {
    console.log("the req data for fetch patient medications from service : ", fetchPatientMedicationsDataObj);
    return this._http.post(this.baseURL + "/api/patient/medicalrecord/illness/medication/fetch_all_by_patientID",
      fetchPatientMedicationsDataObj, { headers: { 'x-access-token': accessToken } });
  }

  //Fetch Patient Surgical records 
  getPatientSurgicalRecordsData(fetchPatientSurgicalRecordsObj, accessToken): any {
    console.log("the req data for fetch patient surgical records from service : ", fetchPatientSurgicalRecordsObj);
    return this._http.post(this.baseURL + "/api/patient/medicalrecord/illness/surgicalrecord/fetch_all_by_patientID",
      fetchPatientSurgicalRecordsObj, { headers: { 'x-access-token': accessToken } });
  }

  //Delete Patient PhysicalExamRecords Single
  deletePatientPhysicalExamRecordData(deletePatientRecord, accessToken): any {
    let access_token: any = accessToken;
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': access_token
      }),
      body: {
        "medical_record_id": deletePatientRecord.medical_record_id,
        "hospital_reg_num": deletePatientRecord.hospital_reg_num,
        "patientID": deletePatientRecord.patientID,
        "physical_exam_id": deletePatientRecord.physical_exam_id,
        "byWhom": deletePatientRecord.byWhom,
        "byWhomID": deletePatientRecord.byWhomID
      }
    }
    console.log("Delete Patien Phy exam record Data : ", options);
    return this._http.delete(this.baseURL + "/api/patient/physicalexamrecord", options);
  }
  //Delete Patient Records Single
  deletePatientRecordData(deletePatientRecord, accessToken): any {
    let access_token: any = accessToken;
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': access_token
      }),
      body: {
        "medical_personnel_id": deletePatientRecord.medical_personnel_id,
        "hospital_reg_num": deletePatientRecord.hospital_reg_num,
        "patientID": deletePatientRecord.patientID,
        //"medical_record_id": deletePatientRecord.medical_record_id
      }
    }
    console.log("Delete Patient record Data : ", options);
    return this._http.delete(this.baseURL + "/api/patient/generalinfo", options);
  }

  //Delete Patient Immunization Reocrd
  deletePatientImmunizationRecordData(deletePatientImmunizationRecord, accessToken): any {
    let access_token: any = accessToken;
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': access_token
      }),
      body: {
        "medical_record_id": deletePatientImmunizationRecord.medical_record_id,
        "hospital_reg_num": deletePatientImmunizationRecord.hospital_reg_num,
        "patientID": deletePatientImmunizationRecord.patientID,
        "immunization_record_id": deletePatientImmunizationRecord.immunization_record_id,
        "byWhomID": deletePatientImmunizationRecord.byWhomID,
        "byWhom": deletePatientImmunizationRecord.byWhom
      }
    }
    console.log("Delete Patien Phy exam record Data : ", options);
    return this._http.delete(this.baseURL + "/api/patient/immunization", options);
  }

  //Delete Patient Illness Info
  deletePatientIllnessRecordData(deletePatientIllRecord, accessToken): any {
    let access_token: any = accessToken;
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': access_token
      }),
      body: {
        "medical_record_id": deletePatientIllRecord.medical_record_id,
        "hospital_reg_num": deletePatientIllRecord.hospital_reg_num,
        "patientID": deletePatientIllRecord.patientID,
        "illnessID": deletePatientIllRecord.illnessID,
        "byWhom": deletePatientIllRecord.byWhom,
        "byWhomID": deletePatientIllRecord.byWhomID
      }
    }
    console.log("Delete Patien Illness Info record Data : ", options);
    return this._http.delete(this.baseURL + "/api/patient/medicalrecord/illness", options);
  }

  //Delete Patient Diagnostic Notes 
  deletePatientIllnessDiagnosticData(deletePatientIllRecord, accessToken): any {
    let access_token: any = accessToken;
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': access_token
      }),
      body: {
        "medical_record_id": deletePatientIllRecord.medical_record_id,
        "hospital_reg_num": deletePatientIllRecord.hospital_reg_num,
        "patientID": deletePatientIllRecord.patientID,
        "illnessID": deletePatientIllRecord.illnessID,
        "byWhom": deletePatientIllRecord.byWhom,
        "byWhomID": deletePatientIllRecord.byWhomID
      }
    }
    console.log("Delete Patien Diagnostic Notes Data : ", options);
    return this._http.delete(this.baseURL + "/api/patient/medicalrecord/illness/diagnosisNotes/all", options);
  }

  //Delete Patient Medication Single
  deletePatientIllnessMedicationData(deletePatientIllRecord, accessToken): any {
    let access_token: any = accessToken;
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': access_token
      }),
      body: {
        "medical_record_id": deletePatientIllRecord.medical_record_id,
        "hospital_reg_num": deletePatientIllRecord.hospital_reg_num,
        "patientID": deletePatientIllRecord.patientID,
        "illnessID": deletePatientIllRecord.illnessID,
        "byWhom": deletePatientIllRecord.byWhom,
        "byWhomID": deletePatientIllRecord.byWhomID
      }
    }
    console.log("Delete Patien Medications Data : ", options);
    return this._http.delete(this.baseURL + "/api/patient/medicalrecord/illness/medication/all", options);
  }

  deletePatientIllnessMedicationDataSingle(deletePatientIllRecord, accessToken): any {
    let access_token: any = accessToken;
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': access_token
      }),
      body: {
        "medical_record_id": deletePatientIllRecord.medical_record_id,
        "hospital_reg_num": deletePatientIllRecord.hospital_reg_num,
        "patientID": deletePatientIllRecord.patientID,
        "illnessID": deletePatientIllRecord.illnessID,
        "byWhom": deletePatientIllRecord.byWhom,
        "byWhomID": deletePatientIllRecord.byWhomID,
        "illnessMedicationID": deletePatientIllRecord.illnessMedicationID
      }
    }
    console.log("Delete Patien Medications Data : ", options);
    return this._http.delete(this.baseURL + "/api/patient/medicalrecord/illness/medication", options);
  }

  deletePatientSurgicalRecordDataSingle(deletePatientIllRecord, accessToken): any {
    let access_token: any = accessToken;
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': access_token
      }),
      body: {
        "medical_record_id": deletePatientIllRecord.medical_record_id,
        "hospital_reg_num": deletePatientIllRecord.hospital_reg_num,
        "patientID": deletePatientIllRecord.patientID,
        "illnessID": deletePatientIllRecord.illnessID,
        "byWhom": deletePatientIllRecord.byWhom,
        "byWhomID": deletePatientIllRecord.byWhomID,
        "illnessMedicationID": deletePatientIllRecord.illnessMedicationID,
        "illnessSurgicalID": deletePatientIllRecord.illnessSurgicalID
      }
    }
    console.log("Delete Patien Medications Data : ", options);
    return this._http.delete(this.baseURL + "/api/patient/medicalrecord/illness/surgicalrecord/", options);
  }


  //Delete Patient SurgicalProcedure 
  deletePatientIllnessSurgicalProcedureData(deletePatientIllRecord, accessToken): any {
    let access_token: any = accessToken;
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': access_token
      }),
      body: {
        "medical_record_id": deletePatientIllRecord.medical_record_id,
        "hospital_reg_num": deletePatientIllRecord.hospital_reg_num,
        "patientID": deletePatientIllRecord.patientID,
        "illnessID": deletePatientIllRecord.illnessID,
        "byWhom": deletePatientIllRecord.byWhom,
        "byWhomID": deletePatientIllRecord.byWhomID
      }
    }
    console.log("Delete Patient Surgical Procedure Data : ", options);
    return this._http.delete(this.baseURL + "/api/patient/medicalrecord/illness/surgicalrecord/all", options);
  }

  //Fetch Hospital Appointments
  getHospitalAppointmentsData(fetchHospitalAppointmentsRecordsObj, accessToken): any {
    console.log("the req data for fetch hospital / admin appointments records from service : ", fetchHospitalAppointmentsRecordsObj);
    return this._http.post(this.baseURL + "/api/appointments/allappointmentsforhospital",
      fetchHospitalAppointmentsRecordsObj, { headers: { 'x-access-token': accessToken } });
  }

  //Fetch Patient Appointments Records 
  getPatientAppointmentsData(fetchPatientAppointmentsRecords, accessToken): any {
    console.log("the req data for fetch pat appointments records from service : ", fetchPatientAppointmentsRecords);
    return this._http.post(this.baseURL + "/api/appointments/allappointmentsforPatient",
      fetchPatientAppointmentsRecords, { headers: { 'x-access-token': accessToken } });
  }
  //Fetch Patient Screening Records 
  getPatientScreeningRecordsData(fetchPatientScreeningRecords, accessToken): any {
    console.log("the req data for fetch pat screening records from service : ", fetchPatientScreeningRecords);
    return this._http.post(this.baseURL + "/api/patient/medicalrecord/screeningrecord/fetchall",
      fetchPatientScreeningRecords, { headers: { 'x-access-token': accessToken } });
  }
  //Fetch Patient Screening Records 
  getPatientScreeningData(fetchPatientScreeningRecords, accessToken): any {
    console.log("the req data for fetch pat appointments records from service : ", fetchPatientScreeningRecords);
    return this._http.post(this.baseURL + "/api/patient/medicalrecord/screeningrecord/fetchall",
      fetchPatientScreeningRecords, { headers: { 'x-access-token': accessToken } });
  }

  //Fetch Patient Test Records 
  getPatientTestResultsData(fetchPatientTestResultsObj, accessToken): any {
    console.log("the req data for fetch pat test results records from service : ", fetchPatientTestResultsObj);
    return this._http.post(this.baseURL + "/api/patient/testresult/fetch",
      fetchPatientTestResultsObj, { headers: { 'x-access-token': accessToken } });
  }

  //Delete Patient PhysicalExamRecords Single
  deletePatientScreeningRecordsData(deletePatientFile, accessToken): any {
    let access_token: any = accessToken;
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': access_token
      }),
      body: {
        "medical_record_id": deletePatientFile.medical_record_id,
        "illnessScreeningID": deletePatientFile.illnessScreeningID,
        "patientID": deletePatientFile.patientID,
        "byWhom": "admin",
        "byWhomID": deletePatientFile.byWhomID,
        "hospital_reg_num": deletePatientFile.hospital_reg_num
      }
    }
    console.log("Delete Patien Screening record Data : ", options);
    return this._http.delete(this.baseURL + "/api/patient/medicalrecord/screeningrecord", options);
  }

  addPatientPhysicalExamRecordAttachmentData(addPatPhyExamAttachmentData, accessToken): any {
    return this._http.post(this.baseURL + "/api/patient/physicalexamrecord/attachment", addPatPhyExamAttachmentData, { headers: { 'x-access-token': accessToken } });

  }

  addPatientScreeningRecordsData(addPatientScreeningRecordData, accessToken): any {
    console.log("addPatientScreeningRecordData data for checking from service : ", addPatientScreeningRecordData);
    return this._http.post(this.baseURL + "/api/patient/medicalrecord/screeningrecord", addPatientScreeningRecordData, { headers: { 'x-access-token': accessToken } });
  }

  //Delete Patient PhysicalExamRecords All
  deleteAllPatientPhysicalExamRecordsData(deletePatientAllFile, accessToken): any {
    let access_token: any = accessToken;
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': access_token
      }),
      body: {
        "medical_record_id": deletePatientAllFile.medical_record_id,
        "hospital_reg_num": deletePatientAllFile.hospital_reg_num,
        "patientID": deletePatientAllFile.patientID,
        "medical_personnel_id": deletePatientAllFile.medical_personnel_id
      }
    }
    console.log("DeletePatien Physical exam records Data : ", options);
    return this._http.delete(this.baseURL + "/api/patient/physicalexamrecord/all", options);
  }

  //Delete Patient data
  deletePatientInfo(pInfo): any {
    let access_token: any = pInfo.token;
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': access_token
      }),
      body: {
        "medical_personnel_id": pInfo.medical_personnel_id,
        "hospital_reg_num": pInfo.hospital_reg_num,
        "patientID": pInfo.patientID,
      }
    }
    console.log("Delete Patien Data : ", options);
    return this._http.delete(this.baseURL + "/api/patient/generalinfo", options);
    //return this._http.delete(" /api/patient/generalinfo",op);
  }

  //Update Patient Data
  updatePatient(patientData, accessToken): any {
    return this._http.put(this.baseURL + "/api/patient/generalinfo", patientData, { headers: { 'x-access-token': accessToken } });
  }

  //Fetch Patient Ill Medication Records Data 
  fetchPatientMedicationData(fetchPatMEdicationDataObj, accessToken): any {
    return this._http.post(this.baseURL + "/api/patient/medicalrecord/illness/medication/fetchall",
      fetchPatMEdicationDataObj, { headers: { 'x-access-token': accessToken } });
  }
  // /api/patient/medicalrecord/illness/medication/fetchall

  //Fetch Patient Ill Surgical Records Data 
  fetchPatientSurgicalData(fetchPatSurgicalDataObj, accessToken): any {
    return this._http.post(this.baseURL + "/api/patient/medicalrecord/illness/surgicalrecord/fetchall",
      fetchPatSurgicalDataObj, { headers: { 'x-access-token': accessToken } });
  }
  //Fetch Patient Ill Diagnosis Records Data 
  fetchPatientDiagnosisData(fetchPatDiagnosisDataObj, accessToken): any {
    return this._http.post(this.baseURL + "/api/patient/medicalrecord/illness/diagnosisNotes/fetchall",
      fetchPatDiagnosisDataObj, { headers: { 'x-access-token': accessToken } });
  }

  //Add Patient Illness Medication Attachment Data
  addPatientMedicalHistoryIllnessMedicationAttachment(patientData, accessToken): any {
    return this._http.post(this.baseURL + "/api/patient/medicalrecord/illness/medication/attachment",
      patientData, { headers: { 'x-access-token': accessToken } });
  }

  //Add Pat Ill Surgical record data
  addPatIllSurgicalFormData(surgicalData, accessToken): any {
    return this._http.post(this.baseURL + "/api/patient/medicalrecord/illness/surgicalrecord",
      surgicalData, { headers: { 'x-access-token': accessToken } });
  }

  //Update Patient Illness Medication Attachment Data
  editPatientMedicalHistoryIllnessMedicationAttachment(patientData, accessToken): any {
    return this._http.post(this.baseURL + "/api/patient/medicalrecord/illness/medication/attachment",
      patientData, { headers: { 'x-access-token': accessToken } });
  }

  //Add Admin General User
  addAdminGenUser(addAdminGenData, accessToken): any {
    return this._http.post(this.baseURL + "/api/hospital/admingeneraluser", addAdminGenData, { headers: { 'x-access-token': accessToken } });
  }

  //Add Patient Gen info
  addPatientGenInfo(addPatGenInfoData, accessToken): any {
    return this._http.post(this.baseURL + "/api/patient/generalinfo", addPatGenInfoData, { headers: { 'x-access-token': accessToken } });
  }

  //Update Admin General User
  updateAdminGenUser(updateAdminGenData, accessToken): any {
    console.log("admin gen user data for checking from service : ", updateAdminGenData);
    return this._http.post(this.baseURL + "/api/hospital/updateadmin", updateAdminGenData, { headers: { 'x-access-token': accessToken } });
  }

  //Update Hospital-Info / Admin Data
  updateAdmin(adminData, accessToken): any {
    console.log("admin data for checking", adminData);
    console.log("Checking", adminData)
    return this._http.post(this.baseURL + "/api/hospital/update", adminData, { headers: { 'x-access-token': accessToken } });
  }

  //Delete Admin General User
  deleteAdminGenUser(deleteAdminGenData, accessToken): any {
    console.log("admin gen user data for delete from service : ", deleteAdminGenData);
    const needToDelete = {
      "adminManagerUserID": deleteAdminGenData.adminManagerUserID,
      "adminUserIDToDelete": deleteAdminGenData.adminUserIDToDelete
    }
    console.log("admin gen user data for delete before sending to api req from service : ", needToDelete);
    return this._http.post(this.baseURL + "/api/hospital/deleteadmin", needToDelete, { headers: { 'x-access-token': accessToken } });

  }

  //Get Patient Medical Records Data
  getPatientMedicalRecordsData(pDataForMedicalRecords, accessToken): any {
    return this._http.post(this.baseURL + "/api/patient/medicalrecord/fetch", pDataForMedicalRecords, { headers: { 'x-access-token': accessToken } });
  }

  //Get Admin/Hospital Appointment  Data
  getAdminAppointmentData(fetchAppointmentData, accessToken): any {
    return this._http.post(this.baseURL + "/api/appointments/allappointmentsforhospital", fetchAppointmentData, { headers: { 'x-access-token': accessToken } });
  }
  // /api/appointments/getappointmentbyid

  fetchAppointmentData(fetchAppointmentData): any {
    return this._http.post(this.baseURL + "/api/appointments/getappointmentbyid", fetchAppointmentData);
  }

  //Cancel Appointment
  cancelAppointment(reqDataForCancelAppointment, accessToken): any {
    return this._http.post(this.baseURL + "/api/appointments/cancelappointment", reqDataForCancelAppointment, { headers: { 'x-access-token': accessToken } });
  }
  //Update Accept Appointment Status 
  updateAppointmentAcceptStatus(reqData, accessToken): any {
    return this._http.post(this.baseURL + "/api/appointments/updateappointmentstatus", reqData, { headers: { 'x-access-token': accessToken } });
  }
  //Reschedule Appointment
  rescheduleAppointment(reqDataForRescheduleAppointment, accessToken): any {
    return this._http.post(this.baseURL + "/api/appointments/appointmentreschedule", reqDataForRescheduleAppointment, { headers: { 'x-access-token': accessToken } });
  }

  //Book Appointment
  bookAppointmentService(reqDataForBookAppointment, accessToken): any {
    return this._http.post(this.baseURL + "/api/appointments/bookappointment", reqDataForBookAppointment, { headers: { 'x-access-token': accessToken } })
  }

  //Add Invoice
  addInvoiceData(addInvoiceDataObj, accessToken): any {
    console.log("the req data to add Invoice Data from service : ", addInvoiceDataObj);
    return this._http.post(this.baseURL + "/api/invoice",
      addInvoiceDataObj, { headers: { 'x-access-token': accessToken } });
  }
  //Add Invoice
  updateInvoiceData(updateInvoiceDataObj, accessToken): any {
    console.log("the req data to update Invoice Data from service : ", updateInvoiceDataObj);
    return this._http.put(this.baseURL + "/api/invoice",
      updateInvoiceDataObj, { headers: { 'x-access-token': accessToken } });
  }
  //Fetch Invoice
  fetchInvoicesData(fetchInvoicesDataObj, accessToken): any {
    console.log("the req data to fetch Invoices Data from service : ", fetchInvoicesDataObj);
    return this._http.post(this.baseURL + "/api/invoice/byhospitalid",
      fetchInvoicesDataObj, { headers: { 'x-access-token': accessToken } });
  }
  //Delete Patient data
  deleteInvoicesData(deleteInvoicesDataObj, accessToken): any {
    let access_token: any = accessToken;
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': access_token
      }),
      body: {
        "byWhom": deleteInvoicesDataObj.byWhom,
        "byWhomID": deleteInvoicesDataObj.byWhomID,
        "hospital_reg_num": deleteInvoicesDataObj.hospital_reg_num,
        "invoiceNumber": deleteInvoicesDataObj.invoiceNumber
      }
    }
    console.log("Delete Invoice Data : ", options);
    return this._http.delete(this.baseURL + "/api/invoice/byinvoiceid", options);
  }

  //Send Invoice
  sendInvoiceData(sendInvoiceDataObj, accessToken): any {
    console.log("the req data to send Invoices Data from service : ", sendInvoiceDataObj);
    return this._http.post(this.baseURL + "/api/invoice/sendtoclient",
      sendInvoiceDataObj, { headers: { 'x-access-token': accessToken } });
  }

  //Send Reminder Invoice
  sendReminderInvoiceData(sendReminderInvoiceDataObj, accessToken): any {
    console.log("the req data to send reminder Invoices Data from service : ", sendReminderInvoiceDataObj);
    return this._http.post(this.baseURL + "/api/invoice/remindtoclient",
      sendReminderInvoiceDataObj, { headers: { 'x-access-token': accessToken } });
  }
}
