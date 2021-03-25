import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from '../services/firebase.service';
import { SessionService } from '../services/session.service';
import * as bcrypt from 'bcryptjs';
import { error } from 'selenium-webdriver';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  // errors object
  public errors = {
    username: '',
    password: '',
    confirmPassword: '',
    student: '',
    failedLogin: '',
    siteFail: ''
  }

  // visual state 
  public isSignUp: boolean = false
  public isLogin: boolean = false

  // sign up
  public tasks = Array(3).fill(false);
  public sUsername: string = '';
  public sPassword: string = '';
  public cPassword: string = '';
  public studentOptions: Array<string> = [
    'Select an option',
    'Yes',
    'No'
  ];
  public student: string = this.studentOptions[0];
  public usernameAvailability: boolean;
  public usernameAvailabilityMsg: string = '';
  public msgOptions = {
    available: 'Username available!',
    unavailable: 'Username is already taken!'
  }
  public isCompletedSignUp = false;

  // sign in
  public lUsername: string = '';
  public lPassword: string = '';

  // user objects
  private newUser = {
    username: '',
    password: '',
    isStudent: false
  }
  private returningUser = {
    username: '',
    password: ''
  }

  constructor(
    private firebaseService: FirebaseService,
    private sessionService: SessionService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  // public checkUserInput(username: string): void {
  //   // no display necessary for no input or 1 character usernames
  //   if (username.length < 2) {
  //     this.usernameAvailabilityMsg = '';
  //     return
  //   } else {
  //     this.firebaseService.checkUsernameAvailability(username).then(res => {
  //       this.usernameAvailability = res;
  //       if (this.usernameAvailability) {
  //         this.usernameAvailabilityMsg = this.msgOptions.available;
  //       } else {
  //         this.usernameAvailabilityMsg = this.msgOptions.unavailable;
  //       }
  //     });
  //   }
  // }

  public signUp(): void {
    this.firebaseService.createUser(this.newUser)
    .then(
      res => {
        this.clearFields();
        this.isCompletedSignUp = true;
        this.sessionService.activeUser = this.newUser.username;
        console.log(this.sessionService.activeUser);
      },
      error => {
        this.errors.siteFail = "Looks like we had trouble creating your account :( Please try again later!";
      }
    )
  }

  private validateUsername(username: string): boolean {
    // if (this.usernameAvailabilityMsg === this.msgOptions.unavailable) {
    //   return false;
    // }
    if (username === '') {
      this.errors.username = 'Hold on there! We know you are excited but don\'t forget to enter a username!';
      return false;
    } else if (username.length < 3) {
      this.errors.username = 'Don\'t be shy, usernames need to be three characters or more!';
      return false;
    } else {
      return true;
    }
  }

  private validatePassword(password: string): boolean {
    if (password.length < 6) {
      this.errors.password = 'Passwords should be at least 6 characters!';
      return false;
    } else {
      return true;
    }
  }

  private validateStudent(student: string): boolean {
    if (student === 'Select an option') {
      this.errors.student = 'Please select yes or no :)';
      return false;
    } else {
      return true;
    }
  }

  public next(task: number): void {
    if (task === 1) {
      const isUsernameValid = this.validateUsername(this.sUsername);
      if (isUsernameValid) {
        this.tasks[0] = true;
        this.newUser.username = this.sUsername;
      }
      return;
    } else if (task === 2) {
      const isPasswordValid = this.validatePassword(this.sPassword);
      if (isPasswordValid) {
        this.tasks[1] = true;
        this.newUser.password === this.sPassword
        this.newUser.password = bcrypt.hashSync(this.newUser.password, 10);
      }
      return;
    } else if (task === 3) {
      const isStudentValid = this.validateStudent(this.student);
      if (isStudentValid) {
        this.tasks[2] = true;
        this.newUser.isStudent = true ? this.student === "Yes" : false;
        this.signUp();
      }
      return
    }
  }

  private clearFields(): void {
    this.sUsername = '';
    this.sPassword = '';
    this.cPassword = '';
    this.sUsername = '';
    this.sPassword = '';
    this.usernameAvailabilityMsg = '';
    this.student = this.studentOptions[0];

    this.errors.username = '';
    this.errors.password = '';
    this.errors.confirmPassword = '';
    this.errors.student = '';
    this.errors.failedLogin = '';
    this.errors.siteFail = '';
  }

  public back(): void {
    this.isSignUp = false;
    this.isLogin = false;
    this.clearFields();
  }

}
