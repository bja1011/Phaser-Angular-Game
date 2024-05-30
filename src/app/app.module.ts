import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BjaGameModule } from './bja-game/bja-game.module';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, AppRoutingModule, BjaGameModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}


