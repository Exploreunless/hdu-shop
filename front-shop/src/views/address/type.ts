export interface typeAddress{
  "city": string,
  "defaultStatus": number,
  "detailAddress": string,
  "id": number,
  "memberId": number,
  "name": string,
  "phoneNumber": string,
  "postCode": string,
  "province": string,
  "region": string,
  [key: string]: any 
}

export interface typeAddressPreview{
  'id'?: number,
  'name'?: string,
  'tel'?: string,
  'isDefault'?: boolean,
  'address'?: string
  [key: string]: any 
}

