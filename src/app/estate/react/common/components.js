'use strict';

import GuidePage from './guide/guide';
import LoginPage from './login/login';
import MainPage from './business/home/main';
import TestPage from './business/home/test';
import BaseStorage from './base/store+base';
import ChoosePage from './business/navigation/chooseHome';
import HomePage from './business/home/home/home';
import MinePage from './business/home/me/me';
import MessagePage from './business/home/message/message';
import SubscribePage from './business/home/subscriptions/subscribe';
import TenantPage from './business/navigation/tenant/tenantSimpleList';
import ProjectPage from './business/navigation/project/projectList';
import QualityMainPage from './business/quality/qualityMain';
import WebPage from './business/home/new/webView';
var GlodonRN = {
    GuidePage,
    LoginPage,
    MainPage,
    TestPage,
    BaseStorage,
    ChoosePage,
    HomePage,
    MinePage,
    MessagePage,
    SubscribePage,
    TenantPage,
    ProjectPage,
    QualityMainPage,
    WebPage,
};

module.exports = GlodonRN;