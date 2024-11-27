import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('medicine') // 데이터베이스 테이블 이름
export class Medicine {
  @PrimaryGeneratedColumn()
  id: number; // 약 ID

  @Column()
  name: string; // 약 이름

  @Column()
  usage: string; // 사용 용도

  @Column()
  efficacy: string; // 효능 효과

  @Column()
  dosage: string; // 복용 방법

  @Column()
  precautions: string; // 주의사항
}
