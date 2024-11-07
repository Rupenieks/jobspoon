import { Controller, Post, Body } from '@nestjs/common';
import { AssistantService } from './assistant.service';
import { TResumeBase } from '@redundant/common';

@Controller('assistant')
export class AssistantController {
  constructor(private readonly assistantService: AssistantService) {}

  @Post('modify-resume')
  async modifyResume(
    @Body() body: { resumeId: string; input: string; includeJobDescription: boolean },
  ): Promise<TResumeBase> {
    const { resumeId, input, includeJobDescription } = body;
    const modifiedResume =
      await this.assistantService.getAssistantModifications({
        resumeId,
        input,
        includeJobDescription,
      });
    return modifiedResume;
  }
}
