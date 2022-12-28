import {Component} from '@angular/core';
import {PostType} from "../../dto/post-type";

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  postType: PostType = PostType.CAR;

  postPlaceholder: string = "Send it dude . .";

  constructor() {
  }

  ngOnInit() {
  }
}
