import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-choose-variation',
  templateUrl: './choose-variation.page.html',
  styleUrls: ['./choose-variation.page.scss'],
})
export class ChooseVariationPage implements OnInit {
  service_id: any="";
  variations:any=[]
  service_name: any="";
  constructor(private modalController:ModalController, private userService:UserService, private navParams:NavParams) { }
  selectedVariation: any=null;
  ngOnInit() {
  }
  
  ionViewWillEnter() {
    this.service_id=this.navParams.get("service_id");
    this.service_name=this.navParams.get("service_name");

      this.userService.getVariationsOfService(this.service_id).subscribe(data=>{
        
        this.variations=data
      },err=>{

      })
  }


  goBack(){
    this.modalController.dismiss()
  }

  select(variation:any){
    
    
    this.selectedVariation=variation;
  }

  saveButtonDisabled(){
    return true
  }


  saveChoice() {
     // Ensure clear separation of text and object in logs
    this.modalController.dismiss(this.selectedVariation); // Dismiss modal with the selectedVariation object
  }
  
}
