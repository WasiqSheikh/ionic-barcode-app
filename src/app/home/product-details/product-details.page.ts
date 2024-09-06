import { products } from 'src/app/data/products';
import { Component, ElementRef, inject, input, OnInit, ViewChild } from '@angular/core';
import { CartService } from 'src/app/services/cart/cart.service';
import {  Router } from '@angular/router';
import { AnimationController } from '@ionic/angular';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.page.html',
  styleUrls: ['./product-details.page.scss'],
})
export class ProductDetailsPage implements OnInit {
  @ViewChild('cartBtn', { read: ElementRef }) cartBtn!: ElementRef;
  power: number = 0;
  id = input.required<string>();
  products: any = [...products];
  product: any = {};
  quantity: number = 1;
  cartService = inject(CartService);
  constructor(private router: Router, private navctrl: NavController, private animationCtrl: AnimationController) { }

  ngOnInit() {
    this.product = this.products.filter((item: any) => item.id == this.id())[0];
  }

  subtractQuantity() {
    this.quantity --;
  }

  addQuantity() {
    this.quantity++;
  }

  AddToCart() {
    const cartAnimation = this.animationCtrl.create('cart-animation')
    .addElement(this.cartBtn.nativeElement)
    .keyframes([
      { offset: 0, transform: 'scale(1)' },
      { offset: 0.5, transform: 'scale(1.2)' },
      { offset: 0.8, transform: 'scale(0.9)' },
      { offset: 1, transform: 'scale(1)' }
    ]);

  const parent = this.animationCtrl.create('parent')
    .duration(300)
    .easing('ease-out')
    .iterations(2)
    .direction('alternate')
    .addAnimation([cartAnimation]);
  parent.play();
    this.cartService.addItemByProductList(this.product, this.quantity);
    this.router.navigate(['/home/cart']);
  }
}
