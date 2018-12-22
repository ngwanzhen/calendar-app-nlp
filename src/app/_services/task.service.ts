import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private wordsSpoken = new BehaviorSubject([]);
  // private wordsSpoken = new BehaviorSubject<[]>([]);
  currentList$ = this.wordsSpoken.asObservable();
  // apigwUrl = 'http://localhost:3000';
  apigwUrl = 'https://fathomless-chamber-45221.herokuapp.com';
  tempTasks;

  constructor(private http: HttpClient) {
  }

  async login() {
    const body = {
      'username': environment.calendarUser,
      'password': environment.calendarPassword
    };
    try {
      const response = await this.http.post(`${this.apigwUrl}/userAuth/login`, body, {
        observe: 'response',
        withCredentials: true
      }).toPromise();
      console.log('login response', response)
      return response;
    } catch {
      throw ('ERROR WITH TASKS SERVER')
    }
  }

  async getAllTasks() {
    const httpOptions = {
      // headers: new HttpHeaders({
      //   "Content-Type": "application/json"
      // }),
      withCredentials: true
    };
    const response = await this.http.get(`${this.apigwUrl}/task/list`, httpOptions).toPromise();
    console.log('getTask response', response)
    return response;
  }

  async getTodayTasks() {
    const httpOptions = {
      // headers: new HttpHeaders({
      //   "Content-Type": "application/json"
      // }),
      withCredentials: true
    };
    const response = await this.http.get(`${this.apigwUrl}/task/day`, httpOptions).toPromise();
    return response;
  }

  async postTempTasks(input) {
    // const body = input.first;
    const body = { nlp: input.first, sequentialTask: ['', ''] };
    const httpOptions = { withCredentials: true };
    console.log('body', body)
    const response = await this.http.post(`${this.apigwUrl}/task/form`, body, httpOptions).toPromise();
    console.log('response', response)
    if (response['singleData']) {
      this.tempTasks = response['singleData'];
    } else { this.tempTasks = response['recurringData'] }
    return response;
  }

  async confirmTasks() {
    const body = this.tempTasks;
    console.log('body', body)
    const httpOptions = { withCredentials: true };
    const response = await this.http.post(`${this.apigwUrl}/task/add`, body, httpOptions).toPromise();
    console.log('response', response)
    return response;
  }
}
