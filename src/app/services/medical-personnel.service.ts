import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MedicalPersonnelService {
  signInRes: any;
  signObj: any;
  baseURL: string = "http://34.231.177.197:3000";
  res: any;
  accessToken: string;
  id: string = "";
  pMedPersonID: string = "";
  previewImg: any;

  constructor(private _http: HttpClient) { }

  //MedicalPersonnel  Register/SignUp
  medicalPersonnelRegister(data): any {
    console.log("req data to rega as a Doctor from service : ", data);
    return this._http.post(this.baseURL + "/api/medicalpersonnel/register", data)
  }

  //MedicalPErsonnel Login
  medicalPersonnelLogin(data): any {
    return this._http.post(this.baseURL + "/api/medicalpersonnel/login", data);
  }

  //Fetch MEdicalPersonnel Appointments
  getAppointmentsData(fetchAppointmentsRecordsObj, accessToken): any {
    console.log("the req data for fetch medical-personnel appointments records from service : ", fetchAppointmentsRecordsObj);
    return this._http.post(this.baseURL + "/api/appointments/allappointmentsforcreator",
      fetchAppointmentsRecordsObj, { headers: { 'x-access-token': accessToken } });
  }

  //Update MedicalPersonnel Data
  updateMedicalPersonnelApiCall(updateData, accessToken): any {
    console.log("update MedicalPerson data for checking from service : ", updateData);
    return this._http.post(this.baseURL + "/api/medicalpersonnel/update", updateData, { headers: { 'x-access-token': accessToken } });
  }

  //Update Clinical Services API
  updateMedicalPersonnelClinicalServiceApiCall(reqData, accessToken): any {
    return this._http.post(this.baseURL + "/api/medicalpersonnel/updateclinicalservices", reqData, { headers: { 'x-access-token': accessToken } });
  }

  //Update Office Hours
  updateOfficeHoursApiCall(reqOfcHoursData, accessToken): any {
    return this._http.post(this.baseURL + "/api/medicalpersonnel/updateofficehours", reqOfcHoursData, { headers: { 'x-access-token': accessToken } });
  }
  //Change Password
  changePassword(data): any {
    return this._http.post(this.baseURL + "/api/medicalpersonnel/changepassword", data);
  }

  //Add Patient Medical Record Illness
  addPatientMedicalRecordIllnessData(addPatMedicalRecordIllnessData, accessToken): any {
    return this._http.post(this.baseURL + "/api/patient/medicalrecord/illness",
      addPatMedicalRecordIllnessData, { headers: { 'x-access-token': accessToken } });
  }
  //Add Patient Ill Diagnosis Data
  addPatientIllnessDiagnosisData(addPatIllDiagnosisData, accessToken): any {
    return this._http.post(this.baseURL + "/api/patient/medicalrecord/illness/diagnosisNotes/",
      addPatIllDiagnosisData, { headers: { 'x-access-token': accessToken } });
  }
  //Add Patient Medication
  addPatientIllnessMedicationManualData(addPatientMedicationManualData, accessToken): any {
    console.log("the req data for add pat fam history from service : ", addPatientMedicationManualData);
    return this._http.post(this.baseURL + "/api/patient/medicalrecord/illness/medication/manually",
      addPatientMedicationManualData, { headers: { 'x-access-token': accessToken } });
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

  //Fetch test records
  fetchDoctorTestRecordsAPICall(data, accessToken): any {
    return this._http.post(this.baseURL + "/api/patient/testresult/fetchtestresults", data
      , { headers: { 'x-access-token': accessToken } });
  }
  //Comment given by Doctor on test record
  commentDoctorTestRecordsAPICall(data, accessToken): any {
    return this._http.post(this.baseURL + "/api/patient/testresult/addcomment", data
      , { headers: { 'x-access-token': accessToken } });
  }
  //Delete test record
  deleteDoctorTestRecordsAPICall(data, accessToken): any {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'x-access-token': accessToken
      }),
      body: {
        "hospital_reg_num": data.hospital_reg_num,
        "byWhom": data.byWhom,
        "byWhomID": data.byWhomID,
        "patientID": data.patientID,
        "testReportNumber": data.testReportNumber,
        "medical_record_id": data.medical_record_id
      }
    }
    return this._http.delete(this.baseURL + "/api/patient/testresult/one", options);
  }


  //Fetch test items
  fetchTestItemsAPICall(data, accessToken): any {
    return this._http.post(this.baseURL + "/api/testitems/fetch", data
      , { headers: { 'x-access-token': accessToken } });
  }

  //Fetch Medical Personnel Devices
  fetchMedicalPersonDevicesApiCall(data, accessToken): any {
    return this._http.post(this.baseURL + "/api/medical_personnel_devices/fetchall", data, { headers: { 'x-access-token': accessToken } })
  }

}
