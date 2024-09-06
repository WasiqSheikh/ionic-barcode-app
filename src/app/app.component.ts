import { Component } from '@angular/core';
import { addIcons } from 'ionicons';
import { cartOutline } from 'ionicons/icons';
import { register } from 'swiper/element/bundle';
register();
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor() {
    this.addAllIcons()
  }

  addAllIcons() {
    addIcons({
      cartOutline
    })
  }
}
