import { DecimalPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { PaymentSheetEventsEnum, Stripe } from '@capacitor-community/stripe';
import { AnimationController, IonModal } from '@ionic/angular';
import { QRCodeModule } from 'angularx-qrcode';
import { first, lastValueFrom, Subscription } from 'rxjs';
import { CartService } from 'src/app/services/cart/cart.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})
export class CartPage implements OnInit, OnDestroy {
  @ViewChild('proceedBtn', { read: ElementRef }) proceedBtn!: ElementRef;
  @ViewChild('payBtn', { read: ElementRef }) payBtn!: ElementRef;
  model: any = null;
  cartSub!: Subscription;
  currency = '₹';
  isQrPay = false;
  isToast = false;
  toastData: any = {};

  data: any = {};

  private cartService = inject(CartService);

  constructor(private animationCtrl: AnimationController, private http: HttpClient) {
    Stripe.initialize({
      publishableKey: environment.stripe.publishablekey,
    });
  }

  ngOnInit() {
    this.cartSub = this.cartService.cart.subscribe({
      next: (cart) => {
        console.log(cart);
        this.model = cart;
        this.data = {
          name: 'Wasiq',
          email: 'dummymail@gmail.com',
          amount: this.model.grandTotal,
          currency: 'usd'
        };

      },
    });
  }

  async startScan() {
    try {
      const code = await this.cartService.startScan();
      this.cartService.addItemByBarcode(code);
    } catch (e) {
      console.log(e);
    }
  }

  addQuantity(item: any) {
    this.cartService.addQuantity({ ...item, id: item?.item_id });
  }

  subtractQuantity(item: any) {
    this.cartService.subtractQuantity({ ...item, id: item?.item_id });
  }

  async pay(modal: IonModal) {
    const cartAnimation = this.animationCtrl.create('cart-animation')
      .addElement(this.payBtn.nativeElement)
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
    try {
      const code = await this.cartService.startScan(0);
      console.log(code);
      if (!code) {
        this.isToast = true;
        this.toastData = {
          color: 'danger',
          message: 'Error! Please try again',
        };
        return;
      }

      this.isToast = true;
      this.toastData = {
        color: 'success',
        message: 'Payment successful',
      };
      modal.dismiss();

      // clear cart
      this.cartService.clearCart();
    } catch (e) {
      console.log(e);
    }
  }

  DeleteItem(item: any) {
    console.log('item to delete = ', item)
    this.cartService.subtractItem({ ...item, id: item?.item_id });
  }

  AnimateButton() {
    const cartAnimation = this.animationCtrl.create('cart-animation')
      .addElement(this.proceedBtn.nativeElement)
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
  }
  ngOnDestroy(): void {
    if (this.cartSub) this.cartSub.unsubscribe();
  }

  async paymentSheet() {
    try {
      Stripe.addListener(PaymentSheetEventsEnum.Completed, () => {
        console.log('PaymentSheetEventsEnum.Completed');
      });
      const data$ = this.httpPost(this.data);
      const { paymentIntent, ephemeralKey, customer } = await lastValueFrom(data$);

      console.log('paymentIntent: ', paymentIntent);
      await Stripe.createPaymentSheet({
        paymentIntentClientSecret: paymentIntent,
        customerId: customer,
        customerEphemeralKeySecret: ephemeralKey,
        merchantDisplayName: 'Technyks'
      });

      console.log('createPaymentSheet');
      // present PaymentSheet and get result.
      const result = await Stripe.presentPaymentSheet();
      console.log('result: ', result);
      if (result && result.paymentResult === PaymentSheetEventsEnum.Completed) {
        // Happy path
        this.splitAndJoin(paymentIntent);
        this.isToast = true;
        this.toastData = {
          color: 'success',
          message: 'Payment Successful'
        }

        this.cartService.clearCart();

      }
    } catch (e) {
      console.log(e);
    }
  }

  httpPost(body: any) {
    return this.http.post<any>(environment.api + 'payment-sheet', body).pipe(first());
  }


  splitAndJoin(paymentIntent: string) {

    const result = paymentIntent.split('_').slice(0, 2).join('_');
    console.log('result = ', result);
    return result;
  }
}
