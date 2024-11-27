import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { MedicineService } from './medicine.service';
import { CreateMedicineDto } from './dto/create-medicine.dto';

@Controller('medicine')
export class MedicineController {
  constructor(private readonly medicineService: MedicineService) {}

  // 약 정보
  @Get()
  async getAllMedicines() {
    const allMedicineData = await this.medicineService.getAllMedicines();

    return {
      status: HttpStatus.OK,
      message: '약 정보 불러오기 성공',
      data: allMedicineData,
    };
  }

  // 약 상세 정보
  @Get(':id')
  async getMedicineById(@Param('id') id: number) {
    const medicineData = await this.medicineService.getMedicineById(id);

    return {
      status: HttpStatus.OK,
      message: '약 상세 정보 불러오기 성공',
      data: medicineData,
    };
  }

  // 약 정보 추가
  @Post()
  async addMedicine(@Body() createMedicineDto: CreateMedicineDto) {
    await this.medicineService.addMedicine(createMedicineDto);

    return {
      status: HttpStatus.CREATED,
      message: '약 정보 등록 성공',
    };
  }

  @Delete(':id')
  async deleteMedicine(@Param('id') id: number) {
    const result = await this.medicineService.deleteMedicine(id);

    if (result) {
      return {
        status: HttpStatus.OK,
        message: '약 정보 삭제 성공',
      };
    } else {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          message: '약 정보 삭제 실패',
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
