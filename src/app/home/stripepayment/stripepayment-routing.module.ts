import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StripepaymentPage } from './stripepayment.page';

const routes: Routes = [
  {
    path: '',
    component: StripepaymentPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StripepaymentPageRoutingModule {}
