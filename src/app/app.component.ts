import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'my-home-screen';
  getUrl() {
    // https://api.unsplash.com/photos/random?client_id=e7a603131f156585bbcb997c6df50c31f780ee8a8d0979f254f9bb92e34f42fa&orientation=landscape
    // /urls.regular
    // return "url('https://images.unsplash.com/photo-1511337308774-9ed6a725ad6b?ixlib=rb-0.3.5&q=85&fm=jpg&crop=entropy&cs=srgb&ixid=eyJhcHBfaWQiOjQxODUxfQ&s=08896bf4e97107a97effa70ab962fd2c')";
  }
}
