import RenderDom from '~/entry';

RenderDom(require.context('~/pages/classic/', true, /\.js$/));
