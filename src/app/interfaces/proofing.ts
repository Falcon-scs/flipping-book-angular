export enum PageType {
  SINGLE,
  DOUBLE
}

export interface ProofConfig {
    uid: string;
    name: string;
    revision: number;
    url: string;
    coverPhoto: ProofPhoto;
    width: number;
    height: number;
    pageType: PageType;
    startPageType: PageType;
    endPageType: PageType;
}

export interface ProofPage {
    index: number;
    type: PageType;
    thumbnail: string;
    pages: string[];
    photos: ProofPhoto[];
}

export interface ProofPhoto {
    uid: string;
    name: string;
    sizes: ProofPhotoSize[];
    selected: boolean;
}

export interface ProofPhotoSize {
    width: number;
    height: number;
    fileName: string;
}

export interface ProofProject {
    config: ProofConfig;
    pages: ProofPage[];
}
