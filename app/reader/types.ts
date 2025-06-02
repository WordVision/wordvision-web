export interface BookDetails {
  title: string;
  filename: string;
}

export interface BookSelection {
  text: string;
  location: string;
}

export interface Visualization extends BookSelection {
  id: number;
  img_url: string;
  img_prompt: string;
}

export interface Position {
  top: number;
  left: number;
}

export interface Coordinates {
  x: number;
  y: number
}
