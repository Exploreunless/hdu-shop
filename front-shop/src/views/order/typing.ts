export interface typeGoodItem{
  id: number,
  productId: number,
  productPic: string,
  productName: string,
  productBrand: string,
  productPrice: number,
  productQuantity: number,
  productAttr: string,
  [key: string]: any
}

export interface typeOrderItem {
  id?: number,
  orderSn?: string,
  createTime?: string,
  totalAmount?: number,
  payAmount?: number,
  freightAmount?: number,
  promotionAmount?: number,
  integrationAmount?: number,
  couponAmount?: number,
  discountAmount?: number,
  status?: number,
  growth?: number,
  promotionInfo?: string | null,

  payType?: number,
  orderType?: number,

  receiverName?: string,
  receiverPhone?: string,
  receiverPostCode?: string,
  receiverProvince?: string,
  receiverCity?: string,
  receiverRegion?: string,
  receiverDetailAddress?: string,

  deliveryCompany?: string,
  deliverySn?: string,

  note?: string | null,
  
  orderItemList?: Array<typeGoodItem>;

  [key: string]: any
}
  