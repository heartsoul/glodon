/**
 * 描述：存储用户信息
 * 作者：soul      时间：2018/03/01
 * 版权：广联达
 * 
 */

const initState = {
    showModal: false,
    dictionary: {},
  };
  export default {
    namespace: 'loginUserManager',
    state: {
      ...initState,
    },
  };