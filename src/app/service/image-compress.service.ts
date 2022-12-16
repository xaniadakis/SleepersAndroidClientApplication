import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {GetAllPostsResponse} from '../dto/get-all-posts-response';
import {Observable} from 'rxjs';
import {CreatePostResponse} from "../dto/create-post-response";
import {GlobalConstants} from "../util/global-constants";
import {GetCommentsResponse, GetReactionsResponse, ReactionEnum} from "../dto/get-post-response";
import {ModifyPostResponse} from "../dto/modify-post-response";
import {PostType} from "../dto/post-type";
import {NgxImageCompressService} from "ngx-image-compress";

@Injectable()
export class ImageCompressService {


  constructor(private imageCompress: NgxImageCompressService) {
  }


  imgResult: string = "";

  public compressFileWithAlgorithm() {
    const MAX_MEGABYTE = 0.5;
    this.imageCompress
      .uploadAndGetImageWithMaxSize(MAX_MEGABYTE) // this function can provide debug information using (MAX_MEGABYTE,true) parameters
      .then(
        (result: string) => {
          this.imgResult = result;
          console.error('img size: ', this.imageCompress.byteCount(result)/1000000, 'MB')

        },
        (result: string) => {
          console.error('The compression algorithm didn\'t succed! The best size we can do is', this.imageCompress.byteCount(result), 'bytes')
          this.imgResult = result;
        });
  }

  public compressFile() {
    this.imageCompress.uploadFile().then(
      ({image, orientation}) => {

        // this.imgResultBeforeCompression = image;
        console.log("Size in bytes of the uploaded image was:",this.imageCompress.byteCount(image)/1000000, 'MB');

        this.imageCompress
          .compressFile(image, orientation, 50, 50) // 50% ratio, 50% quality
          .then(
            (compressedImage) => {
              this.imgResult = compressedImage;
              console.log("Size in bytes after compression is now:",this.imageCompress.byteCount(compressedImage)/1000000, 'MB');
              return compressedImage;
            }
          );
      }
    );
  }

}
