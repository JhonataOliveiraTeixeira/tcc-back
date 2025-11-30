import { Injectable } from "@nestjs/common";
import { Annex } from "./value-objects/annex";
import { CertificateId, UserId } from "./value-objects/id";

export type Status = "PENDING" | "CONFIRMED" | "REJECTED" | "AI_CONFIRMED";

@Injectable()
export class Certificate {
  private constructor(
    public readonly id: CertificateId,
    public  ownerId: UserId,
    private _hours: number,
    private _title: string,
    private _annex: Annex,
    private _status: Status,
    public readonly submittedAt: Date
  ) { }

  static submit(params: {
    ownerId: UserId; title: string; annex: Annex; hours: number
  }) {
    if (!params.title || params.title.length < 3) {
      throw new Error("Título muito curto");
    }
    return new Certificate(
      CertificateId.new(),
      params.ownerId,
      params.hours,
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
    hours: number
    annex: Annex;
    status: Status;
    submittedAt: Date;
  }) {
    return new Certificate(
      CertificateId.from(params.id),
      UserId.from(params.ownerId),
      params.hours,
      params.title,
      params.annex,
      params.status,
      params.submittedAt
    );
  }

  hours() { return this._hours; }
  title() { return this._title; }
  annex() { return this._annex; }
  status() { return this._status; }
}
