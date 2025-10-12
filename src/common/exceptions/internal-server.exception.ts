import { HttpStatus } from "@nestjs/common";
import { AppException } from "./app-exception";

export class internalServerException extends AppException {
  constructor(message: string) {
    super(message, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}