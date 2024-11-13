import { Injectable, Logger } from '@nestjs/common';
import { TMatchBase, TResumeBase } from '@redundant/common';
import axios from 'axios';
import { TTheirStackJobsResponse } from './types/TTheirStackJobsResponse';
import { TTechnologyResponse } from './types/TTheirStackTechnologyResponse';
import { TTheirStackJobSearchQuery } from './types/TTheirStackJobSearchQuery';

@Injectable()
export class TheirStackService {
  private readonly apiUrl = 'https://api.theirstack.com/v1';
  private readonly apiKey = process.env.THEIRSTACK_API_KEY;
  private readonly logger = new Logger(TheirStackService.name);

  async searchJobs(resume: TResumeBase) {
    const query = await this.buildJobQuery(resume);

    this.logger.log(
      `Searching jobs for resume ${resume.id} in ${query.job_country_code_or?.[0]} - ${query.job_location_pattern_or?.[0] || 'no city'}`,
    );
    this.logger.debug('Job search query:', query);

    const options = {
      method: 'POST',
      url: `${this.apiUrl}/jobs/search`,
      headers: { Authorization: `Bearer ${this.apiKey}` },
      data: {
        ...query,
        page: 0,
        limit: 25,
        blur_company_data: true,
      },
    };

    try {
      const { data } = await axios.request(options);
      const matches = this.convertResponseToMatches({
        resumeId: resume.id,
        jobs: data.data,
      });

      this.logger.log(`Found ${matches.length} jobs for resume ${resume.id}`);
      this.logger.debug(
        `Job titles found: ${matches.map((m) => m.positionTitle).join(', ')}`,
      );

      return matches;
    } catch (error) {
      this.logger.error(
        `Error searching jobs for resume ${resume.id}: ${error.message}`,
        error.stack,
      );
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
    this.logger.debug(`Converting ${jobs.length} jobs to matches`);
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
      datePosted: job.date_posted,
      hybrid: job.hybrid,
      remote: job.remote,
      salary: job.salary_string,
      reposted: job.reposted,
      dateReposted: job.date_reposted,
      hiringTeam: job.hiring_team?.map((member) => ({
        firstName: member.first_name,
        fullName: member.full_name,
        linkedinUrl: member.linkedin_url,
        role: member.role,
        imageUrl: member.image_url,
      })),
      company: {
        name: job.company_object.name,
        domain: job.company_object.domain,
        industry: job.company_object.industry,
        country: job.company_object.country,
        countryCode: job.company_object.country_code,
        employeeCount: job.company_object.employee_count,
        logo: job.company_object.logo,
        url: job.company_object.url,
        linkedinUrl: job.company_object.linkedin_url,
        foundedYear: job.company_object.founded_year,
        annualRevenue: job.company_object.annual_revenue_usd,
        totalFunding: job.company_object.total_funding_usd,
        employeeCountRange: job.company_object.employee_count_range,
        description: job.company_object.long_description,
        city: job.company_object.city,
        technologies: job.company_object.technology_names,
      },
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
      posted_at_max_age_days: 7,
      limit: 25,
      order_by: [
        { desc: true, field: 'date_posted' },
        { desc: true, field: 'discovered_at' },
      ],
    };

    this.logger.debug(`Building job query for resume ${resume.id}`);

    // Location filters
    if (resumeData.personalInfo?.country) {
      const countryCode = this.countryToISO(resumeData.personalInfo.country);
      query.job_country_code_or = [countryCode];
      this.logger.debug(
        `Added country filter: ${resumeData.personalInfo.country} (${countryCode})`,
      );
    }

    if (resumeData.personalInfo?.city) {
      query.job_location_pattern_or = [resumeData.personalInfo.city];
      this.logger.debug(`Added city filter: ${resumeData.personalInfo.city}`);
    }

    // Position/Title filters
    if (resumeData.personalInfo?.positionName) {
      const words = resumeData.personalInfo.positionName
        .toLowerCase()
        .split(/\s+/)
        .filter((word) => word.length > 2);

      if (words.length > 0) {
        query.job_title_pattern_and = words;
        this.logger.debug(`Added job title filters: ${words.join(', ')}`);
      }
    }

    // Skills/Technology filters
    if (resumeData.skills?.length > 0) {
      this.logger.debug(
        `Finding technology slugs for ${resumeData.skills.length} skills`,
      );
      query.job_technology_slug_or = await this.getSkillSlugs(
        resumeData.skills,
      );
      this.logger.log(
        `Found ${query.job_technology_slug_or.length} technology slugs for ${resumeData.skills.length} skills`,
      );
    }

    return query;
  }

  private async getSkillSlugs(skills: string[]) {
    const slugs: string[] = [];
    this.logger.debug(
      `Getting technology slugs for skills: ${skills.join(', ')}`,
    );

    for (const skill of skills) {
      const options = {
        method: 'GET',
        url: `https://api.theirstack.com/v0/catalog/technologies`,
        params: { name_pattern: skill },
      };

      try {
        const { data } = await axios.request<TTechnologyResponse>(options);
        if (data && data.length > 0) {
          const newSlugs = data.map((tech) => tech.slug);
          slugs.push(...newSlugs);
          this.logger.debug(`Found slugs for ${skill}: ${newSlugs.join(', ')}`);
        } else {
          this.logger.warn(`No technology slug found for skill: ${skill}`);
        }
      } catch (error) {
        this.logger.error(
          `Error fetching technology slug for ${skill}: ${error.message}`,
          error.stack,
        );
      }
    }

    return slugs;
  }
}
