import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { mock_svg } from 'src/app/shared/mocks/image-mock';
import { ImageService } from 'src/app/shared/services/image.service';

@Component({
  selector: 'app-flex-dialog',
  templateUrl: './flex-dialog.component.html',
  styleUrls: ['./flex-dialog.component.scss'],
})
export class FlexDialogComponent implements OnInit {
  public text = null;
  public icon = null;
  public iconColor = null;
  test = null
  svgData
  constructor(
    private dialogRef: MatDialogRef<FlexDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _image: ImageService,
    private iconRegistry : MatIconRegistry,
    private sanitizer: DomSanitizer
  ) {

    this.text = data.text;
    this.iconColor = data.icon_color;

    this.iconRegistry.getNamedSvgIcon(data.icon).subscribe(
      resp => {
        if(resp) {
          // Convert svg object to string
          const serializer = new XMLSerializer()
          const svgString = serializer.serializeToString(resp)

          // Safe svg
          this.safeSVG(svgString)
        }
      }
    )
  }

  ngOnInit(): void {}

  /** Convert svg to Safe svg to display on HTML. */
  safeSVG(svgString: string) {
    this.svgData = this.sanitizer.bypassSecurityTrustResourceUrl('data:image/svg+xml;charset=utf8,' + encodeURIComponent(svgString));
  }

  onCancel() {
    this.dialogRef.close(false);
  }

  onConfirm() {
    this.dialogRef.close(true);
  }
}
