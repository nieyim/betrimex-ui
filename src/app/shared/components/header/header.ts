import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-header',
  imports: [CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  now = new Date();
   constructor() {
    setInterval(() => (this.now = new Date()), 1000);
  }
}
