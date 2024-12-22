export type ImageData = {
    uri: string;
    type?: string;
    source?: 'camera' | 'gallery';
    width?: number;
    height?: number;
    fileName?: string;
    fileSize?: number;
  };
  
  export type CropData = {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  
  export type Position = {
    x: number;
    y: number;
  };
  