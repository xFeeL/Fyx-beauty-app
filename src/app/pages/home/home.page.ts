import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonPopover, ModalController, NavController, Platform } from '@ionic/angular';
import { UserService } from 'src/app/services/user.service';
import { NotificationsPage } from '../notifications/notifications.page';
import { ClientsPage } from '../clients/clients.page';
import { ReviewsPage } from '../reviews/reviews.page';
import { EditProfilePage } from '../edit-profile/edit-profile.page';
import { PortfolioPage } from '../portfolio/portfolio.page';
import { KrathshPage } from '../krathsh/krathsh.page';
import * as moment from 'moment';
import { MatChipsModule } from '@angular/material/chips';
import { animate, query, stagger, state, style, transition, trigger } from '@angular/animations';
import { MatTableDataSource, } from '@angular/material/table';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { KrathseisPage } from '../krathseis/krathseis.page';
import { MatMenuModule } from '@angular/material/menu';
import { ChangeDetectorRef } from '@angular/core';
import { ChartConfiguration, ChartDataset, ChartType } from 'chart.js';
import { ClientProfilePage } from '../client-profile/client-profile.page';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NewKrathshPage } from '../new-krathsh/new-krathsh.page';
export interface PeriodicElement {
  badge: string;
  avatar: string;
  name: string;
  date: string;
  floor: string;
  tables: string;
  status: string;
  id: string;
}
const ELEMENT_DATA: PeriodicElement[] = [


];

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  animations: [
    trigger('buttonAnimation', [
      state('collapsed', style({
        width: '80px',  // replace with the initial width of the button
      })),
      state('expanded', style({
        width: '110px',  // replace with the expanded width of the button
      })),
      transition('collapsed <=> expanded', animate('300ms ease-out'))
    ]),
    trigger('checkmarkAnimation', [
      state('void', style({
        opacity: 0,
        transform: 'scale(0.5)'
      })),
      state('*', style({
        opacity: 1,
        transform: 'scale(1)'
      })),
      transition('void => *', animate('300ms ease-out')),
      transition('* => void', animate('300ms ease-in'))
    ]),
    trigger('tableAnimation', [
      transition('* <=> *', [
        query(':enter',
          [
            style({ opacity: 0, transform: 'translateY(-15px)' }),
            stagger('50ms', animate('550ms ease-out', style({ opacity: 1, transform: 'translateY(0px)' })))
          ], { optional: true }
        ),
        query(':leave',
          animate('50ms', style({ opacity: 0 })), { optional: true }
        )
      ])
    ]),
    trigger('removeRow', [
      state('in', style({ opacity: 1, height: '*' })),
      transition('* => void', [
        animate('300ms', style({ opacity: 0, height: '0px', margin: '0px' }))
      ]),
    ]),
  ]



})
export class HomePage implements OnInit {
  lineChartLabels: string[] = [];

  public lineChartType: ChartType = 'line';
  projects: Array<any> = new Array<any>;
  proposals: Array<any> = new Array<any>;
  isMobile: boolean = false;
  page: number = 0;
  expertAddress: any;
  categories: any;
  initialCategories: any;
  categories_length: any;
  counter: number = 0;
  status: string = "all";
  krathseis: Array<any> = new Array<any>;
  newKrathseis: Array<any> = new Array<any>;
  selectedTimeFrame: string = 'εβδομάδας';

  initialized: boolean = false;
  cancelReason: string = "";
  statsNumberLoading = false;
  displayedColumns: string[] = ['avatar', 'name', 'date', 'floor', 'tables', 'status'];
  dataSource = ELEMENT_DATA;
  clickedRows = new Set<PeriodicElement>();
  resizeListener: any;
  pendingAppointments: any = 0;
  totalAppointments: any = 0;
  totalVisitors: any = 0;
  topClients: any=[];
  statsLoading: boolean = false;
  activeSegment: string = 'all'; // default value
  statusChosen: string = "0,0,0,0";
  maxMinutesPerReservation: number = 180;
  hideNewReservationButton: boolean = false;
  constructor(private cdr: ChangeDetectorRef, private platform: Platform, private rout: Router, private userService: UserService, private navCtrl: NavController, private modalController: ModalController) { }
  @ViewChild('krathshPop') krathshPop!: IonPopover;
  @ViewChild('acceptPop') acceptPop!: IonPopover;
  @ViewChild('rejectPop') rejectPop!: IonPopover;





  ngOnInit(): void {
    this.checkScreenWidth();
    this.resizeListener = this.platform.resize.subscribe(() => {
      this.checkScreenWidth();
    });
  }
  ionViewWillEnter() {


    this.projects = []
    this.page = 0
    this.userService.sseConnect(window.location.toString());
    this.getKrathseis(this.statusChosen);

    setInterval(() => {
      this.getKrathseis(this.statusChosen);
      this.getPendingAppointmentsNumber()

    }, 300000);
    this.getStatsNumbers(this.selectedTimeFrame);
    this.getStats(this.selectedTimeFrame);
    this.getPendingAppointmentsNumber()
    this.getTopClients();

  }


  ngOnDestroy() {
    // Cleanup the event listener when the component is destroyed
    if (this.resizeListener) {
      this.resizeListener();
    }
  }

  private checkScreenWidth(): void {
    const width = this.platform.width();
    if (width <= 500) {
      this.hideNewReservationButton = true
    } else {
      this.hideNewReservationButton = false

    }
    if (width <= 600) {
      this.isMobile = true;
    } else {
      this.isMobile = false;
    }
  }

  handleRefresh(event: any) {
    window.location.reload();

  }

 

  getTopClients() {
    this.userService.getTopClients().subscribe(data => {
      this.topClients = data;
    }, err => {

    })
  }

  getPendingAppointmentsNumber() {
    this.userService.getPendingAppointmentsNumber().subscribe(data => {
      this.pendingAppointments = data;
    }, err => {

    })


  }
  getTabKrathseis(status: string) {
    let temp_status = "0,0,0,0";
    if (status == "pending") {
      temp_status = "1,0,0,0"
    } else if (status == "accepted") {
      temp_status = "0,0,1,0"
    } else if (status == "canceled") {
      temp_status = "0,0,0,1"

    }
    this.userService.getAppointments(temp_status, 0, "upcoming", false).subscribe(data => {
      const newDataSource: PeriodicElement[] = [];

      for (let k = 0; k < data.length; k++) {
        let el = data[k];
        el[3] = moment(el[3]).locale("el").format('Do MMM, h:mm a');
        el[5] = el[5].split('$')[0] + " " + el[5].split('$')[1];
        this.krathseis.push(el);

        if (el[2] === "Αποδεκτή") {
          el[2] = el[7] === "false" ? "not_checked_in" : "checked_in";
        }

        if (k < 5) {
          const periodicElement: PeriodicElement = {
            badge: '',
            avatar: el[10],
            name: el[5],
            date: el[3],
            floor: el[8],
            tables: el[9],
            status: el[2],
            id: el[0],
          };
          newDataSource.push(periodicElement);
        }
      }

      this.dataSource = newDataSource;
      this.cdr.detectChanges();
    }, err => {
      if (err.error.text == "No more data") {
        this.dataSource = []
        this.cdr.detectChanges();

      }
    });
  }

  calculateTimeSince(dateString: string): string {
    let eventDate = new Date(dateString);
    let currentDate = new Date();
    let timeDifference = currentDate.getTime() - eventDate.getTime();
    let minutes = Math.round(timeDifference / (1000 * 60));
    if (minutes < 60) {
      return `πριν ${minutes} λεπ.`;
    }

    let hours = Math.round(timeDifference / (1000 * 60 * 60));
    if (hours < 24) {
      return `πριν ${hours} ώρ.`;
    }

    let days = Math.round(timeDifference / (1000 * 60 * 60 * 24));
    if (days < 30) {
      return `πριν ${days} ημ.`;
    }

    let months = (currentDate.getFullYear() - eventDate.getFullYear()) * 12 + (currentDate.getMonth() - eventDate.getMonth());
    return `πριν ${months} μήν.`;
  }



  notif() {

    this.rout.navigate(['notifications']);
    this.navCtrl.navigateRoot('notifications', { animated: true, animationDirection: 'forward' });


  }

  public newNotification() {
    return this.userService.newNotification;
  }

  goToProject(item: any) {
    this.navCtrl.navigateRoot('/ergasia?project_id=' + item.id, { animated: true, animationDirection: 'forward' });

  }

  goToProjects() {
    this.navCtrl.navigateRoot('/tabs/ergasies', { animated: true, animationDirection: 'forward' });
  }
  goToProposals() {
    this.navCtrl.navigateRoot('/tabs/prosfores', { animated: true, animationDirection: 'forward' });


  }


  async goToNotifications() {
    const modal = await this.modalController.create({
      component: NotificationsPage,
    });
    return await modal.present();
  }








  async goToProfile() {
    const modal = await this.modalController.create({
      component: EditProfilePage,
    });
    return await modal.present();
  }

  async goToClients() {
    const modal = await this.modalController.create({
      component: ClientsPage,
    });
    return await modal.present();
  }

  async goToClient(user_id: string) {
    const modal = await this.modalController.create({
      component: ClientProfilePage,
      componentProps: {
        'user_id': user_id
      }
    });
    return await modal.present();
  }


  async goToReviews() {
    const modal = await this.modalController.create({
      component: ReviewsPage,
    });
    return await modal.present();
  }

  async goToPortfolio() {
    const modal = await this.modalController.create({
      component: PortfolioPage,
    });
    return await modal.present();
  }



  async goToKrathshMobile(item: any) {
    const modal = await this.modalController.create({
      component: KrathshPage,
      componentProps: {
        'appointment_id': item
      }
    });
    modal.onWillDismiss().then((dataReturned) => {
      // Your logic here, 'dataReturned' is the data returned from modal
      if (this.userService.getNavData() == true) {
        this.page = 0;
        this.krathseis = []
        this.getKrathseis(this.statusChosen);

        //this.getKrathseisNew();

      }

    });
    return await modal.present();
  }

  async goToKrathsh(item: any) {
    const modal = await this.modalController.create({
      component: KrathshPage,
      componentProps: {
        'appointment_id': item.id
      }
    });
    modal.onWillDismiss().then((dataReturned) => {
      // Your logic here, 'dataReturned' is the data returned from modal
      if (this.userService.getNavData() == true) {
        this.page = 0;
        this.krathseis = []
        this.getKrathseis(this.statusChosen);

        //this.getKrathseisNew();

      }

    });
    return await modal.present();
  }


  async newKrathsh() {
    const modal = await this.modalController.create({
      component: NewKrathshPage,
      backdropDismiss: false
    });
    modal.onDidDismiss().then((dataReturned) => {
      console.log(dataReturned)
      if (dataReturned.data == true) {
        // Your logic here, 'dataReturned' is the data returned from modal
        this.page = 0;
        this.krathseis = []
        this.getKrathseis(this.statusChosen);
      }
    });

    return await modal.present();
  }

  getKrathseis(status: string) {
    this.statusChosen = status
    this.dataSource = []
    this.userService.getAppointments(this.statusChosen, this.page, "upcoming", false).subscribe(data => {
      this.dataSource = [];

      for (let k = 0; k < data.length; k++) {
        let el = data[k];
        el[3] = moment(el[3]).locale("el").format('Do MMM, h:mm a');
        el[5] = el[5].split('$')[0] + " " + el[5].split('$')[1];
        this.krathseis.push(el);

        if (el[2] == "Αποδεκτή") {
          if (el[7] == "false") {
            el[2] = "not_checked_in"
          } else {
            el[2] = "checked_in"
          }
        }
        if (k < 5) {
          const periodicElement: PeriodicElement = {
            badge: '',
            avatar: el[10],
            name: el[5],
            date: el[3],
            floor: el[8],  // Replace with actual mapping when available
            tables: el[9],  // Assuming tables is a string representation of the number of tables
            status: el[2],
            id: el[0],
          };
          this.dataSource.push(periodicElement);
        }
      }

      // Check once after your loop, and add 'badge' to displayedColumns only if it isn't already there.
      if (this.shouldDisplayBadgeColumn() && !this.displayedColumns.includes('badge') && !this.isMobile) {
        this.displayedColumns.unshift('badge');
      }

      this.cdr.detectChanges();


      this.initialized = true;
    }, err => {
      this.initialized = true;
    });
  }


  getColorForStatus(status: string): string {
    switch (status) {
      case 'Ακυρώθηκε':
        return 'danger';
      case 'Ολοκληρωμένη':
        return 'warning';
      case 'Αποδεκτή':
        return 'success';
      case 'Εκκρεμεί':
        return 'primary';
      default:
        return 'medium';
    }
  }

  getDate(datetime: string): string {
    return moment(datetime, 'Do MMM, h:mm a', 'el').format('D MMM');
  }

  getTime(datetime: string): string {
    return moment(datetime, 'Do MMM, h:mm a', 'el').format('h:mm a');
  }


  openAcceptPopover() {
    this.cancelReason = ""

    this.acceptPop.present()
  }

  closeAcceptPopover() {
    this.acceptPop.dismiss()

  }
  acceptAppointment(event: Event, appointment: any) {
    event.stopPropagation();
    this.userService.acceptAppointment(appointment.id).subscribe(data => {
      appointment.status = "not_checked_in"
      this.userService.presentToast("Η κράτηση έγινε αποδεκτή!", "success")

      setTimeout(() => {
        const index = this.dataSource.findIndex(e => e.id === appointment.id);
        if (index !== -1) {
          this.dataSource.splice(index, 1);
          // Since dataSource is an array, re-assign it for Angular to detect the change:
          this.dataSource = [...this.dataSource];
        }
      }, 300);
      this.getPendingAppointmentsNumber()
      this.getKrathseis(this.statusChosen);




    }, err => {
      this.userService.presentToast("Κάτι πήγε στραβά. Δοκιμάστε αργότερα.", "danger")

    })
    this.acceptPop.dismiss()

  }


  checkIn(appointment: any) {

    this.userService.changeCheckInStatus(appointment.id, "true").subscribe(data => {
      appointment.status = "checked_in"
      setTimeout(() => {
        const index = this.dataSource.findIndex(e => e.id === appointment.id);
        if (index !== -1) {
          this.dataSource.splice(index, 1);
          // Since dataSource is an array, re-assign it for Angular to detect the change:
          this.dataSource = [...this.dataSource];
        }
        if (!this.shouldDisplayBadgeColumn() && this.displayedColumns.includes('badge')) {
          const index = this.displayedColumns.indexOf('badge');
          if (index > -1) {
            this.displayedColumns.splice(index, 1);
          }
        }

        this.getKrathseis(this.statusChosen);

      }, 700);

    }, err => {
      this.userService.presentToast("Κάτι πήγε στραβά.", "danger")

    })



  }

  closeRejectPopover() {
    this.rejectPop.dismiss()

  }
  openRejectionPopover(event: Event, appointment: any) {
    this.cancelReason = ""
    event.stopPropagation();
    this.rejectPop.present()
  }

  applyRejectPopover(appointment_id: string) {
    this.userService.rejectAppointment(appointment_id, this.cancelReason).subscribe(data => {
      this.getKrathseis(this.statusChosen);
      this.getPendingAppointmentsNumber;
      this.userService.presentToast("Η κράτηση ακυρώθηκε!", "success")
    }, err => {
      this.userService.presentToast("Κάτι πήγε στραβά. Δοκιμάστε αργότερα.", "danger")

    })
    this.rejectPop.dismiss();
    this.acceptPop.dismiss();

  }

  appendToTextArea(reason: string) {
    this.cancelReason = ""
    this.cancelReason = reason;
  }

  async goToKrathseis() {
    if (this.isMobile) {
      this.rout.navigate(['/tabs/krathseis']);

    } else {
      const modal = await this.modalController.create({
        component: KrathseisPage,

      });
      return await modal.present();
    }



  }


  updateSelectedTimeFrame(newTimeFrame: string) {
    this.selectedTimeFrame = newTimeFrame;
    // Call any other function you want here
    this.getStatsNumbers(this.selectedTimeFrame);
    this.getStats(this.selectedTimeFrame)

  }

  getStatsNumbers(timeFrame: string) {

    this.statsNumberLoading = true
    this.userService.getStatsNumber(this.fixTimeFrameWording(timeFrame)).subscribe(data => {
      this.totalAppointments = data.appointmentCount;
      this.totalVisitors = data.totalPeople;
      this.statsNumberLoading = false

    }, err => {
      this.statsNumberLoading = false

      // Handle your error here
    });
  }

  fixTimeFrameWording(timeFrame: string) {
    let mappedTimeFrame: string;

    switch (timeFrame) {
      case "μήνα":
        mappedTimeFrame = "28";
        break;
      case "εβδομάδας":
        mappedTimeFrame = "7";
        break;
      case "χρονιάς":
        mappedTimeFrame = "365";
        break;
      default:
        // Handle any default or error case
        mappedTimeFrame = "unknown";
    }
    return mappedTimeFrame
  }
  
  getStats(timeFrame: string) {
    this.statsLoading = true;

    this.userService.getStats(this.fixTimeFrameWording(timeFrame)).subscribe(data => {
      this.lineChartLabels = Object.keys(data); // Extracting the labels from the response data
      this.lineChartData[0].data = Object.values(data); // Extracting the data values from the response data

      this.statsLoading = false;
    }, err => {
      this.statsLoading = false;
      console.error('Error fetching stats:', err);  // You might want to handle this more gracefully in your actual application.
    });
  }


  lineChartData: ChartDataset[] = [
    {
      data: [], label: 'Κρατήσεις', borderColor: 'lightblue',
      backgroundColor: 'rgba(0, 123, 255, 0.1)',
      fill: true, pointBorderColor: 'rgba(61,162,255,1)',       // This sets the border color of the points to blue.
      pointBackgroundColor: 'rgba(61,162,255,1)',
    },

  ];

  public lineChartOptions: ChartConfiguration['options'] = {
    elements: {
      line: {
        tension: 0.5,
      },
    },
    scales: {
      // We use this empty structure as a placeholder for dynamic theming.
      y: {
        position: 'left',
      },
      y1: {
        position: 'right',
        grid: {
          color: 'rgba(61,162,255,0.3)',
        },
        ticks: {
          color: 'lightblue',
        },
      },
    },

    plugins: {
      legend: { display: true },

    },
  };

  isDatePassed(dateStr: string): boolean {
    const date = this.convertGreekDate(dateStr);

    return date < new Date();
  }

  shouldDisplayBadgeColumn(): boolean {
    return this.dataSource.some(data => this.isDatePassed(data.date)) && !this.isMobile;
  }


  convertGreekDate(dateStr: string): Date {
    const parts = dateStr.split(' ');

    const day = parseInt(parts[0], 10);

    const monthMap: { [key: string]: number } = {
      'Ιαν': 0, 'Φεβ': 1, 'Μαρ': 2, 'Απρ': 3, 'Μάι': 4, 'Ιουν': 5,
      'Ιουλ': 6, 'Αυγ': 7, 'Σεπ': 8, 'Οκτ': 9, 'Νοε': 10, 'Δεκ': 11
    };

    // Remove any commas
    const monthStr = parts[1].replace(',', '');

    const month = monthMap[monthStr];

    const [hour, minute] = parts[2].split(':').map(val => parseInt(val, 10));

    const finalHour = parts[3] === 'μμ' && hour !== 12 ? hour + 12 : hour;

    return new Date(new Date().getFullYear(), month, day, finalHour, minute);
  }

  getHoursLeft(date: string): string {
    const now = new Date();
    const reservationDate = this.convertGreekDate(date);
    let diffMs = now.getTime() - reservationDate.getTime(); // milliseconds since the reservation started

    if (diffMs <= 0) return "Δεν έχει ξεκινήσει ακόμη";  // If the reservation hasn't started yet.

    diffMs = Math.round(diffMs / (1000 * 60)); // Convert to minutes
    diffMs -= this.maxMinutesPerReservation;
    if (diffMs <= -60) {
      const diffHrs = Math.floor(diffMs / 60);
      return -diffHrs + ' ω';
    } else {
      return -diffMs + ' λ';
    }
  }

  getTooltipHoursLeft(date: string): string {
    const hoursLeft = this.getHoursLeft(date);

    if (hoursLeft.includes('ω')) {
      return hoursLeft.replace('ω', ' ώρες');
    } else if (hoursLeft.includes('λ')) {
      return hoursLeft.replace('λ', ' λεπτά');
    }

    return hoursLeft;
  }



}



