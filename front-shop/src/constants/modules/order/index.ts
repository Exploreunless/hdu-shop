export function formatPayType(value: number) {
  if (value === 1) {
    return '支付宝';
  } else if (value === 2) {
    return '微信';
  } else {
    return '未支付';
  }
}

export function formatOrderType(value: number) {
  if (value === 1) {
    return '秒杀订单';
  } else {
    return '正常订单';
  }
}

export const statusOptions = [
  {
    label: '待付款',
    value: 0
  },
  {
    label: '待发货',
    value: 1
  },
  {
    label: '已发货',
    value: 2
  },
  {
    label: '已完成',
    value: 3
  },
  {
    label: '已关闭',
    value: 4
  }
];

/**
 * 售后服务标题
 * @param {*} data
 */
 export function getAfterSaleTitle(data: string) {
  const start = '收货后结算';
  const separator = ' · ';

  if (data.length) {
    if (data.includes('1') || (data.includes('0') && data.includes('2'))) {
      return `${start}${separator}支持退款退货`;
    }

    if (data.includes('0')) {
      return `${start}${separator}支持退款`;
    }

    if (data.includes('2')) {
      return `${start}${separator}支持退货`;
    }
  } else {
    return `${start}${separator}不支持售后退换服务`;
  }

  return '';
}

/**
 * 售后服务
 */
 export const afterSale = {
  1: {
    value: 1,
    label: '仅退款',
  },
  2: {
    value: 2,
    label: '退款退货',
  },
  3: {
    value: 3,
    label: '退货',
  },
};