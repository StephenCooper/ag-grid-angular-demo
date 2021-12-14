import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AgGridModule } from 'ag-grid-angular';
import 'ag-grid-enterprise';
import { AppComponent } from './app.component';
import { VolumeRendererComponent } from './volume-renderer/volume-renderer.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSliderModule } from '@angular/material/slider';

@NgModule({
  declarations: [
    AppComponent,
    VolumeRendererComponent,
  ],
  imports: [
    MatSliderModule,
    BrowserModule,
    AgGridModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
