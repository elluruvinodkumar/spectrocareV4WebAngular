import { DOCUMENT } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { AfterContentInit, AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, ElementRef, Inject, OnInit, QueryList, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef, MatSnackBar, MAT_DIALOG_DATA } from '@angular/material';
import { ChatService } from 'src/app/services/chat.service';
import { LoginService } from 'src/app/services/login.service';
import { MedicalPersonnelAppointmentsComponent } from '../medical-personnel-appointments/medical-personnel-appointments.component';
import { Socket } from 'ngx-socket-io';
import { ConnectionService } from 'ng-connection-service';
import { FORMERR } from 'dns';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { AsapScheduler } from 'rxjs/internal/scheduler/AsapScheduler';
import { Lightbox, LightboxConfig } from 'ngx-lightbox';
import { async } from '@angular/core/testing';
import { NgxImageCompressService } from 'ngx-image-compress';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
//AfterViewChecked
export class ChatComponent implements OnInit, AfterViewInit {
  status = 'ONLINE';
  isConnected = true;
  baseURL: string = "http://34.231.177.197:3000";
  patient: any;
  isValue: any;
  isValue1: any;
  scrollContainer: any;
  viewGeneralInfo: boolean = false;
  viewPatientInfo: boolean = false;
  viewFiles: boolean = false;
  viewChat: boolean = true;
  oldmessages: any
  message: string = "";
  previousMessage: string = "";
  fetchedMessagesRes: any = [];
  fetchedMessages: Array<any> = [];
  userID: String;
  isUpdate: boolean = false;
  isReplyMsg: boolean = false;
  isIndex: number;
  isFetchMsg: boolean = false;
  hidePin: boolean = true;
  editmessageData: any;
  replyMessageData: any;
  appointmentID: String;
  getMsgObj: any = {
    "roomID": "",
    "userID": "",
    "isDoctor": true
  }
  sendMessageForm: FormGroup;
  replyMessageForm: FormGroup;
  replyMessageFormObj = {
    typedMessage: "",
    sendedImg: "",
    showName: ""
  };
  isViewVideo: boolean = false;
  patientObj: any;
  patientFamilyHistory: any = [];
  patientFamilyAllergies: any = [];
  imgURL: any = []

  moveDiagnosticNotes: boolean = false;
  viewScreeningRecords: boolean = true;
  viewReplyMsg: boolean = false;
  recipientRepliedName: any;
  typingOccured: boolean = false;
  yesTypingByMe: boolean = false;
  previewImg: any;
  previewImgDemo: boolean = false;
  arrayBuffer: any;
  viewImgSelection: boolean = false;
  uploadingFiles = [];
  replyImg: any;
  onlineObj: any;
  recentFile: any = '';
  showImg: any;
  messageDelivered: boolean = true;
  messageNotDelivered: boolean = true;
  closeResult: string;
  scrollTop: number = 300;
  _album = [];
  //sliceSuccResData: any = { "fileID": "1", "currentSlice": "1" };
  @ViewChild('mainScroll', { static: false }) myScroll: ElementRef;
  @ViewChild('items', { static: false }) msgElement: QueryList<any>;

  @ViewChild('fileInput', { static: true }) el: ElementRef;
  constructor(private dialogRef: MatDialog, private socket: Socket, private refData: MatDialogRef<MedicalPersonnelAppointmentsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder,
    private chatService: ChatService, private modalService: NgbModal, private _snackBar: MatSnackBar,
    private cd: ChangeDetectorRef, private connectionService: ConnectionService, private http: HttpClient,
    private loginService: LoginService, private _lightboxConfig: LightboxConfig, private _lightbox: Lightbox,
    private imageCompress: NgxImageCompressService) {

    this.connectionService.monitor().subscribe(isConnected => {
      this.isConnected = isConnected;
      if (this.isConnected) {
        this.status = "ONLINE";
        this.chatService.joinRoom({
          "roomID": this.appointmentID,
          "userID": this.userID,
        });
        console.log("Socket INFO...", this.socket);
        console.log("online MESSAGE from chat component...", this.status);
        console.log("before re-send msgs data...", this.fetchedMessages);
        // var indexNum;
        var filData = this.fetchedMessages.filter(
          data => {
            console.log("filter data...", data)
            return data.messageNotDelivered === true
          });

        console.log("Filter data", filData);

        filData.forEach(val => {
          if (val && val.userID) {
            let resendMsgObj = {
              "roomID": this.appointmentID,
              "userID": val.userID,
              "messageID": val.messageID,
              "message": val.message,
              "message1": val.message1,
              "repliedMessageID": val.repliedMessageID,
              "audioDuration": val.audioDuration,
              "recipientRepliedName": val.recipientRepliedName,
              "type": 'regular'
            }
            setTimeout(() => {
              this.chatService.sendMessage(resendMsgObj);
            }, 2000);
          }

          let index = -1;
          index = this.fetchedMessages.findIndex(element => {
            return val.messageID == element.messageID
          })
          if (index != -1) {
            this.fetchedMessages.splice(index, 1, val);
            this.scrollContainer.scrollTop = this.scrollContainer.scrollHeight
            this.cd.detectChanges()
            this.scrollToBottom();
            console.log("after re-send msgs data...", this.fetchedMessages);
          }
        });

        setTimeout(() => {
          console.log("call get-room-msgs data, after came back from offline to online...");

          this.chatService.getMessage(this.getMsgObj).subscribe(res => {
            this.fetchedMessages = [];
            this.fetchedMessagesRes = res;

            this.fetchedMessages = this.fetchedMessagesRes.room[0].messages;
            this.scrollContainer.scrollTop = this.scrollContainer.scrollHeight
            this.cd.detectChanges()
            this.scrollToBottom();
          })

        }, 5000);

      }
      else {
        this.status = "OFFLINE";
        console.log("offline MESSAGE from chat component...", this.status)
      }
    })
    this.chatService.userConnectedObj.subscribe((val: any) => {
      if (val && val.userID) {
        console.log("userConnectedObj called in chat component...", val);
        this.onlineObj = val.userID;
        if (this.patient && this.patient.patient && this.patient.patient.patientDetails) {
          this.patient.patient.patientDetails.isOnline = true;
        }
        // this.chatService.joinRoom({
        //   "roomID": this.appointmentID,
        //   "userID": this.userID,
        // });
      }
    });
    this.chatService.userDisconnectedObj.subscribe((val: any) => {
      console.log("userDisconnected res in component...", val);
      if (val && val.userID) {
        console.warn("userDisconnectedObj called in chat component...", val);
        this.patient.patient.patientDetails.isOnline = false;
      }
    });
    this.chatService.newMessageObj.subscribe((val: any) => {
      // this.fetchedMessages.push(val.messageData);
      let receviedMSGData = val;
      if (receviedMSGData && receviedMSGData.messageData) {

        if (receviedMSGData.messageData.userID !== this.userID) {
          // let index = -1;
          // index = this.fetchedMessages.findIndex(msgs=>{
          //   return receviedMSGData.messageData.messageID == msgs.messageData.messageID
          // })
          // if(index !=-1){
          //   this.fetchedMessages.splice(index,1,receviedMSGData.messageData)
          // }else{
          //   this.fetchedMessages.push(receviedMSGData.messageData)
          // }
          this.fetchedMessages.push(receviedMSGData.messageData)
          this.scrollContainer.scrollTop = this.scrollContainer.scrollHeight
          this.cd.detectChanges()
          this.scrollToBottom();
          //this.getUpdateChatMessageIsRead()
          let updateChatMessageIsReadObj1 = {
            roomID: this.appointmentID,
            userID: this.patient.patient.patientID,
            isDoctor: true
          }
          this.chatService.updateChatMessageIsReadEvent(updateChatMessageIsReadObj1);
        }
        else {
          console.log("else called...", receviedMSGData);
          if (receviedMSGData.messageData.type === 'reply') {
            console.log("messageData...", receviedMSGData.messageData);

            //this.fetchedMessages.push(receviedMSGData.messageData);
            var indexNum;
            var found = this.fetchedMessages.find(function (element, index) {
              return indexNum = index, element.messageID === receviedMSGData.messageData.messageID;
            });
            var afterUpdatedReplyMsgObj = {
              isEdited: found.isEdited,
              isLiked: found.isLiked,
              isRead: found.isRead,
              message: found.message,
              message1: found.message1,
              messageID: found.messageID,
              recipientRepliedName: found.recipientRepliedName,
              repliedMessageID: found.repliedMessageID,
              timeStamp: found.timeStamp,
              type: found.type,
              userID: found.userID,
              messageNotDelivered: true
            }
            this.fetchedMessages.splice(indexNum, 1, afterUpdatedReplyMsgObj);
            console.log("after modified the res reply data...", this.fetchedMessages[indexNum]);
            this.scrollContainer.scrollTop = this.scrollContainer.scrollHeight
            this.cd.detectChanges()
            this.scrollToBottom();
            //this.getUpdateChatMessageIsRead()
            let updateChatMessageIsReadObj1 = {
              roomID: this.appointmentID,
              userID: this.patient.patient.patientID,
              isDoctor: true
            }
            this.chatService.updateChatMessageIsReadEvent(updateChatMessageIsReadObj1);
          } else {
            console.log("messageData...", receviedMSGData.messageData);
            var indexNum;
            var found = this.fetchedMessages.find(function (element, index) {
              return indexNum = index, element.messageID === receviedMSGData.messageData.messageID;
            });
            this.fetchedMessages.splice(indexNum, 1, receviedMSGData.messageData);
            this.scrollContainer.scrollTop = this.scrollContainer.scrollHeight
            this.cd.detectChanges()
            this.scrollToBottom();
            //this.getUpdateChatMessageIsRead()
            let updateChatMessageIsReadObj1 = {
              roomID: this.appointmentID,
              userID: this.patient.patient.patientID,
              isDoctor: true
            }
            this.chatService.updateChatMessageIsReadEvent(updateChatMessageIsReadObj1);
          }
        }
      }
      else {

      }
    })
    this.chatService.resDeleteMessageForEveryOne.subscribe((val: any) => {
      if (val && val) {
        let deletedMsgData = this.fetchedMessages.filter(msgData => msgData.messageID != val[0]);
        this.fetchedMessages = deletedMsgData;
      }
    });

    this.chatService.editMessageResObj.subscribe((val: any) => {
      console.log("edited res data ... ", val);
      this.messageNotDelivered = !true
      this.messageDelivered = false;
      var receivedEditData = val;
      if (val && val.messageID) {
        console.log("messageData...", receivedEditData.messageID);
        var indexNum;
        var found = this.fetchedMessages.find(function (element, index) {
          return indexNum = index, element.messageID === receivedEditData.messageID;
        });
        console.log("available edit data...", found);
        var afterUpdatedEditMsg = {
          isEdited: true,
          isLiked: false,
          isRead: false,
          message: found.message,
          message1: found.message1,
          messageID: found.messageID,
          recipientRepliedName: "",
          repliedMessageID: "",
          timeStamp: found.timeStamp,
          type: found.type,
          userID: found.userID,
          messageNotDelivered: false
        }
        this.fetchedMessages.splice(indexNum, 1, afterUpdatedEditMsg);
        this.scrollContainer.scrollTop = this.scrollContainer.scrollHeight
        this.cd.detectChanges()
        this.scrollToBottom();
        console.log("after pushed the edit updated data...", this.fetchedMessages[indexNum]);
      }
      else {

      }

    });
    this.chatService.typingResObj.subscribe((val: any) => {
      console.log("typing res in component...", val);

      if (val && (val.isTyping === true)) {
        this.typingEvent();
        // setTimeout(() => {
        //   this.typingEvent();
        // }, 2000);
      }
      else {
        setTimeout(() => {
          this.typingOccured = false;
        }, 2000)
      }
    });
    this.chatService.updateChatMessageIsReadObj.subscribe((val: any) => {
      //console.log("updateChatMessageIsRead res in component...", val);
      // this.fetchedMessages = [];
      if (val.isDoctor === false) {
        //debugger;
        for (let i = 0; i <= this.fetchedMessages.length - 1; i++) {
          if (this.fetchedMessages[i].isRead === false) {
            this.fetchedMessages[i].isRead = true
          }
          else {
            this.fetchedMessages[i].isRead = true
          }
        }
        // console.log("updated isRead...", this.fetchedMessages);
      }
      //this.getUpdateChatMessageIsRead()
    });
    this.chatService.sliceUploadFileObj.subscribe((val: any) => {
      console.log("slice upload res in component...", val);
    });
    this.chatService.requestSliceUploadFileObj.subscribe((val: any) => {
      console.log("requestSliceUploadFileObj res in component... ", val);
      //this.sliceSuccResData = val;
      var file1 = this.getFileWithID(val.fileID)
      if (file1 !== null) {
        console.log("current slice...", file1);
        file1.offset = Number(val.currentSlice)
        this.uploadFile(file1);
      }

    });
    this.chatService.endUploadFileObj.subscribe((val: any) => {
      console.log("endUploadFileObj res in component...", val);

      this.viewImgSelection = false;
      this.uploadingFiles = [];
      if (val && val.messageData) {
        this.fetchedMessages.push(val.messageData);
        console.log("after getting succ res from END-UPLOAD-FILE-Obj...", this.fetchedMessages);
        //var uniq = [...new Set(test.map(({id}) => id))].map(e => test.find(({id}) => id == e));

        // this.fetchedMessages = uniq1;
        // this.scrollContainer.scrollTop = this.scrollContainer.scrollHeight
        this.cd.detectChanges()
        this.scrollToBottom();
      }
      else {
        console.log("push operation failed on IMG...");
      }

    });
    this.chatService.uploadErrorFileObj.subscribe((val: any) => {
      console.log("uploadErrorFileObj res in component...", val);
    });
  }

  ngOnInit() {

    // let optionsData = {
    //   userID: localStorage.getItem("medicalPersonnelID"),
    //   userType: 'Doctor'
    // }
    // this.chatService.Connect(optionsData);

    //this.scrollToBottom();
    this.openChat();
    this.fetchedMessages = []
    //this.chatService.setupSocketConnection()
    console.log("the patient Data is : ", this.data);
    this.patient = this.data;
    this.userID = this.patient.patient.doctorMedicalPersonnelID;
    this.appointmentID = this.patient.patient.appointmentDetails.appointmentID;
    this.getMsgObj.roomID = this.appointmentID;
    this.getMsgObj.userID = this.userID;
    // = {
    //   "roomID": this.appointmentID,
    //   "userID": this.userID,
    //   "isDoctor": true
    // }
    this.chatService.setupSocketConnection()
    this.join();
    this.onLoad();
    this.isFetchMsg = false;
    this.chatService.getMessage(this.getMsgObj).subscribe(res => {
      // this.fetchedMessages = [];
      this.fetchedMessagesRes = res;
      if (!this.isFetchMsg) {
        this.fetchedMessages = this.fetchedMessagesRes.room[0].messages;
        this.isFetchMsg = true
        this.scrollContainer.scrollTop = this.scrollContainer.scrollHeight
        this.cd.detectChanges()
        this.scrollToBottom();
      }
      else {
        setTimeout(() => {
          // this.scrollToBottom();
          this.scrollContainer.scrollTop = this.scrollContainer.scrollHeight
          // this.cd.detectChanges()
          this.scrollToBottom();
        }, 1000)
      }
      // alert(this.fetchedMessages)
      // console.log("Component-RES from getRoomMessages ... ", this.fetchedMessages);

      //alert(JSON.stringify(this.fetchedMessages))
      //alert(JSON.stringify(res))
    })
    // this.chatService
    // .getMessages().subscribe((message: string) => {
    //   console.log("Room Messages",message);

    // })
    this.sendMessageForm = this.fb.group({
      typedMessage: [""],
      selectedImg: [""]
    });
    this.replyMessageForm = this.fb.group({
      typedMessage: [""],
      sendedImg: [""]
    });
    this.patientObj = {
      hospital_reg_num: this.patient.signObj.medicalPersonnel.profile.userProfile.hospital_reg_num,
      token: this.patient.signObj.access_token,
      byWhom: "medical personnel",
      byWhomID: this.patient.signObj.medicalPersonnel.profile.userProfile.medical_personnel_id,
      patientID: this.patient.patient.patientID,
      medical_record_id: this.patient.patient.patientDetails.medical_record_id,
    };
    this.getFamilyHistory(this.patientObj);
    this.getFamilyAllergies(this.patientObj);

  }
  onLoad() {

    this.socket.on("sendMessage", (data: any) => {
      let receviedMSGData = data;
      if (receviedMSGData && receviedMSGData.messageData) {

        if (receviedMSGData.messageData.userID !== this.userID) {
          this.fetchedMessages.push(receviedMSGData.messageData)

          this.scrollContainer.scrollTop = this.scrollContainer.scrollHeight

          this.scrollToBottom();
          //this.getUpdateChatMessageIsRead()
          let updateChatMessageIsReadObj1 = {
            roomID: this.appointmentID,
            userID: this.patient.patient.patientID,
            isDoctor: true
          }
          this.chatService.updateChatMessageIsReadEvent(updateChatMessageIsReadObj1);
        }
        else {
          console.log("else called...", receviedMSGData);
          if (receviedMSGData.messageData.type === 'reply') {
            console.log("messageData...", receviedMSGData.messageData);

            //this.fetchedMessages.push(receviedMSGData.messageData);
            var indexNum;
            var found = this.fetchedMessages.find(function (element, index) {
              return indexNum = index, element.messageID === receviedMSGData.messageData.messageID;
            });
            var afterUpdatedReplyMsgObj = {
              isEdited: found.isEdited,
              isLiked: found.isLiked,
              isRead: found.isRead,
              message: found.message,
              message1: found.message1,
              messageID: found.messageID,
              recipientRepliedName: found.recipientRepliedName,
              repliedMessageID: found.repliedMessageID,
              timeStamp: found.timeStamp,
              type: found.type,
              userID: found.userID,
              messageNotDelivered: true
            }
            this.fetchedMessages.splice(indexNum, 1, afterUpdatedReplyMsgObj);
            console.log("after modified the res reply data...", this.fetchedMessages[indexNum]);
            this.scrollContainer.scrollTop = this.scrollContainer.scrollHeight
            this.cd.detectChanges()
            this.scrollToBottom();
            //this.getUpdateChatMessageIsRead()
            let updateChatMessageIsReadObj1 = {
              roomID: this.appointmentID,
              userID: this.patient.patient.patientID,
              isDoctor: true
            }
            this.chatService.updateChatMessageIsReadEvent(updateChatMessageIsReadObj1);
          } else {
            console.log("messageData...", receviedMSGData.messageData);
            var indexNum;
            var found = this.fetchedMessages.find(function (element, index) {
              return indexNum = index, element.messageID === receviedMSGData.messageData.messageID;
            });
            this.fetchedMessages.splice(indexNum, 1, receviedMSGData.messageData);

            this.scrollContainer.scrollTop = this.scrollContainer.scrollHeight
            this.scrollToBottom();
            //this.getUpdateChatMessageIsRead()
            let updateChatMessageIsReadObj1 = {
              roomID: this.appointmentID,
              userID: this.patient.patient.patientID,
              isDoctor: true
            }
            this.chatService.updateChatMessageIsReadEvent(updateChatMessageIsReadObj1);
          }
        }
      }
      console.log("send message response :", data);
    });

    this.socket.on("messageEdit", (data) => {
      //this.editMessageResObj.next(data);
      console.log("reply for edit message...", data);
      console.log("edited res data ... ", data);
      this.messageNotDelivered = !true
      this.messageDelivered = false;
      var receivedEditData = data;
      if (data && data.messageID) {
        console.log("messageData...", receivedEditData.messageID);
        var indexNum;
        var found = this.fetchedMessages.find(function (element, index) {
          return indexNum = index, element.messageID === receivedEditData.messageID;
        });
        console.log("available edit data...", found);
        var afterUpdatedEditMsg = {
          isEdited: true,
          isLiked: false,
          isRead: false,
          message: receivedEditData.editedMessage,
          message1: found.message1,
          messageID: found.messageID,
          recipientRepliedName: "",
          repliedMessageID: "",
          timeStamp: found.timeStamp,
          type: found.type,
          userID: found.userID,
          messageNotDelivered: false
        }
        this.fetchedMessages.splice(indexNum, 1, afterUpdatedEditMsg);
        this.scrollContainer.scrollTop = this.scrollContainer.scrollHeight
        this.cd.detectChanges()
        this.scrollToBottom();
        console.log("after pushed the edit updated data...", this.fetchedMessages[indexNum]);
      }
      else {

      }
    });

    this.socket.on("requestSliceUpload", (data) => {
      console.log("req slice upload res from server...", data);
      //this.requestSliceUploadFileObj.next(data);

      var file1 = this.getFileWithID(data.fileID)
      if (file1 !== null) {
        console.log("current slice...", file1);
        file1.offset = Number(data.currentSlice)
        this.uploadFile(file1);
      }

    });

    this.socket.on("uploadError", (data) => {
      console.log("res from uploadError from server...", data);
      //this.uploadErrorFileObj.next(data);
    });

    this.socket.on("endUpload", (data) => {
      // this.socket.removeListener('endUpload');
      // console.log("res from endUpload from server...", data);
      this.viewImgSelection = false;
      this.uploadingFiles = [];
      if (data && data.messageData) {
        this.fetchedMessages.push(data.messageData);

        var uniq = [...new Set(this.fetchedMessages.map(({ messageID }) => data.messageData.messageID))].map(e => this.fetchedMessages.find(({ messageID }) => data.messageData == e));

        const data1 = this.fetchedMessages;
        // let duplicatePushArray = [];
        // for (let i = 0; i < data1.length; i++) {
        //   if (duplicatePushArray.indexOf(data1[i]) === -1) {
        //     duplicatePushArray.push(data1[i]);
        //   } else {
        //     console.log(`${data1[i]} is already pushed into array`);
        //   }
        // }
        var ii = data.messageData.messageID;
        const uniqueAddresses = Array.from(new Set(data1.map(a => a.messageID)))
          .map(ii => {
            return this.fetchedMessages.find(a => a.messageID === ii)
          })
        this.fetchedMessages = [];
        this.fetchedMessages = uniqueAddresses;
        console.log("duplicate array...", uniqueAddresses);

        console.log("after getting succ res...", this.fetchedMessages);
        //this.scrollContainer.scrollTop = 60;
        this.cd.markForCheck();
        this.scrollContainer.scrollTop = this.scrollContainer.scrollHeight
        setTimeout(() => {
          this.scrollToBottom();
        }, 1000)
      }
      else {
        console.log("push operation failed on IMG...");
      }
    });

  }
  moveToThisPosition(message, index) {
    console.log("Move to Quote message position", message, index);

    this.scrollContainer.scrollTop = this.scrollContainer.scrollHeight
    this.cd.detectChanges()
    this.scrollToBottom();

  }

  // fileProgress1(file) {
  //   let reader = new FileReader();
  //   let file1 = file;
  //   if (file && file) {
  //     reader.readAsDataURL(file1);
  //     // When file uploads set it to file formcontrol
  //     reader.onload = () => {

  //       this.showImg = reader.result
  //     }
  //   }
  // }
  compressFile() {
    // Image compress COde Here
    this.imageCompress.uploadFile().then(({ image, orientation }) => {
      console.warn("Image before Convert", this.imageCompress.byteCount(image))

      this.imageCompress.compressFile(image, orientation, 50, 30).then(
        result => {
          // this.fileProgress(result)
          let base64 = ""
          console.warn("compressed images", result)
          if (result.startsWith("data:image/jpeg")) {
            base64 = result.replace(/^data:image\/jpeg;base64,/, "");
          } else if (result.startsWith("data:image/png")) {
            base64 = result.replace(/^data:image\/png;base64,/, "");
          }
          let randomName = new Date().getTime();
          const imageName = randomName + '.png';
          const imageBlob = this.dataURItoBlob(base64);
          const imageFile = new File([imageBlob], imageName, { type: 'image/png' });
          console.warn("File Converted", imageFile)
          this.fileProgress(imageFile)
          console.warn('Size in bytes is now:', this.imageCompress.byteCount(result));
        }
      );

    });
    // Image Compress code ends Here
  }
  dataURItoBlob(dataURI) {
    const byteString = window.atob(dataURI);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([int8Array], { type: 'image/png' });
    return blob;
  }
  //Image Upload
  fileProgress(event: any) {
    this.chatService.listenFileUploadEvents();
    // this.viewImgSelection = true;
    this.viewImgSelection = false;
    var text1 = ""; //random text
    var possible1 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

    for (let i = 0; i < 5; i++) {
      text1 += possible1.charAt(Math.floor(Math.random() * possible1.length));
    }
    let d1 = Date.now();
    var text2 = ""; //random text
    var possible2 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

    for (let i = 0; i < 10; i++) {
      text2 += possible2.charAt(Math.floor(Math.random() * possible2.length));
    }

    let d2 = Date.now();
    var chunkSize = 100000;
    let fileName = event.name;
    let file = event;

    console.log("Converted Pic", file);
    // this.fileProgress1(file)
    this.recentFile = file;

    // this.previewImg = file;
    // console.log("previewImg ...", this.previewImg);

    // console.log("All Chunks", new Uint8Array(file.slice(0, file.size)));


    //let file = new Blob(event.target.files[0]);
    var fileReader = new FileReader();
    fileReader.readAsArrayBuffer(file);
    fileReader.onload = () => {

      this.previewImg = fileReader.result;
      console.log("previewImg ...", this.previewImg);

      var arrayBuffer = fileReader.result;
      console.log(arrayBuffer);
      console.log("bytes array...", arrayBuffer);
      let sliceUploadObj = {
        id: text1,
        name: fileName,
        offset: 0,
        size: file.size,
        data: arrayBuffer,
        type: "png",
        roomID: this.appointmentID,
        userID: this.userID,
        messageID: "MSG_Web_" + text2,
        messageType: "SingleImage"
      }
      this.uploadingFiles.push(sliceUploadObj);
      this.uploadFile(sliceUploadObj)
      this.cd.markForCheck()
    }
  }
  sendFileAsChunk() {

  }
  uploadFile(obj) {
    console.log("obj data in uploadFile function...", obj);
    var chunkSize = 100000;
    let length = obj.data.byteLength;
    let offset = obj.offset * chunkSize;
    console.log('file size..', length);
    console.log('offset...', offset);
    if (offset < length) {
      let thisChunkSize = ((length - offset) > chunkSize) ? chunkSize : (length - offset);
      var originalBytes = obj.data;
      let newData = obj;
      let file = newData.data;
      let slice = file.slice(offset, offset + Math.min(100000, file.byteLength - offset));
      newData.data = slice

      console.log("ready to send slice data to server...", newData);
      this.chatService.sliceUploadEvent(newData);
      this.getUpdateChatMessageIsRead();
      obj.data = originalBytes;
    }
  }
  copy(src) {
    var dst = new ArrayBuffer(src.byteLength);
    new Uint8Array(dst).set(new Uint8Array(src));
    return dst;
  }

  getFileWithID(fileID: any) {
    console.log("getting success response while slice upload case...", fileID);
    for (let i = 0; i <= this.uploadingFiles.length - 1; i++) {
      if (this.uploadingFiles[i].id === fileID) {
        console.log("Matched File ID", fileID);
        return this.uploadingFiles[i];
      }
    }
    return null;
  }

  closeImg() {
    this.viewImgSelection = false;
  }

  removeUploadedFile() {
    let newFileList = Array.from(this.el.nativeElement.files);
    this.sendMessageForm.get('selectedImg').setValue(null)
  }
  //Img Upload complete here


  isTypingByMe() {
    console.log("text length...", this.sendMessageForm.value.typedMessage.length);

    // this.sendMessageForm.valueChanges.subscribe(value => {
    //   console.dir(value.typedMessage);
    // });

    if (this.sendMessageForm.value.typedMessage.length >= 1) {
      console.log("Is typing occured when >= 1...");


      //setTimeout(() => {
      let typingObj = {
        roomID: this.appointmentID,
        username: this.patient.patient.doctorDetails.profile.userProfile.firstName,
        isTyping: true
      }
      this.chatService.typingEvent(typingObj);
      //}, 3000);

    }
    else if (this.sendMessageForm.value.typedMessage.length == 0) {
      console.log("Is typing occured when ELSE case means size 0 (ZERO)...");
      let typingObj = {
        roomID: this.appointmentID,
        username: this.patient.patient.doctorDetails.profile.userProfile.firstName,
        isTyping: false
      }
      this.chatService.typingEvent(typingObj);
    }
    else {

    }
    //this.chatService.typingEvent(typingObj);
  }
  typingEvent() {
    this.typingOccured = true;
    // let typingObj = {
    //   roomID: this.appointmentID, username: this.patient.patient.doctorDetails.profile.userProfile.firstName, isTyping: true
    // }
    // this.chatService.typingEvent(typingObj);
  }
  getFamilyHistory(obj) {
    this.loginService.getPatientFamilyHistoryData(obj).subscribe(
      (res) => {
        console.log("res from rou", res);
        if (res.response === 3) {
          console.log("the family history res : ", res);
          this.patientFamilyHistory = res.records.famliyDiseases;
        } else if (res.response === 0) {
          this.patientFamilyHistory = [];
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
  //Fetch Patient Allergie
  getFamilyAllergies(obj) {
    this.loginService.getPatientAllergiesData(obj).subscribe(
      (res) => {
        console.log("res from fetch patient allergies : ", res);
        if (res.response === 3) {
          console.log("the family allergies : ", res);
          this.patientFamilyAllergies = res.records.allergies;
        } else if (res.response === 0) {
          this.patientFamilyAllergies = [];
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
  openVideoCall() {
    this.isViewVideo = true;
  }
  // scrollToBottom() {
  //   setTimeout(() => { this.myScroll.nativeElement.scrollTop = this.myScroll.nativeElement.scrollHeight }, 1)
  // }
  testBoolean(value): boolean {
    return value;
  }
  ngAfterViewInit() {
    this.scrollContainer = this.myScroll.nativeElement;
    this.scrollContainer.scrollTop = this.scrollContainer.scrollHeight;
    this.scrollToBottom()
  }


  scrollToBottom(): void {
    if (this.scrollContainer.offsetHeight + this.scrollContainer.scrollTop >= this.scrollContainer.scrollHeight) {
      this.scrollContainer.scrollTop = this.scrollContainer.scrollHeight;
    }
    this.scrollContainer.scrollTop = this.scrollContainer.scrollHeight;
  }
  join() {
    this.chatService.joinRoom({
      "roomID": this.appointmentID,
      "userID": this.userID
    });

    this.getRoomMsg();
    //after join , call getRoomMessages
  }
  getRoomMsg() {
    if (!this.isFetchMsg) {
      this.chatService.getMessage(this.getMsgObj);
      // this.scrollToBottom();
      setTimeout(() => {
        this.scrollToBottom()
      }, 1000);
    }
  }



  sendChatMessages() {

    document.getElementById("theInputVal").addEventListener("keydown", function (event) {
      return event.which !== 13;
    });

    console.log("the input msg lenght...", this.sendMessageForm.value.typedMessage.length)

    if (this.isUpdate !== false) {
      console.log(this.message, this.editmessageData);
      if (this.sendMessageForm.value.typedMessage.length >= 1) {
        let resendEditedMsgObj = {
          roomID: this.data.patient.appointmentDetails.appointmentID,
          isEdited: true,
          message: this.sendMessageForm.value.typedMessage,
          message1: this.editmessageData.message,
          messageID: this.editmessageData.messageID,
          type: this.editmessageData.type,
          userID: this.editmessageData.userID
        }
        console.log("after edited message data ... ", resendEditedMsgObj);
        this.chatService.editMessage(resendEditedMsgObj);
        //this.sendMessageForm.reset();
        this.sendMessageForm.patchValue({
          typedMessage: '',
        })
        this.message = ""

        console.log("Before update the array-index data...", this.fetchedMessages[this.isIndex]);
        //this.fetchedMessages.splice(this.isIndex, 1, resendEditedMsgObj);
        console.log("After updated the array-index data ...", this.fetchedMessages[this.isIndex]);
        this.isUpdate = false;

        var indexNum;
        var found = this.fetchedMessages.find(function (element, index) {
          return indexNum = index, element.messageID === resendEditedMsgObj.messageID;
        });
        if (this.status === 'OFFLINE') {
          var insertLocalResendEditedMsgObj = {
            timeStamp: "" + Date.now(),
            messageNotDelivered: true,
            roomID: resendEditedMsgObj.roomID,
            isEdited: resendEditedMsgObj.isEdited,
            message: resendEditedMsgObj.message,
            message1: resendEditedMsgObj.message1,
            messageID: resendEditedMsgObj.messageID,
            type: 'offline',
            userID: resendEditedMsgObj.userID
          }

          this.fetchedMessages.splice(indexNum, 1, insertLocalResendEditedMsgObj);
          console.log("After updated the array-index data ...", this.fetchedMessages[indexNum]);
          this.scrollContainer.scrollTop = this.scrollContainer.scrollHeight
          this.cd.detectChanges()
          this.scrollToBottom();
        }
        else {
          var insertLocalResendEditedMsgObj1 = {
            timeStamp: "" + Date.now(),
            messageNotDelivered: true,
            roomID: resendEditedMsgObj.roomID,
            isEdited: resendEditedMsgObj.isEdited,
            message: resendEditedMsgObj.message,
            message1: resendEditedMsgObj.message1,
            messageID: resendEditedMsgObj.messageID,
            type: resendEditedMsgObj.type,
            userID: resendEditedMsgObj.userID
          }
          this.fetchedMessages.splice(indexNum, 1, insertLocalResendEditedMsgObj1);
          console.log("After updated the array-index data ...", this.fetchedMessages[indexNum]);
          this.scrollContainer.scrollTop = this.scrollContainer.scrollHeight
          this.cd.detectChanges()
          this.scrollToBottom();
        }
      }
      else {
        this.openSnackBar1('', "kindly enter value");
      }


    }
    //Reply Message
    else if (this.isReplyMsg !== false) {
      var messageID = "";
      var possible11 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      for (let i = 0; i < 8; i++) {
        messageID += possible11.charAt(Math.floor(Math.random() * possible11.length));
      }
      if (this.userID === this.replyMessageData.userID) {
        this.recipientRepliedName = this.patient.patient.doctorDetails.profile.userProfile.firstName
      }
      else {
        this.recipientRepliedName = this.patient.patient.patientDetails.firstName
      }
      if (this.replyMessageData && this.replyMessageData.attachments && this.replyMessageData.attachments.length) {

        if (this.sendMessageForm.value.typedMessage.length >= 1) {

          let replyMsgObj: any = {
            "roomID": this.appointmentID,
            "userID": this.userID,
            "messageID": 'MSG_Web_' + messageID,
            "message": this.sendMessageForm.value.typedMessage,
            "message1": this.replyImg,
            "repliedMessageID": this.replyMessageData.messageID,
            "audioDuration": "",
            "recipientRepliedName": this.recipientRepliedName,
            "type": "reply"
          }
          console.log("reply msg data...", replyMsgObj);

          var afterUpdatedReplyMsgObj = {
            isEdited: false,
            isLiked: false,
            isRead: false,
            message: replyMsgObj.message,
            message1: replyMsgObj.message1,
            messageID: replyMsgObj.messageID,
            recipientRepliedName: replyMsgObj.recipientRepliedName,
            repliedMessageID: replyMsgObj.repliedMessageID,
            timeStamp: "" + Date.now(),
            type: replyMsgObj.type,
            userID: replyMsgObj.userID,
            messageNotDelivered: false
          }
          this.fetchedMessages.push(afterUpdatedReplyMsgObj);
          //console.log("the last inserted Quote msg data...", this.fetchedMessages.find(replyMsgObj.messageID))
          this.scrollContainer.scrollTop = this.scrollContainer.scrollHeight
          this.cd.detectChanges()
          this.scrollToBottom();

          this.chatService.sendMessage(replyMsgObj);
          this.closeReply();
          this.replyMessageForm.reset();
          this.replyMessageFormObj.sendedImg = '';
          this.replyMessageFormObj.typedMessage = '';
          this.replyMessageFormObj.showName = '';
          //this.sendMessageForm.reset();
          this.sendMessageForm.patchValue({
            typedMessage: '',
          })
          this.message = ""
          this.replyImg = []
          this.isReplyMsg = false;
        }
        else {
          this.openSnackBar1('', "kindly enter value");
        }
      }
      else {
        if (this.sendMessageForm.value.typedMessage.length >= 1) {

          let replyMsgObj: any = {
            "roomID": this.appointmentID,
            "userID": this.userID,
            "messageID": 'MSG_Web_' + messageID,
            "message": this.sendMessageForm.value.typedMessage,
            "message1": this.replyMessageData.message,
            "repliedMessageID": this.replyMessageData.messageID,
            "audioDuration": "",
            "recipientRepliedName": this.recipientRepliedName,
            "type": "reply"
          }
          console.log("reply msg data...", replyMsgObj);

          var afterUpdatedReplyMsgObj = {
            isEdited: false,
            isLiked: false,
            isRead: false,
            message: replyMsgObj.message,
            message1: replyMsgObj.message1,
            messageID: replyMsgObj.messageID,
            recipientRepliedName: replyMsgObj.recipientRepliedName,
            repliedMessageID: replyMsgObj.repliedMessageID,
            timeStamp: "" + Date.now(),
            type: replyMsgObj.type,
            userID: replyMsgObj.userID,
            messageNotDelivered: false
          }
          this.fetchedMessages.push(afterUpdatedReplyMsgObj);
          console.log("the last inserted Quote msg data...", this.fetchedMessages.find(obj => {
            return obj.messageID === replyMsgObj.messageID
          }))
          this.scrollContainer.scrollTop = this.scrollContainer.scrollHeight
          this.cd.detectChanges()
          this.scrollToBottom();

          //this.chatService.editMessage(replyMsgObj);
          this.chatService.sendMessage(replyMsgObj);
          this.closeReply();
          //this.fetchedMessages.splice(this.isIndex, 1, replyMsgObj);

          //this.previousMessage = this.replyMessageForm.value.typedMessage;
          this.replyMessageForm.reset();
          this.replyMessageFormObj.sendedImg = '';
          this.replyMessageFormObj.typedMessage = '';
          this.replyMessageFormObj.showName = '';
          //this.sendMessageForm.reset();
          this.sendMessageForm.patchValue({
            typedMessage: '',
          })
          this.message = ""
          this.isReplyMsg = false;
        }
        else {
          this.openSnackBar1('', "kindly enter value");
        }
      }
      this.closeReply();
      // this.viewReplyMsg = true;

    }
    //Sending Message
    else {
      var messageID = "";
      var possible11 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      for (let i = 0; i < 8; i++) {
        messageID += possible11.charAt(Math.floor(Math.random() * possible11.length));
      }
      if (this.sendMessageForm.value.typedMessage.length >= 1) {
        let sendMsgObj: any = {
          "roomID": this.appointmentID,
          "userID": this.userID,
          "messageID": 'MSG_Web_' + messageID,
          "message": this.sendMessageForm.value.typedMessage,
          "message1": this.previousMessage,
          "repliedMessageID": "",
          "audioDuration": "",
          "recipientRepliedName": "",
          "type": "regular"
        }
        if (this.status === 'OFFLINE') {
          this.fetchedMessages.push(
            {
              "messageNotDelivered": true,
              "isEdited": false,
              "isLiked": false,
              "isRead": false,
              "message": sendMsgObj.message,
              "message1": sendMsgObj.message1,
              "messageID": sendMsgObj.messageID,
              "recipientRepliedName": "",
              "repliedMessageID": "",
              "timeStamp": "" + Date.now(),
              "type": "offline",
              "userID": sendMsgObj.userID
            }
          );

          this.scrollContainer.scrollTop = this.scrollContainer.scrollHeight
          this.cd.detectChanges()
          this.scrollToBottom();
          console.log("Offline time messages data...", this.fetchedMessages);
        }
        //console.log("ready To SEND msg...", sendMsgObj);
        else {
          console.log("ready To SEND msg...", sendMsgObj);
          this.fetchedMessages.push({
            "messageNotDelivered": true,
            "roomID": sendMsgObj.roomID,
            "userID": sendMsgObj.userID,
            "messageID": sendMsgObj.messageID,
            "message": sendMsgObj.message,
            "message1": sendMsgObj.message1,
            "repliedMessageID": "",
            "audioDuration": "",
            "recipientRepliedName": "",
            "type": sendMsgObj.type
          });
          console.log("after sended local array data...", this.fetchedMessages);
          this.chatService.sendMessage(sendMsgObj);
          this.scrollContainer.scrollTop = this.scrollContainer.scrollHeight
          this.cd.detectChanges()
          this.scrollToBottom();
        }
        this.previousMessage = this.sendMessageForm.value.typedMessage;
        //this.sendMessageForm.reset();
        this.sendMessageForm.patchValue({
          typedMessage: '',
        })
        this.message = ""

      }
      else {
        this.openSnackBar1('', "kindly enter value");
      }
      // this.fetchedMessages.push(this.chatService.sendedResponseData);
    }

    let typingObj = {
      roomID: this.appointmentID,
      username: this.patient.patient.doctorDetails.profile.userProfile.firstName,
      isTyping: false
    }
    this.chatService.typingEvent(typingObj);
    this.getUpdateChatMessageIsRead();
  }

  editMessage(readyToEditMessage, index) {
    console.log("edit-msg called...");
    this.isUpdate = true;
    console.info("selected message to edit this message : ", readyToEditMessage, index);
    this.isIndex = index;
    this.sendMessageForm.patchValue({
      typedMessage: readyToEditMessage.message,
    })
    //this.sendMessageForm.value.typedMessage = readyToEditMessage.message
    //this.message = readyToEditMessage.message
    this.editmessageData = readyToEditMessage;
  }
  replyMessage(message, index) {
    this.hidePin = false;
    console.log("ready to reply msg data ...", message);
    if (message && message.attachments && message.attachments.length) {
      this.replyImg = this.baseURL + message.attachments[0].filePath;
      this.isReplyMsg = true;
      this.viewReplyMsg = true;
      this.replyMessageForm.patchValue({
        typedMessage: message.message,
        sendedImg: this.baseURL + message.attachments[0].filePath
      })
      this.replyMessageFormObj.typedMessage = message.message;
      this.replyMessageFormObj.sendedImg = this.baseURL + message.attachments[0].filePath
      let nameOfReplyMsg = '';
      if (message.userID.startsWith("MPID")) {
        this.replyMessageFormObj.showName = this.patient.patient.doctorDetails.profile.userProfile.firstName;
      }
      else if (message.userID.startsWith("PID")) {
        this.replyMessageFormObj.showName = this.patient.patient.patientDetails.firstName;
      }
      this.replyMessageData = message;
    }
    else {
      this.replyImg = '';

      this.isReplyMsg = true;
      this.viewReplyMsg = true;
      this.replyMessageForm.patchValue({
        typedMessage: message.message,
        //sendedImg: this.baseURL + message.attachments[0].filePath
      })
      this.replyMessageFormObj.typedMessage = message.message
      if (message.userID.startsWith("MPID")) {
        this.replyMessageFormObj.showName = this.patient.patient.doctorDetails.profile.userProfile.firstName;
      }
      else if (message.userID.startsWith("PID")) {
        this.replyMessageFormObj.showName = this.patient.patient.patientDetails.firstName;
      }
      this.replyMessageData = message;
    }
    //this.viewReplyMsg = false;
  }
  closeReply() {
    this.viewReplyMsg = false;
    this.replyImg = [];
  }
  deleteMessage(readyToDeleteMessage, index) {
    console.log("delete message data ... ", readyToDeleteMessage, index);
    let msgArray: any[] = []
    msgArray.push(readyToDeleteMessage.messageID)
    console.log("array of msd-IDs : ", msgArray);

    let deleteMsgForEveryOne = {
      roomID: this.patient.patient.appointmentDetails.appointmentID,
      messageIDs: msgArray
    }
    console.log("delete this msg data ...", deleteMsgForEveryOne);
    this.chatService.deleteMessageForEveryOne(deleteMsgForEveryOne);
    //this.fetchedMessages.splice(index, 1)
  }
  deleteForMeMessage(readyToDeleteMessage, index) {
    console.log("delete for me message data ... ", readyToDeleteMessage, index);
    let msgArray: any[] = []
    msgArray.push(readyToDeleteMessage.messageID)
    console.log("array of msd-IDs : ", msgArray);

    let deleteMsgForMeObj = {
      roomID: this.patient.patient.appointmentDetails.appointmentID,
      userID: this.userID,
      messageIDs: msgArray
    }
    console.log("delete this msg for me data ...", deleteMsgForMeObj);
    this.chatService.deleteMessageForMe(deleteMsgForMeObj);
    this.fetchedMessages.splice(index, 1)
  }
  downloadImg(readyToDownloadImg, index) {
    this.imgURL = this.baseURL + readyToDownloadImg.attachments[0].filePath
    console.log("the img data...", readyToDownloadImg.attachments[0].filePath, index);

    var fileNameTo = this.imgURL.substring(this.imgURL.lastIndexOf('/') + 1)
    this.http.get(this.imgURL, { responseType: "blob" }).subscribe(file => {
      this.exportFile(file, "text/plain", fileNameTo)
    })
  }

  openImg(index: number): void {
    this.previewImgDemo = true;
    this.viewGeneralInfo = false;
    this.viewPatientInfo = false;
    this.viewFiles = false;
    this.viewChat = false;
    //this._lightbox.open(this.fetchedMessages, index);
    console.log("preview img data...", this.fetchedMessages[index]);
    // let _album = [];
    //console.log("preview img...", imgURL);
    const album = {
      src: "" + this.baseURL + this.fetchedMessages[index].attachments[0].filePath,
      // caption: 'preview',
      // thumb: this.baseURL + this.fetchedMessages[index].attachments[0].filePath
    };
    //debugger
    this._album.push(album);
  }

  closeImgPreview(): void {
    this._album = []
    this.previewImgDemo = false;
    this.viewGeneralInfo = false;
    this.viewPatientInfo = false;
    this.viewFiles = false;
    this.viewChat = true;
    // close lightbox programmatically
    //this._lightbox.close();

    // this.scrollContainer.scrollTop = this.scrollContainer.scrollHeight
    // this.cd.detectChanges()
    // this.scrollToBottom();

  }

  exportFile(blob: any, filetype: string, filename: string) {
    var binaryData = [];
    binaryData.push(blob);

    const url = window.URL.createObjectURL(
      new Blob(binaryData, { type: filetype })
    );

    const a = document.createElement("a");
    a.setAttribute("style", "display:none;");
    document.body.appendChild(a);

    a.href = url;
    a.download = filename;
    a.click();
  }

  getUpdateChatMessageIsRead() {
    let updateChatMessageIsReadObj1 = {
      roomID: this.appointmentID,
      userID: this.patient.patient.patientID,
      isDoctor: true
    }
    this.chatService.updateChatMessageIsReadEvent(updateChatMessageIsReadObj1);
  }

  clearMessage(clearChatModelContent) {
    //openCancelAppointmentMethod(viewCancelAppointmentModelContent, patient) {

    //}
    this.isValue = 4;
    this.viewGeneralInfo = false;
    this.viewPatientInfo = false;
    this.viewFiles = false;
    this.viewChat = true;
    this.modalService.open(clearChatModelContent,
      { ariaLabelledBy: 'modal-basic-title', centered: true, size: "sm", backdrop: false }).result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });

    // let claerMessageObj = {
    //   roomID: this.appointmentID,
    //   userID: this.userID,
    // }
    // //this.chatService.clareMessageEvent(claerMessageObj);
  }

  callClearMessages() {
    let claerMessageObj = {
      roomID: this.appointmentID,
      userID: this.userID,
    }
    this.chatService.clareMessageEvent(claerMessageObj);
    this.fetchedMessages = [];
    this.getRoomMsg();
    this.modalService.dismissAll()
  }

  openGeneralInfo() {
    this.isValue = 1;
    this.viewGeneralInfo = true;
    this.viewPatientInfo = false;
    this.viewFiles = false;
    this.viewChat = false;
  }
  openPatientInfo() {
    this.isValue = 2;
    this.viewGeneralInfo = false;
    this.viewPatientInfo = true;
    this.viewFiles = false;
    this.viewChat = false;
  }
  openFile() {
    this.isValue = 3;
    this.viewGeneralInfo = false;
    this.viewPatientInfo = false;
    this.viewFiles = true;
    this.viewChat = false;
  }
  openChat() {
    this.isValue = 4;
    this.viewGeneralInfo = false;
    this.viewPatientInfo = false;
    this.viewFiles = false;
    this.viewChat = true;

    // if (this.previewImgDemo === false) {
    //   setTimeout(() => {
    //     this.scrollContainer.scrollTop = this.scrollContainer.scrollHeight
    //     this.cd.detectChanges()
    //     this.scrollToBottom();
    //   }, 1000);
    // }
    // this.scrollContainer.scrollTop = this.scrollContainer.scrollHeight
    // this.cd.detectChanges()
    // this.scrollToBottom();

    // this.scrollContainer.scrollTop = this.scrollContainer.scrollHeight
    // this.cd.detectChanges()
    // this.scrollToBottom();
  }
  openPatientData() {
    console.log("open patient info...");

    this.moveDiagnosticNotes = false
  }
  openDiagnosticNotes() {
    console.log("open diagnostic notes...");
    this.openScreeningRecords();
    this.isValue1 = 5;
    this.moveDiagnosticNotes = true;
  }
  openScreeningRecords() {
    this.isValue1 = 5;
    this.viewScreeningRecords = true;
  }
  openOthers() {
    this.isValue1 = 6;
    this.viewScreeningRecords = false;
  }
  closeModel() {
    console.log("before SOCKET disconnect...");
    this.chatService.leaveRoom({
      "roomID": this.appointmentID
    });
    //this.chatService.disconnect();
    console.log("after SOCKET disconnect...");
    this.leave()
  }
  leave() {
    this.refData.close();
  }
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
  openCancelAppointmentMethod(viewCancelAppointmentModelContent, patient) {
    this.modalService.open(viewCancelAppointmentModelContent, { ariaLabelledBy: 'modal-basic-title', centered: true, size: "md", backdrop: false }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  //Mat Snack Bar
  openSnackBar1(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 5000,
      verticalPosition: 'bottom', // 'top' | 'bottom'
      horizontalPosition: 'right', //'start' | 'center' | 'end' | 'left' | 'right'
    })
  }

}

//For socket file sending 
// https://medium.com/@Mewsse/file-upload-with-socket-io-9d2d1229494