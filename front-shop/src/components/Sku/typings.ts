export interface Sku {
    id: number;
    price: number;
    stock: number;
    pic: number | null;
    spData: string;
    skuCode: string;
    lowStock: number | null;
    promotionPrice: number;
    sale: string | null;
    lockStock: number | null;
  }
export interface KeyValue{
  key: string,
  value: string
}
export type ISku = Array<Sku>
  
export interface GoodInfo{
  id: number,
  name: string | null,
  pic: string | null,
  price: number | null,
  unit: string | null,
  [key: string]: any
}
  export interface IInitialSku {
    selectedNum?: number;
    selectedAttr: Recordable;
  }
  
  export interface ISelectedPropItem {
    id: number;
    name: string;
    childId: number;
    childName: string;
    propIds: string;
  }
  
  export interface ISelectedSkuComb {
    price: number;
    pic: string | null;
    stock: number;
  }
  