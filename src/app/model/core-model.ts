/* point transfer */
export interface TransferPoint {
  email: string;
  credits: number
}

export interface DialogImage {
  title: string;
  text: string;
  image: string;
  width: string;
  height: string;
  confirmButtonText: string;
}

export interface ScreenSize {
  width:string;
  height:string;
}

export type Device = "Mobile" | "Tablet" | "Desktop"
