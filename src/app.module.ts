import { Module } from '@nestjs/common';
import { FormsModule } from './forms/forms.module';

@Module({
  imports: [FormsModule],
})
export class AppModule {}


