import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {NgbModule} from '@ng-bootstrap/ng-bootstrap'

import {AppComponent} from './app.component';
import {PlayerComponent} from './player/player.component';
import { InputComponent } from './input/input.component';

@NgModule({
    declarations: [
        AppComponent,
        PlayerComponent,
        InputComponent
    ],
    imports: [
        NgbModule,
        BrowserModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {}
