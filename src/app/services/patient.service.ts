import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  baseURL: string = "http://34.231.177.197:3000";
  signInRes: any;
  res: any;
  accessToken: string;
  public isEditable: BehaviorSubject<boolean> = new BehaviorSubject(false)
  constructor(private _http: HttpClient) { }

  //Get  Patients data
  getPatientData(data): any {
    let access_token: any = data.token;
    const options = {
      "byWhom": data.byWhom,
      "byWhomID": data.byWhomID,
      "category": data.category,
      "hospital_reg_num": data.hospital_reg_num,
    }
    console.log("Req For Fetch All Patient for hospital from Patient Service : ", options)
    return this._http.post(this.baseURL + "/api/hospital/getpatients", options, { headers: { 'x-access-token': access_token } });
  }

  //Fetch Patient Family History
  fetchPatientFamilyHistory(fetchPatientFamilyHistory, accessToken): any {
    console.log("Req For Fetch Patient Family History from Patient Service : ", fetchPatientFamilyHistory);

    return this._http.post(this.baseURL + "/api/patient/familyhistory/fetch", fetchPatientFamilyHistory, { headers: { 'x-access-token': accessToken } });
  }

  //Fetch Patient Immunization Record
  fetchImmunizationRecord(fetchImmunizationRecordData, accessToken): any {
    return this._http.post(this.baseURL + "/api/patient/immunization/fetch", fetchImmunizationRecordData, { headers: { 'x-access-token': accessToken } });
  }

  //Update Patient
  updatePatientFamilyHistory(updateRelation, accessToken): any {
    return this._http.put(this.baseURL + "/api/patient/familyhistory", updateRelation, { headers: { 'x-access-token': accessToken } });
  }

  //
  fetchPatientPhysicalExamRecordsData(fetchPatientPhysicalReocrds, accessToken): any {
    return this._http.post(this.baseURL + "/api/patient/physicalexamrecord/fetch", fetchPatientPhysicalReocrds, { headers: { 'x-access-token': accessToken } });
  }

  //
  fetchPatientMedicalRecordsData(fetchPatientMedicalReocrds, accessToken): any {
    return this._http.post(this.baseURL + "/api/patient/medicalrecord/illness/fetchall", fetchPatientMedicalReocrds, { headers: { 'x-access-token': accessToken } });
  }




}
