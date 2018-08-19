import {Component, OnInit, Input} from '@angular/core';
import {PlayerComponent} from '../player/player.component'

@Component({
    selector: 'app-input',
    templateUrl: './input.component.html',
    styleUrls: ['./input.component.css']
})
export class InputComponent implements OnInit {

    @Input() player: PlayerComponent;

    populateText(value) {
        this.player.populateText(value);
    }

    constructor() {}

    ngOnInit() {
    }

}
