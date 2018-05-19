/**
 * Created by wanghuan on 2016/7/21.
 */
import common from './common.js'
import checkoutState from './checkoutState.js'

const debug = process.env.NODE_ENV !== 'production'

Vue.config.debug = debug;

export default new Vuex.Store({
  modules: {
      common
      ,checkoutState
  },
  strict: debug,
})
