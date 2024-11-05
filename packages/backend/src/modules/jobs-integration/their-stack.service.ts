import { Injectable } from '@nestjs/common';
import { TMatchBase, TResumeBase } from '@redundant/common';
import axios from 'axios';
import { TTheirStackJobsResponse } from './types/TTheirStackJobsResponse';
import { TTechnologyResponse } from './types/TTheirStackTechnologyResponse';
import { TTheirStackJobSearchQuery } from './types/TTheirStackJobSearchQuery';

@Injectable()
export class TheirStackService {
  private readonly apiUrl = 'https://api.theirstack.com/v1';
  private readonly apiKey = process.env.THEIRSTACK_API_KEY;

  async searchJobs(resume: TResumeBase) {
    const query = await this.buildJobQuery(resume);
    const options = {
      method: 'POST',
      url: `${this.apiUrl}/jobs/search`,
      headers: { Authorization: `Bearer ${this.apiKey}` },
      data: {
        ...query,
        page: 0,
        limit: 25,
        blur_company_data: true, // To avoid spending credits
      },
    };

    try {
      const { data } = await axios.request(options);
      return this.convertResponseToMatches({
        resumeId: resume.id,
        jobs: data.data,
      });
    } catch (error) {
      console.error('Error searching jobs:', error);
      throw error;
    }
  }

  private convertResponseToMatches({
    resumeId,
    jobs,
  }: {
    resumeId: string;
    jobs: TTheirStackJobsResponse['data'];
  }): Omit<TMatchBase, 'id'>[] {
    return jobs.map((job) => ({
      integrationId: job.id.toString(),
      companyName: job.company,
      companyUrl: job.company_object.url,
      seniority: job.seniority,
      positionTitle: job.job_title,
      description: job.description,
      longDescription: job.company_object.long_description,
      country: job.country
        ? job.country
        : job.company_object.country
          ? job.company_object.country
          : job.country_code,
      city:
        job.cities.length > 0
          ? job.cities[0]
          : job.company_object.city || job.location,
      applyUrl: job.final_url,
      domain: job.company_object.domain
        ? job.company_object.domain
        : job.company_domain,
      provider: 'TheirStack',
      longitude: job.longitude,
      latitude: job.latitude,
      resumeId,
    }));
  }

  private countryToISO(country: string): string {
    const countryMap: Record<string, string> = {
      germany: 'DE',
      england: 'GB',
      'united kingdom': 'GB',
      uk: 'GB',
      france: 'FR',
      spain: 'ES',
      italy: 'IT',
      netherlands: 'NL',
      poland: 'PL',
      ireland: 'IE',
      // Add more mappings as needed
    };

    const normalizedCountry = country.trim().toLowerCase();
    return countryMap[normalizedCountry] || normalizedCountry.toUpperCase();
  }

  private async buildJobQuery(
    resume: TResumeBase,
  ): Promise<TTheirStackJobSearchQuery> {
    const resumeData = resume.data;
    const query: TTheirStackJobSearchQuery = {
      posted_at_max_age_days: 7, // Required filter
      limit: 25,
      order_by: [
        { desc: true, field: 'date_posted' },
        { desc: true, field: 'discovered_at' },
      ],
    };

    // Location filters
    if (resumeData.personalInfo?.country) {
      query.job_country_code_or = [this.countryToISO(resumeData.personalInfo.country)];
    }

    if (resumeData.personalInfo?.city) {
      query.job_location_pattern_or = [`.*${resumeData.personalInfo.city}.*`];
    }

    // Position/Title filters
    if (resumeData.personalInfo?.positionName) {
      const words = resumeData.personalInfo.positionName
        .toLowerCase()
        .split(/\s+/)
        .filter((word) => word.length > 2);

      if (words.length > 0) {
        query.job_title_pattern_and = words.map((word) => `.*${word}.*`);
      }
    }

    // Skills/Technology filters
    if (resumeData.skills?.length > 0) {
      query.job_technology_slug_or = await this.getSkillSlugs(
        resumeData.skills,
      );
    }

    return query;
  }

  private async getSkillSlugs(skills: string[]) {
    const slugs: string[] = [];

    for (const skill of skills) {
      const options = {
        method: 'GET',
        url: `https://api.theirstack.com/v0/catalog/technologies`,
        params: { name_pattern: skill },
      };

      try {
        const { data } = await axios.request<TTechnologyResponse>(options);
        if (data && data.length > 0) {
          slugs.push(...data.map((tech) => tech.slug));
        }
      } catch (error) {
        console.error(`Error fetching technology slug for ${skill}:`, error);
      }
    }

    return slugs;
  }
}
