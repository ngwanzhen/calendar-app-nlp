import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { QuoteService, Quote } from '../_services/quote.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-quote',
  templateUrl: './quote.component.html',
  styleUrls: ['./quote.component.css']
})
export class QuoteComponent implements OnInit {

  title;
  author;
  jokes$: Observable<Array<Quote>>;
  googleFontKey = environment.googleFontKey;
  googleFontUrl = environment.googleFontUrl;

  constructor(private http: HttpClient, private quoteService: QuoteService, private ref: ChangeDetectorRef) { }

  async ngOnInit() {
    // getting quotes
    const quoteResponse = await this.http.get(`http://quotes.rest/qod.json`).toPromise();
    console.log(quoteResponse);
    this.title = quoteResponse['contents'].quotes[0].quote;
    this.author = quoteResponse['contents'].quotes[0].author;
    this.ref.detectChanges()

    // getting fonts
    // const fontResponse = await this.http.get(`${this.googleFontUrl}?key=${this.googleFontKey}&sort=trending`).toPromise();
    // const selectedFont = fontResponse['items'][Math.floor(Math.random() * 11)];
    // console.log('selectedFont', selectedFont);

    // this.jokes$ = this.quoteService.jokes;
    // console.log('jokes', this.jokes$)
  }

}
