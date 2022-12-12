import {Component, Input} from '@angular/core';

import { ModalController } from '@ionic/angular';
import {GlobalConstants} from "../../util/global-constants";
import {NgForm} from "@angular/forms";
import {PostService} from "../../service/post.service";

@Component({
  selector: 'app-edit-post-modal',
  templateUrl: 'edit-post-modal.component.html',
  styleUrls: ['./edit-post-modal.component.scss','../tab2/tab2.page.scss']

})
export class EditPostModalComponent {
  imageApi: string = GlobalConstants.APIURL + "/file/image?filename=";
  name: string;
  imageSrc: string | ArrayBuffer | null;

  @Input("image") image: string;
  @Input("image") text: string;

  editPostForm = {
    text: '',
    image: ''
  };

  constructor(private modalCtrl: ModalController
    , private postService: PostService) {}

  ngOnInit() {
    //print 123
    console.log(this.image);
    //print 234
    console.log(this.text);
    this.postService.findImage(this.image).subscribe(data => {
      const file = data;
      this.editPostForm.image = file.name;
      const reader = new FileReader();
      reader.onload = e => this.imageSrc = reader.result;
      reader.readAsDataURL(file);
      console.log(event);
    });
  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  confirm() {
    return this.modalCtrl.dismiss(this.name, 'confirm');
  }

  notEmpty(string: string){
    if(string==null || string.trim().length === 0)
      return false;
    else
      return true;
    // console.log("image: '"+string+"' = "+value);
  }

  onFileChanged(event: any): void {
    const file = event.target.files[0];
    this.editPostForm.image = file;
    const reader = new FileReader();
    reader.onload = e => this.imageSrc = reader.result;
    reader.readAsDataURL(file);
    console.log(event);
  }

  onModify(form: NgForm){

  }
}
