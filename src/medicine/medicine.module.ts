import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Medicine } from './entities/medicine.entity';
import { MedicineService } from './medicine.service';
import { MedicineController } from './medicine.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Medicine])], // Medicine 엔티티 연결
  controllers: [MedicineController],
  providers: [MedicineService],
})
export class MedicineModule {}
