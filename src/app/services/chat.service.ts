import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { BehaviorSubject, Observable, Observer } from 'rxjs';
import { map } from 'rxjs/operators';
import { ChatComponent } from '../components/medicalPersonnelModule/chat/chat.component';

@Injectable({
  providedIn: 'root'
})

export class ChatService {
  //config: SocketIoConfig = { url: 'http://34.231.177.197:3000', options: {} };
  socketURLNAME: string = 'http://34.231.177.197:3000';
  sendedResponseData: any;
  public newMessageObj: BehaviorSubject<Object> = new BehaviorSubject({});
  public resDeleteMessageForEveryOne: BehaviorSubject<Object> = new BehaviorSubject({});
  public editMessageResObj: BehaviorSubject<Object> = new BehaviorSubject({});
  public typingResObj: BehaviorSubject<Object> = new BehaviorSubject({});
  public updateChatMessageIsReadObj: BehaviorSubject<Object> = new BehaviorSubject({});
  public sliceUploadFileObj: BehaviorSubject<Object> = new BehaviorSubject({});
  public requestSliceUploadFileObj: BehaviorSubject<Object> = new BehaviorSubject({});
  public endUploadFileObj: BehaviorSubject<Object> = new BehaviorSubject({});
  public isJoinedRoom: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public uploadErrorFileObj: BehaviorSubject<Object> = new BehaviorSubject({});
  public userConnectedObj: BehaviorSubject<Object> = new BehaviorSubject({});
  public userDisconnectedObj: BehaviorSubject<Object> = new BehaviorSubject({});
  // private socket: Socket;
  constructor(private socket: Socket,) {

  }

  Connect(options) {

    this.socket.ioSocket.io.opts.query = { userID: options.userID, userType: options.userType } //new options
    this.socket.ioSocket.io.uri = "http://34.231.177.197:3000" //new uri
    this.socket.connect(); //manually connection
  }

  disconnect() {
    this.socket.disconnect();
  }
  async setupSocketConnection() {
    console.log("called from chat service...");
    //unsubscribe
    this.socket.on("subscribe", (data) => {

      console.log("called joined into the group...", data);
    });
    this.socket.on("unsubscribe", (data) => {
      console.log("called leave from the group...", data);
    });
    //this.socket.emit('getRoomMessages', '{"message":"Hello there from Angular."}');
    // this.socket.on("sendMessage", (data: any) => {
    // setTimeout(() => {
    // this.newMessageObj.next(data)
    // }, 1)
    // console.log("send message response :", data);
    // });
    this.socket.on("getRoomMessages", data => {
      console.log("Service-RES the present room messages are : ", data);
    })
    // this.socket.on("messageEdit", (data) => {
    //   this.editMessageResObj.next(data);
    //   console.log("reply for edit message...", data);
    // });
    this.socket.on("deleteMessageForEveryOne", (data) => {
      console.log("reply for delete msg for every-one...", data);
      this.resDeleteMessageForEveryOne.next(data.messageIDs);
    });
    this.socket.on("deleteMessageForMe", (data) => {
      console.log("reply for delete msg for Me...", data);
    });
    this.socket.on("typing", (data) => {
      // console.log("reply for typing event...", data);
      this.typingResObj.next(data);
    });
    this.socket.on("updateChatMessageIsRead", (data) => {
      // console.log("updateChatMessageIsRead res from server...", data);
      this.updateChatMessageIsReadObj.next(data);
    });

    this.socket.on(('userConnected'), (userConnectedResponse) => {
      console.info("userConnected ...", userConnectedResponse)
      this.userConnectedObj.next(userConnectedResponse)
    });
    this.socket.on(('userDisconnected'), (userDisconnectedResponse) => {
      console.warn("userDisconnectedResponse ...", userDisconnectedResponse);
      this.userDisconnectedObj.next(userDisconnectedResponse);
    });
    this.socket.on(('deleteChatHostory'), (deleteChatHostoryResponse) => {
      console.log("deleteChatHostoryResponse...", deleteChatHostoryResponse);
    });
    // Image upload 
    // this.socket.on("requestSliceUpload", (data) => {
    //   console.log("req slice upload res from server...", data);
    //   this.requestSliceUploadFileObj.next(data);
    // });

    // this.socket.on("uploadError", (data) => {
    //   console.log("res from uploadError from server...", data);
    //   this.uploadErrorFileObj.next(data);
    // });
  }
  listenFileUploadEvents() {
    // this.socket.on("requestSliceUpload", (data) => {
    //   console.log("req slice upload res from server...", data);
    //   this.requestSliceUploadFileObj.next(data);
    // });

    // this.socket.on("uploadError", (data) => {
    //   console.log("res from uploadError from server...", data);
    //   this.uploadErrorFileObj.next(data);
    // });
    // this.socket.on("endUpload", (data) => {
    // debugger;
    // this.socket.removeListener('endUpload');
    // // console.log("res from endUpload from server...", data);
    // this.endUploadFileObj.next(data);
    // });
  }
  joinRoom(data) {
    console.log("date", data)
    this.socket.emit('subscribe', data);
    this.isJoinedRoom.next(true);
  }
  leaveRoom(data) {

    this.socket.emit('unsubscribe', data);
  }

  getMessage(data) {
    this.socket.emit('getRoomMessages', data)
    return this.socket.fromEvent("getRoomMessages").pipe(map(data => data));
  }
  public sendMessage(message) {
    this.socket.emit('sendMessage', message);
  }

  public editMessage(message) {
    this.socket.emit('messageEdit', message);
  }

  public deleteMessageForEveryOne(message) {
    this.socket.emit('deleteMessageForEveryOne', message);
  }
  public deleteMessageForMe(message) {
    this.socket.emit('deleteMessageForMe', message);
  }
  public typingEvent(message) {
    this.socket.emit('typing', message);
  }
  public updateChatMessageIsReadEvent(message) {
    this.socket.emit('updateChatMessageIsRead', message);
  }
  public sliceUploadEvent(message) {
    this.socket.emit('sliceUploadWeb', message);
  }
  public clareMessageEvent(message) {
    this.socket.emit('deleteChatHostory', message);
  }

}