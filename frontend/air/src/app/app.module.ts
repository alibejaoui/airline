import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { ExplorerComponent } from './pages/explorer/explorer.component';
import { ReserverComponent } from './pages/reserver/reserver.component';
import { ExperienceComponent } from './pages/experience/experience.component';
import { ClubComponent } from './pages/club/club.component';
import { AllerSimpleComponent } from './pages/allersimple/allersimple.component';
import { MultiDestinationsComponent } from './pages/multidestinations/multidestinations.component';
import { InscriptionComponent } from './inscription/inscription.component';
import { ConnexionComponent } from './connexion/connexion.component';
import { FlightDetailComponent } from './flight-detail/flight-detail.component';
import { JoinComponent } from './join/join.component';
import { HelpComponent } from './pages/help/help.component';
import { PaymentComponent } from './payment/payment.component';
import { AccountComponent } from './account/account.component';
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ExplorerComponent,
    ReserverComponent,
    ExperienceComponent,
    ClubComponent,
    AllerSimpleComponent,
    MultiDestinationsComponent,
    InscriptionComponent,
    ConnexionComponent,
    FlightDetailComponent,
    JoinComponent,
    HelpComponent,
    PaymentComponent,
    AccountComponent
  ],
  imports: [BrowserModule, AppRoutingModule, FormsModule, HttpClientModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
