import { Injectable } from "@nestjs/common";
import { Annex } from "./value-objects/annex";
import { CertificateId, UserId } from "./value-objects/id";

type Status = "PENDING" | "CONFIRMED" | "REJECTED";

@Injectable()
export class Certificate {
  private constructor(
    public readonly id: CertificateId,
    public  ownerId: UserId,
    private _title: string,
    private _annex: Annex,
    private _status: Status,
    public readonly submittedAt: Date
  ) { }

  static submit(params: {
    ownerId: UserId; title: string; annex: Annex;
  }) {
    if (!params.title || params.title.length < 3) {
      throw new Error("Título muito curto");
    }
    return new Certificate(
      CertificateId.new(),
      params.ownerId,
      params.title.trim(),
      params.annex,
      "PENDING",
      new Date()
    );
  }

  confirm() {
    if (this._status !== "PENDING") throw new Error("Estado inválido");
    this._status = "CONFIRMED";
  }

  reject() {
    if (this._status !== "PENDING") throw new Error("Estado inválido");
    this._status = "REJECTED";
  }

  static fromPDataBase(params: {
    id: string;
    ownerId: string;
    title: string;
    annex: Annex;
    status: Status;
    submittedAt: Date;
  }) {
    return new Certificate(
      CertificateId.from(params.id),
      UserId.from(params.ownerId),
      params.title,
      params.annex,
      params.status,
      params.submittedAt
    );
  }

  title() { return this._title; }
  annex() { return this._annex; }
  status() { return this._status; }
}
