import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
declare var annyang: any;

@Injectable({
  providedIn: 'root'
})

export class SpeechService {
  // private wordsSpoken = new BehaviorSubject<Array<any>>([]);
  private wordsSpoken = new BehaviorSubject([]);
  // private wordsSpoken = new BehaviorSubject<[]>([]);
  currentList$ = this.wordsSpoken.asObservable();

  constructor() { }

  start() {
    if (annyang) {
      annyang.setLanguage('cmn-Hans-CN')
      // annyang.setLanguage('en-GB')

      const commands = {
        'hello': () => {
          alert('play play play!')
        }
      }
      annyang.addCommands(commands)

      annyang.addCallback('result', (userSaid, commandText, phrases) => {
        // console.log('userSaid', userSaid)
        this.wordsSpoken.next(userSaid);

        // this.changeWordsSpoken(userSaid)
      })

      annyang.addCallback('error', () => {
        console.log('error')
      });

      annyang.start()
    }
  }

  changeWordsSpoken(words) {
    this.wordsSpoken.next(words);
  }

}
