import { Module } from '@nestjs/common';
import { CodeController } from './code.controller';
import { CodeService } from './code.service';
import { TaskModule } from '../../task/task.module';
import { DockerSandboxService } from './services/docker-sandbox.service';
import { AssignmentModule } from '../../assignment/assignment.module';
import { ScriptBuilderService } from './services/script-builder.service';

@Module({
  imports: [TaskModule, AssignmentModule],
  controllers: [CodeController],
  providers: [CodeService, DockerSandboxService, ScriptBuilderService],
})
export class CodeModule {}
