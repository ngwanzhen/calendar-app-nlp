import {
  Component,
  ChangeDetectionStrategy,
  ViewChild,
  TemplateRef,
  OnInit,
  OnDestroy,
  ChangeDetectorRef,
} from '@angular/core';

import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours
} from 'date-fns';
import { Subject } from 'rxjs';
import { NgbModal, NgbCheckBox } from '@ng-bootstrap/ng-bootstrap';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarView
} from 'angular-calendar';
import { SpeechService } from './../_services/speech.service';
import { TaskService } from './../_services/task.service';
import { takeUntil } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs';

const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3'
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF'
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA'
  }
};

@Component({
  selector: 'mwl-demo-component',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['styles.css'],
  templateUrl: 'template.html'
})

export class DemoComponent implements OnInit, OnDestroy {
  @ViewChild('modalContent')
  modalContent: TemplateRef<any>;

  view: CalendarView = CalendarView.Month;

  CalendarView = CalendarView;

  viewDate: Date = new Date();
  words: string;

  modalData: {
    action: string;
    event: CalendarEvent;
  };

  actions: CalendarEventAction[] = [
    // {
    //   label: '<i class="fa fa-fw fa-pencil"></i>',
    //   onClick: ({ event }: { event: CalendarEvent }): void => {
    //     this.handleEvent('Edited', event);
    //   }
    // },
    // {
    //   label: '<i class="fa fa-fw fa-times"></i>',
    //   onClick: ({ event }: { event: CalendarEvent }): void => {
    //     this.events = this.events.filter(iEvent => iEvent !== event);
    //     this.handleEvent('Deleted', event);
    //   }
    // }
  ];

  refresh: Subject<any> = new Subject();

  events: CalendarEvent[] = [
    // {
    //   start: subDays(startOfDay(new Date()), 1),
    //   end: addDays(new Date(), 1),
    //   title: 'A 3 day event',
    //   color: colors.red,
    //   actions: this.actions,
    //   allDay: true,
    //   resizable: {
    //     beforeStart: true,
    //     afterEnd: true
    //   },
    //   draggable: true
    // },
    // {
    //   start: startOfDay(new Date()),
    //   title: 'An event with no end date',
    //   color: colors.yellow,
    //   actions: this.actions
    // },
    // {
    //   start: subDays(endOfMonth(new Date()), 3),
    //   end: addDays(endOfMonth(new Date()), 3),
    //   title: 'A long event that spans 2 months',
    //   color: colors.blue,
    //   allDay: true
    // },
    // {
    //   start: addHours(startOfDay(new Date()), 2),
    //   end: new Date(),
    //   title: 'A draggable and resizable event',
    //   color: colors.yellow,
    //   actions: this.actions,
    //   resizable: {
    //     beforeStart: true,
    //     afterEnd: true
    //   },
    //   draggable: true
    // }
  ];

  activeDayIsOpen: boolean = true;
  event: CalendarEvent[]
  response;
  todayTasks;

  private ngUnsubscribe: Subject<any> = new Subject();
  public workTasks: Observable<any[]>;
  public sideProjectTasks: Observable<any[]>;
  public personalTasks: Observable<any[]>;
  workCard;
  sideProjectCard;
  personalCard;

  constructor(
    private modal: NgbModal,
    private speechService: SpeechService,
    private taskService: TaskService,
    private ref: ChangeDetectorRef,
    private cookieService: CookieService,
    private db: AngularFirestore) {
    this.workTasks = db.collection('/work').valueChanges();
    this.sideProjectTasks = db.collection('/sideProject').valueChanges();
    this.personalTasks = db.collection('/personal').valueChanges();
  }

  async ngOnInit() {
    // this.speechService.start()
    console.log('init')

    // pull todo from firebase
    this.workTasks.subscribe(docs => {
      this.workCard = docs;
    });
    this.sideProjectTasks.subscribe(docs => {
      this.sideProjectCard = docs;
    });
    this.personalTasks.subscribe(docs => {
      this.personalCard = docs;
      this.ref.detectChanges();
    });

    // login & set cookies
    const login = await this.taskService.login()
    console.log('login', login)
    // this.cookieService.set('jwt', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJ0ZXN0QHRlc3QuY29tIiwicGFzc3dvcmQiOiIkMmIkMTAkWEt1Sk01L3VFSThYSjRNdGh3RFo2T0g3cnp2TEozU3RqU1R1S1FLbnRJaS9RT1g3bmsvaVciLCJjcmVhdGVkQXQiOiIyMDE4LTEyLTEyVDA5OjIzOjM1LjQ5NVoiLCJ1cGRhdGVkQXQiOiIyMDE4LTEyLTEyVDA5OjIzOjM1LjQ5NVoiLCJpYXQiOjE1NDUxMzM5NDd9.bw_1QNzc3qxRyDamSkNEd-iLtOONN1ZcwKySPiMP_eM');
    // this.cookieService.set('jwt', login['token']);

    // pull tasks
    const responses = await this.taskService.getAllTasks()
    console.log('responses', responses)
    this.formatTasks(responses);

    // pull today's tasks
    this.todayTasks = await this.taskService.getTodayTasks()
    console.log('todayTasks', this.todayTasks)
    this.ref.detectChanges()
    // this.formatTasks(responses);

  }

  formatTasks(responses) {
    this.events = [];
    const colorArr = ['red', 'yellow', 'blue'];
    responses.forEach(res => {
      let randColor = colorArr[Math.floor(Math.random() * colorArr.length)];
      this.events.push({
        title: res.title,
        start: new Date(res.scheduledStartDateTime),
        end: new Date(res.scheduledStartDateTime),
        color: colors[randColor],
        draggable: true
      })
    })
    console.log(this.events)
    this.ref.detectChanges()
  }

  async submitForm(input) {
    console.log('inputs', input)
    this.response = await this.taskService.postTempTasks(input);
    console.log(this.response);
    this.ref.detectChanges();
    // if (response['clashTask']) { }
  }

  async confirmEvent() {
    this.response = await this.taskService.confirmTasks();
    console.log(this.response, 'hello');

    // repeat pulling all tasks + today's tasks, should be refactored to subscription
    const responses = await this.taskService.getAllTasks()
    this.formatTasks(responses);
    this.todayTasks = await this.taskService.getTodayTasks()
    this.ref.detectChanges();
  }

  startListen() {
    this.speechService.start()
    this.speechService.currentList$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(words => {
        if (words.length) {
          this.words = words[0]
          this.ref.detectChanges()
        }
      })
  }

  getUrl() {
    return "url('https://images.unsplash.com/photo-1511337308774-9ed6a725ad6b?ixlib=rb-0.3.5&q=85&fm=jpg&crop=entropy&cs=srgb&ixid=eyJhcHBfaWQiOjQxODUxfQ&s=08896bf4e97107a97effa70ab962fd2c')";
  }

  update(cat, values) {
    console.log('values', values)
    console.log('cat', cat)
    this.db.collection(cat).doc(values).set({ task: values })
      .then( () => {
        console.log('Document successfully written!');
        this.ref.detectChanges();
      })
      .catch( error => {
        console.error('Error writing document: ', error);
      });
  }

  delete(cat, value) {
    console.log('delete', value)
    console.log('cat', cat)
    this.db.collection(cat).doc(value).delete()
      .then(() => {
        console.log('Document successfully deleted!');
        this.ref.detectChanges();
      })
      .catch(error => {
        console.error('Error deleting document: ', error);
      });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      this.viewDate = date;
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
    }
  }

  eventTimesChanged({
    event,
    newStart,
    newEnd
  }: CalendarEventTimesChangedEvent): void {
    event.start = newStart;
    event.end = newEnd;
    this.handleEvent('Dropped or resized', event);
    this.refresh.next();
  }

  handleEvent(action: string, event: CalendarEvent): void {
    this.modalData = { event, action };
    this.modal.open(this.modalContent, { size: 'lg' });
  }

  addEvent(): void {
    this.events.push({
      title: 'New event',
      start: startOfDay(new Date()),
      end: endOfDay(new Date()),
      color: colors.red,
      draggable: true,
      resizable: {
        beforeStart: true,
        afterEnd: true
      }
    });
    this.refresh.next();
  }
}
