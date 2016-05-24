import { configure } from '@kadira/storybook';
import '../src/styles/style.scss'

function loadStories() {
  require('../src/components/__stories__/');

}

configure(loadStories, module);
