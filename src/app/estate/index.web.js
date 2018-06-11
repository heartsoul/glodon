import 'babel-polyfill';
import React from 'react';
import {render} from 'react-dom';
import {TopView} from './src/node_modules/app-3rd/teaset'
import App from './src/pages/index/index';
render(<TopView><App /></TopView>, document.getElementById('root'));