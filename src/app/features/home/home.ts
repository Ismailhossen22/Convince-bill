import { Component, computed, input } from '@angular/core';
import { LoginData } from '../../shared/class/login_data';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  user = computed<LoginData>(() => history.state.userInfo);
}
