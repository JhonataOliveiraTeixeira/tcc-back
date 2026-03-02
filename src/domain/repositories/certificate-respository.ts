import type { Certificate } from "../certificate";
import type { CertificateId } from "../value-objects/id";


export interface CertificateRepository {
  save(cert: Certificate): Promise<void>;
  findById(id: CertificateId): Promise<Certificate | null>;
  update(cert: Certificate): Promise<void>;
}
