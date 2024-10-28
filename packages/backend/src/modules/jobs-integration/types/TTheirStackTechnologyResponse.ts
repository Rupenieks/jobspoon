export type TTechnologyResponse = Array<{
  name: string;
  category: string;
  slug: string;
  category_slug: string;
  parent_category: string;
  parent_category_slug: string;
  logo: string;
  logo_thumbnail: string;
  one_liner: string;
  url: string;
  description: string;
  jobs: number;
  companies: number;
  companies_found_last_week: number;
}>;
