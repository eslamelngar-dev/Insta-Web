export interface SiteData {
  id?: string;
  user_id?: string;
  username: string;
  title: string;
  bio: string;
  primary_color: string;
  template_id: string;
  profile_image?: string;
  links?: { platform: string; url: string }[];
}