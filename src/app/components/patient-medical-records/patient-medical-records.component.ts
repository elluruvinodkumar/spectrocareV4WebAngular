import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { LoginService } from 'src/app/services/login.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { HttpErrorResponse } from '@angular/common/http';

import { from } from 'rxjs';
import { PatientProfileComponent } from '../patient-profile/patient-profile.component';

import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { AmazingTimePickerService } from 'amazing-time-picker';
import { log } from 'console';

interface SearchByValue {
  viewValue: string;
}

@Component({
  selector: 'app-patient-medical-records',
  templateUrl: './patient-medical-records.component.html',
  styleUrls: ['./patient-medical-records.component.css']
})

export class PatientMedicalRecordsComponent implements OnInit {
  presentDate: string;
  basicExamForm: FormGroup;
  basicExamEditForm: FormGroup;
  systemExamForm: FormGroup;
  addPatientPhysicalExamFileForm: FormGroup;
  editPatientPhysicalExamFileForm: FormGroup;
  belowForm: FormGroup;
  belowEditForm: FormGroup;
  addPatImmunizationForm: FormGroup;
  editPatImmunizationForm: FormGroup;
  addPatIllnessForm: FormGroup;
  addPatIllnessDiagnosisForm: FormGroup;
  editPatIllnessDiagnosisForm: FormGroup;
  addPatIllnessSurgicalForm: FormGroup;
  addPatIllnessSurgicalFormDirect: FormGroup;
  editPatIllnessSurgicalForm: FormGroup;
  editPatIllnessSurgicalFormDirect: FormGroup;
  addPatientMedHistoryFileForm: FormGroup;
  addPatientMedHistoryFileFormDirect: FormGroup;
  editPatientMedHistoryFileForm: FormGroup;
  editPatientMedHistoryFileFormDirect: FormGroup;
  editPatIllnessForm: FormGroup;
  addPatIllMedicationManuallyForm: FormGroup;
  addPatIllMedicationManuallyFormDirectly: FormGroup;
  editPatIllMedicationManuallyForm: FormGroup;
  editPatIllMedicationManuallyFormDirect: FormGroup;
  viewPatDiagnosticForm: FormGroup;
  viewPatSurgicalForm: FormGroup;
  viewPatMedicationForm: FormGroup;
  selectedPatSystemExamData: any = [];
  medicalPersonnels: any = [];
  filteredMedicalPersonnels: any = [];
  medicalPersonnelObj: any;
  selectedPatManualData: any;
  HaveBodyIndex: boolean = false;
  haveBodyIndexData: boolean = false;
  previewImg: any;
  loading: boolean;
  isLoading: boolean = false;
  isNoFile: boolean = false;
  closeResult: string;
  term: any;
  selected = 'All';
  signInRes: any;
  signObj: any;
  id: string;
  gender: string;
  age: number;
  pMedPersonID: string;
  token: string;
  searchTable: string;
  selectedPatientData: any;
  fetchPatientPhysicalExamObj: any;
  fetchPatientImmunizationObj: any;
  fetchPatientMedicationsObj: any;
  fetchPatientMedicalRecordIllnessObj: any;
  patientPhysicalExamRecords: any;
  addPatientPhysicalExamManullyObj: any;
  updatePatientPhysicalExamManullyObj: any;
  deletePatientImmunizationRecordObj: any;
  addImmunizationDataObj: any;
  addPatIllnessDiagnosisDataObj: any;
  editPatIllnessDiagnosisDataObj: any;
  deletePatientPhyExamRecordObj: any;
  deletePatientIllnessObj: any;
  addPatMedicalRecordIllnessObj: any;
  addPatientIllnessMedicationObj: any;
  illnessMedicationID: any;
  editPatientIllnessMedicationObj: any;
  editPatIllnessObj: any;
  medicinesData: any = [];
  fetchedmedicinesData: any = [];
  fetchedmedicinesDataDirect: any = [];
  searchByValue: SearchByValue[] = [
    { viewValue: 'All' },
    { viewValue: 'Physical Examination' },
    { viewValue: 'Medical History' },
    { viewValue: 'Medications' },
    { viewValue: 'Surgery Procedures' },
    { viewValue: 'Immunizations' }
  ];

  illnessDiagnosticNotes: any;
  illnessMedications: any;
  illnessSurgicalProcedures: any;
  illnessSurgicalAttachments: any;
  illnessSurgicalAttachmentsDirect: any;
  selectedRow: any;
  fetchPatIllMedicationDataObj: any;
  illnessMedicationRecordsData: any = [];
  illnessSurgicalRecordsData: any = [];
  illnessDiagnosisRecordsData: any = [];
  fetchedPatPhyExamAttachments: any;
  medicationAttachmentData: any = [];
  medicationAttachmentDataDirect: any = [];
  data: any;
  dateToShow: any;
  dateToShow2: any;
  createdIllnessID: any;

  isViewPhysicalExamination: boolean = false;
  isViewMedicalHistory: boolean = false;
  isViewMedications: boolean = false;
  isViewSurgicalProcedures: boolean = false;
  isViewImmunizations: boolean = false;

  viewBasicEx: boolean = false;
  viewSystemEx: boolean = false;

  viewManualInputView: boolean = false;
  viewAttachmentView: boolean = false;
  viewPatientIllness: boolean = true;
  viewPatientDiagnostic: boolean = true;
  viewPatientMedications: boolean = true;
  viewPatientSurgical: boolean = true;

  viewManualInputView2: boolean = false;
  viewAttachmentView2: boolean = false;
  viewManualInputView3: boolean = false;
  viewAttachmentView3: boolean = false;
  viewPatientIllness2: boolean = true;
  viewPatientDiagnostic2: boolean = true;
  viewPatientMedications2: boolean = true;
  viewPatientSurgical2: boolean = true;
  hideOnBasicExam: boolean = false;
  file: any;
  fileName: any;
  fileSize: any;
  fileValue: any;
  addedFilesArray: any = [];
  color: string;
  color1: string;
  color2: string;
  color3: string;
  textColor: string;
  textColor1: string;
  textColor2: string;
  textColor3: string;
  isValue: any;
  immunizations: any;
  fetchedMedications: any;
  fetchPatientSurgicalRecordsObj: any;
  fetchPatientSurgicalRecordsData: any;
  addPatientIllnessMedicationObjDirect: any;
  PhysicalExamination: any;
  physicalExamination: any = [
    { "Date": "2020/01/02", "Doctor": "Dr.Raman", "Creator": "Babu" },
    { "Date": "2020/01/02", "Doctor": "Dr.Raman", "Creator": "Babu" },
    { "Date": "2020/01/02", "Doctor": "Dr.Raman", "Creator": "Babu" },
    { "Date": "2020/01/02", "Doctor": "Dr.Raman", "Creator": "Babu" }
  ];

  PhysicalExaminationData: any;
  physicalExaminationData: any = [
    {
      "category": "General Appearance",
      "description": "",
      "result": "Normal"
    },
    {
      "category": "Vital Signs",
      "description": "",
      "result": "Normal"
    },
    {
      "category": "Head",
      "description": "",
      "result": "Normal"
    },
    {
      "category": "Heent",
      "description": "",
      "result": "Normal"
    },
    {
      "category": "Neck",
      "description": "",
      "result": "Normal"
    },
    {
      "category": "Chest and Lungs",
      "description": "",
      "result": "Normal"
    },
    {
      "category": "Cardiovascular",
      "description": "",
      "result": "Normal"
    },
    {
      "category": "Abdomen",
      "description": "",
      "result": "Normal"
    },
    {
      "category": "Genitourinary",
      "description": "",
      "result": "Normal"
    },
    {
      "category": "Rectal",
      "description": "",
      "result": "Normal"
    },
    {
      "category": "Musculoskeletal",
      "description": "",
      "result": "Normal"
    },
    {
      "category": "Lymph Nodes",
      "description": "",
      "result": "Normal"
    },
    {
      "category": "Extremities/Skin",
      "description": "",
      "result": "Normal"
    },
    {
      "category": "Neurological",
      "description": "",
      "result": "Normal"
    }
  ]

  MedicalHistory: any;

  Medications: any;
  medications: any = [
    { "Date": "2020/01/02", "Medication": "Thyroxin", "Dosage": "100ml", "Frequency": "Daily", "Instructions": "Daily morning" },
    { "Date": "2020/01/02", "Medication": "Thyroxin", "Dosage": "100ml", "Frequency": "Daily", "Instructions": "Daily morning" },
    { "Date": "2020/01/02", "Medication": "Thyroxin", "Dosage": "100ml", "Frequency": "Daily", "Instructions": "Daily morning" },
    { "Date": "2020/01/02", "Medication": "Thyroxin", "Dosage": "100ml", "Frequency": "Daily", "Instructions": "Daily morning" },
  ];
  SurgeryProcedures: any;
  surgeryProcedures: any = [
    { "Date": "2020/01/02", "SurgeryName": "Skin replanatation", "Doctor": "Babu", "MoreInfo": "" },
    { "Date": "2020/01/02", "SurgeryName": "Skin replanatation", "Doctor": "Babu", "MoreInfo": "" },
    { "Date": "2020/01/02", "SurgeryName": "Skin replanatation", "Doctor": "Babu", "MoreInfo": "" },
    { "Date": "2020/01/02", "SurgeryName": "Skin replanatation", "Doctor": "Babu", "MoreInfo": "" }
  ];
  Immunizations: any;
  listOfImmunizations = [
    { value: 'Fever' },
    { value: 'Headache' },
    { value: 'Skin Allergy' },
    { value: 'Stomuch Pain' },
    { value: 'Teeth Effect' },
    { value: 'Dust Allergy' },
    { value: 'Knee Pain' }
  ];
  listOfIllnessConditions = [
    { value: 'Appointment Booked' },
    { value: 'In treatment' }
  ];
  havingData: string;
  classes = [{
    havingData: ''
  }]
  availableIllnessIDs: any = [];
  arrayData: any = [];
  @ViewChild('fileInput', { static: true }) el: ElementRef;
  constructor(private loginService: LoginService, private modalService: NgbModal,
    private patProComponent: PatientProfileComponent, private fb: FormBuilder,
    private _snackBar: MatSnackBar, private atp: AmazingTimePickerService,
  ) { }

  //private atp: AmazingTimePickerService,

  ngOnInit() {
    this.presentDate = new Date().toLocaleDateString();
    this.loading = true;
    this.signInRes = localStorage.getItem("SignInRes");
    this.signObj = JSON.parse(this.signInRes);
    this.selectedPatientData = this.patProComponent.selectedPatient;
    this.gender = this.selectedPatientData.gender;
    this.age = this.selectedPatientData.age;
    console.log("the patient gender & age : ", this.gender, this.age);

    this.Medications = this.medications;
    this.SurgeryProcedures = this.surgeryProcedures;
    this.PhysicalExaminationData = this.physicalExaminationData;

    this.showData;

    this.fetchPatientPhysicalExamRecords();
    this.fetchPatientImmunizationRecords();
    this.fetchPatientMedicalRecordIllness();
    this.fetchPatientMedicationRecords();
    this.fetchPatientSurgicalRecords();
    this.basicExamForm = this.fb.group({
      height: [""],
      bmi: [""],
      weight: [""],
      bmr: [""],
      waistline: [""],
      bloodPressure: [""],
      //heartPulse:[""]
    });

    this.basicExamEditForm = this.fb.group({
      height: [""],
      bmi: [""],
      weight: [""],
      bmr: [""],
      waistline: [""],
      bloodPressure: [""],
      //heartPulse:[""]
    })

    this.belowForm = this.fb.group({
      other: [""],
      physicianCommentsOrRecomdations: [""]
    })

    this.belowEditForm = this.fb.group({
      other: [""],
      physicianCommentsOrRecomdations: [""]
    })

    this.systemExamForm = this.fb.group({
    })

    this.addPatientPhysicalExamFileForm = this.fb.group({
      medical_personnel_id: [""],
      patientID: [""],
      hospital_reg_num: [""],
      medical_record_id: [""],
      profilePic: [""]
    })

    this.editPatientPhysicalExamFileForm = this.fb.group({
      //medical_personnel_id: [""],
      //patientID: [""],
      //hospital_reg_num: [""],
      //medical_record_id: [""],
      //profilePic: [""]
    })

    this.addPatImmunizationForm = this.fb.group({
      appointmentTime: [""],
      immunizationName: [""],
      immunizationName1: [""],
      immunizationDate: [""],
      notes: [""],
      byWhom: [""],
      byWhomID: [""],
      doctorMPID: [""],
      doctorName: [""]
    })

    this.editPatImmunizationForm = this.fb.group({
      appointmentTime: [""],
      immunizationName: [""],
      immunizationName1: [""],
      immunizationDate: [""],
      notes: [""],
      byWhom: [""],
      byWhomID: [""],
      doctorMPID: [""],
      doctorName: [""],
      immunization_record_id: [""]
    })

    this.addPatIllnessForm = this.fb.group({
      illnessCondition: [""],
      symptoms: [""],
      currentStatus: [""],
      description: [""],
      isCurrentIllness: [""],
      startDate: [""],
      endDate: [""]
    })

    this.editPatIllnessForm = this.fb.group({
      illnessCondition: [""],
      symptoms: [""],
      currentStatus: [""],
      description: [""],
      isCurrentIllness: [""],
      startDate: [""],
      endDate: [""]
    })

    this.addPatIllnessDiagnosisForm = this.fb.group({
      diagnosisDate: [""],
      diagnosis: [""],
      prescription: [""],
      remark: [""],
      byWhom: [""],
      byWhomID: [""],
      doctorMedicalPersonnelID: [""],
      doctorName: [""]
    })

    this.editPatIllnessDiagnosisForm = this.fb.group({
      diagnosisDate: [""],
      doctorName: [""],
      diagnosis: [""],
      prescription: [""],
      remark: [""],
      byWhom: [""],
      byWhomID: [""],
      doctorMedicalPersonnelID: [""]
    })

    this.addPatIllnessSurgicalForm = this.fb.group({
      surgeryDate: [""],
      surgeryProcedure: [""],
      surgeryInformation: [""],
      profilePic: [""],
      moreDetails: [""],
      doctorMedicalPersonnelID: [""],
      doctorName: [""]
    })
    this.addPatIllnessSurgicalFormDirect = this.fb.group({
      surgeryDate: [""],
      surgeryProcedure: [""],
      surgeryInformation: [""],
      profilePic: [""],
      moreDetails: [""],
      doctorMedicalPersonnelID: [""],
      doctorName: [""],
      illnessID: [""]
    })

    this.editPatIllnessSurgicalForm = this.fb.group({
      lastUpdateDate: [""],
      time: [""],
      doctorName: [""],
      surgeryProcedure: [""],
      surgeryInformation: [""],
      profilePic: [""],
      doctorMedicalPersonnelID: [""]
    })
    this.editPatIllnessSurgicalFormDirect = this.fb.group({
      lastUpdateDate: [""],
      time: [""],
      doctorName: [""],
      surgeryProcedure: [""],
      surgeryInformation: [""],
      moreDetails: [""],
      profilePic: [""],
      doctorMedicalPersonnelID: [""]
    })

    this.addPatientMedHistoryFileForm = this.fb.group({
      profilePic: [""],
      prescription1MoreDetails: [""]
    })
    this.addPatientMedHistoryFileFormDirect = this.fb.group({
      profilePic: [""],
      prescription1MoreDetails: [""]
    })

    this.editPatientMedHistoryFileForm = this.fb.group({
      profilePic: [""],
      prescription1MoreDetails: [""]
    })
    this.editPatientMedHistoryFileFormDirect = this.fb.group({
      profilePic: [""],
      prescription1MoreDetails: [""]
    })

    this.addPatIllMedicationManuallyForm = this.fb.group({
      addMedicationArray: this.fb.array([

      ]),
      doctorMedicalPersonnelID: [""],
      doctorName: [""],
      illnessID: [""]
    });
    this.addPatIllMedicationManuallyFormDirectly = this.fb.group({
      addMedicationArrayDirect: this.fb.array([

      ]),
      doctorMedicalPersonnelID: [""],
      doctorName: [""],
      illnessID: [""]
    });


    this.editPatIllMedicationManuallyForm = this.fb.group({
      editMedicationArray: this.fb.array([

      ]),
      instructions: [""]
    });
    this.editPatIllMedicationManuallyFormDirect = this.fb.group({
      editMedicationArrayDirect: this.fb.array([

      ]),
      instructions: [""]
    });

    this.editPatientMedHistoryFileForm = this.fb.group({
      profilePic: [""],
      prescription1MoreDetails: [""]
    });

    this.viewPatDiagnosticForm = this.fb.group({
      "diagnosisDate": [""],
      "doctorName": [""],
      "diagnosis": [""],
      "prescription": [""],
      "remark": [""]
    })

    this.viewPatSurgicalForm = this.fb.group({
      "lastUpdateDate": [""],
      "time": [""],
      "doctorName": [""],
      "surgeryProcedure": [""],
      "moreInfo": [""]
    });

    this.viewPatMedicationForm = this.fb.group({
      "medicationDate": [""],
      "instructions": [""]
    })

    this.addMedicationToList();
    this.addMedicationToListDirect();
    //this.editMedicationToList();

    let medicalObj = {
      "userID": this.signObj.hospitalAdmin.userID,
      "category": "All",
      "hospital_reg_num": this.signObj.hospitalAdmin.hospital_reg_num,
      "token": this.signObj.access_token
    }
    this.getDoctorData(medicalObj);
  }

  getDoctorData(medicalObj) {
    this.loginService.getMedicalPatientData(medicalObj).subscribe(
      (res) => {
        if (res.response === 3) {
          this.medicalPersonnels = res.medicalPersonnels;
          this.filteredMedicalPersonnels = res.medicalPersonnels;
          console.log("list of doctors : ", this.medicalPersonnels);
        }
        else {
          //alert(res.message);
          this.openSnackBar(res.message, "");
        }
      },
      (err: HttpErrorResponse) => {
        if (err.error instanceof Error) {
          console.log("Client Side Error")
        } else {
          console.log(err)
        }
      })
  }

  selectDoctorFromList(value: any) {
    console.log(value);
    let index = -1
    index = this.medicalPersonnels.findIndex(val => {
      return val.profile.userProfile.medical_personnel_id === value.profile.userProfile.medical_personnel_id
    })
    if (index != -1) {
      this.medicalPersonnelObj = this.medicalPersonnels[index]
      console.log("medicalPersonnelObj obj", this.medicalPersonnelObj)
      this.addPatImmunizationForm.patchValue({
        doctorName: this.medicalPersonnelObj.profile.userProfile.firstName + " " + this.medicalPersonnelObj.profile.userProfile.lastName,
        doctorMPID: this.medicalPersonnelObj.profile.userProfile.emailID,
        byWhomID: this.signObj.hospitalAdmin.userID,
        byWhom: "admin"
      })
      this.editPatImmunizationForm.patchValue({
        doctorName: this.medicalPersonnelObj.profile.userProfile.firstName + " " + this.medicalPersonnelObj.profile.userProfile.lastName,
        doctorMPID: this.medicalPersonnelObj.profile.userProfile.emailID,
        byWhomID: this.signObj.hospitalAdmin.userID,
        byWhom: "admin"
      })
      this.addPatIllnessDiagnosisForm.patchValue({
        doctorName: this.medicalPersonnelObj.profile.userProfile.firstName + " " + this.medicalPersonnelObj.profile.userProfile.lastName,
        doctorMedicalPersonnelID: this.medicalPersonnelObj.profile.userProfile.emailID,
        byWhomID: this.signObj.hospitalAdmin.userID,
        byWhom: "admin"
      })
      this.addPatIllnessSurgicalForm.patchValue({
        doctorName: this.medicalPersonnelObj.profile.userProfile.firstName + " " + this.medicalPersonnelObj.profile.userProfile.lastName,
        doctorMedicalPersonnelID: this.medicalPersonnelObj.profile.userProfile.medical_personnel_id,
      })
      this.addPatIllnessSurgicalFormDirect.patchValue({
        doctorName: this.medicalPersonnelObj.profile.userProfile.firstName + " " + this.medicalPersonnelObj.profile.userProfile.lastName,
        doctorMedicalPersonnelID: this.medicalPersonnelObj.profile.userProfile.medical_personnel_id,
      })
      this.editPatIllnessDiagnosisForm.patchValue({
        doctorName: this.medicalPersonnelObj.profile.userProfile.firstName + " " + this.medicalPersonnelObj.profile.userProfile.lastName,
        doctorMedicalPersonnelID: this.medicalPersonnelObj.profile.userProfile.emailID,
        // byWhomID: this.signObj.hospitalAdmin.userID,
        // byWhom: "admin"
      })
      this.editPatIllnessSurgicalForm.patchValue({
        doctorName: this.medicalPersonnelObj.profile.userProfile.firstName + " " + this.medicalPersonnelObj.profile.userProfile.lastName,
        doctorMedicalPersonnelID: this.medicalPersonnelObj.profile.userProfile.medical_personnel_id,
      })
      this.editPatIllnessSurgicalFormDirect.patchValue({
        doctorName: this.medicalPersonnelObj.profile.userProfile.firstName + " " + this.medicalPersonnelObj.profile.userProfile.lastName,
        doctorMedicalPersonnelID: this.medicalPersonnelObj.profile.userProfile.medical_personnel_id,
      })
      this.addPatIllMedicationManuallyForm.patchValue({
        doctorName: this.medicalPersonnelObj.profile.userProfile.firstName + " " + this.medicalPersonnelObj.profile.userProfile.lastName,
        doctorMedicalPersonnelID: this.medicalPersonnelObj.profile.userProfile.medical_personnel_id,
      })
      this.addPatIllMedicationManuallyFormDirectly.patchValue({
        doctorName: this.medicalPersonnelObj.profile.userProfile.firstName + " " + this.medicalPersonnelObj.profile.userProfile.lastName,
        doctorMedicalPersonnelID: this.medicalPersonnelObj.profile.userProfile.medical_personnel_id,
      })
      //this.modalService.close();
      //this.modalService.dismissAll()
    }
  }

  searchDoctor(term: string) {
    if (!term) {
      this.filteredMedicalPersonnels = this.medicalPersonnels;
    } else {
      this.filteredMedicalPersonnels = this.medicalPersonnels.filter(x =>
        x.profile.userProfile.firstName.trim().toLowerCase().includes(term.trim().toLowerCase())
      );
    }
  }

  //get medications
  get addmedicationsObj() {
    return <FormArray>this.addPatIllMedicationManuallyForm.get('addMedicationArray')
  }
  get editmedicationsObj() {
    return <FormArray>this.editPatIllMedicationManuallyForm.get('editMedicationArray')
  }
  //get medications
  get addmedicationsObjDirect() {
    return <FormArray>this.addPatIllMedicationManuallyFormDirectly.get('addMedicationArrayDirect')
  }
  get editmedicationsObjDirect() {
    return <FormArray>this.editPatIllMedicationManuallyFormDirect.get('editMedicationArrayDirect')
  }
  // get editmedicationsObjDirect() {
  //   return <FormArray>this.editPatIllMedicationManuallyForm.get('editMedicationArray')
  // }

  //Add medication to list
  addMedicationToList() {
    this.addmedicationsObj.push(this.fb.group({
      name: [""],
      dosage: [""],
      freq: [""]
    }))
  }
  addMedicationToListDirect() {
    this.addmedicationsObjDirect.push(this.fb.group({
      name: [""],
      dosage: [""],
      freq: [""]
    }))
  }
  editMedicationToList() {
    this.editmedicationsObj.push(this.fb.group({
      name: [""],
      dosage: [""],
      freq: [""]
    }))
  }
  editMedicationToListDirect() {
    this.editmedicationsObjDirect.push(this.fb.group({
      name: [""],
      dosage: [""],
      freq: [""]
    }))
  }

  //Remove medication from list
  removeAddMedication(index) {
    this.addmedicationsObj.removeAt(index)
  }
  removeAddMedicationDirect(index) {
    this.addmedicationsObjDirect.removeAt(index)
  }
  removeEditMedication(index) {
    this.editmedicationsObj.removeAt(index)
  }
  removeEditMedicationDirect(index) {
    this.editmedicationsObjDirect.removeAt(index)
  }

  //Patch Medication
  patchPatientEditMedication(editmedicationData) {
    for (let i: number = 0; i <= editmedicationData.length - 1; i++) {
      this.addmedicationsObj.push(
        this.fb.group({
          name: editmedicationData[i].name,
          dosage: editmedicationData[i].dosage,
          freq: editmedicationData[i].freq
        })
      )
    }
  }
  patchPatientUpdateEditMedication(editupdatemedicationData) {
    for (let i: number = 0; i <= editupdatemedicationData.length - 1; i++) {
      this.editmedicationsObj.push(
        this.fb.group({
          name: editupdatemedicationData[i].name,
          dosage: editupdatemedicationData[i].dosage,
          freq: editupdatemedicationData[i].freq
        })
      )
    }
  }
  patchPatientUpdateEditMedicationDirect(editupdatemedicationData) {
    for (let i: number = 0; i <= editupdatemedicationData.length - 1; i++) {
      this.editmedicationsObjDirect.push(
        this.fb.group({
          name: editupdatemedicationData[i].name,
          dosage: editupdatemedicationData[i].dosage,
          freq: editupdatemedicationData[i].freq
        })
      )
    }
  }

  //Add Pat Illness Medication Manually
  addPatIllnessMedicationManuallySubmit() {
    this.isLoading = true;
    let payLoad = this.addPatIllMedicationManuallyForm.value.addMedicationArray;
    let addMedicationArray: any[] = [];
    for (let i: number = 0; i <= payLoad.length - 1; i++) {
      addMedicationArray.push(
        {
          "name": payLoad[i].name,
          "dosage": payLoad[i].dosage,
          "freq": payLoad[i].freq,
          "purpose": " ",
          "durationDays": 5,
          "moreDetails": " "
        }
      )
    }
    console.log("addMedicationArray data from form : ", addMedicationArray);
    this.addPatientIllnessMedicationObj = {
      "hospital_reg_num": this.addPatIllnessDiagnosisDataObj.hospital_reg_num,
      "byWhom": this.addPatIllnessDiagnosisDataObj.byWhom,
      "byWhomID": this.addPatIllnessDiagnosisDataObj.byWhomID,
      "patientID": this.addPatIllnessDiagnosisDataObj.patientID,
      "medical_record_id": this.addPatIllnessDiagnosisDataObj.medical_record_id,
      "illnessID": this.addPatIllnessDiagnosisDataObj.illnessID,
      "doctorMedicalPersonnelID": this.addPatIllMedicationManuallyForm.value.doctorMedicalPersonnelID,
      "doctorName": this.addPatIllMedicationManuallyForm.value.doctorName,
      "medications": addMedicationArray
    }
    console.log("the req for add pat illness medications obj : ", this.addPatientIllnessMedicationObj);
    this.loginService.addPatientIllnessMedicationManualData(this.addPatientIllnessMedicationObj, this.signObj.access_token).
      subscribe(
        (res) => {
          console.log("res from add patient illness medications  : ", res)
          if (res.response === 3) {
            this.isLoading = false;
            this.loading = false;
            this.illnessMedicationID = res.illnessMedicationID;
            this.viewAttachment();
            //alert(res.message);
            this.openSnackBar(res.message, "");
            //this.ngOnInit();
          }
          else if (res.response === 0) {
            this.isLoading = false;
            this.loading = false;
            this.openSnackBar(res.message, "");
            //this.modalService.dismissAll();
          }
        },
        (err: HttpErrorResponse) => {
          if (err.error instanceof Error) {
            this.isLoading = false;
            this.loading = false;
            console.log("Client Side Error")
          } else {
            this.isLoading = false;
            this.loading = false;
            console.log(err)
          }
        })
  }

  //Add Pat Illness Medication Manually
  addPatIllnessMedicationManuallySubmitDirectly() {
    this.isLoading = true;
    let payLoad = this.addPatIllMedicationManuallyFormDirectly.value.addMedicationArrayDirect;
    let addMedicationArrayDirect: any[] = [];
    for (let i: number = 0; i <= payLoad.length - 1; i++) {
      addMedicationArrayDirect.push(
        {
          "name": payLoad[i].name,
          "dosage": payLoad[i].dosage,
          "freq": payLoad[i].freq,
          "purpose": " ",
          "durationDays": 5,
          "moreDetails": " "
        }
      )
    }
    console.log("addMedicationArray data from form : ", addMedicationArrayDirect);
    this.addPatientIllnessMedicationObjDirect = {
      "hospital_reg_num": this.signObj.hospitalAdmin.hospital_reg_num,
      "byWhom": "admin",
      "byWhomID": this.signObj.hospitalAdmin.userID,
      "patientID": this.selectedPatientData.patientID,
      "medical_record_id": this.selectedPatientData.medical_record_id,
      "illnessID": this.addPatIllMedicationManuallyFormDirectly.value.illnessID,
      "doctorMedicalPersonnelID": this.addPatIllMedicationManuallyFormDirectly.value.doctorMedicalPersonnelID,
      "doctorName": this.addPatIllMedicationManuallyFormDirectly.value.doctorName,
      "medications": addMedicationArrayDirect
    }
    console.log("the req for add pat medications directly obj : ", this.addPatientIllnessMedicationObjDirect);
    this.loginService.addPatientIllnessMedicationManualData(this.addPatientIllnessMedicationObjDirect, this.signObj.access_token).
      subscribe(
        (res) => {
          console.log("res from add patient illness medications directly  : ", res)
          if (res.response === 3) {
            this.isLoading = false;
            this.loading = false;
            this.illnessMedicationID = res.illnessMedicationID;
            this.viewAttachment();
            //alert(res.message);
            this.openSnackBar(res.message, "");
            this.ngOnInit();
          }
          else if (res.response === 0) {
            this.isLoading = false;
            this.loading = false;
            this.openSnackBar(res.message, "");
            //this.modalService.dismissAll();
          }
        },
        (err: HttpErrorResponse) => {
          if (err.error instanceof Error) {
            this.isLoading = false;
            this.loading = false;
            console.log("Client Side Error")
          } else {
            this.isLoading = false;
            this.loading = false;
            console.log(err)
          }
        })
  }

  //Update Pat Illness Medication Manually
  editPatIllnessMedicationManuallySubmit() {
    this.isLoading = true;//editPatIllMedicationManuallyForm
    let payLoad = this.editPatIllMedicationManuallyForm.value.editMedicationArray;
    let editMedicationArray: any[] = [];
    for (let i: number = 0; i <= payLoad.length - 1; i++) {
      editMedicationArray.push(
        {
          "name": payLoad[i].name,
          "dosage": payLoad[i].dosage,
          "freq": payLoad[i].freq,
          "purpose": " ",
          "durationDays": 5,
          "moreDetails": " "
        }
      )
    }
    // this.illnessMedications fetched medication data
    console.log("edit update medicationsArray data from form : ", editMedicationArray);
    this.editPatientIllnessMedicationObj = {
      "hospital_reg_num": this.illnessMedications[0].hospital_reg_num,
      "byWhom": "admin",
      "byWhomID": this.signObj.hospitalAdmin.userID,
      "patientID": this.illnessMedications[0].patientID,
      "medical_record_id": this.illnessMedications[0].medical_record_id,
      "illnessID": this.illnessMedications[0].illnessID,
      "doctorMedicalPersonnelID": this.illnessMedications[0].mannualPrescriptions.doctorMedicalPersonnelID,
      "doctorName": this.illnessMedications[0].mannualPrescriptions.doctorName,
      "illnessMedicationID": this.illnessMedications[0].illnessMedicationID,
      "medications": editMedicationArray
    }
    console.log("the req for update pat illness medications obj : ", this.editPatientIllnessMedicationObj);
    this.loginService.updatePatientIllnessMedicationManualData(this.editPatientIllnessMedicationObj, this.signObj.access_token).
      subscribe(
        (res) => {
          console.log("res from update patient illness medications  : ", res)
          if (res.response === 3) {
            this.isLoading = false;
            this.loading = false;
            //alert(res.message);
            this.openSnackBar(res.message, "");
            this.viewAttachment2();
            //this.ngOnInit();
            console.log("Res from Patient illness update Medications Data : ", res);
          }
          else if (res.response === 0) {
            this.isLoading = false;
            this.loading = false;
            this.openSnackBar(res.message, "");
            //this.modalService.dismissAll();
          }
        },
        (err: HttpErrorResponse) => {
          if (err.error instanceof Error) {
            this.isLoading = false;
            this.loading = false;
            console.log("Client Side Error")
          } else {
            this.isLoading = false;
            this.loading = false;
            console.log(err)
          }
        })
  }

  editPatIllnessMedicationManuallySubmitDirect(selectedMedicationData) {
    console.log("selected medication data to update Direct : ", selectedMedicationData);

    this.isLoading = true;//editPatIllMedicationManuallyForm
    let payLoad = this.editPatIllMedicationManuallyFormDirect.value.editMedicationArrayDirect;
    let editMedicationArray: any[] = [];
    for (let i: number = 0; i <= payLoad.length - 1; i++) {
      editMedicationArray.push(
        {
          "name": payLoad[i].name,
          "dosage": payLoad[i].dosage,
          "freq": payLoad[i].freq,
          "purpose": " ",
          "durationDays": "5",
          "moreDetails": " "
        }
      )
    }
    // this.illnessMedications fetched medication data
    console.log("edit update medicationsArray data from form Direct : ", editMedicationArray);
    this.editPatientIllnessMedicationObj = {
      "hospital_reg_num": selectedMedicationData.hospital_reg_num,
      "byWhom": "admin",
      "byWhomID": this.signObj.hospitalAdmin.userID,
      "patientID": selectedMedicationData.patientID,
      "medical_record_id": selectedMedicationData.medical_record_id,
      "illnessID": selectedMedicationData.illnessID,
      "doctorMedicalPersonnelID": selectedMedicationData.mannualPrescriptions.doctorMedicalPersonnelID,
      "doctorName": selectedMedicationData.mannualPrescriptions.doctorName,
      "illnessMedicationID": selectedMedicationData.illnessMedicationID,
      "medications": editMedicationArray
    }
    console.log("the req for update pat illness medications obj Direct : ", this.editPatientIllnessMedicationObj);
    this.loginService.updatePatientIllnessMedicationManualData(this.editPatientIllnessMedicationObj, this.signObj.access_token).
      subscribe(
        (res) => {
          console.log("res from update patient illness medications  : ", res)
          if (res.response === 3) {
            this.isLoading = false;
            this.loading = false;
            //alert(res.message);
            this.openSnackBar(res.message, "");
            this.viewAttachment3();
            //this.ngOnInit();
            console.log("Res from Patient illness update Medications Data : ", res);
          }
          else if (res.response === 0) {
            this.isLoading = false;
            this.loading = false;
            this.openSnackBar(res.message, "");
            //this.modalService.dismissAll();
          }
        },
        (err: HttpErrorResponse) => {
          if (err.error instanceof Error) {
            this.isLoading = false;
            this.loading = false;
            console.log("Client Side Error")
          } else {
            this.isLoading = false;
            this.loading = false;
            console.log(err)
          }
        })
  }

  //Mat Snack Bar
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 5000,
      verticalPosition: 'bottom', // 'top' | 'bottom'
      horizontalPosition: 'right', //'start' | 'center' | 'end' | 'left' | 'right'
    })
  }
  openSnackBar1(message: string, action: string) {
    this._snackBar.open(message, action, {
      panelClass: ['red-snackbar'],
      duration: 5000,
      verticalPosition: 'bottom', // 'top' | 'bottom'
      horizontalPosition: 'right', //'start' | 'center' | 'end' | 'left' | 'right'
    })
  }

  showData(letSearch: string) {
    console.log("Print Value For Show Tables : ", letSearch);
    if (letSearch == "All") {
      this.term = "";
      this.isViewPhysicalExamination = false;
      this.isViewMedicalHistory = false;
      this.isViewMedications = false;
      this.isViewSurgicalProcedures = false;
      this.isViewImmunizations = false;
    } else {
      this.term = letSearch;
      this.searchTable = this.term;
      console.log("from else : ", this.searchTable);

      if (this.searchTable === "Physical Examination") {
        this.isViewPhysicalExamination = false;
        this.isViewMedicalHistory = true;
        this.isViewMedications = true;
        this.isViewSurgicalProcedures = true;
        this.isViewImmunizations = true;
      }
      else if (this.searchTable === "Medical History") {
        this.isViewPhysicalExamination = true;
        this.isViewMedicalHistory = false;
        this.isViewMedications = true;
        this.isViewSurgicalProcedures = true;
        this.isViewImmunizations = true;
      }
      else if (this.searchTable === "Medications") {
        this.isViewPhysicalExamination = true;
        this.isViewMedicalHistory = true;
        this.isViewMedications = false;
        this.isViewSurgicalProcedures = true;
        this.isViewImmunizations = true;
      }
      else if (this.searchTable === "Surgery Procedures") {
        this.isViewPhysicalExamination = true;
        this.isViewMedicalHistory = true;
        this.isViewMedications = true;
        this.isViewSurgicalProcedures = false;
        this.isViewImmunizations = true;
      }
      else if (this.searchTable === "Immunizations") {
        this.isViewPhysicalExamination = true;
        this.isViewMedicalHistory = true;
        this.isViewMedications = true;
        this.isViewSurgicalProcedures = true;
        this.isViewImmunizations = false;
      }
      else if (this.searchTable === "All") {
        this.isViewPhysicalExamination = false;
        this.isViewMedicalHistory = false;
        this.isViewMedications = false;
        this.isViewSurgicalProcedures = false;
        this.isViewImmunizations = false;
      }
      else {
        this.isViewPhysicalExamination = false;
        this.isViewMedicalHistory = false;
        this.isViewMedications = false;
        this.isViewSurgicalProcedures = false;
        this.isViewImmunizations = false;
      }

    }
  }

  viewBasicExam() {
    this.textColor2 = 'white';
    this.textColor3 = 'black';
    this.color2 = '#3e4542';
    this.color3 = 'white'
    this.viewSystemEx = false;
    this.viewBasicEx = true;
    this.hideOnBasicExam = false;
  }

  viewSystemExam() {
    this.textColor2 = 'black';
    this.textColor3 = 'white';
    this.color2 = 'white';
    this.color3 = '#3e4542'
    this.viewBasicEx = false;
    this.viewSystemEx = true;
    this.hideOnBasicExam = true;
  }

  viewManualInput() {
    this.textColor = 'white';
    this.textColor1 = 'black';
    this.color = '#53B9C6';
    this.color1 = 'white'
    this.viewManualInputView = true;
    this.viewAttachmentView = false;
  }

  viewAttachment() {
    this.textColor = 'black';
    this.textColor1 = 'white';
    this.color = 'white'
    this.color1 = '#53B9C6';
    this.viewAttachmentView = true;
    this.viewManualInputView = false;
  }

  viewManualInput2() {
    this.textColor = 'white';
    this.textColor1 = 'black';
    this.color = '#53B9C6';
    this.color1 = 'white'
    this.viewManualInputView2 = true;
    this.viewAttachmentView2 = false;
  }

  viewAttachment2() {
    this.textColor = 'black';
    this.textColor1 = 'white';
    this.color = 'white'
    this.color1 = '#53B9C6';
    this.viewAttachmentView2 = true;
    this.viewManualInputView2 = false;
  }

  viewManualInput3() {
    this.textColor = 'white';
    this.textColor1 = 'black';
    this.color = '#53B9C6';
    this.color1 = 'white'
    this.viewManualInputView3 = true;
    this.viewAttachmentView3 = false;
  }

  viewAttachment3() {
    this.textColor = 'black';
    this.textColor1 = 'white';
    this.color = 'white'
    this.color1 = '#53B9C6';
    this.viewAttachmentView3 = true;
    this.viewManualInputView3 = false;
  }

  //Image Upload
  fileProgress(event: any) {
    this.isNoFile = true;
    let reader = new FileReader();
    let file = event.target.files[0];
    this.fileValue = "kb";
    if (event.target.files && event.target.files[0]) {
      reader.readAsDataURL(file);
      this.addedFilesArray.push(file);
      reader.onload = () => {
        // this.addPatientPhysicalExamFileForm.get('profilePic').setValue(this.addedFilesArray);
        //this.previewImg = reader.result;
      }
    }
  }
  removeUploadedFile(index) {

    this.addedFilesArray.splice(index, 1);
    //this.addPatientPhysicalExamFileForm.get('profilePic').setValue(null)
    //this.fileName = null;
    //this.fileSize = null;
    //this.fileValue = null;
    if (this.addedFilesArray.length === 0) {
      this.isNoFile = false;
    }
  }
  //Img Upload complete here

  //editPatientMedHistoryFileForm file Upload
  fileProgress1(event: any) {
    this.isNoFile = true;
    let reader = new FileReader(); // HTML5 FileReader API
    let file = event.target.files[0];
    this.fileName = file.name;
    this.fileSize = file.size;
    this.fileSize = this.fileSize / 1024;
    this.fileValue = "kb";
    if (event.target.files && event.target.files[0]) {
      reader.readAsDataURL(file);
      // When file uploads set it to file formcontrol
      reader.onload = () => {
        this.editPatientMedHistoryFileForm.get('profilePic').setValue(file);
        this.previewImg = reader.result
      }
      // ChangeDetectorRef since file is loading outside the zone
      //this.cd.markForCheck();
    }
  }
  removeUploadedFile1() {
    // let newFileList = Array.from(this.el.nativeElement.files);
    this.editPatientMedHistoryFileForm.get('profilePic').setValue(null)
    this.fileName = null;
    this.fileSize = null;
    this.fileValue = null;
    this.isNoFile = false;
  }
  //Img Upload complete here

  fileProgress1Direct(event: any) {
    this.isNoFile = true;
    let reader = new FileReader(); // HTML5 FileReader API
    let file = event.target.files[0];
    this.fileName = file.name;
    this.fileSize = file.size;
    this.fileSize = this.fileSize / 1024;
    this.fileValue = "kb";
    if (event.target.files && event.target.files[0]) {
      reader.readAsDataURL(file);
      // When file uploads set it to file formcontrol
      reader.onload = () => {
        this.editPatientMedHistoryFileFormDirect.get('profilePic').setValue(file);
        this.previewImg = reader.result
      }
      // ChangeDetectorRef since file is loading outside the zone
      //this.cd.markForCheck();
    }
  }
  removeUploadedFile1Direct() {
    // let newFileList = Array.from(this.el.nativeElement.files);
    this.editPatientMedHistoryFileFormDirect.get('profilePic').setValue(null)
    this.fileName = null;
    this.fileSize = null;
    this.fileValue = null;
    this.isNoFile = false;
  }
  //Img Upload complete here


  //editPatientMedHistorySurgicalFileForm file Upload
  fileProgress11(event: any) {
    this.isNoFile = true;
    let reader = new FileReader(); // HTML5 FileReader API
    let file = event.target.files[0];
    this.fileName = file.name;
    this.fileSize = file.size;
    this.fileSize = this.fileSize / 1024;
    this.fileValue = "kb";
    if (event.target.files && event.target.files[0]) {
      reader.readAsDataURL(file);
      // When file uploads set it to file formcontrol
      reader.onload = () => {
        this.editPatIllnessSurgicalForm.get('profilePic').setValue(file);
        this.previewImg = reader.result
      }
      // ChangeDetectorRef since file is loading outside the zone
      //this.cd.markForCheck();
    }
  }
  fileProgress11Direct(event: any) {
    this.isNoFile = true;
    let reader = new FileReader(); // HTML5 FileReader API
    let file = event.target.files[0];
    this.fileName = file.name;
    this.fileSize = file.size;
    this.fileSize = this.fileSize / 1024;
    this.fileValue = "kb";
    if (event.target.files && event.target.files[0]) {
      reader.readAsDataURL(file);
      // When file uploads set it to file formcontrol
      reader.onload = () => {
        this.editPatIllnessSurgicalFormDirect.get('profilePic').setValue(file);
        this.previewImg = reader.result
      }
      // ChangeDetectorRef since file is loading outside the zone
      //this.cd.markForCheck();
    }
  }
  removeUploadedFile11() {
    // let newFileList = Array.from(this.el.nativeElement.files);
    this.editPatIllnessSurgicalForm.get('profilePic').setValue(null)
    this.fileName = null;
    this.fileSize = null;
    this.fileValue = null;
    this.isNoFile = false;
  }
  removeUploadedFile11Direct() {
    // let newFileList = Array.from(this.el.nativeElement.files);
    this.editPatIllnessSurgicalFormDirect.get('profilePic').setValue(null)
    this.fileName = null;
    this.fileSize = null;
    this.fileValue = null;
    this.isNoFile = false;
  }
  //Img Upload complete here

  // addPatientMedHistoryFileForm File Upload
  fileProgress2(event: any) {
    this.isNoFile = true;
    let reader = new FileReader(); // HTML5 FileReader API
    let file = event.target.files[0];
    this.fileName = file.name;
    this.fileSize = file.size;
    this.fileSize = this.fileSize / 1024;
    this.fileValue = "kb";
    if (event.target.files && event.target.files[0]) {
      reader.readAsDataURL(file);
      // When file uploads set it to file formcontrol
      reader.onload = () => {
        this.addPatientMedHistoryFileForm.get('profilePic').setValue(file);
        this.previewImg = reader.result
      }
      // ChangeDetectorRef since file is loading outside the zone
      //this.cd.markForCheck();
    }
  }
  // addPatientMedication attachment File Upload
  fileProgress2Direct(event: any) {
    this.isNoFile = true;
    let reader = new FileReader(); // HTML5 FileReader API
    let file = event.target.files[0];
    this.fileName = file.name;
    this.fileSize = file.size;
    this.fileSize = this.fileSize / 1024;
    this.fileValue = "kb";
    if (event.target.files && event.target.files[0]) {
      reader.readAsDataURL(file);
      // When file uploads set it to file formcontrol
      reader.onload = () => {
        this.addPatientMedHistoryFileFormDirect.get('profilePic').setValue(file);
        this.previewImg = reader.result
      }
      // ChangeDetectorRef since file is loading outside the zone
      //this.cd.markForCheck();
    }
  }
  removeUploadedFile2() {
    // let newFileList = Array.from(this.el.nativeElement.files);
    this.addPatientMedHistoryFileForm.get('profilePic').setValue(null)
    this.fileName = null;
    this.fileSize = null;
    this.fileValue = null;
    this.isNoFile = false;
  }
  removeUploadedFile2Direct() {
    // let newFileList = Array.from(this.el.nativeElement.files);
    this.addPatientMedHistoryFileFormDirect.get('profilePic').setValue(null)
    this.fileName = null;
    this.fileSize = null;
    this.fileValue = null;
    this.isNoFile = false;
  }
  //Img Upload complete here
  // addPatientMedHistoryFileForm File Upload
  fileProgress3(event: any) {
    this.isNoFile = true;
    let reader = new FileReader(); // HTML5 FileReader API
    let file = event.target.files[0];
    this.fileName = file.name;
    this.fileSize = file.size;
    this.fileSize = this.fileSize / 1024;
    this.fileValue = "kb";
    if (event.target.files && event.target.files[0]) {
      reader.readAsDataURL(file);
      // When file uploads set it to file formcontrol
      reader.onload = () => {
        this.addPatIllnessSurgicalForm.get('profilePic').setValue(file);
        this.previewImg = reader.result
      }
      // ChangeDetectorRef since file is loading outside the zone
      //this.cd.markForCheck();
    }
  }
  removeUploadedFile3() {
    // let newFileList = Array.from(this.el.nativeElement.files);
    this.addPatIllnessSurgicalForm.get('profilePic').setValue(null)
    this.fileName = null;
    this.fileSize = null;
    this.fileValue = null;
    this.isNoFile = false;
  }
  fileProgress3Direct(event: any) {
    this.isNoFile = true;
    let reader = new FileReader(); // HTML5 FileReader API
    let file = event.target.files[0];
    this.fileName = file.name;
    this.fileSize = file.size;
    this.fileSize = this.fileSize / 1024;
    this.fileValue = "kb";
    if (event.target.files && event.target.files[0]) {
      reader.readAsDataURL(file);
      // When file uploads set it to file formcontrol
      reader.onload = () => {
        this.addPatIllnessSurgicalFormDirect.get('profilePic').setValue(file);
        this.previewImg = reader.result
      }
      // ChangeDetectorRef since file is loading outside the zone
      //this.cd.markForCheck();
    }
  }
  removeUploadedFile3Direct() {
    // let newFileList = Array.from(this.el.nativeElement.files);
    this.addPatIllnessSurgicalFormDirect.get('profilePic').setValue(null)
    this.fileName = null;
    this.fileSize = null;
    this.fileValue = null;
    this.isNoFile = false;
  }
  //Img Upload complete here

  removeSurgicalAttachment() {
    this.illnessSurgicalAttachments = [];
  }

  removeEditMedicationAttachment(i) {
    console.log("index value : ", i);
    this.medicationAttachmentData.splice(i, 1)

  }

  removeEditMedicationAttachmentDirect(i) {
    console.log("index value : ", i);
    this.medicationAttachmentDataDirect.splice(i, 1);
  }

  removeEditillnessSurgicalAttachments(i) {
    console.log("index value of delete surgical attachement : ", i);
    this.illnessSurgicalAttachments.splice(i, 1)
  }
  removeEditillnessSurgicalAttachmentsDirect(i) {
    console.log("index value of delete surgical attachement : ", i);
    this.illnessSurgicalAttachmentsDirect.splice(i, 1)
  }

  //Add Patient Medical Record Illness Medication Attachment
  addPatientMedicalHistoryIllnessMedicationAttachmentSubmit() {
    this.isLoading = true;
    let formData = new FormData()
    formData.append("illnessID", this.addPatientIllnessMedicationObj.illnessID);
    formData.append("prescription1", this.addPatientMedHistoryFileForm.get('profilePic').value);
    formData.append("prescription1MoreDetails", this.addPatientMedHistoryFileForm.value.prescription1MoreDetails);
    formData.append("illnessMedicationID", this.illnessMedicationID);
    formData.append("doctorMedicalPersonnelID", this.addPatientIllnessMedicationObj.doctorMedicalPersonnelID);
    formData.append("doctorName", this.addPatientIllnessMedicationObj.doctorName);
    formData.append("patientID", this.addPatientIllnessMedicationObj.patientID);
    formData.append("medical_record_id", this.addPatientIllnessMedicationObj.medical_record_id);
    formData.append("byWhom", this.addPatientIllnessMedicationObj.byWhom);
    formData.append("byWhomID", this.addPatientIllnessMedicationObj.byWhomID);
    formData.append("hospital_reg_num", this.addPatientIllnessMedicationObj.hospital_reg_num);

    this.loginService.addPatientMedicalHistoryIllnessMedicationAttachment(formData, this.signObj.access_token).subscribe(
      (updateAdminGenUserData) => {
        console.log("res from add patient Medial-Record Illness Attachment data : ", updateAdminGenUserData);
        if (updateAdminGenUserData.response === 3) {
          this.isLoading = false;
          this.removeUploadedFile2();
          //alert(updateAdminGenUserData.message);
          this.openSnackBar(updateAdminGenUserData.message, "");
          this.openPatientSurgical();
          //this.modalService.dismissAll();
          this.ngOnInit();
        }
        else {
          this.isLoading = false;
          //this.loading = false;
          //alert(updateAdminGenUserData.message);
          this.openSnackBar(updateAdminGenUserData.message, "");
          //this.modalService.dismissAll();
        }
      },
      (err: HttpErrorResponse) => {
        if (err.error instanceof Error) {
          this.isLoading = false;
          //this.loading = false;
          console.log("Client Side Error", err);

        } else {
          this.isLoading = false;
          //this.loading = false;
          console.log("Server Side", err)
        }
      }
    );
  }

  //Add Patient Medical Record Illness Medication Attachment
  addPatientMedicalHistoryIllnessMedicationAttachmentSubmitDirect() {
    this.isLoading = true;
    let formData = new FormData()
    formData.append("illnessID", this.addPatientIllnessMedicationObjDirect.illnessID);
    formData.append("prescription1", this.addPatientMedHistoryFileFormDirect.get('profilePic').value);
    formData.append("prescription1MoreDetails", this.addPatientMedHistoryFileFormDirect.value.prescription1MoreDetails);
    formData.append("illnessMedicationID", this.illnessMedicationID);
    formData.append("doctorMedicalPersonnelID", this.addPatientIllnessMedicationObjDirect.doctorMedicalPersonnelID);
    formData.append("doctorName", this.addPatientIllnessMedicationObjDirect.doctorName);
    formData.append("patientID", this.addPatientIllnessMedicationObjDirect.patientID);
    formData.append("medical_record_id", this.addPatientIllnessMedicationObjDirect.medical_record_id);
    formData.append("byWhom", this.addPatientIllnessMedicationObjDirect.byWhom);
    formData.append("byWhomID", this.addPatientIllnessMedicationObjDirect.byWhomID);
    formData.append("hospital_reg_num", this.addPatientIllnessMedicationObjDirect.hospital_reg_num);

    this.loginService.addPatientMedicalHistoryIllnessMedicationAttachment(formData, this.signObj.access_token).subscribe(
      (updateAdminGenUserData) => {
        console.log("res from add patient Medial-Record Illness Attachment data : ", updateAdminGenUserData);
        if (updateAdminGenUserData.response === 3) {
          this.isLoading = false;
          this.removeUploadedFile2();
          //alert(updateAdminGenUserData.message);
          this.openSnackBar(updateAdminGenUserData.message, "");
          // this.openPatientSurgical();
          this.modalService.dismissAll();
          this.ngOnInit();
        }
        else {
          this.isLoading = false;
          //this.loading = false;
          //alert(updateAdminGenUserData.message);
          this.openSnackBar(updateAdminGenUserData.message, "");
          //this.modalService.dismissAll();
        }
      },
      (err: HttpErrorResponse) => {
        if (err.error instanceof Error) {
          this.isLoading = false;
          //this.loading = false;
          console.log("Client Side Error", err);

        } else {
          this.isLoading = false;
          //this.loading = false;
          console.log("Server Side", err)
        }
      }
    );
  }

  //edit Patient Medical Record Illness Medication Attachment
  editPatientMedicalHistoryIllnessMedicationAttachmentSubmit() {
    //this.illnessMedications
    this.isLoading = true;
    let formData = new FormData()

    formData.append("illnessID", this.illnessMedications[0].illnessID);
    formData.append("prescription1", this.editPatientMedHistoryFileForm.get('profilePic').value);
    formData.append("prescription1MoreDetails", this.editPatientMedHistoryFileForm.value.prescription1MoreDetails);
    formData.append("illnessMedicationID", this.illnessMedications[0].illnessMedicationID);
    formData.append("doctorMedicalPersonnelID", this.illnessMedications[0].attachedPrescriptions.doctorMedicalPersonnelID);
    formData.append("doctorName", this.illnessMedications[0].attachedPrescriptions.doctorName);
    formData.append("patientID", this.illnessMedications[0].patientID);
    formData.append("medical_record_id", this.illnessMedications[0].medical_record_id);
    formData.append("byWhom", "admin");
    formData.append("byWhomID", this.signObj.hospitalAdmin.userID);
    formData.append("hospital_reg_num", this.illnessMedications[0].hospital_reg_num);

    this.loginService.editPatientMedicalHistoryIllnessMedicationAttachment(formData, this.signObj.access_token).subscribe(
      (updateAdminGenUserData) => {
        console.log("res from update patient Medial-Record Illness Attachment data : ", updateAdminGenUserData);
        if (updateAdminGenUserData.response === 3) {
          this.isLoading = false;
          this.openPatientSurgical2();
          this.openSnackBar(updateAdminGenUserData.message, "");
          //this.ngOnInit();
        }
        else {
          this.isLoading = false;
          //this.modalService.dismissAll();
          this.openSnackBar(updateAdminGenUserData.message, "");
        }
      },
      (err: HttpErrorResponse) => {
        if (err.error instanceof Error) {
          this.isLoading = false;
          console.log("Client Side Error", err);

        } else {
          this.isLoading = false;
          console.log("Server Side", err)
        }
      }
    );
  }
  //edit Patient Medical Record Illness Medication Attachment
  editPatientMedicalHistoryIllnessMedicationAttachmentSubmitDirect(selectedMedicationData) {
    console.log("selected medication attachemnt data to update direct : ", selectedMedicationData);

    this.isLoading = true;
    let formData = new FormData()

    formData.append("illnessID", selectedMedicationData.illnessID);
    formData.append("prescription1", this.editPatientMedHistoryFileFormDirect.get('profilePic').value);
    formData.append("prescription1MoreDetails", this.editPatientMedHistoryFileFormDirect.value.prescription1MoreDetails);
    formData.append("illnessMedicationID", selectedMedicationData.illnessMedicationID);
    formData.append("doctorMedicalPersonnelID", selectedMedicationData.attachedPrescriptions.doctorMedicalPersonnelID);
    formData.append("doctorName", selectedMedicationData.attachedPrescriptions.doctorName);
    formData.append("patientID", selectedMedicationData.patientID);
    formData.append("medical_record_id", selectedMedicationData.medical_record_id);
    formData.append("byWhom", "admin");
    formData.append("byWhomID", this.signObj.hospitalAdmin.userID);
    formData.append("hospital_reg_num", selectedMedicationData.hospital_reg_num);
    console.log("Form data to update medication attachment direct : ", formData);

    this.loginService.editPatientMedicalHistoryIllnessMedicationAttachment(formData, this.signObj.access_token).subscribe(
      (updateAdminGenUserData) => {
        console.log("res from update patient Medial-Record Illness Attachment data : ", updateAdminGenUserData);
        if (updateAdminGenUserData.response === 3) {
          this.isLoading = false;
          this.openSnackBar(updateAdminGenUserData.message, "");
          this.ngOnInit();
          this.modalService.dismissAll();
        }
        else {
          this.isLoading = false;
          //this.modalService.dismissAll();
          this.openSnackBar(updateAdminGenUserData.message, "");
        }
      },
      (err: HttpErrorResponse) => {
        if (err.error instanceof Error) {
          this.isLoading = false;
          console.log("Client Side Error", err);

        } else {
          this.isLoading = false;
          console.log("Server Side", err)
        }
      }
    );
  }

  //Add Patient Physical Exam File
  addPatientPhysicalExamFileSubmit() {
    this.isLoading = true;

    let payLoad = this.addPatientPhysicalExamFileForm.value;
    console.log("the files data : ", payLoad);
    let value = JSON.stringify(this.addedFilesArray)
    console.log("data files : ", value);
    // let arrayData = [];
    // this.addedFilesArray.forEach((file) => {
    //   this.arrayData.push(formData.append('physicalExamRecord', file));
    // });
    // console.log("data files : ", this.arrayData);

    this.addedFilesArray.splice(1, this.addedFilesArray.length)
    let formData = new FormData()

    formData.append("byWhomID", this.signObj.hospitalAdmin.userID);
    formData.append("hospital_reg_num", this.selectedPatientData.hospital_reg_num);
    formData.append("patientID", this.selectedPatientData.patientID);
    formData.append("medical_record_id", this.selectedPatientData.medical_record_id);
    //formData.append("physicalExamRecord", this.addPatientPhysicalExamFileForm.get('profilePic').value);
    //formData.append("physicalExamRecord", this.arrayData);
    this.addedFilesArray.forEach((file) => {
      formData.append('physicalExamRecord', file);
    });
    formData.append("byWhom", "admin");

    this.loginService.addPatientPhysicalExamRecordAttachmentData(formData, this.signObj.access_token).subscribe(
      (updateAdminGenUserData) => {
        console.log("res from add patient phy exam Attachment data : ", updateAdminGenUserData);
        if (updateAdminGenUserData.response === 3) {
          this.isLoading = false;
          this.addedFilesArray = [];
          //this.removeUploadedFile();
          this.openSnackBar(updateAdminGenUserData.message, "");
          this.modalService.dismissAll();
          this.ngOnInit();
        }
        else {
          this.isLoading = false;
          //this.loading = false;
          this.openSnackBar(updateAdminGenUserData.message, "");
          this.modalService.dismissAll();
        }
      },
      (err: HttpErrorResponse) => {
        if (err.error instanceof Error) {
          this.isLoading = false;
          //this.loading = false;
          console.log("Client Side Error", err);

        } else {
          this.isLoading = false;
          //this.loading = false;
          console.log("Server Side", err)
        }
      }
    );

  }

  onSearchChange(searchValue: string): void {
    console.log("keyup value height : ", searchValue);
    this.calculateBMI();
    this.calculateBMR();
  }
  onSearchChange1(searchValue: string): void {
    console.log("keyup value weight : ", searchValue);
    this.calculateBMI();
    this.calculateBMR();
  }
  onSearchChange2(searchValue: string): void {
    console.log("keyup value height : ", searchValue);
    this.calculateBMI1();
    this.calculateBMR1();
  }
  onSearchChange3(searchValue: string): void {
    console.log("keyup value weight : ", searchValue);
    this.calculateBMI1();
    this.calculateBMR1();
  }

  calculateBMI() {
    // let calculateBMI = weight / (height * height);
    let calculatedBMI = this.basicExamForm.value.weight / (this.basicExamForm.value.height * this.basicExamForm.value.height);
    console.log("the BMI value is : ", calculatedBMI);
    this.basicExamForm.patchValue({
      bmi: (calculatedBMI * 100 * 100).toFixed(2)
    })
  }
  calculateBMI1() {
    // let calculateBMI = weight / (height * height);
    let calculatedBMI = this.basicExamEditForm.value.weight / (this.basicExamEditForm.value.height * this.basicExamEditForm.value.height);
    console.log("the BMI value is : ", calculatedBMI);
    this.basicExamEditForm.patchValue({
      bmi: (calculatedBMI * 100 * 100).toFixed(2)
    })
  }

  calculateBMR() {
    //Women: BMR = 655 + (9.6 x weight in kg) + (1.8 x height in cm) - (4.7 x age in years)
    //Men: BMR = 66 + (13.7 x weight in kg) + (5 x height in cm) - (6.8 x age in years)

    if (this.gender === "Male") {
      let claculredBMR = 66 + (13.7 * this.basicExamForm.value.weight) + (5 * this.basicExamForm.value.height) - (6.8 * this.age)
      this.basicExamForm.patchValue({
        bmr: claculredBMR
      })
    }
    else {
      let claculredBMR = 655 + (9.6 * this.basicExamForm.value.weight) + (1.8 * this.basicExamForm.value.height) - (4.7 * this.age)
      this.basicExamForm.patchValue({
        bmr: claculredBMR
      })
    }
  }
  calculateBMR1() {
    //Women: BMR = 655 + (9.6 x weight in kg) + (1.8 x height in cm) - (4.7 x age in years)
    //Men: BMR = 66 + (13.7 x weight in kg) + (5 x height in cm) - (6.8 x age in years)

    if (this.gender === "Male") {
      let claculredBMR = 66 + (13.7 * this.basicExamEditForm.value.weight) + (5 * this.basicExamEditForm.value.height) - (6.8 * this.age)
      this.basicExamEditForm.patchValue({
        bmr: claculredBMR
      })
    }
    else {
      let claculredBMR = 655 + (9.6 * this.basicExamEditForm.value.weight) + (1.8 * this.basicExamEditForm.value.height) - (4.7 * this.age)
      this.basicExamEditForm.patchValue({
        bmr: claculredBMR
      })
    }
  }
  //Add Patient Physical Exam Manually
  addPatientPhysicalExamManually(physicalExaminationData) {
    this.isLoading = true;
    let payload = {
      "height": '' + this.basicExamForm.value.height + ' ' + 'CM',
      "weight": '' + this.basicExamForm.value.weight + ' ' + 'KG',
      "waistline": '' + this.basicExamForm.value.waistline + ' ' + 'CM',
      "bmi": '' + this.basicExamForm.value.bmi,
      "bloodPressure": '' + this.basicExamForm.value.bloodPressure
    }

    let physicalExamination: any[] = physicalExaminationData;

    this.addPatientPhysicalExamManullyObj = {
      "hospital_reg_num": this.selectedPatientData.hospital_reg_num,
      "patientID": this.selectedPatientData.patientID,
      "medical_record_id": this.selectedPatientData.medical_record_id,
      "byWhom": "admin",
      "byWhomID": this.signObj.hospitalAdmin.userID,
      "bodyIndex": payload,
      "physicalExamination": physicalExamination,
      "other": this.belowForm.value.other,
      "physicianCommentsOrRecomdations": this.belowForm.value.physicianCommentsOrRecomdations
    }

    console.log("the sended obj data for pat phy exam add manual : ", this.addPatientPhysicalExamManullyObj);
    this.loginService.addPatientPhysicalExamRecordsManually(this.addPatientPhysicalExamManullyObj, this.signObj.access_token).
      subscribe(
        (res) => {
          if (res.response === 3) {
            this.isLoading = false;
            this.openSnackBar(res.message, "");
            this.viewAttachment();
            this.fetchPatientPhysicalExamRecords();
            //this.loading = false;
            //this.modalService.dismissAll();
            console.log("res from add patient physical exam records manually from component Success : ", res.message, res.physical_exam_id);
          }
          else if (res.response === 0) {
            this.isLoading = false;
            //this.loading = false;
            this.openSnackBar(res.message, "");
            console.log("failure case", res.message);
            //this.modalService.dismissAll();
          }
        },
        (err: HttpErrorResponse) => {
          if (err.error instanceof Error) {
            this.isLoading = false;
            //this.loading = false;
            console.log("Client Side Error")
          } else {
            this.isLoading = false;
            //this.loading = false;
            console.log(err)
          }
        })
  }

  //Update Patient Physical Exam Manually
  updatePatientManualSubmit(selectedInvoicesData) {
    this.isLoading = true;
    this.selectedPatManualData = selectedInvoicesData;

    //let formOneData = this.basicExamEditForm.value;
    let formOneData = {

      "height": '' + this.basicExamEditForm.value.height + ' ' + 'CM',
      "weight": '' + this.basicExamEditForm.value.weight + ' ' + 'KG',
      "waistline": '' + this.basicExamEditForm.value.waistline + ' ' + 'CM',
      "bmi": '' + this.basicExamEditForm.value.bmi,
      "bloodPressure": '' + this.basicExamEditForm.value.bloodPressure

    }

    let phyExamUpdateData: any[] = this.selectedPatSystemExamData;

    this.updatePatientPhysicalExamManullyObj = {
      //"medical_personnel_id": selectedInvoicesData.medical_personnel_id,
      "hospital_reg_num": selectedInvoicesData.hospital_reg_num,
      "patientID": selectedInvoicesData.patientID,
      "medical_record_id": selectedInvoicesData.medical_record_id,
      "byWhom": "admin",
      "byWhomID": this.signObj.hospitalAdmin.userID,
      "physical_exam_id": selectedInvoicesData.physical_exam_id,
      "bodyIndex": formOneData,
      "physicalExamination": phyExamUpdateData,
      "other": this.belowEditForm.value.other,
      "physicianCommentsOrRecomdations": this.belowEditForm.value.physicianCommentsOrRecomdations
    }

    console.log("the sended obj data for pat phy exam update manual : ", this.updatePatientPhysicalExamManullyObj);

    this.loginService.updatePatientPhysicalExamRecordsManually(this.updatePatientPhysicalExamManullyObj, this.signObj.access_token).
      subscribe(
        (res) => {
          if (res.response === 3) {
            this.isLoading = false;
            this.ngOnInit();
            //this.loading = false;
            this.openSnackBar(res.message, "");
            this.modalService.dismissAll();
            console.log("res from update patient physical exam records manually from component Success : ", res.message, res.physical_exam_id);
          }
          else if (res.response === 0) {
            this.isLoading = false;
            //this.loading = false;
            //this.modalService.dismissAll();
            this.openSnackBar(res.message, "");
            console.log("failure case", res.message);
          }
        },
        (err: HttpErrorResponse) => {
          if (err.error instanceof Error) {
            this.isLoading = false;
            //this.loading = false;
            console.log("Client Side Error")
          } else {
            this.isLoading = false;
            //this.loading = false;
            console.log(err)
          }
        })


  }

  //Fetch Patient Physical Exam Reocrds
  fetchPatientPhysicalExamRecords() {

    this.fetchPatientPhysicalExamObj = {
      "hospital_reg_num": this.selectedPatientData.hospital_reg_num,
      "patientID": this.selectedPatientData.patientID,
      "medical_record_id": this.selectedPatientData.medical_record_id,
      "byWhomID": this.signObj.hospitalAdmin.userID,
      "byWhom": "admin"
    }
    this.loginService.getPatientPhysicalExamRecordsData(this.fetchPatientPhysicalExamObj, this.signObj.access_token).
      subscribe(
        (res) => {
          if (res.response === 3) {
            this.loading = false;
            this.PhysicalExamination = res.physical_exam_records;
            console.log("Res from Patient Phy Exam Records Data : ", this.PhysicalExamination);
          }
          else if (res.response === 0) {
            this.PhysicalExamination = [];
            this.loading = false;
          }
        },
        (err: HttpErrorResponse) => {
          if (err.error instanceof Error) {
            this.loading = false;
            console.log("Client Side Error")
          } else {
            this.loading = false;
            console.log(err)
          }
        })
  }

  //Fetch Patient Immunization Reocrds
  fetchPatientImmunizationRecords() {

    this.fetchPatientImmunizationObj = {
      "hospital_reg_num": this.selectedPatientData.hospital_reg_num,
      "patientID": this.selectedPatientData.patientID,
      "medical_record_id": this.selectedPatientData.medical_record_id,
      "byWhom": "admin",
      "byWhomID": this.signObj.hospitalAdmin.userID
    }
    this.loginService.getPatientImmunizationRecordsData(this.fetchPatientImmunizationObj, this.signObj.access_token).
      subscribe(
        (res) => {

          console.log("res form fetch immunizations : ", res);

          this.Immunizations = [];
          if (res.response === 3) {

            this.loading = false;
            this.Immunizations = res.immunization_records;
            console.log("Res from Patient immunization_records Records Data : ", this.Immunizations);
          }
          else if (res.response === 0) {

            this.Immunizations = [];
            this.loading = false;
          }
        },
        (err: HttpErrorResponse) => {
          if (err.error instanceof Error) {
            this.loading = false;
            console.log("Client Side Error")
          } else {
            this.loading = false;
            console.log(err)
          }
        })
  }

  //Fetch Patient Medical Reocrd Illness
  fetchPatientMedicalRecordIllness() {

    this.fetchPatientMedicalRecordIllnessObj = {
      "hospital_reg_num": this.selectedPatientData.hospital_reg_num,
      "patientID": this.selectedPatientData.patientID,
      "medical_record_id": this.selectedPatientData.medical_record_id,
      "byWhomID": this.signObj.hospitalAdmin.userID,
      "byWhom": "admin"
    }
    this.loginService.getPatientMedicalRecordsIllnessData(this.fetchPatientMedicalRecordIllnessObj, this.signObj.access_token).
      subscribe(
        (res) => {
          if (res.response === 3) {
            this.loading = false;
            //this.a.a1 = res.illnessRecords;
            this.MedicalHistory = res.illnessRecords;
            console.log("fetched illness records data is : ", this.MedicalHistory);
            this.availableIllnessIDs = [];
            for (let i = 0; i <= this.MedicalHistory.length - 1; i++) {
              this.availableIllnessIDs.push({ value: this.MedicalHistory[i].illnessID });
            }
            console.log("Available Illness-ID's Of the Patient : ", this.availableIllnessIDs);

          }
          else if (res.response === 0) {
            this.MedicalHistory = [];
            this.loading = false;
          }
        },
        (err: HttpErrorResponse) => {
          if (err.error instanceof Error) {
            this.loading = false;
            console.log("Client Side Error")
          } else {
            this.loading = false;
            console.log(err)
          }
        })
  }

  //Fetch Patient Medications Data
  fetchPatientMedicationRecords() {
    //getPatientMedicationsData
    this.fetchPatientMedicationsObj = {
      "hospital_reg_num": this.selectedPatientData.hospital_reg_num,
      "patientID": this.selectedPatientData.patientID,
      "medical_record_id": this.selectedPatientData.medical_record_id,
      "byWhomID": this.signObj.hospitalAdmin.userID,
      "byWhom": "admin"
    }
    this.loginService.getPatientMedicationsData(this.fetchPatientMedicationsObj, this.signObj.access_token).
      subscribe(
        (res) => {
          if (res.response === 3) {
            this.loading = false;
            this.fetchedMedications = res.records;
            console.log("Res from Patient Medication Records Data : ", this.fetchedMedications);
          }
          else if (res.response === 0) {
            this.loading = false;
            this.fetchedMedications = [];
          }
        },
        (err: HttpErrorResponse) => {
          if (err.error instanceof Error) {
            this.loading = false;
            console.log("Client Side Error")
          } else {
            this.loading = false;
            console.log(err)
          }
        })
  }

  //Fetch Patient Medications Data
  fetchPatientSurgicalRecords() {
    //getPatientMedicationsData
    this.fetchPatientSurgicalRecordsObj = {
      "hospital_reg_num": this.selectedPatientData.hospital_reg_num,
      "patientID": this.selectedPatientData.patientID,
      "medical_record_id": this.selectedPatientData.medical_record_id,
      "byWhomID": this.signObj.hospitalAdmin.userID,
      "byWhom": "admin"
    }
    this.loginService.getPatientSurgicalRecordsData(this.fetchPatientSurgicalRecordsObj, this.signObj.access_token).
      subscribe(
        (res) => {
          if (res.response === 3) {
            this.loading = false;
            this.fetchPatientSurgicalRecordsData = res.illnessSurgicalRecords;
            console.log("Res from Patient fetchPatientSurgicalRecords Data : ", this.fetchPatientSurgicalRecordsData);
          }
          else if (res.response === 0) {
            this.loading = false;
            this.fetchPatientSurgicalRecordsData = [];
          }
        },
        (err: HttpErrorResponse) => {
          if (err.error instanceof Error) {
            this.loading = false;
            console.log("Client Side Error")
          } else {
            this.loading = false;
            console.log(err)
          }
        })
  }

  //Add Patient Immunization Data
  addPatImmunizationSubmit() {
    this.isLoading = true;
    let ngbDate = this.addPatImmunizationForm.controls['immunizationDate'].value;
    let myDate = new Date(ngbDate.year, ngbDate.month - 1, ngbDate.day);
    var dateAr = myDate.toLocaleDateString().split('/');
    var newDate = dateAr[2] + '/' + dateAr[0] + '/' + dateAr[1];
    var unixTimeData = new Date(newDate).getTime() / 1000;
    console.log("Immunization date mydate : ", unixTimeData);
    //console.log("Add PAt Immunization Form Data : ",this.addPatImmunizationForm);
    this.addImmunizationDataObj = {
      "hospital_reg_num": this.selectedPatientData.hospital_reg_num,
      "immunizationName": this.addPatImmunizationForm.value.immunizationName,
      "immunizationDate": '' + unixTimeData,
      "notes": this.addPatImmunizationForm.value.notes,
      "patientID": this.selectedPatientData.patientID,
      "medical_record_id": this.selectedPatientData.medical_record_id,
      "byWhom": this.addPatImmunizationForm.value.byWhom,
      "byWhomID": this.addPatImmunizationForm.value.byWhomID,
      "doctorMPID": this.addPatImmunizationForm.value.byWhomID,
      "doctorName": this.addPatImmunizationForm.value.doctorName
    }
    console.log("the sended obj data for pat immunization data add : ", this.addImmunizationDataObj);
    this.loginService.addPatientImmunizationData(this.addImmunizationDataObj, this.signObj.access_token).
      subscribe(
        (res) => {
          if (res.response === 3) {
            this.isLoading = false;
            this.fetchPatientImmunizationRecords();
            this.loading = false;
            this.openSnackBar(res.message, "");
            this.modalService.dismissAll();
            console.log("res from add patient immunization data from component Success : ", res.message, res.immunization_record_id);
          }
          else if (res.response === 0) {
            this.isLoading = false;
            //this.loading = false;
            this.openSnackBar(res.message, "");
            console.log("failure case", res.message);
            //this.modalService.dismissAll();
          }
        },
        (err: HttpErrorResponse) => {
          if (err.error instanceof Error) {
            this.isLoading = false;
            //this.loading = false;
            console.log("Client Side Error")
          } else {
            this.isLoading = false;
            //this.loading = false;
            console.log(err)
          }
        })

  }

  //Add Pat Medical Illness Record
  addPatMedicalRecordIllnessSubmit() {
    this.isLoading = true;
    let ngbDate = this.addPatIllnessForm.controls['startDate'].value;
    let myDate = new Date(ngbDate.year, ngbDate.month - 1, ngbDate.day);
    var dateAr = myDate.toLocaleDateString().split('/');
    var newDate = dateAr[2] + '/' + dateAr[0] + '/' + dateAr[1];
    var unixTimeData = new Date(newDate).getTime() / 1000;

    console.log("start date : ", unixTimeData);

    let ngbDate1 = this.addPatIllnessForm.controls['endDate'].value;
    let myDate1 = new Date(ngbDate1.year, ngbDate1.month - 1, ngbDate1.day);
    var dateAr1 = myDate1.toLocaleDateString().split('/');
    var newDate1 = dateAr1[2] + '/' + dateAr1[0] + '/' + dateAr1[1];
    var unixTimeData1 = new Date(newDate1).getTime() / 1000;

    console.log("end date : ", unixTimeData1);

    this.addPatMedicalRecordIllnessObj = {
      "hospital_reg_num": this.selectedPatientData.hospital_reg_num,
      "patientID": this.selectedPatientData.patientID,
      "medical_record_id": this.selectedPatientData.medical_record_id,
      "illnessCondition": this.addPatIllnessForm.value.illnessCondition,
      "symptoms": this.addPatIllnessForm.value.symptoms,
      "currentStatus": this.addPatIllnessForm.value.currentStatus,
      "description": this.addPatIllnessForm.value.description,
      "isCurrentIllness": this.addPatIllnessForm.value.isCurrentIllness,
      "byWhom": "admin",
      "byWhomID": this.signObj.hospitalAdmin.userID,
      "startDate": '' + unixTimeData,
      "endDate": '' + unixTimeData1
    }
    console.log("the sended obj data for pat immunization data add : ", this.addPatMedicalRecordIllnessObj);
    this.loginService.addPatientMedicalRecordIllnessData(this.addPatMedicalRecordIllnessObj, this.signObj.access_token).
      subscribe(
        (res) => {
          if (res.response === 3) {
            this.openSnackBar(res.message, "");
            //alert(res.message);
            this.openPatientDiagnostic();
            this.isLoading = false;
            this.createdIllnessID = res.illnessID;
            //this.loading = false;
            //this.modalService.dismissAll();
            this.ngOnInit();
            console.log("res from add patient medical record illness data from component Success : ", res.message, res.illnessID);
          }
          else if (res.response === 0) {
            this.isLoading = false;
            //this.loading = false;
            //alert(res.message);
            this.openSnackBar(res.message, "");
            console.log("failure case", res.message);
            //this.modalService.dismissAll();
          }
        },
        (err: HttpErrorResponse) => {
          if (err.error instanceof Error) {
            this.isLoading = false;
            //this.loading = false;
            console.log("Client Side Error")
          } else {
            this.isLoading = false;
            //this.loading = false;
            console.log(err)
          }
        })
  }

  //Add Pat Medical Diagnosis Notes
  addPatMedicalRecordDiagnosisNotesSubmit() {
    this.isLoading = true;
    let ngbDate = this.addPatIllnessDiagnosisForm.controls['diagnosisDate'].value;
    let myDate = new Date(ngbDate.year, ngbDate.month - 1, ngbDate.day);
    var dateAr = myDate.toLocaleDateString().split('/');
    var newDate = dateAr[2] + '/' + dateAr[0] + '/' + dateAr[1];
    var unixTimeData = new Date(newDate).getTime() / 1000;
    console.log("add ill medication date mydate : ", unixTimeData);
    //console.log("Add PAt Immunization Form Data : ",this.addPatImmunizationForm);
    this.addPatIllnessDiagnosisDataObj = {
      "hospital_reg_num": this.selectedPatientData.hospital_reg_num,
      "byWhom": this.addPatIllnessDiagnosisForm.value.byWhom,
      "byWhomID": this.addPatIllnessDiagnosisForm.value.byWhomID,
      "patientID": this.selectedPatientData.patientID,
      "medical_record_id": this.selectedPatientData.medical_record_id,
      "illnessID": this.createdIllnessID,
      "doctorMedicalPersonnelID": this.addPatIllnessDiagnosisForm.value.byWhomID,
      "doctorName": this.addPatIllnessDiagnosisForm.value.doctorName,
      "diagnosisDate": '' + unixTimeData,
      "diagnosis": this.addPatIllnessDiagnosisForm.value.diagnosis,
      "prescription": this.addPatIllnessDiagnosisForm.value.prescription,
      "remark": this.addPatIllnessDiagnosisForm.value.remark,

    }
    console.log("the sended obj data for pat ill diAgnosis data add : ", this.addPatIllnessDiagnosisDataObj);
    this.loginService.addPatientIllnessDiagnosisData(this.addPatIllnessDiagnosisDataObj, this.signObj.access_token).
      subscribe(
        (res) => {
          if (res.response === 3) {
            this.medicalPersonnelObj = "";
            this.isLoading = false;
            //alert(res.message);
            this.openSnackBar(res.message, "");
            this.openPatientMedications();
            //this.loading = false;
            //this.modalService.dismissAll();
            console.log("res from add patient ill diagnosis data from component Success : ", res.message);
          }
          else if (res.response === 0) {
            this.isLoading = false;
            //this.loading = false;
            //alert(res.message);
            this.openSnackBar(res.message, "");
            console.log("failure case", res.message);
            //this.modalService.dismissAll();
          }
        },
        (err: HttpErrorResponse) => {
          if (err.error instanceof Error) {
            this.isLoading = false;
            //this.loading = false;
            console.log("Client Side Error")
          } else {
            this.isLoading = false;
            //this.loading = false;
            console.log(err)
          }
        })

  }

  //Add Pat Medical Diagnosis Notes
  addPatIllSurgicalFormSubmit() {
    this.isLoading = true;
    let ngbDate = this.addPatIllnessSurgicalForm.controls['surgeryDate'].value;
    let myDate = new Date(ngbDate.year, ngbDate.month - 1, ngbDate.day);
    var dateAr = myDate.toLocaleDateString().split('/');
    var newDate = dateAr[2] + '/' + dateAr[0] + '/' + dateAr[1];
    var unixTimeData = new Date(newDate).getTime() / 1000;
    console.log("add ill addPatIllnessSurgicalForm date mydate : ", unixTimeData);
    //console.log("Add PAt Immunization Form Data : ",this.addPatImmunizationForm);

    let payLoad = this.addPatIllnessSurgicalForm.value;
    let formData = new FormData()

    formData.append("patientID", this.addPatientIllnessMedicationObj.patientID);
    formData.append("medical_record_id", this.addPatientIllnessMedicationObj.medical_record_id);
    formData.append("hospital_reg_num", this.addPatientIllnessMedicationObj.hospital_reg_num);
    formData.append("illnessID", this.addPatientIllnessMedicationObj.illnessID);
    formData.append("byWhom", this.addPatientIllnessMedicationObj.byWhom);
    formData.append("byWhomID", this.addPatientIllnessMedicationObj.byWhomID);
    formData.append("surgicalRecord", this.addPatIllnessSurgicalForm.get('profilePic').value);
    formData.append("moreDetails", this.addPatIllnessSurgicalForm.value.moreDetails);
    formData.append("doctorMedicalPersonnelID", this.addPatIllnessSurgicalForm.value.doctorMedicalPersonnelID);
    formData.append("doctorName", this.addPatIllnessSurgicalForm.value.doctorName);
    formData.append("surgeryProcedure", this.addPatIllnessSurgicalForm.value.surgeryProcedure);
    formData.append("surgeryDate", '' + unixTimeData);
    //formData.append("surgeryInformtion", this.addPatIllnessSurgicalForm.value.surgeryInformation);

    console.log("the sended obj data for pat ill surgical record data add : ", formData);
    this.loginService.addPatIllSurgicalFormData(formData, this.signObj.access_token).
      subscribe(
        (res) => {
          if (res.response === 3) {
            this.isLoading = false;
            this.removeUploadedFile3();
            //this.openPatientMedications();
            //this.loading = false;
            //alert(res.message);
            this.openSnackBar(res.message, "");
            this.modalService.dismissAll();
            console.log("res from add patient ill surgical data from component Success : ", res.message);
          }
          else if (res.response === 0) {
            this.isLoading = false;
            //this.loading = false;
            //alert(res.message);
            this.openSnackBar(res.message, "");
            console.log("failure case", res.message);
            //this.modalService.dismissAll();
          }
        },
        (err: HttpErrorResponse) => {
          this.isLoading = false;
          if (err.error instanceof Error) {
            this.isLoading = false;
            //this.loading = false;
            console.log("Client Side Error")
          } else {
            this.isLoading = false;
            //this.loading = false;
            console.log(err)
          }
        })

  }
  //Add Pat Medical Diagnosis Notes
  addPatIllSurgicalFormSubmitDirect() {
    this.isLoading = true;
    let ngbDate = this.addPatIllnessSurgicalFormDirect.controls['surgeryDate'].value;
    let myDate = new Date(ngbDate.year, ngbDate.month - 1, ngbDate.day);
    var dateAr = myDate.toLocaleDateString().split('/');
    var newDate = dateAr[2] + '/' + dateAr[0] + '/' + dateAr[1];
    var unixTimeData = new Date(newDate).getTime() / 1000;
    console.log("add ill addPatIllnessSurgicalFormDirect date mydate : ", unixTimeData);
    //console.log("Add PAt Immunization Form Data : ",this.addPatImmunizationForm);

    let payLoad = this.addPatIllnessSurgicalFormDirect.value;
    let formData = new FormData()

    formData.append("patientID", this.selectedPatientData.patientID);
    formData.append("medical_record_id", this.selectedPatientData.medical_record_id);
    formData.append("hospital_reg_num", this.selectedPatientData.hospital_reg_num);
    formData.append("illnessID", this.addPatIllnessSurgicalFormDirect.value.illnessID);
    formData.append("byWhom", "admin");
    formData.append("byWhomID", this.signObj.hospitalAdmin.userID);
    formData.append("surgicalRecord", this.addPatIllnessSurgicalFormDirect.get('profilePic').value);
    formData.append("moreDetails", this.addPatIllnessSurgicalFormDirect.value.moreDetails);
    formData.append("doctorMedicalPersonnelID", this.addPatIllnessSurgicalFormDirect.value.doctorMedicalPersonnelID);
    formData.append("doctorName", this.addPatIllnessSurgicalFormDirect.value.doctorName);
    formData.append("surgeryProcedure", this.addPatIllnessSurgicalFormDirect.value.surgeryProcedure);
    formData.append("surgeryDate", '' + unixTimeData);
    //formData.append("surgeryInformtion", this.addPatIllnessSurgicalForm.value.surgeryInformation);

    console.log("the sended obj data for pat ill surgical record data add direct : ", formData);
    this.loginService.addPatIllSurgicalFormData(formData, this.signObj.access_token).
      subscribe(
        (res) => {
          if (res.response === 3) {
            this.isLoading = false;
            this.removeUploadedFile3();
            this.ngOnInit();
            //this.openPatientMedications();
            //this.loading = false;
            //alert(res.message);
            this.openSnackBar(res.message, "");
            this.modalService.dismissAll();
            console.log("res from add patient ill surgical data from component Success : ", res.message);
          }
          else if (res.response === 0) {
            this.isLoading = false;
            //this.loading = false;
            //alert(res.message);
            this.openSnackBar(res.message, "");
            console.log("failure case", res.message);
            //this.modalService.dismissAll();
          }
        },
        (err: HttpErrorResponse) => {
          this.isLoading = false;
          if (err.error instanceof Error) {
            this.isLoading = false;
            //this.loading = false;
            console.log("Client Side Error")
          } else {
            this.isLoading = false;
            //this.loading = false;
            console.log(err)
          }
        })

  }

  //Add Pat Medical Diagnosis Notes
  editPatIllSurgicalFormSubmit() {
    //editPatIllnessSurgicalForm
    this.isLoading = true;
    let ngbDate = this.editPatIllnessSurgicalForm.controls['lastUpdateDate'].value;
    let myDate = new Date(ngbDate.year, ngbDate.month - 1, ngbDate.day);
    var dateAr = myDate.toLocaleDateString().split('/');
    var newDate = dateAr[2] + '/' + dateAr[0] + '/' + dateAr[1];
    var unixTimeData = new Date(newDate).getTime() / 1000;
    console.log("add ill editPatIllnessSurgicalForm date mydate : ", unixTimeData);

    let payLoad = this.editPatIllnessSurgicalForm.value;
    let formData = new FormData()

    formData.append("patientID", this.illnessSurgicalProcedures[0].patientID);
    formData.append("medical_record_id", this.illnessSurgicalProcedures[0].medical_record_id);
    formData.append("hospital_reg_num", this.illnessSurgicalProcedures[0].hospital_reg_num);
    formData.append("illnessID", this.illnessSurgicalProcedures[0].illnessID);
    formData.append("byWhom", "admin");
    formData.append("byWhomID", this.signObj.hospitalAdmin.userID);
    formData.append("surgicalRecord", this.editPatIllnessSurgicalForm.get('profilePic').value);
    formData.append("moreDetails", this.editPatIllnessSurgicalForm.value.surgeryInformation);
    formData.append("illnessSurgicalID", this.illnessSurgicalProcedures[0].illnessSurgicalID);
    formData.append("doctorMedicalPersonnelID", this.editPatIllnessSurgicalForm.value.doctorMedicalPersonnelID);
    formData.append("doctorName", this.editPatIllnessSurgicalForm.value.doctorName);
    formData.append("surgeryProcedure", this.editPatIllnessSurgicalForm.value.surgeryProcedure);
    formData.append("surgeryDate", '' + unixTimeData);
    //formData.append("surgeryInformtion", this.editPatIllnessSurgicalForm.value.surgeryInformation);

    console.log("the sended obj data for pat ill surgical record data update : ", formData);
    this.loginService.addPatIllSurgicalFormData(formData, this.signObj.access_token).
      subscribe(
        (res) => {
          if (res.response === 3) {
            this.isLoading = false;
            this.removeUploadedFile3();
            //this.openPatientMedications();
            //this.loading = false;
            //alert(res.message);
            this.openSnackBar(res.message, "");
            this.modalService.dismissAll();
            console.log("res from update patient ill surgical data from component Success : ", res.message);
          }
          else if (res.response === 0) {
            this.isLoading = false;
            //this.loading = false;
            //alert(res.message);
            this.openSnackBar(res.message, "");
            console.log("failure case", res.message);
            //this.modalService.dismissAll();
          }
        },
        (err: HttpErrorResponse) => {
          if (err.error instanceof Error) {
            this.isLoading = false;
            //this.loading = false;
            console.log("Client Side Error")
          } else {
            this.isLoading = false;
            //this.loading = false;
            console.log(err)
          }
        })

  }

  editPatIllSurgicalFormSubmitDirect(selectedSurgicalRecordData) {
    //editPatIllnessSurgicalForm
    this.isLoading = true;
    let ngbDate = this.editPatIllnessSurgicalFormDirect.controls['lastUpdateDate'].value;
    let myDate = new Date(ngbDate.year, ngbDate.month - 1, ngbDate.day);
    var dateAr = myDate.toLocaleDateString().split('/');
    var newDate = dateAr[2] + '/' + dateAr[0] + '/' + dateAr[1];
    var unixTimeData = new Date(newDate).getTime() / 1000;
    console.log("add ill editPatIllnessSurgicalFormDirect date mydate : ", unixTimeData);

    let payLoad = this.editPatIllnessSurgicalFormDirect.value;
    let formData = new FormData()

    formData.append("patientID", selectedSurgicalRecordData.patientID);
    formData.append("medical_record_id", selectedSurgicalRecordData.medical_record_id);
    formData.append("hospital_reg_num", selectedSurgicalRecordData.hospital_reg_num);
    formData.append("illnessID", selectedSurgicalRecordData.illnessID);
    formData.append("byWhom", "admin");
    formData.append("byWhomID", this.signObj.hospitalAdmin.userID);
    formData.append("surgicalRecord", this.editPatIllnessSurgicalFormDirect.get('profilePic').value);
    formData.append("moreDetails", this.editPatIllnessSurgicalFormDirect.value.moreDetails);
    formData.append("illnessSurgicalID", selectedSurgicalRecordData.illnessSurgicalID);
    formData.append("doctorMedicalPersonnelID", this.editPatIllnessSurgicalFormDirect.value.doctorMedicalPersonnelID);
    formData.append("doctorName", this.editPatIllnessSurgicalFormDirect.value.doctorName);
    formData.append("surgeryProcedure", this.editPatIllnessSurgicalFormDirect.value.surgeryProcedure);
    formData.append("surgeryDate", '' + unixTimeData);
    //formData.append("surgeryInformtion", this.editPatIllnessSurgicalFormDirect.value.surgeryInformation);

    console.log("the sended obj data for pat ill surgical record data update direct : ", formData);
    this.loginService.addPatIllSurgicalFormData(formData, this.signObj.access_token).
      subscribe(
        (res) => {
          if (res.response === 3) {
            this.isLoading = false;
            this.removeUploadedFile3Direct();
            this.ngOnInit();
            //this.openPatientMedications();
            //this.loading = false;
            //alert(res.message);
            this.openSnackBar(res.message, "");
            this.modalService.dismissAll();
            console.log("res from update patient ill surgical data from component Success : ", res.message);
          }
          else if (res.response === 0) {
            this.isLoading = false;
            //this.loading = false;
            //alert(res.message);
            this.openSnackBar(res.message, "");
            console.log("failure case", res.message);
            //this.modalService.dismissAll();
          }
        },
        (err: HttpErrorResponse) => {
          if (err.error instanceof Error) {
            this.isLoading = false;
            //this.loading = false;
            console.log("Client Side Error")
          } else {
            this.isLoading = false;
            //this.loading = false;
            console.log(err)
          }
        })

  }

  //Update Pat Immunization Data
  editPatImmunizationSubmit(selectedInvoicesData) {
    this.isLoading = true;

    let ngbDate = this.editPatImmunizationForm.controls['immunizationDate'].value;
    let myDate = new Date(ngbDate.year, ngbDate.month - 1, ngbDate.day);
    var dateAr = myDate.toLocaleDateString().split('/');
    var newDate = dateAr[2] + '/' + dateAr[0] + '/' + dateAr[1];
    var unixTimeData = new Date(newDate).getTime() / 1000;

    let editImmunizationsObj = {
      "hospital_reg_num": selectedInvoicesData.hospital_reg_num,
      "patientID": selectedInvoicesData.patientID,
      "medical_record_id": selectedInvoicesData.medical_record_id,
      "immunization_record_id": selectedInvoicesData.immunization_record_id,
      "immunizationName": this.editPatImmunizationForm.value.immunizationName,
      "immunizationDate": '' + unixTimeData,
      "notes": this.editPatImmunizationForm.value.notes,
      "byWhom": "admin",
      "byWhomID": this.signObj.hospitalAdmin.userID,
      "doctorMPID": this.editPatImmunizationForm.value.doctorMPID || selectedInvoicesData.doctorMPID,
      "doctorName": this.editPatImmunizationForm.value.doctorName || selectedInvoicesData.doctorName
    }
    console.log("Req for Edit Immunization Data : ", editImmunizationsObj);

    this.loginService.updatePatientImmunizationData(editImmunizationsObj, this.signObj.access_token).subscribe(
      (resForRescheduleAppointment) => {
        if (resForRescheduleAppointment.response === 3) {
          this.isLoading = false;
          this.openSnackBar(resForRescheduleAppointment.message, "");
          this.modalService.dismissAll();
          this.ngOnInit();
        }
        else {
          this.isLoading = false;
          this.openSnackBar(resForRescheduleAppointment.message, "");
        }
      },
      (err: HttpErrorResponse) => {
        if (err.error instanceof Error) {
          this.isLoading = false;
          this.loading = false;
          console.log("Client Side Error", err);
        } else {
          this.isLoading = false;
          this.loading = false;
          console.log("Server Side", err)
        }
      }
    )
  }

  //Edit Pat Illness Data
  editPatIllnessSubmit(selectedMedicalHistory) {
    console.log("the selected illness data : ", selectedMedicalHistory);

    this.isLoading = true;
    let ngbDate = this.editPatIllnessForm.controls['startDate'].value;
    let myDate = new Date(ngbDate.year, ngbDate.month - 1, ngbDate.day);
    var dateAr = myDate.toLocaleDateString().split('/');
    var newDate = dateAr[2] + '/' + dateAr[0] + '/' + dateAr[1];
    var unixTimeData21 = new Date(newDate).getTime() / 1000;

    console.log("start date : ", unixTimeData21);

    let ngbDate1 = this.editPatIllnessForm.controls['endDate'].value;
    let myDate1 = new Date(ngbDate1.year, ngbDate1.month - 1, ngbDate1.day);
    var dateAr1 = myDate1.toLocaleDateString().split('/');
    var newDate1 = dateAr1[2] + '/' + dateAr1[0] + '/' + dateAr1[1];
    var unixTimeData22 = new Date(newDate1).getTime() / 1000;

    console.log("end date : ", unixTimeData22);


    this.isLoading = true;
    let editPatIllnessObj = {
      "hospital_reg_num": selectedMedicalHistory.hospital_reg_num,
      "patientID": selectedMedicalHistory.patientID,
      "medical_record_id": selectedMedicalHistory.medical_record_id,
      "illnessCondition": this.editPatIllnessForm.value.illnessCondition,
      "symptoms": this.editPatIllnessForm.value.symptoms,
      "currentStatus": this.editPatIllnessForm.value.currentStatus,
      "description": this.editPatIllnessForm.value.description,
      "isCurrentIllness": this.editPatIllnessForm.value.isCurrentIllness,
      "illnessID": selectedMedicalHistory.illnessID,
      "byWhom": "admin",
      "byWhomID": this.signObj.hospitalAdmin.userID,
      "startDate": '' + unixTimeData21,
      "endDate": '' + unixTimeData22
    }
    console.log("Updated Illness Data : ", editPatIllnessObj);

    this.loginService.updatePatientIllnessData(editPatIllnessObj, this.signObj.access_token).subscribe(
      (res) => {
        if (res.response === 3) {
          this.isLoading = false;
          //alert(res.message);
          this.openPatientDiagnostic2();
          this.openSnackBar(res.message, "");
          //this.modalService.dismissAll();
          //this.ngOnInit();
        }
        else {
          this.isLoading = false;
          //alert(res.message);
          this.openSnackBar(res.message, "");
        }
      },
      (err: HttpErrorResponse) => {
        if (err.error instanceof Error) {
          this.isLoading = false;
          this.loading = false;
          console.log("Client Side Error", err);
        } else {
          this.isLoading = false;
          this.loading = false;
          console.log("Server Side", err)
        }
      }
    )
  }

  //Edit Pat Illness Diagnostic Data
  editPatMedicalRecordDiagnosticSubmit() {
    //this.illnessDiagnosticNotes
    this.isLoading = true;
    let ngbDate = this.editPatIllnessDiagnosisForm.controls['diagnosisDate'].value;
    let myDate = new Date(ngbDate.year, ngbDate.month - 1, ngbDate.day);
    var dateAr = myDate.toLocaleDateString().split('/');
    var newDate = dateAr[2] + '/' + dateAr[0] + '/' + dateAr[1];
    var unixTimeData = new Date(newDate).getTime() / 1000;
    console.log("add ill medication date mydate : ", unixTimeData);
    //console.log("Add PAt Immunization Form Data : ",this.addPatImmunizationForm);
    this.editPatIllnessDiagnosisDataObj = {
      "hospital_reg_num": this.illnessDiagnosticNotes[0].hospital_reg_num,
      "byWhom": this.editPatIllnessDiagnosisForm.value.byWhom,
      "byWhomID": this.editPatIllnessDiagnosisForm.value.byWhomID,
      "patientID": this.illnessDiagnosticNotes[0].patientID,
      "medical_record_id": this.illnessDiagnosticNotes[0].medical_record_id,
      "illnessID": this.illnessDiagnosticNotes[0].illnessID,
      "doctorMedicalPersonnelID": this.editPatIllnessDiagnosisForm.value.doctorMedicalPersonnelID,
      "doctorName": this.editPatIllnessDiagnosisForm.value.doctorName,
      "diagnosisDate": '' + unixTimeData,
      "diagnosis": this.editPatIllnessDiagnosisForm.value.diagnosis,
      "prescription": this.editPatIllnessDiagnosisForm.value.prescription,
      "remark": this.editPatIllnessDiagnosisForm.value.remark,
      "illnessDiagnosisID": this.illnessDiagnosticNotes[0].illnessDiagnosisID
    }
    console.log("the sended obj data for pat ill diAgnosis data update : ", this.editPatIllnessDiagnosisDataObj);
    this.loginService.editPatientIllnessDiagnosisData(this.editPatIllnessDiagnosisDataObj, this.signObj.access_token).
      subscribe(
        (res) => {
          if (res.response === 3) {
            this.isLoading = false;
            //alert(res.message);
            this.openSnackBar(res.message, "");
            this.openPatientMedications2();
            //this.loading = false;
            //this.modalService.dismissAll();
            console.log("res from update patient ill diagnosis data from component Success : ", res.message);
          }
          else if (res.response === 0) {
            this.isLoading = false;
            //this.loading = false;
            //alert(res.message);
            this.openSnackBar(res.message, "");
            console.log("failure case", res.message);
            //this.modalService.dismissAll();
          }
        },
        (err: HttpErrorResponse) => {
          if (err.error instanceof Error) {
            this.isLoading = false;
            //this.loading = false;
            console.log("Client Side Error")
          } else {
            this.isLoading = false;
            //this.loading = false;
            console.log(err)
          }
        })
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      //this.removeUploadedFile();
      this.removeUploadedFile1();
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      //this.removeUploadedFile();
      this.removeUploadedFile1();
      return 'by clicking on a backdrop';
    } else {
      //this.removeUploadedFile();
      this.removeUploadedFile1();
      return `with: ${reason}`;
    }
  }

  //Open DoctorsList Model
  openDoctorMethod(doctorsModel) {
    this.modalService.open(doctorsModel, { ariaLabelledBy: 'modal-basic-title', centered: true, size: "md", backdrop: false }).result.then(
      (result) => {
        this.medicalPersonnelObj = [];
        this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        this.medicalPersonnelObj = [];
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
  }

  viewAddPhysicalExamContent(addPhysicalExamContent) {
    this.viewManualInput();
    this.viewBasicExam();
    this.modalService.open(addPhysicalExamContent, {
      ariaLabelledBy: 'modal-basic-title',
      centered: true, size: "md", backdrop: false
    }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      this.basicExamForm.reset();
      this.belowForm.reset();
      this.addPatientPhysicalExamFileForm.reset();
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      this.basicExamForm.reset();
      this.belowForm.reset();
      this.addPatientPhysicalExamFileForm.reset();
    });
  }

  openAddMedicalHistoryMethod(addMedicalHistoryModel) {

    this.openPatientIllness()
    //this.viewPatientIllness = false;
    this.viewManualInput();
    this.modalService.open(addMedicalHistoryModel, { ariaLabelledBy: 'modal-basic-title', centered: true, size: "md", backdrop: false }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      this.addPatIllnessForm.reset();
      this.addPatIllnessDiagnosisForm.reset();
      this.addPatIllMedicationManuallyForm.reset();
      this.addPatientMedHistoryFileForm.reset();
      this.addPatIllnessSurgicalForm.reset();
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      this.addPatIllnessForm.reset();
      this.addPatIllnessDiagnosisForm.reset();
      this.addPatIllMedicationManuallyForm.reset();
      this.addPatientMedHistoryFileForm.reset();
      this.addPatIllnessSurgicalForm.reset();
    });
  }

  openEditMedicalHistoryMethod(editMedicalHistoryModel, selectedMedicalHistory) {

    var timestamp = selectedMedicalHistory.startDate; // replace your timestamp
    var date1 = new Date(timestamp * 1000);
    this.dateToShow = ('0' + date1.getFullYear()).slice(-2) + '-' + ('0' + (date1.getMonth() + 1)).slice(-2) + '-' + date1.getDate();

    var timestamp2 = selectedMedicalHistory.endDate; // replace your timestamp
    var date2 = new Date(timestamp2 * 1000);
    this.dateToShow2 = ('0' + date2.getFullYear()).slice(-2) + '-' + ('0' + (date2.getMonth() + 1)).slice(-2) + '-' + date2.getDate();

    this.medicinesData.length = 0;
    this.editPatIllMedicationManuallyForm.value.editMedicationArray.length = 0;

    this.openPatientIllness2();
    //this.viewPatientIllness2 = false;
    this.viewManualInput2();
    this.editPatIllnessForm.patchValue({

      "illnessCondition": selectedMedicalHistory.illnessCondition,
      "symptoms": selectedMedicalHistory.symptoms,
      "currentStatus": selectedMedicalHistory.currentStatus,
      "description": selectedMedicalHistory.description,
      "isCurrentIllness": '' + selectedMedicalHistory.isCurrentIllness,
      "startDate": selectedMedicalHistory.startDate,
      "endDate": selectedMedicalHistory.endDate

    })


    this.fetchPatIllMedicationDataObj = {
      "hospital_reg_num": selectedMedicalHistory.hospital_reg_num,
      "byWhom": "admin",
      "byWhomID": this.signObj.hospitalAdmin.userID,
      "patientID": selectedMedicalHistory.patientID,
      "medical_record_id": selectedMedicalHistory.medical_record_id,
      "illnessID": selectedMedicalHistory.illnessID
    }
    this.loginService.fetchPatientMedicationData(this.fetchPatIllMedicationDataObj, this.signObj.access_token).
      subscribe(
        (res) => {

          this.medicinesData.length = 0;
          this.editPatIllMedicationManuallyForm.value.editMedicationArray.length = 0;
          if (res.response === 3) {
            this.illnessMedications = res.illnessMedicationRecords;
            console.log("Fetched ill medications data : ", this.illnessMedications);
            this.medicinesData.length = 0;
            this.editPatIllMedicationManuallyForm.value.editMedicationArray.length = 0;
            //this.editPatIllMedicationManuallyForm.value.editMedicationArray = this.illnessMedications[0].mannualPrescriptions.medicines;
            this.medicinesData = this.illnessMedications[0].mannualPrescriptions.medicines;
            console.log("fetched medicines having attachments data is : ", res);

            if (this.illnessMedications && this.illnessMedications[0].attachedPrescriptions && this.illnessMedications[0].attachedPrescriptions.attachments) {
              this.medicationAttachmentData = this.illnessMedications[0].attachedPrescriptions.attachments;

            }
            let unixDates = this.illnessMedications[0].mannualPrescriptions.updateDate.addedDate / 1000;
            var date1 = new Date(unixDates * 1000);
            let dateToShow44 = date1.getFullYear() + '-' + ('0' + (date1.getMonth() + 1)).slice(-2) + '-' + ('0' + date1.getDate()).slice(-2);
            this.patchPatientUpdateEditMedication(this.medicinesData);
            console.log("attachments data : ", this.medicationAttachmentData);

            if (this.medicationAttachmentData != "") {
              this.editPatientMedHistoryFileForm.patchValue({
                "medicationDate": dateToShow44,
                "prescription1MoreDetails": this.medicationAttachmentData[0].moreDetails
              })
            }
            else {
              this.editPatientMedHistoryFileForm.patchValue({
                "medicationDate": "",
                "prescription1MoreDetails": ""
              });
            }
            // this.patchPatientUpdateEditMedicationAttachment(this.medicationAttachmentData);

            this.editPatIllMedicationManuallyForm.patchValue({
              instructions: "----------"
            })
            this.isLoading = false;
            this.loading = false;
            this.openSnackBar(res.message, "");

          }
          else if (res.response === 0) {
            this.isLoading = false;
            this.openSnackBar(res.message, "");
            console.log("failure case", res.message);
          }
        },
        (err: HttpErrorResponse) => {
          if (err.error instanceof Error) {
            this.isLoading = false;
            console.log("Client Side Error")
          } else {
            this.isLoading = false;
            console.log(err)
          }
        })

    this.loginService.fetchPatientSurgicalData(this.fetchPatIllMedicationDataObj, this.signObj.access_token).
      subscribe(
        (res) => {
          if (res.response === 3) {
            this.illnessSurgicalProcedures = res.illnessSurgicalRecords;
            this.illnessSurgicalAttachments = res.illnessSurgicalRecords[0].attachments;
            let unixDates = this.illnessSurgicalProcedures[0].surgeryDate;
            var date1 = new Date(unixDates * 1000);
            let dateToShow = date1.getFullYear() + '-' + ('0' + (date1.getMonth() + 1)).slice(-2) + '-' + ('0' + date1.getDate()).slice(-2);
            let timeToShow = date1.getHours() + ':' + date1.getMinutes() + ':' + date1.getSeconds();
            this.editPatIllnessSurgicalForm.patchValue({
              "lastUpdateDate": dateToShow,
              "time": timeToShow,
              "doctorName": this.illnessSurgicalProcedures[0].doctorName,
              "surgeryProcedure": this.illnessSurgicalProcedures[0].surgeryProcedure,
              "surgeryInformation": this.illnessSurgicalProcedures[0].surgeryInformation
            })
            this.isLoading = false;
            this.loading = false;
            this.openSnackBar(res.message, "");
            console.log("res from illnessSurgicalRecordsData Success : ", res.message);
            console.log("the fetched illnessSurgicalRecordsData is : ", this.illnessSurgicalProcedures);
          }
          else if (res.response === 0) {
            this.isLoading = false;
            this.openSnackBar(res.message, "");
            console.log("failure case", res.message);
          }
        },
        (err: HttpErrorResponse) => {
          if (err.error instanceof Error) {
            this.isLoading = false;
            console.log("Client Side Error")
          } else {
            this.isLoading = false;
            console.log(err)
          }
        })

    this.loginService.fetchPatientDiagnosisData(this.fetchPatIllMedicationDataObj, this.signObj.access_token).
      subscribe(
        (res) => {
          if (res.response === 3) {
            this.illnessDiagnosticNotes = res.illnessDiagnosisRecords;


            let unixDates = this.illnessDiagnosticNotes[0].diagnosisDate;
            var date11 = new Date(unixDates * 1000);
            var dateToShow12 = date11.getFullYear() + '-' + ('0' + (date11.getMonth() + 1)).slice(-2) + '-' + ('0' + date11.getDate()).slice(-2);

            this.editPatIllnessDiagnosisForm.patchValue({
              "diagnosisDate": dateToShow12,
              "doctorName": this.illnessDiagnosticNotes[0].doctorName,
              "doctorMedicalPersonnelID": this.illnessDiagnosticNotes[0].doctorMedicalPersonnelID,
              "diagnosis": this.illnessDiagnosticNotes[0].diagnosis,
              "prescription": this.illnessDiagnosticNotes[0].prescription,
              "remark": this.illnessDiagnosticNotes[0].remark,
              "byWhomID": this.illnessDiagnosticNotes[0].tracking[0].byWhomID,
              "byWhom": this.illnessDiagnosticNotes[0].tracking[0].byWhom
            })
            this.isLoading = false;
            this.loading = false;
            this.openSnackBar(res.message, "");
            console.log("res from illnessDiagnosisRecordsData Success : ", res.message);
            console.log("the fetched illnessDiagnosisRecordsData is : ", this.illnessDiagnosticNotes);
          }
          else if (res.response === 0) {
            this.isLoading = false;
            this.openSnackBar(res.message, "");
            console.log("failure case", res.message);
          }
        },
        (err: HttpErrorResponse) => {
          if (err.error instanceof Error) {
            this.isLoading = false;
            console.log("Client Side Error")
          } else {
            this.isLoading = false;
            console.log(err)
          }
        })

    this.modalService.open(editMedicalHistoryModel, { ariaLabelledBy: 'modal-basic-title', centered: true, size: "md", backdrop: false }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      //let emptyMedicinesData =  this.medicinesData.length = [];
      //this.patchPatientUpdateEditMedication(emptyMedicinesData);
      //this.editPatIllMedicationManuallyForm.value.editMedicationArray.length = 0;
      let emptyMedicinesData = this.medicinesData.length;
      for (let i = -1; i <= emptyMedicinesData + 1; i++) {
        this.removeEditMedication(i);
        console.log("removed medication num : ", i);

      }
      this.medicationAttachmentData = [];
      this.editPatientMedHistoryFileForm.value.prescription1MoreDetails = "";
      //editMedicationArray: any[] = [];
      console.log("the medicanes data after close edit medical history model : ", emptyMedicinesData);

    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      //let emptyMedicinesData =  this.medicinesData.length = [];
      //this.patchPatientUpdateEditMedication(emptyMedicinesData);
      //this.editPatIllMedicationManuallyForm.value.editMedicationArray.length = 0;
      let emptyMedicinesData = this.medicinesData.length;

      for (let i = -1; i <= emptyMedicinesData + 1; i++) {
        this.removeEditMedication(i);
        console.log("removed medication num : ", i);

      }
      this.medicationAttachmentData = [];
      this.editPatientMedHistoryFileForm.value.prescription1MoreDetails = "";
      console.log("the medicanes data after close edit medical history model : ", emptyMedicinesData);
    });
  }

  openAddMedicationsMethod(addMedicationsModel) {
    this.viewManualInput();
    this.modalService.open(addMedicationsModel, { ariaLabelledBy: 'modal-basic-title', centered: true, size: "md", backdrop: false }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      this.addPatIllMedicationManuallyFormDirectly.reset();
      this.addPatientMedHistoryFileFormDirect.reset();
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      this.addPatIllMedicationManuallyFormDirectly.reset();
      this.addPatientMedHistoryFileFormDirect.reset();
    });
  }

  openAddSurgicalProceduresMethod(addSurgicalProceduresModel) {
    this.modalService.open(addSurgicalProceduresModel, { ariaLabelledBy: 'modal-basic-title', centered: true, size: "md", backdrop: false }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      this.addPatIllnessSurgicalFormDirect.reset();
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      this.addPatIllnessSurgicalFormDirect.reset();
    });
  }

  openAddImmunizationsMethod(addImmunizationsModel) {
    this.modalService.open(addImmunizationsModel, { ariaLabelledBy: 'modal-basic-title', centered: true, size: "md", backdrop: false }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      this.addPatImmunizationForm.reset();
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      this.addPatImmunizationForm.reset();
    });
  }

  openViewModal(viewContent) {
    this.modalService.open(viewContent, { ariaLabelledBy: 'modal-basic-title', centered: true, size: "md", backdrop: false }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  openViewMedicalHistoryMethod(viewMedicalHistoryModel, selectedMedicalHistory) {
    this.isLoading = false;
    this.loading = false;
    this.fetchPatIllMedicationDataObj = {
      "hospital_reg_num": selectedMedicalHistory.hospital_reg_num,
      "byWhom": "admin",
      "byWhomID": this.signObj.hospitalAdmin.userID,
      "patientID": selectedMedicalHistory.patientID,
      "medical_record_id": selectedMedicalHistory.medical_record_id,
      "illnessID": selectedMedicalHistory.illnessID
    }
    this.loginService.fetchPatientMedicationData(this.fetchPatIllMedicationDataObj, this.signObj.access_token).
      subscribe(
        (res) => {
          if (res.response === 3) {
            this.illnessMedications = res.illnessMedicationRecords;
            this.fetchedmedicinesData = this.illnessMedications[0].mannualPrescriptions.medicines;

            let unixDates = this.illnessMedications[0].mannualPrescriptions.updateDate / 1000;
            var date1 = new Date(unixDates * 1000);
            let dateToShow44 = date1.getFullYear() + '-' + ('0' + (date1.getMonth() + 1)).slice(-2) + '-' + ('0' + date1.getDate()).slice(-2);
            this.viewPatMedicationForm.patchValue({
              "medicationDate": dateToShow44,
              "instructions": "------------"
            })
            //this.illnessMedicationRecordsData.push(res.illnessMedicationRecords);
            this.isLoading = false;
            this.loading = false;
            this.openSnackBar(res.message, "");
            console.log("res from fetchPatientMedicationData Success : ", res.message);
            console.log("res from fetchPatientMedicationData Success total data : ", res);
            console.log("the fetched Ill Medication Records Data is : ", this.illnessMedications);
            console.log("medication date : ", this.illnessMedications[0].mannualPrescriptions.updateDate.addedDate);

          }
          else if (res.response === 0) {
            this.isLoading = false;
            this.openSnackBar(res.message, "");
            console.log("failure case", res.message);
          }
        },
        (err: HttpErrorResponse) => {
          if (err.error instanceof Error) {
            this.isLoading = false;
            console.log("Client Side Error")
          } else {
            this.isLoading = false;
            console.log(err)
          }
        })

    this.loginService.fetchPatientSurgicalData(this.fetchPatIllMedicationDataObj, this.signObj.access_token).
      subscribe(
        (res) => {
          if (res.response === 3) {
            console.log("pat surgical record : " + res.illnessSurgicalReocrds);
            this.illnessSurgicalProcedures = res.illnessSurgicalRecords;
            let unixDates = this.illnessSurgicalProcedures[0].surgeryDate;
            var date1 = new Date(unixDates * 1000);
            this.dateToShow = date1.getFullYear() + '-' + ('0' + (date1.getMonth() + 1)).slice(-2) + '-' + ('0' + date1.getDate()).slice(-2);
            let timeToShow = date1.getHours() + ':' + date1.getMinutes() + ':' + date1.getSeconds();
            this.viewPatSurgicalForm.patchValue({
              "lastUpdateDate": this.dateToShow,
              "time": timeToShow,
              "doctorName": this.illnessSurgicalProcedures[0].doctorName,
              "surgeryProcedure": this.illnessSurgicalProcedures[0].surgeryProcedure,
              "moreInfo": "----------"
            })
            this.isLoading = false;
            this.loading = false;
            this.openSnackBar(res.message, "");
            console.log("res from illnessSurgicalRecordsData Success : ", res.message);
            console.log("the fetched illnessSurgicalRecordsData is : ", this.illnessSurgicalProcedures);
          }
          else if (res.response === 0) {
            this.isLoading = false;
            this.openSnackBar(res.message, "");
            console.log("failure case", res.message);
          }
        },
        (err: HttpErrorResponse) => {
          if (err.error instanceof Error) {
            this.isLoading = false;
            console.log("Client Side Error")
          } else {
            this.isLoading = false;
            console.log(err)
          }
        })

    this.loginService.fetchPatientDiagnosisData(this.fetchPatIllMedicationDataObj, this.signObj.access_token).
      subscribe(
        (res) => {
          if (res.response === 3) {
            this.illnessDiagnosticNotes = res.illnessDiagnosisRecords;


            let unixDates = this.illnessDiagnosticNotes[0].diagnosisDate;
            var date11 = new Date(unixDates * 1000);
            var dateToShow11 = date11.getFullYear() + '-' + ('0' + (date11.getMonth() + 1)).slice(-2) + '-' + ('0' + date11.getDate()).slice(-2);

            this.viewPatDiagnosticForm.patchValue({
              "diagnosisDate": dateToShow11,
              "doctorName": this.illnessDiagnosticNotes[0].doctorName,
              "diagnosis": this.illnessDiagnosticNotes[0].diagnosis,
              "prescription": this.illnessDiagnosticNotes[0].prescription,
              "remark": this.illnessDiagnosticNotes[0].remark
            })
            this.isLoading = false;
            this.loading = false;
            this.openSnackBar(res.message, "");
            console.log("res from illnessDiagnosisRecordsData Success : ", res.message);
            console.log("the fetched illnessDiagnosisRecordsData is : ", this.illnessDiagnosticNotes);
          }
          else if (res.response === 0) {
            this.isLoading = false;
            this.openSnackBar(res.message, "");
            console.log("failure case", res.message);
          }
        },
        (err: HttpErrorResponse) => {
          if (err.error instanceof Error) {
            this.isLoading = false;
            console.log("Client Side Error")
          } else {
            this.isLoading = false;
            console.log(err)
          }
        })

    this.modalService.open(viewMedicalHistoryModel, { ariaLabelledBy: 'modal-basic-title', centered: true, size: "md", backdrop: false }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      this.medicinesData = [];
      this.fetchedmedicinesData = [];
      this.viewPatDiagnosticForm.patchValue({
        "diagnosisDate": "",
        "doctorName": "",
        "diagnosis": "",
        "prescription": "",
        "remark": ""
      });
      this.viewPatSurgicalForm.patchValue({
        "lastUpdateDate": "",
        "time": "",
        "doctorName": "",
        "surgeryProcedure": "",
        "moreInfo": ""
      })

    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      this.medicinesData = [];
      this.viewPatDiagnosticForm.patchValue({
        "diagnosisDate": "",
        "doctorName": "",
        "diagnosis": "",
        "prescription": "",
        "remark": ""
      });
      this.viewPatSurgicalForm.patchValue({
        "lastUpdateDate": "",
        "time": "",
        "doctorName": "",
        "surgeryProcedure": "",
        "moreInfo": ""
      })
    });
  }

  openViewMedicationRecordMethod(viewMedicationRecordModel, selectedMedicationData) {
    console.log("Data View Medications of the Selected patient : ", selectedMedicationData);
    this.fetchedmedicinesDataDirect = selectedMedicationData.mannualPrescriptions.medicines;
    this.modalService.open(viewMedicationRecordModel, { ariaLabelledBy: 'modal-basic-title', centered: true, size: "md", backdrop: false }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;

    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  openEditMedicationRecordMethod(editMedicationRecordModel, selectedMedicationData) {
    console.log("selcted medication data for update  : ", selectedMedicationData);

    this.editPatIllMedicationManuallyFormDirect.value.editMedicationArrayDirect.length = 0;
    this.medicinesData = selectedMedicationData.mannualPrescriptions.medicines;

    if (selectedMedicationData && selectedMedicationData.attachedPrescriptions && selectedMedicationData.attachedPrescriptions.attachments) {
      this.medicationAttachmentDataDirect = selectedMedicationData.attachedPrescriptions.attachments;

    }
    let unixDates = selectedMedicationData.mannualPrescriptions.updateDate.addedDate / 1000;
    var date1 = new Date(unixDates * 1000);
    let dateToShow44 = date1.getFullYear() + '-' + ('0' + (date1.getMonth() + 1)).slice(-2) + '-' + ('0' + date1.getDate()).slice(-2);
    this.patchPatientUpdateEditMedicationDirect(this.medicinesData);
    console.log("attachments data : ", this.medicationAttachmentDataDirect);

    if (this.medicationAttachmentDataDirect != "") {
      this.editPatientMedHistoryFileForm.patchValue({
        "medicationDate": dateToShow44,
        "prescription1MoreDetails": this.medicationAttachmentDataDirect[0].moreDetails
      })
    }
    else {
      this.editPatientMedHistoryFileForm.patchValue({
        "medicationDate": "",
        "prescription1MoreDetails": ""
      });
    }
    //this.patchPatientUpdateEditMedicationAttachment(this.medicationAttachmentData);

    this.editPatIllMedicationManuallyForm.patchValue({
      instructions: "----------"
    })

    this.viewManualInput3();
    this.modalService.open(editMedicationRecordModel, { ariaLabelledBy: 'modal-basic-title', centered: true, size: "md", backdrop: false }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;

      let emptyMedicinesData = this.medicinesData.length;
      for (let i = -1; i <= emptyMedicinesData + 1; i++) {
        this.removeEditMedication(i);
        console.log("removed medication num : ", i);

      }
      this.medicationAttachmentDataDirect = [];
      this.editPatientMedHistoryFileFormDirect.value.prescription1MoreDetails = "";
      console.log("the medicanes data after close edit medical history model : ", emptyMedicinesData);



    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;

      let emptyMedicinesData = this.medicinesData.length;
      for (let i = -1; i <= emptyMedicinesData + 1; i++) {
        this.removeEditMedicationDirect(i);
        console.log("removed medication num : ", i);

      }
      this.medicationAttachmentDataDirect = [];
      this.editPatientMedHistoryFileFormDirect.value.prescription1MoreDetails = "";
      console.log("the medicanes data after close edit medical history model : ", emptyMedicinesData);

    });
  }

  openDeleteMedicationMethod(viewDeleteMedicalHistoryModel, selectedMedicationData) {
    this.modalService.open(viewDeleteMedicalHistoryModel, { ariaLabelledBy: 'modal-basic-title', centered: true, size: "md", backdrop: false }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;

    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  openEditPatExamRecordModal(viewPatExamRecordsContent) {
    this.viewManualInput();
    this.viewBasicExam();
    this.modalService.open(viewPatExamRecordsContent, { ariaLabelledBy: 'modal-basic-title', centered: true, size: "md", backdrop: false }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  openEditPhyExamModal(viewEditPhyExamContent, selectedInvoicesData) {

    console.log("selected Phy exam data : ", selectedInvoicesData);

    if (selectedInvoicesData && selectedInvoicesData.attachment) {
      this.viewAttachment();
      this.fetchedPatPhyExamAttachments = selectedInvoicesData.attachment;
      this.HaveBodyIndex = true;
      console.log("dont have bodyindex");
      console.log("selected phy exam attachment : ", selectedInvoicesData.attachment);
    }
    else {
      this.HaveBodyIndex = true;
      this.viewManualInput();
      this.viewBasicExam();
      this.basicExamEditForm.patchValue({
        height: (selectedInvoicesData.bodyIndex.height).substr(0, (selectedInvoicesData.bodyIndex.height).indexOf(' ')),//str.substr(0,str.indexOf(' '));
        bmi: selectedInvoicesData.bodyIndex.bmi,
        weight: (selectedInvoicesData.bodyIndex.weight).substr(0, (selectedInvoicesData.bodyIndex.weight).indexOf(' ')),
        bmr: [""],
        waistline: (selectedInvoicesData.bodyIndex.waistline).substr(0, (selectedInvoicesData.bodyIndex.waistline).indexOf(' ')),
        bloodPressure: selectedInvoicesData.bodyIndex.bloodPressure,
      })
      this.selectedPatSystemExamData = selectedInvoicesData.physicalExamination;
      console.log("selectedPatSystemExamData : ", this.selectedPatSystemExamData);

      this.belowEditForm.patchValue({
        other: selectedInvoicesData.other,
        physicianCommentsOrRecomdations: selectedInvoicesData.physicianCommentsOrRecomdations
      })
    }
    this.modalService.open(viewEditPhyExamContent, { ariaLabelledBy: 'modal-basic-title', centered: true, size: "md", backdrop: false }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      this.fetchedPatPhyExamAttachments = "";
      this.selectedPatSystemExamData = this.physicalExaminationData;
      this.basicExamEditForm.patchValue({
        height: [""],
        bmi: [""],
        weight: [""],
        bmr: [""],
        waistline: [""],
        bloodPressure: [""],
      });
      this.belowEditForm.patchValue({
        other: [""],
        physicianCommentsOrRecomdations: [""]
      })
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      this.fetchedPatPhyExamAttachments = "";
      this.selectedPatSystemExamData = this.physicalExaminationData;
      this.basicExamEditForm.patchValue({
        height: [""],
        bmi: [""],
        weight: [""],
        bmr: [""],
        waistline: [""],
        bloodPressure: [""],
      });
      this.belowEditForm.patchValue({
        other: [""],
        physicianCommentsOrRecomdations: [""]
      })
    });

  }

  openEditImmunizationsMethod(editImmunizationsModel, selectedInvoicesData) {
    //this.dateToShow = selectedInvoicesData.immunizationDate;
    let date = new Date(selectedInvoicesData.immunizationDate).toLocaleDateString().split("/", 3)

    let unixDates = selectedInvoicesData.immunizationDate;
    var date1 = new Date(unixDates * 1000);
    this.dateToShow = date1.getFullYear() + '-' + ('0' + (date1.getMonth() + 1)).slice(-2) + '-' + ('0' + date1.getDate()).slice(-2);

    console.log("unix to date format : ", this.dateToShow);

    this.editPatImmunizationForm.get('immunizationDate').setValue({
      "year": parseInt(date[2]),
      "month": parseInt(date[1]),
      "day": parseInt(date[0])
    })
    this.editPatImmunizationForm.patchValue({
      "immunizationName": selectedInvoicesData.immunizationName,
      "immunizationName1": selectedInvoicesData.immunizationName,
      "immunizationDate": selectedInvoicesData.immunizationDate,
      "notes": selectedInvoicesData.notes,
      "doctorName": selectedInvoicesData.doctorName
    })
    this.modalService.open(editImmunizationsModel, { ariaLabelledBy: 'modal-basic-title', centered: true, size: "md", backdrop: false }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;

    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });

  }

  openViewImmunizationModal(viewImmunizationModel, selectedInvoicesData) {

    this.modalService.open(viewImmunizationModel, { ariaLabelledBy: 'modal-basic-title', centered: true, size: "md", backdrop: false }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;

    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });

  }

  openDeletePhyExamModal(viewDeletePhyExamContent) {
    this.modalService.open(viewDeletePhyExamContent, { ariaLabelledBy: 'modal-basic-title', centered: true, size: "md", backdrop: false }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;

    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  openDeletePhyExamModalAttachment(viewDeletePhyExamContentAttachment) {
    this.modalService.open(viewDeletePhyExamContentAttachment, { ariaLabelledBy: 'modal-basic-title', centered: true, size: "md", backdrop: false }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;

    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  openDeleteMedicalHistoryMethod(viewDeleteMedicalHistoryModel, selectedMedicalHistory) {
    this.modalService.open(viewDeleteMedicalHistoryModel, { ariaLabelledBy: 'modal-basic-title', centered: true, size: "md", backdrop: false }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;

    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  openDeleteImmunizationMethod(viewDeleteImmunizationModel) {
    this.modalService.open(viewDeleteImmunizationModel, { ariaLabelledBy: 'modal-basic-title', centered: true, size: "md", backdrop: false }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;

    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  //
  deletePatientPhyExamData(selectedMedicalHistory) {
    this.isLoading = true;
    this.deletePatientPhyExamRecordObj = {
      "hospital_reg_num": selectedMedicalHistory.hospital_reg_num,
      "medical_record_id": selectedMedicalHistory.medical_record_id,
      "patientID": selectedMedicalHistory.patientID,
      "physical_exam_id": selectedMedicalHistory.physical_exam_id,
      "byWhom": "admin",
      "byWhomID": this.signObj.hospitalAdmin.userID
    }
    this.loginService.deletePatientPhysicalExamRecordData(this.deletePatientPhyExamRecordObj, this.signObj.access_token).
      subscribe(
        (res) => {
          if (res.response === 3) {
            this.isLoading = false;
            //this.loading = false;
            this.openSnackBar(res.message, "");
            this.modalService.dismissAll();
            //this.ngOnInit()
            console.log("Res from Patient Phy Exam Data Delete : ", res.message);
            this.fetchPatientPhysicalExamRecords();
          }
          else if (res.response === 0) {
            this.isLoading = false;
            //this.loading = false;
            this.openSnackBar(res.message, "");
            console.log("Res from Patient Phy Exam Data Delete : ", res.message);
            //this.modalService.dismissAll();
          }
        },
        (err: HttpErrorResponse) => {
          if (err.error instanceof Error) {
            this.isLoading = false;
            //this.loading = false;
            console.log("Client Side Error")
          } else {
            this.isLoading = false;
            //this.loading = false;
            console.log(err)
          }
        })
  }

  deletePatientPhyExamDataAttachment(selectedMedicalHistory) {
    this.isLoading = true;
    this.deletePatientPhyExamRecordObj = {
      "hospital_reg_num": selectedMedicalHistory.hospital_reg_num,
      "medical_record_id": selectedMedicalHistory.medical_record_id,
      "patientID": selectedMedicalHistory.patientID,
      "physical_exam_id": selectedMedicalHistory.physical_exam_id,
      "byWhom": "admin",
      "byWhomID": this.signObj.hospitalAdmin.userID
    }
    this.loginService.deletePatientPhysicalExamRecordData(this.deletePatientPhyExamRecordObj, this.signObj.access_token).
      subscribe(
        (res) => {
          if (res.response === 3) {
            this.isLoading = false;
            //this.loading = false;
            this.openSnackBar(res.message, "");
            //this.modalService.dismissAll();
            this.fetchPatientPhysicalExamRecords();
            // this.ngOnInit()
            console.log("Res from Patient Phy Exam Data Delete : ", res.message);
          }
          else if (res.response === 0) {
            this.isLoading = false;
            //this.loading = false;
            this.openSnackBar(res.message, "");
            console.log("Res from Patient Phy Exam Data Delete : ", res.message);
            //this.modalService.dismissAll();
          }
        },
        (err: HttpErrorResponse) => {
          if (err.error instanceof Error) {
            this.isLoading = false;
            //this.loading = false;
            console.log("Client Side Error")
          } else {
            this.isLoading = false;
            //this.loading = false;
            console.log(err)
          }
        })
  }

  //Call Delete Pat MedicalRecords MedicalHistory Data
  deletePatientIllnessData(selectedMedicalHistory) {
    this.isLoading = true;
    this.deletePatientIllnessObj = {
      "hospital_reg_num": selectedMedicalHistory.hospital_reg_num,
      "medical_record_id": selectedMedicalHistory.medical_record_id,
      "patientID": selectedMedicalHistory.patientID,
      "illnessID": selectedMedicalHistory.illnessID,
      "byWhom": "admin",
      "byWhomID": this.signObj.hospitalAdmin.userID
    }
    //Call Delete Illness Info
    this.loginService.deletePatientIllnessRecordData(this.deletePatientIllnessObj, this.signObj.access_token).
      subscribe(
        (res) => {
          if (res.response === 3) {
            this.isLoading = false;
            //this.loading = false;
            this.openSnackBar(res.message, "");
            this.modalService.dismissAll();
            //this.fetchPatientMedicalRecordIllness();
            this.ngOnInit()
            console.log("Res from Patient Illness Data Delete : ", res.message);
          }
          else if (res.response === 0) {
            this.isLoading = false;
            //this.loading = false;
            this.openSnackBar(res.message, "");
            console.log("Res from Patient Illness Data Delete : ", res.message);
            //this.modalService.dismissAll();
          }
        },
        (err: HttpErrorResponse) => {
          if (err.error instanceof Error) {
            this.isLoading = false;
            //this.loading = false;
            console.log("Client Side Error")
          } else {
            this.isLoading = false;
            //this.loading = false;
            console.log(err)
          }
        })
    //Call Delete Diagnostic Notes
    this.loginService.deletePatientIllnessDiagnosticData(this.deletePatientIllnessObj, this.signObj.access_token).
      subscribe(
        (res) => {
          if (res.response === 3) {
            this.isLoading = false;
            //this.loading = false;
            //this.openSnackBar(res.message, "");
            this.modalService.dismissAll();
            //this.fetchPatientMedicalRecordIllness();
            // this.ngOnInit()
            console.log("Res from Patient DiagnosticNotes Data Delete : ", res.message);
          }
          else if (res.response === 0) {
            this.isLoading = false;
            //this.loading = false;
            //this.openSnackBar(res.message, "");
            console.log("Res from Patient DiagnosticNotes Data Delete : ", res.message);
            //this.modalService.dismissAll();
          }
        },
        (err: HttpErrorResponse) => {
          if (err.error instanceof Error) {
            this.isLoading = false;
            //this.loading = false;
            console.log("Client Side Error")
          } else {
            this.isLoading = false;
            //this.loading = false;
            console.log(err)
          }
        })
    //Call Delete Medications 
    this.loginService.deletePatientIllnessMedicationData(this.deletePatientIllnessObj, this.signObj.access_token).
      subscribe(
        (res) => {
          if (res.response === 3) {
            this.isLoading = false;
            //this.loading = false;
            //this.openSnackBar(res.message, "");
            this.modalService.dismissAll();
            //this.fetchPatientMedicalRecordIllness();
            // this.ngOnInit()
            console.log("Res from Patient Medications Data Delete : ", res.message);
          }
          else if (res.response === 0) {
            this.isLoading = false;
            //this.loading = false;
            //this.openSnackBar(res.message, "");
            console.log("Res from Patient Medications Data Delete : ", res.message);
            //this.modalService.dismissAll();
          }
        },
        (err: HttpErrorResponse) => {
          if (err.error instanceof Error) {
            this.isLoading = false;
            //this.loading = false;
            console.log("Client Side Error")
          } else {
            this.isLoading = false;
            //this.loading = false;
            console.log(err)
          }
        })
    //Call Delete Surgical Records
    this.loginService.deletePatientIllnessSurgicalProcedureData(this.deletePatientIllnessObj, this.signObj.access_token).
      subscribe(
        (res) => {
          if (res.response === 3) {
            this.isLoading = false;
            //this.loading = false;
            //this.openSnackBar(res.message, "");
            this.modalService.dismissAll();
            //this.fetchPatientMedicalRecordIllness();
            this.ngOnInit()
            console.log("Res from Patient SurgicalProcedure Data Delete : ", res.message);
          }
          else if (res.response === 0) {
            this.isLoading = false;
            //this.loading = false;
            //this.openSnackBar(res.message, "");
            console.log("Res from Patient SurgicalProcedure Data Delete : ", res.message);
            //this.modalService.dismissAll();
          }
        },
        (err: HttpErrorResponse) => {
          if (err.error instanceof Error) {
            this.isLoading = false;
            //this.loading = false;
            console.log("Client Side Error")
          } else {
            this.isLoading = false;
            //this.loading = false;
            console.log(err)
          }
        })
  }

  deletePatientIllnessDataDirect(selectedMedicationData) {
    this.isLoading = true;
    this.deletePatientIllnessObj = {
      "hospital_reg_num": selectedMedicationData.hospital_reg_num,
      "medical_record_id": selectedMedicationData.medical_record_id,
      "patientID": selectedMedicationData.patientID,
      "illnessID": selectedMedicationData.illnessID,
      "illnessMedicationID": selectedMedicationData.illnessMedicationID,
      "byWhom": "admin",
      "byWhomID": this.signObj.hospitalAdmin.userID
    }
    this.loginService.deletePatientIllnessMedicationDataSingle(this.deletePatientIllnessObj, this.signObj.access_token).
      subscribe(
        (res) => {
          if (res.response === 3) {
            this.isLoading = false;
            //this.loading = false;
            //this.openSnackBar(res.message, "");
            this.modalService.dismissAll();
            //this.fetchPatientMedicalRecordIllness();
            this.ngOnInit()
            console.log("Res from Patient Medications Data Delete : ", res.message);
          }
          else if (res.response === 0) {
            this.isLoading = false;
            //this.loading = false;
            //this.openSnackBar(res.message, "");
            console.log("Res from Patient Medications Data Delete : ", res.message);
            //this.modalService.dismissAll();
          }
        },
        (err: HttpErrorResponse) => {
          if (err.error instanceof Error) {
            this.isLoading = false;
            //this.loading = false;
            console.log("Client Side Error")
          } else {
            this.isLoading = false;
            //this.loading = false;
            console.log(err)
          }
        })

  }
  deletePatientSurgicalRecordDataDirect(selectedSurgicalRecordData) {
    this.isLoading = true;
    this.deletePatientIllnessObj = {
      "hospital_reg_num": selectedSurgicalRecordData.hospital_reg_num,
      "medical_record_id": selectedSurgicalRecordData.medical_record_id,
      "patientID": selectedSurgicalRecordData.patientID,
      "illnessID": selectedSurgicalRecordData.illnessID,
      "illnessMedicationID": selectedSurgicalRecordData.illnessMedicationID,
      "illnessSurgicalID": selectedSurgicalRecordData.illnessSurgicalID,
      "byWhom": "admin",
      "byWhomID": this.signObj.hospitalAdmin.userID
    }
    this.loginService.deletePatientSurgicalRecordDataSingle(this.deletePatientIllnessObj, this.signObj.access_token).
      subscribe(
        (res) => {
          if (res.response === 3) {
            this.isLoading = false;
            //this.loading = false;
            //this.openSnackBar(res.message, "");
            this.modalService.dismissAll();
            //this.fetchPatientMedicalRecordIllness();
            this.ngOnInit()
            console.log("Res from Patient Medications Data Delete Direct: ", res.message);
          }
          else if (res.response === 0) {
            this.isLoading = false;
            //this.loading = false;
            //this.openSnackBar(res.message, "");
            console.log("Res from Patient Medications Data Delete : ", res.message);
            //this.modalService.dismissAll();
          }
        },
        (err: HttpErrorResponse) => {
          if (err.error instanceof Error) {
            this.isLoading = false;
            //this.loading = false;
            console.log("Client Side Error")
          } else {
            this.isLoading = false;
            //this.loading = false;
            console.log(err)
          }
        })

  }

  //Delete Immunization Record
  deletePatientImmunizationData(selectedInvoicesData) {
    this.isLoading = true;
    this.deletePatientImmunizationRecordObj = {
      "hospital_reg_num": selectedInvoicesData.hospital_reg_num,
      "byWhom": "admin",
      "byWhomID": this.signObj.hospitalAdmin.userID,
      "medical_record_id": selectedInvoicesData.medical_record_id,
      "patientID": selectedInvoicesData.patientID,
      "immunization_record_id": selectedInvoicesData.immunization_record_id
    }
    this.loginService.deletePatientImmunizationRecordData(this.deletePatientImmunizationRecordObj, this.signObj.access_token).
      subscribe(
        (res) => {
          if (res.response === 3) {
            this.isLoading = false;
            //this.ngOnInit();
            this.fetchPatientImmunizationRecords();
            this.openSnackBar(res.message, "");
            this.modalService.dismissAll();
            // this.ngOnInit()
            console.log("Res from Patient Immunization Record Data Delete : ", res.message);
          }
          else if (res.response === 0) {
            this.isLoading = false;
            //this.loading = false;
            this.openSnackBar(res.message, "");
            //this.modalService.dismissAll();
          }
        },
        (err: HttpErrorResponse) => {
          if (err.error instanceof Error) {
            this.isLoading = false;
            //this.loading = false;
            console.log("Client Side Error")
          } else {
            this.isLoading = false;
            //this.loading = false;
            console.log(err)
          }
        })
  }

  openViewSurgicalRecordMethod(viewSurgicalRecordModel, selectedSurgicalRecordData) {
    console.log("Selected Surgical record : ", selectedSurgicalRecordData);

    this.modalService.open(viewSurgicalRecordModel, { ariaLabelledBy: 'modal-basic-title', centered: true, size: "md", backdrop: false }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;

    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  openEditSurgicalRecordMethod(editSurgicalRecordModel, selectedSurgicalRecordData) {
    console.log("Selected Surgical record : ", selectedSurgicalRecordData);
    //this.illnessSurgicalProcedures = res.illnessSurgicalRecords;
    this.illnessSurgicalAttachmentsDirect = selectedSurgicalRecordData.attachments;
    let unixDates = selectedSurgicalRecordData.addedDate;
    var date1 = new Date(unixDates * 1000);
    let dateToShow = date1.getFullYear() + '-' + ('0' + (date1.getMonth() + 1)).slice(-2) + '-' + ('0' + date1.getDate()).slice(-2);
    let timeToShow = date1.getHours() + ':' + date1.getMinutes() + ':' + date1.getSeconds();
    // let v1: any = selectedSurgicalRecordData.attachements;
    // console.log(v1[0].moreDetails);

    this.editPatIllnessSurgicalFormDirect.patchValue({
      "lastUpdateDate": dateToShow,
      "time": timeToShow,
      "doctorName": selectedSurgicalRecordData.doctorName,
      "surgeryProcedure": selectedSurgicalRecordData.surgeryProcedure,
      "surgeryInformation": selectedSurgicalRecordData.surgeryInformation,
      //"moreDetails": v1.moreDetails,
    })
    //console.log(this.editPatIllnessSurgicalFormDirect.value.moreDetails);

    this.modalService.open(editSurgicalRecordModel, { ariaLabelledBy: 'modal-basic-title', centered: true, size: "md", backdrop: false }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;

    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  openDeleteSurgicalRecordMethod(deleteSurgicalRecordModel, selectedSurgicalRecordData) {
    console.log("Selected Surgical record : ", selectedSurgicalRecordData);

    this.modalService.open(deleteSurgicalRecordModel, { ariaLabelledBy: 'modal-basic-title', centered: true, size: "md", backdrop: false }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;

    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  // //For Time Picker
  // public convertTime24to12(time24, type) {
  //   var tmpArr = time24.split(':'), time12;
  //   if (+tmpArr[0] == 12) {
  //     time12 = tmpArr[0] + ':' + tmpArr[1] + ' PM';
  //   }
  //   else {
  //     if (+tmpArr[0] == 0) {
  //       time12 = '12:' + tmpArr[1] + ' AM';
  //     }
  //     else {
  //       if (+tmpArr[0] > 12) {
  //         time12 = (+tmpArr[0] - 12) + ':' + tmpArr[1] + ' PM';
  //       }
  //       else {
  //         time12 = (+tmpArr[0]) + ':' + tmpArr[1] + ' AM';
  //       }
  //     }
  //   }
  //   return time12;
  // }

  // selectTime() {
  //   let type = "from"
  //   const amazingTimePicker = this.atp.open();
  //   amazingTimePicker.afterClose().subscribe(time => {
  //     console.log(time);
  //     this.convertTime24to12(time, type)
  //   });
  // }

  // onClick() {
  //   let type = "from"
  //   const amazingTimePicker = this.atp.open();
  //   amazingTimePicker.afterClose().subscribe(time => {
  //     console.log(time);
  //     this.convertTime24to12(time, type)
  //   });
  // }

  //Medical-History Add Button actions
  openPatientIllness() {
    this.isValue = 1;
    this.viewPatientIllness = false;
    this.viewPatientDiagnostic = true;
    this.viewPatientMedications = true;
    this.viewPatientSurgical = true;
  }
  openPatientDiagnostic() {
    this.isValue = 2;
    this.viewPatientIllness = true;
    this.viewPatientDiagnostic = false;
    this.viewPatientMedications = true;
    this.viewPatientSurgical = true;
  }
  openPatientMedications() {
    this.isValue = 3;
    this.viewPatientIllness = true;
    this.viewPatientDiagnostic = true;
    this.viewPatientMedications = false;
    this.viewPatientSurgical = true;
  }
  openPatientSurgical() {
    this.isValue = 4;
    this.viewPatientIllness = true;
    this.viewPatientDiagnostic = true;
    this.viewPatientMedications = true;
    this.viewPatientSurgical = false;
  }

  //Medical-History Edit Button actions
  openPatientIllness2() {
    this.isValue = 1;
    this.viewPatientIllness2 = false;
    this.viewPatientDiagnostic2 = true;
    this.viewPatientMedications2 = true;
    this.viewPatientSurgical2 = true;
  }
  openPatientDiagnostic2() {
    this.isValue = 2;
    this.viewPatientIllness2 = true;
    this.viewPatientDiagnostic2 = false;
    this.viewPatientMedications2 = true;
    this.viewPatientSurgical2 = true;
  }
  openPatientMedications2() {
    this.isValue = 3;
    this.viewPatientIllness2 = true;
    this.viewPatientDiagnostic2 = true;
    this.viewPatientMedications2 = false;
    this.viewPatientSurgical2 = true;
  }
  openPatientSurgical2() {
    this.isValue = 4;
    this.viewPatientIllness2 = true;
    this.viewPatientDiagnostic2 = true;
    this.viewPatientMedications2 = true;
    this.viewPatientSurgical2 = false;
  }
}
