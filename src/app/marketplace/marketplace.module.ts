import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarketplaceRoutingModule } from './marketplace-routing.module';
import { MarketplaceComponent } from './marketplace.component';
import { SharedModule } from '../shared/shared.module';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MarketplaceV3Component } from './components/marketplace-v3/marketplace-v3.component';
import { ContactBuyDialogComponent } from './dialog/contact-buy-dialog/contact-buy-dialog.component';
import { ContactCreateDialogComponent } from './dialog/contact-create-dialog/contact-create-dialog.component';
import { AddCartComponent } from './components/add-cart/add-cart.component';

/** library modules is only use on the specific module  */
const modules = [MatAutocompleteModule];

@NgModule({
  declarations: [
    MarketplaceComponent,
    AddCartComponent,
    MarketplaceV3Component,
    ContactBuyDialogComponent,
    ContactCreateDialogComponent,
  ],
  imports: [CommonModule, MarketplaceRoutingModule, SharedModule].concat(
    modules,
  ),
})
export class MarketplaceModule {}
