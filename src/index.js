import RenderDom from '~/entry';

RenderDom(require.context('~/pages/home/', true, /\.js$/));
