import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, timer } from 'rxjs';
import { shareReplay, switchMap, map } from 'rxjs/operators';

export interface Quote {
    quote: string;
    author: string;
}

export interface Joke {
    // id: number;
    // joke: string;
    quotes: Array<Quote>;
}

export interface JokeResponse {
    // type: string;
    contents: Joke;
}

// const API_ENDPOINT = 'https://api.icndb.com/jokes/random/5?limitTo=[nerdy]';
const API_ENDPOINT = 'http://quotes.rest/qod.json';
const CACHE_SIZE = 1;
const REFRESH_INTERVAL = 10000;

@Injectable()
export class QuoteService {
    private cache$: Observable<Array<Quote>>;

    constructor(private http: HttpClient) { }

    get jokes() {
        if (!this.cache$) {
            // Set up timer that ticks every X milliseconds
            const timer$ = timer(0, REFRESH_INTERVAL);

            // For each tick we make an http request to fetch new data
            // We use shareReplay(X) to multicast the cache so that all 
            // subscribers share one underlying source and don't re-create 
            // the source over and over again
            this.cache$ = timer$.pipe(
                switchMap(_ => this.requestJokes()),
                shareReplay(CACHE_SIZE)
            );
        }

        return this.cache$;
    }

    // Helper method to actually fetch the jokes
    private requestJokes() {
        return this.http.get<JokeResponse>(API_ENDPOINT).pipe(
            map(response => response.contents.quotes)
        );
    }
    //response['contents'].quotes[0].quote
}