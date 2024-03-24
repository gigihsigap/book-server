import { BadRequestException, ForbiddenException, InternalServerErrorException, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';

export const errorHandler = (error: any, logger: Logger): any => {
  logger.error(error);
  console.log(error)
  if (error.type === "Not Found") throw new NotFoundException(error.detail);
  if (error.code === '23503') throw new BadRequestException(error.detail);
  if (error.code === '23505') throw new BadRequestException(error.detail);
  if (error.code === '23502') throw new BadRequestException(error.detail);
  if (error.code === '22P02') throw new BadRequestException(error.detail);
  if (error.code === '23514') throw new BadRequestException(error.detail);
  if (error.code === '42601') throw new BadRequestException("Attribute invalid.");
  if (error.status === 404) throw new NotFoundException(error.response);
  if (error.status === 403) throw new ForbiddenException(error.response);
  if (error.status === 401) throw new UnauthorizedException(error.response);
  if (error.status === 400) throw new BadRequestException(error.response);
  throw new InternalServerErrorException('Internal Server Error');
};
