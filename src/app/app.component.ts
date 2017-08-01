import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { User } from './user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  emailPattern: RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  user: User;
  group: FormGroup;
  hasError = false;
  isUpdate: boolean = false;
  userArray: User[] = new Array();
  currentIndex: number;

  constructor() {
    this.setUserValues(new User());
  }

  ngOnInit() {
    this.getFromSession();
  }

  storeData(data: FormGroup) {
    if (data.valid) {
      this.user = data.value;
      this.user.fullName = this.user.firstName + " " + this.user.lastName;
      if (this.isUpdate) {
        this.userArray[this.currentIndex] = this.user;
      } else {
        this.userArray.push(this.user);
      }
      this.storeToSession(this.userArray);
      this.setUserValues(new User());
    } else {
      this.hasError = true;
    }
  }

  storeToSession(users) {
    this.isUpdate = false;
    sessionStorage.setItem('users', JSON.stringify(users));
  }

  getFromSession() {
    this.userArray = eval(sessionStorage.getItem(('users')));
    this.userArray = this.userArray != null ? this.userArray : new Array();
  }

  removeAll() {
    sessionStorage.removeItem('users');
    this.userArray = new Array();
  }

  remove(userIndex: number) {
    this.userArray.splice(userIndex, 1);
    sessionStorage.setItem('users', JSON.stringify(this.userArray));
  }

  edit(index: number) {
    this.isUpdate = true;
    this.currentIndex = index;
    this.setUserValues(this.userArray[this.currentIndex]);
  }

  clearForm() {
    this.hasError = false;
    this.isUpdate = false;
  }
  clone(index: number) {
    this.isUpdate = false;
    this.setUserValues(this.userArray[index]);
  }
  setUserValues(currentUser) {
    this.hasError = false;
    let fb2: FormBuilder = new FormBuilder();
    this.group = fb2.group({
      firstName: [currentUser.firstName, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(20)])],
      lastName: [currentUser.lastName, Validators.compose([Validators.required, Validators.maxLength(20), Validators.minLength(3)])],
      email: [currentUser.email, Validators.compose([Validators.required, Validators.pattern(this.emailPattern)])],
      contactNo: [currentUser.contactNo, Validators.compose([Validators.required, Validators.maxLength(10), Validators.minLength(10)])]
    })
  }
}

