import React from 'react';
import { StackNavigator } from 'react-navigation'; // 1.0.0-beta.27
import TenantList from './tenant/tenantSimpleList'
import ProjectList from './project/projectList'
const RootStack = StackNavigator(
    {
      TenantList: {
        screen:TenantList,
        title:"租户列表"
      },
      ProjectList: {
        screen:ProjectList,
        title:"项目列表"
      },
    },
    {
      initialRouteName: 'TenantList',
      headerMode:"none",
    }
  );
  export default class extends React.Component {
    static navigationOptions = {
      title: '选择',
      tabBarVisible:false,
      headerTintColor:"#FFF",
      headerStyle:{backgroundColor:"#00baf3"},
  }
  componentDidMount = () => {
    storage.homeNavigation = this.props.navigation;
  }
    render() {
      return <RootStack />;
    }
  };