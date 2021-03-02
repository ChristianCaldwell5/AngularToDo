import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from '../services/firebase.service';
import * as bcrypt from 'bcryptjs';

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
  public isSignIn: boolean = false
  public isLogin: boolean = false

  // sign up
  public sUsername: string = '';
  public sPassword: string = '';
  public cPassword: string = '';
  public studentOptions: Array<string> = [
    'Select an option',
    'Yes',
    'No'
  ];
  public student: string = this.studentOptions[0];
  public usernameAvailability: boolean = false;

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
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  public checkUserInput(username: string): void {
    // no display necessary for no input or 1 character usernames
    if (this.sUsername.length < 2) {
      return
    }

  }

  public checkUsernameAvailability(username: string): Promise<boolean> {
    return this.firebaseService.checkUsernameAvailability(username);
  }

  public signUp(): void {
    const signUpValid = this.validateSignUpForm();
    if (!signUpValid) {
      return;
    }
    this.newUser.username = this.sUsername;
    this.newUser.password = this.sPassword;
    this.newUser.password = bcrypt.hashSync(this.newUser.password, 10);
    if (this.student === "Yes") {
      this.newUser.isStudent = true;
    }
    this.firebaseService.createUser(this.newUser)
    .then(
      res => {
        this.clearFields();
        this.router.navigate(['']);
      }
    )
  }

  // error check sign up form before submission
  private validateSignUpForm(): boolean {
    let hasError = false;

    // username errors
    if (this.sUsername === '') {
      this.errors.username = 'Hmmm, what is this? No username? Enter one so we can keep track of your account.';
      hasError = true;
    } else if (this.sUsername.length < 2) {
      this.errors.username = 'Don\'t be shy, usernames need to be two characters or more!';
      hasError = true;
    } 
    const isNameAvailable = this.checkUsernameAvailability(this.sUsername);
    if (!isNameAvailable) {
      this.errors.username = 'This username is taken. Please try another!';
      hasError = true;
    }

    // password errors
    if (this.sPassword.length < 5) {
      this.errors.password = 'Let\'s keep your account secure. Make sure your password is more than 5 characters!';
      hasError = true;
    } else if (this.sPassword !== this.cPassword) {
      this.errors.confirmPassword = 'Can you double check that? Passwords need to match.';
      hasError = true;
    }

    // student error
    if (this.student === 'Select an option') {
      this.errors.student = 'Please answer yes or no :)';
      hasError = true;
    }
    
    if( hasError ) {
      return false
    }
    return true;
  }

  private clearFields(): void {
    this.sUsername = '';
    this.sPassword = '';
    this.cPassword = '';
    this.sUsername = '';
    this.sPassword = '';
    this.student = this.studentOptions[0];

    this.errors.username = '';
    this.errors.password = '';
    this.errors.confirmPassword = '';
    this.errors.student = '';
    this.errors.failedLogin = '';
    this.errors.siteFail = '';
  }

  public back(): void {
    this.isSignIn = false;
    this.isLogin = false;
  }

}
