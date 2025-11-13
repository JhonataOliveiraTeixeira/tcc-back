export interface CertificatesWithAnnexAndOwner{
  annex: {
    contentType: string;
    publicUrl: string | null;
  } | null;
  owner: {
    name: string;
  };
  id: string;
  createdAt: Date;
  updatedAt: Date;
  title: string;
  status: string;
  submittedAt: Date;
  ownerId: string;
  annexId: string | null;
}

export class CertificateMapper{
  static toDomain(params: any): CertificatesWithAnnexAndOwner {
    return {
      id: params.id,
      ownerId: params.ownerId,
      title: params.title,
      status: params.status,
      submittedAt: params.submittedAt,
      owner:{
        name: params.owner.name
      },
      annexId: params.annexId,
      annex:{
        contentType: params.annex.contentType,
        publicUrl: params.annex.publicUrl
      },
      createdAt: params.createdAt,
      updatedAt: params.updatedAt
    };
  }

  static toPrisma(params: any): any{
    return {
      id: params.id,
      ownerId: params.ownerId,
      title: params.title,
      annex: params.annex,
      status: params.status,
      submittedAt: params.submittedAt,
    };
  }


  static toArrayDomain(arrayParams: Array<CertificatesWithAnnexAndOwner>): Array<CertificatesWithAnnexAndOwner>{
    return arrayParams.map((props)=>CertificateMapper.toDomain(props));
  }
}