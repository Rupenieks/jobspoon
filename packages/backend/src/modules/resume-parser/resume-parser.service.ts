import { Injectable } from '@nestjs/common';
import { AssistantService } from '../assistant/assistant.service';
import * as pdf from 'pdf-parse';
import { TResume } from '@redundant/common';

@Injectable()
export class ResumeParserService {
  constructor(private readonly assistantService: AssistantService) {}

  async parseResume(buffer: Buffer): Promise<TResume> {
    const text = await this.parsePdfToText(buffer);
    return this.assistantService.parseResume(text);
  }

  private async parsePdfToText(buffer: Buffer): Promise<string> {
    const data = await pdf(buffer);
    return data.text;
  }
}
