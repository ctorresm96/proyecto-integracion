import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularMaterialComponents } from 'src/assets/material';
import { BoletasComponent } from './boletas/boletas.component';
import { FacturasComponent } from './facturas/facturas.component';
import { HttpClientModule } from '@angular/common/http';
import { ModalDetalleComponent } from './modal-detalle/modal-detalle.component';

@NgModule({
  declarations: [
    AppComponent,
    BoletasComponent,
    FacturasComponent,
    ModalDetalleComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AngularMaterialComponents,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [ModalDetalleComponent]
})
export class AppModule { }
