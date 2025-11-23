import { Module } from '@nestjs/common';
import { CodeController } from './code.controller';
import { CodeService } from './code.service';
import { TaskModule } from '../../task/task.module';
import { DockerSandboxService } from './services/docker-sandbox.service';
import { AssignmentModule } from '../../assignment/assignment.module';

@Module({
  imports: [TaskModule, AssignmentModule],
  controllers: [CodeController],
  providers: [CodeService, DockerSandboxService],
})
export class CodeModule {}
