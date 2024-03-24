declare namespace Express {
  interface Request {
    idUser: string;
    roleUser: string;
  }
}

// custom-request.interface.ts
// import { Request } from '@nestjs/common';

// export interface Request extends Request {
//   idUser: string; // Your custom property
//   roleUser: string;
  // Add more custom properties if needed
// }