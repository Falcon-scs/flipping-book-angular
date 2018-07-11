import { Component, Inject, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ProofPage, ProofPhoto } from '../../interfaces/proofing';
import { ApproveService } from '../../services/approve/approve.service';

@Component({
  selector: 'app-approve',
  templateUrl: './approve.component.html',
  styleUrls: ['./approve.component.scss']
})
export class ApproveComponent implements OnInit {

  constructor(
    private approveService: ApproveService,
    public dialogRef: MatDialogRef<ApproveComponent, ProofPage>,
    @Inject(MAT_DIALOG_DATA) public data: ProofPage
  ) { }

  ngOnInit() {
  }

  cancel() {
    this.dialogRef.close();
  }
  confirm() {
    this.approveService.sendApprove().subscribe(
      (res) => {
        console.log('Approved')
      },
      (err) => {
        console.log("Approve Error")
      }
    );
    this.dialogRef.close();
  }


}
