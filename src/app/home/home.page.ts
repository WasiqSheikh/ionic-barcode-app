import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { Swiper } from 'swiper'
import { CartService } from '../services/cart/cart.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { products } from '../data/products';
import { AnimationController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  @ViewChild('swiper')
  swiperRef: ElementRef | undefined;
  @ViewChild('cartIcon', { read: ElementRef }) cartIcon!: ElementRef;
  swiper?: Swiper;
  isToast: boolean = false;
  toastData: any = {};
  totalItems: any = 0;
  cartSub!: Subscription;
  products: any[] = [...products];
  private cartService = inject(CartService);
  images = [
    'https://images.unsplash.com/photo-1580927752452-89d86da3fa0a',
    'https://images.unsplash.com/photo-1498050108023-c5249f4df085',
    'https://images.unsplash.com/photo-1461749280684-dccba630e2f6',
    'https://images.unsplash.com/photo-1488229297570-58520851e868',
  ];
  //constructor(private cartService: CartService) {}
  constructor(private router: Router, private animationCtrl: AnimationController) { }

  ngOnInit(): void {
    this.cartSub = this.cartService.cart.subscribe({
      next: (cart) => {
        console.log(cart);
        this.totalItems = cart ? cart?.totalItem : 0;
      },
    });
  }
  swiperSlideChanged(e: any) {
    console.log('changed: ', e);
  }

  swiperReady() {
    this.swiper = this.swiperRef?.nativeElement.swiper;
  }

  goNext() {
    this.swiper?.slideNext();
  }

  goPrev() {
    this.swiper?.slidePrev();
  }
  async scanBarCode() {
    try {
      const code = await this.cartService.startScan();
      if (!code) {
        this.isToast = true;
        this.toastData = {
          color: 'danger',
          message: 'No BarCode available for the product'
        };
      }
      console.log('code: ', code);
      const product = this.products.find((item) => item.barcode == code);
      this.router.navigate(['/home/product', product.id]);
      // this.cartService.addItemByBarcode(code);ion

    } catch (err) {
      console.log(err);
    }

  }

  async scanAndPay() {
    try {
      const code = await this.cartService.startScan(0);
      if (!code) {
        this.isToast = true;
        this.toastData = {
          color: 'danger',
          message: 'No BarCode available for the product'
        };
      }
      console.log('code: ', code);
      this.isToast = true;
      this.toastData = {
        color: 'success',
        message: 'Payment Successful'
      }
    } catch (err) {
      console.log(err);
    }
  }
}
