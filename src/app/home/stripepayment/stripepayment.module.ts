import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StripepaymentPageRoutingModule } from './stripepayment-routing.module';

import { StripepaymentPage } from './stripepayment.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StripepaymentPageRoutingModule
  ],
  declarations: [StripepaymentPage]
})
export class StripepaymentPageModule {}
