import { Component, OnInit, ɵSWITCH_COMPILE_INJECTABLE__POST_R3__ } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from '../services/firebase.service';
import { SessionService } from '../services/session.service';
import * as bcrypt from 'bcryptjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  // all errors possible for user on this component
  public errors = {
    username: '',
    password: '',
    email: '',
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
  public sEmail: string = '';
  public cPassword: string = '';
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
    email: '',
    id: ''
  }
  private returningUser = {
    username: '',
    id: '',
    lists: []
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

  private validateUsername(username: string): boolean {
    // this.checkUsernameAvailability(username);
    if (this.usernameAvailabilityMsg) {
      this.errors.username = 'Looks like that username is taken. Try another? :)';
      return false;
    } else if (username === '') {
      this.errors.username = 'Hold on there! We know you are excited but don\'t forget to enter a username!';
      return false;
    } else if (username.length < 3) {
      this.errors.username = 'Don\'t be shy, usernames need to be three characters or more!';
      return false;
    } else {
      this.usernameAvailabilityMsg = '';
      return true;
    }
  }

  private async checkUsernameAvailability(username: string): Promise<void> {
    return await this.firebaseService.checkUsernameAvailability(username).then(res => {
      this.usernameAvailability = res;
      console.log(this.usernameAvailability);
      if (!this.usernameAvailability) {
        this.usernameAvailabilityMsg = this.msgOptions.unavailable;
      }
    });
  }

  private validatePassword(password: string): boolean {
    if (password.length < 6) {
      this.errors.password = 'Passwords should be at least 6 characters!';
      return false;
    } else {
      return true;
    }
  }

  private validateEmail(email: string): boolean {
    if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)) {
      return true;
    } else {
      return false;
    }
  }

  public next(task: number): void {
    if (task === 1) {
      const isUsernameValid = this.validateUsername(this.sUsername);
      console.log(isUsernameValid);
      if (isUsernameValid) {
        this.tasks[0] = true;
        this.newUser.username = this.sUsername;
      }
    } else if (task === 2) {
      const isPasswordValid = this.validatePassword(this.sPassword);
      if (isPasswordValid) {
        this.tasks[1] = true;
        this.newUser.password = bcrypt.hashSync(this.sPassword, 10);
      }
    } else if (task === 3) {
      const isEmailValid = this.validateEmail(this.sEmail);
      if (isEmailValid) {
        this.tasks[2] = true;
        this.newUser.email = this.sEmail;
        this.signUp();
      } else {
        this.errors.email = 'Please enter a valid email :P'
        this.clearFields();
      }
    }
  }

  private clearFields(): void {
    this.sUsername = '';
    this.sPassword = '';
    this.sEmail = '';

    this.lUsername = '';
    this.lPassword = '';

    this.usernameAvailabilityMsg = '';

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

  public continue() {
    this.router.navigateByUrl('/home');
  }

  public signUp(): void {
    this.sessionService.setUser(this.newUser);
    this.firebaseService.createUser(this.newUser)
    .then(
      res => {
        this.clearFields();
        this.isCompletedSignUp = true;
      },
      error => {
        this.errors.siteFail = "Looks like we had trouble creating your account :( Please try again later!";
      }
    )
  }

  public login(): void {
    this.returningUser.username = this.lUsername;
    let pass;
    this.firebaseService.getUserInfo(this.returningUser).subscribe(res => {
      res.filter(x => {
        pass = x.payload.doc.get('password');
        this.returningUser.id = x.payload.doc.id;
        this.returningUser.lists = x.payload.doc.get('lists');
      });
      if (bcrypt.compareSync(this.lPassword, pass)) {
        this.sessionService.setUser(this.returningUser);
        this.router.navigate(['/home']).then(() => {
          window.location.reload();
        });
      } else {
        this.clearFields();
        this.errors.failedLogin = 'Username or password is incorrect :( Try again?';
      }
    });
  }

}
