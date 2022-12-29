import {Component, OnInit} from '@angular/core';
import {SharedService} from "../../service/shared.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  private name: string | null = localStorage.getItem("name");
  private profilePicado: string | null = localStorage.getItem("profilePic");

  constructor(private sharedService: SharedService) {
  }

  handleRefresh(event: any) {
    setTimeout(() => {
      console.log("gotta refresh");
      // location.reload();
      this.sharedService.refreshed();
      event.target.complete();
    }, 500);
  };

  ngOnInit() {
    console.log('Initializing PostsPage');
  }
}
