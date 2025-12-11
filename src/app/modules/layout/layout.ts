import { Component } from '@angular/core';
import { Sidebar } from '../../shared/components/sidebar/sidebar';
import { RouterModule } from "@angular/router";

@Component({
  selector: 'app-layout',
  imports: [Sidebar, RouterModule],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
})
export class Layout {

}
