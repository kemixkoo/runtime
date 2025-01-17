// import { message } from 'antd';
import {
  queryControllerServices,
  queryDetailServices, queryUpdateServices,
  queryMEnableServices, queryMDisableServices, queryStateServices,
  queryDeleteServices, queryMDeleteServices,
  queryCopeServices, queryMoveServices, queryMCopeServices, queryMMoveeServices,
  queryServiceTypes, queryAddServices, querySingleService, queryUpdateServiceConfig,
} from '@/services/controllerServices';

export default {
  namespace: 'controllerServices',

  state: {
    controllerServicesList: [],
    detailServices: {},
    serviceTypes: [],
    configService: {},
  },

  effects: {
    *fetchControllerServices({ payload, cb }, { call, put }) {
      const response = yield call(queryControllerServices, payload);
      yield put({
        type: 'appendValue',
        payload: {
          controllerServicesList: response,
        },
      });
      yield cb && cb()
    },

    // 重命名  配置
    *fetchDetailServices({ payload, cb }, { call, put }) {
      const response = yield call(queryDetailServices, payload);
      yield put({
        type: 'appendValue',
        payload: {
          detailServices: response,
        },
      });
      yield cb && cb(response)
    },

    *fetchUpdateServices({ payload, cb }, { call, put }) {
      console.log(payload)
      yield call(queryUpdateServices, payload);
      yield cb && cb()
    },

    // 起停
    *fetchStateUpdateServices({ payload, cb }, { call, put }) {
      if (payload.type === 'multiple') {
        if (payload.state === 'enable') {
          yield call(queryMEnableServices, payload.serviceIds);
        } else {
          yield call(queryMDisableServices, payload.serviceIds);
        }
      } else {
        yield call(queryStateServices, payload.value);
      }
      yield cb && cb();
    },
    // 删除
    *fetchDeleteServices({ payload, cb }, { call, put }) {
      if (payload.type === 'multiple') {
        yield call(queryMDeleteServices, payload.serviceIds);
      } else {
        yield call(queryDeleteServices, payload.id);
      }
      yield cb && cb();
    },
    // 复制移动
    *fetchCopeServices({ payload, cb }, { call, put }) {
      if (payload.id) {
        if (payload.state === 'COPE') {
          yield call(queryCopeServices, payload);
        } else {
          yield call(queryMoveServices, payload);
        }
      } else if (payload.state === 'COPE') {
        yield call(queryMCopeServices, payload.values);
      } else {
        yield call(queryMMoveeServices, payload.values);
      }
      yield cb && cb();
    },
    // 新建
    *fetchAddServices({ payload, cb }, { call, put }) {
      yield call(queryAddServices, payload);
      yield cb && cb()
    },
    *fetchServiceTypes({ payload, cb }, { call, put }) {
      const response = yield call(queryServiceTypes);
      yield put({
        type: 'appendValue',
        payload: {
          serviceTypes: response.controllerServiceTypes,
        },
      });
    },
    // 配置
    *fetchUpdateServiceConfig({ payload, cb }, { call, put }) {
      yield call(queryUpdateServiceConfig, payload);
      yield cb && cb()
    },
    *fetchSingleService({ payload, cb }, { call, put }) {
      const response = yield call(querySingleService, payload);
      if (response) {
        yield put({
          type: 'appendValue',
          payload: {
            configService: response.component,
          },
        });
        yield cb && cb(response.component)
      }
    },
  },

  reducers: {
    appendValue(state, action) {
      return {
        ...state,
        ...action.payload,
      }
    },
  },
};
