import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { Observable, Subject, forkJoin } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import { ChooseVariationPage } from '../choose-variation/choose-variation.page';

@Component({
  selector: 'app-add-services',
  templateUrl: './add-services.page.html',
  styleUrls: ['./add-services.page.scss'],
})
export class AddServicesPage implements OnInit {
  searchTerm = '';
  categoryServiceSegment = "all"

  isSearching: boolean = false;
  filteredServices: any[] = [];
  selectedServicesAndPackages: any = [];
  serviceCategories: any;

  initialized = false;
  services: any[] = [];
  packages: any[] = [];
  combinedList: any[] = []; // This will hold both services and packages
  
  constructor(private userService: UserService, private modalController: ModalController, private navParams: NavParams,private _cd: ChangeDetectorRef) { }

  ngOnInit(): void {

  }
  ionViewWillEnter() {
    this.resetState();
    this.loadInitialData();
    this._cd.markForCheck(); // Add this line
  }
  
  resetState() {
    this.initialized = false;
    this.services = [];
    this.selectedServicesAndPackages = [];
    this.categoryServiceSegment = "all";
  
    const servicesFromNav = this.navParams.get('selectedServicesAndPackages');
    if (servicesFromNav) {
      this.selectedServicesAndPackages = JSON.parse(JSON.stringify(servicesFromNav));
    }
    this._cd.markForCheck(); // Add this line
  }

  onAllSegmentClicked() {
    this.loadInitialData();
  }

  
  async chooseVariation(service: any) {
    const modal = await this.modalController.create({
      component: ChooseVariationPage,
      componentProps: {
        service_id: service.id,
        service_name: service.name
      }
    });
  
    await modal.present();
  
    const { data } = await modal.onDidDismiss();
    if (data) {
      service.chosenVariation = data;
      if (service.selected && service.chosenVariation != null) {
        service.variationName == null;
      }
  
      service.isSelected = !service.isSelected; // Toggle the isSelected property
      if (service.type === 'package') {
        this.updatePackageSelection(service);
      } else {
        this.updateServiceSelection(service);
      }
      this._cd.markForCheck(); // Add this line
    }
  }
  

  
  
  private loadInitialData() {
    forkJoin({
      serviceCategories: this.userService.getServiceCategories(),
      services: this.userService.getServices("all"),
      packages: this.userService.getPackages()
    }).subscribe(
      data => {
        this.handleDataLoadSuccess(data);
        this._cd.markForCheck(); // Add this line
      },
      err => {
        this.handleDataLoadError(err);
        this._cd.markForCheck(); // Add this line
      }
    );
  }
  
  private handleDataLoadSuccess(data: { serviceCategories: any, services: any, packages: any }) {
    this.serviceCategories = data.serviceCategories;
    this.packages = this.transformPackages(data.packages);
    this.services = this.combineServicesAndPackages(data.services, this.packages);
    this.initialized = true;
    this._cd.markForCheck(); // Add this line
  }
  
  
  private transformPackages(packages: any[]): any[] {
    return packages.map(pkg => ({
      ...pkg,
      isSelected: false,
      type: 'package'
    }));
  }
  
  private combineServicesAndPackages(services: any[], packages: any[]): any[] {
    return [...packages, ...services].filter(item => 
      !this.selectedServicesAndPackages.some((selected: { id: any; }) => selected.id === item.id)
    ).map(item => ({
      ...item,
      isSelected: this.selectedServicesAndPackages.some((selected: { id: any; }) => selected.id === item.id)
    }));
  }
  
  private handleDataLoadError(err: any) {
    // Handle error here (e.g., show an error message or log it)
    console.error("Error loading data:", err);
    this._cd.markForCheck(); // Add this line
  }
  


  goToPackages() {
    this.services = []
    this.getPackages();

  }
  getPackages() {
    this.userService.getPackages().subscribe(data => {
      this.packages = data
        .filter((pkg: any) => !this.selectedServicesAndPackages.some((selectedService: { id: any; }) => selectedService.id === pkg.id))
        .map((pkg: any) => ({
          ...pkg,
          isSelected: false,
          type: 'package' // Add type property for package
        }));
  
      this.updateCombinedList();
      this._cd.markForCheck(); // Add this line
    }, err => {
      // Handle error here
      this._cd.markForCheck(); // Add this line
    });
  }

  private updateCombinedList() {
    // Combine packages and services, with packages at the start
    this.services = [...this.packages, ...this.services].filter(item =>
      !this.selectedServicesAndPackages.some((selected: { id: any; }) => selected.id === item.id)
    ).map(item => ({
      ...item,
      isSelected: this.selectedServicesAndPackages.some((selected: { id: any; }) => selected.id === item.id)
    }));
  
    
  }
  
  
  getServicesSegment(category:any){
    this.packages=[]
    this.getServices(category);
  }

  getServices(category: any): Observable<void> {
    const completionSubject = new Subject<void>();
  
    let categoryToSend = category === "all" ? "all" : category.id;
    this.categoryServiceSegment = category === "all" ? "all" : category.name;
  
    this.userService.getServices(categoryToSend).subscribe(data => {
      this.services = data
        .filter((service: any) => !this.selectedServicesAndPackages.some((selectedService: { id: any; }) => selectedService.id === service.id))
        .map((service: any) => ({
          ...service,
          isSelected: false,
          type: 'service' 
        }));
  
      this.updateCombinedList();
      completionSubject.next();
      completionSubject.complete();
      this._cd.markForCheck(); // Add this line
    }, err => {
      completionSubject.error(err);
      this._cd.markForCheck(); // Add this line
    });
  
    return completionSubject.asObservable();
  }
  

  goBack() {
    this.modalController.dismiss();
    this._cd.markForCheck(); // Add this line
  }

  onSearch(event: any) {
    if (this.categoryServiceSegment != "all") {
      this.categoryServiceSegment = "all";
      this.getServices("all").subscribe(() => {
        this.performSearch(event.target.value.toLowerCase());
        this._cd.markForCheck(); // Add this line
      });
    } else {
      this.performSearch(event.target.value.toLowerCase());
      this._cd.markForCheck(); // Add this line
    }
  }

  performSearch(searchTerm: string) {
    if (searchTerm && searchTerm.trim() !== '') {
      this.isSearching = true;
      this.filteredServices = this.services.filter(service => {
        return service.name.toLowerCase().includes(searchTerm);
      });
    } else {
      this.isSearching = false;
      this.filteredServices = this.services;
    }
  }




  toggleSelectService(item: any) {
    
    if(item.hasVariations==true && item.isSelected==false){
      this.chooseVariation(item)
      return
    }
    if(item.selected && item.variationName!=null){
      item.variationName==null
    }

    item.isSelected = !item.isSelected; // Toggle the isSelected property
   if (item.type === 'package') {
      this.updatePackageSelection(item);
    }else{
      this.updateServiceSelection(item);

    }
  }
  
  private updateServiceSelection(service: any) {
    if (this.services.includes(service) || this.filteredServices.includes(service)) {
      this.removeFromLists(service);
      if(service.parentName==null){
        this.selectedServicesAndPackages.push(service);

      }
    } else {
      
      this.reintegrateService(service);
    }
  }
  
  private updatePackageSelection(pkg: any) {
    if (this.services.includes(pkg) || this.filteredServices.includes(pkg)) {
      this.removeFromLists(pkg);
      this.selectedServicesAndPackages.push(pkg);
    } else {
      this.reintegratePackage(pkg);
    }
  }
  
  
  private removeFromLists(item: any) {
    this.services = this.services.filter(s => s !== item);
    this.filteredServices = this.filteredServices.filter(s => s !== item);
  }
  
  private reintegrateService(service: any) {
    this.removeFromSelectedServices(service);
    if (this.categoryServiceSegment === 'all' || service.serviceCategory === this.categoryServiceSegment) {
      if(service.parentName==null){

    
      this.services.push(service);
      if (this.isSearching) {
        this.filteredServices.push(service);
      }
    }
  }
  }
  
  private reintegratePackage(pkg: any) {
    this.removeFromSelectedServices(pkg);
    if (this.categoryServiceSegment === 'all' || this.categoryServiceSegment== "packages") {
      this.services.push(pkg);
      if (this.isSearching) {
        this.filteredServices.push(pkg);
      }
    }
  }
  
  private removeFromSelectedServices(item: any) {
    this.selectedServicesAndPackages = this.selectedServicesAndPackages.filter((s: any) => s !== item);
  }
  



  saveServices() {
    console.log(this.selectedServicesAndPackages)
    this.modalController.dismiss(this.selectedServicesAndPackages);
    this._cd.markForCheck(); // Add this line
  }

}
