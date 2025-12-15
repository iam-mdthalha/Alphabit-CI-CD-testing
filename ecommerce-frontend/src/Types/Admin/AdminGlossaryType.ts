export interface Glossary {
  id: number;
  date: string;
  title: string;
  venue: string;

  address: string;
  city: string;
  state: string;
  country: string;
  pin: string;

  imagesPreviewUrls: string[];
  imageFileNames?: string[];
  imageFiles?: File[];

  highlightTitle1?: string;
  highlightDesc1?: string;
  highlightTitle2?: string;
  highlightDesc2?: string;
  highlightTitle3?: string;
  highlightDesc3?: string;
  highlightTitle4?: string;
  highlightDesc4?: string;
  highlightTitle5?: string;
  highlightDesc5?: string;
  highlightTitle6?: string;
  highlightDesc6?: string;
  highlightTitle7?: string;
  highlightDesc7?: string;
  highlightTitle8?: string;
  highlightDesc8?: string;
}
