import {Component} from '@angular/core';
import {PostType} from "../../dto/post-type";
import {SharedService} from "../../service/shared.service";

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss', '../tab2/tab2.page.scss']
})
export class Tab3Page {

  postPlaceholder: string = "Whatz crackalackin pimpalimpin?";
  postType: PostType = PostType.STORY;
  nonUserPosts: bigint = BigInt(-1);

  constructor(private sharedService: SharedService) {
  }

  ngOnInit() {
    this.sharedService.checkingPosts(this.postType);
  }
}
