import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { IonSelect, ItemReorderEventDetail, ModalController, NavParams } from '@ionic/angular';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-new-package',
  templateUrl: './new-package.page.html',
  styleUrls: ['./new-package.page.scss'],
})
export class NewPackagePage implements OnInit {
  services: any = [];
  selectedServices: string[] = [];
  packageName: any="";
  packageDescription: any="";
  packagePrice: any="";
  packageToEdit: any=[];
  editMode: boolean=false;
  packageId: any=null;
  onboarding: any=false;
  constructor(private userService:UserService,private changeDetectorRef: ChangeDetectorRef,private navParams: NavParams, private modalController: ModalController) { }
  @ViewChild('serviceSelect') serviceSelect!: IonSelect;

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.onboarding=this.navParams.get('onboarding');
    if(this.onboarding){
      this.services = this.navParams.get('services');
      
    }else{
      this.userService.getAllServicesAndVariations().subscribe(data => {
        
        // Filter services to include only those where has_variations is false
        this.services = data.filter((service: { hasVariations: any; }) => !service.hasVariations);
    }, err => {
        // Handle error
    });
  }
    
    this.services = this.services.reduce((acc: any[], service: { variations: any[]; name: any; }) => {
      // Check if the service has variations
      if (service.variations && service.variations.length > 0) {
        // For each variation, create a new object based on the service
        // but with the variation's details and the name formatted as "serviceName (variationName)"
        const variationsAsServices = service.variations.map((variation: { name: any; }) => ({
          ...service,
          ...variation, // Spread variation to override any similar fields from service
          name: `${service.name} (${variation.name})`, // Format name as "serviceName (variationName)"
          selected: false, // Ensure selected is set to false for the variation
        }));
    
        // Add all variations to the accumulator
        acc.push(...variationsAsServices);
      } else {
        // If no variations, add the service itself to the accumulator
        acc.push({
          ...service,
          selected: false
        });
      }
    
      return acc;
    }, []); // Initialize accumulator as an empty array
    
    this.packageToEdit=this.navParams.get('package');
    
    
    if(this.packageToEdit.name!=""){
      this.editMode=true
      this.packageName=this.packageToEdit.name;
      this.packageId=this.packageToEdit.id;
      this.packageDescription=this.packageToEdit.description;
      this.packagePrice=this.packageToEdit.price;
      this.selectedServices=this.packageToEdit.services;
      this.changeDetectorRef.detectChanges();
    }
  }

  goBack() {
    this.modalController.dismiss()
  }

  updateSelectedServices(event: any) {
    
    
    
    
    this.selectedServices = event.detail.value;
    
    
    

  }
  handleReorder(ev: CustomEvent<ItemReorderEventDetail>) {
    // Perform the reorder in the array
    const itemToMove = this.selectedServices.splice(ev.detail.from, 1)[0];
    this.selectedServices.splice(ev.detail.to, 0, itemToMove);
  
    // Complete the reorder and position the item in the DOM based on where the gesture ended
    ev.detail.complete();
  
    
  }
  
  getSelectedServiceName(serviceId: string): string {
    const service = this.services.find((s: { id: string; }) => s.id === serviceId);
    return service ? service.name : 'Unknown';
}


  openServiceSelect() {
    this.serviceSelect.open();
  }

  onInput(ev: any) {
    const value = ev.target!.value;
    let filteredValue = value.replace(/[^0-9.]+/g, '');
    const allCommas = filteredValue.split('.');
    if (allCommas.length > 2) {
      filteredValue = allCommas[0] + '.' + allCommas.slice(1).join('');
    }
    const parts = filteredValue.split('.');
    if (parts.length > 1 && parts[1].length > 2) {
      filteredValue = parts[0] + '.' + parts[1].slice(0, 2);
    }
    if (filteredValue.endsWith('.0') || filteredValue.endsWith('.00')) {
      filteredValue = parts[0];
    }
    ev.target.value = filteredValue;
  }

  savePackage() {
    if(!this.onboarding){
    const packageData = {
      id: this.packageId,
      name: this.packageName,
      description: this.packageDescription,
      price: this.packagePrice,
      services: this.selectedServices,
      servicesWithIndex: this.selectedServices.map((serviceId, index) => ({
        id: serviceId,
        index
      }))
    };
  
    
    
  
    this.userService.savePackage(packageData).subscribe((res: any) => {
      this.userService.presentToast("Το πακέτο αποθηκεύτηκε με επιτυχία","success")
      this.modalController.dismiss({
        'edited': true
      });
    }, err => {
      this.userService.presentToast("Κάτι πήγε στραβά. Παρακαλώ ξαναπροσπαθήστε.","danger")

      console.error('Error saving package:', err);
    });
  }else{
    const newPackage = {
      name: this.packageName,
      description: this.packageDescription,
      price: this.packagePrice,
      services: this.selectedServices,
      servicesWithIndex: this.selectedServices.map((serviceName, index) => {
        // Find the corresponding service object in this.services by name
        const service = this.services.find((service: { name: string; }) => service.name === serviceName);
        // Return an object that includes the service ID and the index
        // If the service is not found, it returns undefined for id
        return {
          id: service ? service.id : undefined,
          name: serviceName,
          index
        };
      })
    }
    
    
    this.modalController.dismiss({
      'newPackage': newPackage
    });
  }
  }
  

  canSavePackage(){
    if(this.packageName!="" && this.packagePrice!="" && this.selectedServices.length > 0){
      return true;
    }
    return false;
  }

  deletePackage(){
    this.userService.deletePackage(this.packageId).subscribe((res: any) => {
      this.userService.presentToast("Το πακέτο διαγράφηκε με επιτυχία","success")
      this.modalController.dismiss({
        'edited': true
      });
    }, err => {
      this.userService.presentToast("Κάτι πήγε στραβά. Παρακαλώ ξαναπροσπαθήστε.","danger")

    });
   
  }
}
