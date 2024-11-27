import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Medicine } from './entities/medicine.entity';

@Injectable()
export class MedicineService {
  constructor(
    @InjectRepository(Medicine)
    private readonly medicineRepository: Repository<Medicine>,
  ) {}

  // 약 정보
  async getAllMedicines(): Promise<Medicine[]> {
    const allMedicine = await this.medicineRepository.find();

    return allMedicine;
  }

  // 약 상세 정보
  async getMedicineById(id: number): Promise<Medicine> {
    const medicine = await this.medicineRepository.findOne({
      where: { id },
    });

    return medicine;
  }

  // 약 정보 등록
  async addMedicine(medicineData: Partial<Medicine>): Promise<void> {
    const medicine = this.medicineRepository.create(medicineData);
    this.medicineRepository.save(medicine);
  }

  // 약 정보 삭제
  async deleteMedicine(id: number): Promise<Medicine> {
    const medicine = await this.medicineRepository.findOne({
      where: { id },
    });
    this.medicineRepository.remove(medicine);

    return medicine;
  }
}
