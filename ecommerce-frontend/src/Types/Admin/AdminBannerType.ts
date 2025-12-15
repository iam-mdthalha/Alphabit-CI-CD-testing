export interface BannerMstDTO {
  plant: string;
  id: number;
  bannerDescription: string | null;
  bannerLnNo: number;
  title: string | null;
  content: string | null;
  buttonText: string | null;
  link: string | null;
  image: string;
  image2: string;
  bannerPath: string | null;
  bannerPathTwo: string | null;
  bannerUrl: string | null;
  crAt: string | null;
  crBy: string | null;
  upAt: string | null;
  upBy: string | null;
}

export interface BannerAdminRequestDTO {
  buttonText: string;
  content: string;
  description: string;
  link: string;
  lnNo: number;
  title: string;
}

export interface UpdatedBanner {
  bannerDescription: string;
  bannerLnNo: number;
  bannerPath: string;
  bannerUrl: string;
  buttonText: string;
  content: string;
  crAt: string;
  crBy: string;
  id: number;
  link: string;
  plant: string;
  title: string;
  upAt: string;
  upBy: string;
}

export interface BannerWithoutBytesDTO {
  plant: string;
  id: number;
  bannerPath: string | null;
  bannerPathTwo: string | null;
  bannerDescription: string | null;
  bannerUrl: string | null;
  bannerLnNo: number;
  title: string | null;
  content: string | null;
  buttonText: string | null;
  link: string | null;
  crAt: string | null;
  crBy: string | null;
  upAt: string | null;
  upBy: string | null;
}
