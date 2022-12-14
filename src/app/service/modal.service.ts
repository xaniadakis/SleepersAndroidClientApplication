import {Injectable} from '@angular/core';
import {EditPostModalComponent} from "../components/edit-post-modal/edit-post-modal.component";
import {ShowPostModalComponent} from "../components/show-post-modal/show-post-modal.component";
import {ModalController} from "@ionic/angular";
import {PostType} from "../dto/post-type";
import {CreatePostModalComponent} from "../components/create-post-modal/create-post-modal.component";
import {ProposeChangeModalComponent} from "../components/propose-change-modal/propose-change-modal.component";
import {AnnounceEventModalComponent} from "../components/announce-event-modal/announce-event-modal.component";

@Injectable()
export class ModalService {


  constructor(private modalCtrl: ModalController) {
  }

  async openCreatePostModal() {
    const modal = await this.modalCtrl.create({
      component: CreatePostModalComponent,
      componentProps: {postType: PostType[localStorage.getItem("postType") as keyof typeof PostType]},
      // componentProps: ,
      // showBackdrop: false,
      initialBreakpoint: 1,
      backdropBreakpoint: 1,
      backdropDismiss: false,
      canDismiss: true,
      handleBehavior: "cycle",
      handle: true
    });
    modal.present();

    const {data, role} = await modal.onWillDismiss();
  }

  async openAnnounceEventModal() {
    const modal = await this.modalCtrl.create({
      component: AnnounceEventModalComponent,
      // componentProps: ,
      // showBackdrop: false,
      initialBreakpoint: 1,
      backdropBreakpoint: 1,
      backdropDismiss: false,
      canDismiss: true,
      handleBehavior: "cycle",
      handle: true
    });
    modal.present();

    const {data, role} = await modal.onWillDismiss();
  }

  async openProposeChangeModal() {
    const modal = await this.modalCtrl.create({
      component: ProposeChangeModalComponent,
      initialBreakpoint: 1,
      backdropBreakpoint: 1,
      backdropDismiss: false,
      canDismiss: true,
      handleBehavior: "cycle",
      handle: true
    });
    modal.present();

    const {data, role} = await modal.onWillDismiss();
  }

  async openModal(postId: bigint, postImage: string, postText: string, postType: PostType) {
    const modal = await this.modalCtrl.create({
      component: EditPostModalComponent,
      componentProps: {id: postId, image: postImage, text: postText, type: postType},
      // showBackdrop: false,
      initialBreakpoint: 1,
      backdropBreakpoint: 1,
      backdropDismiss: false,
      canDismiss: true,
      handleBehavior: "cycle",
      handle: true
    });
    modal.present();

    const {data, role} = await modal.onWillDismiss();
  }

  async openPostModal(postId: bigint, postImage: string, postText: string, postType: PostType, owner: string, ownerProfilePic: string) {
    console.log("imma show comments");
    const modal = await this.modalCtrl.create({
      component: ShowPostModalComponent,
      componentProps: {id: postId, image: postImage, text: postText, type: postType, owner: owner, ownerProfilePic: ownerProfilePic},
      initialBreakpoint: 1,
      backdropBreakpoint: 1,
      backdropDismiss: false,
      canDismiss: true,
      handleBehavior: "cycle",
      handle: true
    });
    modal.present();

    const {data, role} = await modal.onWillDismiss();
  }


}
