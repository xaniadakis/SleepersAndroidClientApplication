import {Component} from '@angular/core';
import {PostType} from "../../dto/post-type";

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab4.page.html',
  styleUrls: ['tab4.page.scss', '../tab2/tab2.page.scss']
})
export class Tab4Page {

  postPlaceholder: string = "Whatz crackalackin pimpalimpin?";
  postType: PostType = PostType.STORY;
  nonUserPosts: bigint = BigInt(-1);

  constructor() {
  }

  ngOnInit() {
  }
}
