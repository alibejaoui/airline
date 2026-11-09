import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
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

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'explorer', component: ExplorerComponent },
  { path: 'reserver', component: ReserverComponent },
  { path: 'experience', component: ExperienceComponent },
  { path: 'club', component: ClubComponent },
  { path: 'aller-simple', component: AllerSimpleComponent },
  { path: 'multi-destinations', component: MultiDestinationsComponent },
  { path: 'inscription', component: InscriptionComponent },
  { path: 'join', component: JoinComponent },
  { path: 'connexion', component: ConnexionComponent },
  { path: 'help', component: HelpComponent },
  { path: 'flight/:id', component: FlightDetailComponent },
  { path: 'payment', component: PaymentComponent },
  { path: 'account', component: AccountComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
