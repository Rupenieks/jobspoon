import { Injectable } from '@nestjs/common';
import { TMatch, TResume } from '@redundant/common';
import axios from 'axios';
import { TheirStackMockResponse } from './mockData/TheirStackMockJobs';
import { TTheirStackJobsResponse } from './types/TTheirStackJobsResponse';

@Injectable()
export class TheirStackService {
  private readonly apiUrl = 'https://api.theirstack.com/v1';
  private readonly apiKey = process.env.THEIRSTACK_API_KEY;

  async searchJobs(resume: TResume) {
    return this.convertResponseToMatches({
      resumeId: resume.id,
      jobs: TheirStackMockResponse.data,
    });
    const query = this.buildJobQuery(resume);
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
      return data;
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
  }): Omit<TMatch, 'id'>[] {
    return jobs.map((job) => ({
      integrationId: job.id.toString(),
      companyName: job.company,
      companyUrl: job.company_object.url,
      seniority: job.seniority,
      positionTitle: job.job_title,
      description: job.description,
      longDescription: job.company_object.long_description,
      country: job.country,
      city: job.cities[0] || '',
      applyUrl: job.final_url,
      provider: 'TheirStack',
      resumeId,
    }));
  }

  private buildJobQuery(resume: TResume) {
    const query: any = {
      posted_at_max_age_days: 7, // Required filter
    };

    if (resume.country) {
      query.job_country_code_or = [resume.country];
    }

    if (resume.skills && resume.skills.length > 0) {
      query.job_technology_slug_or = this.getSkillSlugs(resume.skills);
    }

    return query;
  }

  private async getSkillSlugs(skills: string[]) {
    const slugs = [];
    for (const skill of skills) {
      const slug = await this.getTechnologySlug(skill);
      if (slug) {
        slugs.push(slug);
      }
    }
    return slugs;
  }

  private async getTechnologySlug(skillName: string) {
    const options = {
      method: 'GET',
      url: `${this.apiUrl}/catalog/technologies`,
      params: { name_pattern: skillName },
    };

    try {
      const { data } = await axios.request(options);
      if (data.technologies && data.technologies.length > 0) {
        return data.technologies[0].slug;
      }
    } catch (error) {
      console.error(`Error fetching technology slug for ${skillName}:`, error);
    }

    return null;
  }
}
