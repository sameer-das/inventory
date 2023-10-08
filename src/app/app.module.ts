import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutComponent } from './layout/layout.component';
import { LoginComponent } from './login/login.component';
import { MaterialModule } from './material.module';
import { HeaderComponent } from './layout/header/header.component';
import { HaveSubmenuDirective, SidebarComponent } from './layout/sidebar/sidebar.component';
import { LoaderComponent } from './loader/loader.component';
import { AlertComponent } from './popups/alert/alert.component';

@NgModule({
  declarations: [
    AppComponent,
    LayoutComponent,
    LoginComponent,
    HeaderComponent,
    SidebarComponent,
    HaveSubmenuDirective,
    LoaderComponent,
    AlertComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MaterialModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
