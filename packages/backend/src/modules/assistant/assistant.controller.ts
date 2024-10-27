import { Controller, Post, Body } from '@nestjs/common';
import { AssistantService } from './assistant.service';
import { TResume } from '@redundant/common';

@Controller('assistant')
export class AssistantController {
  constructor(private readonly assistantService: AssistantService) {}

  @Post('modify-resume')
  async modifyResume(
    @Body() body: { resumeId: string; input: string },
  ): Promise<TResume> {
    const { resumeId, input } = body;
    const modifiedResume =
      await this.assistantService.getAssistantModifications({
        resumeId,
        input,
      });
    return modifiedResume;
  }
}
