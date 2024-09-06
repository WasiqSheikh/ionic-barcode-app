import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePage } from './home.page';
import { QRCodeModule } from 'angularx-qrcode';

const routes: Routes = [
  {
    path: '',
    component: HomePage,
  },
  {
    path: 'products',
    loadChildren: () => import('./products/products.module').then( m => m.ProductsPageModule)
  },
  {
    path: 'cart',
    loadChildren: () => import('./cart/cart.module').then( m => m.CartPageModule)
  },
  {
    path: 'product/:id',
    loadChildren: () => import('./product-details/product-details.module').then( m => m.ProductDetailsPageModule)
  },
  {
    path: 'stripepayment',
    loadChildren: () => import('./stripepayment/stripepayment.module').then( m => m.StripepaymentPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes), QRCodeModule],
  exports: [RouterModule]
})
export class HomePageRoutingModule {}
