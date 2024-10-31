export type TColumnSort = {
  desc?: boolean;
  field: string;
};

export type TTheirStackJobSearchQuery = {
  // Pagination
  page?: number;
  limit?: number;
  order_by?: TColumnSort[];

  // Job Title Filters
  job_title_or?: string[];
  job_title_not?: string[];
  job_title_pattern_and?: string[];
  job_title_pattern_or?: string[];
  job_title_pattern_not?: string[];

  // Location Filters
  job_country_code_or?: string[];
  job_country_code_not?: string[];
  job_location_pattern_or?: string[];
  job_location_pattern_not?: string[];

  // Date Filters
  posted_at_max_age_days?: number;
  posted_at_gte?: string;
  posted_at_lte?: string;

  // Salary Filters
  min_salary_usd?: number;
  max_salary_usd?: number;

  // Technology Filters
  job_technology_slug_or?: string[];
  job_technology_slug_not?: string[];
  job_technology_slug_and?: string[];

  // Remote/Hybrid
  remote?: boolean;

  // Description Filters
  job_description_pattern_or?: string[];
  job_description_pattern_not?: string[];
  job_description_pattern_is_case_insensitive?: boolean;

  // Company Filters
  company_name_or?: string[];
  company_domain_or?: string[];
  min_employee_count?: number;
  max_employee_count?: number;
  industry_id_or?: number[];
  company_location_pattern_or?: string[];
};
