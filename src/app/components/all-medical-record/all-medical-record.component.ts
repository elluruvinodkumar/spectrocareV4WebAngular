import {
  Component,
  OnInit,
  ChangeDetectorRef,
  ElementRef,
  ViewChild,
} from "@angular/core";
import { FormGroup, FormBuilder, FormArray } from "@angular/forms";
import { LoginService } from "src/app/services/login.service";
import { MatSnackBar } from "@angular/material";
import { HttpErrorResponse } from "@angular/common/http";
import { NgbModal, ModalDismissReasons } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: "app-all-medical-record",
  templateUrl: "./all-medical-record.component.html",
  styleUrls: ["./all-medical-record.component.css"],
})
export class AllMedicalRecordComponent implements OnInit {
  titleArray: any = {
    title: "Patient",
    subTitle: "Create Medical Record",
    img: "assets/images/ui/Icons/patient-medical-module/Group 2494.png",
  };
  isValue: any;
  isLoading: boolean;
  previewImg1: any;
  patientProfileForm: FormGroup;
  editFamilyHistoryForm: FormGroup;
  addAllergiesForm: FormGroup;
  belowEditForm: FormGroup;
  basicExamForm: FormGroup;
  basicExamEditForm: FormGroup;
  addPatientPhysicalExamFileForm: FormGroup;
  belowForm: FormGroup;
  editPatIllnessDiagnosisForm: FormGroup;
  editPatIllMedicationManuallyForm: FormGroup;
  addPatImmunizationForm: FormGroup;
  editPatImmunizationForm: FormGroup;
  editPatientPhysicalExamFileForm: FormGroup;
  viewPatSurgicalForm: FormGroup;
  addPatIllMedicationManuallyForm: FormGroup;
  editPatientMedHistoryFileForm: FormGroup;
  editPatIllnessForm: FormGroup;
  viewPatDiagnosticForm: FormGroup;
  viewPatMedicationForm: FormGroup;
  addPatientMedHistoryFileForm: FormGroup;
  addPatIllnessForm: FormGroup;
  addPatIllnessDiagnosisForm: FormGroup;
  addPatIllnessSurgicalForm: FormGroup;
  signInRes: any;
  signObj: any;

  medicalPersonnels: any = [];
  filteredMedicalPersonnels: any = [];
  openPatGenInfo: boolean = false;
  openPatMedRecords: boolean = false;
  patGenInfoSuccessData: any;
  closeResult: string;

  addPatMedicalRecordIllnessObj: any;
  fetchPatientPhysicalExamObj: any;

  fetchPatientMedicalRecordIllnessObj: any;
  addPatIllnessDiagnosisDataObj: any;
  fetchPatientImmunizationObj: any;
  PhysicalExamination: any;

  haveBodyIndexData: boolean = false;
  selectedRow: any;
  illnessMedicationID: any;
  medicalPersonnelObj: any;
  Immunizations: any;
  PhysicalExaminationData: any;
  physicalExaminationData: any = [
    {
      category: "General Appearance",
      description: "",
      result: "",
    },
    {
      category: "Vital Signs",
      description: "",
      result: "",
    },
    {
      category: "Head",
      description: "",
      result: "",
    },
    {
      category: "Heent",
      description: "",
      result: "",
    },
    {
      category: "Neck",
      description: "",
      result: "",
    },
    {
      category: "Chest and Lungs",
      description: "",
      result: "",
    },
    {
      category: "Cardiovascular",
      description: "",
      result: "",
    },
    {
      category: "Abdomen",
      description: "",
      result: "",
    },
    {
      category: "Genitourinary",
      description: "",
      result: "",
    },
    {
      category: "Rectal",
      description: "",
      result: "",
    },
    {
      category: "Musculoskeletal",
      description: "",
      result: "",
    },
    {
      category: "Lymph Nodes",
      description: "",
      result: "",
    },
    {
      category: "Extremities/Skin",
      description: "",
      result: "",
    },
    {
      category: "Neurological",
      description: "",
      result: "",
    },
  ];

  medicationAttachmentData: any = [];
  viewBasicEx: boolean = false;
  viewSystemEx: boolean = false;
  viewManualInputView: boolean = false;
  viewAttachmentView: boolean = false;

  HaveBodyIndex: boolean = false;

  selectedPatientData: any;
  updatePatientPhysicalExamManullyObj: any;

  deletePatientImmunizationRecordObj: any;
  selectedPatManualData: any;
  fetchedPatPhyExamAttachments: any;
  previewImg: any;
  gender: string;
  age: number;
  addPatientPhysicalExamManullyObj: any;

  editPatIllnessDiagnosisDataObj: any;
  medicinesData: any = [];
  illnessDiagnosticNotes: any;
  addImmunizationDataObj: any;
  deletePatientPhyExamRecordObj: any;
  selectedPatSystemExamData: any = [];
  isNoFile: boolean = false;
  loading: boolean;

  dateToShow: any;

  createdIllnessID: any;
  dateToShow2: any;
  file: any;
  fileName: any;
  fileSize: any;
  fileValue: any;
  viewPatientIllness: boolean = true;
  viewPatientDiagnostic: boolean = true;
  viewPatientMedications: boolean = true;
  viewPatientSurgical: boolean = true;

  viewManualInputView2: boolean = false;
  viewManualInputView3: boolean = false;
  viewAttachmentView2: boolean = false;
  viewAttachmentView3: boolean = false;
  viewPatientIllness2: boolean = true;
  viewPatientDiagnostic2: boolean = true;
  viewPatientMedications2: boolean = true;
  viewPatientSurgical2: boolean = true;

  deletePatientIllnessObj: any;

  editPatientIllnessMedicationObj: any;
  addPatientIllnessMedicationObj: any;
  editPatIllnessSurgicalForm: FormGroup;
  fetchPatIllMedicationDataObj: any;
  illnessMedications: any;
  fetchedmedicinesData: any = [];
  availableIllnessIDs: any = [];
  MedicalHistory: any;
  illnessSurgicalProcedures: any;

  illnessSurgicalAttachments: any;
  color: string;
  color1: string;
  color2: string;
  color3: string;
  textColor: string;
  textColor1: string;
  textColor2: string;
  textColor3: string;
  listOfCodes = [
    { value: "+91" },
    { value: "+886" },
    { value: "+86" },
    { value: "+1" },
    { value: "+60" },
    { value: "+852" },
  ];
  listOfImmunizations = [
    { value: "Fever" },
    { value: "Headache" },
    { value: "Skin Allergy" },
    { value: "Stomuch Pain" },
    { value: "Teeth Effect" },
    { value: "Dust Allergy" },
    { value: "Knee Pain" },
  ];
  listOfIllnessConditions = [
    { value: "Appointment Booked" },
    { value: "In treatment" },
  ];
  addPatIllMedicationManuallyFormDirectly: FormGroup;
  addPatientIllnessMedicationObjDirect: any;
  addPatientMedHistoryFileFormDirect: FormGroup;
  createdPatientID: any;
  fetchedMedications: any;
  fetchPatientMedicationsObj: any;
  fetchPatientSurgicalRecordsObj: any;
  fetchPatientSurgicalRecordsData: any;
  illnessSurgicalAttachmentsDirect: any;
  fetchedmedicinesDataDirect: any = [];
  editPatIllMedicationManuallyFormDirect: FormGroup;
  medicationAttachmentDataDirect: any = [];
  editPatientMedHistoryFileFormDirect: FormGroup;
  addPatIllnessSurgicalFormDirect: FormGroup;
  editPatIllnessSurgicalFormDirect: FormGroup;

  @ViewChild("fileInput", { static: true }) el: ElementRef;
  constructor(
    private fb: FormBuilder,
    private cd: ChangeDetectorRef,
    private loginService: LoginService,
    private _snackBar: MatSnackBar,
    private modalService: NgbModal
  ) { }

  ngOnInit() {
    this.callPatientGeneralInfo();
    this.loading = true;
    this.signInRes = localStorage.getItem("SignInRes");
    if (this.signInRes) {
      this.signObj = JSON.parse(this.signInRes);
    }
    this.previewImg1 = "../../../assets/images/ui/Icons/1x/profile-1.png";
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
    this.addPatientMedHistoryFileFormDirect = this.fb.group({
      profilePic: [""],
      prescription1MoreDetails: [""]
    })
    this.addPatIllMedicationManuallyFormDirectly = this.fb.group({
      addMedicationArrayDirect: this.fb.array([

      ]),
      doctorMedicalPersonnelID: [""],
      doctorName: [""],
      illnessID: [""]
    });
    this.patientProfileForm = this.fb.group({
      doctorName: [""],
      department: [""],
      medical_personnel_id: [""],
      firstName: [""],
      lastName: [""],
      gender: [""],
      dob: [""],
      //checkPhone: [""],
      latitude: "0",
      longitude: "0",
      phoneNumberCountryCode: [""],
      phoneNumber: [""],
      age: [""],
      emailID: [""],
      address: [""],
      city: [""],
      state: [""],
      country: [""],
      postalCode: [""],
      profilePic: [""],
    });
    this.editFamilyHistoryForm = this.fb.group({
      familyHistory: this.fb.array([]),
    });
    this.addAllergiesForm = this.fb.group({
      allergieHistory: this.fb.array([]),
    });

    let medicalObj = {
      userID: this.signObj.hospitalAdmin.userID,
      category: "All",
      hospital_reg_num: this.signObj.hospitalAdmin.hospital_reg_num,
      token: this.signObj.access_token,
    };
    this.getDoctorData(medicalObj);

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
    });
    this.belowForm = this.fb.group({
      other: [""],
      physicianCommentsOrRecomdations: [""],
    });
    this.belowEditForm = this.fb.group({
      other: [""],
      physicianCommentsOrRecomdations: [""],
    });
    this.addPatientPhysicalExamFileForm = this.fb.group({
      medical_personnel_id: [""],
      patientID: [""],
      hospital_reg_num: [""],
      medical_record_id: [""],
      profilePic: [""],
    });
    this.editPatientPhysicalExamFileForm = this.fb.group({
      //medical_personnel_id: [""],
      //patientID: [""],
      //hospital_reg_num: [""],
      //medical_record_id: [""],
      //profilePic: [""]
    });
    this.addPatImmunizationForm = this.fb.group({
      appointmentTime: [""],
      immunizationName: [""],
      immunizationName1: [""],
      immunizationDate: [""],
      notes: [""],
      byWhom: [""],
      byWhomID: [""],
      doctorMPID: [""],
      doctorName: [""],
    });
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
      immunization_record_id: [""],
    });
    this.viewPatMedicationForm = this.fb.group({
      medicationDate: [""],
      instructions: [""],
    });
    this.viewPatSurgicalForm = this.fb.group({
      lastUpdateDate: [""],
      time: [""],
      doctorName: [""],
      surgeryProcedure: [""],
      moreInfo: [""],
    });
    this.viewPatDiagnosticForm = this.fb.group({
      diagnosisDate: [""],
      doctorName: [""],
      diagnosis: [""],
      prescription: [""],
      remark: [""],
    });
    this.editPatIllMedicationManuallyForm = this.fb.group({
      editMedicationArray: this.fb.array([]),
      instructions: [""],
    });
    this.editPatIllnessForm = this.fb.group({
      illnessCondition: [""],
      symptoms: [""],
      currentStatus: [""],
      description: [""],
      isCurrentIllness: [""],
      startDate: [""],
      endDate: [""],
    });
    this.editPatientMedHistoryFileForm = this.fb.group({
      profilePic: [""],
      prescription1MoreDetails: [""],
    });
    this.editPatIllnessSurgicalForm = this.fb.group({
      lastUpdateDate: [""],
      time: [""],
      doctorName: [""],
      surgeryProcedure: [""],
      surgeryInformation: [""],
      profilePic: [""],
      doctorMedicalPersonnelID: [""],
    });
    this.editPatIllnessDiagnosisForm = this.fb.group({
      diagnosisDate: [""],
      doctorName: [""],
      diagnosis: [""],
      prescription: [""],
      remark: [""],
      byWhom: [""],
      byWhomID: [""],
      doctorMedicalPersonnelID: [""],
    });
    this.addPatIllMedicationManuallyForm = this.fb.group({
      addMedicationArray: this.fb.array([]),
      doctorMedicalPersonnelID: [""],
      doctorName: [""],
    });

    this.addPatIllnessForm = this.fb.group({
      illnessCondition: [""],
      symptoms: [""],
      currentStatus: [""],
      description: [""],
      isCurrentIllness: [""],
      startDate: [""],
      endDate: [""],
    });

    this.addPatIllnessDiagnosisForm = this.fb.group({
      diagnosisDate: [""],
      diagnosis: [""],
      prescription: [""],
      remark: [""],
      byWhom: [""],
      byWhomID: [""],
      doctorMedicalPersonnelID: [""],
      doctorName: [""],
    });
    this.addPatientMedHistoryFileForm = this.fb.group({
      profilePic: [""],
      prescription1MoreDetails: [""],
    });
    this.addPatIllnessSurgicalForm = this.fb.group({
      surgeryDate: [""],
      surgeryProcedure: [""],
      surgeryInformation: [""],
      profilePic: [""],
      moreDetails: [""],
      doctorMedicalPersonnelID: [""],
      doctorName: [""],
    });
    this.editPatIllMedicationManuallyFormDirect = this.fb.group({
      editMedicationArrayDirect: this.fb.array([

      ]),
      instructions: [""]
    });
    this.editPatientMedHistoryFileFormDirect = this.fb.group({
      profilePic: [""],
      prescription1MoreDetails: [""]
    })
    this.addMedicationToList();
    this.addMedicationToListDirect();
    this.addAllergie();
    this.addMember();
    //this.fetchPatientSurgicalRecords();
    //this.fetchPatientMedicalRecordIllness();

  }

  getDoctorData(medicalObj) {
    this.loginService.getMedicalPatientData(medicalObj).subscribe(
      (res) => {
        console.log(res);
        if (res.response === 3) {
          this.medicalPersonnels = res.medicalPersonnels;
          this.filteredMedicalPersonnels = res.medicalPersonnels;
          console.log("list of doctors : ", this.medicalPersonnels);
        } else {
          alert(res.message);
        }
      },
      (err: HttpErrorResponse) => {
        if (err.error instanceof Error) {
          console.log("Client Side Error");
        } else {
          console.log(err);
        }
      }
    );
  }

  checkDoctorValue(value: any) {
    console.log(value.target.value);
    let index = -1;
    index = this.medicalPersonnels.findIndex((val) => {
      return val.medical_personnel_id === value.target.value;
    });
    if (index != -1) {
      let obj = this.medicalPersonnels[index];
      console.log("obj", obj);
      this.patientProfileForm.patchValue({
        doctorName: obj.firstName,
        medical_personnel_id: obj.medical_personnel_id,
        department: obj.department,
      });
    }
  }

  searchDoctor(term: string) {
    if (!term) {
      this.filteredMedicalPersonnels = this.medicalPersonnels;
    } else {
      this.filteredMedicalPersonnels = this.medicalPersonnels.filter((x) =>
        x.profile.userProfile.firstName.trim().toLowerCase().includes(term.trim().toLowerCase())
      );
    }
  }

  selectDoctorFromList(value: any) {
    console.log(value);
    let index = -1;
    index = this.medicalPersonnels.findIndex((val) => {
      return (
        val.profile.userProfile.medical_personnel_id ===
        value.profile.userProfile.medical_personnel_id
      );
    });
    if (index != -1) {
      let obj = this.medicalPersonnels[index];
      console.log("obj", obj);
      this.patientProfileForm.patchValue({
        doctorName:
          obj.profile.userProfile.firstName +
          " " +
          obj.profile.userProfile.lastName,
        medical_personnel_id: obj.profile.userProfile.medical_personnel_id,
        department: obj.profile.userProfile.department,
      });
      this.addPatImmunizationForm.patchValue({
        doctorName:
          obj.profile.userProfile.firstName +
          " " +
          obj.profile.userProfile.lastName,
        doctorMPID: obj.profile.userProfile.medical_personnel_id,
        byWhomID: this.signObj.hospitalAdmin.userID,
        byWhom: "admin",
      });
      this.editPatImmunizationForm.patchValue({
        doctorName:
          obj.profile.userProfile.firstName +
          " " +
          obj.profile.userProfile.lastName,
        doctorMPID: obj.profile.userProfile.medical_personnel_id,
        byWhomID: this.signObj.hospitalAdmin.userID,
        byWhom: "admin",
      });
      this.addPatIllnessDiagnosisForm.patchValue({
        doctorName:
          obj.profile.userProfile.firstName +
          " " +
          obj.profile.userProfile.lastName,
        doctorMedicalPersonnelID: obj.profile.userProfile.medical_personnel_id,
        byWhomID: this.signObj.hospitalAdmin.userID,
        byWhom: "admin",
      });
      this.addPatIllnessSurgicalForm.patchValue({
        doctorName:
          obj.profile.userProfile.firstName +
          " " +
          obj.profile.userProfile.lastName,
        doctorMedicalPersonnelID: obj.profile.userProfile.medical_personnel_id,
      });
      this.editPatIllnessDiagnosisForm.patchValue({
        doctorName:
          obj.profile.userProfile.firstName +
          " " +
          obj.profile.userProfile.lastName,
        doctorMedicalPersonnelID: obj.profile.userProfile.medical_personnel_id,
        byWhomID: this.signObj.hospitalAdmin.userID,
        byWhom: "admin",
      });
      this.editPatIllnessSurgicalForm.patchValue({
        doctorName:
          obj.profile.userProfile.firstName +
          " " +
          obj.profile.userProfile.lastName,
        doctorMedicalPersonnelID: obj.profile.userProfile.medical_personnel_id,
      });
      this.addPatIllMedicationManuallyForm.patchValue({
        doctorName:
          obj.profile.userProfile.firstName +
          " " +
          obj.profile.userProfile.lastName,
        doctorMedicalPersonnelID: obj.profile.userProfile.medical_personnel_id,
      });
      this.addPatIllMedicationManuallyFormDirectly.patchValue({
        doctorName:
          obj.profile.userProfile.firstName +
          " " +
          obj.profile.userProfile.lastName,
        doctorMedicalPersonnelID: obj.profile.userProfile.medical_personnel_id,
      })
      this.addPatIllnessSurgicalFormDirect.patchValue({
        doctorName:
          obj.profile.userProfile.firstName +
          " " +
          obj.profile.userProfile.lastName,
        doctorMedicalPersonnelID: obj.profile.userProfile.medical_personnel_id,
      })
      this.editPatIllnessSurgicalFormDirect.patchValue({
        doctorName:
          obj.profile.userProfile.firstName +
          " " +
          obj.profile.userProfile.lastName,
        doctorMedicalPersonnelID: obj.profile.userProfile.medical_personnel_id,
      })
      //this.modalService.dismissAll()
    }
  }

  get addmedicationsObjDirect() {
    return <FormArray>this.addPatIllMedicationManuallyFormDirectly.get('addMedicationArrayDirect')
  }
  get editmedicationsObjDirect() {
    return <FormArray>this.editPatIllMedicationManuallyFormDirect.get('editMedicationArrayDirect')
  }
  addMedicationToListDirect() {
    this.addmedicationsObjDirect.push(this.fb.group({
      name: [""],
      dosage: [""],
      freq: [""]
    }))
  }
  removeAddMedicationDirect(index) {
    this.addmedicationsObjDirect.removeAt(index)
  }
  removeEditillnessSurgicalAttachmentsDirect(i) {
    console.log("index value of delete surgical attachement : ", i);
    this.illnessSurgicalAttachmentsDirect.splice(i, 1)
  }
  //Add Patient Gen Data
  addPatientSubmit() {
    this.isLoading = true;
    //let payLoad = this.patientProfileForm.value;
    let formData = new FormData();
    formData.append("firstName", this.patientProfileForm.value.firstName);
    formData.append("lastName", this.patientProfileForm.value.lastName);
    formData.append("gender", this.patientProfileForm.value.gender);
    formData.append("age", this.patientProfileForm.value.age);
    formData.append(
      "phoneNumberCountryCode",
      this.patientProfileForm.value.phoneNumberCountryCode
    );
    formData.append("phoneNumber", this.patientProfileForm.value.phoneNumber);
    formData.append("address", this.patientProfileForm.value.address);
    formData.append("state", this.patientProfileForm.value.state);
    formData.append("country", this.patientProfileForm.value.country);
    formData.append("postalCode", this.patientProfileForm.value.postalCode);
    formData.append(
      "medical_personnel_id",
      this.patientProfileForm.value.medical_personnel_id
    );
    formData.append(
      "hospital_reg_num",
      this.signObj.hospitalAdmin.hospital_reg_num
    );
    formData.append("latitude", this.patientProfileForm.value.latitude);
    formData.append("longitude", this.patientProfileForm.value.longitude);
    formData.append("emailID", this.patientProfileForm.value.emailID);
    formData.append("city", this.patientProfileForm.value.city);
    formData.append("dob", this.patientProfileForm.value.dob);
    formData.append(
      "profilePic",
      this.patientProfileForm.get("profilePic").value
    );
    this.gender = this.patientProfileForm.value.gender;
    this.age = this.patientProfileForm.value.age;
    console.log("DOB: " + this.patientProfileForm.value.dob);

    console.log("Add patient general info data : ", formData);

    this.loginService
      .addPatientGenInfo(formData, this.signObj.access_token)
      .subscribe(
        (addPatientGenInfoRes) => {
          if (addPatientGenInfoRes.response === 3) {
            this.isLoading = false;
            this.openSnackBar(addPatientGenInfoRes.message, "");
            this.loading = false;
            this.patGenInfoSuccessData = addPatientGenInfoRes;
            this.createdPatientID = addPatientGenInfoRes.patientId;
            console.log("res form add pat : ", addPatientGenInfoRes);
            this.callPatientMedicalReocrds();
            //this.addAdminGenUserForm.reset();
            //this.fetchAdminGenralData();
          } else {
            this.isLoading = false;

            console.log("res form add pat : ", addPatientGenInfoRes);
            this.openSnackBar(addPatientGenInfoRes.message, "");
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
            console.log("Server Side", err);
          }
        }
      );
  }

  clearForm() {
    this.patientProfileForm.reset();
    this.editFamilyHistoryForm.reset();
    this.addAllergiesForm.reset();
    this.previewImg1 = "";
  }

  callPatientGeneralInfo() {
    this.textColor = "white";
    this.textColor1 = "black";
    this.isValue = 1;
    console.log("pat gen info called");
    this.openPatGenInfo = true;
    this.openPatMedRecords = false;
  }

  callPatientMedicalReocrds() {
    this.textColor = "black";
    this.textColor1 = "white";
    this.isValue = 2;
    console.log("pat med records called");
    this.openPatMedRecords = true;
    this.openPatGenInfo = false;
  }

  //Image Upload Update Admin Gen User
  fileProgress1(event: any) {
    let reader = new FileReader(); // HTML5 FileReader API
    let file = event.target.files[0];
    if (event.target.files && event.target.files[0]) {
      reader.readAsDataURL(file);
      // When file uploads set it to file formcontrol
      reader.onload = () => {
        this.patientProfileForm.get("profilePic").setValue(file);
        this.previewImg1 = reader.result;
      };
      // ChangeDetectorRef since file is loading outside the zone
      this.cd.markForCheck();
    }
  }
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
  //editPatientMedHistoryFileForm file Upload
  fileProgress4(event: any) {
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
        this.editPatientMedHistoryFileForm.get("profilePic").setValue(file);
        this.previewImg = reader.result;
      };
      // ChangeDetectorRef since file is loading outside the zone
      //this.cd.markForCheck();
    }
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
  removeUploadedFile4() {
    // let newFileList = Array.from(this.el.nativeElement.files);
    this.editPatientMedHistoryFileForm.get("profilePic").setValue(null);
    this.fileName = null;
    this.fileSize = null;
    this.fileValue = null;
    this.isNoFile = false;
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
        this.editPatIllnessSurgicalForm.get("profilePic").setValue(file);
        this.previewImg = reader.result;
      };
      // ChangeDetectorRef since file is loading outside the zone
      //this.cd.markForCheck();
    }
  }
  removeUploadedFile11() {
    // let newFileList = Array.from(this.el.nativeElement.files);
    this.editPatIllnessSurgicalForm.get("profilePic").setValue(null);
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

  removeUploadedFile1() {
    this.editPatientPhysicalExamFileForm.get("profilePic").setValue(null);
    this.fileName = null;
    this.fileSize = null;
    this.fileValue = null;
    this.isNoFile = false;
  }
  //Img Upload complete here

  //get family history
  get familyDeseases() {
    return <FormArray>this.editFamilyHistoryForm.get("familyHistory");
  } //Add patient to the family history
  addMember() {
    this.familyDeseases.push(
      this.fb.group({
        dieseaseName: [""],
        relationship: [""],
      })
    );
  }
  //Remove patient from family history
  removeDesease(index) {
    this.familyDeseases.removeAt(index);
  }

  //get Allergie
  get allergieData() {
    return <FormArray>this.addAllergiesForm.get("allergieHistory");
  }
  //Add Allergie
  addAllergie() {
    this.allergieData.push(
      this.fb.group({
        name: [""],
        notes: [""],
      })
    );
  }
  //Remove Allergie
  removeAllergie(index) {
    this.allergieData.removeAt(index);
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
    let calculatedBMI =
      this.basicExamForm.value.weight /
      (this.basicExamForm.value.height * this.basicExamForm.value.height);
    console.log("the BMI value is : ", calculatedBMI);
    this.basicExamForm.patchValue({
      bmi: (calculatedBMI * 100 * 100).toFixed(2),
    });
  }

  calculateBMI1() {
    // let calculateBMI = weight / (height * height);
    let calculatedBMI =
      this.basicExamEditForm.value.weight /
      (this.basicExamEditForm.value.height *
        this.basicExamEditForm.value.height);
    console.log("the BMI value is : ", calculatedBMI);
    this.basicExamEditForm.patchValue({
      bmi: (calculatedBMI * 100 * 100).toFixed(2),
    });
  }
  calculateBMR() {
    if (this.gender === "Male") {
      let claculredBMR =
        66 +
        13.7 * this.basicExamForm.value.weight +
        5 * this.basicExamForm.value.height -
        6.8 * this.age;
      this.basicExamForm.patchValue({
        bmr: claculredBMR,
      });
    } else {
      let claculredBMR =
        655 +
        9.6 * this.basicExamForm.value.weight +
        1.8 * this.basicExamForm.value.height -
        4.7 * this.age;
      this.basicExamForm.patchValue({
        bmr: claculredBMR,
      });
    }
  }
  calculateBMR1() {
    if (this.gender === "Male") {
      let claculredBMR =
        66 +
        13.7 * this.basicExamEditForm.value.weight +
        5 * this.basicExamEditForm.value.height -
        6.8 * this.age;
      this.basicExamEditForm.patchValue({
        bmr: claculredBMR,
      });
    } else {
      let claculredBMR =
        655 +
        9.6 * this.basicExamEditForm.value.weight +
        1.8 * this.basicExamEditForm.value.height -
        4.7 * this.age;
      this.basicExamEditForm.patchValue({
        bmr: claculredBMR,
      });
    }
  }
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

    formData.append("patientID", this.patGenInfoSuccessData.patientId);
    formData.append("medical_record_id", this.patGenInfoSuccessData.medical_record_id);
    formData.append("hospital_reg_num", this.signObj.hospitalAdmin.hospital_reg_num);
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
            //this.ngOnInit();
            //this.openPatientMedications();
            //this.loading = false;
            //alert(res.message);
            this.fetchPatientSurgicalRecords();
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
            this.fetchPatientSurgicalRecords();
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

  //Add Patient Physical Exam Manually
  addPatientPhysicalExamManually(physicalExaminationData) {
    this.isLoading = true;
    let payload = {
      height: "" + this.basicExamForm.value.height + " " + "CM",
      weight: "" + this.basicExamForm.value.weight + " " + "KG",
      waistline: "" + this.basicExamForm.value.waistline + " " + "CM",
      bmi: "" + this.basicExamForm.value.bmi,
      bloodPressure: "" + this.basicExamForm.value.bloodPressure,
    };
    let physicalExamination: any[] = this.physicalExaminationData;
    this.addPatientPhysicalExamManullyObj = {
      hospital_reg_num: this.signObj.hospitalAdmin.hospital_reg_num,
      patientID: this.patGenInfoSuccessData.patientId,
      medical_record_id: this.patGenInfoSuccessData.medical_record_id,
      byWhom: "admin",
      byWhomID: this.signObj.hospitalAdmin.userID,
      bodyIndex: payload,
      physicalExamination: physicalExamination,
      other: this.belowForm.value.other,
      physicianCommentsOrRecomdations: this.belowForm.value
        .physicianCommentsOrRecomdations,
    };

    console.log(
      "the sended obj data for pat phy exam add manual : ",
      this.addPatientPhysicalExamManullyObj
    );
    this.loginService
      .addPatientPhysicalExamRecordsManually(
        this.addPatientPhysicalExamManullyObj,
        this.signObj.access_token
      )
      .subscribe(
        (res) => {
          if (res.response === 3) {
            this.belowForm.reset();
            this.basicExamForm.reset();
            physicalExamination = [];
            this.fetchPatientPhysicalExamRecords();
            this.isLoading = false;
            this.openSnackBar(res.message, "");
            this.viewAttachment();
            //this.loading = false;
            //this.modalService.dismissAll();
            console.log(
              "res from add patient physical exam records manually from component Success : ",
              res.message,
              res.physical_exam_id
            );
          } else if (res.response === 0) {
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
            console.log("Client Side Error");
          } else {
            this.isLoading = false;
            //this.loading = false;
            console.log(err);
          }
        }
      );
  }

  //Image Upload
  fileProgress(event: any) {
    this.isNoFile = true;
    let reader = new FileReader();
    let file = event.target.files[0];
    this.fileName = file.name;
    this.fileSize = file.size;
    this.fileSize = this.fileSize / 1024;
    this.fileValue = "kb";
    if (event.target.files && event.target.files[0]) {
      reader.readAsDataURL(file);
      // When file uploads set it to file formcontrol
      reader.onload = () => {
        this.addPatientPhysicalExamFileForm.get("profilePic").setValue(file);
        this.previewImg = reader.result;
      };
    }
  }
  removeUploadedFile() {
    // let newFileList = Array.from(this.el.nativeElement.files);
    //this.isNoFile = ;
    this.addPatientPhysicalExamFileForm.get("profilePic").setValue(null);
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
        this.addPatientMedHistoryFileForm.get("profilePic").setValue(file);
        this.previewImg = reader.result;
      };
      // ChangeDetectorRef since file is loading outside the zone
      //this.cd.markForCheck();
    }
  }
  removeUploadedFile2() {
    // let newFileList = Array.from(this.el.nativeElement.files);
    this.addPatientMedHistoryFileForm.get("profilePic").setValue(null);
    this.fileName = null;
    this.fileSize = null;
    this.fileValue = null;
    this.isNoFile = false;
  }

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
        this.addPatIllnessSurgicalForm.get("profilePic").setValue(file);
        this.previewImg = reader.result;
      };
      // ChangeDetectorRef since file is loading outside the zone
      //this.cd.markForCheck();
    }
  }
  fileProgress2Direct(event: any) {
    let reader = new FileReader(); // HTML5 FileReader API
    let file = event.target.files[0];
    if (event.target.files && event.target.files[0]) {
      reader.readAsDataURL(file);
      // When file uploads set it to file formcontrol
      reader.onload = () => {
        this.patientProfileForm.get("profilePic").setValue(file);
        this.previewImg1 = reader.result;
      };
      // ChangeDetectorRef since file is loading outside the zone
      this.cd.markForCheck();
    }
  }
  fileProgress2DirectFile(event: any) {
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
  removeUploadedFile2DirectFile() {
    this.addPatientMedHistoryFileFormDirect.get("profilePic").setValue(null);
    this.fileName = null;
    this.fileSize = null;
    this.fileValue = null;
    this.isNoFile = false;
  }
  removeUploadedFile3() {
    // let newFileList = Array.from(this.el.nativeElement.files);
    this.addPatIllnessSurgicalForm.get("profilePic").setValue(null);
    this.fileName = null;
    this.fileSize = null;
    this.fileValue = null;
    this.isNoFile = false;
  }

  //Add Patient Physical Exam File
  addPatientPhysicalExamFileSubmit() {
    this.isLoading = true;

    let payLoad = this.addPatientPhysicalExamFileForm.value;
    let formData = new FormData();

    formData.append("byWhomID", this.signObj.hospitalAdmin.userID);
    formData.append(
      "hospital_reg_num",
      this.signObj.hospitalAdmin.hospital_reg_num
    );
    formData.append("patientID", this.patGenInfoSuccessData.patientId);
    formData.append(
      "medical_record_id",
      this.patGenInfoSuccessData.medical_record_id
    );
    formData.append(
      "physicalExamRecord",
      this.addPatientPhysicalExamFileForm.get("profilePic").value
    );
    formData.append("byWhom", "admin");

    this.loginService
      .addPatientPhysicalExamRecordAttachmentData(
        formData,
        this.signObj.access_token
      )
      .subscribe(
        (updateAdminGenUserData) => {
          console.log(
            "res from add patient phy exam Attachment data : ",
            updateAdminGenUserData
          );
          if (updateAdminGenUserData.response === 3) {
            this.callPatientMedicalReocrds();
            this.fetchPatientPhysicalExamRecords();
            this.isLoading = false;
            this.removeUploadedFile();
            this.openSnackBar(updateAdminGenUserData.message, "");
            this.modalService.dismissAll();
          } else {
            this.isLoading = false;
            //this.loading = false;
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
            console.log("Server Side", err);
          }
        }
      );
  }

  //Fetch Patient Physical Exam Reocrds
  fetchPatientPhysicalExamRecords() {
    this.fetchPatientPhysicalExamObj = {
      hospital_reg_num: this.signObj.hospitalAdmin.hospital_reg_num,
      patientID: this.patGenInfoSuccessData.patientId,
      medical_record_id: this.patGenInfoSuccessData.medical_record_id,
      byWhomID: this.signObj.hospitalAdmin.userID,
      byWhom: "admin",
    };
    this.loginService
      .getPatientPhysicalExamRecordsData(
        this.fetchPatientPhysicalExamObj,
        this.signObj.access_token
      )
      .subscribe(
        (res) => {
          if (res.response === 3) {
            this.loading = false;
            this.PhysicalExamination = res.physical_exam_records;
            console.log(
              "Res from Patient Phy Exam Records Data : ",
              this.PhysicalExamination
            );
          } else if (res.response === 0) {
            this.loading = false;
            this.PhysicalExamination = [];
          }
        },
        (err: HttpErrorResponse) => {
          if (err.error instanceof Error) {
            this.loading = false;
            console.log("Client Side Error");
          } else {
            this.loading = false;
            console.log(err);
          }
        }
      );
  }

  //Update Patient Physical Exam Manually
  updatePatientManualSubmit(selectedInvoicesData) {
    this.isLoading = true;
    this.selectedPatManualData = selectedInvoicesData;

    //let formOneData = this.basicExamEditForm.value;
    let formOneData = {
      height: "" + this.basicExamEditForm.value.height + " " + "CM",
      weight: "" + this.basicExamEditForm.value.weight + " " + "KG",
      waistline: "" + this.basicExamEditForm.value.waistline + " " + "CM",
      bmi: "" + this.basicExamEditForm.value.bmi,
      bloodPressure: "" + this.basicExamEditForm.value.bloodPressure,
    };

    let phyExamUpdateData: any[] = this.selectedPatSystemExamData;

    this.updatePatientPhysicalExamManullyObj = {
      //"medical_personnel_id": selectedInvoicesData.medical_personnel_id,
      hospital_reg_num: selectedInvoicesData.hospital_reg_num,
      patientID: selectedInvoicesData.patientID,
      medical_record_id: selectedInvoicesData.medical_record_id,
      byWhom: "admin",
      byWhomID: this.signObj.hospitalAdmin.userID,
      physical_exam_id: selectedInvoicesData.physical_exam_id,
      bodyIndex: formOneData,
      physicalExamination: phyExamUpdateData,
      other: this.belowEditForm.value.other,
      physicianCommentsOrRecomdations: this.belowEditForm.value
        .physicianCommentsOrRecomdations,
    };

    console.log(
      "the sended obj data for pat phy exam update manual : ",
      this.updatePatientPhysicalExamManullyObj
    );

    this.loginService
      .updatePatientPhysicalExamRecordsManually(
        this.updatePatientPhysicalExamManullyObj,
        this.signObj.access_token
      )
      .subscribe(
        (res) => {
          if (res.response === 3) {
            this.callPatientMedicalReocrds();
            this.fetchPatientPhysicalExamRecords();
            this.isLoading = false;
            //this.ngOnInit();
            //this.loading = false;
            this.openSnackBar(res.message, "");
            this.modalService.dismissAll();
            console.log(
              "res from update patient physical exam records manually from component Success : ",
              res.message,
              res.physical_exam_id
            );
          } else if (res.response === 0) {
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
            console.log("Client Side Error");
          } else {
            this.isLoading = false;
            //this.loading = false;
            console.log(err);
          }
        }
      );
  }

  deletePatientPhyExamData(selectedMedicalHistory) {
    this.isLoading = true;
    this.deletePatientPhyExamRecordObj = {
      hospital_reg_num: selectedMedicalHistory.hospital_reg_num,
      medical_record_id: selectedMedicalHistory.medical_record_id,
      patientID: selectedMedicalHistory.patientID,
      physical_exam_id: selectedMedicalHistory.physical_exam_id,
      byWhom: "admin",
      byWhomID: this.signObj.hospitalAdmin.userID,
    };
    this.loginService
      .deletePatientPhysicalExamRecordData(
        this.deletePatientPhyExamRecordObj,
        this.signObj.access_token
      )
      .subscribe(
        (res) => {
          if (res.response === 3) {
            this.callPatientMedicalReocrds();
            this.fetchPatientPhysicalExamRecords();
            this.isLoading = false;
            //this.loading = false;
            this.openSnackBar(res.message, "");
            this.modalService.dismissAll();
            //this.fetchPatientPhysicalExamRecords();
            // this.ngOnInit()
            console.log(
              "Res from Patient Phy Exam Data Delete : ",
              res.message
            );
          } else if (res.response === 0) {
            this.isLoading = false;
            //this.loading = false;
            this.openSnackBar(res.message, "");
            console.log(
              "Res from Patient Phy Exam Data Delete : ",
              res.message
            );
            //this.modalService.dismissAll();
          }
        },
        (err: HttpErrorResponse) => {
          if (err.error instanceof Error) {
            this.isLoading = false;
            //this.loading = false;
            console.log("Client Side Error");
          } else {
            this.isLoading = false;
            //this.loading = false;
            console.log(err);
          }
        }
      );
  }

  deletePatientPhyExamDataAttachment(selectedMedicalHistory) {
    this.isLoading = true;
    this.deletePatientPhyExamRecordObj = {
      hospital_reg_num: selectedMedicalHistory.hospital_reg_num,
      medical_record_id: selectedMedicalHistory.medical_record_id,
      patientID: selectedMedicalHistory.patientID,
      physical_exam_id: selectedMedicalHistory.physical_exam_id,
      byWhom: "admin",
      byWhomID: this.signObj.hospitalAdmin.userID,
    };
    this.loginService
      .deletePatientPhysicalExamRecordData(
        this.deletePatientPhyExamRecordObj,
        this.signObj.access_token
      )
      .subscribe(
        (res) => {
          if (res.response === 3) {
            this.callPatientMedicalReocrds();
            this.fetchPatientPhysicalExamRecords();
            this.isLoading = false;
            //this.loading = false;
            this.openSnackBar(res.message, "");
            this.modalService.dismissAll();
            //this.fetchPatientPhysicalExamRecords();
            // this.ngOnInit()
            console.log(
              "Res from Patient Phy Exam Data Delete : ",
              res.message
            );
          } else if (res.response === 0) {
            this.isLoading = false;
            //this.loading = false;
            this.openSnackBar(res.message, "");
            console.log(
              "Res from Patient Phy Exam Data Delete : ",
              res.message
            );
            //this.modalService.dismissAll();
          }
        },
        (err: HttpErrorResponse) => {
          if (err.error instanceof Error) {
            this.isLoading = false;
            //this.loading = false;
            console.log("Client Side Error");
          } else {
            this.isLoading = false;
            //this.loading = false;
            console.log(err);
          }
        }
      );
  }

  //Fetch Patient Immunization Reocrds
  fetchPatientImmunizationRecords() {
    this.fetchPatientImmunizationObj = {
      hospital_reg_num: this.signObj.hospitalAdmin.hospital_reg_num,
      patientID: this.patGenInfoSuccessData.patientId,
      medical_record_id: this.patGenInfoSuccessData.medical_record_id,
      byWhom: "admin",
      byWhomID: this.signObj.hospitalAdmin.userID,
    };
    this.loginService
      .getPatientImmunizationRecordsData(
        this.fetchPatientImmunizationObj,
        this.signObj.access_token
      )
      .subscribe(
        (res) => {
          if (res.response === 3) {
            this.loading = false;
            this.Immunizations = res.immunization_records;
            console.log(
              "Res from Patient immunization_records Records Data : ",
              this.Immunizations
            );
          } else if (res.response === 0) {
            this.Immunizations = [];
            this.loading = false;
          }
        },
        (err: HttpErrorResponse) => {
          if (err.error instanceof Error) {
            this.loading = false;
            console.log("Client Side Error");
          } else {
            this.loading = false;
            console.log(err);
          }
        }
      );
  }

  //Add Patient Immunization Data
  addPatImmunizationSubmit() {
    this.isLoading = true;
    let ngbDate = this.addPatImmunizationForm.controls["immunizationDate"]
      .value;
    let myDate = new Date(ngbDate.year, ngbDate.month - 1, ngbDate.day);
    var dateAr = myDate.toLocaleDateString().split("/");
    var newDate = dateAr[2] + "/" + dateAr[0] + "/" + dateAr[1];
    var unixTimeData = new Date(newDate).getTime() / 1000;
    this.addImmunizationDataObj = {
      hospital_reg_num: this.signObj.hospitalAdmin.hospital_reg_num,
      immunizationName: this.addPatImmunizationForm.value.immunizationName,
      immunizationDate: "" + unixTimeData,
      notes: this.addPatImmunizationForm.value.notes,
      patientID: this.patGenInfoSuccessData.patientId,
      medical_record_id: this.patGenInfoSuccessData.medical_record_id,
      byWhom: this.addPatImmunizationForm.value.byWhom,
      byWhomID: this.addPatImmunizationForm.value.byWhomID,
      doctorMPID: this.addPatImmunizationForm.value.doctorMPID,
      doctorName: this.addPatImmunizationForm.value.doctorName,
    };
    console.log(
      "the sended obj data for pat immunization data add : ",
      this.addImmunizationDataObj
    );
    this.loginService
      .addPatientImmunizationData(
        this.addImmunizationDataObj,
        this.signObj.access_token
      )
      .subscribe(
        (res) => {
          if (res.response === 3) {
            this.addPatImmunizationForm.reset();
            this.isLoading = false;
            this.fetchPatientImmunizationRecords();
            this.loading = false;
            this.openSnackBar(res.message, "");
            this.modalService.dismissAll();
            console.log(
              "res from add patient immunization data from component Success : ",
              res.message,
              res.immunization_record_id
            );
          } else if (res.response === 0) {
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
            console.log("Client Side Error");
          } else {
            this.isLoading = false;
            //this.loading = false;
            console.log(err);
          }
        }
      );
  }

  //Update Pat Immunization Data
  editPatImmunizationSubmit(selectedInvoicesData) {
    this.isLoading = true;

    let ngbDate = this.editPatImmunizationForm.controls["immunizationDate"]
      .value;
    let myDate = new Date(ngbDate.year, ngbDate.month - 1, ngbDate.day);
    var dateAr = myDate.toLocaleDateString().split("/");
    var newDate = dateAr[2] + "/" + dateAr[0] + "/" + dateAr[1];
    var unixTimeData = new Date(newDate).getTime() / 1000;

    let editImmunizationsObj = {
      hospital_reg_num: selectedInvoicesData.hospital_reg_num,
      patientID: selectedInvoicesData.patientID,
      medical_record_id: selectedInvoicesData.medical_record_id,
      immunization_record_id: selectedInvoicesData.immunization_record_id,
      immunizationName: this.editPatImmunizationForm.value.immunizationName,
      immunizationDate: "" + unixTimeData,
      notes: this.editPatImmunizationForm.value.notes,
      byWhom: "admin",
      byWhomID: this.signObj.hospitalAdmin.userID,
      doctorMPID:
        this.editPatImmunizationForm.value.doctorMPID ||
        selectedInvoicesData.doctorMPID,
      doctorName:
        this.editPatImmunizationForm.value.doctorName ||
        selectedInvoicesData.doctorName,
    };
    console.log("Req for Edit Immunization Data : ", editImmunizationsObj);

    this.loginService
      .updatePatientImmunizationData(
        editImmunizationsObj,
        this.signObj.access_token
      )
      .subscribe(
        (resForRescheduleAppointment) => {
          if (resForRescheduleAppointment.response === 3) {
            this.fetchPatientImmunizationRecords();
            this.isLoading = false;
            this.openSnackBar(resForRescheduleAppointment.message, "");
            this.modalService.dismissAll();
          } else {
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
            console.log("Server Side", err);
          }
        }
      );
  }

  //Delete Immunization Record
  deletePatientImmunizationData(selectedInvoicesData) {
    this.isLoading = true;
    this.deletePatientImmunizationRecordObj = {
      hospital_reg_num: selectedInvoicesData.hospital_reg_num,
      byWhom: "admin",
      byWhomID: this.signObj.hospitalAdmin.userID,
      medical_record_id: selectedInvoicesData.medical_record_id,
      patientID: selectedInvoicesData.patientID,
      immunization_record_id: selectedInvoicesData.immunization_record_id,
    };
    this.loginService
      .deletePatientImmunizationRecordData(
        this.deletePatientImmunizationRecordObj,
        this.signObj.access_token
      )
      .subscribe(
        (res) => {
          if (res.response === 3) {
            this.isLoading = false;
            //this.loading = false;
            this.openSnackBar(res.message, "");
            this.modalService.dismissAll();
            this.fetchPatientImmunizationRecords();
            // this.ngOnInit()
            console.log(
              "Res from Patient Immunization Record Data Delete : ",
              res.message
            );
          } else if (res.response === 0) {
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
            console.log("Client Side Error");
          } else {
            this.isLoading = false;
            //this.loading = false;
            console.log(err);
          }
        }
      );
  }

  //Fetch Patient Medical Reocrd Illness
  fetchPatientMedicalRecordIllness() {
    this.fetchPatientMedicalRecordIllnessObj = {
      hospital_reg_num: this.signObj.hospitalAdmin.hospital_reg_num,
      patientID: this.patGenInfoSuccessData.patientId,
      medical_record_id: this.patGenInfoSuccessData.medical_record_id,
      byWhomID: this.signObj.hospitalAdmin.userID,
      byWhom: "admin",
    };
    this.loginService
      .getPatientMedicalRecordsIllnessData(
        this.fetchPatientMedicalRecordIllnessObj,
        this.signObj.access_token
      )
      .subscribe(
        (res) => {
          if (res.response === 3) {
            this.loading = false;
            //this.a.a1 = res.illnessRecords;
            this.MedicalHistory = res.illnessRecords;
            this.availableIllnessIDs = [];
            for (let i = 0; i <= this.MedicalHistory.length - 1; i++) {
              this.availableIllnessIDs.push({ value: this.MedicalHistory[i].illnessID });
            }
            console.log("Available Illness-ID's Of the Patient : ", this.availableIllnessIDs);

          } else if (res.response === 0) {
            this.loading = false;
            this.MedicalHistory = [];
          }
        },
        (err: HttpErrorResponse) => {
          if (err.error instanceof Error) {
            this.loading = false;
            console.log("Client Side Error");
          } else {
            this.loading = false;
            console.log(err);
          }
        }
      );
  }

  //Add Pat Medical Illness Record
  addPatMedicalRecordIllnessSubmit() {
    this.isLoading = true;
    let ngbDate = this.addPatIllnessForm.controls["startDate"].value;
    let myDate = new Date(ngbDate.year, ngbDate.month - 1, ngbDate.day);
    var dateAr = myDate.toLocaleDateString().split("/");
    var newDate = dateAr[2] + "/" + dateAr[0] + "/" + dateAr[1];
    var unixTimeData = new Date(newDate).getTime() / 1000;

    console.log("start date : ", unixTimeData);

    let ngbDate1 = this.addPatIllnessForm.controls["endDate"].value;
    let myDate1 = new Date(ngbDate1.year, ngbDate1.month - 1, ngbDate1.day);
    var dateAr1 = myDate1.toLocaleDateString().split("/");
    var newDate1 = dateAr1[2] + "/" + dateAr1[0] + "/" + dateAr1[1];
    var unixTimeData1 = new Date(newDate1).getTime() / 1000;

    console.log("end date : ", unixTimeData1);

    this.addPatMedicalRecordIllnessObj = {
      hospital_reg_num: this.signObj.hospitalAdmin.hospital_reg_num,
      patientID: this.patGenInfoSuccessData.patientId,
      medical_record_id: this.patGenInfoSuccessData.medical_record_id,
      illnessCondition: this.addPatIllnessForm.value.illnessCondition,
      symptoms: this.addPatIllnessForm.value.symptoms,
      currentStatus: this.addPatIllnessForm.value.currentStatus,
      description: this.addPatIllnessForm.value.description,
      isCurrentIllness: this.addPatIllnessForm.value.isCurrentIllness,
      byWhom: "admin",
      byWhomID: this.signObj.hospitalAdmin.userID,
      startDate: "" + unixTimeData,
      endDate: "" + unixTimeData1,
    };
    console.log(
      "the sended obj data for pat iLLNESS data add : ",
      this.addPatMedicalRecordIllnessObj
    );
    this.loginService
      .addPatientMedicalRecordIllnessData(
        this.addPatMedicalRecordIllnessObj,
        this.signObj.access_token
      )
      .subscribe(
        (res) => {
          if (res.response === 3) {
            this.addPatIllnessForm.reset();
            this.fetchPatientMedicalRecordIllness();
            this.openSnackBar(res.message, "");
            //alert(res.message);
            this.openPatientDiagnostic();
            this.isLoading = false;
            this.createdIllnessID = res.illnessID;
            this.availableIllnessIDs = [];
            if (this.availableIllnessIDs && this.availableIllnessIDs.length) {
              this.availableIllnessIDs.push({ value: res.illnessID });
            }

            console.log("Available Illness-ID's Of the Patient : ", this.availableIllnessIDs);

            //this.loading = false;
            //this.modalService.dismissAll();
            //this.ngOnInit();
            console.log(
              "res from add patient medical record illness data from component Success : ",
              res.message,
              res.illnessID
            );
          } else if (res.response === 0) {
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
            console.log("Client Side Error");
          } else {
            this.isLoading = false;
            //this.loading = false;
            console.log(err);
          }
        }
      );
  }

  //Add Pat Medical Diagnosis Notes
  addPatMedicalRecordDiagnosisNotesSubmit() {
    this.isLoading = true;
    let ngbDate = this.addPatIllnessDiagnosisForm.controls["diagnosisDate"]
      .value;
    let myDate = new Date(ngbDate.year, ngbDate.month - 1, ngbDate.day);
    var dateAr = myDate.toLocaleDateString().split("/");
    var newDate = dateAr[2] + "/" + dateAr[0] + "/" + dateAr[1];
    var unixTimeData = new Date(newDate).getTime() / 1000;
    console.log("add ill medication date mydate : ", unixTimeData);
    //console.log("Add PAt Immunization Form Data : ",this.addPatImmunizationForm);
    this.addPatIllnessDiagnosisDataObj = {
      hospital_reg_num: this.signObj.hospitalAdmin.hospital_reg_num,
      byWhom: this.addPatIllnessDiagnosisForm.value.byWhom,
      byWhomID: this.addPatIllnessDiagnosisForm.value.byWhomID,
      patientID: this.patGenInfoSuccessData.patientId,
      medical_record_id: this.patGenInfoSuccessData.medical_record_id,
      illnessID: this.createdIllnessID,
      doctorMedicalPersonnelID: this.addPatIllnessDiagnosisForm.value.byWhomID,
      doctorName: this.addPatIllnessDiagnosisForm.value.doctorName,
      diagnosisDate: "" + unixTimeData,
      diagnosis: this.addPatIllnessDiagnosisForm.value.diagnosis,
      prescription: this.addPatIllnessDiagnosisForm.value.prescription,
      remark: this.addPatIllnessDiagnosisForm.value.remark,
    };
    console.log(
      "the sended obj data for pat ill diAgnosis data add : ",
      this.addPatIllnessDiagnosisDataObj
    );
    this.loginService
      .addPatientIllnessDiagnosisData(
        this.addPatIllnessDiagnosisDataObj,
        this.signObj.access_token
      )
      .subscribe(
        (res) => {
          if (res.response === 3) {
            this.addPatIllnessDiagnosisForm.reset();
            this.medicalPersonnelObj = "";
            this.isLoading = false;
            //alert(res.message);
            this.openSnackBar(res.message, "");
            this.openPatientMedications();
            //this.loading = false;
            //this.modalService.dismissAll();
            console.log(
              "res from add patient ill diagnosis data from component Success : ",
              res.message
            );
          } else if (res.response === 0) {
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
            console.log("Client Side Error");
          } else {
            this.isLoading = false;
            //this.loading = false;
            console.log(err);
          }
        }
      );
  }

  //Add Pat Illness Medication Manually
  addPatIllnessMedicationManuallySubmit() {
    this.isLoading = true;
    let payLoad = this.addPatIllMedicationManuallyForm.value.addMedicationArray;
    let addMedicationArray: any[] = [];
    for (let i: number = 0; i <= payLoad.length - 1; i++) {
      addMedicationArray.push({
        name: payLoad[i].name,
        dosage: payLoad[i].dosage,
        freq: payLoad[i].freq,
        purpose: " ",
        durationDays: 5,
        moreDetails: " ",
      });
    }
    console.log("addMedicationArray data from form : ", addMedicationArray);
    this.addPatientIllnessMedicationObj = {
      hospital_reg_num: this.addPatIllnessDiagnosisDataObj.hospital_reg_num,
      byWhom: this.addPatIllnessDiagnosisDataObj.byWhom,
      byWhomID: this.addPatIllnessDiagnosisDataObj.byWhomID,
      patientID: this.addPatIllnessDiagnosisDataObj.patientID,
      medical_record_id: this.addPatIllnessDiagnosisDataObj.medical_record_id,
      illnessID: this.addPatIllnessDiagnosisDataObj.illnessID,
      doctorMedicalPersonnelID: this.addPatIllMedicationManuallyForm.value
        .doctorMedicalPersonnelID,
      doctorName: this.addPatIllMedicationManuallyForm.value.doctorName,
      medications: addMedicationArray,
    };
    console.log(
      "the req for add pat illness medications obj : ",
      this.addPatientIllnessMedicationObj
    );
    this.loginService
      .addPatientIllnessMedicationManualData(
        this.addPatientIllnessMedicationObj,
        this.signObj.access_token
      )
      .subscribe(
        (res) => {
          console.log("res from add patient illness medications  : ", res);
          if (res.response === 3) {
            this.addPatIllMedicationManuallyForm.reset();
            addMedicationArray = [];
            this.isLoading = false;
            this.loading = false;
            this.illnessMedicationID = res.illnessMedicationID;
            this.viewAttachment();
            //alert(res.message);
            this.openSnackBar(res.message, "");
            //this.ngOnInit();
          } else if (res.response === 0) {
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
            console.log("Client Side Error");
          } else {
            this.isLoading = false;
            this.loading = false;
            console.log(err);
          }
        }
      );
  }

  //Add Patient Medical Record Illness Medication Attachment
  addPatientMedicalHistoryIllnessMedicationAttachmentSubmit() {
    this.isLoading = true;
    let formData = new FormData();

    formData.append("illnessID", this.addPatientIllnessMedicationObj.illnessID);
    formData.append(
      "prescription1",
      this.addPatientMedHistoryFileForm.get("profilePic").value
    );
    formData.append(
      "prescription1MoreDetails",
      this.addPatientMedHistoryFileForm.value.prescription1MoreDetails
    );
    formData.append("illnessMedicationID", this.illnessMedicationID);
    formData.append(
      "doctorMedicalPersonnelID",
      this.addPatientIllnessMedicationObj.doctorMedicalPersonnelID
    );
    formData.append(
      "doctorName",
      this.addPatientIllnessMedicationObj.doctorName
    );
    formData.append("patientID", this.addPatientIllnessMedicationObj.patientID);
    formData.append(
      "medical_record_id",
      this.addPatientIllnessMedicationObj.medical_record_id
    );
    formData.append("byWhom", this.addPatientIllnessMedicationObj.byWhom);
    formData.append("byWhomID", this.addPatientIllnessMedicationObj.byWhomID);
    formData.append(
      "hospital_reg_num",
      this.addPatientIllnessMedicationObj.hospital_reg_num
    );

    this.loginService
      .addPatientMedicalHistoryIllnessMedicationAttachment(
        formData,
        this.signObj.access_token
      )
      .subscribe(
        (updateAdminGenUserData) => {
          console.log(
            "res from add patient Medial-Record Illness Attachment data : ",
            updateAdminGenUserData
          );
          if (updateAdminGenUserData.response === 3) {
            this.addPatientMedHistoryFileForm.reset();
            this.isLoading = false;
            this.removeUploadedFile2();
            //alert(updateAdminGenUserData.message);
            this.openSnackBar(updateAdminGenUserData.message, "");
            this.openPatientSurgical();
            //this.modalService.dismissAll();
            //this.ngOnInit();
          } else {
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
            console.log("Server Side", err);
          }
        }
      );
  }

  //Add Pat Medical Diagnosis Notes
  addPatIllSurgicalFormSubmit() {
    this.isLoading = true;
    let ngbDate = this.addPatIllnessSurgicalForm.controls["surgeryDate"].value;
    let myDate = new Date(ngbDate.year, ngbDate.month - 1, ngbDate.day);
    var dateAr = myDate.toLocaleDateString().split("/");
    var newDate = dateAr[2] + "/" + dateAr[0] + "/" + dateAr[1];
    var unixTimeData = new Date(newDate).getTime() / 1000;
    console.log(
      "add ill addPatIllnessSurgicalForm date mydate : ",
      unixTimeData
    );
    //console.log("Add PAt Immunization Form Data : ",this.addPatImmunizationForm);

    let payLoad = this.addPatIllnessSurgicalForm.value;
    let formData = new FormData();

    formData.append("patientID", this.addPatientIllnessMedicationObj.patientID);
    formData.append(
      "medical_record_id",
      this.addPatientIllnessMedicationObj.medical_record_id
    );
    formData.append(
      "hospital_reg_num",
      this.addPatientIllnessMedicationObj.hospital_reg_num
    );
    formData.append("illnessID", this.addPatientIllnessMedicationObj.illnessID);
    formData.append("byWhom", this.addPatientIllnessMedicationObj.byWhom);
    formData.append("byWhomID", this.addPatientIllnessMedicationObj.byWhomID);
    formData.append(
      "surgicalRecord",
      this.addPatIllnessSurgicalForm.get("profilePic").value
    );
    formData.append(
      "moreDetails",
      this.addPatIllnessSurgicalForm.value.moreDetails
    );
    formData.append(
      "doctorMedicalPersonnelID",
      this.addPatIllnessSurgicalForm.value.doctorMedicalPersonnelID
    );
    formData.append(
      "doctorName",
      this.addPatIllnessSurgicalForm.value.doctorName
    );
    formData.append(
      "surgeryProcedure",
      this.addPatIllnessSurgicalForm.value.surgeryProcedure
    );
    formData.append("surgeryDate", "" + unixTimeData);
    //formData.append("surgeryInformtion", this.addPatIllnessSurgicalForm.value.surgeryInformation);

    console.log(
      "the sended obj data for pat ill surgical record data add : ",
      formData
    );
    this.loginService
      .addPatIllSurgicalFormData(formData, this.signObj.access_token)
      .subscribe(
        (res) => {
          if (res.response === 3) {
            this.addPatIllnessSurgicalForm.reset();
            this.isLoading = false;
            this.removeUploadedFile3();
            //this.openPatientMedications();
            //this.loading = false;
            //alert(res.message);
            this.openSnackBar(res.message, "");
            this.modalService.dismissAll();
            console.log(
              "res from add patient ill surgical data from component Success : ",
              res.message
            );
          } else if (res.response === 0) {
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
            console.log("Client Side Error");
          } else {
            this.isLoading = false;
            //this.loading = false;
            console.log(err);
          }
        }
      );
  }

  //Edit Pat Illness Data
  editPatIllnessSubmit(selectedMedicalHistory) {
    console.log("the selected illness data : ", selectedMedicalHistory);

    this.isLoading = true;
    let ngbDate = this.editPatIllnessForm.controls["startDate"].value;
    let myDate = new Date(ngbDate.year, ngbDate.month - 1, ngbDate.day);
    var dateAr = myDate.toLocaleDateString().split("/");
    var newDate = dateAr[2] + "/" + dateAr[0] + "/" + dateAr[1];
    var unixTimeData21 = new Date(newDate).getTime() / 1000;

    console.log("start date : ", unixTimeData21);

    let ngbDate1 = this.editPatIllnessForm.controls["endDate"].value;
    let myDate1 = new Date(ngbDate1.year, ngbDate1.month - 1, ngbDate1.day);
    var dateAr1 = myDate1.toLocaleDateString().split("/");
    var newDate1 = dateAr1[2] + "/" + dateAr1[0] + "/" + dateAr1[1];
    var unixTimeData22 = new Date(newDate1).getTime() / 1000;

    console.log("end date : ", unixTimeData22);

    this.isLoading = true;
    let editPatIllnessObj = {
      hospital_reg_num: selectedMedicalHistory.hospital_reg_num,
      patientID: selectedMedicalHistory.patientID,
      medical_record_id: selectedMedicalHistory.medical_record_id,
      illnessCondition: this.editPatIllnessForm.value.illnessCondition,
      symptoms: this.editPatIllnessForm.value.symptoms,
      currentStatus: this.editPatIllnessForm.value.currentStatus,
      description: this.editPatIllnessForm.value.description,
      isCurrentIllness: this.editPatIllnessForm.value.isCurrentIllness,
      illnessID: selectedMedicalHistory.illnessID,
      byWhom: "admin",
      byWhomID: this.signObj.hospitalAdmin.userID,
      startDate: "" + unixTimeData21,
      endDate: "" + unixTimeData22,
    };
    console.log("Updated Illness Data : ", editPatIllnessObj);

    this.loginService
      .updatePatientIllnessData(editPatIllnessObj, this.signObj.access_token)
      .subscribe(
        (res) => {
          if (res.response === 3) {
            this.isLoading = false;
            //alert(res.message);
            this.openPatientDiagnostic2();
            this.openSnackBar(res.message, "");
            //this.modalService.dismissAll();
            //this.ngOnInit();
          } else {
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
            console.log("Server Side", err);
          }
        }
      );
  }

  //Edit Pat Illness Diagnostic Data
  editPatMedicalRecordDiagnosticSubmit() {
    //this.illnessDiagnosticNotes
    this.isLoading = true;
    let ngbDate = this.editPatIllnessDiagnosisForm.controls["diagnosisDate"]
      .value;
    let myDate = new Date(ngbDate.year, ngbDate.month - 1, ngbDate.day);
    var dateAr = myDate.toLocaleDateString().split("/");
    var newDate = dateAr[2] + "/" + dateAr[0] + "/" + dateAr[1];
    var unixTimeData = new Date(newDate).getTime() / 1000;
    console.log("add ill medication date mydate : ", unixTimeData);
    //console.log("Add PAt Immunization Form Data : ",this.addPatImmunizationForm);
    this.editPatIllnessDiagnosisDataObj = {
      hospital_reg_num: this.illnessDiagnosticNotes[0].hospital_reg_num,
      byWhom: this.editPatIllnessDiagnosisForm.value.byWhom,
      byWhomID: this.editPatIllnessDiagnosisForm.value.byWhomID,
      patientID: this.illnessDiagnosticNotes[0].patientID,
      medical_record_id: this.illnessDiagnosticNotes[0].medical_record_id,
      illnessID: this.illnessDiagnosticNotes[0].illnessID,
      doctorMedicalPersonnelID: this.editPatIllnessDiagnosisForm.value
        .doctorMedicalPersonnelID,
      doctorName: this.editPatIllnessDiagnosisForm.value.doctorName,
      diagnosisDate: "" + unixTimeData,
      diagnosis: this.editPatIllnessDiagnosisForm.value.diagnosis,
      prescription: this.editPatIllnessDiagnosisForm.value.prescription,
      remark: this.editPatIllnessDiagnosisForm.value.remark,
      illnessDiagnosisID: this.illnessDiagnosticNotes[0].illnessDiagnosisID,
    };
    console.log(
      "the sended obj data for pat ill diAgnosis data update : ",
      this.editPatIllnessDiagnosisDataObj
    );
    this.loginService
      .editPatientIllnessDiagnosisData(
        this.editPatIllnessDiagnosisDataObj,
        this.signObj.access_token
      )
      .subscribe(
        (res) => {
          if (res.response === 3) {
            this.isLoading = false;
            //alert(res.message);
            this.openSnackBar(res.message, "");
            this.openPatientMedications2();
            //this.loading = false;
            //this.modalService.dismissAll();
            console.log(
              "res from update patient ill diagnosis data from component Success : ",
              res.message
            );
          } else if (res.response === 0) {
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
            console.log("Client Side Error");
          } else {
            this.isLoading = false;
            //this.loading = false;
            console.log(err);
          }
        }
      );
  }

  //Update Pat Illness Medication Manually
  editPatIllnessMedicationManuallySubmit() {
    this.isLoading = true; //editPatIllMedicationManuallyForm
    let payLoad = this.editPatIllMedicationManuallyForm.value
      .editMedicationArray;
    let editMedicationArray: any[] = [];
    for (let i: number = 0; i <= payLoad.length - 1; i++) {
      editMedicationArray.push({
        name: payLoad[i].name,
        dosage: payLoad[i].dosage,
        freq: payLoad[i].freq,
        purpose: " ",
        durationDays: 5,
        moreDetails: " ",
      });
    }
    // this.illnessMedications fetched medication data
    console.log(
      "edit update medicationsArray data from form : ",
      editMedicationArray
    );
    this.editPatientIllnessMedicationObj = {
      hospital_reg_num: this.illnessMedications[0].hospital_reg_num,
      byWhom: "admin",
      byWhomID: this.signObj.hospitalAdmin.userID,
      patientID: this.illnessMedications[0].patientID,
      medical_record_id: this.illnessMedications[0].medical_record_id,
      illnessID: this.illnessMedications[0].illnessID,
      doctorMedicalPersonnelID: this.illnessMedications[0].mannualPrescriptions
        .doctorMedicalPersonnelID,
      doctorName: this.illnessMedications[0].mannualPrescriptions.doctorName,
      illnessMedicationID: this.illnessMedications[0].illnessMedicationID,
      medications: editMedicationArray,
    };
    console.log(
      "the req for update pat illness medications obj : ",
      this.editPatientIllnessMedicationObj
    );
    this.loginService
      .updatePatientIllnessMedicationManualData(
        this.editPatientIllnessMedicationObj,
        this.signObj.access_token
      )
      .subscribe(
        (res) => {
          console.log("res from update patient illness medications  : ", res);
          if (res.response === 3) {
            this.isLoading = false;
            this.loading = false;
            //alert(res.message);
            this.openSnackBar(res.message, "");
            this.viewAttachment2();
            //this.ngOnInit();
            console.log(
              "Res from Patient illness update Medications Data : ",
              res
            );
          } else if (res.response === 0) {
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
            console.log("Client Side Error");
          } else {
            this.isLoading = false;
            this.loading = false;
            console.log(err);
          }
        }
      );
  }

  //edit Patient Medical Record Illness Medication Attachment
  editPatientMedicalHistoryIllnessMedicationAttachmentSubmit() {
    //this.illnessMedications
    this.isLoading = true;
    let formData = new FormData();

    formData.append("illnessID", this.illnessMedications[0].illnessID);
    formData.append(
      "prescription1",
      this.editPatientMedHistoryFileForm.get("profilePic").value
    );
    formData.append(
      "prescription1MoreDetails",
      this.editPatientMedHistoryFileForm.value.prescription1MoreDetails
    );
    formData.append(
      "illnessMedicationID",
      this.illnessMedications[0].illnessMedicationID
    );
    formData.append(
      "doctorMedicalPersonnelID",
      this.illnessMedications[0].attachedPrescriptions.doctorMedicalPersonnelID
    );
    formData.append(
      "doctorName",
      this.illnessMedications[0].attachedPrescriptions.doctorName
    );
    formData.append("patientID", this.illnessMedications[0].patientID);
    formData.append(
      "medical_record_id",
      this.illnessMedications[0].medical_record_id
    );
    formData.append("byWhom", "admin");
    formData.append("byWhomID", this.signObj.hospitalAdmin.userID);
    formData.append(
      "hospital_reg_num",
      this.illnessMedications[0].hospital_reg_num
    );

    this.loginService
      .editPatientMedicalHistoryIllnessMedicationAttachment(
        formData,
        this.signObj.access_token
      )
      .subscribe(
        (updateAdminGenUserData) => {
          console.log(
            "res from update patient Medial-Record Illness Attachment data : ",
            updateAdminGenUserData
          );
          if (updateAdminGenUserData.response === 3) {
            this.isLoading = false;
            this.openPatientSurgical2();
            this.openSnackBar(updateAdminGenUserData.message, "");
            //this.ngOnInit();
          } else {
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
            console.log("Server Side", err);
          }
        }
      );
  }

  //Mat Snack Bar
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 5000,
      verticalPosition: "bottom", // 'top' | 'bottom'
      horizontalPosition: "right", //'start' | 'center' | 'end' | 'left' | 'right'
    });
  }

  //Open DoctorsList Model
  openDoctorModel(content2) {
    this.modalService
      .open(content2, {
        ariaLabelledBy: "modal-basic-title",
        centered: true,
        size: "md", backdrop: false
      })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }
  openViewModal(viewContent) {
    this.modalService
      .open(viewContent, {
        ariaLabelledBy: "modal-basic-title",
        centered: true,
        size: "md", backdrop: false
      })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }
  openEditPhyExamModal(viewEditPhyExamContent, selectedInvoicesData) {
    console.log("selected Phy exam data : ", selectedInvoicesData);
    if (selectedInvoicesData && selectedInvoicesData.attachment) {
      this.HaveBodyIndex = true;
      //this.haveBodyIndexData= true;
      this.viewAttachment();
      this.fetchedPatPhyExamAttachments = selectedInvoicesData.attachment;
      console.log("dont have bodyindex");
      console.log(
        "selected phy exam attachment : ",
        selectedInvoicesData.attachment
      );
    } else {
      this.HaveBodyIndex = true;
      //this.haveBodyIndexData= false;
      this.viewManualInput();
      this.viewBasicExam();
      this.basicExamEditForm.patchValue({
        height: selectedInvoicesData.bodyIndex.height.substr(
          0,
          selectedInvoicesData.bodyIndex.height.indexOf(" ")
        ), //str.substr(0,str.indexOf(' '));
        bmi: selectedInvoicesData.bodyIndex.bmi,
        weight: selectedInvoicesData.bodyIndex.weight.substr(
          0,
          selectedInvoicesData.bodyIndex.weight.indexOf(" ")
        ),
        bmr: [""],
        waistline: selectedInvoicesData.bodyIndex.waistline.substr(
          0,
          selectedInvoicesData.bodyIndex.waistline.indexOf(" ")
        ),
        bloodPressure: selectedInvoicesData.bodyIndex.bloodPressure,
      });

      this.selectedPatSystemExamData = selectedInvoicesData.physicalExamination;
      console.log(
        "selectedPatSystemExamData : ",
        this.selectedPatSystemExamData
      );

      this.belowEditForm.patchValue({
        other: selectedInvoicesData.other,
        physicianCommentsOrRecomdations:
          selectedInvoicesData.physicianCommentsOrRecomdations,
      });
    }
    //this.viewManualInput();
    //this.viewBasicExam();
    this.modalService
      .open(viewEditPhyExamContent, {
        ariaLabelledBy: "modal-basic-title",
        centered: true,
        size: "md", backdrop: false
      })
      .result.then(
        (result) => {
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
            physicianCommentsOrRecomdations: [""],
          });
        },
        (reason) => {
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
            physicianCommentsOrRecomdations: [""],
          });
        }
      );
  }

  openDeletePhyExamModal(viewDeletePhyExamContent) {
    this.modalService
      .open(viewDeletePhyExamContent, {
        ariaLabelledBy: "modal-basic-title",
        centered: true,
        size: "md", backdrop: false
      })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }

  openAddImmunizationsMethod(addImmunizationsModel) {
    this.modalService
      .open(addImmunizationsModel, {
        ariaLabelledBy: "modal-basic-title",
        centered: true,
        size: "md", backdrop: false
      })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
          this.patientProfileForm.reset();
          this.addPatImmunizationForm.reset();
          this.editPatImmunizationForm.reset();
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
          this.patientProfileForm.reset();
          this.addPatImmunizationForm.reset();
          this.editPatImmunizationForm.reset();
        }
      );
  }

  openViewImmunizationModal(viewImmunizationModel, selectedInvoicesData) {
    this.modalService
      .open(viewImmunizationModel, {
        ariaLabelledBy: "modal-basic-title",
        centered: true,
        size: "md", backdrop: false
      })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }
  openEditImmunizationsMethod(editImmunizationsModel, selectedInvoicesData) {
    let date = new Date(selectedInvoicesData.immunizationDate)
      .toLocaleDateString()
      .split("/", 3);

    let unixDates = selectedInvoicesData.immunizationDate;
    var date1 = new Date(unixDates * 1000);
    this.dateToShow =
      date1.getFullYear() +
      "-" +
      ("0" + (date1.getMonth() + 1)).slice(-2) +
      "-" +
      ("0" + date1.getDate()).slice(-2);

    console.log("unix to date format : ", this.dateToShow);

    this.editPatImmunizationForm.get("immunizationDate").setValue({
      year: parseInt(date[2]),
      month: parseInt(date[1]),
      day: parseInt(date[0]),
    });
    this.editPatImmunizationForm.patchValue({
      immunizationName: selectedInvoicesData.immunizationName,
      immunizationName1: selectedInvoicesData.immunizationName,
      immunizationDate: selectedInvoicesData.immunizationDate,
      notes: selectedInvoicesData.notes,
      doctorName: selectedInvoicesData.doctorName,
    });
    this.modalService
      .open(editImmunizationsModel, {
        ariaLabelledBy: "modal-basic-title",
        centered: true,
        size: "md", backdrop: false
      })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
          this.patientProfileForm.reset();
          this.addPatImmunizationForm.reset();
          this.editPatImmunizationForm.reset();
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
          this.patientProfileForm.reset();
          this.addPatImmunizationForm.reset();
          this.editPatImmunizationForm.reset();
        }
      );
  }

  openDeleteImmunizationMethod(viewDeleteImmunizationModel) {
    this.modalService
      .open(viewDeleteImmunizationModel, {
        ariaLabelledBy: "modal-basic-title",
        centered: true,
        size: "md", backdrop: false
      })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }

  openAddMedicalHistoryMethod(addMedicalHistoryModel) {
    this.openPatientIllness();
    //this.viewPatientIllness = false;
    this.viewManualInput();
    this.modalService
      .open(addMedicalHistoryModel, {
        ariaLabelledBy: "modal-basic-title",
        centered: true,
        size: "md", backdrop: false
      })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }

  openViewMedicalHistoryMethod(
    viewMedicalHistoryModel,
    selectedMedicalHistory
  ) {
    this.isLoading = false;
    this.loading = false;
    this.fetchPatIllMedicationDataObj = {
      hospital_reg_num: selectedMedicalHistory.hospital_reg_num,
      byWhom: "admin",
      byWhomID: this.signObj.hospitalAdmin.userID,
      patientID: selectedMedicalHistory.patientID,
      medical_record_id: selectedMedicalHistory.medical_record_id,
      illnessID: selectedMedicalHistory.illnessID,
    };
    this.loginService
      .fetchPatientMedicationData(
        this.fetchPatIllMedicationDataObj,
        this.signObj.access_token
      )
      .subscribe(
        (res) => {
          if (res.response === 3) {
            this.illnessMedications = res.illnessMedicationRecords;
            this.fetchedmedicinesData = this.illnessMedications[0].mannualPrescriptions.medicines;

            let unixDates =
              this.illnessMedications[0].mannualPrescriptions.updateDate / 1000;
            var date1 = new Date(unixDates * 1000);
            let dateToShow44 =
              date1.getFullYear() +
              "-" +
              ("0" + (date1.getMonth() + 1)).slice(-2) +
              "-" +
              ("0" + date1.getDate()).slice(-2);
            this.viewPatMedicationForm.patchValue({
              medicationDate: dateToShow44,
              instructions: "------------",
            });
            //this.illnessMedicationRecordsData.push(res.illnessMedicationRecords);
            this.isLoading = false;
            this.loading = false;
            this.openSnackBar(res.message, "");
            console.log(
              "res from fetchPatientMedicationData Success : ",
              res.message
            );
            console.log(
              "res from fetchPatientMedicationData Success total data : ",
              res
            );
            console.log(
              "the fetched Ill Medication Records Data is : ",
              this.illnessMedications
            );
            console.log(
              "medication date : ",
              this.illnessMedications[0].mannualPrescriptions.updateDate
                .addedDate
            );
          } else if (res.response === 0) {
            this.isLoading = false;
            this.openSnackBar(res.message, "");
            console.log("failure case", res.message);
          }
        },
        (err: HttpErrorResponse) => {
          if (err.error instanceof Error) {
            this.isLoading = false;
            console.log("Client Side Error");
          } else {
            this.isLoading = false;
            console.log(err);
          }
        }
      );

    this.loginService
      .fetchPatientSurgicalData(
        this.fetchPatIllMedicationDataObj,
        this.signObj.access_token
      )
      .subscribe(
        (res) => {
          if (res.response === 3) {
            this.illnessSurgicalProcedures = res.illnessSurgicalRecords;
            let unixDates = this.illnessSurgicalProcedures[0].surgeryDate;
            var date1 = new Date(unixDates * 1000);
            this.dateToShow =
              date1.getFullYear() +
              "-" +
              ("0" + (date1.getMonth() + 1)).slice(-2) +
              "-" +
              ("0" + date1.getDate()).slice(-2);
            let timeToShow =
              date1.getHours() +
              ":" +
              date1.getMinutes() +
              ":" +
              date1.getSeconds();
            this.viewPatSurgicalForm.patchValue({
              lastUpdateDate: this.dateToShow,
              time: timeToShow,
              doctorName: this.illnessSurgicalProcedures[0].doctorName,
              surgeryProcedure: this.illnessSurgicalProcedures[0]
                .surgeryProcedure,
              moreInfo: "----------",
            });
            this.isLoading = false;
            this.loading = false;
            this.openSnackBar(res.message, "");
            console.log(
              "res from illnessSurgicalRecordsData Success : ",
              res.message
            );
            console.log(
              "the fetched illnessSurgicalRecordsData is : ",
              this.illnessSurgicalProcedures
            );
          } else if (res.response === 0) {
            this.isLoading = false;
            this.openSnackBar(res.message, "");
            console.log("failure case", res.message);
          }
        },
        (err: HttpErrorResponse) => {
          if (err.error instanceof Error) {
            this.isLoading = false;
            console.log("Client Side Error");
          } else {
            this.isLoading = false;
            console.log(err);
          }
        }
      );

    this.loginService
      .fetchPatientDiagnosisData(
        this.fetchPatIllMedicationDataObj,
        this.signObj.access_token
      )
      .subscribe(
        (res) => {
          if (res.response === 3) {
            this.illnessDiagnosticNotes = res.illnessDiagnosisRecords;

            let unixDates = this.illnessDiagnosticNotes[0].diagnosisDate;
            var date11 = new Date(unixDates * 1000);
            var dateToShow11 =
              date11.getFullYear() +
              "-" +
              ("0" + (date11.getMonth() + 1)).slice(-2) +
              "-" +
              ("0" + date11.getDate()).slice(-2);

            this.viewPatDiagnosticForm.patchValue({
              diagnosisDate: dateToShow11,
              doctorName: this.illnessDiagnosticNotes[0].doctorName,
              diagnosis: this.illnessDiagnosticNotes[0].diagnosis,
              prescription: this.illnessDiagnosticNotes[0].prescription,
              remark: this.illnessDiagnosticNotes[0].remark,
            });
            this.isLoading = false;
            this.loading = false;
            this.openSnackBar(res.message, "");
            console.log(
              "res from illnessDiagnosisRecordsData Success : ",
              res.message
            );
            console.log(
              "the fetched illnessDiagnosisRecordsData is : ",
              this.illnessDiagnosticNotes
            );
          } else if (res.response === 0) {
            this.isLoading = false;
            this.openSnackBar(res.message, "");
            console.log("failure case", res.message);
          }
        },
        (err: HttpErrorResponse) => {
          if (err.error instanceof Error) {
            this.isLoading = false;
            console.log("Client Side Error");
          } else {
            this.isLoading = false;
            console.log(err);
          }
        }
      );

    this.modalService
      .open(viewMedicalHistoryModel, {
        ariaLabelledBy: "modal-basic-title",
        centered: true,
        size: "md", backdrop: false
      })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
          this.medicinesData = [];
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
          this.medicinesData = [];
        }
      );
  }

  //get medications
  get addmedicationsObj() {
    return <FormArray>(
      this.addPatIllMedicationManuallyForm.get("addMedicationArray")
    );
  }
  get editmedicationsObj() {
    return <FormArray>(
      this.editPatIllMedicationManuallyForm.get("editMedicationArray")
    );
  }

  //Add medication to list
  addMedicationToList() {
    this.addmedicationsObj.push(
      this.fb.group({
        name: [""],
        dosage: [""],
        freq: [""],
      })
    );
  }
  editMedicationToList() {
    this.editmedicationsObj.push(
      this.fb.group({
        name: [""],
        dosage: [""],
        freq: [""],
      })
    );
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
    this.addmedicationsObj.removeAt(index);
  }
  removeEditMedication(index) {
    this.editmedicationsObj.removeAt(index);
  }
  removeEditMedicationDirect(index) {
    this.editmedicationsObjDirect.removeAt(index)
  }
  removeEditMedicationAttachment(i) {
    console.log("index value : ", i);
    this.medicationAttachmentData.splice(i, 1);
  }
  removeEditMedicationAttachmentDirect(i) {
    console.log("index value : ", i);
    this.medicationAttachmentDataDirect.splice(i, 1);
  }

  removeEditillnessSurgicalAttachments(i) {
    console.log("index value of delete surgical attachement : ", i);
    this.illnessSurgicalAttachments.splice(i, 1);
  }

  //Add Pat Medical Diagnosis Notes
  editPatIllSurgicalFormSubmit() {
    //editPatIllnessSurgicalForm
    this.isLoading = true;
    let ngbDate = this.editPatIllnessSurgicalForm.controls["lastUpdateDate"]
      .value;
    let myDate = new Date(ngbDate.year, ngbDate.month - 1, ngbDate.day);
    var dateAr = myDate.toLocaleDateString().split("/");
    var newDate = dateAr[2] + "/" + dateAr[0] + "/" + dateAr[1];
    var unixTimeData = new Date(newDate).getTime() / 1000;
    console.log(
      "add ill editPatIllnessSurgicalForm date mydate : ",
      unixTimeData
    );

    let payLoad = this.editPatIllnessSurgicalForm.value;
    let formData = new FormData();

    formData.append("patientID", this.illnessSurgicalProcedures[0].patientID);
    formData.append(
      "medical_record_id",
      this.illnessSurgicalProcedures[0].medical_record_id
    );
    formData.append(
      "hospital_reg_num",
      this.illnessSurgicalProcedures[0].hospital_reg_num
    );
    formData.append("illnessID", this.illnessSurgicalProcedures[0].illnessID);
    formData.append("byWhom", "admin");
    formData.append("byWhomID", this.signObj.hospitalAdmin.userID);
    formData.append(
      "surgicalRecord",
      this.editPatIllnessSurgicalForm.get("profilePic").value
    );
    formData.append(
      "moreDetails",
      this.editPatIllnessSurgicalForm.value.surgeryInformation
    );
    formData.append(
      "illnessSurgicalID",
      this.illnessSurgicalProcedures[0].illnessSurgicalID
    );
    formData.append(
      "doctorMedicalPersonnelID",
      this.editPatIllnessSurgicalForm.value.doctorMedicalPersonnelID
    );
    formData.append(
      "doctorName",
      this.editPatIllnessSurgicalForm.value.doctorName
    );
    formData.append(
      "surgeryProcedure",
      this.editPatIllnessSurgicalForm.value.surgeryProcedure
    );
    formData.append("surgeryDate", "" + unixTimeData);
    //formData.append("surgeryInformtion", this.editPatIllnessSurgicalForm.value.surgeryInformation);

    console.log(
      "the sended obj data for pat ill surgical record data update : ",
      formData
    );
    this.loginService
      .addPatIllSurgicalFormData(formData, this.signObj.access_token)
      .subscribe(
        (res) => {
          if (res.response === 3) {
            this.isLoading = false;
            this.removeUploadedFile3();
            //this.openPatientMedications();
            //this.loading = false;
            //alert(res.message);
            this.openSnackBar(res.message, "");
            this.modalService.dismissAll();
            console.log(
              "res from update patient ill surgical data from component Success : ",
              res.message
            );
          } else if (res.response === 0) {
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
            console.log("Client Side Error");
          } else {
            this.isLoading = false;
            //this.loading = false;
            console.log(err);
          }
        }
      );
  }

  //Call Delete Pat MedicalRecords MedicalHistory Data
  deletePatientIllnessData(selectedMedicalHistory) {
    this.isLoading = true;
    this.deletePatientIllnessObj = {
      hospital_reg_num: selectedMedicalHistory.hospital_reg_num,
      medical_record_id: selectedMedicalHistory.medical_record_id,
      patientID: selectedMedicalHistory.patientID,
      illnessID: selectedMedicalHistory.illnessID,
      byWhom: "admin",
      byWhomID: this.signObj.hospitalAdmin.userID,
    };
    //Call Delete Illness Info
    this.loginService
      .deletePatientIllnessRecordData(
        this.deletePatientIllnessObj,
        this.signObj.access_token
      )
      .subscribe(
        (res) => {
          if (res.response === 3) {
            this.fetchPatientMedicalRecordIllness();
            this.isLoading = false;
            //this.loading = false;
            this.openSnackBar(res.message, "");
            this.modalService.dismissAll();
            //this.ngOnInit()
            console.log("Res from Patient Illness Data Delete : ", res.message);
          } else if (res.response === 0) {
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
            console.log("Client Side Error");
          } else {
            this.isLoading = false;
            //this.loading = false;
            console.log(err);
          }
        }
      );
    //Call Delete Diagnostic Notes
    this.loginService
      .deletePatientIllnessDiagnosticData(
        this.deletePatientIllnessObj,
        this.signObj.access_token
      )
      .subscribe(
        (res) => {
          if (res.response === 3) {
            this.isLoading = false;
            //this.loading = false;
            //this.openSnackBar(res.message, "");
            //this.modalService.dismissAll();
            //this.fetchPatientMedicalRecordIllness();
            // this.ngOnInit()
            console.log(
              "Res from Patient DiagnosticNotes Data Delete : ",
              res.message
            );
          } else if (res.response === 0) {
            this.isLoading = false;
            //this.loading = false;
            //this.openSnackBar(res.message, "");
            console.log(
              "Res from Patient DiagnosticNotes Data Delete : ",
              res.message
            );
            //this.modalService.dismissAll();
          }
        },
        (err: HttpErrorResponse) => {
          if (err.error instanceof Error) {
            this.isLoading = false;
            //this.loading = false;
            console.log("Client Side Error");
          } else {
            this.isLoading = false;
            //this.loading = false;
            console.log(err);
          }
        }
      );
    //Call Delete Medications
    this.loginService
      .deletePatientIllnessMedicationData(
        this.deletePatientIllnessObj,
        this.signObj.access_token
      )
      .subscribe(
        (res) => {
          if (res.response === 3) {
            this.isLoading = false;
            //this.loading = false;
            //this.openSnackBar(res.message, "");
            //this.modalService.dismissAll();
            //this.fetchPatientMedicalRecordIllness();
            // this.ngOnInit()
            console.log(
              "Res from Patient Medications Data Delete : ",
              res.message
            );
          } else if (res.response === 0) {
            this.isLoading = false;
            //this.loading = false;
            //this.openSnackBar(res.message, "");
            console.log(
              "Res from Patient Medications Data Delete : ",
              res.message
            );
            //this.modalService.dismissAll();
          }
        },
        (err: HttpErrorResponse) => {
          if (err.error instanceof Error) {
            this.isLoading = false;
            //this.loading = false;
            console.log("Client Side Error");
          } else {
            this.isLoading = false;
            //this.loading = false;
            console.log(err);
          }
        }
      );
    //Call Delete Surgical Records
    this.loginService
      .deletePatientIllnessSurgicalProcedureData(
        this.deletePatientIllnessObj,
        this.signObj.access_token
      )
      .subscribe(
        (res) => {
          if (res.response === 3) {
            this.isLoading = false;
            //this.loading = false;
            //this.openSnackBar(res.message, "");
            //this.modalService.dismissAll();
            //this.fetchPatientMedicalRecordIllness();
            //this.ngOnInit()
            console.log(
              "Res from Patient SurgicalProcedure Data Delete : ",
              res.message
            );
          } else if (res.response === 0) {
            this.isLoading = false;
            //this.loading = false;
            //this.openSnackBar(res.message, "");
            console.log(
              "Res from Patient SurgicalProcedure Data Delete : ",
              res.message
            );
            //this.modalService.dismissAll();
          }
        },
        (err: HttpErrorResponse) => {
          if (err.error instanceof Error) {
            this.isLoading = false;
            //this.loading = false;
            console.log("Client Side Error");
          } else {
            this.isLoading = false;
            //this.loading = false;
            console.log(err);
          }
        }
      );
  }

  //Patch Medication
  patchPatientEditMedication(editmedicationData) {
    for (let i: number = 0; i <= editmedicationData.length - 1; i++) {
      this.addmedicationsObj.push(
        this.fb.group({
          name: editmedicationData[i].name,
          dosage: editmedicationData[i].dosage,
          freq: editmedicationData[i].freq,
        })
      );
    }
  }
  patchPatientUpdateEditMedication(editupdatemedicationData) {
    for (let i: number = 0; i <= editupdatemedicationData.length - 1; i++) {
      this.editmedicationsObj.push(
        this.fb.group({
          name: editupdatemedicationData[i].name,
          dosage: editupdatemedicationData[i].dosage,
          freq: editupdatemedicationData[i].freq,
        })
      );
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

  openEditMedicalHistoryMethod(
    editMedicalHistoryModel,
    selectedMedicalHistory
  ) {
    var timestamp = selectedMedicalHistory.startDate; // replace your timestamp
    var date1 = new Date(timestamp * 1000);
    this.dateToShow =
      ("0" + date1.getFullYear()).slice(-2) +
      "-" +
      ("0" + (date1.getMonth() + 1)).slice(-2) +
      "-" +
      date1.getDate();

    var timestamp2 = selectedMedicalHistory.endDate; // replace your timestamp
    var date2 = new Date(timestamp2 * 1000);
    this.dateToShow2 =
      ("0" + date2.getFullYear()).slice(-2) +
      "-" +
      ("0" + (date2.getMonth() + 1)).slice(-2) +
      "-" +
      date2.getDate();

    this.medicinesData.length = 0;
    this.editPatIllMedicationManuallyForm.value.editMedicationArray.length = 0;

    this.openPatientIllness2();
    //this.viewPatientIllness2 = false;
    this.viewManualInput2();
    this.editPatIllnessForm.patchValue({
      illnessCondition: selectedMedicalHistory.illnessCondition,
      symptoms: selectedMedicalHistory.symptoms,
      currentStatus: selectedMedicalHistory.currentStatus,
      description: selectedMedicalHistory.description,
      isCurrentIllness: "" + selectedMedicalHistory.isCurrentIllness,
      startDate: selectedMedicalHistory.startDate,
      endDate: selectedMedicalHistory.endDate,
    });

    this.fetchPatIllMedicationDataObj = {
      hospital_reg_num: selectedMedicalHistory.hospital_reg_num,
      byWhom: "admin",
      byWhomID: this.signObj.hospitalAdmin.userID,
      patientID: selectedMedicalHistory.patientID,
      medical_record_id: selectedMedicalHistory.medical_record_id,
      illnessID: selectedMedicalHistory.illnessID,
    };
    this.loginService
      .fetchPatientMedicationData(
        this.fetchPatIllMedicationDataObj,
        this.signObj.access_token
      )
      .subscribe(
        (res) => {
          this.medicinesData.length = 0;
          this.editPatIllMedicationManuallyForm.value.editMedicationArray.length = 0;
          if (res.response === 3) {
            this.illnessMedications = res.illnessMedicationRecords;
            console.log(
              "Fetched ill medications data : ",
              this.illnessMedications
            );
            this.medicinesData.length = 0;
            this.editPatIllMedicationManuallyForm.value.editMedicationArray.length = 0;
            this.medicinesData = this.illnessMedications[0].mannualPrescriptions.medicines;
            this.medicationAttachmentData = this.illnessMedications[0].attachedPrescriptions.attachments;
            let unixDates =
              this.illnessMedications[0].mannualPrescriptions.updateDate
                .addedDate / 1000;
            var date1 = new Date(unixDates * 1000);
            let dateToShow44 =
              date1.getFullYear() +
              "-" +
              ("0" + (date1.getMonth() + 1)).slice(-2) +
              "-" +
              ("0" + date1.getDate()).slice(-2);
            this.editPatientMedHistoryFileForm.patchValue({
              medicationDate: dateToShow44,
              prescription1MoreDetails: this.medicationAttachmentData[0]
                .moreDetails,
            });

            // this.patchPatientUpdateEditMedicationAttachment(this.medicationAttachmentData);
            this.patchPatientUpdateEditMedication(this.medicinesData);
            this.editPatIllMedicationManuallyForm.patchValue({
              instructions: "----------",
            });
            this.isLoading = false;
            this.loading = false;
            this.openSnackBar(res.message, "");
          } else if (res.response === 0) {
            this.isLoading = false;
            this.openSnackBar(res.message, "");
            console.log("failure case", res.message);
          }
        },
        (err: HttpErrorResponse) => {
          if (err.error instanceof Error) {
            this.isLoading = false;
            console.log("Client Side Error");
          } else {
            this.isLoading = false;
            console.log(err);
          }
        }
      );

    this.loginService
      .fetchPatientSurgicalData(
        this.fetchPatIllMedicationDataObj,
        this.signObj.access_token
      )
      .subscribe(
        (res) => {
          if (res.response === 3) {
            this.illnessSurgicalProcedures = res.illnessSurgicalRecords;
            this.illnessSurgicalAttachments =
              res.illnessSurgicalRecords[0].attachments;
            let unixDates = this.illnessSurgicalProcedures[0].surgeryDate;
            var date1 = new Date(unixDates * 1000);
            let dateToShow =
              date1.getFullYear() +
              "-" +
              ("0" + (date1.getMonth() + 1)).slice(-2) +
              "-" +
              ("0" + date1.getDate()).slice(-2);
            let timeToShow =
              date1.getHours() +
              ":" +
              date1.getMinutes() +
              ":" +
              date1.getSeconds();
            this.editPatIllnessSurgicalForm.patchValue({
              lastUpdateDate: dateToShow,
              time: timeToShow,
              doctorName: this.illnessSurgicalProcedures[0].doctorName,
              surgeryProcedure: this.illnessSurgicalProcedures[0]
                .surgeryProcedure,
              surgeryInformation: this.illnessSurgicalProcedures[0]
                .surgeryInformation,
            });
            this.isLoading = false;
            this.loading = false;
            this.openSnackBar(res.message, "");
            console.log(
              "res from illnessSurgicalRecordsData Success : ",
              res.message
            );
            console.log(
              "the fetched illnessSurgicalRecordsData is : ",
              this.illnessSurgicalProcedures
            );
          } else if (res.response === 0) {
            this.isLoading = false;
            this.openSnackBar(res.message, "");
            console.log("failure case", res.message);
          }
        },
        (err: HttpErrorResponse) => {
          if (err.error instanceof Error) {
            this.isLoading = false;
            console.log("Client Side Error");
          } else {
            this.isLoading = false;
            console.log(err);
          }
        }
      );

    this.loginService
      .fetchPatientDiagnosisData(
        this.fetchPatIllMedicationDataObj,
        this.signObj.access_token
      )
      .subscribe(
        (res) => {
          if (res.response === 3) {
            this.illnessDiagnosticNotes = res.illnessDiagnosisRecords;

            let unixDates = this.illnessDiagnosticNotes[0].diagnosisDate;
            var date11 = new Date(unixDates * 1000);
            var dateToShow12 =
              date11.getFullYear() +
              "-" +
              ("0" + (date11.getMonth() + 1)).slice(-2) +
              "-" +
              ("0" + date11.getDate()).slice(-2);

            this.editPatIllnessDiagnosisForm.patchValue({
              diagnosisDate: dateToShow12,
              doctorName: this.illnessDiagnosticNotes[0].doctorName,
              diagnosis: this.illnessDiagnosticNotes[0].diagnosis,
              prescription: this.illnessDiagnosticNotes[0].prescription,
              remark: this.illnessDiagnosticNotes[0].remark,
            });
            this.isLoading = false;
            this.loading = false;
            this.openSnackBar(res.message, "");
            console.log(
              "res from illnessDiagnosisRecordsData Success : ",
              res.message
            );
            console.log(
              "the fetched illnessDiagnosisRecordsData is : ",
              this.illnessDiagnosticNotes
            );
          } else if (res.response === 0) {
            this.isLoading = false;
            this.openSnackBar(res.message, "");
            console.log("failure case", res.message);
          }
        },
        (err: HttpErrorResponse) => {
          if (err.error instanceof Error) {
            this.isLoading = false;
            console.log("Client Side Error");
          } else {
            this.isLoading = false;
            console.log(err);
          }
        }
      );

    this.modalService
      .open(editMedicalHistoryModel, {
        ariaLabelledBy: "modal-basic-title",
        centered: true,
        size: "md", backdrop: false
      })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
          //let emptyMedicinesData =  this.medicinesData.length = [];
          //this.patchPatientUpdateEditMedication(emptyMedicinesData);
          //this.editPatIllMedicationManuallyForm.value.editMedicationArray.length = 0;
          let emptyMedicinesData = this.medicinesData.length;
          for (let i = -1; i <= emptyMedicinesData + 1; i++) {
            this.removeEditMedication(i);
            console.log("removed medication num : ", i);
          }

          //editMedicationArray: any[] = [];
          console.log(
            "the medicanes data after close edit medical history model : ",
            emptyMedicinesData
          );
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
          //let emptyMedicinesData =  this.medicinesData.length = [];
          //this.patchPatientUpdateEditMedication(emptyMedicinesData);
          //this.editPatIllMedicationManuallyForm.value.editMedicationArray.length = 0;
          let emptyMedicinesData = this.medicinesData.length;

          for (let i = -1; i <= emptyMedicinesData + 1; i++) {
            this.removeEditMedication(i);
            console.log("removed medication num : ", i);
          }
          console.log(
            "the medicanes data after close edit medical history model : ",
            emptyMedicinesData
          );
        }
      );
  }

  openDeleteMedicalHistoryMethod(
    viewDeleteMedicalHistoryModel,
    selectedMedicalHistory
  ) {
    this.modalService
      .open(viewDeleteMedicalHistoryModel, {
        ariaLabelledBy: "modal-basic-title",
        centered: true,
        size: "md", backdrop: false
      })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
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

  viewManualInput() {
    this.textColor = "white";
    this.textColor1 = "black";
    this.color = "#53B9C6";
    this.color1 = "white";
    this.viewManualInputView = true;
    this.viewAttachmentView = false;
  }
  viewBasicExam() {
    this.textColor2 = "white";
    this.textColor3 = "black";
    this.color2 = "#3e4542";
    this.color3 = "white";
    this.viewSystemEx = false;
    this.viewBasicEx = true;
  }
  viewSystemExam() {
    this.textColor2 = "black";
    this.textColor3 = "white";
    this.color2 = "white";
    this.color3 = "#3e4542";
    this.viewBasicEx = false;
    this.viewSystemEx = true;
  }
  viewAttachment() {
    this.textColor = "black";
    this.textColor1 = "white";
    this.color = "white";
    this.color1 = "#53B9C6";
    this.viewAttachmentView = true;
    this.viewManualInputView = false;
  }

  viewManualInput2() {
    this.textColor = "white";
    this.textColor1 = "black";
    this.color = "#53B9C6";
    this.color1 = "white";
    this.viewManualInputView2 = true;
    this.viewAttachmentView2 = false;
  }
  viewAttachment2() {
    this.textColor = "black";
    this.textColor1 = "white";
    this.color = "white";
    this.color1 = "#53B9C6";
    this.viewAttachmentView2 = true;
    this.viewManualInputView2 = false;
  }
  viewAttachment3() {
    this.textColor = 'black';
    this.textColor1 = 'white';
    this.color = 'white'
    this.color1 = '#53B9C6';
    this.viewAttachmentView3 = true;
    this.viewManualInputView3 = false;
  }
  viewManualInput3() {
    this.textColor = 'white';
    this.textColor1 = 'black';
    this.color = '#53B9C6';
    this.color1 = 'white'
    this.viewManualInputView3 = true;
    this.viewAttachmentView3 = false;
  }

  //Medical-History Add Button actions
  openPatientIllness() {
    this.isValue = 3;
    this.viewPatientIllness = false;
    this.viewPatientDiagnostic = true;
    this.viewPatientMedications = true;
    this.viewPatientSurgical = true;
  }
  openPatientDiagnostic() {
    this.isValue = 4;
    this.viewPatientIllness = true;
    this.viewPatientDiagnostic = false;
    this.viewPatientMedications = true;
    this.viewPatientSurgical = true;
  }
  openPatientMedications() {
    this.isValue = 5;
    this.viewPatientIllness = true;
    this.viewPatientDiagnostic = true;
    this.viewPatientMedications = false;
    this.viewPatientSurgical = true;
  }
  openPatientSurgical() {
    this.isValue = 6;
    this.viewPatientIllness = true;
    this.viewPatientDiagnostic = true;
    this.viewPatientMedications = true;
    this.viewPatientSurgical = false;
  }

  //Medical-History Edit Button actions
  openPatientIllness2() {
    this.viewPatientIllness2 = false;
    this.viewPatientDiagnostic2 = true;
    this.viewPatientMedications2 = true;
    this.viewPatientSurgical2 = true;
  }
  openPatientDiagnostic2() {
    this.viewPatientIllness2 = true;
    this.viewPatientDiagnostic2 = false;
    this.viewPatientMedications2 = true;
    this.viewPatientSurgical2 = true;
  }
  openPatientMedications2() {
    this.viewPatientIllness2 = true;
    this.viewPatientDiagnostic2 = true;
    this.viewPatientMedications2 = false;
    this.viewPatientSurgical2 = true;
  }
  openPatientSurgical2() {
    this.viewPatientIllness2 = true;
    this.viewPatientDiagnostic2 = true;
    this.viewPatientMedications2 = true;
    this.viewPatientSurgical2 = false;
  }

  viewAddPhysicalExamContent(addPhysicalExamContent) {
    this.viewManualInput();
    this.viewBasicExam();
    this.modalService
      .open(addPhysicalExamContent, {
        ariaLabelledBy: "modal-basic-title",
        centered: true,
        size: "md", backdrop: false
      })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return "by pressing ESC";
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return "by clicking on a backdrop";
    } else {
      return `with: ${reason}`;
    }
  }
  // payLoad = this.editFamilyHistoryForm.value.familyHistory;

  openAddMedicationsMethod(addMedicationsModel) {
    this.viewManualInput();
    this.modalService.open(addMedicationsModel, { ariaLabelledBy: 'modal-basic-title', centered: true, size: "md", backdrop: false }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  openAddSurgicalProceduresMethod(addSurgicalProceduresModel) {
    this.modalService.open(addSurgicalProceduresModel, { ariaLabelledBy: 'modal-basic-title', centered: true, size: "md", backdrop: false }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
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
      "patientID": this.patGenInfoSuccessData.patientId,
      "medical_record_id": this.patGenInfoSuccessData.medical_record_id,
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
            this.fetchPatientMedicationRecords();
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
          this.removeUploadedFile2DirectFile();
          this.openSnackBar(updateAdminGenUserData.message, "");
          this.modalService.dismissAll();
          this.fetchPatientMedicationRecords();
        }
        else {
          this.isLoading = false;
          this.openSnackBar(updateAdminGenUserData.message, "");//this.modalService.dismissAll();
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

  //Fetch Patient Medications Data
  fetchPatientMedicationRecords() {
    //getPatientMedicationsData
    this.fetchPatientMedicationsObj = {
      "hospital_reg_num": this.signObj.hospitalAdmin.hospital_reg_num,
      "patientID": this.patGenInfoSuccessData.patientId,
      "medical_record_id": this.patGenInfoSuccessData.medical_record_id,
      "byWhomID": this.signObj.hospitalAdmin.userID,
      "byWhom": "admin"
    }
    this.loginService.getPatientMedicationsData(this.fetchPatientMedicationsObj, this.signObj.access_token).
      subscribe(
        (res) => {
          if (res.response === 3) {
            this.loading = false;
            this.fetchedMedications = res.records;
            console.log("Res from Patient Medication Records Data Direct : ", this.fetchedMedications);
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
            this.fetchPatientMedicationRecords();
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
          //this.ngOnInit();
          this.modalService.dismissAll();
          this.fetchPatientMedicationRecords();
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
            this.fetchPatientMedicationRecords();
            //this.ngOnInit()
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
            this.fetchPatientSurgicalRecords();
            //this.fetchPatientMedicalRecordIllness();
            //this.ngOnInit()
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
  //Fetch Patient Medications Data
  fetchPatientSurgicalRecords() {
    //getPatientMedicationsData
    this.fetchPatientSurgicalRecordsObj = {
      "hospital_reg_num": this.signObj.hospitalAdmin.hospital_reg_num,
      "patientID": this.patGenInfoSuccessData.patientId,
      "medical_record_id": this.patGenInfoSuccessData.medical_record_id,
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

}
