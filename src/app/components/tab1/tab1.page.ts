import {Component} from '@angular/core';
import {PostType} from "../../dto/post-type";

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss', '../tab2/tab2.page.scss']
})

export class Tab1Page {

  postType: PostType = PostType.ART;
  nonUserPosts: bigint = BigInt(-1);
  postPlaceholder: string = "Post some art. . .";
  poem1: string = "What happens to a dream deferred?\n" +
    "\n" +
    "      Does it dry up\n" +
    "      like a raisin in the sun?\n" +
    "      Or fester like a sore—\n" +
    "      And then run?\n" +
    "      Does it stink like rotten meat?\n" +
    "      Or crust and sugar over—\n" +
    "      like a syrupy sweet?\n" +
    "\n" +
    "      Maybe it just sags\n" +
    "      like a heavy load.\n" +
    "\n" +
    "      Or does it explode?";

  constructor() {
  }

  ngOnInit() {
  }
}
