import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import * as JsBarcode from 'jsbarcode';
import { products } from 'src/app/data/products';
import { AnimationController, Animation, Gesture, GestureController } from '@ionic/angular';
@Component({
  selector: 'app-products',
  templateUrl: './products.page.html',
  styleUrls: ['./products.page.scss'],
})
export class ProductsPage implements OnInit {
  items: any[] = [];
  itemModel: any = {};
  showBarcode = false;
  currency = 'Rs';
  constructor(private router: Router, private animationCtrl: AnimationController, private gestureCtrl: GestureController) {}

  ngOnInit() {
    this.items = [...products];
  }

  getBarcodeData(item: any) {
    this.itemModel = { ...item };
    this.showBarcode = true;

    setTimeout(() => {
      this.getBarcode(item.barcode);
    }, 500);
  }

  getBarcode(barcode: string) {
    JsBarcode('#barcode', barcode, {
      // format: "pharmacode",
      lineColor: "#0aa",
      width: 4,
      height: 200,
      displayValue: false
    });
  }

  NavigateToDetails(id: number) {
    this.router.navigate(['/home/product', id]);
  }

  enterAnimation = (baseEl: HTMLElement) => {
    const root = baseEl.shadowRoot;

    const backdropAnimation = this.animationCtrl
      .create()
      .addElement(root!.querySelector('ion-backdrop')!)
      .fromTo('opacity', '0.01', 'var(--backdrop-opacity)');

    const wrapperAnimation = this.animationCtrl
      .create()
      .addElement(root!.querySelector('.modal-wrapper')!)
      .keyframes([
        { offset: 0, opacity: '0', transform: 'scale(0)' },
        { offset: 1, opacity: '0.99', transform: 'scale(1)' },
      ]);

    return this.animationCtrl
      .create()
      .addElement(baseEl)
      .easing('ease-out')
      .duration(500)
      .addAnimation([backdropAnimation, wrapperAnimation]);
  };

  leaveAnimation = (baseEl: HTMLElement) => {
    return this.enterAnimation(baseEl).direction('reverse');
  };

}
