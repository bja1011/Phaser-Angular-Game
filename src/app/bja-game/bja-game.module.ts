import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayGameComponent } from './componens/play-game/play-game.component';

@NgModule({
  declarations: [PlayGameComponent],
  imports: [CommonModule],
  exports: [PlayGameComponent],
})
export class BjaGameModule {}
