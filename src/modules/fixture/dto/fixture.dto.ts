import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import { GetTeamResponseDto } from '../../../modules/team/dto/team.dto';
import { GetTournamentResponseDto } from '../../../modules/tournament/dto/tournament.dto';
import { EFixtureStatus } from '../../../shared';
import { PaginationInputDto } from '../../../shared/pagination/paginatio-input.dto';

export class CreateFixtureInputDto {
  @ApiProperty({
    type: String,
    required: true,
    description: 'Home Team Uuid',
    example: '1',
  })
  @IsString()
  @IsNotEmpty()
  homeTeamUuid: string;

  @ApiProperty({
    type: String,
    required: true,
    description: 'Away Team Uuid',
    example: '2',
  })
  @IsString()
  @IsNotEmpty()
  awayTeamUuid: string;

  @ApiProperty({
    type: String,
    required: true,
    description: 'Tournament Uuid',
    example: '3',
  })
  @IsString()
  @IsNotEmpty()
  tournamentUuid: string;

  @ApiProperty({
    type: Date,
    required: true,
    description: 'Start Match',
    example: '2023-01-13T09:30:00.000Z',
  })
  @IsDateString()
  @IsNotEmpty()
  startDate: Date;

  @ApiProperty({
    type: Date,
    required: true,
    description: 'Start Match',
    example: '2023-01-13T12:00:00.000Z',
  })
  @IsDateString()
  @IsOptional()
  endDate: Date;

  @ApiProperty({
    type: Number,
    required: false,
    description: 'home score',
    example: 1,
  })
  @IsNumber()
  @IsOptional()
  homeScore: number;

  @ApiProperty({
    type: Number,
    required: false,
    description: 'away score',
    example: 0,
  })
  @IsNumber()
  @IsOptional()
  awayScore: number;

  @ApiProperty({
    type: 'enum',
    enum: EFixtureStatus,
    default: EFixtureStatus.FUTURE,
  })
  @IsEnum(EFixtureStatus)
  @IsOptional()
  status: EFixtureStatus;
}

export class GetFixtureResponseDto {
  @ApiProperty({
    type: String,
    required: true,
    description: '',
    example: '1',
  })
  uuid: string;

  @ApiProperty({
    type: GetTeamResponseDto,
    required: true,
    description: 'homeTeam',
    example: '',
  })
  homeTeam: GetTeamResponseDto;

  @ApiProperty({
    type: GetTeamResponseDto,
    required: true,
    description: 'homeTeam',
    example: '',
  })
  awayTeam: GetTeamResponseDto;

  @ApiProperty({
    type: GetTournamentResponseDto,
    required: true,
    description: 'tournament',
    example: '',
  })
  tournament: GetTournamentResponseDto;

  @ApiProperty({
    type: Date,
    required: false,
    description: 'start date',
    example: '',
  })
  startDate: Date;

  @ApiProperty({
    type: Date,
    required: false,
    description: 'end date',
    example: '',
  })
  endDate: Date;

  @ApiProperty({
    type: String,
    required: false,
    description: 'home score',
    example: 1,
  })
  homeScore: number;

  @ApiProperty({
    type: String,
    required: false,
    description: 'away score',
    example: 0,
  })
  awayScore: number;

  @ApiProperty({
    type: 'enum',
    enum: EFixtureStatus,
    default: EFixtureStatus.FUTURE,
  })
  status: EFixtureStatus;
}

export class UpdateFixtureInputDto {
  @ApiProperty({
    type: String,
    required: true,
    description: 'Home Team Uuid',
    example: '1',
  })
  @IsString()
  @IsOptional()
  homeTeamUuid?: string;

  @ApiProperty({
    type: String,
    required: true,
    description: 'Away Team Uuid',
    example: '2',
  })
  @IsString()
  @IsOptional()
  awayTeamUuid?: string;

  @ApiProperty({
    type: String,
    required: true,
    description: 'Season Uuid',
    example: '3',
  })
  @IsString()
  @IsOptional()
  tournamentUuid?: string;

  @ApiProperty({
    type: Date,
    required: true,
    description: 'Start Match',
    example: '2023-01-13T09:30:00.000Z',
  })
  @IsDateString()
  @IsOptional()
  startDate?: Date;

  @ApiProperty({
    type: Date,
    required: true,
    description: 'Start Match',
    example: '2023-01-13T12:00:00.000Z',
  })
  @IsDateString()
  @IsOptional()
  endDate?: Date;

  @ApiProperty({
    type: Number,
    required: false,
    description: 'home score',
    example: 1,
  })
  @IsNumber()
  @IsOptional()
  homeScore?: number;

  @ApiProperty({
    type: Number,
    required: false,
    description: 'away score',
    example: 0,
  })
  @IsNumber()
  @IsOptional()
  awayScore?: number;

  @ApiProperty({
    type: 'enum',
    enum: EFixtureStatus,
    default: EFixtureStatus.LIVE,
  })
  @IsEnum(EFixtureStatus)
  @IsOptional()
  status?: EFixtureStatus;
}
export class GetFixturesInputDto extends PaginationInputDto {
  @ApiProperty({
    type: String,
    required: false,
    description: 'tournamentUuid',
    example: '1',
  })
  @IsString()
  @IsOptional()
  tournamentUuid?: string;

  @ApiProperty({
    type: String,
    required: false,
    description: 'date',
    example: '2023-01-13',
  })
  @Matches(/^\d{4}(-)(((0)[0-9])|((1)[0-2]))(-)([0-2][0-9]|(3)[0-1])$/i, {
    message: '$property must be formatted as yyyy-mm-dd',
  })
  @IsOptional()
  fromDate?: string;

  @ApiProperty({
    type: String,
    required: false,
    description: 'date',
    example: '2023-01-31',
  })
  @Matches(/^\d{4}(-)(((0)[0-9])|((1)[0-2]))(-)([0-2][0-9]|(3)[0-1])$/i, {
    message: '$property must be formatted as yyyy-mm-dd',
  })
  @IsOptional()
  toDate?: string;
}
export class GetFixturesCalendarInputDto {
  @ApiProperty({
    type: String,
    required: false,
    description: 'date',
    example: '2023-01-13',
  })
  @Matches(/^\d{4}(-)(((0)[0-9])|((1)[0-2]))(-)([0-2][0-9]|(3)[0-1])$/i, {
    message: '$property must be formatted as yyyy-mm-dd',
  })
  @IsOptional()
  fromDate: string;

  @ApiProperty({
    type: String,
    required: false,
    description: 'date',
    example: '2023-01-31',
  })
  @Matches(/^\d{4}(-)(((0)[0-9])|((1)[0-2]))(-)([0-2][0-9]|(3)[0-1])$/i, {
    message: '$property must be formatted as yyyy-mm-dd',
  })
  @IsOptional()
  toDate: string;
}
