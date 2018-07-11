import { Component, Inject, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ProofChangeType, ProofChange, ProofChangeStatus } from '../../interfaces/changes';
import { ProofPage, ProofPhoto } from '../../interfaces/proofing';
import { ChangeService } from '../../services/change/change.service';
import { MainService } from '../../services/main/main.service';
import { FormControl, Validators } from '@angular/forms';


@Component({
  selector: 'app-request-changes',
  templateUrl: './request-changes.component.html',
  styleUrls: ['./request-changes.component.scss']
})
export class RequestChangesComponent implements OnInit {

  private PAGE_OPTIONS = [
    'Switch left and right pages',
    'Change photos disposition',
    'Change background',
    'Delete'
  ];

  private PHOTO_OPTIONS = [
    'Edit',
    'Replace',
    'Delete'
  ];

  @ViewChild('message') message: ElementRef;

  leftPageIndex: number;
  rightPageIndex: number;
  error = '';
  requestStep = 1;
  changeTitle: string;
  changeThumbUrl: string;
  changeActions: string[];

  requestData: ProofChange = {
    type : -1,
    status: ProofChangeStatus.PENDING,
    action: '',
    thumbnail: '',
    message: ''
  };

  actionFormControl = new FormControl('action', [Validators.required]);

  constructor(
    private changeService: ChangeService,
    public mainService: MainService,
    public dialogRef: MatDialogRef<RequestChangesComponent, ProofPage>,
    @Inject(MAT_DIALOG_DATA) public data: ProofPage
  ) {
    this.leftPageIndex = (data.index + 1) * 2 - 1;
    this.rightPageIndex = (data.index + 1) * 2;
    this.data.photos.forEach(p => p.selected = false);
  }

  ngOnInit() {
  }

  selectPhoto(photo: ProofPhoto) {
    this.requestData.type = 1;
    this.data.photos.forEach(p => p.selected = p === photo);
    this.error = '';
  }

  selectPage() {
    this.requestData.type = 0;
    this.data.photos.forEach(p => p.selected = false);
    this.error = '';
  }

  next() {
    if (this.requestStep === 1) {
      this.error = '';
      this.requestData.action = '';

      if (this.requestData.type === ProofChangeType.PAGE) {
        this.requestData.thumbnail = this.data.thumbnail;
        this.changeTitle =  'pages ' + this.leftPageIndex + ' - ' + this.rightPageIndex;
        this.changeThumbUrl = this.mainService.pagesUrl + this.requestData.thumbnail;
        this.changeActions = this.PAGE_OPTIONS;
        this.requestStep++;
      } else if (this.requestData.type === ProofChangeType.PHOTO && this.data.photos.some(p => p.selected)) {
        const selectedPhoto = this.data.photos.find(p => p.selected);
        this.requestData.thumbnail = selectedPhoto.name;
        this.changeTitle = selectedPhoto.name;
        this.changeThumbUrl = this.mainService.photosUrl + selectedPhoto.sizes[0].fileName;
        this.changeActions = this.PHOTO_OPTIONS;
        this.requestStep++;
      } else {
        this.error = 'Please select the page or one of the photos.';
      }
    } else if (this.requestStep === 2) {
      this.requestConfirm();
    }
  }

  back() {
    this.error = '';
    this.requestStep--;
  }

  cancel() {
    this.dialogRef.close();
  }

  requestConfirm() {
    if (this.requestData.action === undefined || !this.requestData.action.length) {
      this.error = 'Please select the action.';
      return;
    } else {
      this.error = '';
    }

    this.requestData.message = this.message.nativeElement.value;

    console.log(this.requestData);

    this.changeService.sendChange(this.requestData)
      .subscribe(
        (res) => {
          console.log('Request result', res);
          this.dialogRef.close(res);
        },
        (err) => {
          this.error = 'Error requesting change. Please try again.';
        }
      );
  }

}
