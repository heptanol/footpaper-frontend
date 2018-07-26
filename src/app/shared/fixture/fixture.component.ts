import { Component, Input } from '@angular/core';
import {Fixture} from '../model';

@Component({
  selector: 'app-fixture',
  templateUrl: './fixture.component.html',
  styleUrls: ['./fixture.component.scss']
})
export class FixtureComponent {

  @Input() fixture: Fixture;
  constructor() { }

}