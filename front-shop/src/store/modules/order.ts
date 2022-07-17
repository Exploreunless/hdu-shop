import { defineStore } from 'pinia';
import { store } from '@/store';
import storage from 'good-storage';
import { Toast, Dialog } from 'vant';
import { router } from '@/router';
import API_ORDER from '@/apis/order';

export interface ITradeGoodItem {
	orderId: number,
	orderSn: string,
	productAttr: string,
	productBrand: string,
	productCount: number,
	productId: number,
	productName: string,
	productPic: string,
	productPrice: number,
	productRealPrice: number,
}

export interface AppStore {
  tradeGoods: NonNullable<ITradeGoodItem>;
}

export const useOrderStore = defineStore({
    id: 'order',
    state: () => ({
      tradeGoods: storage.get('tradeGoods', {}),
    }),
    getters: {
      getTradeGoods: (state): ITradeGoodItem => state.tradeGoods,
    },
    actions: {
      /**
       * 下单结算商品信息汇总
       */
      async setTradeGoods(payload: Recordable = {}) {
        const { orderInfo={}, goodInfo={}} = payload;
  
        const tradeGoods: ITradeGoodItem = {
          orderId: orderInfo.id,
          orderSn:  orderInfo.orderSn,
          productAttr: goodInfo.productAttr,
          productBrand: goodInfo.productBrand,
          productCount: goodInfo.productQuantity,
          productId: goodInfo.productId,
          productName: goodInfo.productName,
          productPic: goodInfo.productPic,
          productPrice: goodInfo.productPrice,
          productRealPrice: goodInfo.productPrice,
        }
        this.tradeGoods = tradeGoods;
        storage.set('tradeGoods', tradeGoods);
  
        router.push('/refund/apply');
      },

      
      /**
       * 删除订单
       * @description 只有已关闭、待支付、待评价、已评价的订单才可以删除
       */
      async deleteOrder(payload: Recordable = {}) {
        const { orderId } = payload;
  
        await Dialog.confirm({
          title: '确定删除订单？',
          message: '删除订单后无法恢复，无法处理您的售后问题，请慎重考虑。',
          cancelButtonText: '在考虑下',
          confirmButtonText: '删除',
        });
  
        Toast.loading({
          forbidClick: true,
          message: '加载中...',
          duration: 0,
        });
  
        await API_ORDER.orderDelete({ orderId });
      },
      /**
       * 关闭订单
       * @description 待付款的订单可以关闭
       */
      async closeOrder(payload: Recordable = {}) {
        const { orderId } = payload;
  
        await Dialog.confirm({
          title: '确定取消订单？',
          message: '订单还未付款,确定要取消吗？',
          cancelButtonText: '在考虑下',
          confirmButtonText: '取消订单',
        });
  
        Toast.loading({
          forbidClick: true,
          message: '加载中...',
          duration: 0,
        });
  
        await API_ORDER.orderCancel({ orderId });
      },
    },
  });

  export function useOrderStoreWithOut() {
    return useOrderStore(store);
  }
  