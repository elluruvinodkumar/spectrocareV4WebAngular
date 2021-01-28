import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminsigninComponent } from './components/adminsignin/adminsignin.component';
import { AdminsignupComponent } from './components/adminsignup/adminsignup.component';
import { MedicalpersonnelsignupComponent } from './components/medicalpersonnelsignup/medicalpersonnelsignup.component';
import { HomeComponent } from './components/home/home.component';
import { ManageuserComponent } from './components/manageuser/manageuser.component';
import { ForgotpasswordComponent } from './components/forgotpassword/forgotpassword.component';
import { ReportComponent } from './components/report/report.component';
import { BillandpaymentComponent } from './components/billandpayment/billandpayment.component';
import { ChangepasswordComponent } from './components/changepassword/changepassword.component';
import { AdmincenterComponent } from './components/admincenter/admincenter.component';
import { PatientComponent } from './components/patient/patient.component';
import { PatientAppointmentRecordComponent } from './components/patient-appointment-record/patient-appointment-record.component';
import { PatientScreeningRecordComponent } from './components/patient-screening-record/patient-screening-record.component';
import { PatientProfileComponent } from './components/patient-profile/patient-profile.component';
import { PatientProfileeComponent } from './components/patient-profilee/patient-profilee.component';
import { MedicalPersonnelProfileComponent } from './components/medical-personnel-profile/medical-personnel-profile.component';
import { AdminProfileComponent } from './components/admin-profile/admin-profile.component';
import { ManageMedicalPersonsComponent } from './components/manage-medical-persons/manage-medical-persons.component';
import { AdminGeneralUserProfileComponent } from './components/admin-general-user-profile/admin-general-user-profile.component';
import { PatientMedicalRecordsComponent } from './components/patient-medical-records/patient-medical-records.component';
import { UpcomingAppointmentComponent } from './components/upcoming-appointment/upcoming-appointment.component';
import { PastAppointmentComponent } from './components/past-appointment/past-appointment.component';
import { BookAppointmentComponent } from './components/book-appointment/book-appointment.component';
import { AppointmentCalendarComponent } from './components/appointment-calendar/appointment-calendar.component';
import { HeaderOneComponent } from './components/header-one/header-one.component';
import { AdministartorComponent } from './components/administartor/administartor.component';
import { MedicalPersonnelComponent } from './components/medical-personnel/medical-personnel.component';
import { PatientModuleComponent } from './components/patient-module/patient-module.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AllMedicalRecordComponent } from './components/all-medical-record/all-medical-record.component';
import { HeaderComponent } from './components/header/header.component';
import { InvoicesComponent } from './components/invoices/invoices.component';
import { AppointmentListComponent } from './components/appointment-list/appointment-list.component';
import { PaymentTransactionsComponent } from './components/payment-transactions/payment-transactions.component';
import { SettingsComponent } from './components/settings/settings.component';
import { HospitalDepartmentsComponent } from './components/hospital-departments/hospital-departments.component';
import { HospitalRolesComponent } from './components/hospital-roles/hospital-roles.component';
import { HospitalFeesComponent } from './components/hospital-fees/hospital-fees.component';
import { PatientResetPasswordComponent } from './components/patient-reset-password/patient-reset-password.component';
import { TermsAndConditionsComponent } from './components/terms-and-conditions/terms-and-conditions.component';
import { PrivacyPolicyComponent } from './components/privacy-policy/privacy-policy.component';
import { AdminResetPasswordComponent } from './components/admin-reset-password/admin-reset-password.component';
import { MedicapersonnelResetPasswordComponent } from './components/medicapersonnel-reset-password/medicapersonnel-reset-password.component';
import { AdminVerifyAccountComponent } from './components/admin-verify-account/admin-verify-account.component';
import { MedicalpersonnelVerifyAccountComponent } from './components/medicalpersonnel-verify-account/medicalpersonnel-verify-account.component';
import { ViewAppointmentDetailsComponent } from './components/view-appointment-details/view-appointment-details.component';
import { MedicalPersonnelCenterComponent } from './components/medicalPersonnelModule/medical-personnel-center/medical-personnel-center.component';
import { MedicalPersonnelDashboardComponent } from './components/medicalPersonnelModule/medical-personnel-dashboard/medical-personnel-dashboard.component';
import { AccountCenterComponent } from './components/medicalPersonnelModule/account-center/account-center.component';
import { TestRecordsComponent } from './components/medicalPersonnelModule/test-records/test-records.component';
import { CreateNewTestComponent } from './components/medicalPersonnelModule/create-new-test/create-new-test.component';
import { ManageDeviceComponent } from './components/medicalPersonnelModule/manage-device/manage-device.component';
import { MedicalPersonnelAppointmentsComponent } from './components/medicalPersonnelModule/medical-personnel-appointments/medical-personnel-appointments.component';

const routes: Routes = [
  { path: "adminsignin", component: AdminsigninComponent },
  { path: "adminsignup", component: AdminsignupComponent },
  { path: "administrator", component: AdministartorComponent },
  { path: "medicalpersonnel", component: MedicalPersonnelComponent },
  { path: "patientmodule", component: PatientModuleComponent },

  { path: "medicalpersonnelsignup", component: MedicalpersonnelsignupComponent },

  { path: "forgot", component: ForgotpasswordComponent },
  { path: "changepassword", component: ChangepasswordComponent },
  {
    path: "admincenter", component: AdmincenterComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'home', component: HomeComponent },
      { path: "adminprofile", component: AdminProfileComponent },
      { path: "manageuser", component: ManageuserComponent },
      { path: "admingeneraluserprofile/:id", component: AdminGeneralUserProfileComponent },
      { path: "medicalpersonnelprofile/:id", component: MedicalPersonnelProfileComponent },
      { path: "managemedicalpersons", component: ManageMedicalPersonsComponent },
      { path: "invoices", component: InvoicesComponent },
      { path: "settings", component: SettingsComponent },
      { path: "hospitaldepartments", component: HospitalDepartmentsComponent },
      { path: "hospitalroles", component: HospitalRolesComponent },
      { path: "hospitalfees", component: HospitalFeesComponent },
      { path: "paymentTransactions", component: PaymentTransactionsComponent },
      { path: "billandpayment", component: BillandpaymentComponent },
      { path: "report", component: ReportComponent },
      { path: "patient", component: PatientComponent },
      { path: "patientprofile/:id", component: PatientProfileComponent },
      { path: "patientgeneralinfo", component: PatientProfileeComponent },
      { path: "patientmedicalrecords", component: PatientMedicalRecordsComponent },
      { path: "patientappointmentrecords", component: PatientAppointmentRecordComponent },
      { path: "patientscreeningrecord", component: PatientScreeningRecordComponent },
      { path: "allmedicalrecord", component: AllMedicalRecordComponent },
      { path: "appointmentlist", component: AppointmentListComponent },
      { path: "upcomingappointment", component: UpcomingAppointmentComponent },
      { path: "pastappointment", component: PastAppointmentComponent },
      { path: "bookappointment", component: BookAppointmentComponent },
      { path: "appointmentcalendar", component: AppointmentCalendarComponent },
      { path: "", redirectTo: "home", pathMatch: "full" },
    ]
  },

  {
    path: "medicalpersonnelmodule", component: MedicalPersonnelCenterComponent,
    children: [
      { path: 'dashboard', component: MedicalPersonnelDashboardComponent },
      { path: 'accountcenter', component: AccountCenterComponent },
      { path: "patient", component: PatientComponent },
      { path: "allmedicalrecord", component: AllMedicalRecordComponent },
      { path: "bookappointment", component: BookAppointmentComponent },
      { path: "testrecords", component: TestRecordsComponent },
      { path: "createnewtest", component: CreateNewTestComponent },
      { path: "managedevice", component: ManageDeviceComponent },
      { path: "medicalpersonappointments", component: MedicalPersonnelAppointmentsComponent },
      { path: "", redirectTo: "dashboard", pathMatch: "full" },
    ]
  },

  //Patient Module 
  { path: "patientresetpassword/:id", component: PatientResetPasswordComponent },
  { path: "adminresetpassword", component: AdminResetPasswordComponent },
  { path: "medicalpersonnel/setpassword", component: MedicapersonnelResetPasswordComponent },
  { path: "admin/verifyaccount", component: AdminVerifyAccountComponent },
  { path: "medicalpersonnel/verify", component: MedicalpersonnelVerifyAccountComponent },
  { path: "viewappointmentdetails", component: ViewAppointmentDetailsComponent },
  { path: "termsandconditions", component: TermsAndConditionsComponent },
  { path: "privacypolicy", component: PrivacyPolicyComponent },
  { path: "", redirectTo: "administrator", pathMatch: "full" },

];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
