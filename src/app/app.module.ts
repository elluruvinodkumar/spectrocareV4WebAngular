import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxLoadingModule, ngxLoadingAnimationTypes } from 'ngx-loading';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { ChartsModule } from 'ng2-charts';
import { NgxIntlTelInputModule } from 'projects/ngx-intl-tel-input/src/lib/ngx-intl-tel-input.module';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AdminsigninComponent } from './components/adminsignin/adminsignin.component';
import { AdminsignupComponent } from './components/adminsignup/adminsignup.component';
import { MedicalpersonnelsignupComponent } from './components/medicalpersonnelsignup/medicalpersonnelsignup.component';
import { HeaderComponent } from './components/header/header.component';
import { HomeComponent } from './components/home/home.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ManageuserComponent } from './components/manageuser/manageuser.component';
import { ForgotpasswordComponent } from './components/forgotpassword/forgotpassword.component';
import { ReportComponent } from './components/report/report.component';
import { BillandpaymentComponent } from './components/billandpayment/billandpayment.component';
import { ChangepasswordComponent } from './components/changepassword/changepassword.component';
import { AdmincenterComponent } from './components/admincenter/admincenter.component';
import { PatientComponent } from './components/patient/patient.component';
import { PatientAppointmentRecordComponent } from './components/patient-appointment-record/patient-appointment-record.component';
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
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSnackBarModule, MatCheckboxModule, MatSelectModule, MatSidenav, MatIconModule, MatMenuModule, MatButtonToggleModule, MatRadioModule, MatFormFieldModule, MatAutocompleteModule, MatDialogModule } from '@angular/material';
import { AmazingTimePickerModule } from 'amazing-time-picker';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { HeaderOneComponent } from './components/header-one/header-one.component';
import { AdministartorComponent } from './components/administartor/administartor.component';
import { MedicalPersonnelComponent } from './components/medical-personnel/medical-personnel.component';
import { PatientModuleComponent } from './components/patient-module/patient-module.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AllMedicalRecordComponent } from './components/all-medical-record/all-medical-record.component';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { InvoicesComponent } from './components/invoices/invoices.component';
import { PatientScreeningRecordComponent } from './components/patient-screening-record/patient-screening-record.component';
import { AppointmentListComponent } from './components/appointment-list/appointment-list.component';
import { PaymentTransactionsComponent } from './components/payment-transactions/payment-transactions.component';
import { SettingsComponent } from './components/settings/settings.component';
import { HospitalDepartmentsComponent } from './components/hospital-departments/hospital-departments.component';
import { HospitalRolesComponent } from './components/hospital-roles/hospital-roles.component';
import { HospitalFeesComponent } from './components/hospital-fees/hospital-fees.component';
import { PatientResetPasswordComponent } from './components/patient-reset-password/patient-reset-password.component';
import { MaterialDialogComponent } from './components/material-dialog/material-dialog.component';
import { TermsAndConditionsComponent } from './components/terms-and-conditions/terms-and-conditions.component';
import { PrivacyPolicyComponent } from './components/privacy-policy/privacy-policy.component';
import { AdminResetPasswordComponent } from './components/admin-reset-password/admin-reset-password.component';
import { MedicapersonnelResetPasswordComponent } from './components/medicapersonnel-reset-password/medicapersonnel-reset-password.component';
import { AdminVerifyAccountComponent } from './components/admin-verify-account/admin-verify-account.component';
import { MedicalpersonnelVerifyAccountComponent } from './components/medicalpersonnel-verify-account/medicalpersonnel-verify-account.component';
import { ViewAppointmentDetailsComponent } from './components/view-appointment-details/view-appointment-details.component';
import { MedicalPersonnelDashboardComponent } from './components/medicalPersonnelModule/medical-personnel-dashboard/medical-personnel-dashboard.component';
import { MedicalPersonnelCenterComponent } from './components/medicalPersonnelModule/medical-personnel-center/medical-personnel-center.component';
import { AccountCenterComponent } from './components/medicalPersonnelModule/account-center/account-center.component';
import { TestRecordsComponent } from './components/medicalPersonnelModule/test-records/test-records.component';
import { CreateNewTestComponent } from './components/medicalPersonnelModule/create-new-test/create-new-test.component';
import { ManageDeviceComponent } from './components/medicalPersonnelModule/manage-device/manage-device.component';
import { MedicalPersonnelAppointmentsComponent } from './components/medicalPersonnelModule/medical-personnel-appointments/medical-personnel-appointments.component';
import { ChatComponent } from './components/medicalPersonnelModule/chat/chat.component';
import { ChatService } from './services/chat.service';
import { LightboxModule } from 'ngx-lightbox';
import { NgxImageCompressService } from 'ngx-image-compress';
import { MatStepperModule } from '@angular/material/stepper';
import { OutSideClickDirective } from './directive/click-outside.directive';
//http://127.0.0.1:3000?userID=MPIDXCOO&userType=Doctor
//const config: SocketIoConfig = { url: 'http://34.231.177.197:3000?userID=MPIDnIJN&userType=Doctor', options: {} };
const config: SocketIoConfig = { url: 'http://34.231.177.197:3000', options: { autoConnect: false } };

@NgModule({
  declarations: [
    AppComponent,
    AdminsigninComponent,
    AdminsignupComponent,
    MedicalpersonnelsignupComponent,
    HeaderComponent,
    HomeComponent,
    ManageuserComponent,
    ForgotpasswordComponent,
    ReportComponent,
    BillandpaymentComponent,
    ChangepasswordComponent,
    AdmincenterComponent,
    PatientComponent,
    PatientAppointmentRecordComponent,
    PatientProfileComponent,
    PatientProfileeComponent,
    MedicalPersonnelProfileComponent,
    AdminProfileComponent,
    ManageMedicalPersonsComponent,
    AdminGeneralUserProfileComponent,
    PatientMedicalRecordsComponent,
    UpcomingAppointmentComponent,
    PastAppointmentComponent,
    BookAppointmentComponent,
    AppointmentCalendarComponent,
    HeaderOneComponent,
    AdministartorComponent,
    MedicalPersonnelComponent,
    PatientModuleComponent,
    DashboardComponent,
    AllMedicalRecordComponent,
    InvoicesComponent,
    PatientScreeningRecordComponent,
    AppointmentListComponent,
    PaymentTransactionsComponent,
    SettingsComponent,
    HospitalDepartmentsComponent,
    HospitalRolesComponent,
    HospitalFeesComponent,
    PatientResetPasswordComponent,
    MaterialDialogComponent,
    TermsAndConditionsComponent,
    PrivacyPolicyComponent,
    AdminResetPasswordComponent,
    MedicapersonnelResetPasswordComponent,
    AdminVerifyAccountComponent,
    MedicalpersonnelVerifyAccountComponent,
    ViewAppointmentDetailsComponent,
    MedicalPersonnelDashboardComponent,
    MedicalPersonnelCenterComponent,
    AccountCenterComponent,
    TestRecordsComponent,
    CreateNewTestComponent,
    ManageDeviceComponent,
    MedicalPersonnelAppointmentsComponent,
    ChatComponent,
    OutSideClickDirective
  ],
  entryComponents: [ChatComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    NgbModule,
    ReactiveFormsModule,
    FormsModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCheckboxModule,
    MatSidenavModule,
    MatTabsModule,
    MatIconModule,
    MatMenuModule,
    MatRadioModule,
    MatProgressSpinnerModule,
    MatButtonToggleModule,
    MatAutocompleteModule,
    MatDialogModule,
    NgxIntlTelInputModule,
    BrowserAnimationsModule,
    // SocketIoModule.forRoot(config),
    SocketIoModule.forRoot(config),
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    }),
    AmazingTimePickerModule,
    ChartsModule,
    Ng2SearchPipeModule,
    NgxLoadingModule.forRoot({
      animationType: ngxLoadingAnimationTypes.circleSwish,
      backdropBackgroundColour: 'rgba(0,0,0,0.5)',
      backdropBorderRadius: '4px',
      primaryColour: '#ffffff',
      secondaryColour: '#ffffff',
      tertiaryColour: '#ffffff',
      fullScreenBackdrop: true
    }),
    BrowserAnimationsModule,
    LightboxModule,
    MatStepperModule,


  ],
  providers: [ChatService, NgxImageCompressService],
  bootstrap: [AppComponent]
})

export class AppModule {
  userID: string;
  userType: string = 'Doctor';
}
