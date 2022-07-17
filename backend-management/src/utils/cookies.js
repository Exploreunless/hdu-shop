import * as Cookies from 'js-cookie'

const Keys = {
    tokenKey: 'tokenKey'
}

export const getToken = () => Cookies.get(Keys.tokenKey)
export const setToken = (token) => Cookies.set(Keys.tokenKey, token)
export const removeToken = () => Cookies.remove(Keys.tokenKey)