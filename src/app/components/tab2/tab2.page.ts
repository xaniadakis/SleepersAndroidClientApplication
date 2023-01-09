import {Component} from '@angular/core';
import {PostType} from "../../dto/post-type";
import {SharedService} from "../../service/shared.service";

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  postType: PostType = PostType.CAR;
  nonUserPosts: bigint = BigInt(-1);
  postPlaceholder: string = "Send it dude . .";

  constructor(private sharedService: SharedService) {
  }

  ngOnInit() {
    this.sharedService.checkingPosts(this.postType);
  }
}
