// import { stringify } from 'qs';
import request from '@/utils/request';

export async function fakeAccountLogin(params) {
  return request('/studio/nifi-api/access/token', {
    method: 'POST',
    requestType: 'form',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'text/plain',
    },
    data: params,
  });
}
export async function accessOidc() {
  return request('/studio/nifi-api/access/oidc/exchange', {
    method: 'POST',
  });
}
// 刷新token

export async function refreshToken() {
  return request('/studio/nifi-api/access/oidc/refreshToken', {
    method: 'GET',
  });
}
// license过期提醒
export async function licenseWarn() {
  return request('/studio/orchsym-api/lic', {
    method: 'GET',
  });
}

// 复制 运行 创建模板前所需接口
export async function createSnippets(params) {
  return request('/studio/nifi-api/snippets', {
    method: 'POST',
    data: params,
  });
}
